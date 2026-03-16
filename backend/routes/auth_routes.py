# ==========================================
# PetPooja Backend - Auth Routes
# ==========================================

import os
from datetime import timedelta

from fastapi import APIRouter, HTTPException, Request, Response, Depends, status

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    get_current_user,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from database import get_db_pool
from redis_client import (
    check_rate_limit,
    reset_rate_limit,
    blocklist_token,
    is_token_blocklisted,
)
from schemas import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    MessageResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Cookie config
COOKIE_NAME = "petpooja_refresh_token"
COOKIE_MAX_AGE = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # seconds
IS_PROD = os.getenv("ENVIRONMENT", "development") == "production"


def _set_refresh_cookie(response: Response, token: str):
    """Set the refresh token as an HTTPOnly secure cookie."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=IS_PROD,          # True in production (HTTPS)
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        path="/api/auth",        # Only sent to auth endpoints
    )


def _clear_refresh_cookie(response: Response):
    """Delete the refresh token cookie."""
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=IS_PROD,
        samesite="lax",
        path="/api/auth",
    )


# ==========================================
# POST /api/auth/signup
# ==========================================
@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, response: Response):
    pool = await get_db_pool()

    # Check if email already exists
    existing = await pool.fetchrow("SELECT id FROM users WHERE email = $1", body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Hash the password
    hashed = hash_password(body.password)

    # Transaction: create restaurant → user
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 1. Create restaurant
            restaurant = await conn.fetchrow(
                """
                INSERT INTO restaurants (name, owner_name, email, phone, gstin, address)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                """,
                body.restaurant_name,
                body.owner_name,
                body.email,
                body.phone,
                body.gstin,
                body.address,
            )
            restaurant_id = str(restaurant["id"])

            # 2. Create user
            user = await conn.fetchrow(
                """
                INSERT INTO users (email, password_hash, full_name, role, restaurant_id)
                VALUES ($1, $2, $3, $4, $5::uuid)
                RETURNING id, email, full_name, role, restaurant_id
                """,
                body.email,
                hashed,
                body.owner_name,
                "owner",
                restaurant_id,
            )

            # 3. Create profile
            await conn.execute(
                """
                INSERT INTO profiles (id, restaurant_id, full_name, phone, role)
                VALUES ($1, $2::uuid, $3, $4, $5)
                """,
                user["id"],
                restaurant_id,
                body.owner_name,
                body.phone,
                "owner",
            )

            # 4. Seed 8 default tables
            for i in range(1, 9):
                capacity = 2 if i <= 2 else (6 if i >= 6 else 4)
                await conn.execute(
                    """
                    INSERT INTO tables (restaurant_id, table_number, capacity, status, current_amount)
                    VALUES ($1::uuid, $2, $3, 'available', 0)
                    """,
                    restaurant_id,
                    i,
                    capacity,
                )

    user_id = str(user["id"])
    r_id = str(user["restaurant_id"])

    # Create tokens
    access_token = create_access_token(user_id, body.email, "owner", r_id, body.owner_name)
    refresh_token, _ = create_refresh_token(user_id)

    _set_refresh_cookie(response, refresh_token)

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=body.email,
            role="owner",
            restaurant_id=r_id,
            full_name=body.owner_name,
        ),
    )


# ==========================================
# POST /api/auth/login
# ==========================================
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, request: Request, response: Response):
    # Rate limiting by IP
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"login:{client_ip}"

    is_allowed, remaining = await check_rate_limit(rate_key, max_attempts=5, window_seconds=300)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again in 5 minutes.",
        )

    pool = await get_db_pool()

    # Look up user
    user = await pool.fetchrow(
        """
        SELECT id, email, password_hash, full_name, role, restaurant_id, is_active
        FROM users
        WHERE email = $1
        """,
        body.email,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    # Verify password
    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Reset rate limit on successful login
    await reset_rate_limit(rate_key)

    user_id = str(user["id"])
    restaurant_id = str(user["restaurant_id"])
    role = user["role"]
    full_name = user["full_name"] or ""

    # Create tokens
    access_token = create_access_token(user_id, body.email, role, restaurant_id, full_name)
    refresh_token, _ = create_refresh_token(user_id)

    _set_refresh_cookie(response, refresh_token)

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=body.email,
            role=role,
            restaurant_id=restaurant_id,
            full_name=full_name,
        ),
    )


# ==========================================
# POST /api/auth/refresh
# ==========================================
@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: Request, response: Response):
    # Read refresh token from HTTPOnly cookie
    refresh_token = request.cookies.get(COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token found.",
        )

    # Verify token
    payload = verify_token(refresh_token, expected_type="refresh")
    jti = payload.get("jti")

    # Check blocklist
    if jti and await is_token_blocklisted(jti):
        _clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked.",
        )

    user_id = payload["sub"]

    # Fetch user from DB to get current data
    pool = await get_db_pool()
    import uuid as uuid_mod
    # user_id from JWT is a string, cast to UUID for asyncpg
    uid = uuid_mod.UUID(user_id) if isinstance(user_id, str) else user_id
    user = await pool.fetchrow(
        """
        SELECT id, email, full_name, role, restaurant_id, is_active
        FROM users WHERE id = $1
        """,
        uid,
    )

    if not user or not user["is_active"]:
        _clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated.",
        )

    u_id = str(user["id"])
    restaurant_id = str(user["restaurant_id"])
    email = user["email"]
    role = user["role"]
    full_name = user["full_name"] or ""

    # Blocklist the old refresh token
    if jti:
        await blocklist_token(jti, REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)

    # Issue new tokens (token rotation)
    new_access_token = create_access_token(u_id, email, role, restaurant_id, full_name)
    new_refresh_token, _ = create_refresh_token(u_id)

    _set_refresh_cookie(response, new_refresh_token)

    return TokenResponse(
        access_token=new_access_token,
        user=UserResponse(
            id=u_id,
            email=email,
            role=role,
            restaurant_id=restaurant_id,
            full_name=full_name,
        ),
    )


# ==========================================
# POST /api/auth/logout
# ==========================================
@router.post("/logout", response_model=MessageResponse)
async def logout(request: Request, response: Response):
    refresh_token = request.cookies.get(COOKIE_NAME)

    if refresh_token:
        try:
            payload = verify_token(refresh_token, expected_type="refresh")
            jti = payload.get("jti")
            if jti:
                await blocklist_token(jti, REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)
        except Exception:
            pass  # Token might already be expired, still clear cookie

    _clear_refresh_cookie(response)

    return MessageResponse(message="Logged out successfully.")


# ==========================================
# GET /api/auth/me
# ==========================================
@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

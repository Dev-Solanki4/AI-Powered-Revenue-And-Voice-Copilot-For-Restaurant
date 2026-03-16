# ==========================================
# PetPooja Backend - Redis Client
# Rate Limiting + Session Blocklist
# ==========================================

import os
import time
import redis.asyncio as redis
from dotenv import load_dotenv

load_dotenv()

_redis: redis.Redis | None = None


async def init_redis() -> redis.Redis:
    """Initialize Redis connection."""
    global _redis
    if _redis is not None:
        return _redis

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    _redis = redis.from_url(redis_url, decode_responses=True)

    # Test connection
    await _redis.ping()
    return _redis


async def get_redis() -> redis.Redis:
    """Get existing Redis connection."""
    if _redis is None:
        raise RuntimeError("Redis not initialized. Call init_redis() first.")
    return _redis


async def close_redis():
    """Close Redis connection."""
    global _redis
    if _redis:
        await _redis.close()
        _redis = None


# ==========================================
# Rate Limiter (Sliding Window)
# ==========================================

async def check_rate_limit(key: str, max_attempts: int = 5, window_seconds: int = 300) -> tuple[bool, int]:
    """
    Check if a key has exceeded the rate limit.
    Returns (is_allowed, remaining_attempts).
    Uses a sliding window counter.
    """
    r = await get_redis()
    rate_key = f"rate_limit:{key}"
    now = time.time()

    pipe = r.pipeline()
    # Remove old entries outside the window
    pipe.zremrangebyscore(rate_key, 0, now - window_seconds)
    # Add current attempt
    pipe.zadd(rate_key, {str(now): now})
    # Count attempts in window
    pipe.zcard(rate_key)
    # Set expiry on the key
    pipe.expire(rate_key, window_seconds)

    results = await pipe.execute()
    current_count = results[2]

    is_allowed = current_count <= max_attempts
    remaining = max(0, max_attempts - current_count)

    return is_allowed, remaining


async def reset_rate_limit(key: str):
    """Reset the rate limit for a key (e.g., after successful login)."""
    r = await get_redis()
    await r.delete(f"rate_limit:{key}")


# ==========================================
# Session Blocklist (for Refresh Token Revocation)
# ==========================================

async def blocklist_token(jti: str, expires_in_seconds: int):
    """Add a refresh token JTI to the blocklist."""
    r = await get_redis()
    await r.setex(f"blocklist:{jti}", expires_in_seconds, "revoked")


async def is_token_blocklisted(jti: str) -> bool:
    """Check if a refresh token JTI is blocklisted."""
    r = await get_redis()
    result = await r.get(f"blocklist:{jti}")
    return result is not None

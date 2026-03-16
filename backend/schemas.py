# ==========================================
# PetPooja Backend - Pydantic Schemas
# ==========================================

from pydantic import BaseModel, EmailStr, Field


# ==========================================
# Request Models
# ==========================================

class SignupRequest(BaseModel):
    restaurant_name: str = Field(..., min_length=1, max_length=255)
    owner_name: str = Field(..., min_length=1, max_length=255)
    gstin: str = Field(..., min_length=15, max_length=15)
    address: str = Field(..., min_length=1, max_length=500)
    phone: str = Field(..., min_length=10, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


# ==========================================
# Response Models
# ==========================================

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    restaurant_id: str
    full_name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    message: str

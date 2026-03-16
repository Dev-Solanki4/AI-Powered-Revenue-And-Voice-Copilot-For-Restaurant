# ==========================================
# PetPooja Backend - Customer Schemas
# ==========================================

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class CustomerBase(BaseModel):
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    loyalty_points: Optional[int] = 0

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    loyalty_points: Optional[int] = None

class CustomerResponse(CustomerBase):
    id: str
    restaurant_id: str
    created_at: datetime

    class Config:
        from_attributes = True

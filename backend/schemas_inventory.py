# ==========================================
# PetPooja Backend - Inventory Schemas
# ==========================================

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class InventoryItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    current_stock: float = 0
    min_stock: float = 0
    cost_per_unit: float = 0
    supplier: Optional[str] = None
    expiry_date: Optional[datetime] = None


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    current_stock: Optional[float] = None
    min_stock: Optional[float] = None
    cost_per_unit: Optional[float] = None
    supplier: Optional[str] = None
    expiry_date: Optional[datetime] = None


class InventoryItemResponse(BaseModel):
    id: str
    restaurant_id: str
    name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    current_stock: float
    min_stock: float
    cost_per_unit: float
    supplier: Optional[str] = None
    expiry_date: Optional[datetime] = None
    last_restocked: Optional[datetime] = None
    created_at: Optional[datetime] = None

from typing import Optional, List
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

# ==========================================
# Table Schemas
# ==========================================
class TableCreate(BaseModel):
    table_number: int = Field(..., gt=0)
    capacity: int = Field(..., gt=0)

class TableUpdate(BaseModel):
    table_number: Optional[int] = Field(None, gt=0)
    capacity: Optional[int] = Field(None, gt=0)
    status: Optional[str] = None
    current_order_id: Optional[str] = None
    current_amount: Optional[float] = Field(None, ge=0)
    reserved_for: Optional[str] = None

class TableResponse(BaseModel):
    id: uuid.UUID
    restaurant_id: uuid.UUID
    table_number: int
    capacity: int
    status: str
    current_order_id: Optional[str]
    current_amount: float
    order_started_at: Optional[datetime]
    reserved_for: Optional[str]
    created_at: datetime

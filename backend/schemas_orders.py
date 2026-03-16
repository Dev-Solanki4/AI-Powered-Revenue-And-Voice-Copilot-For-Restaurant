# ==========================================
# PetPooja Backend - Order Schemas
# ==========================================

from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class OrderItemIn(BaseModel):
    menu_item_id: str
    item_name: str
    quantity: int
    unit_price: float
    modifiers: Optional[List[Any]] = []
    subtotal: float


class OrderCreate(BaseModel):
    table_number: Optional[str] = None
    order_type: str = 'dine_in'
    subtotal: float
    discount_type: Optional[str] = None
    discount_value: Optional[float] = 0
    discount_amount: Optional[float] = 0
    cgst: float
    sgst: float
    total: float
    payment_method: str
    payment_status: str = 'paid'
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    items: List[OrderItemIn]


class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    menu_item_id: Optional[str]
    item_name: str
    quantity: int
    unit_price: float
    modifiers: Optional[List[Any]] = []
    subtotal: float


class OrderResponse(BaseModel):
    id: str
    restaurant_id: str
    table_id: Optional[str]
    order_number: str
    order_type: str
    status: str
    subtotal: float
    discount_amount: float
    cgst: float
    sgst: float
    total: float
    payment_method: str
    payment_status: str
    customer_name: Optional[str]
    customer_phone: Optional[str]
    created_at: Optional[datetime]
    completed_at: Optional[datetime]
    items: Optional[List[OrderItemResponse]] = []

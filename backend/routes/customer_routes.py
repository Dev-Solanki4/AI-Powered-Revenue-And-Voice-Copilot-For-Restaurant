# ==========================================
# PetPooja Backend - Customer Routes
# ==========================================

from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db_pool
from auth import get_current_user
from schemas_customers import CustomerCreate, CustomerResponse, CustomerUpdate
from schemas_orders import OrderResponse
from typing import List

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("", response_model=List[CustomerResponse])
async def list_customers(
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool)
):
    restaurant_id = current_user["restaurant_id"]
    rows = await pool.fetch(
        "SELECT id::text, restaurant_id::text, phone, name, email, loyalty_points, created_at FROM customers WHERE restaurant_id = $1",
        restaurant_id
    )
    return [dict(row) for row in rows]

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool)
):
    restaurant_id = current_user["restaurant_id"]
    row = await pool.fetchrow(
        "SELECT id::text, restaurant_id::text, phone, name, email, loyalty_points, created_at FROM customers WHERE id = $1 AND restaurant_id = $2",
        customer_id, restaurant_id
    )
    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")
    return dict(row)

@router.get("/{customer_id}/orders", response_model=List[OrderResponse])
async def get_customer_order_history(
    customer_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool)
):
    restaurant_id = current_user["restaurant_id"]
    # Verify customer belongs to restaurant
    exists = await pool.fetchval("SELECT 1 FROM customers WHERE id = $1 AND restaurant_id = $2", customer_id, restaurant_id)
    if not exists:
         raise HTTPException(status_code=404, detail="Customer not found")

    rows = await pool.fetch(
        """
        SELECT id::text, restaurant_id::text, table_id::text, order_number,
               order_type, status, subtotal, discount_amount, cgst, sgst, total,
               payment_method, payment_status, customer_name, customer_phone,
               created_at, completed_at
        FROM orders
        WHERE customer_id = $1 AND restaurant_id = $2
        ORDER BY created_at DESC
        """,
        customer_id, restaurant_id
    )
    return [dict(row) for row in rows]

@router.get("/by-phone/{phone}", response_model=CustomerResponse)
async def get_customer_by_phone(
    phone: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool)
):
    restaurant_id = current_user["restaurant_id"]
    row = await pool.fetchrow(
        "SELECT id::text, restaurant_id::text, phone, name, email, loyalty_points, created_at FROM customers WHERE phone = $1 AND restaurant_id = $2",
        phone, restaurant_id
    )
    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")
    return dict(row)

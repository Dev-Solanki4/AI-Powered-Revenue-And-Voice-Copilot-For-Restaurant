# ==========================================
# PetPooja Backend - Orders Routes
# Full CRUD: Create, List, Get, Update Status
# ==========================================

import json
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db_pool
from auth import get_current_user
from schemas_orders import OrderCreate, OrderResponse
from services.inventory_service import InventoryService
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/api/orders", tags=["orders"])


# ==========================================
# POST /api/orders — Create order (transactional)
# ==========================================
@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    user_id = current_user["id"]
    order_number = f"ORD-{int(datetime.now(timezone.utc).timestamp() * 1000) % 1000000:06d}"
    now = datetime.now(timezone.utc)

    async with pool.acquire() as conn:
        async with conn.transaction():
            # Resolve table_id from table_number if provided
            table_id = None
            if data.table_number:
                try:
                    table_num_int = int(data.table_number)
                    row = await conn.fetchrow(
                        "SELECT id FROM tables WHERE restaurant_id = $1 AND table_number = $2",
                        restaurant_id, table_num_int,
                    )
                    if row:
                        table_id = str(row["id"])
                except (ValueError, Exception):
                    pass  # ignore invalid table number

            # 1. UPSERT Customer
            customer_id = None
            if data.customer_phone:
                customer_row = await conn.fetchrow(
                    """
                    INSERT INTO customers (restaurant_id, phone, name)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (restaurant_id, phone) 
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING id::text
                    """,
                    restaurant_id, data.customer_phone, data.customer_name
                )
                if customer_row:
                    customer_id = customer_row["id"]

            # 2. Check Inventory Availability
            for item in data.items:
                if item.menu_item_id:
                    check = await InventoryService.check_item_availability(conn, str(item.menu_item_id), item.quantity)
                    if not check['available']:
                        missing = ", ".join(check['insufficient_ingredients'])
                        raise HTTPException(
                            status_code=400,
                            detail=f"OUT_OF_STOCK: {item.item_name} (Missing: {missing})"
                        )

            # 3. Insert the order
            order_row = await conn.fetchrow(
                """
                INSERT INTO orders
                    (restaurant_id, table_id, order_number, order_type, status,
                     subtotal, discount_type, discount_value, discount_amount,
                     cgst, sgst, total, payment_method, payment_status,
                     customer_name, customer_phone, customer_id, created_by, completed_at)
                VALUES
                    ($1, $2::uuid, $3, $4, 'completed',
                     $5, $6, $7, $8,
                     $9, $10, $11, $12, $13,
                     $14, $15, $16::uuid, $17::uuid, $18)
                RETURNING id::text, restaurant_id::text, table_id::text,
                          order_number, order_type, status,
                          subtotal, discount_amount, cgst, sgst, total,
                          payment_method, payment_status, customer_name,
                          customer_phone, created_at, completed_at
                """,
                restaurant_id,
                table_id,
                order_number,
                data.order_type,
                data.subtotal,
                data.discount_type,
                data.discount_value or 0,
                data.discount_amount or 0,
                data.cgst,
                data.sgst,
                data.total,
                data.payment_method,
                data.payment_status,
                data.customer_name,
                data.customer_phone,
                customer_id,
                user_id,
                now,
            )
            order_id = order_row["id"]

            # Insert order items
            items_result = []
            for item in data.items:
                modifiers_json = json.dumps(item.modifiers or [])
                mi_id = item.menu_item_id if item.menu_item_id else None
                item_row = await conn.fetchrow(
                    """
                    INSERT INTO order_items
                        (order_id, menu_item_id, item_name, quantity, unit_price, modifiers, subtotal)
                    VALUES
                        ($1::uuid, $2::uuid, $3, $4, $5, $6::jsonb, $7)
                    RETURNING id::text, order_id::text, menu_item_id::text,
                              item_name, quantity, unit_price, modifiers, subtotal
                    """,
                    order_id,
                    mi_id,
                    item.item_name,
                    item.quantity,
                    item.unit_price,
                    modifiers_json,
                    item.subtotal,
                )
                item_data = dict(item_row)
                if isinstance(item_data.get("modifiers"), str):
                    try:
                        item_data["modifiers"] = json.loads(item_data["modifiers"])
                    except:
                        item_data["modifiers"] = []
                items_result.append(item_data)

            # Deduct stock for ingredients
            await InventoryService.deduct_stock_for_order(conn, restaurant_id, order_id)

            # Free the table if it was an active dine-in order
            if table_id:
                await conn.execute(
                    """
                    UPDATE tables SET status = 'available', current_order_id = NULL,
                                      current_amount = 0, order_started_at = NULL
                    WHERE id = $1::uuid AND restaurant_id = $2
                    """,
                    table_id,
                    restaurant_id,
                )

    result = dict(order_row)
    result["items"] = items_result
    return result


# ==========================================
# GET /api/orders — List all orders
# ==========================================
@router.get("", response_model=List[OrderResponse])
async def list_orders(
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    rows = await pool.fetch(
        """
        SELECT id::text, restaurant_id::text, table_id::text, order_number,
               order_type, status, subtotal, discount_amount, cgst, sgst, total,
               payment_method, payment_status, customer_name, customer_phone,
               created_at, completed_at
        FROM orders
        WHERE restaurant_id = $1
        ORDER BY created_at DESC
        LIMIT 200
        """,
        restaurant_id,
    )
    result = []
    for row in rows:
        d = dict(row)
        d["items"] = []
        result.append(d)
    return result


# ==========================================
# GET /api/orders/{order_id} — Single order with items
# ==========================================
@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    order = await pool.fetchrow(
        """
        SELECT id::text, restaurant_id::text, table_id::text, order_number,
               order_type, status, subtotal, discount_amount, cgst, sgst, total,
               payment_method, payment_status, customer_name, customer_phone,
               created_at, completed_at
        FROM orders
        WHERE id = $1 AND restaurant_id = $2
        """,
        order_id, restaurant_id,
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    items = await pool.fetch(
        """
        SELECT id::text, order_id::text, menu_item_id::text,
               item_name, quantity, unit_price, modifiers, subtotal
        FROM order_items WHERE order_id = $1
        """,
        order_id,
    )
    result = dict(order)
    items_parsed = []
    for i in items:
        item_data = dict(i)
        if isinstance(item_data.get("modifiers"), str):
            try:
                item_data["modifiers"] = json.loads(item_data["modifiers"])
            except:
                item_data["modifiers"] = []
        items_parsed.append(item_data)
    result["items"] = items_parsed
    return result


# ==========================================
# PATCH /api/orders/{order_id}/status — Update order status
# ==========================================
@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    body: dict,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    new_status = body.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="status field is required.")

    row = await pool.fetchrow(
        """
        UPDATE orders SET status = $1
        WHERE id = $2 AND restaurant_id = $3
        RETURNING id::text, status
        """,
        new_status, order_id, restaurant_id
    )
    if not row:
        raise HTTPException(status_code=404, detail="Order not found.")
    return dict(row)


# ==========================================
# DELETE /api/orders/{order_id} — Cancel order
# ==========================================
@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    result = await pool.execute(
        "DELETE FROM orders WHERE id = $1 AND restaurant_id = $2",
        order_id, restaurant_id,
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Order not found.")

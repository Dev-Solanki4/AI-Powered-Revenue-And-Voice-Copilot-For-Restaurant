# ==========================================
# PetPooja Backend - Inventory Routes
# Full CRUD: Create, Read, Update, Delete
# ==========================================

from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db_pool
from auth import get_current_user
from schemas_inventory import InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


# ==========================================
# GET /api/inventory — List all items
# ==========================================
@router.get("", response_model=List[InventoryItemResponse])
async def list_inventory(
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    rows = await pool.fetch(
        """
        SELECT id::text, restaurant_id::text, name, category, unit,
               current_stock, min_stock, cost_per_unit, supplier,
               expiry_date, last_restocked, created_at
        FROM inventory
        WHERE restaurant_id = $1
        ORDER BY name ASC
        """,
        restaurant_id,
    )
    return [dict(r) for r in rows]


# ==========================================
# GET /api/inventory/{id} — Get single item
# ==========================================
@router.get("/{item_id}", response_model=InventoryItemResponse)
async def get_inventory_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    row = await pool.fetchrow(
        """
        SELECT id::text, restaurant_id::text, name, category, unit,
               current_stock, min_stock, cost_per_unit, supplier,
               expiry_date, last_restocked, created_at
        FROM inventory
        WHERE id = $1 AND restaurant_id = $2
        """,
        item_id,
        restaurant_id,
    )
    if not row:
        raise HTTPException(status_code=404, detail="Inventory item not found.")
    return dict(row)


# ==========================================
# POST /api/inventory — Create item
# ==========================================
@router.post("", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_inventory_item(
    data: InventoryItemCreate,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    row = await pool.fetchrow(
        """
        INSERT INTO inventory
            (restaurant_id, name, category, unit, current_stock, min_stock,
             cost_per_unit, supplier, expiry_date, last_restocked)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
        RETURNING id::text, restaurant_id::text, name, category, unit,
                  current_stock, min_stock, cost_per_unit, supplier,
                  expiry_date, last_restocked, created_at
        """,
        restaurant_id,
        data.name,
        data.category,
        data.unit,
        data.current_stock,
        data.min_stock,
        data.cost_per_unit,
        data.supplier,
        data.expiry_date,
    )
    return dict(row)


# ==========================================
# PUT /api/inventory/{id} — Update item
# ==========================================
@router.put("/{item_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    item_id: str,
    data: InventoryItemUpdate,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]

    # Build dynamic SET clause only for fields provided
    updates = []
    values = []
    idx = 1

    field_map = {
        "name": data.name,
        "category": data.category,
        "unit": data.unit,
        "current_stock": data.current_stock,
        "min_stock": data.min_stock,
        "cost_per_unit": data.cost_per_unit,
        "supplier": data.supplier,
        "expiry_date": data.expiry_date,
    }

    for field, value in field_map.items():
        if value is not None:
            updates.append(f"{field} = ${idx}")
            values.append(value)
            idx += 1

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    # Add restock timestamp if stock is being updated
    if data.current_stock is not None:
        updates.append(f"last_restocked = ${idx}")
        values.append(datetime.now(timezone.utc))
        idx += 1

    values.extend([item_id, restaurant_id])
    sql = f"""
        UPDATE inventory
        SET {", ".join(updates)}
        WHERE id = ${idx} AND restaurant_id = ${idx + 1}
        RETURNING id::text, restaurant_id::text, name, category, unit,
                  current_stock, min_stock, cost_per_unit, supplier,
                  expiry_date, last_restocked, created_at
    """

    row = await pool.fetchrow(sql, *values)
    if not row:
        raise HTTPException(status_code=404, detail="Inventory item not found.")
    return dict(row)


# ==========================================
# DELETE /api/inventory/{id} — Delete item
# ==========================================
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventory_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    result = await pool.execute(
        "DELETE FROM inventory WHERE id = $1 AND restaurant_id = $2",
        item_id,
        restaurant_id,
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Inventory item not found.")

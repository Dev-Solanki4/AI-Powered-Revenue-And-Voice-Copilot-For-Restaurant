from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
import uuid

from auth import get_current_user
from database import get_db_pool
from schemas_table import TableCreate, TableUpdate, TableResponse
from schemas import MessageResponse

# We require the user to be authenticated for all table routes.
router = APIRouter(
    prefix="/api/tables",
    tags=["tables"],
    dependencies=[Depends(get_current_user)]
)

def _get_restaurant_id(current_user: dict) -> uuid.UUID:
    rid = current_user.get("restaurant_id")
    if not rid:
        raise HTTPException(status_code=403, detail="User is not associated with a restaurant.")
    if isinstance(rid, str):
        return uuid.UUID(rid)
    return rid

# ==========================================
# GET /api/tables
# Get all tables for the restaurant
# ==========================================
@router.get("", response_model=List[TableResponse])
async def get_tables(current_user: dict = Depends(get_current_user)):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        raw_tables = await conn.fetch(
            """
            SELECT *
            FROM tables
            WHERE restaurant_id = $1
            ORDER BY table_number ASC
            """,
            restaurant_id
        )
        return [dict(t) for t in raw_tables]

# ==========================================
# POST /api/tables
# Add a new table
# ==========================================
@router.post("", response_model=TableResponse)
async def create_table(
    table_data: TableCreate, 
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Check if table number already exists
        existing = await conn.fetchrow(
            "SELECT id FROM tables WHERE restaurant_id = $1 AND table_number = $2",
            restaurant_id, table_data.table_number
        )
        if existing:
            raise HTTPException(status_code=400, detail=f"Table {table_data.table_number} already exists.")

        try:
            new_table = await conn.fetchrow(
                """
                INSERT INTO tables (restaurant_id, table_number, capacity, status, current_amount)
                VALUES ($1, $2, $3, 'available', 0)
                RETURNING *
                """,
                restaurant_id,
                table_data.table_number,
                table_data.capacity
            )
            return dict(new_table)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# PUT /api/tables/{table_id}
# Update a table
# ==========================================
@router.put("/{table_id}", response_model=TableResponse)
async def update_table(
    table_id: uuid.UUID,
    table_update: TableUpdate,
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Check ownership
        existing = await conn.fetchrow(
            "SELECT * FROM tables WHERE id = $1 AND restaurant_id = $2",
            table_id, restaurant_id
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Table not found")

        # Dynamic update builder
        update_fields = table_update.dict(exclude_unset=True)
        if not update_fields:
            return dict(existing)

        # Handle order_started_at logic correctly
        if "status" in update_fields:
            old_status = existing["status"]
            new_status = update_fields["status"]
            # If changing from available to something active, start the timer
            if old_status == "available" and new_status in ["active", "preparing", "reserved"]:
                update_fields["order_started_at"] = "NOW()"
            # If resetting to available, clear the timer and amount
            elif new_status == "available":
                update_fields["order_started_at"] = None
                update_fields["current_amount"] = 0
                update_fields["current_order_id"] = None

        set_clauses = []
        values = []
        # Value 1 is table_id
        
        for idx, (key, value) in enumerate(update_fields.items(), start=2):
            if value == "NOW()":
                set_clauses.append(f"{key} = NOW()")
            else:
                set_clauses.append(f"{key} = ${len(values) + 2}")
                values.append(value)

        query = f"""
            UPDATE tables 
            SET {", ".join(set_clauses)}
            WHERE id = $1
            RETURNING *
        """
        try:
            updated = await conn.fetchrow(query, table_id, *values)
            return dict(updated)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# DELETE /api/tables/{table_id}
# Delete a table
# ==========================================
@router.delete("/{table_id}", response_model=MessageResponse)
async def delete_table(
    table_id: uuid.UUID,
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM tables WHERE id = $1 AND restaurant_id = $2",
            table_id, restaurant_id
        )
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Table not found")

        return MessageResponse(message="Table deleted successfully.")

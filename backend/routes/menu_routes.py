from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
import uuid
import json

from auth import get_current_user
from database import get_db_pool
from schemas_menu import (
    CategoryCreate, CategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse,
    MenuResponse
)
from schemas import MessageResponse

# We require the user to be authenticated for all menu routes.
router = APIRouter(
    prefix="/api/menu",
    tags=["menu"],
    dependencies=[Depends(get_current_user)]
)

# Optional: helper to fetch user context
def _get_restaurant_id(current_user: dict) -> uuid.UUID:
    # `current_user` dict comes from our get_current_user dependency
    rid = current_user.get("restaurant_id")
    if not rid:
        raise HTTPException(status_code=403, detail="User is not associated with a restaurant.")
    if isinstance(rid, str):
        return uuid.UUID(rid)
    return rid

# ==========================================
# GET /api/menu
# Get all categories and items for the restaurant
# ==========================================
@router.get("", response_model=MenuResponse)
async def get_menu(current_user: dict = Depends(get_current_user)):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Fetch Categories
        raw_cats = await conn.fetch(
            """
            SELECT id, restaurant_id, name, icon, sort_order
            FROM menu_categories
            WHERE restaurant_id = $1
            ORDER BY sort_order ASC
            """,
            restaurant_id
        )
        categories = [dict(c) for c in raw_cats]

        # Fetch Items
        raw_items = await conn.fetch(
            """
            SELECT id, restaurant_id, category_id, name, description, price, 
                   image_url, is_veg, is_available, is_bestseller, prep_time_minutes, making_cost, recipe, modifiers, sort_order
            FROM menu_items
            WHERE restaurant_id = $1
            ORDER BY sort_order ASC
            """,
            restaurant_id
        )
        items = []
        for i in raw_items:
            item_dict = dict(i)
            if item_dict.get("recipe") and isinstance(item_dict["recipe"], str):
                item_dict["recipe"] = json.loads(item_dict["recipe"])
            if item_dict.get("modifiers") and isinstance(item_dict["modifiers"], str):
                item_dict["modifiers"] = json.loads(item_dict["modifiers"])
            items.append(item_dict)

    return MenuResponse(categories=categories, items=items)

# ==========================================
# POST /api/menu/categories
# Add a new category
# ==========================================
@router.post("/categories", response_model=CategoryResponse)
async def create_category(
    category: CategoryCreate, 
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Find max sort order
        max_order_record = await conn.fetchrow(
            "SELECT MAX(sort_order) as max_order FROM menu_categories WHERE restaurant_id = $1", 
            restaurant_id
        )
        max_order = max_order_record["max_order"] if max_order_record["max_order"] is not None else 0
        new_sort_order = max_order + 1

        try:
            new_cat = await conn.fetchrow(
                """
                INSERT INTO menu_categories (restaurant_id, name, icon, sort_order)
                VALUES ($1, $2, $3, $4)
                RETURNING id, restaurant_id, name, icon, sort_order
                """,
                restaurant_id,
                category.name,
                category.icon,
                new_sort_order
            )
            return dict(new_cat)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# POST /api/menu/items
# Add a new menu item
# ==========================================
@router.post("/items", response_model=MenuItemResponse)
async def create_menu_item(
    item: MenuItemCreate, 
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    # Validate category belongs to this restaurant
    async with pool.acquire() as conn:
        cat_check = await conn.fetchrow(
            "SELECT id FROM menu_categories WHERE id = $1 AND restaurant_id = $2",
            item.category_id, restaurant_id
        )
        if not cat_check:
            raise HTTPException(status_code=400, detail="Invalid category_id for this restaurant.")

        # Find max sort order
        max_order_record = await conn.fetchrow(
            "SELECT MAX(sort_order) as max_order FROM menu_items WHERE restaurant_id = $1 AND category_id = $2", 
            restaurant_id, item.category_id
        )
        max_order = max_order_record["max_order"] if max_order_record["max_order"] is not None else 0
        new_sort_order = max_order + 1

        try:
            # Convert list of Pydantic models to JSON-serializable list of dicts
            recipe_data = [ing.dict() for ing in item.recipe] if item.recipe else []
            
            new_item = await conn.fetchrow(
                """
                INSERT INTO menu_items (
                    restaurant_id, category_id, name, description, price, 
                    image_url, is_veg, is_available, is_bestseller, prep_time_minutes, making_cost, recipe, sort_order
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *
                """,
                restaurant_id,
                item.category_id,
                item.name,
                item.description,
                item.price,
                item.image_url,
                item.is_veg,
                item.is_available,
                item.is_bestseller,
                item.prep_time_minutes,
                item.making_cost,
                json.dumps(recipe_data),
                new_sort_order
            )
            
            item_dict = dict(new_item)
            if item_dict.get("recipe") and isinstance(item_dict["recipe"], str):
                item_dict["recipe"] = json.loads(item_dict["recipe"])
            if item_dict.get("modifiers") and isinstance(item_dict["modifiers"], str):
                item_dict["modifiers"] = json.loads(item_dict["modifiers"])
            return item_dict
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# PUT /api/menu/items/{item_id}
# Update a menu item
# ==========================================
@router.put("/items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: uuid.UUID,
    item_update: MenuItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Check ownership
        existing = await conn.fetchrow(
            "SELECT id FROM menu_items WHERE id = $1 AND restaurant_id = $2",
            item_id, restaurant_id
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        # Dynamic update builder
        update_fields = item_update.dict(exclude_unset=True)
        if not update_fields:
            # if nothing to update, just return the existing record
            return dict(await conn.fetchrow("SELECT * FROM menu_items WHERE id = $1", item_id))

        set_clauses = []
        values = []
        # Value 1 is item_id
        
        for idx, (key, value) in enumerate(update_fields.items(), start=2):
            if key == "recipe" and value is not None:
                # Convert list of Pydantic models to JSON-serializable list of dicts
                value = json.dumps([ing.dict() if hasattr(ing, 'dict') else ing for ing in value])
            
            set_clauses.append(f"{key} = ${idx}")
            values.append(value)
        
        # also update updated_at
        set_clauses.append(f"updated_at = NOW()")

        query = f"""
            UPDATE menu_items 
            SET {", ".join(set_clauses)}
            WHERE id = $1
            RETURNING *
        """
        try:
            updated_item = await conn.fetchrow(query, item_id, *values)
            if not updated_item:
                raise HTTPException(status_code=404, detail="Item not found")
                
            item_dict = dict(updated_item)
            if item_dict.get("recipe") and isinstance(item_dict["recipe"], str):
                item_dict["recipe"] = json.loads(item_dict["recipe"])
            if item_dict.get("modifiers") and isinstance(item_dict["modifiers"], str):
                item_dict["modifiers"] = json.loads(item_dict["modifiers"])
            return item_dict
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# DELETE /api/menu/items/{item_id}
# Delete a menu item
# ==========================================
@router.delete("/items/{item_id}", response_model=MessageResponse)
async def delete_menu_item(
    item_id: uuid.UUID,
    current_user: dict = Depends(get_current_user)
):
    pool = await get_db_pool()
    restaurant_id = _get_restaurant_id(current_user)

    async with pool.acquire() as conn:
        # Delete only if it belongs to the restaurant
        result = await conn.execute(
            "DELETE FROM menu_items WHERE id = $1 AND restaurant_id = $2",
            item_id, restaurant_id
        )
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Item not found")

        return MessageResponse(message="Item deleted successfully.")

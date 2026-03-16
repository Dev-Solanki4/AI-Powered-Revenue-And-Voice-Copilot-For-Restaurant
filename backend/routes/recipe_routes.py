from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db_pool
from auth import get_current_user
from schemas_recipe import RecipeCreate, RecipeResponse, RecipeIngredientResponse
from services.inventory_service import InventoryService
from typing import List
import uuid
import json

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

@router.post("", response_model=RecipeResponse)
async def create_or_update_recipe(
    data: RecipeCreate,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 1. Upsert Recipe record
            recipe_row = await conn.fetchrow(
                """
                INSERT INTO recipes (restaurant_id, menu_item_id)
                VALUES ($1::uuid, $2::uuid)
                ON CONFLICT (menu_item_id) DO UPDATE SET created_at = now()
                RETURNING id::text
                """,
                restaurant_id, data.menu_item_id
            )
            recipe_id = recipe_row["id"]

            # 2. Clear old ingredients
            await conn.execute("DELETE FROM recipe_ingredients WHERE recipe_id = $1::uuid", recipe_id)

            # 3. Add new ingredients
            for ing in data.ingredients:
                await conn.execute(
                    """
                    INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_required, unit)
                    VALUES ($1::uuid, $2::uuid, $3, $4)
                    """,
                    recipe_id, ing.ingredient_id, ing.quantity_required, ing.unit
                )

            # 4. Fetch full recipe for cache and calculate total food cost
            ingredients_data = await pool.fetch(
                """
                SELECT ri.ingredient_id::text, ri.quantity_required, ri.unit, i.name as ingredient_name
                FROM recipe_ingredients ri
                JOIN inventory i ON ri.ingredient_id = i.id
                WHERE ri.recipe_id = $1::uuid
                """,
                recipe_id
            )
            recipe_json = [dict(i) for i in ingredients_data]
            food_cost = sum([float(i['quantity_required']) * 0.5 for i in recipe_json]) # Placeholder logic, InventoryService is better
            
            # Recalculate food cost using the service for accuracy
            food_cost = await InventoryService.calculate_food_cost(conn, str(data.menu_item_id))

            # 5. Update menu_items with food_cost, margin AND the recipe JSON cache
            await conn.execute(
                """
                UPDATE menu_items 
                SET food_cost = $1, 
                    margin_percent = CASE WHEN price > 0 THEN ((price - $1) / price) * 100 ELSE 0 END,
                    recipe = $4
                WHERE id = $2::uuid AND restaurant_id = $3::uuid
                """,
                food_cost, data.menu_item_id, restaurant_id, json.dumps(recipe_json)
            )

    return await get_recipe(str(data.menu_item_id), current_user, pool)

@router.get("/{menu_item_id}", response_model=RecipeResponse)
async def get_recipe(
    menu_item_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    recipe = await pool.fetchrow(
        "SELECT id::text, menu_item_id::text FROM recipes WHERE menu_item_id = $1::uuid AND restaurant_id = $2::uuid",
        menu_item_id, restaurant_id
    )
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found for this item.")

    ingredients = await pool.fetch(
        """
        SELECT ri.id::text, ri.ingredient_id::text, ri.quantity_required, ri.unit, i.name as ingredient_name
        FROM recipe_ingredients ri
        JOIN inventory i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = $1::uuid
        """,
        recipe["id"]
    )
    
    # Calculate food cost for the response
    food_cost = await InventoryService.calculate_food_cost(pool, menu_item_id)

    return {
        "id": recipe["id"],
        "menu_item_id": recipe["menu_item_id"],
        "ingredients": [dict(i) for i in ingredients],
        "food_cost": food_cost
    }

@router.delete("/{menu_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    menu_item_id: str,
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    result = await pool.execute(
        "DELETE FROM recipes WHERE menu_item_id = $1::uuid AND restaurant_id = $2::uuid",
        menu_item_id, restaurant_id
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Recipe not found.")


import asyncio
import json
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def sync_recipe_cache():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    try:
        print("Fetching all recipes...")
        recipes = await conn.fetch("SELECT id, menu_item_id FROM recipes")
        print(f"Found {len(recipes)} recipes to sync.")
        
        for r in recipes:
            recipe_id = r['id']
            menu_item_id = r['menu_item_id']
            
            # Fetch ingredients for this recipe
            ingredients = await conn.fetch(
                """
                SELECT ri.ingredient_id::text, ri.quantity_required, ri.unit, i.name as ingredient_name
                FROM recipe_ingredients ri
                JOIN inventory i ON ri.ingredient_id = i.id
                WHERE ri.recipe_id = $1
                """,
                recipe_id
            )
            
            recipe_json = [dict(ing) for ing in ingredients]
            print(f"Syncing item {menu_item_id} with {len(recipe_json)} ingredients...")
            
            # Calculate food cost
            food_cost = sum([float(ing['quantity_required']) * 0.5 for ing in recipe_json]) # Basic sum
            
            # Update menu_items cache
            await conn.execute(
                """
                UPDATE menu_items 
                SET recipe = $1, food_cost = $2
                WHERE id = $3
                """,
                json.dumps(recipe_json), food_cost, menu_item_id
            )
        
        print("✅ Sync completed successfully!")
    except Exception as e:
        print(f"❌ Error during sync: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(sync_recipe_cache())

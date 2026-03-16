
import asyncio
import json
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def sync_recipe_cache():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {db_url}")
    try:
        conn = await asyncpg.connect(db_url)
        print("Connected!")
        
        print("Fetching recipes...")
        recipes = await conn.fetch("SELECT id, menu_item_id FROM recipes")
        print(f"Found {len(recipes)} recipes.")
        
        for r in recipes:
            recipe_id = r['id']
            menu_item_id = r['menu_item_id']
            print(f"Processing Recipe ID: {recipe_id} for Menu Item: {menu_item_id}")
            
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
            print(f"  Ingredients found: {len(recipe_json)}")
            
            food_cost = sum([float(ing['quantity_required']) * 0.5 for ing in recipe_json])
            
            print(f"  Updating menu_items cache...")
            await conn.execute(
                """
                UPDATE menu_items 
                SET recipe = $1, food_cost = $2
                WHERE id = $3
                """,
                json.dumps(recipe_json), food_cost, menu_item_id
            )
            print(f"  Done with {menu_item_id}")
        
        print("✅ All synced!")
        await conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(sync_recipe_cache())

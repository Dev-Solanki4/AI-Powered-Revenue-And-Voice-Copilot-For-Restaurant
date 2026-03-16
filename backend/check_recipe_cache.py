
import asyncio
import json
import os
from database import get_db_pool, init_db

async def check_item_recipe():
    print("Initializing Database...")
    await init_db()
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        print("Checking Menu Item Recipes (JSONB Cache)...")
        items = await conn.fetch("SELECT id, name, recipe FROM menu_items WHERE recipe IS NOT NULL AND recipe != '[]'::jsonb")
        if not items:
            print("No items found with a populated recipe cache.")
        for i in items:
            print(f"Item: {i['name']}, ID: {i['id']}")
            print(f"Recipe JSON type: {type(i['recipe'])}")
            print(f"Recipe JSON: {i['recipe']}")
            print("-" * 20)
        
        print("\nChecking Recipes table...")
        recipes = await conn.fetch("SELECT id, menu_item_id FROM recipes")
        print(f"Total recipes in 'recipes' table: {len(recipes)}")

if __name__ == "__main__":
    asyncio.run(check_item_recipe())

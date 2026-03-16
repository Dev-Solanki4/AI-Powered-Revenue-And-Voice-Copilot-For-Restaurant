import asyncio
import asyncpg
import os
import uuid
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.getcwd())

async def verify():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    print("🚀 Starting Recipe-Inventory Verification...")

    ing_id = None
    order_id = None

    try:
        # 1. Get a random restaurant and menu item
        rest = await conn.fetchrow("SELECT id FROM restaurants LIMIT 1")
        if not rest:
            print("❌ No restaurants found.")
            return
        rest_id = rest['id']
        
        item = await conn.fetchrow("SELECT id, name, price FROM menu_items WHERE restaurant_id = $1 LIMIT 1", rest_id)
        if not item:
            print("❌ No menu items found to test.")
            return
        
        item_id = item['id']
        print(f"Testing with item: {item['name']} (ID: {item_id})")

        # 2. Setup an Ingredient
        ing_id = await conn.fetchval(
            "INSERT INTO inventory (restaurant_id, name, category, unit, current_stock, min_stock, cost_per_unit) "
            "VALUES ($1, 'Test Ingredient', 'Test', 'grams', 1000, 10, 0.5) RETURNING id",
            rest_id
        )
        print(f"Created ingredient: 1000g of 'Test Ingredient' (ID: {ing_id})")

        # 3. Create a Recipe (100g per item)
        recipe_id = await conn.fetchval(
            "INSERT INTO recipes (restaurant_id, menu_item_id) VALUES ($1, $2) "
            "ON CONFLICT (menu_item_id) DO UPDATE SET created_at = now() RETURNING id",
            rest_id, item_id
        )
        await conn.execute("DELETE FROM recipe_ingredients WHERE recipe_id = $1", recipe_id)
        await conn.execute(
            "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_required, unit) "
            "VALUES ($1, $2, 100, 'grams')",
            recipe_id, ing_id
        )
        print("Set recipe: 100g 'Test Ingredient' per item.")

        # 4. Place an Order for 2 items (Should deduct 200g)
        order_id = uuid.uuid4()
        async with conn.transaction():
            # Mock order insertion
            await conn.execute(
                "INSERT INTO orders (id, restaurant_id, order_number, total, status, order_type) "
                "VALUES ($1, $2, 'TEST-001', $3, 'completed', 'dine_in')",
                order_id, rest_id, item['price'] * 2
            )
            await conn.execute(
                "INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, subtotal) "
                "VALUES ($1, $2, $3, 2, $4, $5)",
                order_id, item_id, item['name'], item['price'], item['price'] * 2
            )
            
            # Trigger deduction manually (as order_routes would call InventoryService)
            from services.inventory_service import InventoryService
            await InventoryService.deduct_stock_for_order(conn, str(rest_id), str(order_id))

        # 5. Verify stock
        new_stock = await conn.fetchval("SELECT current_stock FROM inventory WHERE id = $1", ing_id)
        print(f"Stock after 2 items: {new_stock}g (Expected: 800g)")
        
        if new_stock == 800:
            print("✅ AUTOMATED DEDUCTION TEST PASSED!")
        else:
            print("❌ AUTOMATED DEDUCTION TEST FAILED!")

        # 6. Test Availability Check
        from services.inventory_service import InventoryService
        check_ok = await InventoryService.check_item_availability(conn, str(item_id), 5)
        print(f"Check for 5 items (needs 500g, has 800g): {check_ok}")
        
        check_fail = await InventoryService.check_item_availability(conn, str(item_id), 10)
        print(f"Check for 10 items (needs 1000g, has 800g): {check_fail}")

        if check_ok['available'] and not check_fail['available']:
            print("✅ AVAILABILITY CHECK TEST PASSED!")
        else:
            print("❌ AVAILABILITY CHECK TEST FAILED!")

    except Exception as e:
        print(f"❌ Error during verification: {e}")
        import traceback
        traceback.print_exc()

    finally:
        # Cleanup
        print("Cleaning up test data...")
        if ing_id:
            await conn.execute("DELETE FROM inventory_transactions WHERE ingredient_id = $1", ing_id)
            await conn.execute("DELETE FROM recipe_ingredients WHERE ingredient_id = $1", ing_id)
            await conn.execute("DELETE FROM inventory WHERE id = $1", ing_id)
        if order_id:
            await conn.execute("DELETE FROM order_items WHERE order_id = $1", order_id)
            await conn.execute("DELETE FROM orders WHERE id = $1", order_id)
        
        await conn.close()

if __name__ == "__main__":
    asyncio.run(verify())

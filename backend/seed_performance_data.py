import asyncio
import asyncpg
import os
import random
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Real-looking dish names
MENU_DATA = {
    "Starters": [
        ("Paneer Tikka", 240), ("Chicken Lollipop", 280), ("Veg Manchurian", 180),
        ("Hara Bhara Kabab", 210), ("Chilli Mushroom", 220), ("Spring Rolls", 160)
    ],
    "Main Course": [
        ("Butter Chicken", 450), ("Dal Makhani", 320), ("Paneer Butter Masala", 380),
        ("Mutton Rogan Josh", 550), ("Veg Biryani", 280), ("Chicken Biryani", 350)
    ],
    "Breads": [
        ("Butter Naan", 40), ("Tandoori Roti", 25), ("Garlic Naan", 60), ("Lachha Paratha", 50)
    ],
    "Beverages": [
        ("Masala Chai", 40), ("Cold Coffee", 120), ("Fresh Lime Soda", 80), ("Mango Lassi", 90)
    ]
}

PAYMENT_METHODS = ["cash", "upi", "card"]
ORDER_TYPES = ["dine_in", "takeaway", "zomato", "swiggy"]

async def seed_data():
    database_url = os.getenv("DATABASE_URL")
    conn = await asyncpg.connect(database_url, statement_cache_size=0)
    
    try:
        print("🚀 Fetching restaurant context...")
        restaurant = await conn.fetchrow("SELECT id FROM restaurants LIMIT 1")
        if not restaurant:
            print("❌ No restaurant found. Create one first.")
            return
        rid = restaurant['id']

        # 1. Ensure Menu Categories and Items exist
        print("🥘 Setting up menu items...")
        item_ids = []
        for cat_name, items in MENU_DATA.items():
            cat = await conn.fetchrow(
                "INSERT INTO menu_categories (restaurant_id, name, icon) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
                rid, cat_name, "🍴"
            )
            if not cat:
                cat = await conn.fetchrow("SELECT id FROM menu_categories WHERE restaurant_id = $1 AND name = $2", rid, cat_name)
            
            cid = cat['id']
            for name, price in items:
                item = await conn.fetchrow(
                    "INSERT INTO menu_items (restaurant_id, category_id, name, price, making_cost) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id, price",
                    rid, cid, name, price, price * 0.4
                )
                if not item:
                    item = await conn.fetchrow("SELECT id, price FROM menu_items WHERE restaurant_id = $1 AND name = $2", rid, name)
                item_ids.append(item)

        # 2. Ensure some tables exist
        print("🪑 Setting up tables...")
        table_ids = []
        for i in range(1, 21):
            t = await conn.fetchrow(
                "INSERT INTO tables (restaurant_id, table_number, capacity) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
                rid, i, random.choice([2, 4, 6, 8])
            )
            if not t:
                t = await conn.fetchrow("SELECT id FROM tables WHERE restaurant_id = $1 AND table_number = $2", rid, i)
            table_ids.append(t['id'])

        # 3. Generate 1000 Orders
        print("📝 Generating 1000+ orders (this may take a minute)...")
        orders_to_insert = []
        
        now = datetime.now()
        for i in range(1100):
            # Spread orders over last 60 days
            days_ago = random.randint(0, 60)
            hours_ago = random.randint(0, 23)
            mins_ago = random.randint(0, 59)
            order_time = now - timedelta(days=days_ago, hours=hours_ago, minutes=mins_ago)
            
            order_id = uuid.uuid4()
            order_type = random.choice(ORDER_TYPES)
            table_id = random.choice(table_ids) if order_type == 'dine_in' else None
            
            # Select random items for this order
            num_items = random.randint(1, 5)
            selected_items = random.sample(item_ids, num_items)
            
            subtotal = 0
            order_items_data = []
            for item in selected_items:
                qty = random.randint(1, 3)
                price = float(item['price'])
                item_subtotal = price * qty
                subtotal += item_subtotal
                order_items_data.append((order_id, item['id'], random.choice(MENU_DATA[random.choice(list(MENU_DATA.keys()))])[0], qty, price, item_subtotal))

            cgst = subtotal * 0.025
            sgst = subtotal * 0.025
            total = subtotal + cgst + sgst
            
            status = 'completed' if days_ago > 0 else random.choice(['completed', 'pending', 'preparing'])
            
            # Create Order
            await conn.execute(
                """
                INSERT INTO orders (
                    id, restaurant_id, table_id, order_number, order_type, status,
                    subtotal, cgst, sgst, total, payment_method, payment_status,
                    created_at, completed_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                """,
                order_id, rid, table_id, f"ORD-{order_time.strftime('%H%M')}-{i}",
                order_type, status, subtotal, cgst, sgst, total,
                random.choice(PAYMENT_METHODS), 'completed',
                order_time, order_time + timedelta(minutes=random.randint(20, 45))
            )
            
            # Create Order Items
            for oi in order_items_data:
                await conn.execute(
                    "INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)",
                    *oi
                )
            
            if i % 100 == 0:
                print(f"✅ Inserted {i} orders...")

        print("✨ Seeding completed successfully!")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_data())

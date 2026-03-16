import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def sync_data():
    database_url = os.getenv("DATABASE_URL")
    conn = await asyncpg.connect(database_url, statement_cache_size=0)
    
    try:
        # 1. Find the restaurant that has the orders (seeded data)
        print("🔍 Searching for restaurant with order history...")
        row = await conn.fetchrow("""
            SELECT o.restaurant_id, COUNT(*) as cnt 
            FROM orders o 
            GROUP BY o.restaurant_id 
            ORDER BY cnt DESC 
            LIMIT 1
        """)
        
        if not row:
            print("❌ No orders found in database. Seed data first.")
            return

        seeded_rid = row['restaurant_id']
        print(f"✅ Found seeded restaurant: {seeded_rid} with {row['cnt']} orders")

        # 2. Update the test user to belong to this restaurant
        print(f"👤 Updating test@example.com to restaurant {seeded_rid}...")
        res = await conn.execute("""
            UPDATE users 
            SET restaurant_id = $1 
            WHERE email = 'test@example.com'
        """, seeded_rid)
        
        print(f"✨ Update result: {res}")

        # 3. Ensure customers also belong to this restaurant if needed
        # (The seed script usually handles this, but ensuring consistency)
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(sync_data())

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def verify():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), statement_cache_size=0)
    try:
        orders = await conn.fetchval("SELECT count(*) FROM orders")
        items = await conn.fetchval("SELECT count(*) FROM order_items")
        menu = await conn.fetchval("SELECT count(*) FROM menu_items")
        tables = await conn.fetchval("SELECT count(*) FROM tables")
        
        print(f"📊 Final Data Summary:")
        print(f"- Total Orders: {orders}")
        print(f"- Total Order Items: {items}")
        print(f"- Menu Items: {menu}")
        print(f"- Tables: {tables}")
        
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(verify())

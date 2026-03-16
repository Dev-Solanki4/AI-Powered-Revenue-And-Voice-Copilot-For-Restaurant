import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def verify():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), statement_cache_size=0)
    rows = await conn.fetch("SELECT column_name FROM information_schema.columns WHERE table_name='menu_items'")
    for r in rows:
        print(r['column_name'])
    await conn.close()

if __name__ == "__main__":
    asyncio.run(verify())

import asyncio
import os
from database import init_db, get_db_pool

async def main():
    await init_db()
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        res = await conn.fetch("SELECT * FROM menu_categories")
        print("Categories:", res)

asyncio.run(main())

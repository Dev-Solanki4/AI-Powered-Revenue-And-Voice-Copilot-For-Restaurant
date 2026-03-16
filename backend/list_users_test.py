import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def list_users():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    rows = await conn.fetch("SELECT email FROM users LIMIT 5")
    for r in rows:
        print(r['email'])
    await conn.close()

if __name__ == "__main__":
    asyncio.run(list_users())

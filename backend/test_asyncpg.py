import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def test_db():
    print("Connecting...")
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(os.getenv("DATABASE_URL")), 
            timeout=5.0
        )
        print("Connected!")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test_db())

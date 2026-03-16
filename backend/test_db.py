import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def test():
    url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {url}")
    try:
        conn = await asyncpg.connect(url, ssl="require")
        print("Success!")
        await conn.close()
    except Exception as e:
        print(f"Failed to connect with ssl='require': {e}")
        
    try:
        # maybe try with port 6543
        url_6543 = url.replace("5432", "6543")
        conn = await asyncpg.connect(url_6543, ssl="require")
        print("Success on 6543!")
        await conn.close()
    except Exception as e:
        print(f"Failed to connect on 6543 with ssl: {e}")

asyncio.run(test())

import asyncio
import asyncpg
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_data():
    database_url = os.getenv("DATABASE_URL")
    conn = await asyncpg.connect(database_url)
    try:
        # 1. Create restaurant if not exists
        res = await conn.fetchrow("INSERT INTO restaurants (name) VALUES ('Test Restaurant') RETURNING id")
        restaurant_id = res['id']
        print(f"✅ Created Restaurant: {restaurant_id}")

        # 2. Create user
        email = "test@example.com"
        password = "password123"
        hashed_password = pwd_context.hash(password)
        
        await conn.execute(
            "INSERT INTO users (email, password_hash, role, restaurant_id, full_name) VALUES ($1, $2, 'owner', $3, 'Test Admin')",
            email, hashed_password, restaurant_id
        )
        print(f"✅ Created User: {email} / {password}")

    except Exception as e:
        print(f"❌ Error: {e}")
        # If user already exists, let's just use it
        if "already exists" in str(e):
             print("ℹ️ User test@example.com already exists, will use it.")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(create_test_data())

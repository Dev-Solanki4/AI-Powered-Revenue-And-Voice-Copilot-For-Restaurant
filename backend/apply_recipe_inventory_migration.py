import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def apply_migration():
    print("Connecting to database...")
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"))
    
    print("Reading migration script...")
    with open("migrations/recipe_inventory_migration.sql", "r") as f:
        sql = f.read()
    
    print("Executing migration...")
    try:
        await conn.execute(sql)
        print("✅ Migration applied successfully!")
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(apply_migration())

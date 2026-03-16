import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def apply_migration():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not set")
        return

    conn = await asyncpg.connect(database_url)
    try:
        print("🚀 Applying migration...")
        with open("migration_customers.sql", "r") as f:
            sql = f.read()
            await conn.execute(sql)
        print("✅ Migration applied successfully")
        
        # Verify tables
        tables = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
        print(f"Tables in DB: {[t['table_name'] for t in tables]}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(apply_migration())

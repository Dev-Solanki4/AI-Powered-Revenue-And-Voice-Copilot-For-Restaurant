import asyncio
import asyncpg
import time

password = "sI603aPH4QvGz1IC"
project_ref = "iuncsrifisjcwgzxaioi"
user = f"postgres.{project_ref}"

regions = [
    "aws-0-ap-south-1",
    "aws-0-us-east-1",
    "aws-0-eu-central-1",
    "aws-0-ap-southeast-1",
    "aws-0-ap-southeast-2",
    "aws-0-us-west-1",
    "aws-0-sa-east-1",
    "aws-0-eu-west-1",
    "aws-0-eu-west-2",
    "aws-0-ca-central-1",
]

async def check_region(region):
    host = f"{region}.pooler.supabase.com"
    dsn = f"postgresql://{user}:{password}@{host}:6543/postgres"
    print(f"Testing {host}...")
    try:
        conn = await asyncpg.connect(dsn, timeout=5)
        print(f"\n=> SUCCESS: {host} works!")
        await conn.close()
        return dsn
    except Exception as e:
        print(f"Failed {host}: {str(e)}")
        return None

async def main():
    tasks = [check_region(r) for r in regions]
    results = await asyncio.gather(*tasks)
    for res in results:
        if res:
            with open(".env", "r") as f:
                content = f.read()
            import re
            content = re.sub(r"DATABASE_URL=.*", f"DATABASE_URL={res}", content)
            with open(".env", "w") as f:
                f.write(content)
            print(f"Updated .env with working pooler connection.")
            return

asyncio.run(main())

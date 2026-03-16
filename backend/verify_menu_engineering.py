import os
from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import httpx
import json

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def create_test_token():
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=15)
    payload = {
        "sub": "test-user-id",
        "email": "test@example.com",
        "role": "owner",
        "restaurant_id": "893c8375-70e6-4299-81bc-5444fae9f50e", # From sync_test_user.py session
        "full_name": "Test User",
        "type": "access",
        "iat": now,
        "exp": expire,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

token = create_test_token()
print(f"Generated Token: {token[:20]}...")

try:
    with httpx.Client(timeout=30) as client:
        r = client.get(
            'http://localhost:8000/api/analytics/menu-engineering?period=last_30_days',
            headers={'Authorization': f'Bearer {token}'}
        )
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"Total items: {data.get('total_items')}")
            print(f"Averages: {data.get('averages')}")
            if data.get('items'):
                print(f"First item: {json.dumps(data['items'][0], indent=2)}")
        else:
            print(f"Error: {r.text}")
except Exception as e:
    print(f"Connection failed: {e}")

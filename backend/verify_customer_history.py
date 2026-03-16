import asyncio
import httpx
import sys

BASE_URL = "http://localhost:8000"
TEST_PHONE = "9876543210"
TEST_NAME = "Test Customer"

async def verify_flow():
    async with httpx.AsyncClient() as client:
        login_data = {"email": "test@example.com", "password": "password123"}
        response = await client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Login failed: {response.text}")
            return
        
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        print("✅ Login successful")

        # 2. Create an order with a new customer phone
        order_data = {
            "order_type": "dine_in",
            "subtotal": 500.0,
            "cgst": 25.0,
            "sgst": 25.0,
            "total": 550.0,
            "payment_method": "cash",
            "customer_name": TEST_NAME,
            "customer_phone": TEST_PHONE,
            "items": [
                {
                    "menu_item_id": "00000000-0000-0000-0000-000000000000", # Dummy
                    "item_name": "Veg Burger",
                    "quantity": 2,
                    "unit_price": 250.0,
                    "subtotal": 500.0
                }
            ]
        }
        
        response = await client.post(f"{BASE_URL}/api/orders", json=order_data, headers=headers)
        if response.status_code != 201:
            print(f"❌ Order creation failed: {response.text}")
            return
        
        order = response.json()
        print(f"✅ Order created: {order['order_number']}")

        # 3. Lookup customer by phone
        response = await client.get(f"{BASE_URL}/api/customers/by-phone/{TEST_PHONE}", headers=headers)
        if response.status_code != 200:
            print(f"❌ Customer lookup failed: {response.text}")
            return
        
        customer = response.json()
        customer_id = customer['id']
        print(f"✅ Customer found: {customer['name']} (ID: {customer_id})")

        # 4. Fetch order history
        response = await client.get(f"{BASE_URL}/api/customers/{customer_id}/orders", headers=headers)
        if response.status_code != 200:
            print(f"❌ History fetch failed: {response.text}")
            return
        
        history = response.json()
        print(f"✅ History retrieved: {len(history)} orders")
        if any(o['id'] == order['id'] for o in history):
             print("🌟 SUCCESS: Order found in customer history!")
        else:
             print("❌ FAILURE: Order NOT found in customer history!")

if __name__ == "__main__":
    # Note: This requires the server to be running and a user with these credentials to exist.
    # We might need to adjust credentials based on existing users.
    print("Starting verification...")
    asyncio.run(verify_flow())

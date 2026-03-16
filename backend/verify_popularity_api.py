import httpx
import asyncio

async def verify_popularity():
    url = "http://localhost:8000/api/auth/login"
    login_data = {"email": "test@example.com", "password": "password123"}
    
    async with httpx.AsyncClient() as client:
        # Step 1: Login
        print("Logging in...")
        resp = await client.post(url, json=login_data)
        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            return
        
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 2: Get Item Popularity
        print("Fetching item popularity intelligence...")
        pop_url = "http://localhost:8000/api/analytics/item-popularity?period=last_30_days"
        resp = await client.get(pop_url, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            print("\nIntelligence Data Received:")
            print(f"Total Items Analyzed: {data['total_items_analyzed']}")
            
            print("\nTop 5 Popular Items:")
            for i, item in enumerate(data['items'][:5]):
                print(f"{i+1}. {item['name']} - Category: {item['category']}")
                print(f"   Score: {item['popularity_score']}% | Orders: {item['order_count']} | Revenue: ₹{item['revenue']}")
                print(f"   Profit Margin: ₹{item['profit']} | ROI: {((item['profit'] / (item['making_cost'] * item['order_count'] or 1)) * 100):.0f}%")
        else:
            print(f"API Error: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    asyncio.run(verify_popularity())

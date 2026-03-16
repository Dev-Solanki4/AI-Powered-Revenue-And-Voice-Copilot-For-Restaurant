# ==========================================
# PetPooja Backend - Analytics & Intelligence Routes
# GET /api/analytics/item-popularity — Highest order items
# ==========================================

from fastapi import APIRouter, Depends, Query
from database import get_db_pool
from auth import get_current_user
import pandas as pd
try:
    from mlxtend.frequent_patterns import fpgrowth, association_rules
    from mlxtend.preprocessing import TransactionEncoder
except ImportError:
    fpgrowth = None
    association_rules = None
    TransactionEncoder = None

def _naive_association_miner(dataset, min_support=0.01, min_confidence=0.1):
    """
    Fallback 2-itemset association miner if mlxtend is not available.
    Returns something compatible with our expected rule format.
    """
    from collections import Counter
    from itertools import combinations
    
    total_tx = len(dataset)
    if total_tx == 0: return pd.DataFrame()
    
    item_counts = Counter()
    pair_counts = Counter()
    
    for tx in dataset:
        unique_items = sorted(set(tx))
        for item in unique_items:
            item_counts[item] += 1
        for p1, p2 in combinations(unique_items, 2):
            pair_counts[(p1, p2)] += 1
            
    rules_data = []
    for (a, b), count in pair_counts.items():
        support = count / total_tx
        if support < min_support: continue
        
        # Rule a -> b
        conf_a = count / item_counts[a]
        lift_a = conf_a / (item_counts[b] / total_tx)
        if conf_a >= min_confidence:
            rules_data.append({
                'antecedents': frozenset([a]), 'consequents': frozenset([b]),
                'support': support, 'confidence': conf_a, 'lift': lift_a
            })
            
        # Rule b -> a
        conf_b = count / item_counts[b]
        lift_b = conf_b / (item_counts[a] / total_tx)
        if conf_b >= min_confidence:
            rules_data.append({
                'antecedents': frozenset([b]), 'consequents': frozenset([a]),
                'support': support, 'confidence': conf_b, 'lift': lift_b
            })
            
    return pd.DataFrame(rules_data)

from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def _period_range(period: str):
    """Return (start, end) datetimes for the given period filter."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    if period == "today":
        return today_start, now
    elif period == "this_week":
        start = today_start - timedelta(days=today_start.weekday())
        return start, now
    elif period == "this_month":
        start = today_start.replace(day=1)
        return start, now
    elif period == "last_30_days":
        return today_start - timedelta(days=30), now
    else:
        return today_start - timedelta(days=30), now

@router.get("/item-popularity")
async def get_item_popularity(
    period: str = Query("last_30_days", regex="^(today|this_week|this_month|last_30_days)$"),
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    start, end = _period_range(period)

    async with pool.acquire() as conn:
        # Query for item popularity scores
        rows = await conn.fetch(
            """
            SELECT 
                mi.id,
                mi.name,
                mc.name as category,
                mi.price,
                mi.making_cost,
                COUNT(oi.id) as order_frequency,
                SUM(oi.subtotal) as total_revenue,
                SUM(oi.subtotal - (COALESCE(mi.making_cost, 0) * oi.quantity)) as total_profit
            FROM menu_items mi
            LEFT JOIN order_items oi ON oi.menu_item_id = mi.id
            LEFT JOIN orders o ON o.id = oi.order_id
            LEFT JOIN menu_categories mc ON mc.id = mi.category_id
            WHERE o.restaurant_id = $1
              AND o.created_at >= $2 
              AND o.created_at <= $3
              AND o.status != 'cancelled'
            GROUP BY mi.id, mi.name, category, mi.price, mi.making_cost
            ORDER BY order_frequency DESC, total_revenue DESC, mi.name ASC
            LIMIT 20
            """,
            restaurant_id, start, end
        )

        if not rows:
            return {"items": []}

        # Calculate scores
        max_freq = max(r["order_frequency"] for r in rows) if rows else 1
        
        items = []
        for r in rows:
            # Popularity score is 0-100 based on frequency relative to max
            popularity_score = round((r["order_frequency"] / max_freq) * 100, 1)
            
            items.append({
                "id": str(r["id"]),
                "name": r["name"],
                "category": r["category"] or "Uncategorized",
                "price": float(r["price"]),
                "making_cost": float(r["making_cost"] or 0),
                "order_count": int(r["order_frequency"]),
                "revenue": float(r["total_revenue"]),
                "profit": float(r["total_profit"]),
                "popularity_score": popularity_score,
                # Random trend for UI flavor
                "trend": "up" if popularity_score > 70 else "stable"
            })

        return {
            "period": period,
            "total_items_analyzed": len(items),
            "items": items
        }

@router.get("/menu-engineering")
async def get_menu_engineering(
    period: str = Query("last_30_days", regex="^(today|this_week|this_month|last_30_days)$"),
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    start, end = _period_range(period)

    async with pool.acquire() as conn:
        # Fetch all items that have sales in the period
        # We need more items than just top 20 for a full menu analysis
        rows = await conn.fetch(
            """
            SELECT 
                mi.id,
                mi.name,
                mi.price,
                mi.making_cost,
                SUM(oi.quantity) as total_quantity
            FROM menu_items mi
            JOIN order_items oi ON oi.menu_item_id = mi.id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.restaurant_id = $1
              AND o.created_at >= $2 
              AND o.created_at <= $3
              AND o.status != 'cancelled'
            GROUP BY mi.id, mi.name, mi.price, mi.making_cost
            """,
            restaurant_id, start, end
        )

        if not rows:
            return {"items": [], "averages": {}}

        # Convert to DataFrame for easier calculation
        df = pd.DataFrame([dict(r) for r in rows])
        df['id'] = df['id'].astype(str)
        df['price'] = df['price'].astype(float)
        df['making_cost'] = df['making_cost'].astype(float).fillna(0)
        df['total_quantity'] = df['total_quantity'].astype(int)

        # 1. Calculate Contribution Margin
        df['margin'] = df['price'] - df['making_cost']

        # 2. Calculate Popularity Score (Selection rate)
        total_volume = df['total_quantity'].sum()
        df['popularity_score'] = df['total_quantity'] / total_volume

        # 3. Compute Averages
        avg_margin = df['margin'].mean()
        # Benchmark for popularity: 1/N (where N is number of menu items)
        avg_popularity = 1.0 / len(df) if len(df) > 0 else 0

        # 4. Classify
        def classify(row):
            high_m = row['margin'] >= avg_margin
            high_p = row['popularity_score'] >= avg_popularity

            if high_m and high_p:
                return "Star", "promote on menu", f"{row['name']} is a high-profit and high-popularity item. Keeping it prominent on your menu will maximize your overall earnings."
            elif high_m and not high_p:
                return "Puzzle", "increase visibility or marketing", f"{row['name']} has a high profit margin but relatively low sales. Promoting it or adding it to combos could significantly increase profit."
            elif not high_m and high_p:
                return "Plowhorse", "consider price increase", f"{row['name']} is very popular but has a low profit margin. A small price increase could turn its high volume into serious profit."
            else:
                return "Dog", "consider removing or redesigning item", f"{row['name']} has low popularity and low profit. You might want to redesign the dish or replace it with a more profitable option."

        df[['category', 'recommended_action', 'insight']] = df.apply(
            lambda r: pd.Series(classify(r)), axis=1
        )

        # Build response
        items = df.to_dict('records')

        return {
            "period": period,
            "total_items": len(items),
            "averages": {
                "margin": float(avg_margin),
                "popularity": float(avg_popularity)
            },
            "items": items
        }

@router.get("/combo-recommendations")
async def get_combo_recommendations(
    period: str = Query("last_30_days", regex="^(today|this_week|this_month|last_30_days)$"),
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    start, end = _period_range(period)

    async with pool.acquire() as conn:
        # Fetch order line items for baskets
        rows = await conn.fetch(
            """
            SELECT 
                o.id as order_id,
                mi.name as item_name,
                mi.id as item_id,
                mi.price,
                mi.making_cost
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN menu_items mi ON mi.id = oi.menu_item_id
            WHERE o.restaurant_id = $1
              AND o.created_at >= $2 
              AND o.created_at <= $3
              AND o.status != 'cancelled'
            """,
            restaurant_id, start, end
        )

        if not rows or fpgrowth is None:
            return {
                "recommendations": [],
                "error": "Not enough data or ml library missing" if fpgrowth is None else None
            }

        # Convert to transaction list
        baskets = {}
        item_meta = {}
        for r in rows:
            oid = str(r["order_id"])
            if oid not in baskets:
                baskets[oid] = []
            baskets[oid].append(r["item_name"])
            item_meta[r["item_name"]] = {
                "id": str(r["item_id"]),
                "price": float(r["price"]),
                "cost": float(r["making_cost"] or 0)
            }

        # Association Analysis
        dataset = list(baskets.values())
        if not dataset:
            return {"recommendations": []}
            
        if fpgrowth is not None and TransactionEncoder is not None:
            te = TransactionEncoder()
            te_ary = te.fit(dataset).transform(dataset)
            df = pd.DataFrame(te_ary, columns=te.columns_)

            # Find frequent itemsets
            frequent_itemsets = fpgrowth(df, min_support=0.01, use_colnames=True)
            
            if frequent_itemsets.empty:
                return {"recommendations": []}

            # Generate Rules
            rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.1)
        else:
            # Fallback to naive miner
            rules = _naive_association_miner(dataset, min_support=0.01, min_confidence=0.1)
        
        if rules.empty:
            return {"recommendations": []}

        # Filter and Format recommendations
        rules = rules[rules['confidence'] > 0.1].sort_values('lift', ascending=False)
        
        recommendations = []
        for idx, row in rules.head(10).iterrows():
            antecedents = list(row['antecedents'])
            consequents = list(row['consequents'])
            
            # Calculate metrics
            combo_name = f"{antecedents[0]} + {consequents[0]}"
            total_price = sum(item_meta[i]["price"] for i in antecedents + consequents)
            total_cost = sum(item_meta[i]["cost"] for i in antecedents + consequents)
            margin = total_price - total_cost
            
            # Recommendation Logic
            insight = f"Customers who buy {antecedents[0]} are {row['lift']:.1f}x more likely to also order {consequents[0]}."
            
            recommendations.append({
                "items": antecedents + consequents,
                "combo_name": combo_name,
                "confidence": float(row['confidence']),
                "lift": float(row['lift']),
                "support": float(row['support']),
                "total_price": total_price,
                "total_margin": margin,
                "insight": insight,
                "recommended_action": f"Create a '{combo_name}' bundle with a 5-10% discount to drive volume."
            })

        return {
            "period": period,
            "total_transactions": len(dataset),
            "recommendations": recommendations
        }

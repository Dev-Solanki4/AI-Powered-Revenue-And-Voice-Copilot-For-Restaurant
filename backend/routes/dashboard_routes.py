# ==========================================
# PetPooja Backend - Dashboard Analytics Routes
# GET /api/dashboard — All KPIs + chart data
# ==========================================

from fastapi import APIRouter, Depends, Query
from database import get_db_pool
from auth import get_current_user
from datetime import datetime, timezone, timedelta
import calendar

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _period_range(period: str):
    """Return (start, end) datetimes for the given period filter."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    if period == "today":
        return today_start, now
    elif period == "this_week":
        start = today_start - timedelta(days=today_start.weekday())  # Monday
        return start, now
    elif period == "this_month":
        start = today_start.replace(day=1)
        return start, now
    elif period == "last_30_days":
        return today_start - timedelta(days=30), now
    else:
        # Default: this week
        start = today_start - timedelta(days=today_start.weekday())
        return start, now


# ==========================================
# GET /api/dashboard
# ==========================================
@router.get("")
async def get_dashboard(
    period: str = Query("this_week", regex="^(today|this_week|this_month|last_30_days)$"),
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    start, end = _period_range(period)

    async with pool.acquire() as conn:
        # ── KPIs ──
        kpi_row = await conn.fetchrow(
            """
            SELECT
                COALESCE(COUNT(*), 0)                       AS total_orders,
                COALESCE(SUM(total), 0)                     AS total_sales,
                COALESCE(AVG(total), 0)                     AS avg_order_value,
                COALESCE(SUM(discount_amount), 0)           AS total_discount,
                COALESCE(SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END), 0) AS cancelled_orders
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
            """,
            restaurant_id, start, end,
        )

        # Previous period for comparison
        duration = end - start
        prev_start = start - duration
        prev_end = start

        prev_kpi = await conn.fetchrow(
            """
            SELECT
                COALESCE(COUNT(*), 0)           AS total_orders,
                COALESCE(SUM(total), 0)         AS total_sales,
                COALESCE(AVG(total), 0)         AS avg_order_value,
                COALESCE(SUM(discount_amount), 0) AS total_discount
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
            """,
            restaurant_id, prev_start, prev_end,
        )

        # Payment method breakdown
        payment_rows = await conn.fetch(
            """
            SELECT payment_method, COUNT(*) AS cnt
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
              AND payment_method IS NOT NULL
            GROUP BY payment_method
            """,
            restaurant_id, start, end,
        )
        payment_methods = {r["payment_method"]: r["cnt"] for r in payment_rows}

        # Table turnover (completed orders / total tables)
        table_count_row = await conn.fetchrow(
            "SELECT COUNT(*) AS cnt FROM tables WHERE restaurant_id = $1",
            restaurant_id,
        )
        table_count = table_count_row["cnt"] if table_count_row else 1
        table_turnover = round(float(kpi_row["total_orders"]) / max(table_count, 1), 1)

        # ── Revenue Trend (daily) ──
        revenue_rows = await conn.fetch(
            """
            SELECT
                TO_CHAR(created_at, 'Dy')   AS day_name,
                DATE_TRUNC('day', created_at) AS day_date,
                COALESCE(SUM(CASE WHEN order_type = 'dine_in' THEN total ELSE 0 END), 0) AS dine_in,
                COALESCE(SUM(CASE WHEN order_type != 'dine_in' THEN total ELSE 0 END), 0) AS online,
                COALESCE(SUM(total), 0) AS total_val
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
              AND status != 'cancelled'
            GROUP BY day_date, day_name
            ORDER BY day_date
            """,
            restaurant_id, start, end,
        )
        revenue_trend = [
            {"name": r["day_name"].strip(), "dineIn": float(r["dine_in"]), "online": float(r["online"]), "value": float(r["total_val"])}
            for r in revenue_rows
        ]

        # ── Category Revenue (pie chart) ──
        cat_rows = await conn.fetch(
            """
            SELECT
                COALESCE(mc.name, 'Other') AS category_name,
                COALESCE(SUM(oi.subtotal), 0) AS revenue
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
            LEFT JOIN menu_categories mc ON mc.id = mi.category_id
            WHERE o.restaurant_id = $1
              AND o.created_at >= $2 AND o.created_at <= $3
              AND o.status != 'cancelled'
            GROUP BY mc.name
            ORDER BY revenue DESC
            """,
            restaurant_id, start, end,
        )
        category_revenue = [
            {"name": r["category_name"], "value": float(r["revenue"])}
            for r in cat_rows
        ]

        # ── Hourly Data (bar chart) ──
        hour_rows = await conn.fetch(
            """
            SELECT
                EXTRACT(HOUR FROM created_at)::int AS hr,
                COALESCE(SUM(total), 0) AS revenue
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
              AND status != 'cancelled'
            GROUP BY hr
            ORDER BY hr
            """,
            restaurant_id, start, end,
        )
        # Format hour labels like "10AM", "1PM"
        def fmt_hour(h):
            if h == 0:
                return "12AM"
            elif h < 12:
                return f"{h}AM"
            elif h == 12:
                return "12PM"
            else:
                return f"{h - 12}PM"

        hourly_data = [
            {"name": fmt_hour(r["hr"]), "value": float(r["revenue"])}
            for r in hour_rows
        ]

        # ── Monthly Comparison (current year vs previous year) ──
        now = datetime.now(timezone.utc)
        current_year = now.year
        prev_year = current_year - 1

        monthly_rows = await conn.fetch(
            """
            SELECT
                EXTRACT(MONTH FROM created_at)::int AS mon,
                EXTRACT(YEAR FROM created_at)::int  AS yr,
                COALESCE(SUM(total), 0) AS revenue
            FROM orders
            WHERE restaurant_id = $1
              AND EXTRACT(YEAR FROM created_at) IN ($2, $3)
              AND status != 'cancelled'
            GROUP BY yr, mon
            ORDER BY mon
            """,
            restaurant_id, current_year, prev_year,
        )
        # Build month map
        month_map = {}
        for r in monthly_rows:
            mon = int(r["mon"])
            yr = int(r["yr"])
            key = mon
            if key not in month_map:
                month_map[key] = {"name": calendar.month_abbr[mon], "current": 0, "previous": 0, "value": 0}
            if yr == current_year:
                month_map[key]["current"] = float(r["revenue"])
                month_map[key]["value"] = float(r["revenue"])
            else:
                month_map[key]["previous"] = float(r["revenue"])

        monthly_comparison = [month_map[k] for k in sorted(month_map.keys())]

    # ── Build KPIs ──
    def pct_change(current, previous):
        if previous and previous > 0:
            return round(((current - previous) / previous) * 100, 1)
        return 0.0

    total_sales = float(kpi_row["total_sales"])
    total_orders = int(kpi_row["total_orders"])
    avg_order = float(kpi_row["avg_order_value"])
    total_discount_val = float(kpi_row["total_discount"])
    cancelled = int(kpi_row["cancelled_orders"])
    cancel_rate = round((cancelled / max(total_orders, 1)) * 100, 1)
    discount_pct = round((total_discount_val / max(total_sales, 1)) * 100, 1)

    prev_sales = float(prev_kpi["total_sales"])
    prev_orders = int(prev_kpi["total_orders"])
    prev_avg = float(prev_kpi["avg_order_value"])

    cash_count = payment_methods.get("cash", 0)
    upi_count = payment_methods.get("upi", 0)
    online_ratio = round((upi_count + payment_methods.get("card", 0)) / max(total_orders, 1) * 100)
    dinein_ratio = 100 - online_ratio

    kpis = [
        {"label": "Total Sales", "value": f"₹{total_sales:,.0f}", "change": pct_change(total_sales, prev_sales), "changeLabel": "vs prev period", "icon": "indian-rupee", "trend": "up"},
        {"label": "Total Orders", "value": str(total_orders), "change": pct_change(total_orders, prev_orders), "changeLabel": "vs prev period", "icon": "shopping-bag", "trend": "up"},
        {"label": "Avg Order Value", "value": f"₹{avg_order:,.0f}", "change": pct_change(avg_order, prev_avg), "changeLabel": "vs prev period", "icon": "receipt", "trend": "up"},
        {"label": "Total Discount", "value": f"₹{total_discount_val:,.0f}", "icon": "tag", "trend": "neutral"},
        {"label": "Discount %", "value": f"{discount_pct}%", "icon": "percent", "trend": "down"},
        {"label": "Cancellation Rate", "value": f"{cancel_rate}%", "icon": "x-circle", "trend": "up"},
        {"label": "Table Turnover", "value": f"{table_turnover}x", "icon": "refresh-cw", "trend": "up"},
        {"label": "Online vs Dine-in", "value": f"{online_ratio}/{dinein_ratio}", "icon": "monitor-smartphone", "trend": "neutral"},
        {"label": "Cash Orders", "value": str(cash_count), "icon": "indian-rupee", "trend": "neutral"},
        {"label": "UPI Orders", "value": str(upi_count), "icon": "monitor-smartphone", "trend": "neutral"},
    ]

    return {
        "kpis": kpis,
        "revenue_trend": revenue_trend,
        "category_revenue": category_revenue,
        "hourly_data": hourly_data,
        "monthly_comparison": monthly_comparison,
    }

# ==========================================
# PetPooja Backend - Heatmap Analytics Routes
# GET /api/heatmap — Table occupancy heatmap data
# ==========================================

from fastapi import APIRouter, Depends, Query
from database import get_db_pool
from auth import get_current_user
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/heatmap", tags=["heatmap"])


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
        return today_start.replace(day=1), now
    elif period == "last_30_days":
        return today_start - timedelta(days=30), now
    else:
        return today_start, now


# Hour labels matching the frontend (10AM–11PM = 14 slots, hours 10..23)
HOUR_SLOTS = list(range(10, 24))  # 10, 11, 12, ..., 23


def _fmt_hour(h: int) -> str:
    if h == 0:
        return "12AM"
    elif h < 12:
        return f"{h}AM"
    elif h == 12:
        return "12PM"
    else:
        return f"{h - 12}PM"


@router.get("")
async def get_heatmap(
    period: str = Query("today", regex="^(today|this_week|this_month|last_30_days)$"),
    current_user: dict = Depends(get_current_user),
    pool=Depends(get_db_pool),
):
    restaurant_id = current_user["restaurant_id"]
    start, end = _period_range(period)

    async with pool.acquire() as conn:
        # Get all tables for this restaurant
        table_rows = await conn.fetch(
            """
            SELECT id::text, table_number, capacity
            FROM tables
            WHERE restaurant_id = $1
            ORDER BY table_number
            """,
            restaurant_id,
        )
        tables = [dict(r) for r in table_rows]
        table_count = len(tables)

        if table_count == 0:
            return {
                "heatmap_data": [],
                "summary": {
                    "peak_hour": "-",
                    "busiest_table": "-",
                    "avg_occupancy": "0%",
                    "revenue_density": "₹0/hr",
                },
            }

        # Count number of days in the period for averaging
        days_in_period = max((end - start).days, 1)

        # ── Heatmap matrix: orders per table per hour ──
        # For each table and each hour slot, count how many orders
        # existed during that hour. We use the created_at timestamp
        # to determine which hour an order was placed.
        order_data = await conn.fetch(
            """
            SELECT
                table_id::text AS tid,
                EXTRACT(HOUR FROM created_at)::int AS hr,
                COUNT(*) AS order_count,
                COALESCE(SUM(total), 0) AS revenue
            FROM orders
            WHERE restaurant_id = $1
              AND created_at >= $2 AND created_at <= $3
              AND table_id IS NOT NULL
              AND status != 'cancelled'
            GROUP BY table_id, hr
            ORDER BY table_id, hr
            """,
            restaurant_id, start, end,
        )

        # Build lookup: { table_id: { hour: { count, revenue } } }
        table_hour_map: dict = {}
        for r in order_data:
            tid = r["tid"]
            hr = r["hr"]
            if tid not in table_hour_map:
                table_hour_map[tid] = {}
            table_hour_map[tid][hr] = {
                "count": r["order_count"],
                "revenue": float(r["revenue"]),
            }

        # Find max orders in any single cell for normalization
        max_count = 1
        for tid_data in table_hour_map.values():
            for hr_data in tid_data.values():
                if hr_data["count"] > max_count:
                    max_count = hr_data["count"]

        # Build the 2D heatmap array: tables × hours (14 slots)
        # Values are 0–100 representing occupancy intensity
        heatmap_data = []
        for table in tables:
            row = []
            tid = table["id"]
            for h in HOUR_SLOTS:
                cell = table_hour_map.get(tid, {}).get(h, {"count": 0, "revenue": 0})
                # Normalize to 0–100
                intensity = int((cell["count"] / max_count) * 100) if max_count > 0 else 0
                row.append(intensity)
            heatmap_data.append(row)

        # ── Summary stats ──
        # Peak hour: hour with most total orders
        hourly_totals: dict = {}
        hourly_revenue: dict = {}
        for tid_data in table_hour_map.values():
            for hr, data in tid_data.items():
                hourly_totals[hr] = hourly_totals.get(hr, 0) + data["count"]
                hourly_revenue[hr] = hourly_revenue.get(hr, 0) + data["revenue"]

        peak_hour = "-"
        if hourly_totals:
            peak_hr = max(hourly_totals, key=hourly_totals.get)
            peak_hour = _fmt_hour(peak_hr)

        # Busiest table: table with most orders
        table_totals: dict = {}
        for table in tables:
            tid = table["id"]
            total = sum(d["count"] for d in table_hour_map.get(tid, {}).values())
            table_totals[tid] = {"count": total, "table_number": table["table_number"], "capacity": table["capacity"]}

        busiest_table = "-"
        busiest_sub = ""
        if table_totals:
            busiest_tid = max(table_totals, key=lambda k: table_totals[k]["count"])
            bt = table_totals[busiest_tid]
            if bt["count"] > 0:
                busiest_table = f"T{bt['table_number']}"
                busiest_sub = f"{bt['capacity']}-seater"

        # Avg occupancy: (total occupied table-hours / total possible table-hours) × 100
        total_occupied = sum(
            1 for tid_data in table_hour_map.values()
            for hr, data in tid_data.items()
            if data["count"] > 0 and hr in HOUR_SLOTS
        )
        total_possible = table_count * len(HOUR_SLOTS) * days_in_period
        avg_occupancy = round((total_occupied / max(total_possible, 1)) * 100) if total_possible > 0 else 0

        # Revenue density: total revenue / peak hours count
        total_rev = sum(hourly_revenue.values())
        peak_hours_count = sum(1 for v in hourly_totals.values() if v > 0)
        rev_density = round(total_rev / max(peak_hours_count, 1))

    return {
        "heatmap_data": heatmap_data,
        "summary": {
            "peak_hour": peak_hour,
            "peak_hour_sub": "Highest occupancy",
            "busiest_table": busiest_table,
            "busiest_table_sub": busiest_sub or f"{table_count} tables",
            "avg_occupancy": f"{avg_occupancy}%",
            "avg_occupancy_sub": period.replace("_", " ").title(),
            "revenue_density": f"₹{rev_density:,}/hr",
            "revenue_density_sub": "Peak hours",
        },
    }

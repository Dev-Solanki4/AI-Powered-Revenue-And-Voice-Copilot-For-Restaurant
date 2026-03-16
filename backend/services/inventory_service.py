import asyncpg
import json
from typing import List, Dict, Optional
from datetime import datetime, timezone

class InventoryService:
    @staticmethod
    async def get_recipe_for_item(conn: asyncpg.Connection, menu_item_id: str) -> List[Dict]:
        """Fetch ingredients required for a specific menu item."""
        rows = await conn.fetch(
            """
            SELECT ri.ingredient_id, ri.quantity_required, ri.unit, i.name as ingredient_name
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN inventory i ON ri.ingredient_id = i.id
            WHERE r.menu_item_id = $1::uuid
            """,
            menu_item_id
        )
        return [dict(r) for r in rows]

    @staticmethod
    async def check_item_availability(conn: asyncpg.Connection, menu_item_id: str, quantity: int = 1) -> Dict:
        """
        Evaluate if sufficient stock exists for a given menu item and quantity.
        Returns: {'available': bool, 'insufficient_ingredients': List[str]}
        """
        ingredients = await InventoryService.get_recipe_for_item(conn, menu_item_id)
        if not ingredients:
            return {'available': True, 'insufficient_ingredients': []}

        insufficient = []
        for ing in ingredients:
            total_needed = float(ing['quantity_required']) * quantity
            # Get current stock
            stock_row = await conn.fetchrow(
                "SELECT current_stock, name FROM inventory WHERE id = $1",
                ing['ingredient_id']
            )
            if not stock_row or stock_row['current_stock'] < total_needed:
                insufficient.append(ing['ingredient_name'])

        return {
            'available': len(insufficient) == 0,
            'insufficient_ingredients': insufficient
        }

    @staticmethod
    async def deduct_stock_for_order(conn: asyncpg.Connection, restaurant_id: str, order_id: str):
        """
        Automatically deduct ingredients from inventory based on order items.
        Should be called within a transaction.
        """
        # 1. Fetch all items in the order
        order_items = await conn.fetch(
            "SELECT menu_item_id, quantity FROM order_items WHERE order_id = $1::uuid",
            order_id
        )

        for item in order_items:
            if not item['menu_item_id']:
                continue
            
            # 2. Get recipe for this item
            recipe_ingredients = await InventoryService.get_recipe_for_item(conn, str(item['menu_item_id']))
            
            for ing in recipe_ingredients:
                deduction_qty = float(ing['quantity_required']) * item['quantity']
                
                # 3. Deduct from inventory
                await conn.execute(
                    """
                    UPDATE inventory 
                    SET current_stock = current_stock - $1 
                    WHERE id = $2 AND restaurant_id = $3::uuid
                    """,
                    deduction_qty, ing['ingredient_id'], restaurant_id
                )

                # 4. Record transaction
                await conn.execute(
                    """
                    INSERT INTO inventory_transactions 
                    (restaurant_id, ingredient_id, quantity_change, transaction_type, reference_id)
                    VALUES ($1::uuid, $2, $3, 'sale', $4::uuid)
                    """,
                    restaurant_id, ing['ingredient_id'], -deduction_qty, order_id
                )

    @staticmethod
    async def calculate_food_cost(conn: asyncpg.Connection, menu_item_id: str) -> float:
        """Calculate the total cost of ingredients for a menu item."""
        rows = await conn.fetch(
            """
            SELECT ri.quantity_required, i.cost_per_unit
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN inventory i ON ri.ingredient_id = i.id
            WHERE r.menu_item_id = $1::uuid
            """,
            menu_item_id
        )
        total_cost = 0.0
        for r in rows:
            total_cost += float(r['quantity_required']) * float(r['cost_per_unit'])
        return total_cost

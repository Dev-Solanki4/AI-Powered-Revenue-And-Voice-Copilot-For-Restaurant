-- Migration: Recipe-Based Inventory Management System

-- 1. Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(menu_item_id) -- One recipe per menu item
);

-- 2. Create recipe_ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    quantity_required DECIMAL NOT NULL CHECK (quantity_required > 0),
    unit TEXT NOT NULL, -- e.g., 'g', 'ml', 'piece'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    quantity_change DECIMAL NOT NULL, -- negative for sales/deductions, positive for purchases
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'purchase', 'adjustment', 'waste')),
    reference_id UUID, -- order_id or other reference
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Add food_cost and margin fields to menu_items for profit analytics
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS food_cost DECIMAL DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS margin_percent DECIMAL DEFAULT 0;

-- 5. Create index for performance
CREATE INDEX IF NOT EXISTS idx_recipes_menu_item ON recipes(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_restaurant ON inventory_transactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_ingredient ON inventory_transactions(ingredient_id);

-- ==========================================
-- PetPooja - Full Database Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_name TEXT,
    gstin TEXT,
    address TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users Table (For FastAPI Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'owner',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

-- Index for email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Profiles Table (Optional, for extra metadata)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tables
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    status TEXT DEFAULT 'available', -- 'available', 'active', 'preparing', 'served', 'payment_delayed', 'reserved'
    current_order_id TEXT,
    current_amount DECIMAL(12,2) DEFAULT 0,
    order_started_at TIMESTAMPTZ,
    reserved_for TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(restaurant_id, table_number)
);

-- 5. Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    is_veg BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    modifiers JSONB DEFAULT '[]'::jsonb,
    is_bestseller BOOLEAN DEFAULT false,
    prep_time_minutes INTEGER DEFAULT 15,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL,
    order_type TEXT DEFAULT 'dine_in', -- 'dine_in', 'takeaway', 'zomato', 'swiggy'
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'
    subtotal DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    discount_type TEXT, -- 'percentage', 'flat'
    discount_value DECIMAL(12,2) DEFAULT 0,
    cgst DECIMAL(12,2) DEFAULT 0,
    sgst DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    payment_method TEXT, -- 'cash', 'upi', 'card', 'split'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'completed'
    customer_name TEXT,
    customer_phone TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 8. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    modifiers JSONB DEFAULT '[]'::jsonb,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    current_stock DECIMAL(12,2) DEFAULT 0,
    min_stock DECIMAL(12,2) DEFAULT 0,
    cost_per_unit DECIMAL(12,2) DEFAULT 0,
    supplier TEXT,
    expiry_date TIMESTAMPTZ,
    last_restocked TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Staff Members
CREATE TABLE IF NOT EXISTS staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'cashier', 'manager', 'owner', 'admin', 'chef', 'waiter'
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- ENABLE RLS (Row Level Security)
-- ==========================================
-- Note: Since the backend is custom, we usually use a service role. 
-- But if the frontend uses the anon key directly, we need these.

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

-- Simple policies (allow all for now to avoid blocking development, 
-- but in production we should filter by auth.uid() or a custom claim)

CREATE POLICY "Allow public read access" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tables FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON inventory FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON staff_members FOR SELECT USING (true);

-- ==========================================
-- Inventory RLS Write Policies (add these if not done)
-- ==========================================
CREATE POLICY IF NOT EXISTS "Allow all operations on inventory" ON inventory
  USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations on inventory" ON inventory
  FOR ALL USING (true) WITH CHECK (true);

// ==========================================
// PetPooja - Type Definitions
// ==========================================

export type TableStatus = 'available' | 'active' | 'preparing' | 'served' | 'payment_delayed' | 'reserved';

export interface Restaurant {
  id: string;
  name: string;
  owner_name: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface TableData {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  status: TableStatus;
  current_order_id?: string;
  current_amount: number;
  order_started_at?: string;
  reserved_for?: string;
  order_type?: 'dine_in' | 'reserved' | 'split';
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active?: boolean;
}

export interface RecipeIngredient {
  id: string;
  ingredient_id: string;
  ingredient_name?: string;
  quantity_required: number;
  unit: string;
}

export interface Recipe {
  id: string;
  menu_item_id: string;
  ingredients: RecipeIngredient[];
  food_cost: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  price: number;
  description?: string;
  is_veg: boolean;
  is_available: boolean;
  image_url?: string;
  modifiers?: MenuModifier[];
  is_bestseller?: boolean;
  prep_time_minutes?: number;
  making_cost?: number;
  food_cost?: number;
  margin_percent?: number;
  recipe?: Recipe;
  sort_order?: number;
}

export interface MenuModifier {
  id: string;
  name: string;
  price: number;
  group?: string;
}

export interface OrderItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  modifiers: MenuModifier[];
  notes?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id?: string;
  order_number: string;
  type: 'dine_in' | 'takeaway' | 'zomato' | 'swiggy';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  discount_type?: 'percentage' | 'flat';
  discount_value?: number;
  cgst: number;
  sgst: number;
  total: number;
  payment_method?: 'cash' | 'upi' | 'card' | 'split';
  payment_status: 'pending' | 'partial' | 'completed';
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface Invoice {
  id: string;
  order_id: string;
  invoice_number: string;
  restaurant: Restaurant;
  order: Order;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  restaurant_id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  cost_per_unit: number;
  supplier: string;
  expiry_date?: string;
  last_restocked: string;
}

export interface StaffMember {
  id: string;
  restaurant_id: string;
  name: string;
  role: 'cashier' | 'manager' | 'owner' | 'admin' | 'chef' | 'waiter';
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TableAlert {
  id: string;
  type: 'unpaid' | 'prep_delay' | 'idle_reservation' | 'high_value';
  table_number: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}

export interface OnlineOrder {
  id: string;
  platform: 'zomato' | 'swiggy';
  order_id: string;
  customer_name: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'rejected';
  created_at: string;
  estimated_delivery?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  charts?: ChartDataPoint[][];
  timestamp: string;
}

export type Theme = 'light' | 'dark';

export type UserRole = 'cashier' | 'manager' | 'owner' | 'admin';

// ==========================================
// PetPooja - Mock Data
// ==========================================

import { TableData, MenuCategory, MenuItem, Order, OrderItem, InventoryItem, DashboardKPI, ChartDataPoint, TableAlert, OnlineOrder, Restaurant } from '../types';

export const mockRestaurant: Restaurant = {
    id: 'rest_001',
    name: 'PetPooja Restaurant',
    owner_name: 'Rajesh Patel',
    gstin: '27AABCU9603R1ZM',
    address: '42, MG Road, Andheri West, Mumbai - 400058',
    phone: '9876543210',
    email: 'rajesh@petpooja.com',
    created_at: '2024-01-15T10:00:00Z',
};

export const mockCategories: MenuCategory[] = [
    { id: 'cat_1', restaurant_id: 'rest_001', name: 'Starters', icon: '🥗', sort_order: 1 },
    { id: 'cat_2', restaurant_id: 'rest_001', name: 'Main Course', icon: '🍛', sort_order: 2 },
    { id: 'cat_3', restaurant_id: 'rest_001', name: 'Breads', icon: '🫓', sort_order: 3 },
    { id: 'cat_4', restaurant_id: 'rest_001', name: 'Rice & Biryani', icon: '🍚', sort_order: 4 },
    { id: 'cat_5', restaurant_id: 'rest_001', name: 'Beverages', icon: '🥤', sort_order: 5 },
    { id: 'cat_6', restaurant_id: 'rest_001', name: 'Desserts', icon: '🍰', sort_order: 6 },
    { id: 'cat_7', restaurant_id: 'rest_001', name: 'Chinese', icon: '🥡', sort_order: 7 },
    { id: 'cat_8', restaurant_id: 'rest_001', name: 'South Indian', icon: '🥘', sort_order: 8 },
];

export const mockMenuItems: MenuItem[] = [
    // Starters
    { id: 'item_1', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Paneer Tikka', price: 280, is_veg: true, is_available: true, description: 'Marinated cottage cheese grilled in tandoor', modifiers: [{ id: 'mod_1', name: 'Extra Cheese', price: 40 }, { id: 'mod_2', name: 'Spicy', price: 0 }] },
    { id: 'item_2', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Chicken Tikka', price: 320, is_veg: false, is_available: true, description: 'Tender chicken marinated in spices' },
    { id: 'item_3', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Hara Bhara Kebab', price: 220, is_veg: true, is_available: true, description: 'Spinach and peas kebab' },
    { id: 'item_4', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Fish Amritsari', price: 380, is_veg: false, is_available: true, description: 'Crispy fried fish with spices' },
    { id: 'item_5', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Mushroom Galouti', price: 260, is_veg: true, is_available: true },
    { id: 'item_6', restaurant_id: 'rest_001', category_id: 'cat_1', name: 'Tandoori Prawns', price: 450, is_veg: false, is_available: true },
    // Main Course
    { id: 'item_7', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Butter Chicken', price: 350, is_veg: false, is_available: true, description: 'Creamy tomato-based chicken curry', modifiers: [{ id: 'mod_3', name: 'Boneless', price: 30 }] },
    { id: 'item_8', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Paneer Butter Masala', price: 280, is_veg: true, is_available: true, description: 'Cottage cheese in rich gravy' },
    { id: 'item_9', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Dal Makhani', price: 240, is_veg: true, is_available: true, description: 'Slow-cooked black lentils' },
    { id: 'item_10', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Mutton Rogan Josh', price: 420, is_veg: false, is_available: true },
    { id: 'item_11', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Palak Paneer', price: 260, is_veg: true, is_available: true },
    { id: 'item_12', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Chicken Biryani Gravy', price: 340, is_veg: false, is_available: true },
    { id: 'item_13', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Kadai Paneer', price: 270, is_veg: true, is_available: true },
    { id: 'item_14', restaurant_id: 'rest_001', category_id: 'cat_2', name: 'Malai Kofta', price: 290, is_veg: true, is_available: true },
    // Breads
    { id: 'item_15', restaurant_id: 'rest_001', category_id: 'cat_3', name: 'Butter Naan', price: 60, is_veg: true, is_available: true },
    { id: 'item_16', restaurant_id: 'rest_001', category_id: 'cat_3', name: 'Garlic Naan', price: 80, is_veg: true, is_available: true },
    { id: 'item_17', restaurant_id: 'rest_001', category_id: 'cat_3', name: 'Tandoori Roti', price: 40, is_veg: true, is_available: true },
    { id: 'item_18', restaurant_id: 'rest_001', category_id: 'cat_3', name: 'Laccha Paratha', price: 70, is_veg: true, is_available: true },
    { id: 'item_19', restaurant_id: 'rest_001', category_id: 'cat_3', name: 'Cheese Naan', price: 100, is_veg: true, is_available: true },
    // Rice
    { id: 'item_20', restaurant_id: 'rest_001', category_id: 'cat_4', name: 'Veg Biryani', price: 260, is_veg: true, is_available: true },
    { id: 'item_21', restaurant_id: 'rest_001', category_id: 'cat_4', name: 'Chicken Biryani', price: 320, is_veg: false, is_available: true },
    { id: 'item_22', restaurant_id: 'rest_001', category_id: 'cat_4', name: 'Mutton Biryani', price: 380, is_veg: false, is_available: true },
    { id: 'item_23', restaurant_id: 'rest_001', category_id: 'cat_4', name: 'Jeera Rice', price: 140, is_veg: true, is_available: true },
    { id: 'item_24', restaurant_id: 'rest_001', category_id: 'cat_4', name: 'Steam Rice', price: 100, is_veg: true, is_available: true },
    // Beverages
    { id: 'item_25', restaurant_id: 'rest_001', category_id: 'cat_5', name: 'Masala Chai', price: 40, is_veg: true, is_available: true },
    { id: 'item_26', restaurant_id: 'rest_001', category_id: 'cat_5', name: 'Cold Coffee', price: 120, is_veg: true, is_available: true },
    { id: 'item_27', restaurant_id: 'rest_001', category_id: 'cat_5', name: 'Fresh Lime Soda', price: 80, is_veg: true, is_available: true },
    { id: 'item_28', restaurant_id: 'rest_001', category_id: 'cat_5', name: 'Mango Lassi', price: 100, is_veg: true, is_available: true },
    { id: 'item_29', restaurant_id: 'rest_001', category_id: 'cat_5', name: 'Buttermilk', price: 60, is_veg: true, is_available: true },
    // Desserts
    { id: 'item_30', restaurant_id: 'rest_001', category_id: 'cat_6', name: 'Gulab Jamun', price: 100, is_veg: true, is_available: true },
    { id: 'item_31', restaurant_id: 'rest_001', category_id: 'cat_6', name: 'Rasmalai', price: 120, is_veg: true, is_available: true },
    { id: 'item_32', restaurant_id: 'rest_001', category_id: 'cat_6', name: 'Brownie Sundae', price: 180, is_veg: true, is_available: true },
    // Chinese
    { id: 'item_33', restaurant_id: 'rest_001', category_id: 'cat_7', name: 'Veg Manchurian', price: 220, is_veg: true, is_available: true },
    { id: 'item_34', restaurant_id: 'rest_001', category_id: 'cat_7', name: 'Chicken Fried Rice', price: 240, is_veg: false, is_available: true },
    { id: 'item_35', restaurant_id: 'rest_001', category_id: 'cat_7', name: 'Hakka Noodles', price: 200, is_veg: true, is_available: true },
    { id: 'item_36', restaurant_id: 'rest_001', category_id: 'cat_7', name: 'Chilli Chicken', price: 280, is_veg: false, is_available: true },
    // South Indian
    { id: 'item_37', restaurant_id: 'rest_001', category_id: 'cat_8', name: 'Masala Dosa', price: 140, is_veg: true, is_available: true },
    { id: 'item_38', restaurant_id: 'rest_001', category_id: 'cat_8', name: 'Idli Sambar', price: 100, is_veg: true, is_available: true },
    { id: 'item_39', restaurant_id: 'rest_001', category_id: 'cat_8', name: 'Rava Dosa', price: 150, is_veg: true, is_available: true },
    { id: 'item_40', restaurant_id: 'rest_001', category_id: 'cat_8', name: 'Uttapam', price: 130, is_veg: true, is_available: true },
];

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

export const mockTables: TableData[] = [
    { id: 't_1', restaurant_id: 'rest_001', table_number: 1, capacity: 4, status: 'active', current_order_id: 'ord_1', current_amount: 1250, order_started_at: minutesAgo(32) },
    { id: 't_2', restaurant_id: 'rest_001', table_number: 2, capacity: 2, status: 'available', current_amount: 0 },
    { id: 't_3', restaurant_id: 'rest_001', table_number: 3, capacity: 6, status: 'preparing', current_order_id: 'ord_2', current_amount: 2180, order_started_at: minutesAgo(18) },
    { id: 't_4', restaurant_id: 'rest_001', table_number: 4, capacity: 4, status: 'served', current_order_id: 'ord_3', current_amount: 960, order_started_at: minutesAgo(45) },
    { id: 't_5', restaurant_id: 'rest_001', table_number: 5, capacity: 2, status: 'payment_delayed', current_order_id: 'ord_4', current_amount: 1840, order_started_at: minutesAgo(62) },
    { id: 't_6', restaurant_id: 'rest_001', table_number: 6, capacity: 8, status: 'reserved', current_amount: 0, reserved_for: 'Mr. Sharma - 8:00 PM' },
    { id: 't_7', restaurant_id: 'rest_001', table_number: 7, capacity: 4, status: 'active', current_order_id: 'ord_5', current_amount: 680, order_started_at: minutesAgo(12) },
    { id: 't_8', restaurant_id: 'rest_001', table_number: 8, capacity: 2, status: 'available', current_amount: 0 },
    { id: 't_9', restaurant_id: 'rest_001', table_number: 9, capacity: 4, status: 'preparing', current_order_id: 'ord_6', current_amount: 1520, order_started_at: minutesAgo(8) },
    { id: 't_10', restaurant_id: 'rest_001', table_number: 10, capacity: 6, status: 'active', current_order_id: 'ord_7', current_amount: 3200, order_started_at: minutesAgo(25) },
    { id: 't_11', restaurant_id: 'rest_001', table_number: 11, capacity: 2, status: 'available', current_amount: 0 },
    { id: 't_12', restaurant_id: 'rest_001', table_number: 12, capacity: 4, status: 'served', current_order_id: 'ord_8', current_amount: 1100, order_started_at: minutesAgo(38) },
    { id: 't_13', restaurant_id: 'rest_001', table_number: 13, capacity: 4, status: 'available', current_amount: 0 },
    { id: 't_14', restaurant_id: 'rest_001', table_number: 14, capacity: 6, status: 'preparing', current_order_id: 'ord_9', current_amount: 2600, order_started_at: minutesAgo(15) },
    { id: 't_15', restaurant_id: 'rest_001', table_number: 15, capacity: 2, status: 'active', current_order_id: 'ord_10', current_amount: 460, order_started_at: minutesAgo(5) },
    { id: 't_16', restaurant_id: 'rest_001', table_number: 16, capacity: 8, status: 'available', current_amount: 0 },
];

export const mockAlerts: TableAlert[] = [
    { id: 'alert_1', type: 'unpaid', table_number: 5, message: 'Table 5 served but unpaid for 17+ minutes', severity: 'critical', created_at: minutesAgo(2) },
    { id: 'alert_2', type: 'prep_delay', table_number: 3, message: 'Table 3 order preparation exceeding 15 minutes', severity: 'warning', created_at: minutesAgo(3) },
    { id: 'alert_3', type: 'high_value', table_number: 10, message: 'Table 10 has a high-value order (₹3,200)', severity: 'info', created_at: minutesAgo(5) },
    { id: 'alert_4', type: 'idle_reservation', table_number: 6, message: 'Reservation for Table 6 in 30 minutes', severity: 'info', created_at: minutesAgo(1) },
];

export const mockInventory: InventoryItem[] = [
    { id: 'inv_1', restaurant_id: 'rest_001', name: 'Onions', category: 'Vegetables', unit: 'kg', current_stock: 8, min_stock: 15, cost_per_unit: 35, supplier: 'Fresh Farms Ltd', last_restocked: minutesAgo(2880) },
    { id: 'inv_2', restaurant_id: 'rest_001', name: 'Chicken', category: 'Meat', unit: 'kg', current_stock: 12, min_stock: 10, cost_per_unit: 220, supplier: 'Green Poultry', last_restocked: minutesAgo(1440) },
    { id: 'inv_3', restaurant_id: 'rest_001', name: 'Paneer', category: 'Dairy', unit: 'kg', current_stock: 5, min_stock: 8, cost_per_unit: 320, supplier: 'Amul Distributor', last_restocked: minutesAgo(1440), expiry_date: new Date(now.getTime() + 3 * 86400000).toISOString() },
    { id: 'inv_4', restaurant_id: 'rest_001', name: 'Basmati Rice', category: 'Grains', unit: 'kg', current_stock: 45, min_stock: 20, cost_per_unit: 85, supplier: 'India Gate', last_restocked: minutesAgo(4320) },
    { id: 'inv_5', restaurant_id: 'rest_001', name: 'Cooking Oil', category: 'Oils', unit: 'litre', current_stock: 18, min_stock: 10, cost_per_unit: 140, supplier: 'Fortune', last_restocked: minutesAgo(2880) },
    { id: 'inv_6', restaurant_id: 'rest_001', name: 'Tomatoes', category: 'Vegetables', unit: 'kg', current_stock: 6, min_stock: 12, cost_per_unit: 40, supplier: 'Fresh Farms Ltd', last_restocked: minutesAgo(1440) },
    { id: 'inv_7', restaurant_id: 'rest_001', name: 'Butter', category: 'Dairy', unit: 'kg', current_stock: 3, min_stock: 5, cost_per_unit: 480, supplier: 'Amul Distributor', last_restocked: minutesAgo(2160), expiry_date: new Date(now.getTime() + 7 * 86400000).toISOString() },
    { id: 'inv_8', restaurant_id: 'rest_001', name: 'Cream', category: 'Dairy', unit: 'litre', current_stock: 2, min_stock: 4, cost_per_unit: 260, supplier: 'Amul Distributor', last_restocked: minutesAgo(1440), expiry_date: new Date(now.getTime() + 2 * 86400000).toISOString() },
    { id: 'inv_9', restaurant_id: 'rest_001', name: 'Ginger-Garlic Paste', category: 'Spices', unit: 'kg', current_stock: 4, min_stock: 3, cost_per_unit: 120, supplier: 'Everest Foods', last_restocked: minutesAgo(4320) },
    { id: 'inv_10', restaurant_id: 'rest_001', name: 'Flour (Maida)', category: 'Grains', unit: 'kg', current_stock: 25, min_stock: 15, cost_per_unit: 40, supplier: 'Pillsbury', last_restocked: minutesAgo(2880) },
];

export const mockOnlineOrders: OnlineOrder[] = [
    {
        id: 'online_1', platform: 'zomato', order_id: 'ZMT-8842', customer_name: 'Amit Verma',
        items: [
            { id: 'oi_1', menu_item: mockMenuItems[6], quantity: 1, modifiers: [], subtotal: 350 },
            { id: 'oi_2', menu_item: mockMenuItems[14], quantity: 3, modifiers: [], subtotal: 180 },
        ],
        total: 530, status: 'new', created_at: minutesAgo(2),
    },
    {
        id: 'online_2', platform: 'swiggy', order_id: 'SWG-4421', customer_name: 'Priya Singh',
        items: [
            { id: 'oi_3', menu_item: mockMenuItems[7], quantity: 1, modifiers: [], subtotal: 280 },
            { id: 'oi_4', menu_item: mockMenuItems[19], quantity: 1, modifiers: [], subtotal: 260 },
        ],
        total: 540, status: 'accepted', created_at: minutesAgo(8),
    },
    {
        id: 'online_3', platform: 'zomato', order_id: 'ZMT-8843', customer_name: 'Deepak Mehta',
        items: [
            { id: 'oi_5', menu_item: mockMenuItems[20], quantity: 2, modifiers: [], subtotal: 640 },
        ],
        total: 640, status: 'preparing', created_at: minutesAgo(15),
    },
    {
        id: 'online_4', platform: 'swiggy', order_id: 'SWG-4422', customer_name: 'Neha Joshi',
        items: [
            { id: 'oi_6', menu_item: mockMenuItems[0], quantity: 1, modifiers: [], subtotal: 280 },
            { id: 'oi_7', menu_item: mockMenuItems[8], quantity: 1, modifiers: [], subtotal: 240 },
            { id: 'oi_8', menu_item: mockMenuItems[15], quantity: 2, modifiers: [], subtotal: 160 },
        ],
        total: 680, status: 'ready', created_at: minutesAgo(22),
    },
];

// Dashboard mock data
export const mockDashboardKPIs: DashboardKPI[] = [
    { label: 'Total Sales', value: '₹1,84,520', change: 12.5, changeLabel: 'vs last week', icon: 'indian-rupee', trend: 'up' },
    { label: 'Total Orders', value: '342', change: 8.2, changeLabel: 'vs last week', icon: 'shopping-bag', trend: 'up' },
    { label: 'Avg Order Value', value: '₹539', change: 3.8, changeLabel: 'vs last week', icon: 'receipt', trend: 'up' },
    { label: 'Total Profit', value: '₹52,890', change: -2.1, changeLabel: 'vs last week', icon: 'trending-up', trend: 'down' },
    { label: 'Gross Margin', value: '38.4%', change: 1.2, changeLabel: 'vs last month', icon: 'percent', trend: 'up' },
    { label: 'Net Margin', value: '28.7%', change: -0.8, changeLabel: 'vs last month', icon: 'pie-chart', trend: 'down' },
    { label: 'Revenue Growth', value: '+12.5%', change: 12.5, changeLabel: 'MoM', icon: 'bar-chart-3', trend: 'up' },
    { label: 'Repeat Customers', value: '64%', change: 5.3, changeLabel: 'vs last month', icon: 'users', trend: 'up' },
    { label: 'Online vs Dine-in', value: '35/65', icon: 'monitor-smartphone', trend: 'neutral' },
    { label: 'Cancellation Rate', value: '3.2%', change: -1.1, changeLabel: 'vs last week', icon: 'x-circle', trend: 'up' },
    { label: 'Discount Given', value: '5.8%', change: 0.5, changeLabel: 'vs last week', icon: 'tag', trend: 'down' },
    { label: 'Table Turnover', value: '4.2x', change: 0.3, changeLabel: 'vs last week', icon: 'refresh-cw', trend: 'up' },
];

export const mockRevenueData: ChartDataPoint[] = [
    { name: 'Mon', value: 24500, dineIn: 16000, online: 8500 },
    { name: 'Tue', value: 21800, dineIn: 14200, online: 7600 },
    { name: 'Wed', value: 28900, dineIn: 18500, online: 10400 },
    { name: 'Thu', value: 26300, dineIn: 17100, online: 9200 },
    { name: 'Fri', value: 32400, dineIn: 19800, online: 12600 },
    { name: 'Sat', value: 38200, dineIn: 23400, online: 14800 },
    { name: 'Sun', value: 35600, dineIn: 21800, online: 13800 },
];

export const mockHourlyData: ChartDataPoint[] = [
    { name: '10AM', value: 2400 }, { name: '11AM', value: 4800 },
    { name: '12PM', value: 12600 }, { name: '1PM', value: 18200 },
    { name: '2PM', value: 14500 }, { name: '3PM', value: 6200 },
    { name: '4PM', value: 4800 }, { name: '5PM', value: 5600 },
    { name: '6PM', value: 8200 }, { name: '7PM', value: 15400 },
    { name: '8PM', value: 22800 }, { name: '9PM', value: 19600 },
    { name: '10PM', value: 12400 }, { name: '11PM', value: 5200 },
];

export const mockCategoryRevenue: ChartDataPoint[] = [
    { name: 'Main Course', value: 42500 },
    { name: 'Starters', value: 28300 },
    { name: 'Biryani', value: 22100 },
    { name: 'Chinese', value: 18600 },
    { name: 'Breads', value: 12400 },
    { name: 'Beverages', value: 8200 },
    { name: 'Desserts', value: 6800 },
    { name: 'South Indian', value: 5600 },
];

export const mockMonthlyComparison: ChartDataPoint[] = [
    { name: 'Jan', current: 420000, previous: 380000, value: 420000 },
    { name: 'Feb', current: 460000, previous: 410000, value: 460000 },
    { name: 'Mar', current: 510000, previous: 440000, value: 510000 },
    { name: 'Apr', current: 480000, previous: 460000, value: 480000 },
    { name: 'May', current: 540000, previous: 490000, value: 540000 },
    { name: 'Jun', current: 520000, previous: 510000, value: 520000 },
];

// Heatmap data: table occupancy over hours
export const mockHeatmapData = Array.from({ length: 16 }, (_, tableIdx) =>
    Array.from({ length: 14 }, () => Math.floor(Math.random() * 100))
);

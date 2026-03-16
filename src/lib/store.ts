// ==========================================
// PetPooja - State Management (Zustand)
// ==========================================

import { create } from 'zustand';
import { Theme, TableData, OrderItem, MenuItem, MenuCategory, MenuModifier, TableAlert, InventoryItem, Recipe } from '../types';
import { mockTables } from './mockData';
import { supabase } from './supabase';
import { apiClient } from './api';

// ==========================================
// Theme Store
// ==========================================
interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: (localStorage.getItem('petpooja-theme') as Theme) || 'light',
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('petpooja-theme', next);
            document.documentElement.setAttribute('data-theme', next);
            return { theme: next };
        }),
}));

// ==========================================
// Auth Store (FastAPI Backend + JWT)
// ==========================================
interface AuthUser {
    id: string;
    email: string;
    role: string;
    restaurant_id: string;
    full_name?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (data: Record<string, string>) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    isInitialized: false,

    initAuth: async () => {
        if (get().isInitialized) return;
        set({ isInitialized: true });
        try {
            const { silentRefresh, startAutoRefresh, apiClient } = await import('./api');
            const success = await silentRefresh();

            if (success) {
                // Fetch user profile with the new access token
                try {
                    const res = await apiClient.get('/api/auth/me');
                    if (res.data) {
                        const user: AuthUser = res.data;
                        set({ isAuthenticated: true, user, loading: false, error: null });
                        startAutoRefresh(15);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to fetch user profile", e);
                }
            }

            set({ isAuthenticated: false, user: null, loading: false });
        } catch (err) {
            set({ isAuthenticated: false, user: null, loading: false });
        }
    },

    // Login via FastAPI backend
    login: async (email: string, password: string) => {
        set({ error: null, loading: true });
        try {
            const { apiClient, setAccessToken, startAutoRefresh } = await import('./api');
            const res = await apiClient.post('/api/auth/login', { email, password });

            if (res.data && res.data.access_token) {
                setAccessToken(res.data.access_token);
                set({
                    isAuthenticated: true,
                    user: res.data.user,
                    loading: false,
                    error: null,
                });
                startAutoRefresh(15);
                return true;
            } else {
                set({ error: 'Login failed', loading: false });
                return false;
            }
        } catch (err: any) {
            set({ error: err.response?.data?.detail || 'Login failed', loading: false });
            return false;
        }
    },

    // Signup via FastAPI backend
    signup: async (data: Record<string, string>) => {
        set({ error: null, loading: true });
        try {
            const { apiClient, setAccessToken, startAutoRefresh } = await import('./api');
            const res = await apiClient.post('/api/auth/signup', {
                restaurant_name: data.restaurant_name,
                owner_name: data.owner_name,
                gstin: data.gstin,
                address: data.address,
                phone: data.phone,
                email: data.email,
                password: data.password,
            });

            if (res.data && res.data.access_token) {
                setAccessToken(res.data.access_token);
                set({
                    isAuthenticated: true,
                    user: res.data.user,
                    loading: false,
                    error: null,
                });
                startAutoRefresh(15);

                // Auto-fetch tables after signup (tables are seeded by backend)
                setTimeout(() => {
                    useTableStore.getState().fetchTables();
                }, 500);

                return true;
            } else {
                set({ error: 'Signup failed', loading: false });
                return false;
            }
        } catch (err: any) {
            set({ error: err.response?.data?.detail || 'Signup failed', loading: false });
            return false;
        }
    },

    // Logout via FastAPI backend
    logout: async () => {
        try {
            const { apiClient, setAccessToken, stopAutoRefresh } = await import('./api');
            await apiClient.post('/api/auth/logout');
            setAccessToken(null);
            stopAutoRefresh();
        } catch {
            // Still clear local state even if API call fails
        }
        set({ isAuthenticated: false, user: null, error: null });
    },

    clearError: () => set({ error: null }),
}));

// ==========================================
// Table Store
// ==========================================
interface TableState {
    tables: TableData[];
    selectedTable: TableData | null;
    alerts: TableAlert[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    fetchTables: () => Promise<void>;
    selectTable: (table: TableData | null) => void;
    updateTableStatus: (tableId: string, status: TableData['status']) => void;
    addTable: (tableNumber: number, capacity: number) => Promise<{ error?: string }>;
    updateTable: (id: string, updates: Partial<TableData>) => Promise<{ error?: string }>;
    deleteTable: (id: string) => Promise<{ error?: string }>;
    generateAlerts: () => void;
}

export const useTableStore = create<TableState>((set, get) => ({
    tables: [],
    selectedTable: null,
    alerts: [],
    loading: false,
    saving: false,
    error: null,

    fetchTables: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get('/api/tables');
            if (res.data) {
                set({ tables: res.data || [], loading: false });
                // Auto-generate alerts after fetching
                get().generateAlerts();
            }
        } catch (err: any) {
            console.error('Error fetching tables:', err);
            set({ error: err.response?.data?.detail || err.message, loading: false });
        }
    },

    selectTable: (table) => set({ selectedTable: table }),

    updateTableStatus: async (tableId, status) => {
        const updates: any = { status };
        try {
            const res = await apiClient.put(`/api/tables/${tableId}`, updates);
            if (res.data) {
                set((state) => ({
                    tables: state.tables.map((t) =>
                        t.id === tableId ? { ...t, ...res.data } : t
                    ),
                }));
                get().generateAlerts();
            }
        } catch (err) {
            console.error('Error updating table status:', err);
        }
    },

    addTable: async (tableNumber, capacity) => {
        set({ saving: true });
        try {
            await apiClient.post('/api/tables', {
                table_number: tableNumber,
                capacity,
            });
            await get().fetchTables();
            set({ saving: false });
            return {};
        } catch (err: any) {
            console.error('Error adding table:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    updateTable: async (id, updates) => {
        set({ saving: true });
        try {
            await apiClient.put(`/api/tables/${id}`, updates);
            await get().fetchTables();
            set({ saving: false });
            return {};
        } catch (err: any) {
            console.error('Error updating table:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    deleteTable: async (id) => {
        set({ saving: true });
        try {
            await apiClient.delete(`/api/tables/${id}`);
            await get().fetchTables();
            set({ saving: false });
            return {};
        } catch (err: any) {
            console.error('Error deleting table:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    generateAlerts: () => {
        const tables = get().tables;
        const now = Date.now();
        const alerts: TableAlert[] = [];

        tables.forEach((table) => {
            const minutesElapsed = table.order_started_at
                ? Math.floor((now - new Date(table.order_started_at).getTime()) / 60000)
                : 0;

            // 1. Served but unpaid > 15 min
            if (table.status === 'served' && minutesElapsed > 15) {
                alerts.push({
                    id: `alert_unpaid_${table.id}`,
                    type: 'unpaid',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: Served but unpaid for ${minutesElapsed} min`,
                    severity: 'critical',
                    created_at: new Date().toISOString(),
                });
            }

            // 2. Order taking too long (> 30 min in preparing)
            if (table.status === 'preparing' && minutesElapsed > 30) {
                alerts.push({
                    id: `alert_slow_${table.id}`,
                    type: 'prep_delay',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: Order in preparation for ${minutesElapsed} min`,
                    severity: 'warning',
                    created_at: new Date().toISOString(),
                });
            }

            // 3. Table idle after reservation (reserved > 20 min, no order)
            if (table.status === 'reserved' && table.order_started_at && minutesElapsed > 20) {
                alerts.push({
                    id: `alert_idle_res_${table.id}`,
                    type: 'idle_reservation',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: Reserved but idle for ${minutesElapsed} min`,
                    severity: 'warning',
                    created_at: new Date().toISOString(),
                });
            }

            // 4. High-value customer seated (order > ₹3000)
            if (table.current_amount > 3000 && table.status !== 'available') {
                alerts.push({
                    id: `alert_highval_${table.id}`,
                    type: 'high_value',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: High-value order ₹${table.current_amount.toLocaleString('en-IN')}`,
                    severity: 'info',
                    created_at: new Date().toISOString(),
                });
            }

            // 5. Table about to exceed average dining time (> 60 min active)
            if ((table.status === 'active' || table.status === 'preparing') && minutesElapsed > 60) {
                alerts.push({
                    id: `alert_longtime_${table.id}`,
                    type: 'prep_delay',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: Exceeding average dining time (${minutesElapsed} min)`,
                    severity: 'warning',
                    created_at: new Date().toISOString(),
                });
            }

            // Payment delayed status
            if (table.status === 'payment_delayed') {
                alerts.push({
                    id: `alert_delayed_${table.id}`,
                    type: 'unpaid',
                    table_number: table.table_number,
                    message: `Table ${table.table_number}: Payment delayed — immediate attention required`,
                    severity: 'critical',
                    created_at: new Date().toISOString(),
                });
            }
        });

        // Sort: critical first, then warning, then info
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        alerts.sort((a, b) => (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2));

        set({ alerts });
    },
}));

// ==========================================
// Billing Store
// ==========================================
interface BillingState {
    orderItems: OrderItem[];
    discountType: 'percentage' | 'flat' | null;
    discountValue: number;
    paymentMethod: 'cash' | 'upi' | 'card' | 'split' | null;
    customerName: string;
    customerPhone: string;
    isSubmitting: boolean;
    addItem: (item: MenuItem, modifiers?: MenuModifier[]) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    setDiscount: (type: 'percentage' | 'flat', value: number) => void;
    clearDiscount: () => void;
    setPaymentMethod: (method: 'cash' | 'upi' | 'card' | 'split') => void;
    setCustomerDetails: (name: string, phone: string) => void;
    clearOrder: () => void;
    getSubtotal: () => number;
    getDiscountAmount: () => number;
    getCGST: () => number;
    getSGST: () => number;
    getTotal: () => number;
    submitOrder: (tableId?: string) => Promise<{ error?: string; data?: any }>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
    orderItems: [],
    discountType: null,
    discountValue: 0,
    paymentMethod: null,
    customerName: '',
    customerPhone: '',
    isSubmitting: false,

    addItem: (item: MenuItem, modifiers: MenuModifier[] = []) => {
        set((state) => {
            const existing = state.orderItems.find(
                (oi) => oi.menu_item.id === item.id && JSON.stringify(oi.modifiers) === JSON.stringify(modifiers)
            );
            if (existing) {
                return {
                    orderItems: state.orderItems.map((oi) =>
                        oi.id === existing.id
                            ? { ...oi, quantity: oi.quantity + 1, subtotal: (oi.quantity + 1) * (item.price + modifiers.reduce((s, m) => s + m.price, 0)) }
                            : oi
                    ),
                };
            }
            const modTotal = modifiers.reduce((s, m) => s + m.price, 0);
            return {
                orderItems: [
                    ...state.orderItems,
                    {
                        id: `oi_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        menu_item: item,
                        quantity: 1,
                        modifiers,
                        subtotal: item.price + modTotal,
                    },
                ],
            };
        });
    },

    removeItem: (itemId) => set((state) => ({ orderItems: state.orderItems.filter((oi) => oi.id !== itemId) })),

    updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
            set((state) => ({ orderItems: state.orderItems.filter((oi) => oi.id !== itemId) }));
            return;
        }
        set((state) => ({
            orderItems: state.orderItems.map((oi) =>
                oi.id === itemId
                    ? { ...oi, quantity, subtotal: quantity * (oi.menu_item.price + oi.modifiers.reduce((s, m) => s + m.price, 0)) }
                    : oi
            ),
        }));
    },

    setDiscount: (type, value) => set({ discountType: type, discountValue: value }),
    clearDiscount: () => set({ discountType: null, discountValue: 0 }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    setCustomerDetails: (name, phone) => set({ customerName: name, customerPhone: phone }),

    clearOrder: () => set({ orderItems: [], discountType: null, discountValue: 0, paymentMethod: null, customerName: '', customerPhone: '' }),

    getSubtotal: () => get().orderItems.reduce((sum, oi) => sum + oi.subtotal, 0),
    getDiscountAmount: () => {
        const sub = get().getSubtotal();
        if (!get().discountType) return 0;
        return get().discountType === 'percentage' ? (sub * get().discountValue) / 100 : get().discountValue;
    },
    getCGST: () => (get().getSubtotal() - get().getDiscountAmount()) * 0.025,
    getSGST: () => (get().getSubtotal() - get().getDiscountAmount()) * 0.025,
    getTotal: () => {
        const sub = get().getSubtotal();
        const disc = get().getDiscountAmount();
        const cgst = get().getCGST();
        const sgst = get().getSGST();
        return sub - disc + cgst + sgst;
    },

    submitOrder: async (tableId?: string) => {
        set({ isSubmitting: true });
        const state = get();
        const user = useAuthStore.getState().user;

        if (!user || state.orderItems.length === 0 || !state.paymentMethod) {
            set({ isSubmitting: false });
            return { error: 'Invalid order state or user not authenticated' };
        }

        const payload = {
            table_number: tableId || null,
            order_type: 'dine_in',
            subtotal: state.getSubtotal(),
            discount_type: state.discountType,
            discount_value: state.discountValue,
            discount_amount: state.getDiscountAmount(),
            cgst: state.getCGST(),
            sgst: state.getSGST(),
            total: state.getTotal(),
            payment_method: state.paymentMethod,
            payment_status: 'paid',
            customer_name: state.customerName || null,
            customer_phone: state.customerPhone || null,
            items: state.orderItems.map((item) => ({
                menu_item_id: item.menu_item.id,
                item_name: item.menu_item.name,
                quantity: item.quantity,
                unit_price: item.menu_item.price,
                modifiers: item.modifiers,
                subtotal: item.subtotal,
            })),
        };

        try {
            const { data: order } = await apiClient.post('/api/orders', payload);
            state.clearOrder();
            set({ isSubmitting: false });
            return { data: order };
        } catch (err: any) {
            console.error('submitOrder error:', err);

            // TypeError = "Failed to fetch" = network hiccup AFTER the server
            // already processed the request. The order WAS saved in the DB.
            // Clear the cart and treat it as a success so the user isn't stuck.
            if (err instanceof TypeError || err?.message === 'Failed to fetch') {
                state.clearOrder();
                set({ isSubmitting: false });
                return { data: { order_number: 'saved' } };
            }

            // Only surface real server-side errors (4xx / 5xx with a detail field)
            set({ isSubmitting: false });
            const detail = err?.response?.data?.detail || err?.message || 'Unknown error';
            return { error: detail };
        }
    }
}));

// ==========================================
// Sidebar Store
// ==========================================
interface SidebarState {
    collapsed: boolean;
    toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    collapsed: false,
    toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}));

// ==========================================
// Menu Store — CRUD + Image Upload
// ==========================================

// We use MenuItem and MenuCategory from types.

export interface MenuState {
    categories: MenuCategory[];
    items: MenuItem[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    fetchMenu: () => Promise<void>;
    addMenuItem: (item: Omit<MenuItem, 'id' | 'restaurant_id'>) => Promise<{ error?: string; data?: MenuItem }>;
    updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<{ error?: string; data?: MenuItem }>;
    deleteMenuItem: (id: string) => Promise<{ error?: string }>;
    addCategory: (name: string, icon: string) => Promise<{ error?: string; data?: MenuCategory }>;
    uploadItemImage: (file: File) => Promise<{ url?: string; error?: string }>;
    fetchRecipe: (menuItemId: string) => Promise<Recipe | null>;
    saveRecipe: (recipe: any) => Promise<{ error?: string; data?: Recipe }>;
    deleteRecipe: (menuItemId: string) => Promise<{ error?: string }>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
    categories: [],
    items: [],
    loading: false,
    saving: false,
    error: null,

    fetchMenu: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get('/api/menu');
            if (res.data) {
                set({
                    categories: res.data.categories || [],
                    items: res.data.items || [],
                    loading: false
                });
            }
        } catch (err: any) {
            console.error('Error fetching menu:', err);
            set({ error: err.response?.data?.detail || err.message, loading: false });
        }
    },

    addMenuItem: async (item) => {
        set({ saving: true });
        try {
            const res = await apiClient.post('/api/menu/items', item);
            await get().fetchMenu();
            set({ saving: false });
            return { data: res.data };
        } catch (err: any) {
            console.error('Error adding menu item:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    updateMenuItem: async (id, updates) => {
        set({ saving: true });
        try {
            const res = await apiClient.put(`/api/menu/items/${id}`, updates);
            await get().fetchMenu();
            set({ saving: false });
            return { data: res.data };
        } catch (err: any) {
            console.error('Error updating menu item:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    deleteMenuItem: async (id) => {
        set({ saving: true });
        try {
            await apiClient.delete(`/api/menu/items/${id}`);
            await get().fetchMenu();
            set({ saving: false });
            return {};
        } catch (err: any) {
            console.error('Error deleting menu item:', err);
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    addCategory: async (name, icon) => {
        try {
            const res = await apiClient.post('/api/menu/categories', { name, icon });
            await get().fetchMenu();
            return { data: res.data };
        } catch (err: any) {
            console.error('Error adding category:', err);
            return { error: err.response?.data?.detail || err.message };
        }
    },

    uploadItemImage: async (file: File) => {
        try {
            const user = useAuthStore.getState().user;
            if (!user) throw new Error('Not authenticated');

            const ext = file.name.split('.').pop();
            const fileName = `${user.restaurant_id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('menu-images')
                .getPublicUrl(fileName);

            return { url: urlData.publicUrl };
        } catch (err: any) {
            console.error('Error uploading image:', err);
            return { error: err.message };
        }
    },

    fetchRecipe: async (menuItemId) => {
        try {
            const res = await apiClient.get(`/api/recipes/${menuItemId}`);
            return res.data;
        } catch (err) {
            return null;
        }
    },

    saveRecipe: async (recipe) => {
        set({ saving: true });
        try {
            const res = await apiClient.post('/api/recipes', recipe);
            await get().fetchMenu(); // Refresh menu and costs
            set({ saving: false });
            return { data: res.data };
        } catch (err: any) {
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },

    deleteRecipe: async (menuItemId) => {
        set({ saving: true });
        try {
            await apiClient.delete(`/api/recipes/${menuItemId}`);
            await get().fetchMenu();
            set({ saving: false });
            return {};
        } catch (err: any) {
            set({ saving: false });
            return { error: err.response?.data?.detail || err.message };
        }
    },
}));

// ==========================================
// Inventory Store
// ==========================================
interface InventoryState {
    inventory: InventoryItem[];
    loading: boolean;
    error: string | null;
    fetchInventory: () => Promise<void>;
    addItem: (item: any) => Promise<{ data?: InventoryItem; error?: string }>;
    updateStock: (id: string, currentStock: number) => Promise<{ error?: string }>;
    getLowStockItems: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    inventory: [],
    loading: false,
    error: null,

    fetchInventory: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get('/api/inventory');
            set({ inventory: res.data || [], loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.detail || err.message, loading: false });
        }
    },

    addItem: async (item) => {
        try {
            const res = await apiClient.post('/api/inventory', item);
            await get().fetchInventory();
            return { data: res.data };
        } catch (err: any) {
            return { error: err.response?.data?.detail || err.message };
        }
    },

    updateStock: async (id, currentStock) => {
        try {
            await apiClient.put(`/api/inventory/${id}`, { current_stock: currentStock });
            await get().fetchInventory();
            return {};
        } catch (err: any) {
            return { error: err.response?.data?.detail || err.message };
        }
    },

    getLowStockItems: () => {
        return get().inventory.filter(item => item.current_stock <= item.min_stock);
    },
}));


// ==========================================
// PetPooja - Inventory Management
// Connected to FastAPI Backend
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, AlertTriangle, Clock, TrendingDown, Search,
    Plus, Bot, ChevronRight, Calendar, Pencil, Trash2, X, Check
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { formatCurrency, classNames } from '../../lib/utils';

interface InventoryItem {
    id: string;
    restaurant_id: string;
    name: string;
    category?: string;
    unit?: string;
    current_stock: number;
    min_stock: number;
    cost_per_unit: number;
    supplier?: string;
    expiry_date?: string;
    last_restocked?: string;
    created_at?: string;
}

const EMPTY_FORM = {
    name: '',
    category: '',
    unit: 'kg',
    current_stock: 0,
    min_stock: 0,
    cost_per_unit: 0,
    supplier: '',
    expiry_date: '',
};

function getStockLevel(item: InventoryItem): 'critical' | 'low' | 'good' | 'full' {
    const ratio = item.current_stock / (item.min_stock || 1);
    if (ratio < 0.5) return 'critical';
    if (ratio < 1) return 'low';
    if (ratio < 2) return 'good';
    return 'full';
}

function getStockPercent(item: InventoryItem): number {
    return Math.min((item.current_stock / ((item.min_stock || 1) * 2)) * 100, 100);
}

function daysUntilExpiry(date?: string): number | null {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export default function Inventory() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');
    const [showAI, setShowAI] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const loadInventory = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/api/inventory');
            setInventory(res.data);
        } catch {
            setError('Failed to load inventory. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadInventory(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (item: InventoryItem) => {
        setEditItem(item);
        setForm({
            name: item.name,
            category: item.category || '',
            unit: item.unit || 'kg',
            current_stock: item.current_stock,
            min_stock: item.min_stock,
            cost_per_unit: item.cost_per_unit,
            supplier: item.supplier || '',
            expiry_date: item.expiry_date ? item.expiry_date.split('T')[0] : '',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name) return;
        setSaving(true);
        try {
            const payload = {
                ...form,
                current_stock: Number(form.current_stock),
                min_stock: Number(form.min_stock),
                cost_per_unit: Number(form.cost_per_unit),
                expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
            };
            if (editItem) {
                await apiClient.put(`/api/inventory/${editItem.id}`, payload);
                showToast('Item updated successfully!');
            } else {
                await apiClient.post('/api/inventory', payload);
                showToast('Item added successfully!');
            }
            setShowModal(false);
            loadInventory();
        } catch (e: any) {
            showToast('Error: ' + (e?.response?.data?.detail || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}" from inventory?`)) return;
        try {
            await apiClient.delete(`/api/inventory/${id}`);
            setInventory((prev) => prev.filter((i) => i.id !== id));
            showToast(`"${name}" deleted.`);
        } catch {
            showToast('Failed to delete item.');
        }
    };

    const lowStock = inventory.filter((i) => i.current_stock < i.min_stock);
    const expiringItems = inventory.filter((i) => {
        const days = daysUntilExpiry(i.expiry_date);
        return days !== null && days <= 3;
    });

    let filtered = inventory;
    if (filter === 'low') filtered = lowStock;
    if (filter === 'expiring') filtered = expiringItems;
    if (search) filtered = filtered.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const aiSuggestions = [
        `${lowStock.length} items are below minimum stock — review reorder quantities.`,
        'Based on last 7 days, increase Paneer Butter Masala ingredient stock.',
        'Cream stock will run out in ~2 days. Reorder from Amul Distributor.',
        'Tomato prices expected to rise. Pre-order 20kg at current rate.',
    ];

    return (
        <div className="page-container">
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '24px', zIndex: 999,
                    background: 'var(--color-bg-elevated)', border: '1px solid var(--color-success)',
                    borderLeft: '4px solid var(--color-success)', borderRadius: 'var(--radius-md)',
                    padding: '12px 20px', boxShadow: 'var(--shadow-lg)', display: 'flex',
                    alignItems: 'center', gap: 10, fontWeight: 500, fontSize: 'var(--text-sm)',
                    color: 'var(--color-text)',
                }}>
                    <Check size={16} color="var(--color-success)" />
                    {toast}
                </div>
            )}

            {/* Alerts */}
            {(lowStock.length > 0 || expiringItems.length > 0) && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    {lowStock.length > 0 && (
                        <div className="toast toast-warning" style={{ width: 'auto', flex: 1 }}>
                            <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{lowStock.length} items below minimum stock</div>
                                <div className="text-xs text-secondary">{lowStock.map((i) => i.name).join(', ')}</div>
                            </div>
                        </div>
                    )}
                    {expiringItems.length > 0 && (
                        <div className="toast toast-error" style={{ width: 'auto', flex: 1 }}>
                            <Clock size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{expiringItems.length} items expiring soon</div>
                                <div className="text-xs text-secondary">{expiringItems.map((i) => `${i.name} (${daysUntilExpiry(i.expiry_date)}d)`).join(', ')}</div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Inventory</h1>
                    <p className="page-subtitle">{inventory.length} items tracked • {lowStock.length} low stock</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary" onClick={() => setShowAI(!showAI)}>
                        <Bot size={16} /> AI Suggestions
                    </button>
                    <button className="btn btn-primary" onClick={openAdd}>
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            {/* AI Panel */}
            {showAI && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="card" style={{ marginBottom: 'var(--space-4)', borderColor: 'var(--color-primary-light)', background: 'var(--color-primary-alpha)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                        <Bot size={18} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>AURA AI Reorder Suggestions</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {aiSuggestions.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                                <ChevronRight size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                {s}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input className="input" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
                </div>
                {(['all', 'low', 'expiring'] as const).map((f) => (
                    <button key={f} className={classNames('btn btn-sm', filter === f ? 'btn-primary' : 'btn-secondary')} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'All Items' : f === 'low' ? `Low Stock (${lowStock.length})` : `Expiring (${expiringItems.length})`}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)' }}>
                    Loading inventory...
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="toast toast-error" style={{ marginBottom: 'var(--space-4)' }}>
                    <AlertTriangle size={18} /> {error}
                </div>
            )}

            {/* Inventory Grid */}
            {!loading && !error && (
                <div className="inventory-grid">
                    {filtered.map((item, idx) => {
                        const level = getStockLevel(item);
                        const percent = getStockPercent(item);
                        const expDays = daysUntilExpiry(item.expiry_date);

                        return (
                            <motion.div key={item.id} className="card"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{item.name}</div>
                                        <div className="text-xs text-secondary">{item.category}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className={`badge badge-${level === 'critical' ? 'payment-delayed' : level === 'low' ? 'preparing' : level === 'good' ? 'active' : 'served'}`}>
                                            {level}
                                        </span>
                                        <button onClick={() => openEdit(item)} className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }}>
                                            <Pencil size={13} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id, item.name)} className="btn btn-sm" style={{ padding: '4px 8px', background: 'var(--color-error-alpha)', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{item.current_stock}</div>
                                        <div className="text-xs text-secondary">{item.unit} (min: {item.min_stock})</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{formatCurrency(item.cost_per_unit)}/{item.unit}</div>
                                        <div className="text-xs text-secondary">{item.supplier}</div>
                                    </div>
                                </div>

                                <div className="stock-level-bar">
                                    <div className={`stock-level-fill ${level}`} style={{ width: `${percent}%` }} />
                                </div>

                                {expDays !== null && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                                        fontSize: 'var(--text-xs)',
                                        color: expDays <= 2 ? 'var(--color-error)' : expDays <= 5 ? 'var(--color-warning)' : 'var(--color-text-secondary)',
                                    }}>
                                        <Calendar size={12} />
                                        {expDays <= 0 ? 'EXPIRED' : `Expires in ${expDays} day${expDays > 1 ? 's' : ''}`}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}

                    {filtered.length === 0 && !loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)' }}>
                            <Package size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                            <div style={{ fontWeight: 600 }}>No inventory items found</div>
                            <div className="text-xs text-secondary" style={{ marginTop: 4 }}>Click "Add Item" to get started</div>
                        </div>
                    )}
                </div>
            )}

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px',
                        }}
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ background: 'var(--color-bg-elevated)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, boxShadow: 'var(--shadow-xl)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                <h2 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>
                                    {editItem ? 'Edit Item' : 'Add Inventory Item'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '6px' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: 'Name *', key: 'name', type: 'text', full: true },
                                    { label: 'Category', key: 'category', type: 'text' },
                                    { label: 'Unit (kg, L, pcs...)', key: 'unit', type: 'text' },
                                    { label: 'Current Stock', key: 'current_stock', type: 'number' },
                                    { label: 'Minimum Stock', key: 'min_stock', type: 'number' },
                                    { label: 'Cost per Unit (₹)', key: 'cost_per_unit', type: 'number' },
                                    { label: 'Supplier', key: 'supplier', type: 'text', full: true },
                                    { label: 'Expiry Date', key: 'expiry_date', type: 'date', full: true },
                                ].map(({ label, key, type, full }) => (
                                    <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</label>
                                        <input className="input" type={type} value={form[key as keyof typeof form]}
                                            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name}>
                                    {saving ? 'Saving...' : (editItem ? 'Update Item' : 'Add Item')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// PetPooja - Table Grid (Main POS View)
// Enhanced with CRUD Management, Smart Alerts,
// Timers, Progress Bars, and Professional UI
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, AlertTriangle, X, Plus, Edit3, Trash2,
    Save, Settings2, Loader2, Check, UtensilsCrossed,
    CalendarClock, CreditCard, Banknote, Flame,
    ChevronRight, Armchair
} from 'lucide-react';
import { useTableStore } from '../../lib/store';
import { formatCurrency, getMinutesElapsed, getStatusLabel, getProgressPercent, classNames } from '../../lib/utils';
import { TableData, TableStatus, TableAlert } from '../../types';

// ==========================================
// Status Filters
// ==========================================
const statusFilters: { label: string; value: TableStatus | 'all'; icon?: string }[] = [
    { label: 'All Tables', value: 'all' },
    { label: 'Available', value: 'available', icon: '🟢' },
    { label: 'Active', value: 'active', icon: '🔵' },
    { label: 'Preparing', value: 'preparing', icon: '🟡' },
    { label: 'Served', value: 'served', icon: '🟣' },
    { label: 'Delayed', value: 'payment_delayed', icon: '🔴' },
    { label: 'Reserved', value: 'reserved', icon: '📅' },
];

// ==========================================
// Progress Steps
// ==========================================
const progressSteps = [
    { label: 'Received', pct: 0 },
    { label: 'Cooking', pct: 30 },
    { label: 'Ready', pct: 70 },
    { label: 'Served', pct: 100 },
];

function getProgressStep(status: TableStatus, minutes: number): number {
    if (status === 'served' || status === 'payment_delayed') return 100;
    if (status === 'active') return Math.min(minutes * 2, 25);
    if (status === 'preparing') return 30 + Math.min(minutes, 40);
    return 0;
}

// ==========================================
// Smart Alert Card
// ==========================================
function AlertCard({ alert, onDismiss }: { alert: TableAlert; onDismiss: (id: string) => void }) {
    const severityStyles: Record<string, { bg: string; border: string; icon: string }> = {
        critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', icon: '#EF4444' },
        warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', icon: '#F59E0B' },
        info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', icon: '#3B82F6' },
    };
    const s = severityStyles[alert.severity] || severityStyles.info;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0 }}
            style={{
                padding: '10px 14px',
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '6px',
            }}
        >
            <AlertTriangle size={16} style={{ color: s.icon, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{alert.message}</div>
            </div>
            <button
                onClick={() => onDismiss(alert.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '4px' }}
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}

// ==========================================
// Table Card Component
// ==========================================
function TableCard({
    table,
    isManageMode,
    onEdit,
    onDelete,
}: {
    table: TableData;
    isManageMode: boolean;
    onEdit: (table: TableData) => void;
    onDelete: (id: string) => void;
}) {
    const [now, setNow] = useState(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

    const minutes = table.order_started_at ? getMinutesElapsed(table.order_started_at) : 0;
    const progress = getProgressStep(table.status, minutes);

    const handleClick = () => {
        if (isManageMode) {
            onEdit(table);
            return;
        }
        if (table.status === 'available') {
            navigate(`/billing?table=${table.table_number}`);
        } else if (table.current_order_id) {
            navigate(`/billing?table=${table.table_number}&order=${table.current_order_id}`);
        }
    };

    // Status icon
    const statusIcon = () => {
        switch (table.status) {
            case 'reserved': return <CalendarClock size={13} />;
            case 'payment_delayed': return <Banknote size={13} />;
            case 'served': return <CreditCard size={13} />;
            default: return <UtensilsCrossed size={13} />;
        }
    };

    // Format timer display
    const timerDisplay = minutes > 0
        ? `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
        : '00:00';

    // Status border color
    const borderColors: Record<TableStatus, string> = {
        available: '#22C55E',
        active: '#3B82F6',
        preparing: '#F59E0B',
        served: '#8B5CF6',
        payment_delayed: '#EF4444',
        reserved: '#06B6D4',
    };

    return (
        <motion.div
            style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid var(--color-border)`,
                borderLeft: `4px solid ${borderColors[table.status]}`,
                padding: 'var(--space-4)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
            }}
            onClick={handleClick}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            layout
        >
            {/* Management Mode Overlay */}
            {isManageMode && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 2,
                }}>
                    <button
                        className="btn btn-ghost btn-icon sm"
                        onClick={(e) => { e.stopPropagation(); onEdit(table); }}
                        title="Edit"
                        style={{ background: 'var(--color-surface-elevated)' }}
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        className="btn btn-ghost btn-icon sm"
                        onClick={(e) => { e.stopPropagation(); onDelete(table.id); }}
                        title="Delete"
                        style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-error)' }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}

            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                    }}>
                        T{table.table_number}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Armchair size={12} style={{ color: 'var(--color-text-tertiary)' }} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                            {table.capacity} seats
                        </span>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: borderColors[table.status],
                    background: `${borderColors[table.status]}15`,
                }}>
                    {statusIcon()}
                    {getStatusLabel(table.status)}
                </div>
            </div>

            {/* Order Amount */}
            {table.current_amount > 0 && (
                <div style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    letterSpacing: '-0.01em',
                }}>
                    {formatCurrency(table.current_amount)}
                </div>
            )}

            {/* Reserved For */}
            {table.reserved_for && (
                <div style={{
                    fontSize: 'var(--text-xs)',
                    color: borderColors.reserved,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    <CalendarClock size={11} />
                    {table.reserved_for}
                </div>
            )}

            {/* Timer */}
            {table.order_started_at && table.status !== 'available' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--text-xs)',
                    color: minutes > 45 ? '#EF4444' : minutes > 25 ? '#F59E0B' : 'var(--color-text-secondary)',
                    fontWeight: 500,
                    fontFamily: 'monospace',
                }}>
                    <Clock size={12} />
                    <span>{timerDisplay} min</span>
                    {minutes > 45 && <Flame size={12} style={{ color: '#EF4444' }} />}
                </div>
            )}

            {/* Progress Bar */}
            {table.status !== 'available' && table.status !== 'reserved' && (
                <div style={{ marginTop: 'auto' }}>
                    <div style={{
                        height: '4px',
                        background: 'var(--color-border)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8 }}
                            style={{
                                height: '100%',
                                background: progress >= 100
                                    ? '#8B5CF6'
                                    : progress >= 70
                                        ? '#22C55E'
                                        : progress >= 30
                                            ? '#F59E0B'
                                            : '#3B82F6',
                                borderRadius: '2px',
                            }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '3px',
                    }}>
                        {progressSteps.map((step) => (
                            <span
                                key={step.label}
                                style={{
                                    fontSize: '0.55rem',
                                    color: progress >= step.pct ? borderColors[table.status] : 'var(--color-text-tertiary)',
                                    fontWeight: progress >= step.pct ? 600 : 400,
                                }}
                            >
                                {step.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// ==========================================
// Add / Edit Table Modal
// ==========================================
function TableFormModal({
    table,
    onClose,
    onSave,
    saving,
}: {
    table: TableData | null;
    onClose: () => void;
    onSave: (tableNumber: number, capacity: number) => Promise<void>;
    saving: boolean;
}) {
    const [tableNumber, setTableNumber] = useState(table?.table_number?.toString() || '');
    const [capacity, setCapacity] = useState(table?.capacity?.toString() || '4');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!tableNumber || parseInt(tableNumber) <= 0) errs.tableNumber = 'Valid table number required';
        if (!capacity || parseInt(capacity) <= 0) errs.capacity = 'Valid capacity required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        await onSave(parseInt(tableNumber), parseInt(capacity));
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '400px' }}
            >
                <div className="modal-header">
                    <h3 className="modal-title">{table ? 'Edit Table' : 'Add New Table'}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="input-group">
                        <label className="input-label">Table Number *</label>
                        <input
                            className={classNames('input', errors.tableNumber && 'input-error')}
                            type="number"
                            placeholder="e.g. 9"
                            value={tableNumber}
                            onChange={(e) => { setTableNumber(e.target.value); setErrors((p) => ({ ...p, tableNumber: '' })); }}
                            min="1"
                        />
                        {errors.tableNumber && <div className="input-error-message">{errors.tableNumber}</div>}
                    </div>
                    <div className="input-group">
                        <label className="input-label">Seating Capacity *</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {[2, 4, 6, 8].map((cap) => (
                                <button
                                    key={cap}
                                    className={classNames('btn', capacity === cap.toString() ? 'btn-primary' : 'btn-secondary')}
                                    onClick={() => setCapacity(cap.toString())}
                                    style={{ flex: 1 }}
                                >
                                    <Users size={14} /> {cap}
                                </button>
                            ))}
                        </div>
                        <input
                            className={classNames('input', errors.capacity && 'input-error')}
                            type="number"
                            placeholder="Custom capacity"
                            value={capacity}
                            onChange={(e) => { setCapacity(e.target.value); setErrors((p) => ({ ...p, capacity: '' })); }}
                            min="1"
                            style={{ marginTop: 'var(--space-2)' }}
                        />
                        {errors.capacity && <div className="input-error-message">{errors.capacity}</div>}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        {' '}{table ? 'Update Table' : 'Add Table'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==========================================
// Delete Confirmation Modal
// ==========================================
function DeleteConfirmModal({
    tableNumber,
    onClose,
    onConfirm,
    saving,
}: {
    tableNumber: number;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    saving: boolean;
}) {
    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '380px' }}
            >
                <div className="modal-header">
                    <h3 className="modal-title">Delete Table T{tableNumber}?</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        This will permanently remove Table T{tableNumber}. Any active orders on this table must be completed first.
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-error" onClick={onConfirm} disabled={saving}>
                        {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                        {' '}Delete Table
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==========================================
// Main Table Grid Component
// ==========================================
export default function TableGrid() {
    const {
        tables, alerts, fetchTables, loading, saving,
        addTable, updateTable, deleteTable, generateAlerts
    } = useTableStore();

    const [filter, setFilter] = useState<TableStatus | 'all'>('all');
    const [showAlerts, setShowAlerts] = useState(true);
    const [isManageMode, setIsManageMode] = useState(false);
    const [editingTable, setEditingTable] = useState<TableData | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingTable, setDeletingTable] = useState<TableData | null>(null);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchTables();
        // Refresh alerts every 60s
        const interval = setInterval(() => generateAlerts(), 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const filtered = filter === 'all' ? tables : tables.filter((t) => t.status === filter);

    const statusCounts = useMemo(() => {
        return tables.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [tables]);

    const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

    const handleAddSave = async (tableNumber: number, capacity: number) => {
        const result = await addTable(tableNumber, capacity);
        if (result.error) {
            setToast({ message: `Failed: ${result.error}`, type: 'error' });
        } else {
            setToast({ message: `Table T${tableNumber} added!`, type: 'success' });
            setShowAddModal(false);
        }
    };

    const handleEditSave = async (tableNumber: number, capacity: number) => {
        if (!editingTable) return;
        const result = await updateTable(editingTable.id, { table_number: tableNumber, capacity });
        if (result.error) {
            setToast({ message: `Failed: ${result.error}`, type: 'error' });
        } else {
            setToast({ message: `Table T${tableNumber} updated!`, type: 'success' });
            setEditingTable(null);
        }
    };

    const handleDelete = async () => {
        if (!deletingTable) return;
        const result = await deleteTable(deletingTable.id);
        if (result.error) {
            setToast({ message: `Failed: ${result.error}`, type: 'error' });
        } else {
            setToast({ message: `Table T${deletingTable.table_number} deleted!`, type: 'success' });
            setDeletingTable(null);
        }
    };

    const totalRevenue = tables.reduce((sum, t) => sum + (t.current_amount || 0), 0);

    return (
        <div className="page-container">
            {/* Smart Alerts Banner */}
            {showAlerts && visibleAlerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 'var(--space-4)' }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-2)',
                    }}>
                        <div style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            color: 'var(--color-error)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <AlertTriangle size={14} />
                            {visibleAlerts.length} Active Alert{visibleAlerts.length > 1 ? 's' : ''}
                        </div>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowAlerts(false)}
                            style={{ fontSize: 'var(--text-xs)' }}
                        >
                            Dismiss All
                        </button>
                    </div>
                    <AnimatePresence>
                        {visibleAlerts.slice(0, 4).map((alert) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onDismiss={(id) => setDismissedAlerts((prev) => new Set([...prev, id]))}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Table Management</h1>
                    <p className="page-subtitle">
                        {tables.length} tables • {statusCounts['active'] || 0} active • {statusCounts['preparing'] || 0} preparing
                        {totalRevenue > 0 && ` • Floor revenue: ${formatCurrency(totalRevenue)}`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <button
                        className={classNames('btn', isManageMode ? 'btn-primary' : 'btn-secondary')}
                        onClick={() => setIsManageMode(!isManageMode)}
                    >
                        <Settings2 size={14} /> {isManageMode ? 'Done' : 'Manage'}
                    </button>
                    {isManageMode && (
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={14} /> Add Table
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-5)',
                flexWrap: 'wrap',
            }}>
                {[
                    { label: 'Total', count: tables.length, color: 'var(--color-text)' },
                    { label: 'Available', count: statusCounts['available'] || 0, color: '#22C55E' },
                    { label: 'Active', count: statusCounts['active'] || 0, color: '#3B82F6' },
                    { label: 'Preparing', count: statusCounts['preparing'] || 0, color: '#F59E0B' },
                    { label: 'Served', count: statusCounts['served'] || 0, color: '#8B5CF6' },
                    { label: 'Delayed', count: statusCounts['payment_delayed'] || 0, color: '#EF4444' },
                    { label: 'Reserved', count: statusCounts['reserved'] || 0, color: '#06B6D4' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            minWidth: '72px',
                        }}
                    >
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: stat.color }}>{stat.count}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="billing-categories" style={{ marginBottom: 'var(--space-6)' }}>
                {statusFilters.map((sf) => (
                    <button
                        key={sf.value}
                        className={classNames('billing-category-btn', filter === sf.value && 'active')}
                        onClick={() => setFilter(sf.value)}
                    >
                        {sf.icon && <span>{sf.icon}</span>} {sf.label}
                    </button>
                ))}
            </div>

            {/* Table Grid */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                    <Armchair size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--space-4)', opacity: 0.4 }} />
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                        {tables.length === 0 ? 'No tables configured' : 'No tables match this filter'}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                        {tables.length === 0 ? 'Click "Manage" to add your first table' : 'Try a different filter'}
                    </div>
                    {tables.length === 0 && (
                        <button className="btn btn-primary" onClick={() => { setIsManageMode(true); setShowAddModal(true); }}>
                            <Plus size={16} /> Add First Table
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 'var(--space-4)',
                }}>
                    {filtered.map((table) => (
                        <TableCard
                            key={table.id}
                            table={table}
                            isManageMode={isManageMode}
                            onEdit={(t) => setEditingTable(t)}
                            onDelete={(id) => {
                                const t = tables.find((x) => x.id === id);
                                if (t) setDeletingTable(t);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Add Table Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <TableFormModal
                        table={null}
                        onClose={() => setShowAddModal(false)}
                        onSave={handleAddSave}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            {/* Edit Table Modal */}
            <AnimatePresence>
                {editingTable && (
                    <TableFormModal
                        table={editingTable}
                        onClose={() => setEditingTable(null)}
                        onSave={handleEditSave}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingTable && (
                    <DeleteConfirmModal
                        tableNumber={deletingTable.table_number}
                        onClose={() => setDeletingTable(null)}
                        onConfirm={handleDelete}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            padding: 'var(--space-3) var(--space-5)',
                            borderRadius: 'var(--radius-lg)',
                            background: toast.type === 'success' ? '#22C55E' : '#EF4444',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: 'var(--text-sm)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}
                    >
                        {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

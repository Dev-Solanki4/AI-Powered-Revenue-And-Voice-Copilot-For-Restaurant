// ==========================================
// PetPooja - Online Orders Management
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Check, X, ChefHat, Bike, Filter
} from 'lucide-react';
import { mockOnlineOrders } from '../../lib/mockData';
import { formatCurrency, getMinutesElapsed, classNames } from '../../lib/utils';
import { OnlineOrder } from '../../types';

const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'dine_in', label: 'Dine-in' },
    { key: 'takeaway', label: 'Takeaway' },
    { key: 'zomato', label: 'Zomato' },
    { key: 'swiggy', label: 'Swiggy' },
] as const;

const statusColors: Record<string, string> = {
    new: 'var(--color-primary)',
    accepted: 'var(--color-info)',
    preparing: 'var(--color-preparing)',
    ready: 'var(--color-success)',
    picked_up: 'var(--color-text-tertiary)',
    rejected: 'var(--color-error)',
};

function OrderCard({ order, onAccept, onReject, onReady }: {
    order: OnlineOrder;
    onAccept: () => void;
    onReject: () => void;
    onReady: () => void;
}) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

    const minutes = getMinutesElapsed(order.created_at);

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            layout
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: statusColors[order.status] || 'var(--color-border)',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{
                            padding: '2px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            background: order.platform === 'zomato' ? '#E23744' : '#FC8019',
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>
                            {order.platform}
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>#{order.order_id}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                        {order.customer_name}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: minutes > 10 ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{minutes} min</span>
                </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
                {order.items.map((item) => (
                    <div key={item.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 'var(--text-sm)', padding: '2px 0',
                    }}>
                        <span className="text-secondary">{item.quantity}x {item.menu_item.name}</span>
                        <span style={{ fontWeight: 500 }}>{formatCurrency(item.subtotal)}</span>
                    </div>
                ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {formatCurrency(order.total)}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {order.status === 'new' && (
                        <>
                            <button className="btn btn-danger btn-sm" onClick={onReject}>
                                <X size={14} /> Reject
                            </button>
                            <button className="btn btn-success btn-sm" onClick={onAccept}>
                                <Check size={14} /> Accept
                            </button>
                        </>
                    )}
                    {(order.status === 'accepted' || order.status === 'preparing') && (
                        <button className="btn btn-primary btn-sm" onClick={onReady}>
                            <ChefHat size={14} /> Mark Ready
                        </button>
                    )}
                    {order.status === 'ready' && (
                        <span className="badge badge-active" style={{ padding: '4px 12px' }}>
                            <Bike size={12} /> Ready for Pickup
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function OnlineOrders() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [orders, setOrders] = useState(mockOnlineOrders);

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter((o) => o.platform === activeTab);

    const handleAccept = (id: string) => {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'accepted' as const } : o));
    };

    const handleReject = (id: string) => {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'rejected' as const } : o));
    };

    const handleReady = (id: string) => {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'ready' as const } : o));
    };

    const newCount = orders.filter((o) => o.status === 'new').length;
    const activeCount = orders.filter((o) => ['accepted', 'preparing'].includes(o.status)).length;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Online Orders</h1>
                <p className="page-subtitle">
                    {orders.length} total • {newCount} new • {activeCount} active
                </p>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map((tab) => {
                    const count = tab.key === 'all' ? orders.length : orders.filter((o) => o.platform === tab.key).length;
                    return (
                        <button
                            key={tab.key}
                            className={classNames('tab', activeTab === tab.key && 'active')}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span style={{
                                    marginLeft: '6px',
                                    background: activeTab === tab.key ? 'var(--color-primary-alpha)' : 'var(--color-bg-hover)',
                                    padding: '1px 6px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                }}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Orders Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-4)' }}>
                <AnimatePresence>
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onAccept={() => handleAccept(order.id)}
                            onReject={() => handleReject(order.id)}
                            onReady={() => handleReady(order.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

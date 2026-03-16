// ==========================================
// PetPooja - Owner Intelligence Dashboard
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IndianRupee, ShoppingBag, Receipt, TrendingUp, Percent,
    PieChart, BarChart3, Users, MonitorSmartphone, XCircle,
    Tag, RefreshCw, ArrowUp, ArrowDown, Calendar, ChevronDown, CheckCircle, Loader2
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    ComposedChart, Line
} from 'recharts';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import { apiClient } from '../../lib/api';

const iconMap: Record<string, React.ReactNode> = {
    'indian-rupee': <IndianRupee size={20} />,
    'shopping-bag': <ShoppingBag size={20} />,
    'receipt': <Receipt size={20} />,
    'trending-up': <TrendingUp size={20} />,
    'percent': <Percent size={20} />,
    'pie-chart': <PieChart size={20} />,
    'bar-chart-3': <BarChart3 size={20} />,
    'users': <Users size={20} />,
    'monitor-smartphone': <MonitorSmartphone size={20} />,
    'x-circle': <XCircle size={20} />,
    'tag': <Tag size={20} />,
    'refresh-cw': <RefreshCw size={20} />,
};

const COLORS = ['#D32F2F', '#EF5350', '#FF8A80', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const dateFilters = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last 30 Days', value: 'last_30_days' },
];

interface DashboardKPI {
    label: string;
    value: string;
    change?: number;
    changeLabel?: string;
    icon: string;
    trend: string;
}

interface DashboardData {
    kpis: DashboardKPI[];
    revenue_trend: { name: string; dineIn: number; online: number; value: number }[];
    category_revenue: { name: string; value: number }[];
    hourly_data: { name: string; value: number }[];
    monthly_comparison: { name: string; current: number; previous: number; value: number }[];
}

export default function Dashboard() {
    const location = useLocation();
    const [dateFilter, setDateFilter] = useState('this_week');
    const [dateLabel, setDateLabel] = useState('This Week');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(location.state?.toast || null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    // Auto-dismiss toast after 5 seconds
    useEffect(() => {
        if (toastMessage) {
            window.history.replaceState({}, document.title);
            const timer = setTimeout(() => setToastMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Fetch dashboard data from backend
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        apiClient.get(`/api/dashboard?period=${dateFilter}`)
            .then(({ data: resp }) => {
                if (!cancelled) setData(resp);
            })
            .catch((err) => {
                console.error('Dashboard fetch error:', err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [dateFilter]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    boxShadow: 'var(--shadow-lg)',
                }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>{label}</div>
                    {payload.map((p: any, i: number) => (
                        <div key={i} style={{ fontSize: 'var(--text-xs)', color: p.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                            {p.name}: {formatCurrency(p.value)}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Loading skeleton
    if (loading || !data) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={32} className="spin" style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }} />
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Loading dashboard data...</div>
                </div>
            </div>
        );
    }

    const { kpis, revenue_trend, category_revenue, hourly_data, monthly_comparison } = data;

    return (
        <div className="page-container">
            {/* Success Toast */}
            {toastMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    style={{
                        position: 'fixed',
                        top: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#10B981',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        fontWeight: 500
                    }}
                >
                    <CheckCircle size={20} />
                    {toastMessage}
                </motion.div>
            )}

            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Owner Dashboard</h1>
                    <p className="page-subtitle">Business intelligence at a glance</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', position: 'relative' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{ gap: 'var(--space-2)' }}
                    >
                        <Calendar size={14} />
                        {dateLabel}
                        <ChevronDown size={14} />
                    </button>
                    {showDatePicker && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 'var(--space-1)',
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 50,
                            overflow: 'hidden',
                            minWidth: '160px',
                        }}>
                            {dateFilters.map((f) => (
                                <button
                                    key={f.value}
                                    className="sidebar-item"
                                    style={{ borderRadius: 0, padding: 'var(--space-2) var(--space-4)', color: f.value === dateFilter ? 'var(--color-primary)' : undefined }}
                                    onClick={() => {
                                        setDateFilter(f.value);
                                        setDateLabel(f.label);
                                        setShowDatePicker(false);
                                    }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        className="kpi-card"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                    >
                        <div className="kpi-icon">
                            {iconMap[kpi.icon] || <BarChart3 size={20} />}
                        </div>
                        <div className="kpi-value">{kpi.value}</div>
                        <div className="kpi-label">{kpi.label}</div>
                        {kpi.change !== undefined && kpi.change !== null && (
                            <div className={`kpi-change ${kpi.change >= 0 ? 'up' : 'down'}`}>
                                {kpi.change >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                {Math.abs(kpi.change)}% {kpi.changeLabel}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                {/* Revenue Trend */}
                <motion.div className="chart-container" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="chart-header">
                        <div className="chart-title">Revenue Trend</div>
                        <div className="text-xs text-secondary">Dine-in vs Online</div>
                    </div>
                    {revenue_trend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenue_trend}>
                                <defs>
                                    <linearGradient id="gradDineIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D32F2F" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradOnline" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-border)' }} />
                                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" dataKey="dineIn" name="Dine-in" stroke="#D32F2F" fill="url(#gradDineIn)" strokeWidth={2} />
                                <Area type="monotone" dataKey="online" name="Online" stroke="#3B82F6" fill="url(#gradOnline)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No revenue data for this period
                        </div>
                    )}
                </motion.div>

                {/* Category Revenue */}
                <motion.div className="chart-container" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="chart-header">
                        <div className="chart-title">Revenue by Category</div>
                    </div>
                    {category_revenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <RechartsPie>
                                <Pie
                                    data={category_revenue}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {category_revenue.map((_entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{value}</span>}
                                />
                            </RechartsPie>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No category data for this period
                        </div>
                    )}
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {/* Hourly Distribution */}
                <motion.div className="chart-container" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="chart-header">
                        <div className="chart-title">Peak Hours</div>
                        <div className="text-xs text-secondary">Revenue distribution by hour</div>
                    </div>
                    {hourly_data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={hourly_data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} />
                                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Revenue" radius={[4, 4, 0, 0]}>
                                    {hourly_data.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.value > 15000 ? '#D32F2F' : entry.value > 8000 ? '#F59E0B' : '#10B981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No hourly data for this period
                        </div>
                    )}
                </motion.div>

                {/* Monthly Comparison */}
                <motion.div className="chart-container" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="chart-header">
                        <div className="chart-title">Month-over-Month</div>
                        <div className="text-xs text-secondary">Current vs Previous Year</div>
                    </div>
                    {monthly_comparison.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <ComposedChart data={monthly_comparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} />
                                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="previous" name="Previous Year" fill="var(--color-border)" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="current" name="Current Year" stroke="#D32F2F" strokeWidth={2.5} dot={{ r: 4, fill: '#D32F2F' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No monthly data available
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

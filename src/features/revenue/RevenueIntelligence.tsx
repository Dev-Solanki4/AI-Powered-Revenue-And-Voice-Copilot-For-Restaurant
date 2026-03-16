import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Trophy, Search, Filter, Cpu, ArrowUp, ArrowDown,
    Sparkles, Target, BarChart3, Loader2, Calendar, ChevronDown,
    LayoutGrid, List, Zap, AlertCircle, Info, ArrowRight, Layers,
    Share2, Plus, Star
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ScatterChart, Scatter, ZAxis, LabelList, Cell
} from 'recharts';
import { apiClient } from '../../lib/api';
import './revenue.css';

interface PopularItem {
    id: string;
    name: string;
    category: string;
    price: number;
    making_cost: number;
    order_count: number;
    revenue: number;
    profit: number;
    popularity_score: number;
    trend: 'up' | 'stable' | 'down';
}

interface MenuEngineeringItem {
    id: string;
    name: string;
    price: number;
    making_cost: number;
    total_quantity: number;
    margin: number;
    popularity_score: number;
    category: 'Star' | 'Puzzle' | 'Plowhorse' | 'Dog';
    recommended_action: string;
    insight: string;
}

interface ComboRecommendation {
    items: string[];
    combo_name: string;
    confidence: number;
    lift: number;
    support: number;
    total_price: number;
    total_margin: number;
    insight: string;
    recommended_action: string;
}

const periods = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last 30 Days', value: 'last_30_days' },
];

export default function RevenueIntelligence() {
    const [activeTab, setActiveTab] = useState<'index' | 'engineering' | 'combo'>('index');
    const [items, setItems] = useState<PopularItem[]>([]);
    const [engItems, setEngItems] = useState<MenuEngineeringItem[]>([]);
    const [engAverages, setEngAverages] = useState<{ margin: number; popularity: number } | null>(null);
    const [combos, setCombos] = useState<ComboRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('last_30_days');
    const [periodLabel, setPeriodLabel] = useState('Last 30 Days');
    const [showPeriodPicker, setShowPeriodPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'index') {
            fetchPopularity();
        } else if (activeTab === 'engineering') {
            fetchMenuEngineering();
        } else {
            fetchComboRecommendations();
        }
    }, [period, activeTab]);

    const fetchPopularity = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/analytics/item-popularity?period=${period}`);
            setItems(res.data.items);
        } catch (err) {
            console.error("Failed to fetch popularity data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuEngineering = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/analytics/menu-engineering?period=${period}`);
            setEngItems(res.data.items);
            setEngAverages(res.data.averages);
        } catch (err) {
            console.error("Failed to fetch menu engineering data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComboRecommendations = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/analytics/combo-recommendations?period=${period}`);
            setCombos(res.data.recommendations);
        } catch (err) {
            console.error("Failed to fetch combo data", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEngItems = engItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chartData = filteredItems.slice(0, 10).map(item => ({
        name: item.name.length > 14 ? item.name.substring(0, 12) + '…' : item.name,
        popularity: item.popularity_score,
        revenue: Math.round(item.revenue / 100),
    }));

    const totalRevenue = items.reduce((s, i) => s + i.revenue, 0);
    const avgPopularity = items.length
        ? (items.reduce((s, i) => s + i.popularity_score, 0) / items.length).toFixed(1)
        : '0';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload?.length) {
            return (
                <div style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    boxShadow: 'var(--shadow-lg)',
                }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{label}</div>
                    {payload.map((p: any, i: number) => (
                        <div key={i} style={{ fontSize: 'var(--text-xs)', color: p.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                            {p.name}: {p.value}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const kpis = [
        { label: 'Market Leader', value: items[0]?.name || '---', icon: <Trophy size={20} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Avg Popularity', value: `${avgPopularity}%`, icon: <Sparkles size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        { label: 'Items Analyzed', value: items.length.toString(), icon: <Target size={20} />, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart3 size={20} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        }}>
                            <Cpu size={22} />
                        </div>
                        <h1 className="page-title">Revenue Intelligence</h1>
                        <span style={{
                            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                            padding: '2px 10px', borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-xs)', fontWeight: 700, color: '#6366f1',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                            Live
                        </span>
                    </div>
                    <p className="page-subtitle">Algorithmic scoring of menu item performance & demand signals</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', position: 'relative' }}>
                    <button className="btn btn-secondary" onClick={() => setShowPeriodPicker(!showPeriodPicker)} style={{ gap: 'var(--space-2)' }}>
                        <Calendar size={14} />
                        {periodLabel}
                        <ChevronDown size={14} />
                    </button>
                    {showPeriodPicker && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, marginTop: 'var(--space-1)',
                            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                            zIndex: 50, overflow: 'hidden', minWidth: 160,
                        }}>
                            {periods.map(f => (
                                <button key={f.value} className="sidebar-item" style={{
                                    borderRadius: 0, padding: 'var(--space-2) var(--space-4)',
                                    color: f.value === period ? 'var(--color-primary)' : undefined,
                                }} onClick={() => { setPeriod(f.value); setPeriodLabel(f.label); setShowPeriodPicker(false); }}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Subsection Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                {[
                    { id: 'index', label: 'Intelligence Index', icon: <List size={16} /> },
                    { id: 'engineering', label: 'Menu Engineering', icon: <Zap size={16} />, Badge: 'AI' },
                    { id: 'combo', label: 'Combo Intelligence', icon: <Layers size={16} />, Badge: 'NEW' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            padding: 'var(--space-3) var(--space-2)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                            transition: 'all 0.2s',
                            background: 'none',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.Badge && (
                            <span style={{
                                marginLeft: 4,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: tab.id === 'engineering' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: tab.id === 'engineering' ? '#a855f7' : '#10B981',
                                fontSize: '10px'
                            }}>{tab.Badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Loader2 size={32} className="spin" style={{ color: '#6366f1', marginBottom: 'var(--space-3)' }} />
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                            {activeTab === 'index' ? 'Analyzing index data...' : activeTab === 'engineering' ? 'Calculating engineering matrix...' : 'Mining association patterns...'}
                        </div>
                    </div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === 'index' && (
                        <motion.div key="index-view" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {/* KPI Grid */}
                            <div className="kpi-grid">
                                {kpis.map((kpi, idx) => (
                                    <motion.div key={kpi.label} className="kpi-card"
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                                    >
                                        <div className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                                            {kpi.icon}
                                        </div>
                                        <div className="kpi-value">{kpi.value}</div>
                                        <div className="kpi-label">{kpi.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <div className="chart-title">Performance Matrix</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Popularity vs Revenue (Top 10)</div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="gradPop" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                            <XAxis
                                                dataKey="name"
                                                interval={0}
                                                angle={-20}
                                                textAnchor="end"
                                                height={70}
                                                tick={{ fill: 'var(--color-text-secondary)', fontSize: 9 }}
                                                axisLine={{ stroke: 'var(--color-border)' }}
                                            />
                                            <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="popularity" name="Popularity %" stroke="#6366f1" fill="url(#gradPop)" strokeWidth={2.5} />
                                            <Area type="monotone" dataKey="revenue" name="Revenue (×100)" stroke="#a855f7" fill="url(#gradRev)" strokeWidth={2.5} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <div className="chart-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Sparkles size={16} style={{ color: '#a855f7' }} />
                                            <div className="chart-title">Top Engineering Focus</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                                        {items.slice(0, 3).map((item, i) => (
                                            <div key={item.id} style={{
                                                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                                background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{item.name}</span>
                                                    <span style={{ fontSize: '10px', color: '#6366f1' }}>{item.popularity_score}% Pop</span>
                                                </div>
                                                <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                                    Ranked #{i + 1} with ₹{item.revenue.toLocaleString()} revenue. {item.trend === 'up' ? 'Strengthening position.' : 'Monitoring stability.'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{
                                    padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'var(--color-bg-hover)',
                                }}>
                                    <div>
                                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Intelligence Index</h2>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                        <input
                                            type="text"
                                            placeholder="Filter items..."
                                            className="input"
                                            style={{ paddingLeft: 34, width: 220, fontSize: 'var(--text-sm)' }}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                {['Rank', 'Item', 'Category', 'Price / Profit', 'Orders', 'Popularity', 'Revenue'].map(h => (
                                                    <th key={h} style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase',
                                                        letterSpacing: '0.06em', color: 'var(--color-text-tertiary)',
                                                        background: 'var(--color-bg)',
                                                    }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredItems.map((item, idx) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: idx < 3 ? '#6366f1' : 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                                        {(idx + 1).toString().padStart(2, '0')}
                                                    </td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                        <div style={{ fontSize: 'var(--text-xs)', color: item.trend === 'up' ? '#10B981' : item.trend === 'down' ? '#EF4444' : 'var(--color-text-tertiary)' }}>
                                                            {item.trend} trend
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{item.category}</td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                        <div style={{ fontWeight: 600 }}>₹{item.price}</div>
                                                        <div style={{ fontSize: 'var(--text-xs)', color: '#10B981' }}>+₹{(item.price - item.making_cost).toFixed(0)}</div>
                                                    </td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{item.order_count}</td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                                                        <div style={{ width: 100, height: 6, background: 'var(--color-bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                                                            <div style={{ width: `${item.popularity_score}%`, height: '100%', background: '#6366f1' }} />
                                                        </div>
                                                        <div style={{ fontSize: '10px', marginTop: 4 }}>{item.popularity_score}%</div>
                                                    </td>
                                                    <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 700 }}>
                                                        ₹{item.revenue.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'engineering' && (
                        <motion.div key="engineering-view" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            {/* Menu Engineering Grid/Matrix */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                                {/* Matrix Visualization */}
                                <div className="chart-container" style={{ padding: 'var(--space-6)' }}>
                                    <div className="chart-header" style={{ marginBottom: 'var(--space-6)' }}>
                                        <div className="chart-title">Menu Matrix (Popularity vs Margin)</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Identifying your Stars, Puzzles, Plowhorses, and Dogs</div>
                                    </div>
                                    <div style={{ height: 400, width: '100%', position: 'relative' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                                <XAxis
                                                    type="number"
                                                    dataKey="popularity_score"
                                                    name="Popularity"
                                                    unit="%"
                                                    domain={[0, 'auto']}
                                                    axisLine={{ stroke: 'var(--color-border)' }}
                                                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                                                >
                                                    <LabelList dataKey="name" position="top" style={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                                                </XAxis>
                                                <YAxis
                                                    type="number"
                                                    dataKey="margin"
                                                    name="Margin"
                                                    unit="₹"
                                                    domain={[0, 'auto']}
                                                    axisLine={{ stroke: 'var(--color-border)' }}
                                                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                                                />
                                                <ZAxis type="number" range={[60, 400]} />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                                <Scatter name="Menu Items" data={engItems} fill="#6366f1">
                                                    {engItems.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                entry.category === 'Star' ? '#10B981' :
                                                                    entry.category === 'Puzzle' ? '#6366f1' :
                                                                        entry.category === 'Plowhorse' ? '#F59E0B' :
                                                                            '#EF4444'
                                                            }
                                                        />
                                                    ))}
                                                </Scatter>
                                            </ScatterChart>
                                        </ResponsiveContainer>

                                        {/* Quadrant Labels Overlay */}
                                        <div style={{ position: 'absolute', top: 50, right: 30, pointerEvents: 'none' }}>
                                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700 }}>STAR</div>
                                        </div>
                                        <div style={{ position: 'absolute', top: 50, left: 60, pointerEvents: 'none' }}>
                                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700 }}>PUZZLE</div>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: 50, right: 30, pointerEvents: 'none' }}>
                                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700 }}>PLOWHORSE</div>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: 50, left: 60, pointerEvents: 'none' }}>
                                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700 }}>DOG</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                <Sparkles size={20} />
                                            </div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-md)' }}>AURA Engineering Insight</div>
                                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>AI-Driven Strategy Generator</div>
                                            </div>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                                            Your menu currently has <strong>{engItems.filter(i => i.category === 'Star').length} Stars</strong>.
                                            The overall average margin is <strong>₹{engAverages?.margin.toFixed(0)}</strong>.
                                            {engItems.filter(i => i.category === 'Puzzle').length > 0 ? ' There are several "Puzzles" with high profit potential waiting to be promoted.' : ''}
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}>Avg Margin</div>
                                                <div style={{ color: 'white', fontSize: 'var(--text-lg)', fontWeight: 700 }}>₹{engAverages?.margin.toFixed(0)}</div>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}>Menu Balance</div>
                                                <div style={{ color: 'white', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Excellent</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Items List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>Recommended Actions</h3>
                                        {engItems.filter(i => i.category !== 'Star' && i.category !== 'Dog').slice(0, 3).map(item => (
                                            <div key={item.id} style={{
                                                padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                                                background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                                                display: 'flex', gap: 'var(--space-4)', alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                                    background: item.category === 'Puzzle' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: item.category === 'Puzzle' ? '#6366f1' : '#F59E0B',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                }}>
                                                    {item.category === 'Puzzle' ? <Search size={24} /> : <TrendingUp size={24} />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.name}</span>
                                                        <span style={{ fontSize: '10px', fontWeight: 700, color: item.category === 'Puzzle' ? '#6366f1' : '#F59E0B' }}>{item.category.toUpperCase()}</span>
                                                    </div>
                                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                                        {item.insight}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed List Engineering */}
                            <div className="card" style={{ padding: 0 }}>
                                <div style={{
                                    padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'var(--color-bg-hover)',
                                }}>
                                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Menu Classification</h2>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                        <input
                                            type="text"
                                            placeholder="Search items..."
                                            className="input"
                                            style={{ paddingLeft: 34, width: 220, fontSize: 'var(--text-sm)' }}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
                                    {filteredEngItems.map(item => (
                                        <div key={item.id} style={{
                                            padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)',
                                            background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
                                            display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginBottom: 2 }}>{item.name}</div>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <span style={{
                                                            padding: '2px 8px', borderRadius: 4,
                                                            background:
                                                                item.category === 'Star' ? 'rgba(16, 185, 129, 0.1)' :
                                                                    item.category === 'Puzzle' ? 'rgba(99, 102, 241, 0.1)' :
                                                                        item.category === 'Plowhorse' ? 'rgba(245, 158, 11, 0.1)' :
                                                                            'rgba(239, 68, 68, 0.1)',
                                                            color:
                                                                item.category === 'Star' ? '#10B981' :
                                                                    item.category === 'Puzzle' ? '#6366f1' :
                                                                        item.category === 'Plowhorse' ? '#F59E0B' :
                                                                            '#EF4444',
                                                            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase'
                                                        }}>
                                                            {item.category}
                                                        </span>
                                                        <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Margin: ₹{item.margin.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>RECOMMENDATION</div>
                                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{item.recommended_action}</div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, background: 'var(--color-bg)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                                {item.insight}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'combo' && (
                        <motion.div key="combo-view" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            {/* Combo Intelligence Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                                {/* Cluster/Relationship View (Mock Visualization for now) */}
                                <div className="chart-container" style={{ padding: 'var(--space-6)', background: 'var(--color-bg-card)' }}>
                                    <div className="chart-header" style={{ marginBottom: 'var(--space-6)' }}>
                                        <div className="chart-title">AURA Association Web</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Statistical relationships between menu items</div>
                                    </div>
                                    <div style={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        {/* A simplified visual representation of nodes and links */}
                                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                            {combos.slice(0, 4).map((combo, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${20 + i * 20}%`,
                                                        top: `${30 + (i % 2) * 20}%`,
                                                        padding: 'var(--space-4)',
                                                        background: 'rgba(99, 102, 241, 0.05)',
                                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-3)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        zIndex: 2
                                                    }}
                                                >
                                                    <div style={{ color: '#6366f1' }}><Share2 size={20} /></div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', fontWeight: 700 }}>{combo.combo_name}</div>
                                                        <div style={{ fontSize: '9px', color: 'var(--color-text-tertiary)' }}>Lift: {combo.lift.toFixed(1)}x</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid var(--color-bg)' }}>
                                                    <Target size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendation Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                <Star size={20} />
                                            </div>
                                            <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-md)' }}>Top Bundle Opportunity</div>
                                        </div>
                                        {combos[0] && (
                                            <>
                                                <h3 style={{ color: 'white', fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{combos[0].combo_name}</h3>
                                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-sm)', lineHeight: 1.5, marginBottom: 'var(--space-4)' }}>
                                                    {combos[0].insight} By bundling these, you can increase ticket size by <strong>₹{combos[0].total_price.toFixed(0)}</strong>.
                                                </p>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', color: 'white', fontWeight: 600 }}>Confidence: {(combos[0].confidence * 100).toFixed(0)}%</div>
                                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', color: 'white', fontWeight: 600 }}>Target: High Profit</div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>Combo Insights</h3>
                                        {combos.slice(1, 5).map((combo, i) => (
                                            <div key={i} style={{
                                                padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                                                background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{combo.combo_name}</span>
                                                    </div>
                                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)' }}>{combo.lift.toFixed(1)}x LIFT</div>
                                                </div>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>
                                                    {combo.insight}
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>Est. Margin: ₹{combo.total_margin.toFixed(0)}</div>
                                                    <button style={{
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        color: '#6366f1',
                                                        border: 'none',
                                                        padding: '4px 8px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        cursor: 'pointer'
                                                    }}>
                                                        <Plus size={12} /> CREATE COMBO
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Rules Table */}
                            <div className="card" style={{ padding: 0 }}>
                                <div style={{
                                    padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'var(--color-bg-hover)',
                                }}>
                                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Association Rules Engine</h2>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Total Transactions: {combos.length > 0 ? 'Loading from AI model...' : 'Analyzed'}</div>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                                                {['Recommendation', 'Lift Score', 'Confidence', 'Support', 'Margin potential', 'Strategic Action'].map(h => (
                                                    <th key={h} style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                                        color: 'var(--color-text-tertiary)',
                                                    }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {combos.map((combo, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                                                    <td style={{ padding: 'var(--space-4)' }}>
                                                        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{combo.combo_name}</div>
                                                        <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{combo.items.join(' + ')}</div>
                                                    </td>
                                                    <td style={{ padding: 'var(--space-4)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <div style={{ width: 40, height: 4, background: 'var(--color-bg-hover)', borderRadius: 2 }}>
                                                                <div style={{ width: `${Math.min(100, (combo.lift / 5) * 100)}%`, height: '100%', background: '#6366f1' }} />
                                                            </div>
                                                            <span style={{ fontSize: '11px', fontWeight: 700 }}>{combo.lift.toFixed(1)}x</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 'var(--space-4)', fontSize: '11px', fontWeight: 600 }}>{(combo.confidence * 100).toFixed(0)}%</td>
                                                    <td style={{ padding: 'var(--space-4)', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{(combo.support * 100).toFixed(1)}%</td>
                                                    <td style={{ padding: 'var(--space-4)', color: '#10B981', fontWeight: 700 }}>₹{combo.total_margin.toFixed(0)}</td>
                                                    <td style={{ padding: 'var(--space-4)' }}>
                                                        <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{combo.recommended_action}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}


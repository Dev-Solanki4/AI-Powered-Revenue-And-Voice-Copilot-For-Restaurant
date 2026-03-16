// ==========================================
// PetPooja - Heatmap Views
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHeatmapColor, formatCurrency } from '../../lib/utils';
import { apiClient } from '../../lib/api';
import { Loader2 } from 'lucide-react';

const hours = ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
const views = ['Occupancy', 'Revenue', 'Order Density'] as const;

interface HeatmapSummary {
    peak_hour: string;
    peak_hour_sub: string;
    busiest_table: string;
    busiest_table_sub: string;
    avg_occupancy: string;
    avg_occupancy_sub: string;
    revenue_density: string;
    revenue_density_sub: string;
}

export default function Heatmap() {
    const [activeView, setActiveView] = useState<typeof views[number]>('Occupancy');
    const [hoveredCell, setHoveredCell] = useState<{ table: number; hour: number; value: number } | null>(null);
    const [heatmapData, setHeatmapData] = useState<number[][]>([]);
    const [summary, setSummary] = useState<HeatmapSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        apiClient.get('/api/heatmap?period=today')
            .then(({ data }) => {
                if (!cancelled) {
                    setHeatmapData(data.heatmap_data || []);
                    setSummary(data.summary || null);
                }
            })
            .catch((err) => console.error('Heatmap fetch error:', err))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={32} className="spin" style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }} />
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Loading heatmap data...</div>
                </div>
            </div>
        );
    }

    const summaryCards = summary ? [
        { label: 'Peak Hour', value: summary.peak_hour, sub: summary.peak_hour_sub },
        { label: 'Busiest Table', value: summary.busiest_table, sub: summary.busiest_table_sub },
        { label: 'Avg Occupancy', value: summary.avg_occupancy, sub: summary.avg_occupancy_sub },
        { label: 'Revenue Density', value: summary.revenue_density, sub: summary.revenue_density_sub },
    ] : [
        { label: 'Peak Hour', value: '-', sub: 'No data' },
        { label: 'Busiest Table', value: '-', sub: 'No data' },
        { label: 'Avg Occupancy', value: '0%', sub: 'No data' },
        { label: 'Revenue Density', value: '₹0/hr', sub: 'No data' },
    ];

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Heatmap Analytics</h1>
                    <p className="page-subtitle">Visual occupancy and revenue density by table and hour</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {views.map((v) => (
                        <button
                            key={v}
                            className={`btn ${activeView === v ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => setActiveView(v)}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {hoveredCell && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: 'var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        display: 'inline-flex',
                        gap: 'var(--space-4)',
                    }}
                >
                    <span><strong>Table {hoveredCell.table + 1}</strong></span>
                    <span>{hours[hoveredCell.hour]}</span>
                    <span>{activeView === 'Revenue' ? formatCurrency(hoveredCell.value * 50) : `${hoveredCell.value}%`}</span>
                </motion.div>
            )}

            {/* Heatmap Grid */}
            <div className="card" style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '800px' }}>
                    {/* Hour labels */}
                    <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${hours.length}, 1fr)`, gap: '3px', marginBottom: '3px' }}>
                        <div />
                        {hours.map((h) => (
                            <div key={h} style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', padding: 'var(--space-1)' }}>
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Table rows */}
                    {heatmapData.map((row, tableIdx) => (
                        <div
                            key={tableIdx}
                            style={{ display: 'grid', gridTemplateColumns: `80px repeat(${hours.length}, 1fr)`, gap: '3px', marginBottom: '3px' }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                paddingLeft: 'var(--space-2)',
                            }}>
                                Table {tableIdx + 1}
                            </div>
                            {row.map((value, hourIdx) => (
                                <motion.div
                                    key={hourIdx}
                                    className="heatmap-cell"
                                    style={{ background: getHeatmapColor(value), height: '36px', borderRadius: 'var(--radius-sm)' }}
                                    onMouseEnter={() => setHoveredCell({ table: tableIdx, hour: hourIdx, value })}
                                    onMouseLeave={() => setHoveredCell(null)}
                                    whileHover={{ scale: 1.15 }}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', justifyContent: 'center' }}>
                    <span className="text-xs text-secondary">Low</span>
                    {[0.15, 0.3, 0.4, 0.55, 0.7].map((opacity, idx) => (
                        <div key={idx} style={{
                            width: '28px',
                            height: '16px',
                            borderRadius: 'var(--radius-sm)',
                            background: idx < 2 ? `rgba(16, 185, 129, ${opacity})` : idx < 3 ? `rgba(245, 158, 11, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                        }} />
                    ))}
                    <span className="text-xs text-secondary">High</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                {summaryCards.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        className="card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                    >
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-1)' }}>{stat.value}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{stat.sub}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

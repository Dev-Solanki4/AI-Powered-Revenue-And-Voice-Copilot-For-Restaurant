import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChartBarIcon,
    FireIcon,
    ExclamationCircleIcon,
    BoltIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AIAlerts() {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            title: 'Sales Volume Drop Detected',
            description: 'Overall sales have dropped 25% compared to yesterday at this time. This is unusual for a Friday evening.',
            type: 'negative',
            icon: ChartBarIcon,
            impact: 'Critical Revenue Risk',
            trend: '-25%'
        },
        {
            id: 2,
            title: 'Surge in Demand',
            description: 'Paneer Butter Masala orders have increased by 140% today. Consider prepping extra ingredients immediately.',
            type: 'positive',
            icon: FireIcon,
            impact: 'High Opportunity',
            trend: '+140%'
        },
        {
            id: 3,
            title: 'Suspicious Refund Activity',
            description: 'Cashier Ankit Mehra has issued 3 refunds in the last 15 minutes. This exceeds the normal threshold of 1 per hour.',
            type: 'critical',
            icon: ExclamationCircleIcon,
            impact: 'Security Compliance',
            trend: 'Check Logs'
        },
        {
            id: 4,
            title: 'Operational Inefficiency',
            description: 'Table turnover rate is currently 15% slower than usual. Investigate kitchen dispatch times or floor staff headcount.',
            type: 'warning',
            icon: BoltIcon,
            impact: 'Efficiency Warning',
            trend: '+15.2m'
        }
    ]);

    const dismissAlert = (id: number) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="alerts-section">
            <div className="alerts-content-container">
                <div className="alerts-section-header">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="alerts-section-title">AURA AI Intelligence</h1>
                        <p className="alerts-section-subtitle">Deep learning insights detecting hidden operational bottlenecks and revenue opportunities.</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {alerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`alerts-card border-none glass-morphism active:scale-[0.98] transition-all
                                    ${alert.type === 'negative' ? 'hover:shadow-orange-500/10' : ''}
                                    ${alert.type === 'positive' ? 'hover:shadow-green-500/10' : ''}
                                    ${alert.type === 'critical' ? 'hover:shadow-red-500/10' : ''}
                                    ${alert.type === 'warning' ? 'hover:shadow-purple-500/10' : ''}
                                `}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none
                                    ${alert.type === 'negative' ? 'bg-orange-400' : ''}
                                    ${alert.type === 'positive' ? 'bg-green-400' : ''}
                                    ${alert.type === 'critical' ? 'bg-red-500' : ''}
                                    ${alert.type === 'warning' ? 'bg-purple-400' : ''}
                                `}></div>

                                <div className="p-1">
                                    <div className="flex items-start gap-5">
                                        <div className={`p-4 rounded-2xl shrink-0 shadow-lg
                                            ${alert.type === 'negative' ? 'bg-orange-500 text-white shadow-orange-500/20' : ''}
                                            ${alert.type === 'positive' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : ''}
                                            ${alert.type === 'critical' ? 'bg-rose-500 text-white shadow-rose-500/20' : ''}
                                            ${alert.type === 'warning' ? 'bg-indigo-500 text-white shadow-indigo-500/20' : ''}
                                        `}>
                                            <alert.icon className="w-8 h-8" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60">
                                                    {alert.impact}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`status-dot status-pulse bg-current opacity-70
                                                        ${alert.type === 'negative' ? 'text-orange-500' : ''}
                                                        ${alert.type === 'positive' ? 'text-emerald-500' : ''}
                                                        ${alert.type === 'critical' ? 'text-rose-500' : ''}
                                                        ${alert.type === 'warning' ? 'text-indigo-500' : ''}
                                                    `}></span>
                                                    <span className="font-mono text-xs font-bold">{alert.trend}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 tracking-tight">
                                                {alert.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                                                {alert.description}
                                            </p>

                                            <div className="flex gap-4">
                                                <button className={`btn py-2.5 px-6 rounded-xl text-sm font-bold flex items-center gap-2 group transition-all
                                                    ${alert.type === 'negative' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
                                                    ${alert.type === 'positive' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                                                    ${alert.type === 'critical' ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
                                                    ${alert.type === 'warning' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''}
                                                `}>
                                                    Analyze Deeply
                                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => dismissAlert(alert.id)}
                                                    className="btn btn-ghost border border-gray-200 dark:border-gray-700 dark:hover:bg-white/5 py-2.5 px-4 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {alerts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700"
                        >
                            <BoltIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Clear</h3>
                            <p className="text-gray-500">AURA AI has not detected any significant anomalies requiring your attention.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FunnelIcon,
    Squares2X2Icon,
    TableCellsIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DUMMY_TABLE_ALERTS = [
    { id: '1', table: 'Table 3', type: 'Waiting for waiter', time: '8 min', status: 'Active', severity: 'warning' },
    { id: '2', table: 'Table 5', type: 'Order not taken', time: '10 min', status: 'Active', severity: 'critical' },
    { id: '3', table: 'Table 7', type: 'Bill requested', time: '3 min', status: 'Active', severity: 'low' },
    { id: '4', table: 'Table 12', type: 'Cleaning required', time: '15 min', status: 'Active', severity: 'critical' },
    { id: '5', table: 'Table 2', type: 'Payment failed', time: '2 min', status: 'Resolved', severity: 'low' },
    { id: '6', table: 'Table 9', type: 'Bill requested', time: '1 min', status: 'Resolved', severity: 'low' },
];

export default function TableAlerts() {
    const [alerts, setAlerts] = useState(DUMMY_TABLE_ALERTS);
    const [showToast, setShowToast] = useState(false);

    const resolveAlert = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="alerts-section">
            <div className="alerts-content-container">
                <div className="alerts-section-header">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="alerts-section-title">Dining Area Intelligence</h1>
                        <p className="alerts-section-subtitle">Real-time floor map bottlenecks and service requirements.</p>
                    </motion.div>
                </div>

                <div className="mb-6 flex gap-4 items-center">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <Squares2X2Icon className="w-5 h-5 text-primary" />
                        </button>
                        <button className="p-2 opacity-50">
                            <TableCellsIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button className="btn btn-ghost border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/30 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2">
                        <FunnelIcon className="w-4 h-4" />
                        Map View
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {alerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`alerts-card mb-0 flex flex-col justify-between border-t-4 glass-morphism
                                    ${alert.status === 'Resolved' ? 'opacity-40 grayscale' :
                                        alert.severity === 'critical' ? 'border-t-rose-500' : 'border-t-amber-500'}
                                `}
                            >
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-black text-primary">
                                            {alert.table.split(' ')[1]}
                                        </div>
                                        {alert.status === 'Active' && (
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                                ${alert.severity === 'critical' ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-700'}
                                            `}>
                                                <ClockIcon className="w-3.5 h-3.5" />
                                                {alert.time}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-md font-bold mb-1">{alert.type}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Zone: Main Floor</p>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    {alert.status === 'Active' ? (
                                        <button
                                            onClick={() => resolveAlert(alert.id)}
                                            className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            Complete Request
                                        </button>
                                    ) : (
                                        <div className="w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-500">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Service Completed
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="alerts-toast glass-morphism border-emerald-500/30 !bg-emerald-500/10 text-emerald-600"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Table service confirmed and logged.
                    </motion.div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    UserCircleIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const DUMMY_ORDER_ALERTS = [
    { id: '1', orderId: '#1045', customer: 'Rahul Sharma', type: 'Kitchen delay', time: '12:05 PM', status: 'Active', severity: 'critical' },
    { id: '2', orderId: '#1046', customer: 'Priya Patel', type: 'Payment pending', time: '12:12 PM', status: 'Active', severity: 'warning' },
    { id: '3', orderId: '#1047', customer: 'Ankit Mehra', type: 'Order modification', time: '12:20 PM', status: 'Resolved', severity: 'low' },
    { id: '4', orderId: '#1048', customer: 'Riya Verma', type: 'Allergy warning', time: '12:35 PM', status: 'Active', severity: 'critical' },
    { id: '5', orderId: '#1049', customer: 'Karan Singh', type: 'Priority rush requested', time: '12:40 PM', status: 'Resolved', severity: 'low' },
    { id: '6', orderId: '#1050', customer: 'Sonia Bajaj', type: 'Item out of stock', time: '12:42 PM', status: 'Active', severity: 'warning' },
];

export default function OrderAlerts() {
    const [alerts, setAlerts] = useState(DUMMY_ORDER_ALERTS);
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAlerts = alerts.filter(a =>
        a.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <h1 className="alerts-section-title">Order Action Center</h1>
                        <p className="alerts-section-subtitle">Track individual order lifecycle blockages in real-time.</p>
                    </motion.div>
                </div>

                <div className="mb-6 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder="Find order or customer..."
                            className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 rounded-2xl px-6 py-3 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <FunnelIcon className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredAlerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`alerts-card mb-0 p-5 flex items-center justify-between border-none glass-morphism 
                                    ${alert.status === 'Resolved' ? 'opacity-40 grayscale pointer-events-none' : ''}
                                `}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-full 
                                        ${alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}
                                    `}>
                                        <ExclamationCircleIcon className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-black tracking-tight text-primary">{alert.orderId}</span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                                <UserCircleIcon className="w-3.5 h-3.5" />
                                                {alert.customer}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold">
                                            <span className={`
                                                ${alert.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}
                                            `}>{alert.type}</span>
                                            <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                <ClockIcon className="w-4 h-4" />
                                                {alert.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    {alert.status === 'Active' ? (
                                        <>
                                            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all">
                                                View Items
                                            </button>
                                            <button
                                                onClick={() => resolveAlert(alert.id)}
                                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                                            >
                                                Resolve
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 pr-4">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Archived
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredAlerts.length === 0 && (
                        <div className="py-20 text-center bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                            <ArrowPathIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold">No active alerts found</p>
                        </div>
                    )}
                </div>

                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="alerts-toast glass-morphism border-emerald-500/30 !bg-emerald-500/10 text-emerald-600"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Alert successfully dismissed.
                    </motion.div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    ServerIcon,
    BanknotesIcon,
    ArrowsRightLeftIcon,
    CircleStackIcon,
    CheckCircleIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

const DUMMY_OP_ALERTS = [
    { id: '1', alert: 'Low stock: Premium Cheese', module: 'Inventory', trigger: 'Stock < 5 kg', time: '11:45 AM', status: 'Active', icon: CircleStackIcon, color: 'orange' },
    { id: '2', alert: 'Payment Gateway Failure', module: 'Billing', trigger: 'UPI timeout', time: '12:10 PM', status: 'Active', icon: BanknotesIcon, color: 'red' },
    { id: '3', alert: 'High discount applied (Rahul S.)', module: 'Billing', trigger: '>20% total bill', time: '12:15 PM', status: 'Active', icon: BanknotesIcon, color: 'purple' },
    { id: '4', alert: 'Cash Drawer Variance', module: 'Cash Management', trigger: '₹500 mismatch', time: 'EOD Shift', status: 'Active', icon: BanknotesIcon, color: 'red' },
    { id: '5', alert: 'API Integration Sync Error', module: 'Zomato Sync', trigger: 'Failed payload', time: '01:05 PM', status: 'Resolved', icon: ArrowsRightLeftIcon, color: 'blue' },
    { id: '6', alert: 'Low stock: Basmati Rice', module: 'Inventory', trigger: 'Stock < 10 kg', time: '02:30 PM', status: 'Active', icon: CircleStackIcon, color: 'orange' },
];

export default function OperationalAlerts() {
    const [alerts, setAlerts] = useState(DUMMY_OP_ALERTS);
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="alerts-section-title">Operational Integrity</h1>
                        <p className="alerts-section-subtitle">System-level warnings affecting restaurant capacity and financial syncs.</p>
                    </motion.div>
                    <button className="btn btn-secondary flex items-center bg-orange-50 dark:bg-orange-900/10 text-orange-600 border border-orange-100 dark:border-orange-800/50 hover:bg-orange-100 transition-all rounded-xl px-4 py-2">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                        Acknowledge All
                    </button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {alerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`alerts-card mb-0 p-4 flex items-center gap-6 border-l-4 
                                    ${alert.status === 'Resolved' ? 'opacity-50 grayscale' : 'border-l-orange-500'}
                                    hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all
                                `}
                            >
                                <div className={`p-3 rounded-xl 
                                    ${alert.status === 'Resolved' ? 'bg-gray-100 text-gray-500 dark:bg-gray-800' : 'bg-orange-500/10 text-orange-500'}
                                `}>
                                    <alert.icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-bold tracking-tight">{alert.alert}</h3>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                                            {alert.module}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <BoltIcon className="w-3.5 h-3.5" />
                                            {alert.trigger}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <ServerIcon className="w-3.5 h-3.5" />
                                            Detected at {alert.time}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    {alert.status === 'Active' ? (
                                        <button
                                            className="btn btn-ghost hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10 border border-gray-100 dark:border-gray-800 py-1.5 px-4 text-xs font-bold rounded-lg"
                                            onClick={() => resolveAlert(alert.id)}
                                        >
                                            Acknowledge
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold px-4">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Resolved
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="alerts-toast glass-morphism border-emerald-500/50 !bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Operational alert successfully logged and archived.
                    </motion.div>
                )}
            </div>
        </div>
    );
}

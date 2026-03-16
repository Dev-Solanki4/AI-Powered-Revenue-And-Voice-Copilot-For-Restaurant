import { useState } from 'react';
import { ShieldExclamationIcon, SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Policy {
    id: string;
    table: string;
    name: string;
    description: string;
    enabled: boolean;
}

export default function RlsPolicies() {
    const [showToast, setShowToast] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(true);
    const [policies, setPolicies] = useState<Policy[]>([
        {
            id: 'pol-1',
            table: 'Orders',
            name: 'Branch Isolation Policy',
            description: 'Cashiers and Waiters can only access or modify orders created within their assigned restaurant branch.',
            enabled: true,
        },
        {
            id: 'pol-2',
            table: 'Reports',
            name: 'Executive Visibility',
            description: 'Only users with the Admin or Manager role can view aggregated financial reports.',
            enabled: true,
        },
        {
            id: 'pol-3',
            table: 'Inventory',
            name: 'Stock Modification Guard',
            description: 'Modifying stock quantities requires Manager or Admin authorization. Waiters have read-only access.',
            enabled: false,
        }
    ]);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const togglePolicy = (id: string) => {
        setPolicies(policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    };

    return (
        <div className="security-section relative">
            <div className="security-section-header">
                <h1 className="security-section-title">Row Level Security (RLS)</h1>
                <p className="security-section-subtitle">Database-level row isolation rules and AI-powered security alerts.</p>
            </div>

            {/* AI Security Alerts Section */}
            <div className={`mb-8 border rounded-2xl overflow-hidden transition-all ${aiEnabled ? 'border-indigo-200 dark:border-indigo-800 shadow-sm' : 'border-gray-200 dark:border-gray-800 opacity-60'}`}>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-5 flex items-start justify-between border-b border-indigo-100 dark:border-indigo-800/50">
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-xl mt-1 ${aiEnabled ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                            <SparklesIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                AURA Security Sentinel
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                                AI continuously monitors logs and transaction patterns for anomalous behavior inside your POS.
                            </p>
                        </div>
                    </div>
                    <label className="toggle-switch mt-2">
                        <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className={`transition-all duration-500 ease-in-out bg-white dark:bg-gray-900 ${aiEnabled ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex gap-3 p-3 rounded-lg border border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-800 dark:text-red-400">Multiple failed login attempts detected</p>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">14 failed attempts on the Cashier Terminal 2. Recommend forcing a password reset for user ID: CST-11.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-lg border border-orange-100 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10">
                            <ShieldExclamationIcon className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">High discount usage detected</p>
                                <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">Manager applied the "Employee 50%" discount 14 times today, which is 300% above average daily usage.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RLS Policies Section */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 px-2">Active Database Policies</h2>
            <div className="space-y-4">
                {policies.map((policy) => (
                    <div key={policy.id} className="security-card p-0 overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{policy.name}</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                        Target: {policy.table}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {policy.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-6 shrink-0 sm:pl-6 sm:border-l border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Status</span>
                                    {policy.enabled ? (
                                        <span className="status-indicator enabled"><div className="status-dot" /> Enabled</span>
                                    ) : (
                                        <span className="status-indicator disabled"><div className="status-dot" /> Disabled</span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="btn btn-secondary py-1.5 px-3 text-xs">Edit SQL</button>
                                    <button
                                        onClick={() => togglePolicy(policy.id)}
                                        className={`btn text-xs py-1.5 px-3 ${policy.enabled ? 'btn-danger bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900 dark:hover:bg-red-900/40' : 'btn-success bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-900 dark:hover:bg-green-900/40'}`}
                                    >
                                        {policy.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mt-6 flex justify-end">
                    <button className="btn btn-primary" onClick={handleSave}>Deploy Policy Changes</button>
                </div>
            </div>

            {showToast && (
                <div className="security-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Security configurations deployed to database.
                </div>
            )}
        </div>
    );
}

import { FunnelIcon } from '@heroicons/react/24/outline';

interface LogEntry {
    id: string;
    user: string;
    role: string;
    action: string;
    module: string;
    timestamp: string;
    ip: string;
}

export default function AuditLogs() {
    const logs: LogEntry[] = [
        { id: 'al-01', user: 'Rahul Sharma', role: 'Admin', action: 'Changed security policy: Admin access', module: 'Security', timestamp: 'Oct 24, 2026 14:32:01', ip: '115.240.89.2' },
        { id: 'al-02', user: 'Neha Gupta', role: 'Manager', action: 'Applied 15% manual discount on Order #902', module: 'Billing', timestamp: 'Oct 24, 2026 13:15:44', ip: '192.168.1.45' },
        { id: 'al-03', user: 'Amit Patel', role: 'Cashier', action: 'Cancelled Item: Butter Chicken (x1) Order #899', module: 'Billing', timestamp: 'Oct 24, 2026 12:44:10', ip: '192.168.1.102' },
        { id: 'al-04', user: 'System', role: 'Automated', action: 'Completed Daily DB Backup', module: 'System', timestamp: 'Oct 24, 2026 02:00:00', ip: 'Internal' },
        { id: 'al-05', user: 'Rahul Sharma', role: 'Admin', action: 'Added New User: Amit Patel', module: 'Staff', timestamp: 'Oct 23, 2026 18:20:00', ip: '115.240.89.2' },
        { id: 'al-06', user: 'Neha Gupta', role: 'Manager', action: 'Updated Menu Item: Naan (Price 40 -> 45)', module: 'Menu', timestamp: 'Oct 23, 2026 16:11:05', ip: '192.168.1.45' },
    ];

    return (
        <div className="security-section">
            <div className="security-section-header">
                <div>
                    <h1 className="security-section-title">Audit Logs</h1>
                    <p className="security-section-subtitle">A tamper-proof record of all critical actions performed in the system.</p>
                </div>
                <button className="btn btn-secondary text-sm">
                    Export CSV
                </button>
            </div>

            <div className="security-card p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search logs by action, user, or IP..."
                            className="security-input w-full pl-10"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <FunnelIcon className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Description</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.user}</div>
                                        <div className="text-xs text-gray-500">{log.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-gray-300 line-clamp-2" title={log.action}>{log.action}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                        {log.ip}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/30">
                    <div>Showing <span className="font-medium text-gray-900 dark:text-gray-100">1</span> to <span className="font-medium text-gray-900 dark:text-gray-100">6</span> of <span className="font-medium text-gray-900 dark:text-gray-100">4,124</span> results</div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

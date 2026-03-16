import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const DUMMY_LOGS = [
    { id: '1', staff: 'Ankit Mehra', action: 'Cancelled order #1023', module: 'Billing', timestamp: '10-Mar-2026 11:30', ip: '192.168.1.2' },
    { id: '2', staff: 'Priya Patel', action: 'Edited menu item: Pizza', module: 'Menu', timestamp: '10-Mar-2026 12:15', ip: '192.168.1.3' },
    { id: '3', staff: 'Rahul Sharma', action: 'Updated staff role', module: 'Staff Mgmt', timestamp: '10-Mar-2026 13:00', ip: '192.168.1.1' },
    { id: '4', staff: 'Karan Singh', action: 'Generated Z-Report', module: 'Reports', timestamp: '10-Mar-2026 14:22', ip: '192.168.1.4' },
    { id: '5', staff: 'Riya Verma', action: 'Failed Login Attempt (PW)', module: 'System Login', timestamp: '10-Mar-2026 15:05', ip: '192.168.1.5' },
];

export default function StaffActivityLogs() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = DUMMY_LOGS.filter(log =>
        log.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Session & Activity Logs</h1>
                    <p className="staff-section-subtitle">A comprehensive, tamper-evident audit trail of all staff system interactions.</p>
                </div>
                <button className="btn btn-secondary border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    Export Logs (CSV)
                </button>
            </div>

            <div className="staff-card p-0 overflow-visible">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search logs by staff name, action, or module..."
                            className="staff-input pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1-2 -translate-y-1-2 text-gray-400" />
                    </div>

                    <select className="staff-select w-40 text-sm">
                        <option>All Modules</option>
                        <option>Billing</option>
                        <option>Menu</option>
                        <option>Staff Mgmt</option>
                        <option>Reports</option>
                    </select>

                    <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ml-auto">
                        <FunnelIcon className="w-4 h-4 mr-2" />
                        Date Filter
                    </button>
                </div>

                <div className="overflow-x-auto relative">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Event</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">System Module</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Device IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 relative">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {log.staff}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${log.action.includes('Failed') ? 'text-error font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-400 font-mono tracking-tighter">
                                        {log.ip}
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No activity logs found for "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/30">
                    <div>Showing <span className="font-medium text-gray-900 dark:text-gray-100">1</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{filteredLogs.length}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_LOGS.length}</span> records</div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 hover:bg-gray-50">Prev</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

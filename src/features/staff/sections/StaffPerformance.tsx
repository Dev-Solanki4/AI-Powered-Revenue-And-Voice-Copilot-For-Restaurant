import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyRupeeIcon,
    TagIcon,
    ReceiptRefundIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

const DUMMY_METRICS = [
    { id: '1', name: 'Ankit Mehra', role: 'Cashier', orders: 120, aov: 450, discounts: 15, refunds: 2, trend: '+12%' },
    { id: '2', name: 'Priya Patel', role: 'Manager', orders: 45, aov: 890, discounts: 3, refunds: 0, trend: '+4%' },
    { id: '3', name: 'Riya Verma', role: 'Waiter', orders: 85, aov: 320, discounts: 0, refunds: 0, trend: '-2%' },
];

export default function StaffPerformance() {
    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Performance & Analytics</h1>
                    <p className="staff-section-subtitle">Track individual staff KPIs, sales volume, and AI anomaly alerts.</p>
                </div>
                <div className="flex gap-2">
                    <select className="staff-select text-sm py-1.5 w-32">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            {/* AI Alert Banner */}
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4 flex gap-4 items-start shadow-sm">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                    <BoltIcon className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-400">AURA AI Alert: Unusual Cashier Activity</h3>
                    <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                        Cashier <strong>Ankit Mehra</strong> has issued 15 discounts today, which is <strong>320% higher</strong> than the weekly average. 2 refunds were also processed within a 10-minute window. Please review transaction logs.
                    </p>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Staff Orders', value: '1,204', trend: '+8.2%', icon: ArrowTrendingUpIcon },
                    { label: 'Avg Order Value', value: '₹420', trend: '+2.1%', icon: CurrencyRupeeIcon },
                    { label: 'Total Discounts', value: '42', trend: '-1.5%', icon: TagIcon, downIsGood: true },
                    { label: 'Total Refunds', value: '4', trend: '+14%', icon: ReceiptRefundIcon, badColor: true },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                            <stat.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
                            <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? (!stat.badColor ? 'text-success' : 'text-error') : (stat.downIsGood ? 'text-success' : 'text-error')}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Staff Activity Table */}
            <div className="staff-card p-0 overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h2 className="staff-card-title">Top Performing Staff</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders Handled</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">AOV (₹)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discounts</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Refunds</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {DUMMY_METRICS.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{staff.name}</div>
                                        <div className="text-xs text-gray-500">{staff.role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{staff.orders}</span>
                                            <span className={`text-[10px] font-bold ${staff.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {staff.trend}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        ₹{staff.aov}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${staff.discounts > 10 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            {staff.discounts} applied
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {staff.refunds > 0 ? (
                                            <span className="text-red-600 font-semibold">{staff.refunds}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visual Chart Placeholder Component */}
            <div className="staff-card">
                <h2 className="staff-card-title mb-1">Weekly Order Volume via Staff</h2>
                <p className="text-xs text-gray-500 mb-6">Displaying quantity of checks closed per day by front-of-house staff.</p>

                <div className="performance-chart">
                    {/* Pure CSS Bar Chart Mock */}
                    {[40, 65, 30, 80, 55, 90, 45].map((height, i) => (
                        <div key={i} className="flex flex-col flex-1 items-center h-full justify-end">
                            <div
                                className="w-full bg-primary rounded-t-md opacity-80 hover:opacity-100 transition-opacity relative group"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-8 left-1-2 -translate-x-1-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap">
                                    {Math.floor(height * 1.5)} Orders
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-2 uppercase font-medium">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

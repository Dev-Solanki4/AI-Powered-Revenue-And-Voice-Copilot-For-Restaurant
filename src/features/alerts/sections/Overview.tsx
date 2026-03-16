import {
    BellAlertIcon,
    TableCellsIcon,
    ClockIcon,
    TagIcon,
    ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const RECENT_ALERTS = [
    { id: 1, text: 'Table 5 waiting for service – 10 minutes', time: 'Just now', severity: 'warning', icon: TableCellsIcon },
    { id: 2, text: 'Order #1045 delayed – kitchen delay', time: '5m ago', severity: 'critical', icon: ClockIcon },
    { id: 3, text: 'Cashier applied 25% discount', time: '12m ago', severity: 'warning', icon: TagIcon },
    { id: 4, text: 'Refund issued on Order #1032', time: '45m ago', severity: 'critical', icon: ReceiptRefundIcon },
    { id: 5, text: 'AURA: Table turnover rate 15% slower today', time: '1h ago', severity: 'ai', icon: BellAlertIcon },
];

export default function Overview() {
    return (
        <div className="alerts-section">
            <div className="alerts-content-container">
                <div className="alerts-section-header">
                    <div>
                        <h1 className="alerts-section-title">Alerts Overview</h1>
                        <p className="alerts-section-subtitle">A high-level view of current systemic anomalies and pending resolutions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Active Alerts', value: '6', color: 'text-error', bg: 'bg-red-100 dark:bg-red-900/30' },
                        { label: 'Table Waiting Alerts', value: '2', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                        { label: 'Order Delay Alerts', value: '3', color: 'text-error', bg: 'bg-red-100 dark:bg-red-900/30' },
                        { label: 'High Discount Alerts', value: '1', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                        { label: 'Refunds Today', value: '1', color: 'text-error', bg: 'bg-red-100 dark:bg-red-900/30' },
                    ].map((stat, i) => (
                        <div key={i} className="alerts-card mb-0 p-5 flex flex-col justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">{stat.label}</span>
                            <div className="flex items-center gap-3 mt-3">
                                <div className={`w-3 h-3 rounded-full ${stat.bg} ${stat.color} flex-shrink-0 relative overflow-hidden`}>
                                    <div className={`absolute inset-0 bg-current opacity-50`}></div>
                                </div>
                                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="alerts-card p-0 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                        <h2 className="alerts-card-title m-0 p-0 border-0">Recent Alerts Feed</h2>
                        <button className="text-sm font-medium text-primary hover:text-primary-hover">View All</button>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {RECENT_ALERTS.map((alert) => (
                            <div key={alert.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                <div className={`p-2 rounded-lg shrink-0 mt-0.5
                ${alert.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : ''}
                ${alert.severity === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' : ''}
                ${alert.severity === 'ai' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' : ''}
              `}>
                                    <alert.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.text}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`alert-badge ${alert.severity}`}>{alert.severity}</span>
                                        <span className="text-xs text-gray-400 font-mono tracking-tight">{alert.time}</span>
                                    </div>
                                </div>
                                <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs py-1.5 px-3">
                                    Investigate
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

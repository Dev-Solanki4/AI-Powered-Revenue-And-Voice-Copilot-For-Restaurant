import { BuildingStorefrontIcon, ArrowsRightLeftIcon, BellAlertIcon, CircleStackIcon } from '@heroicons/react/24/outline';

export default function Overview() {
    const stats = [
        { label: 'Restaurant Info', value: 'Complete', icon: BuildingStorefrontIcon, color: 'var(--color-success)' },
        { label: 'Integrations', value: '2 Connected', icon: ArrowsRightLeftIcon, color: 'var(--color-primary)' },
        { label: 'Notifications', value: 'Active', icon: BellAlertIcon, color: 'var(--color-info)' },
        { label: 'Last Backup', value: 'Today, 2:00 AM', icon: CircleStackIcon, color: 'var(--color-text-secondary)' },
    ];

    return (
        <div className="settings-section">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Settings Overview</h1>
                <p className="settings-section-subtitle">A quick glance at your restaurant configuration status.</p>
            </div>

            <div className="kpi-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="kpi-card">
                        <div className="kpi-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                            <stat.icon style={{ width: 24, height: 24 }} />
                        </div>
                        <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{stat.value}</div>
                        <div className="kpi-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">System Status</h2>
                </div>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                    Your system is running normally. All local configurations are stored safely. Switch to different sections in the sidebar to modify your restaurant profile, billing settings, and integrations.
                </p>
            </div>
        </div>
    );
}

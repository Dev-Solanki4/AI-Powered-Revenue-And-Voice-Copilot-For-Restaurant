import { NavLink } from 'react-router-dom';
import {
    Squares2X2Icon,
    TableCellsIcon,
    ReceiptRefundIcon,
    ExclamationCircleIcon,
    CpuChipIcon,
    CogIcon
} from '@heroicons/react/24/outline';

export default function AlertsSidebar() {
    const sections = [
        { name: 'Overview', path: '/alerts/overview', icon: Squares2X2Icon },
        { name: 'Table Alerts', path: '/alerts/tables', icon: TableCellsIcon },
        { name: 'Order Alerts', path: '/alerts/orders', icon: ReceiptRefundIcon },
        { name: 'Operational Alerts', path: '/alerts/operational', icon: ExclamationCircleIcon },
        { name: 'AI Smart Alerts', path: '/alerts/ai', icon: CpuChipIcon },
        { name: 'Alert Settings', path: '/alerts/settings', icon: CogIcon },
    ];

    return (
        <div className="alerts-sidebar-container">
            <div className="alerts-sidebar-header">
                <h2 className="alerts-sidebar-title">Smart Alerts</h2>
                <p className="alerts-sidebar-subtitle">Operations & intelligence monitor</p>
            </div>

            <div className="alerts-sidebar-nav">
                {sections.map((section) => (
                    <NavLink
                        key={section.path}
                        to={section.path}
                        className={({ isActive }) => `alerts-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <section.icon className="alerts-nav-icon" />
                        {section.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

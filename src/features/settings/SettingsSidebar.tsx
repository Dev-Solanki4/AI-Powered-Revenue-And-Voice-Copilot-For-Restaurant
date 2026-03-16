import { NavLink } from 'react-router-dom';
import {
    BuildingStorefrontIcon,
    DocumentTextIcon,
    ArrowsRightLeftIcon,
    BellAlertIcon,
    UsersIcon,
    ChartBarSquareIcon,
    ShieldCheckIcon,
    SwatchIcon,
    CircleStackIcon
} from '@heroicons/react/24/outline';

export default function SettingsSidebar() {
    const sections = [
        { name: 'Restaurant Profile', path: '/settings/profile', icon: BuildingStorefrontIcon },
        { name: 'Bill Header & Footer', path: '/settings/billing', icon: DocumentTextIcon },
        { name: 'Integrations', path: '/settings/integrations', icon: ArrowsRightLeftIcon },
        { name: 'Notifications', path: '/settings/notifications', icon: BellAlertIcon },
        { name: 'Staff Preferences', path: '/settings/staff', icon: UsersIcon },
        { name: 'Reports', path: '/settings/reports', icon: ChartBarSquareIcon },
        { name: 'Backup & Export', path: '/settings/backup', icon: CircleStackIcon },
        { name: 'Security', path: '/settings/security', icon: ShieldCheckIcon },
        { name: 'Appearance', path: '/settings/appearance', icon: SwatchIcon },
    ];

    return (
        <div className="settings-sidebar-container">
            <div className="settings-sidebar-header">
                <h2 className="settings-sidebar-title">Settings</h2>
                <p className="settings-sidebar-subtitle">Manage restaurant preferences</p>
            </div>

            <div className="settings-sidebar-nav">
                <NavLink
                    to="/settings"
                    end
                    className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}
                >
                    <BuildingStorefrontIcon className="settings-nav-icon" />
                    Overview
                </NavLink>

                {sections.map((section) => (
                    <NavLink
                        key={section.path}
                        to={section.path}
                        className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <section.icon className="settings-nav-icon" />
                        {section.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

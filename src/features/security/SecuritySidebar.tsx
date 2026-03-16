import { NavLink } from 'react-router-dom';
import {
    KeyIcon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    ClockIcon,
    ClipboardDocumentListIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/outline';

export default function SecuritySidebar() {
    const sections = [
        { name: 'Role-Based Access', path: '/security/rbac', icon: UserGroupIcon },
        { name: 'Password Management', path: '/security/password', icon: KeyIcon },
        { name: 'Two-Factor Auth', path: '/security/2fa', icon: DevicePhoneMobileIcon },
        { name: 'Session Timeout', path: '/security/sessions', icon: ClockIcon },
        { name: 'Audit Logs', path: '/security/audit-logs', icon: ClipboardDocumentListIcon },
        { name: 'RLS Policies', path: '/security/rls', icon: ShieldExclamationIcon },
    ];

    return (
        <div className="security-sidebar-container">
            <div className="security-sidebar-header">
                <h2 className="security-sidebar-title">Security & Access</h2>
                <p className="security-sidebar-subtitle">Administer roles and policies</p>
            </div>

            <div className="security-sidebar-nav">
                {sections.map((section) => (
                    <NavLink
                        key={section.path}
                        to={section.path}
                        className={({ isActive }) => `security-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <section.icon className="security-nav-icon" />
                        {section.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

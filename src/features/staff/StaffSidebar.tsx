import { NavLink } from 'react-router-dom';
import {
    UsersIcon,
    UserPlusIcon,
    IdentificationIcon,
    TableCellsIcon,
    ClockIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function StaffSidebar() {
    const sections = [
        { name: 'Staff List', path: '/staff/list', icon: UsersIcon },
        { name: 'Add/Edit Staff', path: '/staff/form', icon: UserPlusIcon },
        { name: 'Role Templates', path: '/staff/roles', icon: IdentificationIcon },
        { name: 'Permissions Matrix', path: '/staff/permissions', icon: TableCellsIcon },
        { name: 'Shift Tracking', path: '/staff/shifts', icon: ClockIcon },
        { name: 'Staff Performance', path: '/staff/performance', icon: ChartBarIcon },
        { name: 'Activity Logs', path: '/staff/logs', icon: ClipboardDocumentListIcon },
    ];

    return (
        <div className="staff-sidebar-container">
            <div className="staff-sidebar-header">
                <h2 className="staff-sidebar-title">Staff Management</h2>
                <p className="staff-sidebar-subtitle">Manage your restaurant team</p>
            </div>

            <div className="staff-sidebar-nav">
                {sections.map((section) => (
                    <NavLink
                        key={section.path}
                        to={section.path}
                        className={({ isActive }) => `staff-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <section.icon className="staff-nav-icon" />
                        {section.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

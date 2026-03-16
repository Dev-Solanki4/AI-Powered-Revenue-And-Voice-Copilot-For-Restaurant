// ==========================================
// PetPooja - Sidebar Component
// ==========================================

import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutGrid, Receipt, BarChart3, Package, ShoppingBag,
    Bot, Users, Shield, Settings, LogOut, ChevronLeft,
    Flame, AlertTriangle, UtensilsCrossed, Rocket
} from 'lucide-react';
import { useAuthStore, useSidebarStore } from '../../lib/store';

const navSections = [
    {
        label: 'Operations',
        items: [
            { path: '/', icon: LayoutGrid, label: 'Tables', badge: null },
            { path: '/billing', icon: Receipt, label: 'Billing', badge: null },
            { path: '/menu', icon: UtensilsCrossed, label: 'Menu Mgmt', badge: null },
            { path: '/orders', icon: ShoppingBag, label: 'Online Orders', badge: '4' },
        ],
    },
    {
        label: 'Intelligence',
        items: [
            { path: '/dashboard', icon: BarChart3, label: 'Dashboard', badge: null },
            { path: '/heatmap', icon: Flame, label: 'Heatmaps', badge: null },
            { path: '/ai', icon: Bot, label: 'AI Assistant', badge: null },
            { path: '/revenue', icon: Rocket, label: 'Revenue Intel', badge: 'New' },
        ],
    },
    {
        label: 'Management',
        items: [
            { path: '/inventory', icon: Package, label: 'Inventory', badge: '3' },
            { path: '/staff', icon: Users, label: 'Staff', badge: null },
            { path: '/alerts', icon: AlertTriangle, label: 'Alerts', badge: '2' },
        ],
    },
    {
        label: 'System',
        items: [
            { path: '/security', icon: Shield, label: 'Security', badge: null },
            { path: '/settings', icon: Settings, label: 'Settings', badge: null },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { collapsed, toggle } = useSidebarStore();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : undefined }}>
            <div className="sidebar-brand" style={{ padding: 'var(--space-4) var(--space-2)' }}>
                {collapsed ? (
                    <img
                        src="src/assets/poss_house-logo-Photoroom.png"
                        alt="PetPooja House Logo"
                        style={{ height: '32px', width: 'auto', cursor: 'pointer', margin: '0 auto', display: 'block', borderRadius: '4px' }}
                        onClick={toggle}
                        title="Expand Sidebar"
                    />
                ) : (
                    <>
                        <img
                            src="src/assets/petpooja-poss-logo-Photoroom.png"
                            alt="PetPooja Full Logo"
                            style={{ height: '50px', width: 'auto', borderRadius: '4px' }}
                        />
                        <button
                            className="btn btn-ghost btn-icon sm"
                            onClick={toggle}
                            style={{ marginLeft: 'auto' }}
                            title="Collapse Sidebar"
                        >
                            <ChevronLeft size={16} style={{ transition: 'transform 0.2s' }} />
                        </button>
                    </>
                )}
            </div>

            <nav className="sidebar-nav">
                {navSections.map((section) => (
                    <div key={section.label}>
                        {!collapsed && <div className="sidebar-section-label">{section.label}</div>}
                        {section.items.map((item) => (
                            <button
                                key={item.path}
                                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className="sidebar-item-icon" size={20} />
                                {!collapsed && (
                                    <>
                                        <span>{item.label}</span>
                                        {item.badge && <span className="sidebar-item-badge">{item.badge}</span>}
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
                <button className="sidebar-item" onClick={handleLogout}>
                    <LogOut size={20} className="sidebar-item-icon" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}

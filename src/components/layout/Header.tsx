// ==========================================
// PetPooja - Header / TopBar Component
// ==========================================

import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useThemeStore, useAuthStore } from '../../lib/store';
import { mockAlerts } from '../../lib/mockData';

export default function Header() {
    const { theme, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();

    // Generate initials safely
    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <header className="top-bar">
            {/* ... keeping the left side and theme toggle the same ... */}
            <div className="top-bar-left">
                <div className="top-bar-search">
                    <Search className="top-bar-search-icon" />
                    <input type="text" placeholder="Search menu, orders, tables..." />
                </div>
            </div>

            <div className="top-bar-right">
                <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
                    <Bell size={18} />
                    {mockAlerts.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-error)',
                            borderRadius: '50%',
                            border: '2px solid var(--color-bg-elevated)',
                        }} />
                    )}
                </button>

                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    <div className="theme-toggle-knob">
                        {theme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                    </div>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginLeft: 'var(--space-2)',
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                    }}>
                        {getInitials(user?.full_name)}
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                            {user?.full_name || 'User'}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                            {user?.role || 'Guest'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

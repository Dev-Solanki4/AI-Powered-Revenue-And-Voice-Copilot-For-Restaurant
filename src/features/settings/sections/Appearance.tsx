import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../lib/store';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function Appearance() {
    const [showToast, setShowToast] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    // Local state for font size preview (simulated)
    const [fontSize, setFontSize] = useState('medium');

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        if (newTheme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if ((isDark && theme !== 'dark') || (!isDark && theme !== 'light')) {
                toggleTheme();
            }
        } else {
            if (theme !== newTheme) {
                toggleTheme();
            }
        }
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Appearance</h1>
                <p className="settings-section-subtitle">Customize the look and feel of the platform.</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Theme Preference</h2>
                    <p className="settings-card-description">Choose how the application looks to you.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => handleThemeChange('light')}
                        className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all ${theme === 'light'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        <SunIcon className="w-8 h-8" />
                        <span className="font-medium text-sm">Light Mode</span>
                    </button>

                    <button
                        onClick={() => handleThemeChange('dark')}
                        className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all ${theme === 'dark'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        <MoonIcon className="w-8 h-8" />
                        <span className="font-medium text-sm">Dark Mode</span>
                    </button>

                    <button
                        onClick={() => handleThemeChange('system')}
                        className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 transition-all opacity-60"
                    >
                        <ComputerDesktopIcon className="w-8 h-8" />
                        <span className="font-medium text-sm">System Sync</span>
                    </button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Brand Color</h2>
                    <p className="settings-card-description">Select the primary accent color for buttons and highlights.</p>
                </div>

                <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-full bg-[#D32F2F] ring-4 ring-[#D32F2F]/20 ring-offset-2 ring-offset-bg"></button>
                    <button className="w-12 h-12 rounded-full bg-[#10B981] hover:scale-110 transition-transform opacity-50 cursor-not-allowed"></button>
                    <button className="w-12 h-12 rounded-full bg-[#3B82F6] hover:scale-110 transition-transform opacity-50 cursor-not-allowed"></button>
                    <button className="w-12 h-12 rounded-full bg-[#8B5CF6] hover:scale-110 transition-transform opacity-50 cursor-not-allowed"></button>
                    <button className="w-12 h-12 rounded-full bg-[#F59E0B] hover:scale-110 transition-transform opacity-50 cursor-not-allowed"></button>
                </div>
                <p className="text-xs text-secondary mt-4">Note: Custom theme colors are currently locked to your brand profile (Red).</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Typography & Density</h2>
                    <p className="settings-card-description">Adjust the text size and layout density for better readability.</p>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group">
                        <label className="settings-label">Font Size</label>
                        <select
                            className="settings-select"
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                        >
                            <option value="small">Small (Compact)</option>
                            <option value="medium">Medium (Default)</option>
                            <option value="large">Large (Relaxed)</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label className="settings-label">List Density</label>
                        <select className="settings-select" defaultValue="comfortable">
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="airy">Airy</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Preview:</strong> Quick Brown Fox Jumps Over The Lazy Dog.</p>
                    <p className={`text-secondary ${fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                        This is how secondary text will appear across the dashboard tables and menus.
                    </p>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Appearance</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Appearance settings saved.
                </div>
            )}
        </div>
    );
}

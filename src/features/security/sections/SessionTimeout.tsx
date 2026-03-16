import { useState } from 'react';
import { ComputerDesktopIcon, DevicePhoneMobileIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function SessionTimeout() {
    const [showToast, setShowToast] = useState(false);
    const [sessions, setSessions] = useState([
        { id: 1, device: 'Chrome on Mac OS X', location: 'Mumbai, India', ip: '115.240.89.2', lastActive: 'Current Session', icon: ComputerDesktopIcon, isCurrent: true },
        { id: 2, device: 'Safari on iPhone', location: 'Pune, India', ip: '192.168.1.45', lastActive: '2 hours ago', icon: DevicePhoneMobileIcon, isCurrent: false },
        { id: 3, device: 'Chrome on Windows 11', location: 'Delhi, India', ip: '14.139.60.1', lastActive: 'Yesterday', icon: ComputerDesktopIcon, isCurrent: false }
    ]);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleLogoutSession = (id: number) => {
        setSessions(sessions.filter(s => s.id !== id));
    };

    return (
        <div className="security-section relative">
            <div className="security-section-header">
                <h1 className="security-section-title">Session Management</h1>
                <p className="security-section-subtitle">Control application timeouts and view active devices.</p>
            </div>

            <div className="security-card">
                <div className="security-card-header">
                    <h2 className="security-card-title">Timeout Configuration</h2>
                    <p className="security-card-description">Set how quickly an inactive device gets logged out automatically.</p>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Auto Logout Delay</p>
                            <p className="text-xs text-secondary mt-1">Force users to re-login after a period of inactivity to prevent unauthorized access.</p>
                        </div>
                        <select className="security-select w-36" defaultValue="30">
                            <option value="5">5 Minutes</option>
                            <option value="10">10 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60">1 Hour</option>
                            <option value="never">Never (Not Recommended)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Allow Multiple Active Sessions</p>
                            <p className="text-xs text-secondary mt-1">If disabled, logging into a new device will sign you out of all others.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button className="btn btn-primary" onClick={handleSave}>Apply Timeout Settings</button>
                </div>
            </div>

            <div className="security-card p-0 overflow-hidden">
                <div className="security-card-header p-6 pb-4 mb-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h2 className="security-card-title">Active Sessions</h2>
                            <p className="security-card-description">Manage devices currently logged into your account.</p>
                        </div>
                        <button className="text-sm font-medium text-primary hover:text-primary-hover">
                            Log out all other devices
                        </button>
                    </div>
                </div>

                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sessions.map((session) => (
                        <li key={session.id} className="p-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${session.isCurrent ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    <session.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                                        {session.isCurrent && (
                                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                This Device
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{session.location} • {session.ip}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xs text-gray-500">{session.lastActive}</span>
                                {!session.isCurrent && (
                                    <button
                                        onClick={() => handleLogoutSession(session.id)}
                                        className="text-gray-400 hover:text-error transition-colors p-1"
                                        title="Revoke session"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                    {sessions.length === 0 && (
                        <li className="p-8 text-center text-sm text-gray-500">
                            No active sessions found.
                        </li>
                    )}
                </ul>
            </div>

            {showToast && (
                <div className="security-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Session parameters saved.
                </div>
            )}
        </div>
    );
}

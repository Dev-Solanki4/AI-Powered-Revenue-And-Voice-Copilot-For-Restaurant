import { useState } from 'react';

export default function StaffPreferences() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const staffRoles = [
        {
            role: 'Admin / Owner',
            description: 'Full access to all alerts and business metrics.',
            permissions: [
                { label: 'Daily sales report', enabled: true },
                { label: 'Refund alerts', enabled: true },
                { label: 'Order cancellation alerts', enabled: true },
                { label: 'Payment failure alerts', enabled: true },
            ]
        },
        {
            role: 'Manager',
            description: 'Store operations and shift management alerts.',
            permissions: [
                { label: 'Daily sales report', enabled: true },
                { label: 'Refund alerts', enabled: true },
                { label: 'Order cancellation alerts', enabled: true },
                { label: 'Payment failure alerts', enabled: false },
            ]
        },
        {
            role: 'Cashier',
            description: 'Front-desk transaction and counter alerts.',
            permissions: [
                { label: 'Daily sales report', enabled: false },
                { label: 'Refund alerts', enabled: true },
                { label: 'Order cancellation alerts', enabled: true },
                { label: 'Payment failure alerts', enabled: true },
            ]
        }
    ];

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Staff Notification Preferences</h1>
                <p className="settings-section-subtitle">Configure which alerts each staff role receives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffRoles.map((role, idx) => (
                    <div key={idx} className="settings-card flex flex-col h-full mb-0">
                        <div className="settings-card-header mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="settings-card-title text-base">{role.role}</h2>
                            <p className="settings-card-description text-xs">{role.description}</p>
                        </div>

                        <div className="flex-1 space-y-3">
                            {role.permissions.map((perm, pIdx) => (
                                <label key={pIdx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        defaultChecked={perm.enabled}
                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                    />
                                    {perm.label}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="settings-save-button mt-8">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Role Preferences</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Staff notification preferences updated.
                </div>
            )}
        </div>
    );
}

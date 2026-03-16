import { useState } from 'react';

export default function NotificationSettings() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const notificationCategories = [
        {
            title: "Operational Alerts",
            description: "Critical notifications regarding real-time restaurant operations.",
            settings: [
                { id: "new_order", label: "New Order Notification", active: true },
                { id: "order_cancel", label: "Order Cancellation", active: true },
                { id: "payment_fail", label: "Payment Failure", active: true },
            ]
        },
        {
            title: "Business Alerts",
            description: "Updates regarding your daily sales and revenue.",
            settings: [
                { id: "daily_sales", label: "Daily Sales Summary", active: true },
                { id: "weekly_sales", label: "Weekly Sales Report", active: true },
                { id: "high_sales", label: "High Sales Volume Alert", active: false },
            ]
        },
        {
            title: "Inventory Alerts",
            description: "Stock tracking and purchase notifications.",
            settings: [
                { id: "low_stock", label: "Low Stock Warning", active: true },
                { id: "out_stock", label: "Out of Stock Alert", active: true },
            ]
        }
    ];

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Notification Settings</h1>
                <p className="settings-section-subtitle">Control the alerts and summaries you receive.</p>
            </div>

            <div className="settings-card mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h3 className="settings-card-title text-blue-800 dark:text-blue-300">Delivery Methods</h3>
                <p className="settings-card-description mt-2 text-blue-600 dark:text-blue-400">
                    Choose how you want to receive these notifications globally. Individual settings below will follow these delivery methods.
                </p>
                <div className="flex gap-6 mt-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                        In-app Notification
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                        Email Notification
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                        SMS Notification
                    </label>
                </div>
            </div>

            {notificationCategories.map((category, idx) => (
                <div key={idx} className="settings-card">
                    <div className="settings-card-header">
                        <h2 className="settings-card-title">{category.title}</h2>
                        <p className="settings-card-description">{category.description}</p>
                    </div>

                    <div className="flex flex-col">
                        {category.settings.map((setting) => (
                            <div key={setting.id} className="toggle-row">
                                <div className="toggle-info">
                                    <div className="toggle-title">{setting.label}</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked={setting.active} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Notification Preferences</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Notification settings saved successfully.
                </div>
            )}
        </div>
    );
}

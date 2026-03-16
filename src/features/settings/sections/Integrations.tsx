import { useState } from 'react';

export default function Integrations() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Online Integrations</h1>
                <p className="settings-section-subtitle">Manage Zomato and Swiggy API connections.</p>
            </div>

            <div className="integration-card">
                <div className="integration-logo zomato">Z</div>
                <div className="integration-body">
                    <div className="integration-header">
                        <div>
                            <h3 className="settings-card-title">Zomato Integration</h3>
                            <p className="text-xs text-secondary mt-1">Status: <span className="text-success font-semibold">Connected</span></p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="settings-form-grid mt-4">
                        <div className="settings-form-group">
                            <label className="settings-label">Zomato Restaurant ID</label>
                            <input type="text" className="settings-input" defaultValue="ZOM-198273" />
                        </div>
                        <div className="settings-form-group">
                            <label className="settings-label">API Key</label>
                            <input type="password" className="settings-input" defaultValue="abcd1234efgh5678" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Auto Accept Orders</div>
                                <div className="toggle-desc">Automatically accept paid Zomato orders.</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Sync Menu</div>
                                <div className="toggle-desc">Real-time update of prices and sold-out items to Zomato.</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="integration-card">
                <div className="integration-logo swiggy">S</div>
                <div className="integration-body">
                    <div className="integration-header">
                        <div>
                            <h3 className="settings-card-title">Swiggy Integration</h3>
                            <p className="text-xs text-secondary mt-1">Status: <span className="text-secondary font-semibold">Not Connected</span></p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="settings-form-grid mt-4 opacity-50 pointer-events-none">
                        <div className="settings-form-group">
                            <label className="settings-label">Swiggy Outlet ID</label>
                            <input type="text" className="settings-input" placeholder="e.g. SWIG-9988" />
                        </div>
                        <div className="settings-form-group">
                            <label className="settings-label">API Key</label>
                            <input type="password" className="settings-input" placeholder="Enter API Key" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 opacity-50 pointer-events-none">
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Auto Accept Orders</div>
                                <div className="toggle-desc">Automatically accept paid Swiggy orders.</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Sync Menu</div>
                                <div className="toggle-desc">Real-time update of prices and sold-out items to Swiggy.</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Integrations</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Integrations saved successfully.
                </div>
            )}
        </div>
    );
}

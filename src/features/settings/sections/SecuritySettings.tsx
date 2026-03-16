import { useState } from 'react';

export default function SecuritySettings() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Security & Access</h1>
                <p className="settings-section-subtitle">Protect your restaurant's data with strong authentication practices.</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Change Password</h2>
                    <p className="settings-card-description">Regularly update your password to prevent unauthorized access.</p>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group full-width">
                        <label className="settings-label">Current Password</label>
                        <input type="password" className="settings-input" placeholder="Enter your current password" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">New Password</label>
                        <input type="password" className="settings-input" placeholder="Create a new password" />
                        <p className="text-[11px] text-secondary mt-1">Minimum 8 characters, include numbers and symbols.</p>
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Confirm New Password</label>
                        <input type="password" className="settings-input" placeholder="Confirm your new password" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="btn btn-secondary" onClick={handleSave}>Update Password</button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Advanced Security</h2>
                    <p className="settings-card-description">Configure extra layers of protection for your account.</p>
                </div>

                <div className="pt-2">
                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title">Enable Two-Factor Authentication (2FA)</div>
                            <div className="toggle-desc">Require a verification code from your mobile device when logging in from an unrecognized browser.</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title">Auto Logout Delay</div>
                            <div className="toggle-desc">Automatically sign out inactive sessions on this terminal to protect sensitive data.</div>
                        </div>
                        <div className="ml-4 shrink-0">
                            <select className="settings-select w-32" defaultValue="30">
                                <option value="5">5 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Security Settings</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Security settings updated successfully.
                </div>
            )}
        </div>
    );
}

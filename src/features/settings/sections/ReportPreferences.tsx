import { useState } from 'react';

export default function ReportPreferences() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Report Preferences</h1>
                <p className="settings-section-subtitle">Manage automated reporting and AI insights delivery.</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Scheduled Reports</h2>
                    <p className="settings-card-description">Automate your daily and weekly business summaries.</p>
                </div>

                <div className="settings-form-grid mb-6">
                    <div className="settings-form-group">
                        <label className="settings-label">Daily Report Time</label>
                        <input type="time" className="settings-input" defaultValue="23:30" />
                        <p className="text-xs text-secondary mt-1">When should the daily summary be generated?</p>
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Email Reports To</label>
                        <input type="email" className="settings-input" defaultValue="management@spicesymphony.com" />
                        <p className="text-xs text-secondary mt-1">Comma separate multiple emails.</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title">Enable daily report email</div>
                            <div className="toggle-desc">Receive a summary of today's sales, discounts, and voids.</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title">Enable weekly summary</div>
                            <div className="toggle-desc">A comparative analysis of the week sent every Monday morning.</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title flex items-center gap-2">
                                Enable AI Sales Insights
                                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">Beta</span>
                            </div>
                            <div className="toggle-desc">Attach Groq AI generated insights and predictions to your reports.</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Report Settings</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reporting preferences saved.
                </div>
            )}
        </div>
    );
}

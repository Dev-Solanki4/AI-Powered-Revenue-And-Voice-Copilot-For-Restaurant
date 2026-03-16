import { useState } from 'react';

export default function StaffForm() {
    const [showToast, setShowToast] = useState(false);
    const [is2faEnabled, setIs2faEnabled] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <h1 className="staff-section-title">Add/Edit Staff Member</h1>
                <p className="staff-section-subtitle">Create a new employee profile or update an existing one.</p>
            </div>

            <div className="staff-card">
                <div className="staff-card-header">
                    <h2 className="staff-card-title">Employee Profile</h2>
                </div>

                <div className="staff-form-grid">
                    <div className="staff-form-group">
                        <label className="staff-label">Full Name</label>
                        <input type="text" className="staff-input" placeholder="e.g. John Doe" defaultValue="Rahul Sharma" />
                    </div>

                    <div className="staff-form-group">
                        <label className="staff-label">Email Address</label>
                        <input type="email" className="staff-input" placeholder="john@example.com" defaultValue="rahul.s@spicesymphony.com" />
                    </div>

                    <div className="staff-form-group">
                        <label className="staff-label">Phone Number</label>
                        <input type="tel" className="staff-input" placeholder="+91 90000 00000" defaultValue="+91 98765 43210" />
                    </div>

                    <div className="staff-form-group full-width mt-2">
                        <label className="staff-label">Profile Picture (Optional)</label>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 overflow-hidden">
                                <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <button className="btn btn-secondary py-1.5 px-3 text-sm">Upload Photo</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="staff-card">
                <div className="staff-card-header">
                    <h2 className="staff-card-title">Role & Access</h2>
                </div>

                <div className="staff-form-grid">
                    <div className="staff-form-group">
                        <label className="staff-label">Assigned Role</label>
                        <select className="staff-select" defaultValue="Admin">
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Waiter">Waiter</option>
                        </select>
                    </div>

                    <div className="staff-form-group">
                        <label className="staff-label">Primary Branch</label>
                        <select className="staff-select" defaultValue="Main Branch">
                            <option value="Main Branch">Main Branch - Mumbai</option>
                            <option value="Branch 1">Branch 1 - Andheri</option>
                            <option value="Branch 2">Branch 2 - Bandra</option>
                            <option value="All">All Branches (Global)</option>
                        </select>
                    </div>

                    <div className="staff-form-group">
                        <label className="staff-label">Account Status</label>
                        <select className="staff-select" defaultValue="Active">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive (Suspended)</option>
                        </select>
                    </div>

                    <div className="staff-form-group">
                        <label className="staff-label">Password Setup</label>
                        <input type="text" className="staff-input text-gray-500 bg-gray-50 dark:bg-gray-800" value="••••••••" readOnly />
                        <span className="text-xs text-secondary mt-1 cursor-pointer hover:text-primary">Send password reset email</span>
                    </div>

                    <div className="staff-form-group full-width mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between">
                        <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Force Two-Factor Authentication (2FA)</p>
                            <p className="text-xs text-secondary mt-1">Require this user to configure 2FA on their next login.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={is2faEnabled} onChange={(e) => setIs2faEnabled(e.target.checked)} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button className="btn btn-secondary px-6">Cancel</button>
                <button className="btn btn-primary px-8" onClick={handleSave}>Save Staff Member</button>
            </div>

            {showToast && (
                <div className="staff-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Staff member profile built successfully.
                </div>
            )}
        </div>
    );
}

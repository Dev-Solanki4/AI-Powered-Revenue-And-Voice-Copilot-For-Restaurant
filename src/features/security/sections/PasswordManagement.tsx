import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function PasswordManagement() {
    const [showToast, setShowToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Policy validation logic mock
    const hasMinLength = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="security-section relative">
            <div className="security-section-header">
                <h1 className="security-section-title">Password Management</h1>
                <p className="security-section-subtitle">Update your master admin password to secure your establishment.</p>
            </div>

            <div className="security-card max-w-2xl">
                <div className="security-card-header">
                    <h2 className="security-card-title">Change Password</h2>
                </div>

                <div className="security-form-group full-width mb-5">
                    <label className="security-label">Current Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="security-input pr-10"
                            placeholder="Enter current password"
                        />
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="security-form-group full-width mb-5">
                    <label className="security-label">New Password</label>
                    <input
                        type="password"
                        className="security-input"
                        placeholder="Create a new secure password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="security-form-group full-width mb-6">
                    <label className="security-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="security-input"
                        placeholder="Re-type your new password"
                    />
                </div>

                {/* Password Policy Indication */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                    <p className="text-sm font-semibold mb-3">Password Policy Requirements:</p>
                    <ul className="space-y-2">
                        <li className={`flex items-center gap-2 text-sm ${hasMinLength ? 'text-success' : 'text-gray-500'}`}>
                            {hasMinLength ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4 opacity-50" />}
                            Minimum 8 characters long
                        </li>
                        <li className={`flex items-center gap-2 text-sm ${hasNumber ? 'text-success' : 'text-gray-500'}`}>
                            {hasNumber ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4 opacity-50" />}
                            Contains at least one number
                        </li>
                        <li className={`flex items-center gap-2 text-sm ${hasSpecial ? 'text-success' : 'text-gray-500'}`}>
                            {hasSpecial ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4 opacity-50" />}
                            Contains at least one special character (!@#$)
                        </li>
                    </ul>
                </div>

                <div className="flex justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!hasMinLength || !hasNumber || !hasSpecial}
                    >
                        Save Password Changes
                    </button>
                </div>
            </div>

            {showToast && (
                <div className="security-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Password updated successfully.
                </div>
            )}
        </div>
    );
}

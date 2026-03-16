import { useState } from 'react';
import { ShieldCheckIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function TwoFactorAuth() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [method, setMethod] = useState('app');
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="security-section relative">
            <div className="security-section-header">
                <h1 className="security-section-title">Two-Factor Authentication</h1>
                <p className="security-section-subtitle">Add an extra layer of security to your POS access.</p>
            </div>

            <div className="security-card max-w-2xl">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                            2FA Status
                            {isEnabled ? (
                                <span className="status-indicator enabled"><div className="status-dot" /> Enabled</span>
                            ) : (
                                <span className="status-indicator disabled"><div className="status-dot" /> Disabled</span>
                            )}
                        </h2>
                        <p className="text-sm text-gray-500">Protect your account even if someone steals your password.</p>
                    </div>
                    <label className="toggle-switch scale-125 origin-right">
                        <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className={`transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Select Verification Method</h3>

                    <div className="space-y-3">
                        <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${method === 'app' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <div className="mt-1">
                                <input type="radio" name="2fa_method" value="app" checked={method === 'app'} onChange={(e) => setMethod(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    <ShieldCheckIcon className="w-5 h-5 text-primary" />
                                    Authenticator App
                                </div>
                                <p className="text-sm text-gray-500">Get codes from Google Authenticator, Authy, or 1Password. Highly Recommended.</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${method === 'sms' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <div className="mt-1">
                                <input type="radio" name="2fa_method" value="sms" checked={method === 'sms'} onChange={(e) => setMethod(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500" />
                                    SMS OTP
                                </div>
                                <p className="text-sm text-gray-500">Receive a one-time passcode on your registered phone number (+91 ******210).</p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${method === 'email' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <div className="mt-1">
                                <input type="radio" name="2fa_method" value="email" checked={method === 'email'} onChange={(e) => setMethod(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                                    Email OTP
                                </div>
                                <p className="text-sm text-gray-500">Get verification codes sent to manager@spicesymphony.com.</p>
                            </div>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button className="btn btn-primary" onClick={handleSave}>Apply 2FA Settings</button>
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="security-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Two-Factor Authentication settings updated.
                </div>
            )}
        </div>
    );
}

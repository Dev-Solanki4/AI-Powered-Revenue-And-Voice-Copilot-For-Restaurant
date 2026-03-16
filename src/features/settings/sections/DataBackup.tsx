import { useState } from 'react';
import { ArrowDownTrayIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function DataBackup() {
    const [showToast, setShowToast] = useState(false);
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleDownload = (type: string) => {
        setDownloading(type);
        setTimeout(() => {
            setDownloading(null);
        }, 1500);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Data Backup & Export</h1>
                <p className="settings-section-subtitle">Securely download your restaurant's data and manage automatic backups.</p>
            </div>

            <div className="settings-card mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="settings-card-title m-0">Automatic Cloud Backup</h2>
                    <span className="badge badge-active">Protected</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                    Your data is currently backed up to the cloud securely. The last successful backup was completed <strong>Today at 2:00 AM</strong>.
                </p>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div className="toggle-title">Enable Automatic Daily Backup</div>
                            <div className="toggle-desc">Automatically upload a snapshot of your database every night at 2:00 AM.</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="btn btn-primary" onClick={handleSave}>Update Backup Settings</button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header mb-6">
                    <h2 className="settings-card-title">Manual Data Export</h2>
                    <p className="settings-card-description">Download your historical data for accounting or tax purposes.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <button
                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        onClick={() => handleDownload('csv')}
                        disabled={downloading !== null}
                    >
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                            <DocumentChartBarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Export Sales Data (CSV)</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">Complete spreadsheet of all orders, items sold, and applied taxes.</p>
                        </div>
                        <ArrowDownTrayIcon className={`w-5 h-5 text-gray-400 ${downloading === 'csv' ? 'animate-bounce text-primary' : ''}`} />
                    </button>

                    <button
                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        onClick={() => handleDownload('pdf')}
                        disabled={downloading !== null}
                    >
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                            <DocumentChartBarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Export Final Reports (PDF)</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">Formatted PDF reports ready for your accountant or tax filing.</p>
                        </div>
                        <ArrowDownTrayIcon className={`w-5 h-5 text-gray-400 ${downloading === 'pdf' ? 'animate-bounce text-primary' : ''}`} />
                    </button>
                </div>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Backup settings updated.
                </div>
            )}
        </div>
    );
}

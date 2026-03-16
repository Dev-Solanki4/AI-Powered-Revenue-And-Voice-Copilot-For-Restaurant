import { useState } from 'react';

export default function AlertSettings() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="alerts-section">
            <div className="alerts-content-container">
                <div className="alerts-section-header">
                    <div>
                        <h1 className="alerts-section-title">Alert Configuration</h1>
                        <p className="alerts-section-subtitle">Fine-tune system threshold triggers and manage delivery channels.</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Configurations
                    </button>
                </div>

                <div className="alerts-card">
                    <h2 className="alerts-card-title">Dining & Table Thresholds</h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Table Waiting (No Waiter Assigned)</p>
                                <p className="text-xs text-gray-500 mt-1">Trigger alert when table is seated but not attended</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger after</span>
                                <select className="alerts-select w-24">
                                    <option>3 min</option>
                                    <option selected>5 min</option>
                                    <option>10 min</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bill Request Pending</p>
                                <p className="text-xs text-gray-500 mt-1">Trigger alert when customer requests bill via QR/Table</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger after</span>
                                <select className="alerts-select w-24">
                                    <option>1 min</option>
                                    <option selected>3 min</option>
                                    <option>5 min</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order Not Taken (Menu Browsing)</p>
                                <p className="text-xs text-gray-500 mt-1">Trigger alert if KOT is not generated post seating</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger after</span>
                                <select className="alerts-select w-24">
                                    <option>5 min</option>
                                    <option selected>7 min</option>
                                    <option>15 min</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="alerts-card">
                    <h2 className="alerts-card-title">Order Lifecycle Thresholds</h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Kitchen Preparation Delay</p>
                                <p className="text-xs text-gray-500 mt-1">Alert when KOT remains pending in Kitchen Display Screen</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger after</span>
                                <select className="alerts-select w-24">
                                    <option>10 min</option>
                                    <option selected>15 min</option>
                                    <option>25 min</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment Link Pending</p>
                                <p className="text-xs text-gray-500 mt-1">Alert when online payment intent remains unfulfilled</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger after</span>
                                <select className="alerts-select w-24">
                                    <option>2 min</option>
                                    <option selected>5 min</option>
                                    <option>15 min</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Significant Order Modifications</p>
                                <p className="text-xs text-gray-500 mt-1">Alert managers on post-dispatch KOT cancellations/edits</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="alerts-card">
                    <h2 className="alerts-card-title">Operational & Financial Triggers</h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Low Inventory Stock Warning</p>
                                <p className="text-xs text-gray-500 mt-1">Notify manager when material stock drops below re-order logic rules</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">High Discount Application</p>
                                <p className="text-xs text-gray-500 mt-1">Alert when discount application exceeds permissible standard margin</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trigger &gt;</span>
                                <select className="alerts-select w-24">
                                    <option>10%</option>
                                    <option selected>20%</option>
                                    <option>50%</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Refund Issuance Trigger</p>
                                <p className="text-xs text-gray-500 mt-1">Instantly notify management of any cash or card reversal event</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="alerts-card">
                    <h2 className="alerts-card-title">Notification Delivery Routing</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" defaultChecked />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">In-App Notification</p>
                                <p className="text-xs text-gray-500 mt-0.5">Push to POS & Admin screens</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" defaultChecked />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Email Alerts</p>
                                <p className="text-xs text-gray-500 mt-0.5">Send strictly to manager email</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">SMS / WhatsApp</p>
                                <p className="text-xs text-gray-500 mt-0.5">Require premium integrator</p>
                            </div>
                        </label>
                    </div>
                </div>

                {showToast && (
                    <div className="alerts-toast">
                        <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Alert thresholds saved strictly.
                    </div>
                )}
            </div>
        </div>
    );
}

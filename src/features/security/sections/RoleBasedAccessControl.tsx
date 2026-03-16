import { useState } from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function RoleBasedAccessControl() {
    const [showToast, setShowToast] = useState(false);

    const roles = ['Admin', 'Manager', 'Cashier', 'Waiter'];
    const permissions = [
        { id: 'view_reports', name: 'View Reports' },
        { id: 'cancel_orders', name: 'Cancel Orders' },
        { id: 'apply_discounts', name: 'Apply Discounts' },
        { id: 'manage_menu', name: 'Manage Menu' },
        { id: 'refunds', name: 'Process Refunds' }
    ];

    // Mock initial permission state
    const initialMatrix = {
        Admin: { view_reports: true, cancel_orders: true, apply_discounts: true, manage_menu: true, refunds: true },
        Manager: { view_reports: true, cancel_orders: true, apply_discounts: true, manage_menu: false, refunds: true },
        Cashier: { view_reports: false, cancel_orders: true, apply_discounts: false, manage_menu: false, refunds: false },
        Waiter: { view_reports: false, cancel_orders: false, apply_discounts: false, manage_menu: false, refunds: false }
    };

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="security-section relative">
            <div className="security-section-header">
                <div>
                    <h1 className="security-section-title">Role-Based Access Control</h1>
                    <p className="security-section-subtitle">Manage what actions staff members can perform across the POS.</p>
                </div>
                <button className="btn btn-primary">
                    <PlusIcon className="w-5 h-5" />
                    Add Role
                </button>
            </div>

            <div className="security-card p-0 overflow-hidden">
                <div className="security-card-header p-6 pb-4 mb-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                    <h2 className="security-card-title">Permission Matrix</h2>
                    <p className="security-card-description">Toggle specific privileges per role.</p>
                </div>

                <div className="matrix-table-container border-0 rounded-none border-t border-gray-200 dark:border-gray-700">
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th>Permissions</th>
                                {roles.map(role => (
                                    <th key={role} className="text-center w-32">
                                        <div className="flex items-center justify-center gap-2">
                                            {role}
                                            <button className="text-gray-400 hover:text-primary transition-colors">
                                                <PencilIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm) => (
                                <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="font-medium text-gray-900 dark:text-gray-200">{perm.name}</td>
                                    {roles.map((role) => {
                                        const isChecked = initialMatrix[role as keyof typeof initialMatrix][perm.id as keyof (typeof initialMatrix)['Admin']];
                                        return (
                                            <td key={`${role}-${perm.id}`} className="text-center">
                                                <input
                                                    type="checkbox"
                                                    className="matrix-checkbox"
                                                    defaultChecked={isChecked}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="security-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Permissions</button>
            </div>

            {showToast && (
                <div className="security-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    RBAC permissions successfully updated.
                </div>
            )}
        </div>
    );
}

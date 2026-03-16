import React, { useState } from 'react';
import { ShieldCheckIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const ROLES = ['Admin', 'Manager', 'Cashier', 'Waiter'];

const PERMISSION_CATEGORIES = [
    {
        category: 'Billing & Operations',
        permissions: [
            { id: 'bill_cancel', name: 'Cancel Items & Bills', desc: 'Can void active items sent to kitchen' },
            { id: 'apply_disc', name: 'Apply Discounts', desc: 'Can apply custom % logic to checks' },
            { id: 'issue_ref', name: 'Process Refunds', desc: 'Authorized to refund payment gateways' },
        ]
    },
    {
        category: 'Management',
        permissions: [
            { id: 'edit_menu', name: 'Edit Menu Pricing', desc: 'Can modify items, taxes, and stock' },
            { id: 'view_rep', name: 'View Financial Reports', desc: 'Can see total sales dashboards' },
            { id: 'manage_inv', name: 'Manage Inventory', desc: 'Update raw material quantities' },
        ]
    },
    {
        category: 'System Configuration',
        permissions: [
            { id: 'sys_settings', name: 'Global Settings', desc: 'Edit tax, receipt prints, and DB' },
            { id: 'manage_staff', name: 'Manage Staff', desc: 'Add/Remove employees and shifts' },
        ]
    }
];

// Dummy mapping
const initialMatrix: Record<string, Record<string, boolean>> = {
    Admin: { bill_cancel: true, apply_disc: true, issue_ref: true, edit_menu: true, view_rep: true, manage_inv: true, sys_settings: true, manage_staff: true },
    Manager: { bill_cancel: true, apply_disc: true, issue_ref: true, edit_menu: true, view_rep: true, manage_inv: true, sys_settings: false, manage_staff: true },
    Cashier: { bill_cancel: false, apply_disc: true, issue_ref: false, edit_menu: false, view_rep: false, manage_inv: false, sys_settings: false, manage_staff: false },
    Waiter: { bill_cancel: false, apply_disc: false, issue_ref: false, edit_menu: false, view_rep: false, manage_inv: false, sys_settings: false, manage_staff: false },
};

export default function PermissionsMatrix() {
    const [showToast, setShowToast] = useState(false);
    const [matrix, setMatrix] = useState(initialMatrix);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const togglePermission = (role: string, permId: string) => {
        setMatrix(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [permId]: !prev[role][permId]
            }
        }));
    };

    return (
        <div className="staff-section relative">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Matrix Editor</h1>
                    <p className="staff-section-subtitle">Fine-tune system capabilities across all defined roles.</p>
                </div>
                <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                    Filter Modules
                </button>
            </div>

            <div className="staff-card p-0 overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-md">
                                <th className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-1/3">
                                    Privilege Name
                                </th>
                                {ROLES.map(role => (
                                    <th key={role} className="px-3 py-4 text-center">
                                        <span className="inline-block px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                                            {role}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {PERMISSION_CATEGORIES.map((categoryGroup, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <td colSpan={5} className="px-6 py-2 text-xs font-semibold text-primary uppercase tracking-widest border-y border-gray-200 dark:border-gray-700">
                                            {categoryGroup.category}
                                        </td>
                                    </tr>

                                    {categoryGroup.permissions.map(perm => (
                                        <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{perm.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{perm.desc}</div>
                                            </td>
                                            {ROLES.map(role => {
                                                const isGranted = matrix[role][perm.id];
                                                // Hardcode Admin to checked/disabled for UX realism
                                                const isAdmin = role === 'Admin';

                                                return (
                                                    <td key={`${role}-${perm.id}`} className="px-3 py-3 text-center border-l border-gray-50 dark:border-gray-800/50">
                                                        {isAdmin ? (
                                                            <div className="flex justify-center">
                                                                <ShieldCheckIcon className="w-5 h-5 text-emerald-500 opacity-60" />
                                                            </div>
                                                        ) : (
                                                            <label className="inline-flex cursor-pointer items-center justify-center relative">
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer sr-only"
                                                                    checked={isGranted}
                                                                    onChange={() => togglePermission(role, perm.id)}
                                                                />
                                                                <div className="w-10 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
                                                            </label>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end mt-6 pb-12">
                <button className="btn btn-primary px-8" onClick={handleSave}>Apply Permission Matrix</button>
            </div>

            {showToast && (
                <div className="staff-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Matrix mappings successfully updated system-wide.
                </div>
            )}
        </div>
    );
}

import { PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

const DUMMY_ROLES = [
    { id: '1', name: 'Admin', description: 'Full access to all modules including security, billing, and settings.', users: 2, badge: 'System' },
    { id: '2', name: 'Manager', description: 'Manage staff schedules, edit menu items, and view high-level reports.', users: 4, badge: 'Management' },
    { id: '3', name: 'Cashier', description: 'Handle front desk billing, apply operational discounts & process refunds.', users: 8, badge: 'Operations' },
    { id: '4', name: 'Waiter', description: 'Manage assigned floor tables and punch active KOT orders to the kitchen.', users: 15, badge: 'Service' },
];

export default function RoleTemplates() {
    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Role Templates</h1>
                    <p className="staff-section-subtitle">Define structural roles and assign them to specific staff members.</p>
                </div>
                <button className="btn btn-primary text-sm flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    Create Custom Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DUMMY_ROLES.map((role) => (
                    <div key={role.id} className="staff-card mb-0 flex flex-col h-full hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <TagIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{role.name}</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 mt-1">
                                        {role.badge} Tier
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                {role.name !== 'Admin' && (
                                    <button className="p-1.5 text-gray-400 hover:text-error rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow leading-relaxed">
                            {role.description}
                        </p>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                            <div className="flex -space-x-2 overflow-hidden">
                                {[...Array(Math.min(role.users, 4))].map((_, i) => (
                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-300 dark:bg-gray-700"></div>
                                ))}
                                {role.users > 4 && (
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-500">
                                        +{role.users - 4}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-primary">{role.users} Staff Assigned</span>
                        </div>
                    </div>
                ))}

                {/* Create New Role Ghost Card */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-500 hover:text-primary min-h-[220px]">
                    <TagIcon className="w-5 h-5 mb-3" />
                    <h3 className="font-semibold mb-1">Create Custom Template</h3>
                    <p className="text-xs max-w-xs">Need a specialized role like 'Kitchen Expo' or 'Shift Supervisor'? Build a custom access tier.</p>
                </div>
            </div>
        </div>
    );
}

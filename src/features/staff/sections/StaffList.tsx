import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    TrashIcon,
    KeyIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DUMMY_STAFF = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul.s@spicesymphony.com', phone: '+91 98765 43210', role: 'Admin', branch: 'Main Branch', status: 'Active' },
    { id: '2', name: 'Priya Patel', email: 'priya.p@spicesymphony.com', phone: '+91 98765 43211', role: 'Manager', branch: 'Main Branch', status: 'Active' },
    { id: '3', name: 'Ankit Mehra', email: 'ankit.m@spicesymphony.com', phone: '+91 98765 43212', role: 'Cashier', branch: 'Branch 2', status: 'Active' },
    { id: '4', name: 'Riya Verma', email: 'riya.v@spicesymphony.com', phone: '+91 98765 43213', role: 'Waiter', branch: 'Main Branch', status: 'Inactive' },
    { id: '5', name: 'Karan Singh', email: 'karan.s@spicesymphony.com', phone: '+91 98765 43214', role: 'Cashier', branch: 'Branch 1', status: 'Active' },
];

export default function StaffList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (id: string) => {
        if (activeDropdown === id) setActiveDropdown(null);
        else setActiveDropdown(id);
    };

    const filteredStaff = DUMMY_STAFF.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Staff Members</h1>
                    <p className="staff-section-subtitle">Manage your entire restaurant team.</p>
                </div>
                <button className="btn btn-primary">Add New Staff</button>
            </div>

            <div className="staff-card p-0 overflow-visible">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="staff-input pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="w-3-5 h-3-5 absolute left-3 top-1-2 -translate-y-1-2 text-gray-400" />
                    </div>
                    <button className="btn btn-ghost border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ml-auto">
                        <FunnelIcon className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto relative">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Branch</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 relative">
                            {filteredStaff.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{staff.name}</div>
                                                <div className="text-xs text-gray-500">{staff.email} • {staff.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">{staff.role}</div>
                                        <div className="text-xs text-gray-500">{staff.branch}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`status-indicator ${staff.status === 'Active' ? 'active' : 'inactive'}`}>
                                            <div className="status-dot"></div>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left">
                                            <button
                                                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => toggleDropdown(staff.id)}
                                            >
                                                <EllipsisVerticalIcon className="w-4 h-4" />
                                            </button>

                                            {activeDropdown === staff.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 py-1">
                                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <PencilSquareIcon className="w-4 h-4" /> Edit Profile
                                                        </button>
                                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <KeyIcon className="w-4 h-4" /> Reset Password
                                                        </button>
                                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <ShieldCheckIcon className="w-4 h-4" /> Configure 2FA
                                                        </button>
                                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-900/10">
                                                            <TrashIcon className="w-4 h-4" /> Delete Staff
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStaff.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No staff members found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/30">
                    <div>Showing <span className="font-medium text-gray-900 dark:text-gray-100">1</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{filteredStaff.length}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_STAFF.length}</span> employees</div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

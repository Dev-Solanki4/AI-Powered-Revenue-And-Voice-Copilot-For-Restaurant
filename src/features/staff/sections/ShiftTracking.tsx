import { useState } from 'react';
import {
    PlusIcon,
    CalendarDaysIcon,
    ClockIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const DUMMY_SHIFTS = [
    { id: '1', name: 'Priya Patel', role: 'Manager', branch: 'Main Branch', start: '09:00 AM', end: '06:00 PM', status: 'Active' },
    { id: '2', name: 'Ankit Mehra', role: 'Cashier', branch: 'Branch 2', start: '10:00 AM', end: '07:00 PM', status: 'Active' },
    { id: '3', name: 'Riya Verma', role: 'Waiter', branch: 'Main Branch', start: '12:00 PM', end: '09:00 PM', status: 'Scheduled' },
    { id: '4', name: 'Karan Singh', role: 'Cashier', branch: 'Branch 1', start: '08:00 AM', end: '04:00 PM', status: 'Completed' },
    { id: '5', name: 'John Doe', role: 'Kitchen', branch: 'Main Branch', start: '06:00 AM', end: '02:00 PM', status: 'Inactive' },
];

export default function ShiftTracking() {
    const [activeDate, setActiveDate] = useState('Today, 10 Mar 2026');

    return (
        <div className="staff-section">
            <div className="staff-section-header">
                <div>
                    <h1 className="staff-section-title">Shift Tracking & Rosters</h1>
                    <p className="staff-section-subtitle">Manage employee working hours and daily schedules across branches.</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Assign Shift
                </button>
            </div>

            <div className="staff-card p-0 overflow-visible">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                            <CalendarDaysIcon className="w-4 h-4 text-primary" />
                            {activeDate}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <select className="staff-select w-40 text-sm py-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <option>All Branches</option>
                            <option>Main Branch</option>
                            <option>Branch 1</option>
                            <option>Branch 2</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift Timing</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {DUMMY_SHIFTS.map((shift) => (
                                <tr key={shift.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{shift.name}</div>
                                        <div className="text-xs text-gray-500">{shift.role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {shift.branch}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                                            <ClockIcon className="w-4 h-4 text-primary opacity-70" />
                                            {shift.start} <span className="text-gray-400 mx-1">→</span> {shift.end}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        9h 00m
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {shift.status === 'Active' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Active Now</span>}
                                        {shift.status === 'Scheduled' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Scheduled</span>}
                                        {shift.status === 'Completed' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Completed</span>}
                                        {shift.status === 'Inactive' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Did Not Show</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-error rounded-md hover:bg-red-50 dark:hover:bg-red-900/10">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// PetPooja - Utility Functions
// ==========================================

import { TableStatus } from '../types';

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
}

export function getMinutesElapsed(startTime: string): number {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 60000);
}

export function getStatusColor(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
        available: 'var(--color-available)',
        active: 'var(--color-active)',
        preparing: 'var(--color-preparing)',
        served: 'var(--color-served)',
        payment_delayed: 'var(--color-payment-delayed)',
        reserved: 'var(--color-reserved)',
    };
    return map[status];
}

export function getStatusLabel(status: TableStatus): string {
    const map: Record<TableStatus, string> = {
        available: 'Available',
        active: 'Active',
        preparing: 'Preparing',
        served: 'Served',
        payment_delayed: 'Payment Delayed',
        reserved: 'Reserved',
    };
    return map[status];
}

export function getProgressPercent(status: TableStatus, minutesElapsed: number): number {
    if (status === 'available') return 0;
    if (status === 'payment_delayed') return 100;
    const max = status === 'preparing' ? 20 : 60;
    return Math.min((minutesElapsed / max) * 100, 100);
}

export function validateGSTIN(gstin: string): boolean {
    const regex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    return regex.test(gstin);
}

export function validatePhone(phone: string): boolean {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
}

export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function generateInvoiceNumber(): string {
    const now = new Date();
    const prefix = 'PP';
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    return `${prefix}-${date}-${seq}`;
}

export function generateOrderNumber(): string {
    return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

export function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function getHeatmapColor(value: number): string {
    if (value < 20) return 'rgba(16, 185, 129, 0.15)';
    if (value < 40) return 'rgba(16, 185, 129, 0.3)';
    if (value < 60) return 'rgba(245, 158, 11, 0.4)';
    if (value < 80) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(239, 68, 68, 0.7)';
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} ${formatTime(date)}`;
}

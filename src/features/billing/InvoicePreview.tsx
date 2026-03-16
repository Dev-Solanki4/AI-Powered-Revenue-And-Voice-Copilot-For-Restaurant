// ==========================================
// PetPooja - Invoice Preview Component
// ==========================================

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OrderItem, Restaurant } from '../../types';
import { formatCurrency, generateInvoiceNumber, formatDate, formatTime } from '../../lib/utils';

interface InvoicePreviewProps {
    restaurant: Restaurant;
    orderItems: OrderItem[];
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'flat' | null;
    discountValue: number;
    cgst: number;
    sgst: number;
    total: number;
    paymentMethod: string | null;
    tableNumber?: number;
    onClose: () => void;
    onConfirm: () => void;
}

export default function InvoicePreview({
    restaurant, orderItems, subtotal, discount, discountType, discountValue,
    cgst, sgst, total, paymentMethod, tableNumber, onClose, onConfirm
}: InvoicePreviewProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const invoiceNumber = generateInvoiceNumber();
    const now = new Date();

    const handlePrint = () => {
        const printContent = invoiceRef.current?.innerHTML;
        if (!printContent) return;
        const w = window.open('', '', 'width=400,height=600');
        if (!w) return;
        w.document.write(`
      <html><head><title>Invoice ${invoiceNumber}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; max-width: 320px; margin: 0 auto; color: #111; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .border-dashed { border-top: 1px dashed #999; margin: 8px 0; padding-top: 8px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 2px 0; font-size: 11px; }
        h2 { margin: 0; font-size: 16px; letter-spacing: 1px; }
        .detail { font-size: 11px; color: #555; }
        .total { font-size: 14px; font-weight: bold; border-top: 2px solid #111; padding-top: 4px; margin-top: 4px; }
      </style>
      </head><body>${printContent}</body></html>
    `);
        w.document.close();
        w.print();
        w.close();
    };

    const handleDownloadPDF = async () => {
        try {
            const { default: jsPDF } = await import('jspdf');
            const { default: html2canvas } = await import('html2canvas');
            if (!invoiceRef.current) return;
            const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ unit: 'mm', format: [80, canvas.height * 80 / canvas.width] });
            pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
            pdf.save(`Invoice_${invoiceNumber}.pdf`);
        } catch (e) {
            console.error('PDF generation failed:', e);
        }
    };

    const upiString = `upi://pay?pa=${restaurant.email}&pn=${encodeURIComponent(restaurant.name)}&am=${total.toFixed(2)}&cu=INR&tn=Invoice ${invoiceNumber}`;

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal modal-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 className="modal-title">Bill Preview</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                            <Printer size={14} /> Print
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleDownloadPDF}>
                            <Download size={14} /> PDF
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', background: 'var(--color-bg)' }}>
                    <div ref={invoiceRef} className="invoice">
                        {/* Header */}
                        <div className="invoice-header">
                            <div className="invoice-restaurant-name">{restaurant.name.toUpperCase()}</div>
                            <div className="invoice-detail">{restaurant.address}</div>
                            <div className="invoice-detail">Tel: {restaurant.phone}</div>
                            <div className="invoice-detail">GSTIN: {restaurant.gstin}</div>
                        </div>

                        {/* Invoice Info */}
                        <div style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Invoice: {invoiceNumber}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Date: {formatDate(now)}</span>
                                <span>Time: {formatTime(now)}</span>
                            </div>
                            {tableNumber && (
                                <div>Table: {tableNumber}</div>
                            )}
                            <div>Payment: {paymentMethod?.toUpperCase() || ''}</div>
                        </div>

                        <div style={{ borderTop: '1px dashed #999', margin: '8px 0' }} />

                        {/* Items */}
                        <table className="invoice-items">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="text-right">Qty</th>
                                    <th className="text-right">Rate</th>
                                    <th className="text-right">Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.menu_item.name}
                                            {item.modifiers.length > 0 && (
                                                <div style={{ fontSize: '9px', color: '#888' }}>
                                                    + {item.modifiers.map((m) => m.name).join(', ')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">{item.menu_item.price}</td>
                                        <td className="text-right">{item.subtotal.toFixed(0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="invoice-total-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                                    <span>Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>CGST (2.5%)</span>
                                <span>{formatCurrency(cgst)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>SGST (2.5%)</span>
                                <span>{formatCurrency(sgst)}</span>
                            </div>
                            <div className="invoice-total" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>TOTAL</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* UPI QR */}
                        {paymentMethod === 'upi' && (
                            <div className="invoice-qr">
                                <QRCodeSVG value={upiString} size={100} />
                            </div>
                        )}

                        {/* Footer */}
                        <div className="invoice-footer">
                            <div style={{ marginBottom: '4px' }}>★ Thank you for dining with us! ★</div>
                            <div>Visit again 🙏</div>
                            <div style={{ marginTop: '8px', fontSize: '9px', color: '#999' }}>
                                Powered by PetPooja POS
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-success" onClick={onConfirm}>
                        Confirm & Complete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

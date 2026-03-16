// ==========================================
// PetPooja - Billing Screen
// ==========================================

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Minus, Trash2, Percent, Tag, X,
    CreditCard, Smartphone, Banknote, SplitSquareHorizontal,
    ArrowLeft, Printer, Mic, Loader2
} from 'lucide-react';
import { useBillingStore, useMenuStore, useAuthStore, useInventoryStore } from '../../lib/store';
import { mockRestaurant } from '../../lib/mockData';
import { formatCurrency, classNames } from '../../lib/utils';
import { MenuItem, MenuModifier } from '../../types';
import InvoicePreview from './InvoicePreview';

export default function BillingScreen() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tableNum = searchParams.get('table');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showModifiers, setShowModifiers] = useState<MenuItem | null>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<MenuModifier[]>([]);
    const [showDiscount, setShowDiscount] = useState(false);
    const [discType, setDiscType] = useState<'percentage' | 'flat'>('percentage');
    const [discValue, setDiscValue] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const { user } = useAuthStore();
    const { categories, items: menuItems, fetchMenu, loading: menuLoading } = useMenuStore();

    const { inventory, fetchInventory } = useInventoryStore();

    useEffect(() => {
        fetchMenu();
        fetchInventory();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories, activeCategory]);

    const {
        orderItems, addItem, removeItem, updateQuantity,
        setDiscount, clearDiscount, paymentMethod, setPaymentMethod,
        customerName, customerPhone, setCustomerDetails,
        clearOrder, getSubtotal, getDiscountAmount, getCGST, getSGST, getTotal,
        discountType, discountValue, submitOrder, isSubmitting
    } = useBillingStore();

    const isItemAvailable = (item: MenuItem) => {
        if (!item.is_available) return false;
        if (!item.recipe || !item.recipe.ingredients) return true;

        return item.recipe.ingredients.every(ri => {
            const invItem = inventory.find(i => i.id === ri.ingredient_id);
            return invItem && invItem.current_stock >= ri.quantity_required;
        });
    };

    const filteredItems = useMemo(() => {
        let items = menuItems.filter((item) => item.category_id === activeCategory);
        if (search) {
            const s = search.toLowerCase();
            items = menuItems.filter((item) => item.name.toLowerCase().includes(s));
        }
        return items;
    }, [activeCategory, search, menuItems]);

    const handleAddItem = (item: MenuItem) => {
        if (item.modifiers && item.modifiers.length > 0) {
            setShowModifiers(item);
            setSelectedModifiers([]);
        } else {
            addItem(item);
        }
    };

    const handleConfirmModifiers = () => {
        if (showModifiers) {
            addItem(showModifiers, selectedModifiers);
            setShowModifiers(null);
            setSelectedModifiers([]);
        }
    };

    const handleApplyDiscount = () => {
        const val = parseFloat(discValue);
        if (!val || val <= 0) return;
        setDiscount(discType, val);
        setShowDiscount(false);
        setDiscValue('');
    };

    const handlePay = () => {
        if (!paymentMethod || orderItems.length === 0) return;
        setShowInvoice(true);
    };

    const handleVoice = () => {
        setIsListening(!isListening);
        // Voice integration placeholder
    };

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const cgst = getCGST();
    const sgst = getSGST();
    const total = getTotal();

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top Bar */}
            <div style={{
                padding: 'var(--space-3) var(--space-5)',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
            }}>
                <button className="btn btn-ghost btn-icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                        {tableNum ? `Table ${tableNum}` : 'New Order'}
                    </h2>
                    <span className="text-xs text-secondary">
                        {orderItems.length} items • {formatCurrency(total)}
                    </span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        className={classNames('btn', isListening ? 'btn-danger' : 'btn-secondary')}
                        onClick={handleVoice}
                        style={{ gap: 'var(--space-2)' }}
                    >
                        <Mic size={16} />
                        {isListening ? 'Listening...' : 'Voice'}
                    </button>
                </div>
            </div>

            {/* Split Layout */}
            <div className="billing-layout" style={{ flex: 1, padding: 'var(--space-4)', height: 'calc(100vh - 56px)' }}>
                {/* Left: Menu */}
                <div className="billing-menu">
                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 'var(--space-3)' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            className="input"
                            placeholder="Search menu items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    {/* Categories */}
                    <div className="billing-categories">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={classNames('billing-category-btn', activeCategory === cat.id && !search && 'active')}
                                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
                            >
                                <span>{cat.icon}</span> {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="menu-items-grid">
                        {filteredItems.map((item) => {
                            const available = isItemAvailable(item);
                            return (
                                <motion.button
                                    key={item.id}
                                    className={classNames('menu-item-card', !available && 'out-of-stock')}
                                    onClick={() => available && handleAddItem(item)}
                                    whileTap={available ? { scale: 0.97 } : {}}
                                    disabled={!available}
                                    style={{
                                        padding: 0,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'left',
                                        minHeight: 'auto',
                                        opacity: available ? 1 : 0.6,
                                        position: 'relative'
                                    }}
                                >
                                    {!available && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            right: '0',
                                            bottom: '0',
                                            background: 'rgba(0,0,0,0.4)',
                                            zIndex: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Out of Stock
                                        </div>
                                    )}
                                    <div style={{
                                        height: '100px',
                                        width: '100%',
                                        background: item.image_url
                                            ? `url(${item.image_url}) center/cover no-repeat`
                                            : 'linear-gradient(135deg, var(--color-bg-hover), var(--color-bg))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottom: '1px solid var(--color-border)'
                                    }}>
                                        {!item.image_url && <Plus size={24} style={{ opacity: 0.2, color: 'var(--color-primary)' }} />}
                                    </div>
                                    <div style={{ padding: 'var(--space-3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                                            <span className={`menu-item-veg ${item.is_veg ? 'veg' : 'non-veg'}`} />
                                            <span className="menu-item-name" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.name}</span>
                                        </div>
                                        <div className="menu-item-price" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(item.price)}</div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="billing-order">
                    <div className="order-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Current Order</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowDiscount(true)}>
                                    <Percent size={14} /> Discount
                                </button>
                                {orderItems.length > 0 && (
                                    <button className="btn btn-ghost btn-sm" onClick={clearOrder} style={{ color: 'var(--color-error)' }}>
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items">
                        {orderItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--color-text-tertiary)' }}>
                                <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>🛒</div>
                                <div style={{ fontSize: 'var(--text-sm)' }}>No items added yet</div>
                                <div className="text-xs" style={{ marginTop: 'var(--space-1)' }}>Click menu items or use voice to add</div>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {orderItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="order-item"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        layout
                                    >
                                        <div className="order-item-info">
                                            <div className="order-item-name">{item.menu_item.name}</div>
                                            {item.modifiers.length > 0 && (
                                                <div className="order-item-modifiers">{item.modifiers.map((m) => m.name).join(', ')}</div>
                                            )}
                                        </div>
                                        <div className="order-item-qty">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                <Minus size={12} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="order-item-price">{formatCurrency(item.subtotal)}</div>
                                        <button className="btn btn-ghost btn-icon sm" onClick={() => removeItem(item.id)} style={{ color: 'var(--color-error)' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Discount & Summary */}
                    {orderItems.length > 0 && (
                        <>
                            <div className="order-summary">
                                <div className="order-summary-row">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="order-summary-row" style={{ color: 'var(--color-success)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-success)' }}>
                                            <Tag size={12} />
                                            Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Flat'})
                                            <button className="btn btn-ghost btn-icon sm" onClick={clearDiscount}>
                                                <X size={10} />
                                            </button>
                                        </span>
                                        <span style={{ color: 'var(--color-success)' }}>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="order-summary-row">
                                    <span>CGST (2.5%)</span>
                                    <span>{formatCurrency(cgst)}</span>
                                </div>
                                <div className="order-summary-row">
                                    <span>SGST (2.5%)</span>
                                    <span>{formatCurrency(sgst)}</span>
                                </div>
                                <div className="order-summary-row order-summary-total">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                                    <input
                                        type="text"
                                        className="input sm"
                                        placeholder="Customer Name"
                                        value={customerName}
                                        onChange={(e) => setCustomerDetails(e.target.value, customerPhone)}
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    />
                                    <input
                                        type="tel"
                                        className="input sm"
                                        placeholder="Phone Number"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerDetails(customerName, e.target.value)}
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    />
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="payment-buttons">
                                {[
                                    { method: 'cash' as const, icon: Banknote, label: 'Cash' },
                                    { method: 'upi' as const, icon: Smartphone, label: 'UPI' },
                                    { method: 'card' as const, icon: CreditCard, label: 'Card' },
                                    { method: 'split' as const, icon: SplitSquareHorizontal, label: 'Split' },
                                ].map((p) => (
                                    <button
                                        key={p.method}
                                        className={classNames('payment-btn', paymentMethod === p.method && 'active')}
                                        onClick={() => setPaymentMethod(p.method)}
                                    >
                                        <p.icon size={18} />
                                        <span>{p.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: 'var(--space-3) var(--space-5) var(--space-4)' }}>
                                <button
                                    className="btn btn-primary btn-lg w-full"
                                    onClick={handlePay}
                                    disabled={!paymentMethod}
                                    style={{ gap: 'var(--space-2)' }}
                                >
                                    <Printer size={18} />
                                    Generate Bill — {formatCurrency(total)}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modifiers Modal */}
            <AnimatePresence>
                {showModifiers && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModifiers(null)}
                    >
                        <motion.div
                            className="modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3 className="modal-title">Customize: {showModifiers.name}</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowModifiers(null)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="modal-body">
                                {showModifiers.modifiers?.map((mod: MenuModifier) => (
                                    <label key={mod.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                        padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)',
                                        cursor: 'pointer',
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedModifiers.some((m) => m.id === mod.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedModifiers([...selectedModifiers, mod]);
                                                } else {
                                                    setSelectedModifiers(selectedModifiers.filter((m) => m.id !== mod.id));
                                                }
                                            }}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                                        />
                                        <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{mod.name}</span>
                                        {mod.price > 0 && (
                                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>+{formatCurrency(mod.price)}</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModifiers(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleConfirmModifiers}>Add to Order</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Discount Modal */}
            <AnimatePresence>
                {showDiscount && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDiscount(false)}
                    >
                        <motion.div
                            className="modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '400px' }}
                        >
                            <div className="modal-header">
                                <h3 className="modal-title">Apply Discount</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowDiscount(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                    <button
                                        className={classNames('btn', discType === 'percentage' ? 'btn-primary' : 'btn-secondary')}
                                        onClick={() => setDiscType('percentage')}
                                        style={{ flex: 1 }}
                                    >
                                        <Percent size={14} /> Percentage
                                    </button>
                                    <button
                                        className={classNames('btn', discType === 'flat' ? 'btn-primary' : 'btn-secondary')}
                                        onClick={() => setDiscType('flat')}
                                        style={{ flex: 1 }}
                                    >
                                        ₹ Flat Amount
                                    </button>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">{discType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}</label>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder={discType === 'percentage' ? 'e.g. 10' : 'e.g. 100'}
                                        value={discValue}
                                        onChange={(e) => setDiscValue(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDiscount(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleApplyDiscount}>Apply</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invoice Preview Modal */}
            <AnimatePresence>
                {showInvoice && (
                    <InvoicePreview
                        restaurant={mockRestaurant}
                        orderItems={orderItems}
                        subtotal={subtotal}
                        discount={discount}
                        discountType={discountType}
                        discountValue={discountValue}
                        cgst={cgst}
                        sgst={sgst}
                        total={total}
                        paymentMethod={paymentMethod!}
                        tableNumber={tableNum ? parseInt(tableNum) : undefined}
                        onClose={() => setShowInvoice(false)}
                        onConfirm={async () => {
                            const { error } = await submitOrder(tableNum || undefined);
                            if (error) {
                                alert(`Order Failed: ${error}`);
                            } else {
                                setShowInvoice(false);
                                navigate('/dashboard', {
                                    state: { toast: `The order with amount ₹${total.toFixed(2)} is generated` }
                                });
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

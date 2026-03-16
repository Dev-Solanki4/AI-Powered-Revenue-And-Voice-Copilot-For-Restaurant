// ==========================================
// PetPooja - Signup Page
// ==========================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, FileText, MapPin, Phone, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { validateGSTIN, validatePhone, validateEmail } from '../../lib/utils';

interface FormErrors {
    [key: string]: string;
}

export default function Signup() {
    const [form, setForm] = useState({
        restaurant_name: '',
        owner_name: '',
        gstin: '',
        address: '',
        phone: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, error: authError, clearError } = useAuthStore();

    // Clear backend errors on mount
    useEffect(() => { clearError(); }, []);

    const update = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.restaurant_name.trim()) errs.restaurant_name = 'Restaurant name is required';
        if (!form.owner_name.trim()) errs.owner_name = 'Owner name is required';
        if (!form.gstin.trim()) errs.gstin = 'GSTIN is required';
        else if (!validateGSTIN(form.gstin)) errs.gstin = 'Invalid GSTIN format';
        if (!form.address.trim()) errs.address = 'Address is required';
        if (!form.phone.trim()) errs.phone = 'Phone number is required';
        else if (!validatePhone(form.phone)) errs.phone = 'Invalid phone number (10 digits)';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!validateEmail(form.email)) errs.email = 'Invalid email address';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (!validate()) return;
        setLoading(true);
        try {
            const success = await signup(form);
            if (success) navigate('/');
        } catch {
            setErrors((prev) => ({ ...prev, submit: 'Something went wrong. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'restaurant_name', label: 'Restaurant Name', icon: Building2, type: 'text', placeholder: 'My Restaurant' },
        { key: 'owner_name', label: 'Owner Name', icon: User, type: 'text', placeholder: 'Rajesh Patel' },
        { key: 'gstin', label: 'GSTIN Number', icon: FileText, type: 'text', placeholder: '27AABCU9603R1ZM' },
        { key: 'address', label: 'Restaurant Address', icon: MapPin, type: 'text', placeholder: '42, MG Road, Mumbai' },
        { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '9876543210' },
        { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'owner@restaurant.com' },
        { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: 'Minimum 8 characters' },
    ];

    return (
        <div className="auth-page">
            <div className="auth-container animate-fade-in" style={{ maxWidth: '520px' }}>
                <div className="auth-card">
                    <div className="auth-brand">
                        <div className="auth-brand-logo">P</div>
                        <h1>Create Account</h1>
                        <p>Register your restaurant on PetPooja</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {(errors.submit || authError) && (
                            <div style={{
                                padding: 'var(--space-3) var(--space-4)',
                                background: 'var(--color-error-bg)',
                                color: 'var(--color-error)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                marginBottom: 'var(--space-4)'
                            }}>
                                {errors.submit || authError}
                            </div>
                        )}

                        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                            <div className="input-group" key={key}>
                                <label className="input-label">{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <Icon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        className={`input ${errors[key] ? 'error' : ''}`}
                                        type={type}
                                        placeholder={placeholder}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => update(key, e.target.value)}
                                        style={{ paddingLeft: '40px' }}
                                    />
                                </div>
                                {errors[key] && <span className="input-error-text">{errors[key]}</span>}
                            </div>
                        ))}

                        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

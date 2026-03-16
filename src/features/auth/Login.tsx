// ==========================================
// PetPooja - Login Page
// ==========================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, error: authError, clearError } = useAuthStore();

    // Clear errors when component mounts
    useEffect(() => { clearError(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            }
        } catch {
            // Error is handled by the store
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container animate-fade-in">
                <div className="auth-card">
                    <div className="auth-brand">
                        <div className="auth-brand-logo">P</div>
                        <h1>PetPooja</h1>
                        <p>Sign in to your restaurant dashboard</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {authError && (
                            <div style={{
                                padding: 'var(--space-3) var(--space-4)',
                                background: 'var(--color-error-bg)',
                                color: 'var(--color-error)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                            }}>
                                {authError}
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="owner@restaurant.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                <input
                                    className="input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

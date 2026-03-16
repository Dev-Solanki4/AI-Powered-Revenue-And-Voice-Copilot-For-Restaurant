// ==========================================
// PetPooja - Premium Landing Page
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    Receipt, Package, BarChart3, ShoppingBag, Bot,
    Users, Shield, Smartphone, ChefHat, Clock,
    Star, ArrowRight, Check, Zap, Globe, Headphones,
    Sun, Moon, Menu, X, Play, TrendingUp,
    MonitorSmartphone, CreditCard, Mic
} from 'lucide-react';
import { useThemeStore } from '../../lib/store';

// ==========================================
// Animated Counter Component
// ==========================================
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 20);
        return () => clearInterval(timer);
    }, [isInView, end]);

    return (
        <div ref={ref}>
            {prefix}{count.toLocaleString('en-IN')}{suffix}
        </div>
    );
}

// ==========================================
// Feature data
// ==========================================
const features = [
    {
        icon: Receipt,
        title: 'Lightning-Fast Billing',
        description: 'Quick 3-click billing with split payments, table merge, discounts, and GST-compliant invoices. Process orders in seconds.',
        color: '#D32F2F',
        highlights: ['QR Code invoices', 'Split & merge tables', 'CGST/SGST auto-calc'],
    },
    {
        icon: Package,
        title: 'Smart Inventory',
        description: 'AI-powered inventory management with auto-deduction, low-stock alerts, expiry tracking, and reorder suggestions.',
        color: '#F59E0B',
        highlights: ['Auto stock deduction', 'Expiry alerts', 'AI reorder suggestions'],
    },
    {
        icon: BarChart3,
        title: 'Powerful Analytics',
        description: '14+ KPIs, interactive charts, heatmaps, and month-over-month comparisons. Know your business inside out.',
        color: '#3B82F6',
        highlights: ['Revenue heatmaps', 'Peak hour analysis', 'Drill-down charts'],
    },
    {
        icon: ShoppingBag,
        title: 'Online Order Hub',
        description: 'Single dashboard for Zomato, Swiggy, dine-in, and takeaway. Accept, track, and manage all orders in one place.',
        color: '#10B981',
        highlights: ['Zomato & Swiggy', 'Real-time tracking', 'Auto accept rules'],
    },
];

const addons = [
    { icon: Bot, title: 'AI Assistant', desc: 'Ask anything about your business in plain English. Get instant insights, forecasts, and reports.', color: '#8B5CF6' },
    { icon: Mic, title: 'Voice Billing', desc: 'Add items, apply discounts, and process orders using voice commands. Supports Indian English.', color: '#EC4899' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Row-level security, JWT auth, encrypted data, audit logs, and role-based access control.', color: '#0EA5E9' },
    { icon: MonitorSmartphone, title: 'Real-Time Sync', desc: 'Live table updates, order timers, kitchen status, and revenue dashboards via WebSockets.', color: '#F97316' },
];

const outletTypes = [
    { name: 'Fine Dine', emoji: '🍽️' },
    { name: 'QSR', emoji: '🍔' },
    { name: 'Café', emoji: '☕' },
    { name: 'Cloud Kitchen', emoji: '🏭' },
    { name: 'Food Court', emoji: '🏪' },
    { name: 'Bar & Brewery', emoji: '🍺' },
    { name: 'Bakery', emoji: '🧁' },
    { name: 'Pizzeria', emoji: '🍕' },
    { name: 'Desserts', emoji: '🍨' },
    { name: 'Large Chain', emoji: '🏢' },
];

const testimonials = [
    {
        quote: 'PetPooja transformed how we manage our 12-outlet chain. The real-time dashboard and AI insights helped us reduce food waste by 23% in just 2 months.',
        name: 'Rajesh Patel',
        role: 'Founder, Spice Garden Chain',
        rating: 5,
    },
    {
        quote: 'The billing speed is incredible. During peak hours, our cashiers process 3x more orders. The voice billing feature is a game-changer for our busy kitchen.',
        name: 'Priya Sharma',
        role: 'Operations Head, Café Bliss',
        rating: 5,
    },
    {
        quote: 'Switching from our old POS to PetPooja was the best decision. Zomato and Swiggy integration on a single screen made our operations seamless.',
        name: 'Amit Desai',
        role: 'Owner, Mumbai Masala',
        rating: 5,
    },
];

// ==========================================
// Main Landing Page
// ==========================================
export default function LandingPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', overflow: 'hidden' }}>

            {/* ==========================================
          NAVBAR
          ========================================== */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: theme === 'dark' ? 'rgba(15, 17, 23, 0.85)' : 'rgba(250, 250, 250, 0.85)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'all var(--transition-theme)',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 var(--space-6)',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <img
                            src="src/assets/petpooja-poss-logo-Photoroom.png"
                            alt="PetPooja"
                            style={{ height: '50px', width: 'auto' }}
                        />
                    </div>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }} className="nav-links-desktop">
                        {['Features', 'Add-ons', 'Outlets', 'Testimonials'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            <div className="theme-toggle-knob">
                                {theme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                            </div>
                        </button>

                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate('/login')}
                            style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}
                        >
                            Login
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/signup')}
                            style={{ fontWeight: 600, fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-full)', padding: 'var(--space-2) var(--space-5)' }}
                        >
                            Sign Up Free
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{ display: 'none' }}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ==========================================
          HERO SECTION
          ========================================== */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '160px var(--space-6) 80px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-16)',
                    alignItems: 'center',
                    minHeight: '90vh',
                }}>
                    {/* Left: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        {/* Trust badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: 'var(--space-1) var(--space-4)',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-primary-alpha)',
                                marginBottom: 'var(--space-6)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 500,
                                color: 'var(--color-primary)',
                            }}
                        >
                            <Zap size={14} />
                            AI-Powered Restaurant Intelligence
                        </motion.div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            marginBottom: 'var(--space-5)',
                        }}>
                            Restaurant POS{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #D32F2F, #EF5350)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                made simple!
                            </span>
                        </h1>

                        <p style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 1.7,
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--space-8)',
                            maxWidth: '520px',
                        }}>
                            Manage billing, inventory, online orders, and analytics — all on one powerful platform. AI-driven insights to grow your restaurant like a real boss!
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                            <motion.button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/signup')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                    padding: 'var(--space-3) var(--space-8)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 600,
                                    gap: 'var(--space-2)',
                                    boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)',
                                }}
                            >
                                Get Started Free <ArrowRight size={18} />
                            </motion.button>
                            <motion.button
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate('/login')}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                    padding: 'var(--space-3) var(--space-8)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 600,
                                    gap: 'var(--space-2)',
                                }}
                            >
                                Login to Dashboard
                            </motion.button>
                        </div>

                        {/* Trust indicators */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <div style={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                                    ))}
                                </div>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>4.8/5</span>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                Trusted by <strong>1,00,000+</strong> restaurants
                            </span>
                        </div>
                    </motion.div>

                    {/* Right: Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, rotateY: -5 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{ perspective: '1000px' }}
                    >
                        <div style={{
                            borderRadius: 'var(--radius-2xl)',
                            overflow: 'hidden',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.15), 0 16px 32px rgba(0,0,0,0.1)',
                            border: '1px solid var(--color-border)',
                            position: 'relative',
                        }}>
                            <img
                                src="/hero-dashboard.png"
                                alt="PetPooja Dashboard"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                }}
                            />
                            {/* Gradient overlay at bottom */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '60px',
                                background: 'linear-gradient(transparent, var(--color-bg))',
                                opacity: 0.5,
                            }} />
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ==========================================
          STATS BAR
          ========================================== */}
            <section style={{
                background: 'var(--color-bg-elevated)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--space-10) 0',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 var(--space-6)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 'var(--space-8)',
                    textAlign: 'center',
                }}>
                    {[
                        { value: 100000, suffix: '+', label: 'Happy Restaurants' },
                        { value: 5000000, suffix: '+', label: 'Bills Processed Daily' },
                        { value: 0, suffix: '', label: 'Processing Errors', prefix: '' },
                        { value: 99, suffix: '.9%', label: 'Uptime Guaranteed' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ==========================================
          FEATURES SECTION
          ========================================== */}
            <section id="features" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-1) var(--space-4)',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-alpha)',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                        }}>
                            Core Features
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-3)' }}>
                            A restaurant POS for{' '}
                            <span style={{ color: 'var(--color-primary)' }}>all your needs</span>
                        </h2>
                        <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Everything you need to manage your restaurant — from billing to AI-powered insights — all in one platform.
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-8)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s',
                                    cursor: 'default',
                                }}
                                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                            >
                                {/* Top gradient line */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${feature.color}, ${feature.color}88)`,
                                }} />

                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--space-4)',
                                    color: feature.color,
                                }}>
                                    <feature.icon size={24} />
                                </div>

                                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
                                    {feature.description}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {feature.highlights.map((h) => (
                                        <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                            <Check size={14} style={{ color: feature.color }} />
                                            <span style={{ color: 'var(--color-text-secondary)' }}>{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==========================================
          ADD-ONS SECTION
          ========================================== */}
            <section id="add-ons" style={{
                padding: '100px 0',
                background: 'var(--color-bg-elevated)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-1) var(--space-4)',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-alpha)',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                        }}>
                            Supercharged
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-3)' }}>
                            Add-ons to{' '}
                            <span style={{ color: 'var(--color-primary)' }}>supercharge</span> your POS
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
                        {addons.map((addon, idx) => (
                            <motion.div
                                key={addon.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-6)',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    cursor: 'default',
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: 'var(--radius-xl)',
                                    background: `${addon.color}12`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                    color: addon.color,
                                }}>
                                    <addon.icon size={26} />
                                </div>
                                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                    {addon.title}
                                </h3>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    {addon.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==========================================
          OUTLET TYPES
          ========================================== */}
            <section id="outlets" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-1) var(--space-4)',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-alpha)',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                        }}>
                            For Every Format
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-3)' }}>
                            Built for{' '}
                            <span style={{ color: 'var(--color-primary)' }}>all types</span> of food business
                        </h2>
                        <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                            The all-in-one restaurant management system for every food outlet format.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)' }}>
                        {outletTypes.map((type, idx) => (
                            <motion.div
                                key={type.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-5)',
                                    textAlign: 'center',
                                    cursor: 'default',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{type.emoji}</div>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{type.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==========================================
          TESTIMONIALS
          ========================================== */}
            <section id="testimonials" style={{
                padding: '100px 0',
                background: 'var(--color-bg-elevated)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-1) var(--space-4)',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-alpha)',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                        }}>
                            Customer Love
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
                            What our <span style={{ color: 'var(--color-primary)' }}>restaurateurs</span> say
                        </h2>
                    </motion.div>

                    {/* Testimonial Card */}
                    <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-10)',
                            boxShadow: 'var(--shadow-lg)',
                            position: 'relative',
                        }}
                    >
                        <div style={{ fontSize: '3rem', color: 'var(--color-primary)', opacity: 0.2, position: 'absolute', top: '20px', left: '28px' }}>
                            "
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                            {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                            ))}
                        </div>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 1.7,
                            color: 'var(--color-text)',
                            fontStyle: 'italic',
                            marginBottom: 'var(--space-6)',
                        }}>
                            "{testimonials[activeTestimonial].quote}"
                        </p>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>
                                {testimonials[activeTestimonial].name}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                {testimonials[activeTestimonial].role}
                            </div>
                        </div>
                    </motion.div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTestimonial(idx)}
                                style={{
                                    width: idx === activeTestimonial ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: 'var(--radius-full)',
                                    background: idx === activeTestimonial ? 'var(--color-primary)' : 'var(--color-border)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ==========================================
          CTA SECTION
          ========================================== */}
            <section style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 var(--space-6)', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
                            Ready to transform your{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #D32F2F, #EF5350)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                restaurant?
                            </span>
                        </h2>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
                            Join 1,00,000+ restaurants already using PetPooja to streamline operations, increase revenue, and delight customers.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
                            <motion.button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/signup')}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                    padding: 'var(--space-4) var(--space-10)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 700,
                                    gap: 'var(--space-2)',
                                    boxShadow: '0 8px 40px rgba(211, 47, 47, 0.35)',
                                }}
                            >
                                Sign Up Free <ArrowRight size={18} />
                            </motion.button>
                            <motion.button
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate('/login')}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                    padding: 'var(--space-4) var(--space-10)',
                                    fontSize: 'var(--text-md)',
                                    fontWeight: 700,
                                }}
                            >
                                Login
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ==========================================
          FOOTER
          ========================================== */}
            <footer style={{
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg-elevated)',
                padding: '64px 0 32px',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-10)', marginBottom: '48px' }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'linear-gradient(135deg, #D32F2F, #EF5350)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                }}>
                                    P
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>PetPooja</div>
                            </div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '300px' }}>
                                The best restaurant POS software to manage your billing, KOTs, inventory, online orders, menu, and customers.
                            </p>
                        </div>

                        {/* POS Links */}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>POS</div>
                            {['Billing', 'Inventory', 'Reporting', 'Online Ordering', 'Menu', 'CRM'].map((item) => (
                                <div key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0', cursor: 'pointer' }}>
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Outlet Types */}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>Outlet Types</div>
                            {['Fine Dine', 'QSR', 'Café', 'Cloud Kitchen', 'Bar & Brewery', 'Bakery'].map((item) => (
                                <div key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0', cursor: 'pointer' }}>
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Resources */}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>Resources</div>
                            {['Blog', 'Support', 'Pricing', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <div key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0', cursor: 'pointer' }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: 'var(--space-6)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                            © 2026 PetPooja. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            {['Privacy', 'Terms', 'Support'].map((item) => (
                                <span key={item} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

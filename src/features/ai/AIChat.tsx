// ==========================================
// PetPooja - AI Chat Assistant
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, MicOff, FileText, Download, Sparkles } from 'lucide-react';
import { AIMessage } from '../../types';
import { formatCurrency } from '../../lib/utils';

const quickPrompts = [
    'Why did profits drop this week?',
    'Compare this month to last month',
    'Which item has the lowest margin?',
    'Forecast next weekend sales',
    'Generate executive summary',
    'What are the top selling items?',
];

const mockResponses: Record<string, string> = {
    'why did profits drop this week?': `## Profit Analysis — This Week\n\nYour net profit dropped by **2.1%** compared to last week. Here's the breakdown:\n\n**Key Factors:**\n1. **Higher ingredient costs** — Onion prices increased 18% this week (+₹2,400)\n2. **Increased discounts** — 5.8% discount rate vs 5.3% last week (+₹1,200)\n3. **Staff overtime** — 12 extra hours logged (+₹1,800)\n\n**Recommendations:**\n- Switch to pre-order bulk purchasing for onions\n- Cap maximum discount at 10% without manager approval\n- Review shift scheduling to reduce overtime`,

    'compare this month to last month': `## Month-over-Month Comparison\n\n| Metric | This Month | Last Month | Change |\n|--------|-----------|------------|--------|\n| Revenue | ₹5,40,000 | ₹4,90,000 | +10.2% |\n| Orders | 1,420 | 1,310 | +8.4% |\n| Avg Order Value | ₹380 | ₹374 | +1.6% |\n| Profit | ₹1,62,000 | ₹1,52,000 | +6.6% |\n| Online Orders | 35% | 31% | +4% |\n\n📈 **Positive trend** — Revenue and orders are up across all channels. Online ordering share is growing.`,

    'which item has the lowest margin?': `## Low Margin Items\n\nHere are items with the **lowest profit margins:**\n\n1. **Chicken Biryani** — Margin: 18% (₹58/plate)\n   - Cost: ₹262, Price: ₹320\n   - High chicken + basmati rice costs\n\n2. **Mutton Rogan Josh** — Margin: 22%\n   - Mutton prices volatile\n\n3. **Fish Amritsari** — Margin: 24%\n\n**Suggestions:**\n- Increase Chicken Biryani price by ₹20 (won't affect demand based on elasticity data)\n- Source mutton from alternate vendor (quote ₹15/kg lower)\n- Consider portion optimization for fish dishes`,

    'forecast next weekend sales': `## Weekend Sales Forecast\n\n📊 Based on last 8 weekends and seasonal trends:\n\n**Predicted Revenue: ₹72,000 — ₹78,000**\n\n- Saturday: ₹36,000 — ₹40,000\n- Sunday: ₹36,000 — ₹38,000\n\n**Expected Peak Hours:**\n- Lunch: 12:30 PM — 2:00 PM\n- Dinner: 7:30 PM — 9:30 PM\n\n**Recommended Prep:**\n- Stock 15kg chicken (vs usual 12kg)\n- Pre-prep 20% more biryani rice\n- Schedule 2 extra kitchen staff for dinner shift\n- Ensure UPI payment system is operational (40% of weekend payments)`,

    'default': `I've analyzed your restaurant data. Based on the current metrics:\n\n- **Revenue** is trending upward (+12.5% this week)\n- **Table turnover** is at 4.2x, which is healthy\n- **Top performing category** is Main Course (₹42,500 this week)\n\nWould you like me to dive deeper into any specific area? I can analyze profits, compare periods, forecast sales, or generate a detailed executive report.`,
};

export default function AIChat() {
    const [messages, setMessages] = useState<AIMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: '👋 Hello! I\'m your AI business assistant. I can analyze your restaurant data, generate reports, forecast sales, and answer any business questions.\n\nTry asking me something like:\n- "Why did profits drop this week?"\n- "Compare this month to last month"\n- "Forecast next weekend sales"',
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text?: string) => {
        const message = text || input.trim();
        if (!message) return;

        const userMsg: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const key = message.toLowerCase();
            const response = mockResponses[key] || mockResponses['default'];

            const aiMsg: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200 + Math.random() * 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleVoice = () => {
        setIsListening(!isListening);
        // Voice recognition placeholder
        if (!isListening) {
            setTimeout(() => {
                setIsListening(false);
                setInput('What are the top selling items today?');
            }, 2000);
        }
    };

    return (
        <div className="page-container" style={{ padding: 0, height: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, var(--color-primary), #FF8A80)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>PetPooja AI</div>
                        <div className="text-xs text-secondary">Business Intelligence Assistant</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary btn-sm">
                        <FileText size={14} /> Generate Report
                    </button>
                    <button className="btn btn-secondary btn-sm">
                        <Download size={14} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Quick Prompts */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-6)',
                overflowX: 'auto',
                borderBottom: '1px solid var(--color-divider)',
                flexShrink: 0,
            }}>
                {quickPrompts.map((prompt) => (
                    <button
                        key={prompt}
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSend(prompt)}
                        style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages" style={{ flex: 1, overflow: 'auto', padding: 'var(--space-6)' }}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            className={`chat-message ${msg.role}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="chat-message-avatar">
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className="chat-message-content">
                                {msg.content.split('\n').map((line, idx) => {
                                    if (line.startsWith('## ')) return <h3 key={idx} style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginBottom: '8px', marginTop: idx > 0 ? '12px' : 0 }}>{line.replace('## ', '')}</h3>;
                                    if (line.startsWith('**') && line.endsWith('**')) return <p key={idx} style={{ fontWeight: 600, margin: '4px 0' }}>{line.replace(/\*\*/g, '')}</p>;
                                    if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <p key={idx} style={{ margin: '2px 0', paddingLeft: '8px' }}>{line}</p>;
                                    if (line.startsWith('|')) return <p key={idx} style={{ margin: '1px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{line}</p>;
                                    if (line.trim() === '') return <br key={idx} />;
                                    return <p key={idx} style={{ margin: '3px 0' }}>{line}</p>;
                                })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        className="chat-message assistant"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="chat-message-avatar">
                            <Bot size={14} />
                        </div>
                        <div className="chat-message-content" style={{ display: 'flex', gap: '4px', padding: '12px 16px' }}>
                            <div className="voice-bar" style={{ animationDelay: '0s' }} />
                            <div className="voice-bar" style={{ animationDelay: '0.1s' }} />
                            <div className="voice-bar" style={{ animationDelay: '0.2s' }} />
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-container" style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
                <button
                    className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'} btn-icon`}
                    onClick={toggleVoice}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <textarea
                    className="chat-input"
                    placeholder="Ask anything about your business..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                <button
                    className="btn btn-primary btn-icon"
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                >
                    <Send size={18} />
                </button>
            </div>

            {/* Voice Listening Indicator */}
            {isListening && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-3) var(--space-5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    <div className="voice-indicator">
                        <div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" />
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Listening...</span>
                </motion.div>
            )}
        </div>
    );
}

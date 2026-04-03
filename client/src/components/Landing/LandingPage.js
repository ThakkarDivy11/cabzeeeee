import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, MapPin, ShieldCheck, CreditCard, Users, Clock,
    ArrowRight, Star, Quote, MessageCircle, Navigation,
    ChevronRight, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [rideType, setRideType] = useState('Standard');

    return (
        <div style={{ background: '#060B18', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(0,255,255,0.12);
                    box-shadow: 0 0 30px rgba(0,255,255,0.08);
                }
                .glass-card {
                    background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(0,255,255,0.15);
                    box-shadow: 0 0 30px rgba(0,255,255,0.2);
                    border-radius: 20px;
                }
                .neon-btn {
                    background: linear-gradient(135deg, #00e5ff, #2979ff);
                    color: #000;
                    font-weight: 800;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 32px;
                    cursor: pointer;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 20px rgba(0,229,255,0.4);
                }
                .neon-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 35px rgba(0,229,255,0.7);
                }
                .ghost-btn {
                    background: rgba(0,229,255,0.08);
                    color: #00e5ff;
                    font-weight: 700;
                    border: 1px solid rgba(0,229,255,0.3);
                    border-radius: 12px;
                    padding: 14px 32px;
                    cursor: pointer;
                    font-size: 15px;
                    transition: all 0.3s ease;
                }
                .ghost-btn:hover {
                    background: rgba(0,229,255,0.15);
                    border-color: rgba(0,229,255,0.6);
                    transform: translateY(-2px);
                }
                .section { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
                .gradient-text {
                    background: linear-gradient(135deg, #00e5ff, #2979ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .feature-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(0,255,255,0.1);
                    border-radius: 16px;
                    padding: 28px;
                    transition: all 0.3s ease;
                }
                .feature-card:hover {
                    background: rgba(0,229,255,0.06);
                    border-color: rgba(0,229,255,0.3);
                    transform: translateY(-4px);
                    box-shadow: 0 0 30px rgba(0,229,255,0.15);
                }
                .stat-card {
                    text-align: center;
                    padding: 32px 24px;
                    border: 1px solid rgba(0,255,255,0.12);
                    border-radius: 16px;
                    background: rgba(255,255,255,0.03);
                    transition: all 0.3s;
                }
                .stat-card:hover { border-color: rgba(0,229,255,0.4); box-shadow: 0 0 25px rgba(0,229,255,0.15); }
                .step-num {
                    width: 56px; height: 56px;
                    background: linear-gradient(135deg, #00e5ff22, #2979ff22);
                    border: 1px solid rgba(0,229,255,0.3);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; font-weight: 800; color: #00e5ff;
                    flex-shrink: 0;
                }
                .testimonial-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(0,255,255,0.1);
                    border-radius: 20px;
                    padding: 32px;
                    transition: all 0.3s;
                }
                .testimonial-card:hover { border-color: rgba(0,229,255,0.3); box-shadow: 0 0 25px rgba(0,229,255,0.1); }
                .map-mock {
                    width: 100%; height: 320px;
                    background: linear-gradient(135deg, #0d1b2e 0%, #0a1628 50%, #0d1b2e 100%);
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                }
                .map-grid {
                    position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .map-road-h {
                    position: absolute; height: 6px;
                    background: rgba(0,229,255,0.15);
                    left: 0; right: 0;
                }
                .map-road-v {
                    position: absolute; width: 6px;
                    background: rgba(0,229,255,0.15);
                    top: 0; bottom: 0;
                }
                .pulse-pin {
                    position: absolute;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    background: #00e5ff;
                    box-shadow: 0 0 20px rgba(0,229,255,0.8);
                }
                .pulse-ring {
                    position: absolute;
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    border: 2px solid rgba(0,229,255,0.5);
                    animation: ping 1.5s infinite;
                    top: -10px; left: -10px;
                }
                @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                .float-anim { animation: float 4s ease-in-out infinite; }
                .input-field {
                    width: 100%; padding: 12px 16px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(0,255,255,0.15);
                    border-radius: 10px;
                    color: #e2e8f0;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: all 0.3s;
                }
                .input-field:focus { border-color: rgba(0,229,255,0.5); box-shadow: 0 0 15px rgba(0,229,255,0.1); }
                .input-field::placeholder { color: #64748b; }
                select.input-field option { background: #0d1b2e; color: #e2e8f0; }
                .ride-toggle button {
                    padding: 8px 16px; border-radius: 8px; border: none;
                    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
                    font-family: 'Inter', sans-serif;
                }
                .nav-link { color: #94a3b8; text-decoration: none; font-weight: 500; font-size: 14px; transition: color 0.2s; }
                .nav-link:hover { color: #00e5ff; }
                @media (max-width: 768px) {
                    .hero-grid { flex-direction: column !important; }
                    .features-grid { grid-template-columns: 1fr 1fr !important; }
                    .stats-grid { grid-template-columns: 1fr 1fr !important; }
                    .steps-grid { grid-template-columns: 1fr !important; }
                    .tracking-grid { flex-direction: column !important; }
                    .testimonials-grid { grid-template-columns: 1fr !important; }
                    .footer-cols { flex-direction: column !important; gap: 32px !important; }
                }
                @media (max-width: 480px) {
                    .features-grid { grid-template-columns: 1fr !important; }
                    .stats-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            {/* ── NAV ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,255,255,0.08)',
                padding: '0 32px', height: '70px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg,#00e5ff,#2979ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: 14, color: '#000'
                    }}>CZ</div>
                    <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>CabZee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile" id="nav-links">
                    {['Features', 'How it Works', 'Tracking', 'Testimonials'].map(l => (
                        <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="nav-link">{l}</a>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/login')} className="ghost-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Login</button>
                    <button onClick={() => navigate('/register')} className="neon-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Get Started</button>
                </div>
            </nav>

            {/* ── HERO ── */}
            <div style={{ paddingTop: 70 }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '80px 24px',
                    display: 'flex', alignItems: 'center', gap: 60, minHeight: '90vh'
                }} className="hero-grid">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        style={{ flex: 1 }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '6px 16px', borderRadius: 999,
                            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)',
                            marginBottom: 24
                        }}>
                            <Zap size={13} color="#00e5ff" fill="#00e5ff" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#00e5ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                AI-Chatbot
                            </span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                            Book Rides<br />
                            <span className="gradient-text">Faster &amp; Smarter</span>
                        </h1>

                        <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
                            The smarter way to get around. Fast matching, live tracking, and safe rides — all in one place.
                        </p>

                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <button className="neon-btn" onClick={() => navigate('/register')}>
                                Book Ride <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} />
                            </button>
                            <button className="ghost-btn" onClick={() => navigate('/register')}>
                                Join as Driver
                            </button>
                        </div>
                    </motion.div>

                    {/* Right — Map Mock */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        style={{ flex: 1, maxWidth: 420, width: '100%' }}
                        className="float-anim"
                    >
                        <div className="glass-card" style={{ padding: 16 }}>
                            <div className="map-mock">
                                <div className="map-grid" />
                                <div className="map-road-h" style={{ top: '35%' }} />
                                <div className="map-road-h" style={{ top: '65%' }} />
                                <div className="map-road-v" style={{ left: '30%' }} />
                                <div className="map-road-v" style={{ left: '70%' }} />
                                {/* Pins */}
                                <div style={{ position: 'absolute', top: '33%', left: '28%' }}>
                                    <div className="pulse-ring" />
                                    <div className="pulse-pin" style={{ background: '#22c55e', boxShadow: '0 0 15px rgba(34,197,94,0.8)' }} />
                                </div>
                                <div style={{ position: 'absolute', top: '55%', left: '62%' }}>
                                    <div className="pulse-ring" style={{ borderColor: 'rgba(0,229,255,0.5)' }} />
                                    <div className="pulse-pin" />
                                </div>
                                {/* Route line */}
                                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                                    <line x1="30%" y1="35%" x2="65%" y2="57%" stroke="rgba(0,229,255,0.4)" strokeWidth="2" strokeDasharray="6,4" />
                                </svg>
                            </div>
                            {/* Driver card */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 12px', marginTop: 12,
                                background: 'rgba(0,229,255,0.05)', borderRadius: 12,
                                border: '1px solid rgba(0,229,255,0.12)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10,
                                        background: 'linear-gradient(135deg,#00e5ff,#2979ff)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, fontSize: 16, color: '#000'
                                    }}>DT</div>
                                    <div>
                                        <p style={{ fontSize: 12, color: '#00e5ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Driver Arriving</p>
                                        <p style={{ fontWeight: 700, color: '#e2e8f0' }}>Divy Thakkar · Honda City</p>
                                        <p style={{ fontSize: 12, color: '#64748b' }}>4.98 ★ · GJ05 AC 1234</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ETA</p>
                                    <p style={{ fontSize: 24, fontWeight: 900, color: '#00e5ff' }}>3 MIN</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div style={{ background: 'rgba(0,229,255,0.02)', borderTop: '1px solid rgba(0,255,255,0.06)', borderBottom: '1px solid rgba(0,255,255,0.06)', padding: '60px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="stats-grid">
                    {[
                        { num: '5M+', label: 'Rides' },
                        { num: '50K+', label: 'Drivers' },
                        { num: '4.9', label: 'Rating' },
                        { num: '<3 min', label: 'Avg Wait' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="stat-card"
                        >
                            <div style={{ fontSize: 36, fontWeight: 900, color: '#00e5ff', marginBottom: 6 }}>{s.num}</div>
                            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <div id="features" className="section">
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <p style={{ color: '#00e5ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Features</p>
                    <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.5px' }}>
                        Everything You Need,<br />Nothing You Don't
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="features-grid">
                    {[
                        { icon: MapPin, title: 'Real-time Tracking', desc: 'See your driver live on the map. No guessing, no waiting around.' },
                        { icon: MessageCircle, title: 'AI Chatbot', desc: 'Get instant answers about your ride, payments, or anything else.' },
                        { icon: CreditCard, title: 'Secure Payments', desc: 'Cards, wallets, UPI — all encrypted. Pay your way.' },
                        { icon: Clock, title: '24/7 Support', desc: 'Real humans and smart bots, always ready to help.' },
                        { icon: ShieldCheck, title: 'Safety Shield', desc: 'Verified drivers, OTP rides, and live safety alerts.' },
                        { icon: Zap, title: 'Instant Match', desc: 'AI finds you the best driver in under 30 seconds.' },
                    ].map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="feature-card"
                        >
                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16
                            }}>
                                <f.icon size={22} color="#00e5ff" />
                            </div>
                            <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#e2e8f0' }}>{f.title}</h4>
                            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── HOW IT WORKS ── */}
            <div id="how-it-works" style={{ background: 'rgba(0,229,255,0.02)', borderTop: '1px solid rgba(0,255,255,0.06)', borderBottom: '1px solid rgba(0,255,255,0.06)', padding: '100px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <p style={{ color: '#00e5ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Simple</p>
                        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.5px' }}>
                            Three Steps. That's It.
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }} className="steps-grid">
                        {[
                            { n: '01', title: 'Set Destination', desc: 'Open the app, enter where you want to go. Done.' },
                            { n: '02', title: 'Get Matched', desc: 'We find the closest, highest-rated driver near you.' },
                            { n: '03', title: 'Enjoy Your Ride', desc: 'Track live, arrive safely, pay automatically.' },
                        ].map((s, i) => (
                            <motion.div
                                key={s.n}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
                            >
                                <div className="step-num">{s.n}</div>
                                <div>
                                    <h4 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: '#e2e8f0' }}>{s.title}</h4>
                                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TRACKING ── */}
            <div id="tracking" className="section">
                <div style={{ display: 'flex', alignItems: 'center', gap: 80 }} className="tracking-grid">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ flex: 1 }}
                    >
                        <p style={{ color: '#00e5ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Live</p>
                        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 20, lineHeight: 1.2 }}>
                            Watch Your Ride,<br />Every Second
                        </h2>
                        <p style={{ color: '#94a3b8', marginBottom: 36, lineHeight: 1.7 }}>
                            Real-time updates, every 2 seconds. You'll always know exactly where your driver is.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {[
                                { icon: Zap, title: 'Live tracking', desc: 'GPS updated every 2 seconds.' },
                                { icon: ShieldCheck, title: 'OTP safety', desc: 'Your ride only starts with your code.' },
                                { icon: MapPin, title: 'Route optimization', desc: 'Smart routing beats traffic every time.' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10,
                                        background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <item.icon size={20} color="#00e5ff" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0', marginBottom: 4 }}>{item.title}</h4>
                                        <p style={{ fontSize: 13, color: '#64748b' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Glass Booking Card */}
                               </div>
            </div>

            {/* ── TESTIMONIALS ── */}
            <div id="testimonials" style={{ background: 'rgba(0,229,255,0.02)', borderTop: '1px solid rgba(0,255,255,0.06)', borderBottom: '1px solid rgba(0,255,255,0.06)', padding: '100px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <p style={{ color: '#00e5ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Reviews</p>
                        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.5px' }}>
                            Loved by Riders
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="testimonials-grid">
                        {[
                            { name: 'Sarah Jenkins', role: 'Daily Commuter', review: 'CabZee is the fastest cab app I\'ve ever used. Got matched in under a minute during rush hour — insane.' },
                            { name: 'Marcus Tran', role: 'Business Executive', review: 'Clean cars, professional drivers, and the live tracking makes every airport run stress-free.' },
                            { name: 'Elena Rossi', role: 'Late Night Worker', review: 'The OTP feature gives me real peace of mind late at night. Felt safe every single time.' },
                        ].map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="testimonial-card"
                            >
                                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                                    {[...Array(5)].map((_, s) => <Star key={s} size={14} color="#fbbf24" fill="#fbbf24" />)}
                                </div>
                                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                                    "{t.review}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, color: '#00e5ff', fontSize: 16
                                    }}>{t.name[0]}</div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{t.name}</p>
                                        <p style={{ fontSize: 12, color: '#64748b' }}>{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

        

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid rgba(0,255,255,0.08)', padding: '60px 24px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: 60, marginBottom: 60 }} className="footer-cols">
                        {/* Brand */}
                        <div style={{ flex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#00e5ff,#2979ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>CZ</div>
                                <span style={{ fontWeight: 900, fontSize: 18 }}>CabZee</span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                                The smarter, faster, safer way to ride. Built for the modern commuter.
                            </p>
                        </div>
                        {/* Links */}
                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Safety', 'Download'] },
                            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
                            { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
                        ].map(col => (
                            <div key={col.title} style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.title}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {col.links.map(l => (
                                        <a key={l} href="#" className="nav-link" style={{ fontSize: 14 }}>{l}</a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <p style={{ color: '#475569', fontSize: 13 }}>© 2026 CabZee. All rights reserved.</p>
                        <p style={{ color: '#475569', fontSize: 13 }}>Built for the future.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    MapPin,
    ShieldCheck,
    CreditCard,
    Users,
    Clock,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    Sun,
    Moon,
    Star,
    Quote,
    Check
} from 'lucide-react';
import ThemeButton from '../ui/ThemeButton';
import ThemeCard from '../ui/ThemeCard';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="bg-[var(--bg-color)] overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 h-20 glass z-[60] px-6 flex items-center justify-between border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-white font-black text-xl">CZ</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-[var(--text-main)]">CabZee</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[var(--text-muted)]">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                    <a href="#tracking" className="hover:text-primary transition-colors">Live Tracking</a>
                    <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
                    <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 sm:p-2.5 rounded-xl border border-[var(--border-color)] hover:border-primary/50 transition-all duration-300 text-[var(--text-main)] bg-[var(--bg-glass)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-primary" />}
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden sm:block text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors"
                    >
                        Login
                    </button>
                    <ThemeButton onClick={() => navigate('/register')}>Get Started</ThemeButton>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-screen">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-hero-glow -z-10 blur-3xl" />

                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest"
                    >
                        <Zap size={14} fill="currentColor" />
                        AI-Powered Ride Matching
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-[var(--text-main)]"
                    >
                        Book Rides <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Faster & Smarter</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[var(--text-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        CabZee is the next-generation cab booking platform. Experience lightning-fast matching,
                        real-time tracking, and a premium futuristic interface designed for the modern commuter.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <ThemeButton onClick={() => navigate('/register')} className="w-full sm:w-auto px-10 py-5 text-base">
                            Book Ride Now <ArrowRight size={20} className="ml-2" />
                        </ThemeButton>
                        <ThemeButton variant="secondary" onClick={() => navigate('/login')} className="w-full sm:w-auto px-10 py-5 text-base">
                            Join as Driver
                        </ThemeButton>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-10 flex items-center justify-center lg:justify-start gap-8 opacity-60"
                    >
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-[var(--text-main)]">10K+</span>
                            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Active Riders</span>
                        </div>
                        <div className="h-10 w-px bg-[var(--border-color)]" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-[var(--text-main)]">4.9/5</span>
                            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">User Rating</span>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Mockup Placeholder (Right Side) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex-1 relative w-full aspect-square max-w-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/10 to-transparent rounded-[3rem] blur-2xl -z-10" />
                    <div className="w-full h-full glass rounded-[3rem] p-6 border border-white/10 shadow-2xl overflow-hidden relative group">
                        {/* Mock Map UI */}
                        <div className="w-full h-full bg-black rounded-2xl relative overflow-hidden flex flex-col">
                            <div
                                className="absolute inset-0 bg-cover bg-center blur-[1px] opacity-60 transition-all duration-700"
                                style={{ backgroundImage: `url("/images/${theme === 'dark' ? 'dark_map.png' : 'light_map.png'}")` }}
                            />
                            <div className="absolute inset-0 bg-[var(--bg-color)] opacity-60 mix-blend-overlay pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-color)] opacity-80" />

                            {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border border-[var(--border-color)] flex items-center justify-between group-hover:translate-y-[-5px] transition-transform duration-500 shadow-2xl z-20 bg-[var(--bg-glass)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Driver Arriving</p>
                                        <p className="font-black text-[var(--text-main)]">Divy Thakkar - Honda City</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">ETA</p>
                                    <p className="text-2xl font-black text-[var(--text-main)]">3 MIN</p>
                                </div>
                            </div>

                            {/* Ping Points */}
                            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-6 h-6 bg-primary rounded-full animate-ping opacity-75" />
                                <div className="absolute top-0 left-0 w-6 h-6 bg-primary rounded-full shadow-[0_0_20px_rgba(124,58,237,1)] border-2 border-white/20" />
                            </div>
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-80 pointer-events-none" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-padding">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary underline decoration-primary/30 underline-offset-8">Recommended</h2>
                    <h3 className="text-5xl font-black text-[var(--text-main)] transition-colors">Perfect for Cab Booking</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
                    {[
                        { icon: MapPin, title: "Real-time Tracking", desc: "Monitor your driver's precise location on our futuristic neon map interface." },
                        { icon: Zap, title: "AI Chatbot Support", desc: "Get instant answers and manage your bookings through our intelligent AI assistant." },
                        { icon: ShieldCheck, title: "Secure Payments", desc: "Automated, encrypted payment protocols keeping your transactions safe." },
                        { icon: Clock, title: "24/7 Support", desc: "Our dedicated support team is available around the clock for any assistance." }
                    ].map((feat, i) => (
                        <ThemeCard key={feat.title} className="group hover:neon-border flex flex-col gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <feat.icon size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-[var(--text-main)]">{feat.title}</h4>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
                        </ThemeCard>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="section-padding overflow-hidden">
                <div className="glass rounded-[3rem] p-12 lg:p-20 relative border border-[var(--border-color)] max-w-7xl mx-auto mx-6">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-30" />

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-black text-[var(--text-main)]">How <span className="text-primary">CabZee</span> Works</h2>
                            <div className="space-y-12">
                                {[
                                    { step: "01", title: "Request your ride", desc: "Enter your destination and select your preferred vehicle type." },
                                    { step: "02", title: "Wait for matching", desc: "Our AI engine finds the best driver for your route in real-time." },
                                    { step: "03", title: "Enjoy the journey", desc: "Track your ride, securely pay, and arrive at your destination in style." }
                                ].map((item, i) => (
                                    <div key={item.step} className="flex gap-6 relative">
                                        <span className="text-5xl font-black text-primary/10 select-none">{item.step}</span>
                                        <div className="space-y-2 relative z-10">
                                            <h4 className="text-xl font-bold text-[var(--text-main)]">{item.title}</h4>
                                            <p className="text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 rounded-full blur-[100px] absolute inset-0 -z-10" />
                            <div className="glass rounded-[2rem] p-8 border border-[var(--border-color)] shadow-2xl space-y-6 rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                <h4 className="text-xl font-bold text-primary">Ride Summary</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)]">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center"><MapPin size={18} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Pickup</p>
                                            <p className="text-sm font-semibold text-[var(--text-main)]">Silicon Valley, CA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)]">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><MapPin size={18} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Destination</p>
                                            <p className="text-sm font-semibold text-[var(--text-main)]">Grand Canyon, AZ</p>
                                        </div>
                                    </div>
                                </div>
                                <ThemeButton className="w-full">Confirm Booking</ThemeButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Ride Tracking Section */}
            <section id="tracking" className="section-padding overflow-hidden relative">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary underline decoration-primary/30 underline-offset-8">Real-Time Experience</h2>
                                <h3 className="text-5xl lg:text-6xl font-black text-[var(--text-main)] leading-tight transition-colors">
                                    Track Your Ride <br />
                                    <span className="text-primary italic">in Real-Time</span>
                                </h3>
                                <p className="text-lg text-[var(--text-muted)] max-w-lg leading-relaxed">
                                    See your driver’s location, ETA, and trip updates live with our smart tracking system. Experience the peace of mind that comes with total visibility.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {[
                                    { icon: Zap, title: "Instant Updates", desc: "Real-time GPS synchronization every 2 seconds." },
                                    { icon: ShieldCheck, title: "Secure OTP", desc: "Verified entry with unique ride-start codes." },
                                    { icon: MapPin, title: "Smart Route", desc: "AI-optimized traffic avoidance for faster trips." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 items-start group">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <item.icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-main)] transition-colors">{item.title}</h4>
                                            <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side: Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" />
                            <div className="glass rounded-[3rem] p-4 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group hover:neon-border transition-all duration-500">
                                <div className="aspect-[4/5] bg-black rounded-[2rem] relative overflow-hidden">
                                    {/* Map Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-[1px] opacity-60 transition-all duration-700"
                                        style={{ backgroundImage: `url("/images/${theme === 'dark' ? 'dark_map.png' : 'light_map.png'}")` }}
                                    />

                                    {/* Pulse Pin */}
                                    <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-75" />
                                        <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_rgba(124,58,237,1)] border-2 border-white/20 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full" />
                                        </div>
                                    </div>

                                    {/* Driver Card Overlay */}
                                    <div className="absolute bottom-6 left-6 right-6 p-5 glass rounded-2xl border border-[var(--border-color)] flex items-center justify-between shadow-2xl z-20 bg-[var(--bg-glass)] group-hover:translate-y-[-5px] transition-transform duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
                                                <div className="text-xl font-bold">JW</div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-0.5">Driver Arriving</p>
                                                <h4 className="font-bold text-[var(--text-main)] truncate max-w-[120px]">Divy Thakkar</h4>
                                                <p className="text-xs text-[var(--text-muted)] font-medium">Honda City • 4.98 ★</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mb-0.5">ETA</p>
                                            <p className="text-2xl font-black text-primary animate-pulse">3 MIN</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="section-padding overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
                <div className="text-center space-y-4 mb-20 px-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">User Experiences</h2>
                    <h3 className="text-5xl font-black text-[var(--text-main)] transition-colors">Loved by Commuters</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                    {[
                        { name: "Sarah Jenkins", role: "Daily Commuter", review: "The UI is breathtaking, but the speed of matching a driver is what keeps me coming back. CabZee is lightyears ahead of the competition." },
                        { name: "Marcus Tran", role: "Business Executive", review: "I rely on the Gold tier for all my airport runs. The vehicles are pristine and the chauffeurs are true professionals. Highly recommended." },
                        { name: "Elena Rossi", role: "Late Night Worker", review: "As someone who works late, the secure tracking and OTP verification gives me peace of mind. The futuristic map is a cool bonus." }
                    ].map((test, i) => (
                        <ThemeCard key={test.name} className="flex flex-col relative overflow-visible" padding="p-8">
                            <Quote className="absolute -top-4 -right-4 text-primary/20 drop-shadow-lg" size={80} />
                            <div className="flex items-center gap-1 mb-6 relative z-10">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className="text-yellow-500" fill="currentColor" />)}
                            </div>
                            <p className="text-[var(--text-main)] font-medium leading-relaxed mb-8 flex-1 italic relative z-10">"{test.review}"</p>
                            <div className="flex items-center gap-4 relative z-10 border-t border-[var(--border-color)] pt-6 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-primary/30">
                                    {test.name.charAt(0)}
                                </div>
                                <div>
                                    <h5 className="font-bold text-[var(--text-main)]">{test.name}</h5>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{test.role}</p>
                                </div>
                            </div>
                        </ThemeCard>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="section-padding">
                <div className="max-w-3xl mx-auto space-y-12 px-6">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-[var(--text-main)] mb-4 transition-colors">Common Questions</h2>
                        <p className="text-[var(--text-muted)]">Everything you need to know about CabZee.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Is CabZee available in my city?", a: "CabZee is currently expanding globally. Check our active region map in the app for details." },
                            { q: "How do I pay for my ride?", a: "We support all major credit cards, digital wallets, and even select cryptocurrencies for your convenience." },
                            { q: "Can I become a driver?", a: "Absolutely! Register through our driver portal and start earning with the industry's lowest commission rates." },
                            { q: "Is security guaranteed?", a: "Every ride is tracked via GPS, and our drivers undergo rigorous background checks for your safety." }
                        ].map((item, i) => (
                            <ThemeCard key={i} className="hover:neon-border cursor-pointer group" padding="p-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold text-[var(--text-main)] group-hover:text-primary transition-colors pr-8">{item.q}</h4>
                                    <ChevronDown className="text-[var(--text-muted)] group-hover:rotate-180 transition-transform duration-300 flex-shrink-0" />
                                </div>
                                <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
                            </ThemeCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <footer className="py-20 px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-primary via-[#6d28d9] to-secondary rounded-[3rem] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Ready to ride into <br /> the future?</h2>
                        <p className="text-white/80 max-w-xl mx-auto mt-6 text-lg font-medium">Join thousands of users who have already switched to the smarter way to commute.</p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-white text-primary font-black py-4 px-12 rounded-2xl hover:scale-105 transition-transform shadow-xl"
                            >
                                Get Started Free
                            </button>
                            <button className="text-white font-black text-lg hover:underline underline-offset-8">
                                Download Mobile App
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-[var(--text-muted)] font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">CZ</div>
                        <span className="text-[var(--text-main)] font-black text-lg">CabZee</span>
                    </div>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                        <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                    </div>
                    <p>© 2026 CabZee Operations. Built for the future.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Zap, 
  MapPin, 
  TrendingUp, 
  Star, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  History,
  DollarSign,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeCard from '../ui/ThemeCard';
import ThemeButton from '../ui/ThemeButton';

const DriverDashboard = () => {
    const [user, setUser] = useState(null);
    const [driverStatus, setDriverStatus] = useState('offline');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ todayEarnings: 0, totalRides: 0, rating: 5.0, onlineHours: 0 });
    const [rideRequests, setRideRequests] = useState([]);
    const [activeRide, setActiveRide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { navigate('/login'); return; }
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    if (parsed.role !== 'driver') { navigate('/login'); return; }
                    setUser(parsed);
                    setDriverStatus(parsed.driverStatus || 'offline');
                }

                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const [userResponse, earningsResponse, activeRideResponse, statsResponse] = await Promise.all([
                    fetch(`${apiUrl}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${apiUrl}/api/rides/earnings?period=today`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${apiUrl}/api/rides/active`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${apiUrl}/api/rides/stats`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const [userJson, earningsData, activeData, statsJson] = await Promise.all([
                    userResponse.json(),
                    earningsResponse.json(),
                    activeRideResponse.json(),
                    statsResponse.json()
                ]);

                if (userJson.success) {
                    setUser(userJson.data);
                    localStorage.setItem('user', JSON.stringify(userJson.data));
                    setDriverStatus(userJson.data.driverStatus || 'offline');
                    
                    const realEarnings = earningsData.success ? earningsData.data.earnings : null;
                    const realStats = statsJson.success ? statsJson.data : null;
                    
                    setStats({
                        todayEarnings: realEarnings ? realEarnings.today : (userJson.data.todayEarnings || 0),
                        totalRides: realStats ? realStats.totalTrips : (userJson.data.totalRides || 0),
                        rating: realStats ? realStats.rating : (userJson.data.rating || 5.0),
                        onlineHours: userJson.data.onlineHours || 0,
                    });
                }
                
                if (activeData && activeData.success && activeData.data) {
                    localStorage.setItem('activeRide', JSON.stringify(activeData.data));
                    setActiveRide(activeData.data);
                } else {
                    localStorage.removeItem('activeRide');
                    setActiveRide(null);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    useEffect(() => {
        let interval;
        if (driverStatus === 'online') {
            const fetchRequests = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rides/pending`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            setRideRequests(data.data || []);
                        } else {
                            setRideRequests([]);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching pending requests:', err);
                }
            };
            
            fetchRequests();
            interval = setInterval(fetchRequests, 10000); 
        } else {
            setRideRequests([]);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [driverStatus]);

    const toggleAvailability = async () => {
        const isVerified = user?.documents?.insurance?.verified
            && user?.documents?.license?.verified
            && user?.documents?.registration?.verified;
        if (!isVerified) {
            toast.error('Complete document verification first.');
            navigate('/driver/documents');
            return;
        }
        const newStatus = driverStatus === 'online' ? 'offline' : 'online';
        setDriverStatus(newStatus);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/me`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ driverStatus: newStatus }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.data));
                    toast.success(newStatus === 'online' ? 'Online Mode Activated' : 'System Offline');
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewRequest = (request) => {
        localStorage.setItem('selectedRideRequest', JSON.stringify(request));
        navigate('/accept-reject-ride');
    };

    if (loading && !user) {
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-[0.2em]">Syncing Terminal</p>
            </div>
          </div>
        );
    }

    const hourOfDay = new Date().getHours();
    const greeting = hourOfDay < 12 ? 'Good morning' : hourOfDay < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{greeting}</p>
                    <h1 className="text-4xl font-extrabold text-[var(--text-main)]">
                        Commander <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Fleet status: operational · System version 2.0</p>
                </div>

                {/* Modern Availability Toggle */}
                <ThemeCard padding="p-2" className="lg:w-80 border-none shadow-none bg-transparent">
                  <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between gap-4 ${driverStatus === 'online' ? 'glass border-green-500/30' : 'glass border-red-500/20'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${driverStatus === 'online' ? 'bg-green-500 shadow-lg shadow-green-500/30 text-white' : 'bg-red-500/10 text-red-500'}`}>
                            <Power size={20} className={driverStatus === 'online' ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <p className={`text-xs font-black uppercase tracking-widest ${driverStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                                {driverStatus === 'online' ? 'Online' : 'Offline'}
                            </p>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60">Visible to riders</p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleAvailability}
                        className={`relative w-14 h-8 rounded-full transition-all duration-500 ${driverStatus === 'online' ? 'bg-green-500' : 'bg-white/10'}`}
                    >
                        <motion.div 
                            animate={{ x: driverStatus === 'online' ? 24 : 4 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                    </button>
                  </div>
                </ThemeCard>
            </div>

            {/* Active Mission Alert */}
            <AnimatePresence>
                {activeRide && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="bg-gradient-to-br from-primary to-[#6d28d9] rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-primary/30 group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
                                    <MapPin size={40} className="animate-bounce" />
                                </div>
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70">Mission Critical</p>
                                    <h3 className="text-3xl font-black text-white">Active Deployment</h3>
                                    <p className="text-white/80 font-medium">Ongoing ride with {activeRide.rider?.name || 'Rider'} · Current: {activeRide.status}</p>
                                </div>
                                <ThemeButton 
                                    onClick={() => navigate('/active-ride')}
                                    className="bg-white text-primary hover:bg-white/90 hover:shadow-none py-5 px-10 shadow-2xl text-base"
                                >
                                    Resume Session <ArrowRight size={20} className="ml-2" />
                                </ThemeButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Verification Alert */}
            {!user?.vehicleInfo && (
                <ThemeCard className="bg-amber-500/10 border-amber-500/30 border-2">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center animate-pulse">
                            <AlertCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-amber-500">Action Required: Vehicle Registration</h4>
                            <p className="text-xs text-amber-500/70 font-medium">You must add your vehicle details before accepting ride requests.</p>
                        </div>
                        <ThemeButton variant="secondary" onClick={() => navigate('/vehicle-details')} className="border-amber-500/30 text-amber-500">Register</ThemeButton>
                    </div>
                </ThemeCard>
            )}

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ThemeCard className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Today Yield</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-main)]">₹{stats.todayEarnings}</h3>
                            <p className="text-[10px] font-bold text-green-500 uppercase mt-1">Earnings Today</p>
                        </div>
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </ThemeCard>

                <ThemeCard className="relative group overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Total Ops</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-main)]">{stats.totalRides}</h3>
                            <p className="text-[10px] font-bold text-primary uppercase mt-1">Trips Completed</p>
                        </div>
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </ThemeCard>

                <ThemeCard className="relative group overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Rating</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-main)]">{stats.rating}</h3>
                            <p className="text-[10px] font-bold text-yellow-500 uppercase mt-1">Avg Efficiency</p>
                        </div>
                        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
                            <Star size={20} />
                        </div>
                    </div>
                </ThemeCard>

                <ThemeCard className="relative group overflow-hidden border-primary/20 bg-primary/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Duty Hours</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-main)]">{stats.onlineHours}h</h3>
                            <p className="text-[10px] font-bold text-primary uppercase mt-1">Active Today</p>
                        </div>
                        <div className="p-3 bg-primary text-white rounded-xl shadow-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </ThemeCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Rapid Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Fleet Operations</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { title: 'Incoming Queue', icon: Zap, to: '/incoming-ride-request', color: 'text-primary' },
                            { title: 'Documentation', icon: FileText, to: '/driver/documents', color: 'text-blue-500' },
                            { title: 'Operations Log', icon: History, to: '/driver-ride-history', color: 'text-green-500' },
                            { title: 'Financial Analytics', icon: TrendingUp, to: '/driver-earnings', color: 'text-amber-500' },
                        ].map((action) => (
                            <ThemeCard 
                                key={action.to} 
                                hover 
                                className="cursor-pointer group flex items-center gap-4"
                                onClick={() => navigate(action.to)}
                            >
                                <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-all ${action.color}`}>
                                    <action.icon size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-[var(--text-main)] flex-1">{action.title}</h4>
                                <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                            </ThemeCard>
                        ))}
                    </div>
                </div>

                {/* Dispatch Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between ml-1">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Dispatch Network</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full glass border ${driverStatus === 'online' ? 'border-green-500/20' : 'border-red-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${driverStatus === 'online' ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${driverStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                                {driverStatus === 'online' ? 'Seeking Clients' : 'Signal Lost'}
                            </span>
                        </div>
                    </div>

                    <ThemeCard padding="p-0" className="overflow-hidden min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {driverStatus === 'online' ? (
                                rideRequests.length > 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="divide-y divide-[var(--border-color)]"
                                    >
                                        {rideRequests.map((req) => (
                                            <div key={req._id} className="p-6 hover:bg-primary/5 transition-all group flex flex-col md:flex-row gap-6">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                                        {req.rider?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-[var(--text-main)]">{req.rider?.name || 'Anonymous Rider'}</h4>
                                                            <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-md text-[10px] font-black text-yellow-500">
                                                                <Star size={10} fill="currentColor" /> {req.rider?.rating || '5.0'}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)]">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                                {req.pickupLocation?.address || 'Pickup Point'}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)]">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                                {req.dropLocation?.address || 'Destination'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Proposed Fare</p>
                                                        <p className="text-2xl font-black text-primary">₹{req.fare}</p>
                                                    </div>
                                                    <ThemeButton onClick={() => handleViewRequest(req)} className="px-8 shadow-none group-hover:shadow-primary/30">
                                                        Accept
                                                    </ThemeButton>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                                    >
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
                                                <Zap size={32} className="animate-pulse" />
                                            </div>
                                            <div className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-[2.5rem] animate-[spin_10s_linear_infinite]" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-[var(--text-main)]">Scanning for Signals</h4>
                                            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">Your position is being broadcast to nearby riders. Please wait for an incoming mission.</p>
                                        </div>
                                    </motion.div>
                                )
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center space-y-6 grayscale"
                                >
                                    <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 opacity-50">
                                        <Power size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-[var(--text-main)]">Console Offline</h4>
                                        <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">Toggle the terminal switch to 'Online' to start receiving dispatch requests.</p>
                                    </div>
                                    <ThemeButton onClick={toggleAvailability} className="bg-red-500 hover:bg-red-600 shadow-red-500/30">
                                        Go Online Now
                                    </ThemeButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </ThemeCard>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;

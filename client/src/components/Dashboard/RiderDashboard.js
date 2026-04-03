import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  History,
  CreditCard,
  User as UserIcon,
  TrendingUp,
  Star,
  Wallet,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeCard from '../ui/ThemeCard';
import ThemeButton from '../ui/ThemeButton';
import ChatBot from '../ChatBot/ChatBot';

const RiderDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalTrips: 0, completedTrips: 0, rating: 5.0 });
  const [activeRide, setActiveRide] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed.role !== 'rider') { navigate('/login'); return; }
          setUser(parsed);
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        const [userResponse, statsResponse, activeResponse, ridesResponse] = await Promise.all([
          fetch(`${apiUrl}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/rides/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/rides/active`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/rides/my-rides`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const [userJson, statsJson, activeJson, ridesJson] = await Promise.all([
          userResponse.json(),
          statsResponse.json(),
          activeResponse.json(),
          ridesResponse.json()
        ]);

        if (userJson.success) {
          setUser(userJson.data);
          localStorage.setItem('user', JSON.stringify(userJson.data));
        }

        if (statsJson.success) {
          setStats(statsJson.data);
        }

        if (activeJson.success) {
          setActiveRide(activeJson.data || null);
        }

        if (ridesJson.success) {
          const rides = Array.isArray(ridesJson.data) ? ridesJson.data : [];
          setRecentRides(rides.filter(r => r && r.status === 'completed').slice(0, 5));
        }
      } catch (err) {
        console.error('Rider dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-[0.2em]">Initializing Portal</p>
        </div>
      </div>
    );
  }

  const hourOfDay = new Date().getHours();
  const greeting = hourOfDay < 12 ? 'Good morning' : hourOfDay < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{greeting}</p>
          <h1 className="text-4xl font-extrabold text-[var(--text-main)]">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-medium">Ready for your next premium journey? Let's go.</p>
        </div>
        <ThemeButton
          onClick={() => navigate('/book-ride-live')}
          className="px-8 shadow-xl"
        >
          <MapPin size={18} />  Book a Ride

        </ThemeButton>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ThemeCard className="relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Total Trips</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-black text-[var(--text-main)] tracking-tight">{stats.totalTrips || '0'}</h3>
              <p className="text-[10px] font-bold text-green-500 uppercase mt-1">Life-time usage</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </ThemeCard>

        <ThemeCard className="relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">User Rating</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-black text-[var(--text-main)] tracking-tight">{stats.rating || '5.0'}</h3>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} fill={s <= Math.floor(stats.rating || 5) ? "#7c3aed" : "transparent"} className="text-primary" />
                ))}
              </div>
            </div>
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <Star size={24} />
            </div>
          </div>
        </ThemeCard>

        <ThemeCard className="relative overflow-hidden group border-primary/20 bg-primary/5">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Wallet Balance</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-black text-[var(--text-main)] tracking-tight">₹{(user?.walletBalance || 0).toFixed(2)}</h3>
              <button
                onClick={() => navigate('/payment-methods')}
                className="text-[10px] font-bold text-primary uppercase mt-1 hover:underline underline-offset-4"
              >
                Add Funds +
              </button>
            </div>
            <div className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/30">
              <Wallet size={24} />
            </div>
          </div>
        </ThemeCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Quick Access */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Quick Access</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: 'Ride History', desc: 'Manage past journeys', icon: History, to: '/ride-history', color: 'text-blue-500' },
              { title: 'Payments', desc: 'Manage your wallet', icon: CreditCard, to: '/payment-methods', color: 'text-green-500' },
              { title: 'Account Settings', desc: 'Profile & security', icon: UserIcon, to: '/user-profile', color: 'text-purple-500' },
            ].map((action, i) => (
              <ThemeCard
                key={action.to}
                hover
                padding="p-5"
                className="cursor-pointer group flex items-center gap-4"
                onClick={() => navigate(action.to)}
              >
                <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[var(--text-main)]">{action.title}</h4>
                  <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </ThemeCard>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Recent Activity</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Live</span>
            </div>
          </div>

          <ThemeCard padding="p-2" className="overflow-hidden">
            {activeRide && (
              <div className="m-2 p-5 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <Zap size={100} className="text-primary opacity-5 -mr-10 -mt-10 rotate-12" />
                </div>
                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
                    <MapPin size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Active Journey</p>
                    <h4 className="text-base font-black text-[var(--text-main)]">
                      En route to {activeRide.dropLocation?.address?.split(',')[0] || 'Destination'}
                    </h4>
                    <p className="text-xs font-medium text-[var(--text-muted)] opacity-70">Status: {activeRide.status}</p>
                  </div>
                </div>
                <ThemeButton
                  onClick={() => navigate(`/live-ride/${activeRide._id}`)}
                  className="w-full md:w-auto px-10 relative z-10"
                >
                  Track Live
                </ThemeButton>
              </div>
            )}

            <div className="divide-y divide-[var(--border-color)]">
              {recentRides.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl glass border-2 border-dashed border-[var(--border-color)] flex items-center justify-center mx-auto text-[var(--text-muted)] opacity-20">
                    <History size={32} />
                  </div>
                  <p className="text-sm font-bold text-[var(--text-muted)]">No recent trip activity recorded.</p>
                  <ThemeButton variant="ghost" onClick={() => navigate('/book-ride-live')}>Start riding today</ThemeButton>
                </div>
              ) : (
                recentRides.map((ride, i) => (
                  <div
                    key={ride._id}
                    className="p-5 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => navigate(`/live-ride/${ride._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--text-muted)] group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <MapPin size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                          {new Date(ride.completedAt || ride.createdAt).toLocaleDateString()}
                        </p>
                        <h4 className="text-sm font-bold text-[var(--text-main)] truncate max-w-[200px] md:max-w-md">
                          {ride.dropLocation?.address || 'Trip recorded'}
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[var(--text-main)]">₹{ride.fare}</p>
                      <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1 justify-end">
                        <CheckCircle2 size={10} /> {ride.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentRides.length > 0 && (
              <div className="p-4 bg-white/[0.02] text-center">
                <button
                  onClick={() => navigate('/ride-history')}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
                >
                  View All History
                </button>
              </div>
            )}
          </ThemeCard>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <ChatBot />
    </div>
  );
};

export default RiderDashboard;

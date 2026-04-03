import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Car, 
  Edit3, 
  ChevronLeft,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeCard from '../ui/ThemeCard';
import ThemeButton from '../ui/ThemeButton';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        } else {
          toast.error(data.message || 'Failed to fetch profile');
          if (response.status === 401) navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-black text-primary animate-pulse tracking-widest uppercase">Retrieving Identity</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
            <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl glass border border-[var(--border-color)] text-[var(--text-muted)] hover:text-primary transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Profile Terminal</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identity Management v2.0</p>
            </div>
        </div>
        <ThemeButton onClick={() => navigate('/edit-profile')} className="px-6">
            <Edit3 size={18} />
            Modify Data
        </ThemeButton>
      </motion.div>

      {/* Profile Card */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
            <ThemeCard className="flex flex-col items-center text-center py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 shadow-2xl relative group">
                        {user.profilePicture ? (
                            <img 
                                src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profilePicture}`} 
                                alt={user.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg border-4 border-[var(--bg-color)] hover:scale-110 transition-all">
                        <Camera size={16} />
                    </button>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[var(--text-main)]">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                            {user.role}
                        </span>
                        {user.isVerified ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                                <CheckCircle2 size={12} /> Verified
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                <AlertCircle size={12} /> Unverified
                            </span>
                        )}
                    </div>
                </div>
            </ThemeCard>

            <ThemeCard className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3">Security Level</h3>
                <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-green-500" />
                            <span className="text-xs font-bold text-[var(--text-main)]">Account Integrity</span>
                        </div>
                        <span className="text-[10px] font-black text-green-500 uppercase">Secure</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[var(--text-muted)]">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-bold">2FA Authorization</span>
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase hover:underline">Enable</button>
                    </div>
                </div>
            </ThemeCard>
        </div>

        {/* Details Area */}
        <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Personal Protocols</h3>
                <ThemeCard className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Legal Designation</p>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-[var(--border-color)]">
                            <UserIcon size={18} className="text-primary" />
                            <span className="text-sm font-bold text-[var(--text-main)]">{user.name}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Comm Link</p>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-[var(--border-color)]">
                            <Mail size={18} className="text-primary" />
                            <span className="text-sm font-bold text-[var(--text-main)] truncate">{user.email}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Signal Channel</p>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-[var(--border-color)]">
                            <Phone size={18} className="text-primary" />
                            <span className="text-sm font-bold text-[var(--text-main)]">{user.phone}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Functional Role</p>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-[var(--border-color)]">
                            <ShieldCheck size={18} className="text-primary" />
                            <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tighter">{user.role}</span>
                        </div>
                    </div>
                </ThemeCard>
            </div>

            {user.role === 'driver' && user.vehicleInfo && (
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Fleet Specification</h3>
                    <ThemeCard className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car size={150} className="-mr-10 -mt-10" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Asset Model</p>
                                <p className="text-base font-black text-[var(--text-main)]">{user.vehicleInfo.make} {user.vehicleInfo.model}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Signal ID</p>
                                <p className="text-base font-black text-primary uppercase">{user.vehicleInfo.licensePlate}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Category</p>
                                <p className="text-base font-black text-[var(--text-main)] uppercase tracking-tighter">{user.vehicleInfo.vehicleType}</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span className="text-xs font-bold text-[var(--text-muted)]">Operational Certification Verified</span>
                            </div>
                            <ThemeButton variant="ghost" onClick={() => navigate('/vehicle-details')} className="text-xs">Update Asset</ThemeButton>
                        </div>
                    </ThemeCard>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

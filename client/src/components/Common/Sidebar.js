import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Clock, 
  CreditCard, 
  User as UserIcon, 
  Bell, 
  TrendingUp, 
  Truck, 
  FileText, 
  Users, 
  ShieldCheck, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, closeSidebar, user }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const riderLinks = [
    { name: 'Dashboard',        path: '/rider',           icon: Home },
    { name: 'Book a Ride',      path: '/book-ride-live',  icon: MapPin },
    { name: 'My Trips',         path: '/ride-history',    icon: Clock },
    { name: 'Payments',         path: '/payment-methods', icon: CreditCard },
    { name: 'Profile',          path: '/user-profile',    icon: UserIcon },
  ];

  const driverLinks = [
    { name: 'Dashboard',         path: '/driver',                 icon: Home },
    { name: 'Incoming Requests', path: '/incoming-ride-request',  icon: Bell },
    { name: 'My Trips',          path: '/driver-ride-history',    icon: Clock },
    { name: 'Earnings',          path: '/driver-earnings',        icon: TrendingUp },
    { name: 'Vehicle Details',   path: '/vehicle-details',        icon: Truck },
    { name: 'Documents',         path: '/driver/documents',       icon: FileText },
    { name: 'Profile',           path: '/driver-profile',         icon: UserIcon },
  ];

  const adminLinks = [
    { name: 'Dashboard',           path: '/admin',               icon: Home },
    { name: 'All Users',           path: '/admin/users',         icon: Users },
    { name: 'Driver Verification', path: '/admin/verification',  icon: ShieldCheck },
    { name: 'System Settings',     path: '/admin/settings',      icon: Settings },
    { name: 'Reports',             path: '/admin/reports',       icon: BarChart3 },
  ];

  const links = user?.role === 'driver' ? driverLinks : user?.role === 'admin' ? adminLinks : riderLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 glass bg-black/40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 240 }}
<<<<<<< HEAD
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--bg-color)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
=======
        className={`fixed inset-y-0 left-0 z-50 glass border-r border-[var(--border-color)] flex flex-col transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
>>>>>>> 46447bd (feat: center tracking section, swap map/booking card positions)
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
               <span className="font-black text-sm">CZ</span>
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-tight text-[var(--text-main)]"
              >
                CabZee
              </motion.span>
            )}
          </div>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-primary/10 text-[var(--text-muted)] hover:text-primary transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && closeSidebar()}
                className={({ isActive }) => `
<<<<<<< HEAD
                  group relative flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:shadow-[0_0_15px_rgba(124,58,237,0.4)] shadow-sm' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--text-main)]/5 hover:text-[var(--text-main)]'}
=======
                  group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                    : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)]'}
>>>>>>> 46447bd (feat: center tracking section, swap map/booking card positions)
                `}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-bold tracking-tight">{link.name}</span>
                )}
                
                {/* Active Indicator */}
                <NavLink 
                    to={link.path}
<<<<<<< HEAD
                    className={({ isActive }) => isActive ? "absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" : "hidden"}
=======
                    className={({ isActive }) => isActive ? "absolute left-0 w-1 h-6 bg-primary rounded-r-full" : "hidden"}
>>>>>>> 46447bd (feat: center tracking section, swap map/booking card positions)
                />

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none shadow-xl z-50">
                    {link.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User / Bottom */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-[var(--border-color)] shrink-0">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="User" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                        <UserIcon size={20} className="text-primary" />
                    )}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[var(--text-main)] truncate">{user?.name}</p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{user?.role}</p>
                    </div>
                )}
            </div>
            
            <button 
                onClick={handleLogout}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm ${collapsed ? 'justify-center' : ''}`}
            >
                <LogOut size={20} className="shrink-0" />
                {!collapsed && <span>Sign Out</span>}
            </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

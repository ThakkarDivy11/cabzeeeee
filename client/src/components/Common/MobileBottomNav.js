import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Clock, 
  Wallet, 
  User as UserIcon, 
  Bell, 
  TrendingUp 
} from 'lucide-react';

const riderLinks = [
  { path: '/rider', label: 'Home', icon: Home },
  { path: '/book-ride-live', label: 'Book', icon: MapPin, accent: true },
  { path: '/ride-history', label: 'Trips', icon: Clock },
  { path: '/payment-methods', label: 'Wallet', icon: Wallet },
  { path: '/user-profile', label: 'Profile', icon: UserIcon },
];

const driverLinks = [
  { path: '/driver', label: 'Home', icon: Home },
  { path: '/incoming-ride-request', label: 'Requests', icon: Bell, accent: true },
  { path: '/driver-earnings', label: 'Earnings', icon: TrendingUp },
  { path: '/driver-ride-history', label: 'Trips', icon: Clock },
  { path: '/driver-profile', label: 'Profile', icon: UserIcon },
];

// Pages where the bottom nav should be hidden (full-screen map pages)
const HIDDEN_PATHS = ['/book-ride-live', '/live-ride'];

const MobileBottomNav = () => {
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  // Hide on full-screen map routes
  if (HIDDEN_PATHS.some(p => location.pathname.startsWith(p))) return null;

  const links = user?.role === 'driver' ? driverLinks : riderLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[var(--border-color)] transition-all duration-300"
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch justify-around h-16">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? 'text-primary'
                  : 'text-[var(--text-muted)] opacity-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative p-2 rounded-xl transition-all duration-300`}>
                    {link.accent && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary scale-75" />
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="leading-none">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

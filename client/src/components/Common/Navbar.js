import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Link, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar, user, title }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const roleLabel = user?.role === 'driver' ? 'Driver Portal' : user?.role === 'admin' ? 'Admin Console' : 'Passenger Terminal';

    return (
        <header className="h-20 fixed top-0 left-0 right-0 z-30 lg:pl-[240px] transition-all duration-300 bg-white/95 backdrop-blur-md dark:bg-[#05010A]/50 dark:backdrop-blur-xl border-b border-[var(--border-color)]">
            {/* Top accent glow line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent opacity-70" />

            <div className="h-full px-6 flex items-center justify-between">
                {/* Left: Hamburger + Title */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        aria-label="Open sidebar"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">
                            {roleLabel}
                        </p>
                        <h1 className="text-xl font-extrabold text-[var(--text-main)] leading-none">
                            {title || 'Dashboard'}
                        </h1>
                    </div>
                </div>

                {/* Right: Theme Toggle + User Info */}
                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl glass hover:neon-border transition-all duration-300 text-[var(--text-main)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-primary" />}
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-[var(--text-main)]">{user?.name}</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{user?.role}</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="relative group"
                            >
                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <div className="h-full w-full rounded-[14px] bg-[var(--bg-color)] flex items-center justify-center overflow-hidden">
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.profilePicture}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-black text-lg text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Status dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[var(--bg-color)] rounded-full shadow-sm" />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-3 w-56 glass p-2 rounded-2xl shadow-2xl z-20 border border-[var(--border-color)]"
                                        >
                                            <button
                                                onClick={() => { setDropdownOpen(false); navigate(user?.role === 'driver' ? '/driver-profile' : '/user-profile'); }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl hover:bg-primary/10 text-[var(--text-main)] transition-colors group"
                                            >
                                                <UserIcon size={18} className="text-[var(--text-muted)] group-hover:text-primary" />
                                                My Profile
                                            </button>
                                            <div className="my-1 h-px bg-[var(--border-color)] mx-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl hover:bg-red-500/10 text-red-500 transition-colors group"
                                            >
                                                <LogOut size={18} />
                                                Sign out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

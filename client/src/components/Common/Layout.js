import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const { theme } = useTheme();

    return (
        <div className={`dashboard-layout min-h-screen bg-[var(--bg-color)] transition-colors duration-300`}>
            <Sidebar
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
                user={user}
            />

            <Navbar
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                user={user}
            />

            {/* Main Content Area */}
            <main 
                className={`pt-20 pb-20 lg:pb-0 min-h-screen transition-all duration-300 lg:pl-[240px]`}
            >
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <Outlet />
                </div>
            </main>

            {/* Mobile bottom navigation — hidden on lg+ */}
            <MobileBottomNav />
        </div>
    );
};

export default Layout;

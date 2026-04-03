import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const MapContainer = ({
    center = [28.6139, 77.2090], // Default: New Delhi
    zoom = 13,
    children,
    className = "h-64 sm:h-80 md:h-[500px] w-full"
}) => {
    const { theme } = useTheme();

    return (
        <div className={`${className} glass rounded-[2rem] border border-[var(--border-color)] p-3 sm:p-4 shadow-2xl relative overflow-hidden group hover:neon-border transition-all duration-500`}>
            <div className="w-full h-full bg-black rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden flex flex-col">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-[1px] opacity-60 transition-all duration-700"
                    style={{ backgroundImage: `url("/images/${theme === 'dark' ? 'dark_map.png' : 'light_map.png'}")` }}
                />
                <div className="absolute inset-0 bg-[var(--bg-color)] opacity-40 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-color)] opacity-60" />

                {/* Pulse Pin */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-75" />
                    <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_rgba(124,58,237,1)] border-2 border-white/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                </div>

                {/* Children container logic */}
                <div className="hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MapContainer;

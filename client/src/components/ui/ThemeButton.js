import React from 'react';
import { motion } from 'framer-motion';

const ThemeButton = ({ children, onClick, variant = 'primary', className = '', disabledRef, type = 'button', disabled = false }) => {
    const baseStyles = "relative flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
    
    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5",
        secondary: "glass border border-[var(--border-color)] text-[var(--text-main)] hover:neon-border hover:bg-primary/5",
        danger: "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
        ghost: "text-[var(--text-muted)] hover:text-primary hover:bg-primary/10",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {/* Hover shine effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-[200%] transition-transform duration-700 group-hover:translate-x-[300%]" />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default ThemeButton;

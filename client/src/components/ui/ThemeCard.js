import React from 'react';
import { motion } from 'framer-motion';

const ThemeCard = ({ children, className = '', hover = true, padding = 'p-6' }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)' } : {}}
      className={`glass rounded-2xl border border-[var(--border-color)] ${padding} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ThemeCard;

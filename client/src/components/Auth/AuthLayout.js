import React from 'react';
import { Outlet } from 'react-router-dom';
import AetherBackground from '../ui/AetherBackground';

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-8 bg-black"
    >
      <AetherBackground />

      {/* Header Logo Section */}
      <div className="mb-8 flex flex-col items-center gap-3 z-10 w-full max-w-md">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: '#0B1B3D',
            boxShadow: '0 8px 24px rgba(11,27,61,0.20)',
          }}
        >
          <span
            className="text-2xl font-black leading-none text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            C
          </span>
        </div>
        <div className="text-center">
          <h1
            className="text-2xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            CabZee
          </h1>
          <p className="text-sm font-medium mt-0.5 text-slate-500">
            Fast, reliable rides at your fingertips
          </p>
        </div>
      </div>

      {/* Main Auth Card Container */}
      <div
        className="w-full max-w-md bg-white overflow-hidden relative z-10"
        style={{
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {/* Accent top bar — blue */}
        <div
          className="h-1.5 w-full"
          style={{
            background: '#0066FF',
          }}
        />
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </div>

      {/* Feature trust strip */}
      <div className="mt-8 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 z-10">
        {[
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            ),
            color: '#3B82F6', // Blue
            bgColor: '#EFF6FF',
            title: 'Lightning Fast',
            desc: 'Matched with a driver in minutes',
          },
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            ),
            color: '#10B981', // Green
            bgColor: '#ECFDF5',
            title: 'Safe & Secure',
            desc: 'Verified drivers, real-time tracking',
          },
          {
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            ),
            color: '#F5A623', // Yellow/Amber
            bgColor: '#FEF3C7',
            title: 'Affordable',
            desc: 'Transparent pricing, no hidden fees',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-5 text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
            style={{
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: item.bgColor }}
            >
              <svg className="w-5 h-5" fill="none" stroke={item.color} viewBox="0 0 24 24">
                {item.icon}
              </svg>
            </div>
            <h3 className="font-bold text-sm mb-1 text-slate-800">{item.title}</h3>
            <p className="text-[11px] leading-relaxed text-slate-500 max-w-[140px]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs font-semibold text-slate-400 z-10">
        © 2025 CabZee. All rights reserved.
      </p>

      {/* Decorative bottom blur */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(14,40,65,0.05) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default AuthLayout;

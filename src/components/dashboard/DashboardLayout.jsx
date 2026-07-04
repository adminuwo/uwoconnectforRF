'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';

const PlatformAssistant = dynamic(() => import('./PlatformAssistant'), { ssr: false });

const DashboardLayout = ({ children, role: initialRole }) => {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }
  }, []);

  // Avoid hydration mismatch by not rendering user-specific parts until mounted
  const displayName = user?.name || 'User';
  const displayRole = user?.role || initialRole || '';

  return (
    <div className="flex bg-[#fcfdfe] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar role={displayRole} />

      <main className="flex-1 ml-64 min-h-screen flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 bg-white/60 backdrop-blur-2xl border-b border-white/50 px-10 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.2)]" />
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight uppercase">
              {displayRole === 'ADMIN' ? 'Control Center' : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {mounted && (
              <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50/50 p-2 pr-6 rounded-full transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#16A34A] group-hover:to-[#059669] transition-all">{displayName}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">{displayRole}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-100 to-slate-50 text-slate-500 flex items-center justify-center font-black text-lg border border-slate-200 shadow-md group-hover:shadow-emerald-500/10 group-hover:border-[#059669]/30 group-hover:from-emerald-50 group-hover:to-emerald-50/20 group-hover:text-[#059669] transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{displayName[0].toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-10 flex-1 relative bg-gradient-to-br from-slate-50/50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.08] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#059669]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative">
            {children}
          </div>
        </div>
      </main>
      <PlatformAssistant />
    </div>
  );
};

export default DashboardLayout;


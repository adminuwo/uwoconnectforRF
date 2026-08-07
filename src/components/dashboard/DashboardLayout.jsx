'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { MessageCircle } from 'lucide-react';

const PlatformAssistant = dynamic(() => import('./PlatformAssistant'), { ssr: false });
const ProductTour       = dynamic(() => import('@/components/tour/ProductTour'), { ssr: false });
const TeamChatDrawer    = dynamic(() => import('@/components/team/TeamChatDrawer'), { ssr: false });
const GlobalIncomingCallListener = dynamic(() => import('./GlobalIncomingCallListener'), { ssr: false });

const PAGE_TITLES = {
  '/client': 'Dashboard',
  '/admin': 'Control Center',
  '/client/guides': 'Learning Center',
  '/client/channels': 'Channels',
  '/client/email': 'Email / Gmail',
  '/client/calls': 'Voice & Video Calls',
  '/client/youtube': 'YouTube',
  '/client/google-news': 'Google News',
  '/client/automations': 'Auto Replies',
  '/client/workflows': 'Workflows',
  '/client/crm': 'Leads (CRM)',
  '/client/inbox': 'Messages',
  '/client/campaigns': 'Broadcasts',
  '/client/knowledge': 'Knowledge Base',
  '/client/catalog': 'Catalog',
  '/client/orders': 'Orders',
  '/client/team': 'Team',
  '/client/reports': 'Work Reports',
  '/client/settings': 'Settings',
  '/client/support': 'Support',
};

const DashboardLayout = ({ children, role: initialRole }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    setMounted(true);
    window.scrollTo(0, 0);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Failed to parse user data');
        window.location.href = '/auth/login';
      }
    }
  }, []);

  const displayName = user?.name || 'User';
  const displayRole = user?.role || initialRole || '';
  const currentTitle = PAGE_TITLES[pathname] || (displayRole === 'ADMIN' ? 'Control Center' : 'Dashboard');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#fcfdfe] overflow-hidden">
      <div className="flex bg-[#fcfdfe] h-screen w-full font-sans selection:bg-emerald-100 selection:text-emerald-900 text-slate-900 flex-1 overflow-hidden">
        <Sidebar role={displayRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(v => !v)} />

        <main className="flex-1 dashboard-main h-screen flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-14 sm:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.2)]" />
              <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-tight uppercase">
                {currentTitle}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {mounted && (
                <>
                  <button
                    data-tour="header-team-chat"
                    onClick={() => setChatOpen(true)}
                    className="p-2 text-slate-500 hover:text-[#10B981] bg-slate-50 hover:bg-emerald-50 rounded-full transition-colors relative"
                    title="Team Chat"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer hover:bg-slate-50 p-1 sm:p-1.5 pr-2 sm:pr-4 rounded-full transition-all duration-300 border border-transparent hover:border-slate-100">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-black text-slate-900 leading-none mb-0.5 group-hover:text-[#059669] transition-all">{displayName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{displayRole}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-50 text-slate-600 flex items-center justify-center font-black text-sm border border-slate-200 shadow-xs group-hover:border-[#059669]/30 group-hover:text-[#059669] transition-all duration-300 relative overflow-hidden">
                      <span className="relative z-10">{displayName[0]?.toUpperCase() || 'U'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 min-h-0 relative bg-gradient-to-br from-slate-50/50 to-white overflow-y-auto flex flex-col custom-scrollbar">
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#059669]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative flex-1 flex flex-col min-h-0">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Fixed overlays */}
      <PlatformAssistant />
      <ProductTour />
      <TeamChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <GlobalIncomingCallListener />
    </div>
  );
};

export default DashboardLayout;

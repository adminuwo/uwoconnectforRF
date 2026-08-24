'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { MessageCircle, Building2, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const PlatformAssistant = dynamic(() => import('./PlatformAssistant'), { ssr: false });
const ProductTour = dynamic(() => import('@/components/tour/ProductTour'), { ssr: false });
const TeamChatDrawer = dynamic(() => import('@/components/team/TeamChatDrawer'), { ssr: false });
const GlobalIncomingCallListener = dynamic(() => import('./GlobalIncomingCallListener'), { ssr: false });

const PAGE_TITLES = {
  '/client': 'Dashboard',
  '/admin': 'Super Admin Control Center',
  '/admin/clients': 'Client Management Directory',
  '/admin/search': 'Global Platform Search',
  '/admin/team': 'Team & Projects',
  '/admin/channels': 'Channel & Integration Center',
  '/admin/inbox': 'Live Message & Chat Explorer',
  '/admin/ai': 'AI & Bot Control Center',
  '/admin/knowledge': 'Platform Knowledge Base',
  '/admin/emails': 'Email & Gmail Monitoring',
  '/admin/products': 'Platform Product Catalog',
  '/admin/sales': 'Sales & Transaction Control',
  '/admin/quotations': 'Platform Quotations',
  '/admin/proposals': 'Platform Proposals',
  '/admin/invoices': 'Financial & Invoices Control',
  '/admin/reports': 'Work Reports & Operational Stream',
  '/admin/approvals': 'Client & Member Approvals',
  '/admin/audit-logs': 'Platform Security Audit Trail',
  '/admin/settings': 'Global Platform Settings',
  '/admin/support': 'Super Admin Support Desk',
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
  '/client/quotations': 'Quotations',
  '/client/quotations/new': 'New Quotation',
  '/client/proposals': 'Proposals',
  '/client/proposals/templates': 'Proposal Templates',
  '/client/invoices': 'Invoices',
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
  const [impersonationData, setImpersonationData] = useState(null);
  const [clients, setClients] = useState([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const switcherRef = useRef(null);

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

    const impRaw = localStorage.getItem('impersonation_session');
    if (impRaw) {
      try {
        setImpersonationData(JSON.parse(impRaw));
      } catch (e) {
        console.warn('Failed to parse impersonation session');
      }
    }

    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExitImpersonation = () => {
    const backupToken = localStorage.getItem('admin_backup_token');
    const backupUser = localStorage.getItem('admin_backup_user');

    if (backupToken && backupUser) {
      localStorage.setItem('token', backupToken);
      localStorage.setItem('user', backupUser);
      localStorage.removeItem('admin_backup_token');
      localStorage.removeItem('admin_backup_user');
      localStorage.removeItem('impersonation_session');
      window.location.href = '/admin/clients';
    } else {
      localStorage.removeItem('impersonation_session');
      window.location.href = '/admin/clients';
    }
  };

  const handleToggleSwitcher = async () => {
    setSwitcherOpen(!switcherOpen);
    if (!switcherOpen && !clientsLoaded) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/clients-directory/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page_size: 100 }
        });
        setClients(res.data.results || []);
        setClientsLoaded(true);
      } catch (err) {
        console.error('Failed to fetch clients for switcher', err);
      }
    }
  };

  const handleOpenClientWorkspace = async (client) => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('user');

      localStorage.setItem('admin_backup_token', token);
      localStorage.setItem('admin_backup_user', currentUser);

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/impersonate/`,
        { client_id: client.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.access) {
        localStorage.setItem('token', res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('impersonation_session', JSON.stringify({
          client_id: client.id,
          client_name: client.company_name || client.client_name,
          admin_name: res.data.impersonating?.impersonator_name || 'Admin'
        }));

        window.location.href = '/client';
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open client workspace.');
    }
  };



  const displayName = user?.name || user?.username || 'User';
  const displayRole = user?.role || initialRole || '';
  const currentTitle = PAGE_TITLES[pathname] || (displayRole === 'ADMIN' ? 'Control Center' : 'Dashboard');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#fcfdfe] overflow-hidden">
      {/* ── Super Admin Impersonation Top Banner ── */}
      {impersonationData && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black">Admin Mode</span>
            <span>
              Currently viewing client workspace: <strong>{impersonationData.client_name}</strong> (Client ID: #{impersonationData.client_id})
            </span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="bg-white text-amber-900 hover:bg-amber-50 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            Exit Workspace & Return to Admin &rarr;
          </button>
        </div>
      )}

      <div className="flex bg-[#fcfdfe] h-full w-full font-sans selection:bg-emerald-100 selection:text-emerald-900 text-slate-900 flex-1 overflow-hidden">
        <Sidebar role={displayRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(v => !v)} />

        <main className="flex-1 dashboard-main h-full flex flex-col min-w-0 overflow-hidden">
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
                  {displayRole === 'ADMIN' && !impersonationData && (
                    <div className="relative" ref={switcherRef}>
                      <button
                        onClick={handleToggleSwitcher}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#059669] rounded-xl border border-slate-200 hover:border-emerald-200 transition-all text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <Building2 size={15} />
                        <span className="hidden sm:inline">Switch Workspace</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${switcherOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {switcherOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input
                                type="text"
                                placeholder="Find client..."
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all"
                              />
                            </div>
                          </div>
                          <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
                            {clients.filter(c => c.company_name.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 ? (
                              <div className="py-4 text-center text-xs text-slate-400 font-medium">No clients found</div>
                            ) : (
                              clients.filter(c => c.company_name.toLowerCase().includes(clientSearch.toLowerCase())).map(client => (
                                <button
                                  key={client.id}
                                  onClick={() => {
                                    setSwitcherOpen(false);
                                    handleOpenClientWorkspace(client);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between group transition-colors cursor-pointer mb-0.5"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition-colors">{client.company_name}</p>
                                    <p className="text-[10px] text-slate-400">{client.email}</p>
                                  </div>
                                  <ChevronDown size={14} className="text-slate-300 -rotate-90 group-hover:text-[#059669] transition-colors" />
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
      {mounted && (
        <>
          <PlatformAssistant />
          <ProductTour />
          <TeamChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          <GlobalIncomingCallListener />
        </>
      )}
    </div>
  );
};

export default DashboardLayout;


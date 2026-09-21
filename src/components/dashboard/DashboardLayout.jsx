'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { MessageCircle, Building2, ChevronDown, Search, Menu, Crown, Wallet } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const ProductTour = dynamic(() => import('@/components/tour/ProductTour'), { ssr: false });
const TeamChatDrawer = dynamic(() => import('@/components/team/TeamChatDrawer'), { ssr: false });
const GlobalIncomingCallListener = dynamic(() => import('./GlobalIncomingCallListener'), { ssr: false });
const AddMoneyModal = dynamic(() => import('@/components/billing/AddMoneyModal'), { ssr: false });

const PAGE_TITLES = {
  '/client': 'Dashboard',
  '/client/agency': 'Agency & Reseller Command Hub',
  '/admin': 'Control Center',
  '/admin/clients': 'Client Management Directory',
  '/admin/platform-overview': 'Client Platform Overview',
  '/admin/installations': 'Installation & Uninstallation Analytics',
  '/admin/whitelabel': 'White-Label & Reseller Command Center',
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
  '/client/plans': 'Plans & Subscriptions',
  '/client/support': 'Support',
};

import UpgradeModal from '@/components/common/UpgradeModal';
import { useEntitlement } from '@/context/EntitlementContext';
import { Lock, Zap } from 'lucide-react';

const PLAN_RANKS = { starter: 1, growth: 2, advanced: 3 };

const FEATURE_REQUIRED_PLAN = {
  '/client/workflows': 'Starter',
  '/client/proposals': 'Starter',
  '/client/invoices': 'Starter',
  '/client/campaigns': 'Starter',
  '/client/catalog': 'Starter',
  '/client/payments': 'Starter',
  '/client/orders': 'Starter',
  '/client/email': 'Starter',
  '/client/gmail': 'Starter',
  '/client/youtube': 'Starter',
  '/client/google-news': 'Starter',
  '/client/calls': 'Starter',
  '/client/knowledge': 'Starter',
  '/client/team': 'Starter',
  '/client/reports': 'Starter',
};

const ROUTE_FEATURE_KEYS = {
  '/client/workflows': 'feature_workflow',
  '/client/proposals': 'feature_proposal',
  '/client/invoices': 'feature_invoice',
  '/client/campaigns': 'feature_broadcast',
  '/client/catalog': 'feature_catalog',
  '/client/payments': 'feature_payment',
  '/client/orders': 'feature_order',
  '/client/email': 'connector_outlook',
  '/client/gmail': 'connector_gmail',
  '/client/youtube': 'channel_youtube',
  '/client/google-news': 'connector_google_news',
  '/client/calls': 'feature_voice_video_call',
  '/client/knowledge': 'feature_knowledge_base',
  '/client/team': 'feature_team_dashboard',
  '/client/reports': 'feature_reports',
};

const getPlanRank = (planObj, rawUserPlan = '') => {
  const str = (
    planObj?.slug || 
    planObj?.name || 
    planObj?.id || 
    rawUserPlan || 
    ''
  ).toLowerCase().trim();

  if (!str || str.includes('free') || str.includes('none') || str.includes('no active plan')) return 0;
  if (str.includes('advanced') || str.includes('enterprise') || str.includes('power') || str.includes('agency')) return 3;
  if (str.includes('growth') || str.includes('pro')) return 2;
  if (str.includes('starter') || str.includes('basic')) return 1;
  return 0;
};

const DashboardLayout = ({ children, role: initialRole }) => {
  const pathname = usePathname();
  const { entitlements } = useEntitlement();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  const userObj = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const rawUserPlan = entitlements?.plan?.name || user?.client?.plan || user?.plan || userObj?.client?.plan || userObj?.plan || '';
  const activePlanRank = getPlanRank(entitlements?.plan, rawUserPlan);

  const reqPlanName = FEATURE_REQUIRED_PLAN[pathname];
  let reqPlanRank = 1;
  if (reqPlanName) {
    const low = reqPlanName.toLowerCase();
    if (low.includes('advanced') || low.includes('enterprise')) reqPlanRank = 3;
    else if (low.includes('growth') || low.includes('pro')) reqPlanRank = 2;
  }

  const routeFeatKey = ROUTE_FEATURE_KEYS[pathname];
  let isDynamicRemoved = false;
  let isDynamicAvailable = false;
  if (routeFeatKey && entitlements) {
    const baseKey = String(routeFeatKey).toLowerCase().trim();
    const cleanKey = baseKey.replace(/^feature_/, '').replace(/^connector_/, '').replace(/^channel_/, '');
    const keyVariants = [
      baseKey,
      cleanKey,
      `feature_${cleanKey}`,
      `connector_${cleanKey}`,
      `channel_${cleanKey}`
    ];

    const customRemoved = (entitlements?.custom_removed || []).map(k => String(k).toLowerCase());
    if (keyVariants.some(v => customRemoved.includes(v))) {
      isDynamicRemoved = true;
    }

    for (const variant of keyVariants) {
      const featStatus = entitlements?.features?.[variant]?.status || 
                         entitlements?.connectors?.[variant]?.status || 
                         entitlements?.channels?.[variant]?.status;
      if (featStatus === 'UPGRADE_REQUIRED' || featStatus === 'LOCKED') {
        isDynamicRemoved = true;
      }
      if (featStatus === 'AVAILABLE' || featStatus === 'CONNECTED' || featStatus === 'ENABLED') {
        isDynamicAvailable = true;
      }
    }

    const customAdded = (entitlements?.custom_added || []).map(k => String(k).toLowerCase());
    if (keyVariants.some(v => customAdded.includes(v))) {
      isDynamicAvailable = true;
    }
  }

  const isPageLocked = mounted && initialRole !== 'ADMIN' && reqPlanName && (isDynamicRemoved || (!isDynamicAvailable && activePlanRank < reqPlanRank));
  const [profileLogo, setProfileLogo] = useState('');
  const [impersonationData, setImpersonationData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const switcherRef = useRef(null);

  // Responsive sidebar: open by default on desktop (>=1024px), closed on mobile (<1024px)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);

      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          // On desktop keep open
        } else {
          setSidebarOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Auto-close sidebar on mobile whenever page changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    setMounted(true);
    window.scrollTo(0, 0);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const storedLogo = localStorage.getItem('client_company_logo');
    if (storedLogo) {
      setProfileLogo(storedLogo);
    }

    if (!token || !storedUser) {
      window.location.href = '/auth/login';
      return;
    }

    if (storedUser) {
      try {
        let parsed = JSON.parse(storedUser);

        // If visiting an admin route with a non-admin token, auto-restore admin backup if available
        if (pathname.startsWith('/admin') || initialRole === 'ADMIN') {
          if (parsed.role !== 'ADMIN') {
            const backupToken = localStorage.getItem('admin_backup_token');
            const backupUser = localStorage.getItem('admin_backup_user');
            if (backupToken && backupUser) {
              localStorage.setItem('token', backupToken);
              localStorage.setItem('uwo_token', backupToken);
              localStorage.setItem('user', backupUser);
              localStorage.removeItem('admin_backup_token');
              localStorage.removeItem('admin_backup_user');
              localStorage.removeItem('impersonation_session');
              parsed = JSON.parse(backupUser);
              window.location.reload();
              return;
            } else {
              // Non-admin user trying to access admin route without backup -> redirect to client
              window.location.href = parsed.is_agency || parsed.client?.is_agency ? '/client/agency' : '/client';
              return;
            }
          }
        }

        setUser(parsed);
        if (!storedLogo && (parsed?.company_logo_url || parsed?.client?.company_logo_url || parsed?.profile_picture_url)) {
          const l = parsed.company_logo_url || parsed.client?.company_logo_url || parsed.profile_picture_url;
          setProfileLogo(l);
          localStorage.setItem('client_company_logo', l);
        }
      } catch (e) {
        console.warn('Failed to parse user data');
        window.location.href = '/auth/login';
      }
    }

    // Fetch latest profile to keep logo in sync
    const fetchLatestProfile = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) return;
        const res = await axios.get(`${API_BASE_URL}/api/profile/`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const cData = res.data?.client && typeof res.data.client === 'object' ? res.data.client : (typeof res.data === 'object' ? res.data : {});
        const uData = res.data?.user && typeof res.data.user === 'object' ? res.data.user : {};
        const activePlan = res.data?.plan || cData?.plan || uData?.plan || 'Starter';

        const logo = cData?.company_logo_url || uData?.profile_picture_url || res.data?.company_logo_url || '';
        if (logo) {
          setProfileLogo(logo);
          localStorage.setItem('client_company_logo', logo);
        } else {
          setProfileLogo('');
          localStorage.removeItem('client_company_logo');
        }

        // Synchronize updated user & client profile into localStorage
        const existingStored = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...existingStored,
          ...uData,
          name: uData.name || uData.first_name || existingStored.name,
          plan: activePlan,
          client_plan: activePlan,
          client: {
            ...(existingStored.client || {}),
            ...cData,
            plan: activePlan
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: updatedUser }));

        // Fetch wallet balance
        try {
          const wRes = await axios.get(`${API_BASE_URL}/api/wallet/dashboard`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (wRes.data && wRes.data.wallet_balance_inr !== undefined) {
            setWalletBalance(wRes.data.wallet_balance_inr);
          }
        } catch (wErr) {}

      } catch (err) {
        // Silently handle
      }
    };
    fetchLatestProfile();

    const handleProfileUpdate = (e) => {
      if (e?.detail?.company_logo_url !== undefined) {
        setProfileLogo(e.detail.company_logo_url || '');
      } else {
        const sLogo = localStorage.getItem('client_company_logo');
        setProfileLogo(sLogo || '');
      }
      const fresh = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const detailUser = (e?.detail && typeof e.detail === 'object') ? (e.detail.user || e.detail) : {};
      const mergedUser = { ...fresh, ...detailUser };
      if (detailUser.name) mergedUser.name = detailUser.name;
      setUser(prev => ({ ...(prev || {}), ...mergedUser }));
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const handleExitImpersonation = () => {
    const backupToken = localStorage.getItem('admin_backup_token');
    const backupUser = localStorage.getItem('admin_backup_user');

    if (backupToken && backupUser) {
      localStorage.setItem('token', backupToken);
      localStorage.setItem('uwo_token', backupToken);
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
        const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
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
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
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
        localStorage.setItem('uwo_token', res.data.access);
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



  const isAgencyUser = mounted && Boolean(
    rawUserPlan?.toUpperCase() === 'AGENCY' || 
    userObj?.client?.is_agency || 
    userObj?.client?.white_label_domain ||
    user?.client?.plan === 'AGENCY' ||
    user?.client?.white_label_domain
  );

  const displayName = user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || 'User'));
  const displayRole = mounted 
    ? (user?.role === 'ADMIN' ? 'SUPER ADMIN' : isAgencyUser ? 'AGENCY ADMIN' : (user?.role || initialRole || 'CLIENT'))
    : (initialRole === 'ADMIN' ? 'SUPER ADMIN' : 'CLIENT');
  const isAdminUser = Boolean(
    initialRole === 'ADMIN' ||
    displayRole === 'SUPER ADMIN' ||
    user?.role === 'ADMIN' ||
    userObj?.role === 'ADMIN' ||
    (typeof pathname === 'string' && pathname.startsWith('/admin'))
  );
  const currentTitle = PAGE_TITLES[pathname] || (initialRole === 'ADMIN' ? 'Control Center' : 'Dashboard');

  return (
    <div 
      className="flex flex-col h-screen w-screen bg-[#fcfdfe] overflow-hidden dashboard-font-times font-serif"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
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

      <div 
        className="flex bg-[#fcfdfe] h-full w-full dashboard-font-times font-serif selection:bg-emerald-100 selection:text-emerald-900 text-slate-900 flex-1 overflow-hidden"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <Sidebar role={displayRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(v => !v)} />

        <main className="flex-1 dashboard-main h-full flex flex-col min-w-0 overflow-hidden dashboard-font-times font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          {/* Header */}
          <header className="h-14 sm:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-2.5 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-xs">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 mr-2">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(prev => !prev)}
                className="lg:hidden p-1.5 sm:p-2 -ml-1 text-slate-600 hover:text-[#059669] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Toggle navigation menu"
              >
                <Menu size={20} />
              </button>
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.2)] hidden sm:block shrink-0" />
              <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-tight uppercase truncate max-w-[110px] xs:max-w-[170px] sm:max-w-none">
                {currentTitle}
              </h1>

              {/* Workspace Indicator Badge */}
              {user?.client?.business_name && displayRole !== 'ADMIN' && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-emerald-900 text-xs font-black max-w-[220px] shadow-2xs" title={`Workspace: ${user.client.business_name}`}>
                  <Building2 size={13} className="text-[#059669] shrink-0" />
                  <span className="truncate">{user.client.business_name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
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

                  {/* Prepaid Usage Wallet Widget near Profile */}
                  {isAdminUser ? (
                    <Link
                      href="/admin/billing"
                      className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 rounded-xl border border-emerald-200/80 transition-all text-xs font-bold shadow-xs hover:shadow-sm cursor-pointer shrink-0"
                      title="Master Wallet & Rate Management"
                    >
                      <Wallet size={14} className="text-[#059669] shrink-0" />
                      <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs">
                        {walletBalance !== null ? (
                          <>
                            ₹{Math.floor(walletBalance).toLocaleString('en-IN')}
                            <span className="hidden sm:inline">
                              {(walletBalance % 1).toFixed(2).substring(1)}
                            </span>
                          </>
                        ) : 'Wallets'}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-md ml-0.5">Manage</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsAddMoneyOpen(true)}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 rounded-xl border border-emerald-200/80 transition-all text-xs font-bold shadow-xs hover:shadow-sm cursor-pointer shrink-0"
                      title="Click to Add Money / Recharge Wallet"
                    >
                      <Wallet size={14} className="text-[#059669] shrink-0" />
                      <span className="font-extrabold text-slate-900 text-[11px] sm:text-xs">
                        {walletBalance !== null ? (
                          <>
                            ₹{Math.floor(walletBalance).toLocaleString('en-IN')}
                            <span className="hidden sm:inline">
                              {(walletBalance % 1).toFixed(2).substring(1)}
                            </span>
                          </>
                        ) : 'Wallet'}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-md ml-0.5">+ Topup</span>
                    </button>
                  )}

                  <Link
                    href={isAdminUser ? '/admin/plans' : '/client/plans'}
                    className="hidden xs:flex p-1.5 sm:p-2 text-slate-500 hover:text-amber-500 bg-slate-50 hover:bg-amber-50 rounded-full transition-colors relative shrink-0"
                    title="Plans & Subscriptions"
                  >
                    <Crown size={17} />
                  </Link>

                  <button
                    data-tour="header-team-chat"
                    onClick={() => setChatOpen(true)}
                    className="p-1.5 sm:p-2 text-slate-500 hover:text-[#10B981] bg-slate-50 hover:bg-emerald-50 rounded-full transition-colors relative shrink-0 cursor-pointer"
                    title="Team Chat"
                  >
                    <MessageCircle size={17} />
                  </button>
                  <Link
                    href={isAdminUser ? '/admin/settings' : '/client/settings'}
                    className="flex items-center gap-1.5 sm:gap-3 group cursor-pointer hover:bg-slate-50 p-0.5 sm:p-1.5 pr-1 sm:pr-4 rounded-full transition-all duration-300 border border-transparent hover:border-slate-100 shrink-0"
                    title="Account Settings"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-black text-slate-900 leading-none mb-0.5 group-hover:text-[#059669] transition-all">{displayName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{displayRole}</p>
                    </div>
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-50 text-slate-600 flex items-center justify-center font-black text-xs sm:text-sm border border-slate-200 shadow-xs group-hover:border-[#059669]/30 group-hover:text-[#059669] transition-all duration-300 relative overflow-hidden shrink-0">
                      {profileLogo ? (
                        <img
                          src={profileLogo}
                          alt={displayName}
                          className="w-full h-full object-contain p-0.5 rounded-full bg-white"
                          onError={() => setProfileLogo('')}
                        />
                      ) : (
                        <span className="relative z-10">{displayName[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                  </Link>
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
              {isPageLocked ? (
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto my-auto bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                    <Lock size={32} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] uppercase tracking-wider">
                    Plan Upgrade Required
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentTitle} is Locked
                  </h2>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    This feature is available on the <strong className="text-slate-800">{reqPlanName} Plan</strong> or higher. Your workspace is currently on the <strong className="text-[#059669]">{entitlements?.plan?.name || 'Starter'} Plan</strong>.
                  </p>
                  <Link
                    href="/client/plans"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap size={15} /> Upgrade to {reqPlanName} Plan
                  </Link>
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Fixed overlays */}
      {mounted && (
        <>
          <ProductTour />
          <TeamChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          <GlobalIncomingCallListener />
          <UpgradeModal />
          {/* Global Add Money Razorpay Modal */}
          {isAddMoneyOpen && (
            <AddMoneyModal
              isOpen={isAddMoneyOpen}
              onClose={() => setIsAddMoneyOpen(false)}
              onSuccess={() => {
                // Refresh wallet balance
                const token = localStorage.getItem('token');
                if (token) {
                  axios.get(`${API_BASE_URL}/api/wallet/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                  }).then(wRes => {
                    if (wRes.data && wRes.data.wallet_balance_inr !== undefined) {
                      setWalletBalance(wRes.data.wallet_balance_inr);
                    }
                  }).catch(() => {});
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardLayout;



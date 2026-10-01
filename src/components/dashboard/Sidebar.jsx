'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  Zap,
  GitBranch,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scale,
  Brain,
  Users,
  Megaphone,
  LifeBuoy,
  ShoppingBag,
  Receipt,
  MessagesSquare,
  FileCheck,
  Newspaper,
  BookOpen,
  Mail,
  PhoneCall,
  CreditCard,
  FileText,
  Bot,
  Layers,
  X,
  Lock,
  Globe,
  Building2,
  Wallet,
  LayoutTemplate,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEntitlement } from '@/context/EntitlementContext';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';

// Tour ID → sidebar link name mapping
const TOUR_IDS = {
  'Dashboard': 'sidebar-dashboard',
  'Channels': 'sidebar-channels',
  'YouTube': 'sidebar-youtube',
  'Google News': 'sidebar-google-news',
  'Auto Replies': 'sidebar-automations',
  'Workflows': 'sidebar-workflows',
  'Leads (CRM)': 'sidebar-crm',
  'Messages': 'sidebar-inbox',
  'Broadcasts': 'sidebar-campaigns',
  'Knowledge Base': 'sidebar-knowledge',
  'Catalog': 'sidebar-catalog',
  'Payments': 'sidebar-payments',
  'Orders': 'sidebar-orders',
  'Quotations': 'sidebar-quotations',
  'Proposals': 'sidebar-proposals',
  'Invoices': 'sidebar-invoices',
  'Team': 'sidebar-team',
  'Work Reports': 'sidebar-reports',
  'Settings': 'sidebar-settings',
  'Plans': 'sidebar-plans',
  'Support': 'sidebar-support',
};

const PLAN_RANKS = { starter: 1, growth: 2, advanced: 3 };

const YoutubeIcon = ({ size = 16, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107A30.213 30.213 0 0 0 0 12c0 1.944.15 3.89.49 5.837a3.003 3.003 0 0 0 2.11 2.107c1.86.51 9.388.51 9.388.51s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.107A30.213 30.213 0 0 0 24 12a30.213 30.213 0 0 0-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TeamsIcon = ({ size = 16, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.625 7.875a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25zm0-1.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25zM15.75 9a.75.75 0 0 1 .75.75v4.5a4.5 4.5 0 0 1-4.5 4.5h-.75v2.25a.75.75 0 0 1-1.5 0V18.75H9a4.5 4.5 0 0 1-4.5-4.5v-4.5A.75.75 0 0 1 5.25 9h10.5zM9.375 5.625a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25zm0-1.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25z" />
    <path d="M17.25 9.75h1.5a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-1.5v-1.5H18.75a1.5 1.5 0 0 0 1.5-1.5v-2.25a1.5 1.5 0 0 0-1.5-1.5h-1.5V9.75z" />
  </svg>
);

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

/**
 * Sidebar
 * isOpen = true  → full expanded sidebar (icons + labels, 220 px)
 * isOpen = false → collapsed icon-rail (icons only, 56 px)
 */
const Sidebar = ({ role, isOpen, onClose, onToggle }) => {
  const handleToggle = onToggle || onClose;
  const pathname = usePathname();
  const { entitlements, openUpgradeModal } = useEntitlement();
  const { brand } = useBrand();
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userObj, setUserObj] = useState({});

  const loadUser = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setUserObj(u);
    } catch (e) {
      setUserObj({});
    }
  };

  useEffect(() => {
    setMounted(true);
    loadUser();

    const handleUpdate = () => {
      loadUser();
    };

    window.addEventListener('profileUpdated', handleUpdate);
    window.addEventListener('user_profile_updated', handleUpdate);
    window.addEventListener('brandUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleUpdate);
      window.removeEventListener('user_profile_updated', handleUpdate);
      window.removeEventListener('brandUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const rawUserPlan = entitlements?.plan?.name || userObj?.client?.plan || userObj?.plan || '';
  const activePlanRank = getPlanRank(entitlements?.plan, rawUserPlan);

  const isFeatureUnlocked = (link) => {
    if (role === 'ADMIN') return true;
    if (!mounted) return false;
    if (!link.requiredPlan) return true;

    const baseKey = (link.featureKey || link.name || '').toLowerCase().trim();
    const cleanKey = baseKey.replace(/^feature_/, '').replace(/^connector_/, '').replace(/\s+/g, '_');
    const keyVariants = [
      baseKey,
      cleanKey,
      `feature_${cleanKey}`,
      `connector_${cleanKey}`,
      link.name?.toLowerCase().replace(/\s+/g, '_')
    ].filter(Boolean);

    // 1. Check explicit Admin REMOVE lock override
    if (entitlements) {
      const customRemoved = (entitlements?.custom_removed || []).map(k => String(k).toLowerCase());
      if (keyVariants.some(v => customRemoved.includes(v))) {
        return false;
      }
    }

    // 2. Check explicit Admin ADD unlock override
    if (entitlements) {
      const customAdded = (entitlements?.custom_added || []).map(k => String(k).toLowerCase());
      if (keyVariants.some(v => customAdded.includes(v))) {
        return true;
      }
    }

    // Advanced, Enterprise, or Agency plans have all features unlocked by default (unless explicitly removed above)
    if (activePlanRank >= 3 || isAgencyUser) {
      return true;
    }

    // 3. Check evaluated status from backend (accounts for plan config + overrides)
    if (entitlements) {
      for (const variant of keyVariants) {
        const featStatus = entitlements?.features?.[variant]?.status || 
                           entitlements?.connectors?.[variant]?.status ||
                           entitlements?.channels?.[variant]?.status;
        if (featStatus === 'UPGRADE_REQUIRED' || featStatus === 'LOCKED') {
          return false;
        }
        if (featStatus === 'AVAILABLE' || featStatus === 'CONNECTED' || featStatus === 'ENABLED') {
          return true;
        }
      }
    }

    // 4. Fallback to base plan rank check
    const reqPlan = (link.requiredPlan || 'Starter').toLowerCase();
    let reqRank = 1;
    if (reqPlan.includes('advanced') || reqPlan.includes('enterprise')) reqRank = 3;
    else if (reqPlan.includes('growth') || reqPlan.includes('pro')) reqRank = 2;

    return activePlanRank >= reqRank;
  };

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Legal Policies', href: '/admin/settings/legal', icon: Scale },
    { name: 'White-Label Hub', href: '/admin/whitelabel', icon: Globe },
    { name: 'Team', href: '/admin/team', icon: ShieldCheck },
    { name: 'Channels', href: '/admin/channels', icon: Link2 },
    { name: 'Plans', href: '/admin/plans', icon: Layers },
    { name: 'Live Messages', href: '/admin/inbox', icon: MessageSquare },
    { name: 'Knowledge Base', href: '/admin/knowledge', icon: Brain },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Sales & Orders', href: '/admin/sales', icon: CreditCard },
    { name: 'Wallet & Rates', href: '/admin/billing', icon: Wallet },
    { name: 'Quotations', href: '/admin/quotations', icon: FileCheck },
    { name: 'Proposals', href: '/admin/proposals', icon: FileText },
    { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
    { name: 'Work Reports', href: '/admin/reports', icon: FileCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  ];

  const isAgencyUser = Boolean(
    rawUserPlan?.toUpperCase() === 'AGENCY' || 
    userObj?.client?.is_agency || 
    userObj?.client?.white_label_domain || 
    brand?.is_whitelabel
  );

  const clientLinks = [
    ...(isAgencyUser ? [
      { name: 'Agency Command Hub', href: '/client/agency', icon: Building2, requiredPlan: 'Starter' }
    ] : []),
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Learning Center', href: '/client/guides', icon: BookOpen },
    { name: 'Channels', href: '/client/channels', icon: Link2, requiredPlan: 'Starter', featureKey: 'feature_channels' },
    // { name: 'Outlook', href: '/client/email', icon: Mail, requiredPlan: 'Starter', featureKey: 'connector_outlook' },
    // { name: 'Gmail', href: '/client/gmail', icon: Mail, requiredPlan: 'Starter', featureKey: 'connector_gmail' },
    { name: 'Voice & Video Calls', href: '/client/calls', icon: PhoneCall, requiredPlan: 'Starter', featureKey: 'feature_voice_video_call' },
    // { name: 'YouTube', href: '/client/youtube', icon: YoutubeIcon, requiredPlan: 'Starter', featureKey: 'channel_youtube' },
    { name: 'Google News', href: '/client/google-news', icon: Newspaper, requiredPlan: 'Starter', featureKey: 'connector_google_news' },
    { name: 'Auto Replies', href: '/client/automations', icon: Zap, requiredPlan: 'Starter', featureKey: 'feature_autoreply' },
    { name: 'Workflows', href: '/client/workflows', icon: GitBranch, requiredPlan: 'Starter', featureKey: 'feature_workflow' },
    { name: 'Leads (CRM)', href: '/client/crm', icon: Users, requiredPlan: 'Starter', featureKey: 'feature_crm' },
    // { name: 'Competitor Intelligence', href: '/client/competitor-analysis', icon: Target, requiredPlan: 'Starter', featureKey: 'feature_competitor_analysis' }, // Shifted to Topbar near + Topup
    { name: 'Quotations', href: '/client/quotations', icon: FileCheck, requiredPlan: 'Starter', featureKey: 'feature_quotation' },
    { name: 'Proposals', href: '/client/proposals', icon: FileText, requiredPlan: 'Starter', featureKey: 'feature_proposal' },
    { name: 'Invoices', href: '/client/invoices', icon: Receipt, requiredPlan: 'Starter', featureKey: 'feature_invoice' },
    { name: 'Messages', href: '/client/inbox', icon: MessageSquare, requiredPlan: 'Starter', featureKey: 'feature_shared_inbox' },
    { name: 'Broadcasts', href: '/client/campaigns', icon: Megaphone, requiredPlan: 'Starter', featureKey: 'feature_broadcast' },
    { name: 'Knowledge Base', href: '/client/knowledge', icon: Brain, requiredPlan: 'Starter', featureKey: 'feature_knowledge_base' },
    { name: 'Catalog', href: '/client/catalog', icon: ShoppingBag, requiredPlan: 'Starter', featureKey: 'feature_catalog' },
    { name: 'Payments', href: '/client/payments', icon: CreditCard, requiredPlan: 'Starter', featureKey: 'feature_payment' },
    { name: 'Billing & Wallet', href: '/client/billing', icon: Wallet },
    { name: 'Orders', href: '/client/orders', icon: Receipt, requiredPlan: 'Starter', featureKey: 'feature_order' },
    { name: 'Team', href: '/client/team', icon: ShieldCheck, requiredPlan: 'Starter', featureKey: 'feature_team_dashboard' },
    { name: 'Work Reports', href: '/client/reports', icon: FileCheck, requiredPlan: 'Starter', featureKey: 'feature_reports' },
    { name: 'Settings', href: '/client/settings', icon: Settings },
    { name: 'Plans', href: '/client/plans', icon: Layers },
    { name: 'Support', href: '/client/support', icon: LifeBuoy },
  ];

  const agentLinks = [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Team & Projects', href: '/client/team', icon: ShieldCheck },
    { name: 'Voice & Video Calls', href: '/client/calls', icon: PhoneCall },
    { name: 'Leads (CRM)', href: '/client/crm', icon: Users },
    { name: 'Quotations', href: '/client/quotations', icon: FileCheck },
    { name: 'Proposals', href: '/client/proposals', icon: FileText },
    { name: 'Invoices', href: '/client/invoices', icon: Receipt },
    { name: 'Messages', href: '/client/inbox', icon: MessageSquare },
    { name: 'Knowledge Base', href: '/client/knowledge', icon: Brain },
    { name: 'Catalog', href: '/client/catalog', icon: ShoppingBag },
    { name: 'Orders', href: '/client/orders', icon: Receipt },
    { name: 'Work Reports', href: '/client/reports', icon: FileCheck },
    { name: 'Support', href: '/client/support', icon: LifeBuoy },
  ];

  const isImpersonating = mounted && typeof window !== 'undefined' && Boolean(localStorage.getItem('impersonation_session'));
  const effectiveRole = (userObj?.role === 'ADMIN' && !isImpersonating) ? 'ADMIN' : role;
  const links = effectiveRole === 'ADMIN' ? adminLinks : effectiveRole === 'AGENT' ? agentLinks : clientLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uwo_token');
    localStorage.removeItem('user');
    localStorage.removeItem('client_company_logo');
    localStorage.removeItem('cached_client_channels');
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cached_client_channels')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* ── Mobile Overlay Backdrop ── */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        data-tour="sidebar-nav"
        className={cn(
          'flex flex-col font-sans transition-all duration-300 ease-in-out shrink-0 overflow-hidden',
          isDark 
            ? 'bg-[#0f172a] border-r border-slate-800/80 text-slate-200' 
            : 'bg-white border-r border-slate-100 text-slate-800',
          // Mobile View: Slide-over drawer
          'fixed inset-y-0 left-0 z-50 shadow-2xl lg:shadow-none h-full',
          isOpen ? 'translate-x-0 w-[260px] sm:w-[270px]' : '-translate-x-full',
          // Desktop View (lg >= 1024px): Regular docked sidebar
          'lg:relative lg:translate-x-0 lg:z-30',
          isOpen ? 'lg:w-[220px]' : 'lg:w-14'
        )}
      >
        {/* ── Brand Header ── */}
        <div className={cn(
          'flex shrink-0 transition-all duration-300',
          isDark ? 'border-b border-slate-800/80' : 'border-b border-slate-100/80',
          isOpen ? 'items-center px-3.5 sm:px-4 py-3 justify-between gap-2 flex-row' : 'flex-col items-center px-0 py-2 gap-1'
        )}>
          {(() => {
            const displayBrandName = brand?.brand_name || "UWO Connect™";
            const displayBrandLogo = brand?.logo_url || "/download (3).gif";

            return isOpen ? (
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={displayBrandLogo}
                  alt={displayBrandName}
                  className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0 bg-white"
                  onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                />
                <div className="min-w-0 flex-1">
                  <h1 className={cn("text-sm font-black tracking-tight leading-tight whitespace-nowrap truncate", isDark ? "text-white" : "text-slate-900")} title={displayBrandName}>
                    {displayBrandName}
                  </h1>
                  <span className={cn(
                    "text-[7.5px] font-black uppercase tracking-[0.18em] block mt-0.5 whitespace-nowrap",
                    effectiveRole === 'ADMIN' ? "text-[#059669]" : isAgencyUser ? "text-blue-500" : "text-[#059669]"
                  )}>
                    V1.0 {mounted ? (effectiveRole === 'ADMIN' ? 'SUPER ADMIN' : isAgencyUser ? 'AGENCY ADMIN' : (effectiveRole || 'WORKSPACE')) : (effectiveRole === 'ADMIN' ? 'SUPER ADMIN' : 'WORKSPACE')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full py-1">
                <img
                  src={displayBrandLogo}
                  alt={displayBrandName}
                  className="w-8 h-8 rounded-xl object-contain bg-white"
                  onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                />
              </div>
            );
          })()}

          {/* Desktop Toggle button (hidden on mobile) */}
          <button
            onClick={handleToggle}
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className={cn(
              'hidden lg:flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer shrink-0',
              isDark ? 'text-slate-400 hover:text-[#059669] hover:bg-slate-800/80' : 'text-slate-400 hover:text-[#059669] hover:bg-emerald-50',
              isOpen ? 'p-1.5' : 'w-8 h-6'
            )}
          >
            {isOpen
              ? <ChevronLeft size={18} strokeWidth={2.5} />
              : <ChevronRight size={18} strokeWidth={2.5} />}
          </button>

          {/* Mobile Close Button (visible only on mobile when drawer is open) */}
          {isOpen && (
            <button
              onClick={onClose}
              title="Close menu"
              className={cn(
                "lg:hidden p-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0",
                isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className={cn(
          'flex-1 min-h-0 py-3 space-y-0.5 overflow-y-auto custom-scrollbar',
          isOpen ? 'px-2' : 'px-2'
        )}>
          {isOpen && (
            <p className={cn("px-3 text-[8px] font-black uppercase tracking-[0.2em] mb-2 italic opacity-70", isDark ? "text-slate-400" : "text-slate-400")}>Menu</p>
          )}

          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const tourId = TOUR_IDS[link.name];

            const isLocked = !isFeatureUnlocked(link);

            if (isLocked) {
              return (
                <div
                  key={link.href}
                  data-tour={tourId}
                  onClick={() => {
                    openUpgradeModal({
                      itemName: link.name,
                      itemType: 'feature',
                      requiredPlan: link.requiredPlan
                    });
                  }}
                  title={`${link.name} (Requires ${link.requiredPlan} Plan)`}
                  className={cn(
                    'group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden cursor-pointer',
                    isOpen ? 'gap-2 px-2 py-2' : 'justify-center px-0 py-2',
                    isDark ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300' : 'text-slate-400 hover:bg-emerald-50/50 hover:text-slate-700'
                  )}
                >
                  <Icon size={isOpen ? 16 : 18} className="text-slate-400 shrink-0 opacity-60" />
                  {isOpen && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-[12px] tracking-tight font-bold text-slate-400 truncate">
                        {link.name}
                      </span>
                      <Lock size={12} className="text-amber-500 shrink-0 ml-1" />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                data-tour={tourId}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                }}
                title={!isOpen ? link.name : undefined}
                className={cn(
                  'group flex items-center rounded-xl transition-all duration-300 relative overflow-hidden',
                  isOpen ? 'gap-2 px-2 py-2' : 'justify-center px-0 py-2',
                  isActive
                    ? (isDark
                        ? 'bg-gradient-to-r from-emerald-950/70 to-emerald-900/30 text-emerald-400 shadow-none border border-emerald-600/30'
                        : 'bg-gradient-to-r from-emerald-50/80 to-emerald-50/10 text-[#047857] shadow-[0_4px_12px_rgba(5,150,105,0.02)] border border-[#059669]/5'
                      )
                    : (isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5'
                      )
                )}
              >
                {/* Active left bar */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-r-full shadow-[0_0_10px_rgba(5,150,105,0.3)]" />
                )}

                <Icon
                  size={isOpen ? 16 : 18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    'transition-all duration-300 shrink-0',
                    isActive ? (isDark ? 'text-emerald-400 scale-110 drop-shadow-md' : 'text-[#059669] scale-110 drop-shadow-md') : (isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-slate-600')
                  )}
                />

                {/* Label — only when expanded */}
                {isOpen && (
                  <span className={cn(
                    'text-[12px] tracking-tight font-bold z-10 relative truncate',
                    isActive ? (isDark ? 'text-emerald-400 font-black' : 'text-[#047857]') : (isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-500')
                  )}>
                    {link.name}
                  </span>
                )}

                {isActive && isOpen && (
                  <div className={cn(
                    "absolute right-0 top-0 bottom-0 w-24 pointer-events-none",
                    isDark ? "bg-gradient-to-l from-[#0f172a]/60 to-transparent" : "bg-gradient-to-l from-white/40 to-transparent"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className={cn('shrink-0', isDark ? 'border-t border-slate-800/80' : 'border-t border-slate-50', isOpen ? 'p-4' : 'p-2')}>
          <button
            data-tour="sidebar-logout"
            onClick={handleLogout}
            title={!isOpen ? 'Logout' : undefined}
            className={cn(
              'flex items-center rounded-xl transition-all group font-bold',
              isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-950/40' : 'text-slate-400 hover:text-red-500 hover:bg-red-50',
              isOpen ? 'w-full gap-2 px-2 py-2 mb-1' : 'w-full justify-center px-0 py-2'
            )}
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            {isOpen && <span className="text-[10px] uppercase tracking-widest">Logout</span>}
          </button>

          {isOpen && (
            <div className="px-3 py-2 flex flex-col gap-1">
              <a
                href="https://uwo24.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-[8px] font-bold uppercase tracking-widest transition-colors italic",
                  isDark ? "text-slate-400 hover:text-emerald-400" : "text-slate-400 hover:text-[#059669]"
                )}
              >
                Privacy Policy
              </a>
              <Link
                href="/terms"
                className={cn(
                  "text-[8px] font-bold uppercase tracking-widest transition-colors italic",
                  isDark ? "text-slate-400 hover:text-emerald-400" : "text-slate-400 hover:text-[#059669]"
                )}
              >
                Terms of Service
              </Link>
            </div>
          )}
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#e2e8f0'}; border-radius: 20px; }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;

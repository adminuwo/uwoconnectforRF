'use client';

import React from 'react';
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
  ChevronRight,
  Zap as ZapIcon,
  ShieldCheck,
  Scale,
  Brain,
  Users,
  Megaphone,
  LifeBuoy,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tour ID → sidebar link name mapping
const TOUR_IDS = {
  'Channels':       'sidebar-channels',
  'Auto Replies':   'sidebar-automations',
  'Workflows':      'sidebar-workflows',
  'Leads (CRM)':    'sidebar-crm',
  'Messages':       'sidebar-inbox',
  'Broadcasts':     'sidebar-campaigns',
  'Knowledge Base': 'sidebar-knowledge',
  'Settings':       'sidebar-settings',
  'Dashboard':      'sidebar-dashboard',
  'Support':        'sidebar-support',
};

const Sidebar = ({ role, isOpen, onClose }) => {
  const pathname = usePathname();

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Client List', href: '/admin/clients', icon: Link2 },
    { name: 'Approvals', href: '/admin/approvals', icon: ShieldCheck },
    { name: 'Automations', href: '/admin/automations', icon: Zap },
    { name: 'Messages', href: '/admin/inbox', icon: MessageSquare },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
    { name: 'Policy', href: '/admin/settings/legal', icon: Scale },
    { name: 'Analytics', href: '/admin/stats', icon: GitBranch },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  ];

  const clientLinks = [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Channels', href: '/client/channels', icon: Link2 },
    { name: 'Auto Replies', href: '/client/automations', icon: Zap },
    { name: 'Workflows', href: '/client/workflows', icon: GitBranch },
    { name: 'Leads (CRM)', href: '/client/crm', icon: Users },
    { name: 'Messages', href: '/client/inbox', icon: MessageSquare },
    { name: 'Broadcasts', href: '/client/campaigns', icon: Megaphone },
    { name: 'Knowledge Base', href: '/client/knowledge', icon: Brain },
    { name: 'Settings', href: '/client/settings', icon: Settings },
    { name: 'Support', href: '/client/support', icon: LifeBuoy },
  ];


  const links = role === 'ADMIN' ? adminLinks : clientLinks;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };



  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-[35] md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        data-tour="sidebar-nav"
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex-col z-40 font-sans transition-transform duration-300",
          isOpen ? "flex translate-x-0" : "hidden md:flex -translate-x-full md:translate-x-0"
        )}
      >
      {/* Brand Header */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#16A34A] to-[#059669] rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <ZapIcon className="text-white relative z-10" size={20} strokeWidth={3} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">AisaConnect</h1>
          <span className="text-[8px] font-black text-[#059669] uppercase tracking-[0.2em] mt-1 block">V1.0 {role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-8 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic opacity-70">Menu</p>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          const tourId = TOUR_IDS[link.name];
          return (
            <Link
              key={link.href}
              href={link.href}
              data-tour={tourId}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-emerald-50/80 to-emerald-50/10 text-[#047857] shadow-[0_8px_20px_rgba(5,150,105,0.04)] border border-[#059669]/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-200/20 hover:-translate-y-0.5"
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-all duration-300", isActive ? "text-[#059669] scale-110 drop-shadow-md" : "text-slate-400 group-hover:text-slate-600")} />
              <span className={cn("text-[13px] tracking-tight font-bold z-10 relative", isActive ? "text-[#047857]" : "text-slate-500")}>{link.name}</span>
              {isActive && (
                <>
                  <div className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-r-full shadow-[0_0_10px_rgba(5,150,105,0.3)]" />
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="p-6">


        <button
          data-tour="sidebar-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group font-bold mb-4"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">Logout</span>
        </button>

        <div className="px-4 py-4 border-t border-slate-50 flex flex-col gap-2">
          <a href="https://uwo24.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:text-[#059669] transition-colors italic">Privacy Policy</a>
          <Link href="/terms" className="text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:text-[#059669] transition-colors italic">Terms of Service</Link>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
      `}</style>
    </aside>
    </>
  );
};

export default Sidebar;


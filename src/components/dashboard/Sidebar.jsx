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
  Activity,
  ShoppingBag,
  Receipt,
  MessagesSquare,
  FileCheck,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tour ID → sidebar link name mapping
const TOUR_IDS = {
  'Dashboard':      'sidebar-dashboard',
  'Channels':       'sidebar-channels',
  'YouTube':        'sidebar-youtube',
  'Google News':    'sidebar-google-news',
  'Auto Replies':   'sidebar-automations',
  'Workflows':      'sidebar-workflows',
  'Leads (CRM)':    'sidebar-crm',
  'Messages':       'sidebar-inbox',
  'Broadcasts':     'sidebar-campaigns',
  'Knowledge Base': 'sidebar-knowledge',
  'Catalog':        'sidebar-catalog',
  'Orders':         'sidebar-orders',
  'Team':           'sidebar-team',
  'Work Reports':   'sidebar-reports',
  'Settings':       'sidebar-settings',
  'Support':        'sidebar-support',
};

const YoutubeIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107A30.213 30.213 0 0 0 0 12c0 1.944.15 3.89.49 5.837a3.003 3.003 0 0 0 2.11 2.107c1.86.51 9.388.51 9.388.51s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.107A30.213 30.213 0 0 0 24 12a30.213 30.213 0 0 0-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Sidebar = ({ role, isOpen, onClose }) => {
  const pathname = usePathname();

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Client List', href: '/admin/clients', icon: Link2 },
    { name: 'Approvals', href: '/admin/approvals', icon: ShieldCheck },
    { name: 'Guide Admin', href: '/admin/guides', icon: BookOpen },
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
    { name: 'Learning Center', href: '/client/guides', icon: BookOpen },
    { name: 'Channels', href: '/client/channels', icon: Link2 },
    { name: 'YouTube', href: '/client/youtube', icon: YoutubeIcon },
    { name: 'Google News', href: '/client/google-news', icon: Newspaper },
    { name: 'Auto Replies', href: '/client/automations', icon: Zap },
    { name: 'Workflows', href: '/client/workflows', icon: GitBranch },
    { name: 'Leads (CRM)', href: '/client/crm', icon: Users },
    { name: 'Messages', href: '/client/inbox', icon: MessageSquare },
    { name: 'Broadcasts', href: '/client/campaigns', icon: Megaphone },
    { name: 'Knowledge Base', href: '/client/knowledge', icon: Brain },
    { name: 'Catalog', href: '/client/catalog', icon: ShoppingBag },
    { name: 'Orders', href: '/client/orders', icon: Receipt },
    { name: 'Team', href: '/client/team', icon: ShieldCheck },
    { name: 'Work Reports', href: '/client/reports', icon: FileCheck },
    { name: 'Settings', href: '/client/settings', icon: Settings },
    { name: 'Support', href: '/client/support', icon: LifeBuoy },
  ];

  const agentLinks = [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Leads (CRM)', href: '/client/crm', icon: Users },
    { name: 'Messages', href: '/client/inbox', icon: MessageSquare },
    { name: 'Team Chat', href: '/client/team-chat', icon: MessagesSquare },
    { name: 'Knowledge Base', href: '/client/knowledge', icon: Brain },
    { name: 'Catalog', href: '/client/catalog', icon: ShoppingBag },
    { name: 'Orders', href: '/client/orders', icon: Receipt },
    { name: 'Work Reports', href: '/client/reports', icon: FileCheck },
    { name: 'Support', href: '/client/support', icon: LifeBuoy },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'AGENT' ? agentLinks : clientLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      <div className="p-5 pb-2 flex items-center gap-3">
        <img 
          src="/download (3).gif" 
          alt="UwoConnect Logo" 
          className="w-8 h-8 rounded-xl object-contain shadow-md"
        />
        <div>
          <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">UwoConnect</h1>
          <span className="text-[7px] font-black text-[#059669] uppercase tracking-[0.2em] mt-0.5 block">V1.0 {role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 mt-4 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic opacity-70">Menu</p>
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
                "group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-emerald-50/80 to-emerald-50/10 text-[#047857] shadow-[0_4px_12px_rgba(5,150,105,0.02)] border border-[#059669]/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm hover:shadow-slate-200/10 hover:-translate-y-0.5"
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-all duration-300", isActive ? "text-[#059669] scale-110 drop-shadow-md" : "text-slate-400 group-hover:text-slate-600")} />
              <span className={cn("text-[12px] tracking-tight font-bold z-10 relative", isActive ? "text-[#047857]" : "text-slate-500")}>{link.name}</span>
              {isActive && (
                <>
                  <div className="absolute left-0 w-1 h-5 bg-gradient-to-b from-[#16A34A] to-[#059669] rounded-r-full shadow-[0_0_10px_rgba(5,150,105,0.3)]" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="p-4">
        <button
          data-tour="sidebar-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group font-bold mb-2"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest">Logout</span>
        </button>

        <div className="px-3 py-2 border-t border-slate-50 flex flex-col gap-1 mt-auto">
          <a href="https://uwo24.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#059669] transition-colors italic">Privacy Policy</a>
          <Link href="/terms" className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#059669] transition-colors italic">Terms of Service</Link>
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


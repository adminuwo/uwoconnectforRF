'use client';

import React, { useState } from 'react';
import { 
  Zap, MessageSquare, Share2, Layers, CheckCircle2, 
  LayoutDashboard, FileCheck, Receipt, FileText, ShoppingBag, 
  CreditCard, Users, Bot, Video, Sparkles, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── AUTHENTIC BRAND SVG LOGOS ──
const WhatsAppLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

const InstagramLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <defs>
      <linearGradient id="igGradMesh" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igGradMesh)"/>
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="31.5" cy="16.5" r="1.75" fill="white"/>
  </svg>
);

const FacebookLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
  </svg>
);

const YouTubeLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z" fill="white"/>
  </svg>
);

const GmailLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4"/>
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853"/>
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335"/>
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F"/>
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04"/>
  </svg>
);

const OutlookLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
  </svg>
);

const GoogleSheetsLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#0F9D58" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#87CEAC"/>
    <rect x="15" y="19" width="18" height="16" rx="1" fill="white"/>
    <line x1="15" y1="24.5" x2="33" y2="24.5" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="15" y1="30" x2="33" y2="30" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="24" y1="19" x2="24" y2="35" stroke="#0F9D58" strokeWidth="1.5"/>
  </svg>
);

const GoogleDocsLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#4285F4" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#A1C2FA"/>
    <rect x="15" y="20" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="26" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="32" width="11" height="2.5" rx="1.25" fill="white" />
  </svg>
);

// Node Definitions
const NETWORK_NODES = [
  // ── 4 CHANNELS ──
  { id: 'whatsapp', group: 'channels', label: 'WhatsApp', desc: 'Business API automation & messaging', icon: <WhatsAppLogo size={22} />, color: '#25D366' },
  { id: 'instagram', group: 'channels', label: 'Instagram', desc: 'Direct DMs & comment automation', icon: <InstagramLogo size={22} />, color: '#E1306C' },
  { id: 'facebook', group: 'channels', label: 'Facebook', desc: 'Messenger & page lead sync', icon: <FacebookLogo size={22} />, color: '#1877F2' },
  { id: 'youtube', group: 'channels', label: 'YouTube', desc: 'Community & video lead automation', icon: <YouTubeLogo size={22} />, color: '#FF0000' },

  // ── 8 CONNECTORS ──
  { id: 'gmail', group: 'connectors', label: 'Gmail', desc: 'Business email sync & trigger flows', icon: <GmailLogo size={20} />, color: '#EA4335' },
  { id: 'outlook', group: 'connectors', label: 'Outlook', desc: 'Enterprise Outlook calendar & email', icon: <OutlookLogo size={20} />, color: '#0078D4' },
  { id: 'google_sheets', group: 'connectors', label: 'Google Sheets', desc: 'Real-time database & row logging', icon: <GoogleSheetsLogo size={20} />, color: '#0F9D58' },
  { id: 'google_docs', group: 'connectors', label: 'Google Docs', desc: 'Automated contract & doc generation', icon: <GoogleDocsLogo size={20} />, color: '#4285F4' },
  { id: 'onedrive', group: 'connectors', label: 'OneDrive', desc: 'Cloud document & asset storage', icon: <Share2 size={18} className="text-blue-500" />, color: '#0078D4' },
  { id: 'google_maps', group: 'connectors', label: 'Google Maps', desc: 'Location intelligence & store lookup', icon: <Layers size={18} className="text-emerald-600" />, color: '#34A853' },
  { id: 'google_slides', group: 'connectors', label: 'Google Slides', desc: 'Automated pitch deck generation', icon: <FileText size={18} className="text-amber-500" />, color: '#FBBC04' },
  { id: 'google_news', group: 'connectors', label: 'Google News', desc: 'Brand news monitoring & alerts', icon: <MessageSquare size={18} className="text-cyan-600" />, color: '#4285F4' },

  // ── 9 AUTOMATION MODULES ──
  { id: 'crm', group: 'modules', label: 'CRM', desc: 'Capture & manage customer relationships', icon: <Users size={18} className="text-emerald-600" />, color: '#059669' },
  { id: 'auto_reply', group: 'modules', label: 'Auto Reply', desc: 'Intelligent AI keyword chatbots', icon: <Bot size={18} className="text-indigo-600" />, color: '#4F46E5' },
  { id: 'quotation', group: 'modules', label: 'Quotation', desc: 'Instant price quotes & proposals', icon: <FileCheck size={18} className="text-amber-600" />, color: '#D97706' },
  { id: 'invoice', group: 'modules', label: 'Invoice', desc: 'Automated GST-compliant billing', icon: <Receipt size={18} className="text-teal-600" />, color: '#0D9488' },
  { id: 'proposal', group: 'modules', label: 'Proposal', desc: 'Interactive business contracts', icon: <FileText size={18} className="text-blue-600" />, color: '#2563EB' },
  { id: 'catalog', group: 'modules', label: 'Catalog', desc: 'Product catalogs in WhatsApp & DMs', icon: <ShoppingBag size={18} className="text-purple-600" />, color: '#9333EA' },
  { id: 'payment', group: 'modules', label: 'Payment', desc: 'Native UPI & Razorpay links', icon: <CreditCard size={18} className="text-rose-600" />, color: '#E11D48' },
  { id: 'team_dashboard', group: 'modules', label: 'Team Dashboard', desc: 'Shared inbox & team agent analytics', icon: <LayoutDashboard size={18} className="text-emerald-600" />, color: '#059669' },
  { id: 'voice_video_call', group: 'modules', label: 'Voice / Video Call', desc: 'Direct WebRTC video & voice calls', icon: <Video size={18} className="text-pink-600" />, color: '#DB2777' }
];

export default function AutomationNetwork() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const channels = NETWORK_NODES.filter(n => n.group === 'channels');
  const connectors = NETWORK_NODES.filter(n => n.group === 'connectors');
  const modules = NETWORK_NODES.filter(n => n.group === 'modules');

  const activeInfo = hoveredNode
    ? NETWORK_NODES.find(n => n.id === hoveredNode)
    : null;

  return (
    <div className="w-full relative py-6">

      {/* FLOATING HOVER TOOLTIP */}
      {activeInfo && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-2xl bg-white/95 border border-emerald-300 shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150 max-w-sm text-left">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 shrink-0">
            {activeInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">{activeInfo.label}</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {activeInfo.group}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-tight">{activeInfo.desc}</p>
          </div>
        </div>
      )}

      {/* DESKTOP INTEGRATION MESH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center relative z-10 max-w-6xl mx-auto px-4">

        {/* LAYER 1: CHANNELS & CONNECTORS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              LAYER 1: CHANNELS & CONNECTORS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {channels.map((node) => {
              const isHovered = hoveredNode === node.id;
              const isDimmed = hoveredNode && !isHovered;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={cn(
                    "p-3.5 rounded-2xl bg-white border transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-sm",
                    isHovered ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-105" : "border-slate-200 hover:border-emerald-300",
                    isDimmed && "opacity-40"
                  )}
                >
                  <div className="shrink-0">{node.icon}</div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{node.label}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Connected</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 pt-2">
            {connectors.map((node) => {
              const isHovered = hoveredNode === node.id;
              const isDimmed = hoveredNode && !isHovered;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={cn(
                    "p-2.5 rounded-xl bg-white border transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-2xs",
                    isHovered ? "border-emerald-500 shadow-sm ring-2 ring-emerald-500/20 scale-105" : "border-slate-200 hover:border-emerald-300",
                    isDimmed && "opacity-40"
                  )}
                >
                  <div className="shrink-0">{node.icon}</div>
                  <span className="text-[11px] font-bold text-slate-800 truncate">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER CORE: UWO CONNECT AUTOMATION ENGINE */}
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-white to-emerald-50 border-2 border-emerald-500/40 shadow-2xl relative group">
          <div className="w-20 h-20 rounded-3xl bg-[#059669] text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 mb-4 animate-bounce-slow">
            <Zap size={38} className="fill-white" />
          </div>

          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
              UNIFIED ENGINE
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">UWO Connect</h3>
            <p className="text-xs text-slate-500 font-medium">Auto-syncing channels, tools & workflows</p>
          </div>

          {/* Animated Glowing Pulse Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20 pointer-events-none animate-pulse" />
        </div>

        {/* LAYER 2: AUTOMATION MODULES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 justify-start lg:justify-end">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              LAYER 2: AUTOMATION MODULES
            </span>
            <Sparkles size={14} className="text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            {modules.map((node) => {
              const isHovered = hoveredNode === node.id;
              const isDimmed = hoveredNode && !isHovered;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={cn(
                    "p-3 rounded-xl bg-white border transition-all duration-300 flex items-center justify-between cursor-pointer shadow-2xs",
                    isHovered ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-105" : "border-slate-200 hover:border-emerald-300",
                    isDimmed && "opacity-40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 shrink-0">
                      {node.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-slate-900">{node.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[170px]">{node.desc}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

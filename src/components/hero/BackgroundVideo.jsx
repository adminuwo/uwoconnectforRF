'use client';

import React from 'react';
import { 
  MessageSquare, Mail, CheckCircle2, Sparkles, 
  Layers, Monitor, Zap, Smartphone, RefreshCw 
} from 'lucide-react';

const InstagramIcon = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const BackgroundVideo = ({ currentTime = 0 }) => {
  const showWhatsApp = currentTime >= 0 && currentTime < 16;
  const showInstagram = currentTime >= 4 && currentTime < 16;
  const showEmail = currentTime >= 8 && currentTime < 16;
  const isChaos = currentTime >= 12 && currentTime < 16;
  const isTransition = currentTime >= 16 && currentTime < 20;
  const isUWOConnect = currentTime >= 20;

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden select-none font-sans">
      
      {/* Dynamic Background Ambient Halos */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 ${
        isChaos ? 'bg-rose-500/25' : isUWOConnect ? 'bg-emerald-500/35' : 'bg-blue-500/20'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 ${
        isTransition ? 'bg-teal-400/30' : isUWOConnect ? 'bg-emerald-400/25' : 'bg-indigo-500/20'
      }`} />

      {/* --- SCENE BACKGROUND CANVAS STAGE --- */}
      <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12 z-0">
        
        {/* === SCENES 0-16s: CHAOTIC MULTI-PLATFORM STAGE === */}
        {!isUWOConnect && (
          <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
            
            {/* Office Monitor / Desk Card */}
            <div className={`relative bg-slate-900/80 p-8 sm:p-12 rounded-3xl border shadow-2xl backdrop-blur-md transition-all duration-700 max-w-xl w-full text-center space-y-4 ${
              isChaos 
                ? 'border-rose-500/80 scale-95 ring-4 ring-rose-500/40 animate-pulse' 
                : isTransition
                  ? 'border-emerald-400/80 scale-90 blur-xs'
                  : 'border-slate-800/80'
            }`}>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-750 mx-auto flex items-center justify-center text-slate-300 shadow-xl">
                <Monitor size={40} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-300">Office Workstation</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {currentTime < 4 ? '🟢 Checking WhatsApp queries...' : isChaos ? '⚠️ Overwhelmed! 10+ Apps open' : '⚡ Incoming notifications'}
                </p>
              </div>

              {/* Rapid App Switcher Bar */}
              {isChaos && (
                <div className="flex items-center justify-center gap-2 pt-2 animate-bounce">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono font-black">WhatsApp</span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-mono font-black">Instagram</span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-mono font-black">Email</span>
                </div>
              )}
            </div>

            {/* FLOATING NOTIFICATION CARDS */}
            {showWhatsApp && (
              <div className="absolute top-4 left-4 sm:left-12 bg-emerald-950/90 border border-emerald-500/60 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs text-emerald-200 animate-in fade-in slide-in-from-left-8 duration-500 max-w-xs">
                <MessageSquare className="text-emerald-400 shrink-0" size={20} />
                <div>
                  <p className="font-black text-white text-xs">WhatsApp Business</p>
                  <p className="text-[11px] text-emerald-300 font-medium">"Can you send pricing & brochure ASAP?"</p>
                </div>
              </div>
            )}

            {showInstagram && (
              <div className="absolute bottom-4 right-4 sm:right-12 bg-rose-950/90 border border-rose-500/60 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs text-rose-200 animate-in fade-in slide-in-from-right-8 duration-500 max-w-xs">
                <InstagramIcon className="text-rose-400 shrink-0" size={20} />
                <div>
                  <p className="font-black text-white text-xs">Instagram Direct</p>
                  <p className="text-[11px] text-rose-300 font-medium">"Is this item available in stock?"</p>
                </div>
              </div>
            )}

            {showEmail && (
              <div className="absolute top-1/2 -right-4 sm:right-8 -translate-y-1/2 bg-blue-950/90 border border-blue-500/60 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs text-blue-200 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-xs">
                <Mail className="text-blue-400 shrink-0" size={20} />
                <div>
                  <p className="font-black text-white text-xs">Gmail Inbox (18 Unread)</p>
                  <p className="text-[11px] text-blue-300 font-medium">"New quotation & partnership request"</p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* === SCENES 20-35s: UWO CONNECT UNIFIED REVEAL STAGE === */}
        {isUWOConnect && (
          <div className="relative w-full max-w-4xl bg-slate-900/80 border border-emerald-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-700 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  U
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">UWO Connect Workspace</h3>
                  <p className="text-xs text-emerald-400 font-bold">🟢 Unified Inbox & Automated Operating System</p>
                </div>
              </div>

              <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-wider">
                All Connected
              </span>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <MessageSquare className="text-emerald-400 mx-auto" size={24} />
                <p className="text-xs font-bold text-white">Unified Inbox</p>
                <p className="text-[10px] text-slate-400">WA + IG + Mail</p>
              </div>

              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <Zap className="text-teal-400 mx-auto" size={24} />
                <p className="text-xs font-bold text-white">AI Automation</p>
                <p className="text-[10px] text-slate-400">Instant Bots</p>
              </div>

              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <Layers className="text-emerald-400 mx-auto" size={24} />
                <p className="text-xs font-bold text-white">CRM Pipeline</p>
                <p className="text-[10px] text-slate-400">Lead Tracking</p>
              </div>

              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <CheckCircle2 className="text-emerald-400 mx-auto" size={24} />
                <p className="text-xs font-bold text-white">Team QR Join</p>
                <p className="text-[10px] text-slate-400">Clock In/Out</p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default BackgroundVideo;

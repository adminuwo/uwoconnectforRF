'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AuthHeroSide({
  title = <>Build your <br/> automation empire.</>,
  subtitle = 'Connect all your tools in one seamless dashboard and let your workflows run on autopilot.',
  badgeText = 'Secure • Fast • Reliable',
  imageSrc = '/abha_dev_login.png',
  altText = 'Abha and Dev - UWO Connect',
  className = '',
}) {
  return (
    <div className={`hidden md:flex flex-col justify-between items-center w-2/5 p-8 lg:p-10 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-100 dark:border-slate-800 relative overflow-hidden shrink-0 transition-colors ${className}`}>
      {/* Subtle Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,rgba(248,250,252,0)_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Extremely thin curved connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        <path d="M-100,200 C100,100 300,300 500,100" fill="none" stroke="url(#heroGrad1)" strokeWidth="0.5" />
        <path d="M-50,450 C150,550 250,350 450,450" fill="none" stroke="url(#heroGrad2)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tiny subtle dots */}
      <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-40 blur-[0.5px]" />
      <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-blue-400 rounded-full opacity-30 blur-[0.5px]" />
      <div className="absolute top-[60%] left-[15%] w-1 h-1 bg-emerald-500 rounded-full opacity-50 blur-[0.5px]" />

      {/* Abstract circular shapes */}
      <div className="absolute -top-20 -left-20 w-64 h-64 border border-emerald-100 dark:border-emerald-900/40 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 border border-blue-50 dark:border-blue-900/40 rounded-full opacity-50 pointer-events-none" />

      {/* Hero Illustration - Abha + Dev */}
      <div className="relative z-10 w-full flex items-center justify-center pt-2 pb-4">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-auto h-[230px] md:h-[260px] max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
        />
      </div>

      {/* Marketing Text */}
      <div className="relative z-10 w-full mt-2">
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-emerald-900 dark:text-emerald-300 mb-2 leading-tight">
          {title}
        </h2>
        <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {subtitle}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {badgeText}
        </div>
      </div>
    </div>
  );
}

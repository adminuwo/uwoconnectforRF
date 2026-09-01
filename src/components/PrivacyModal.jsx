'use client';

import React, { useEffect } from 'react';
import { X, Shield, ExternalLink } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      window.open('https://uwo24.com/privacy-policy', '_blank');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] w-full max-w-lg p-7 shadow-2xl shadow-emerald-950/30 overflow-hidden text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
            <Shield size={13} />
            <span>EXTERNAL PRIVACY POLICY</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <h2 
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif leading-tight" 
            style={serifStyle}
          >
            Privacy Policy
          </h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Our official Privacy Policy is hosted at <strong className="text-slate-900">uwo24.com</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
          <p className="text-xs text-slate-600">
            Clicking the button below will open the official UwoConnect Privacy Policy page in a secure browser tab.
          </p>
          <a
            href="https://uwo24.com/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Open uwo24.com Privacy Policy</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Close Window
        </button>

      </div>
    </div>
  );
}

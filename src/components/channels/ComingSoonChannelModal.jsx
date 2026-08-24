'use client';

import React from 'react';
import { X, Lock, Sparkles } from 'lucide-react';

// Authentic Brand Vector Icons
const WhatsAppBrandIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.43 0 .07 5.36.07 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.91 11.91 0 005.81 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.49-8.43zM12.04 21.84h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.88 9.88 0 01-1.52-5.24C2.17 6.52 6.6 2.08 12.04 2.08c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 6.99c0 5.44-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" fill="currentColor"/>
  </svg>
);

const TelegramBrandIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z"/>
  </svg>
);

const LinkedInBrandIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XTwitterBrandIcon = ({ size = 26, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeBrandIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokBrandIcon = ({ size = 26, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.86c0 1.57-.43 3.18-1.38 4.43-1.28 1.74-3.4 2.77-5.59 2.68-2.6-.07-4.99-1.66-5.96-4.04-.97-2.39-.42-5.26 1.37-7.05 1.52-1.55 3.79-2.28 5.96-1.84v4.18c-.89-.25-1.88-.17-2.69.25-.8.41-1.39 1.19-1.58 2.08-.2 1.01.12 2.1.84 2.81.71.72 1.77.99 2.75.7 1.03-.3 1.74-1.24 1.76-2.31V.02z"/>
  </svg>
);

export default function ComingSoonChannelModal({ isOpen, onClose, channel }) {
  if (!isOpen || !channel) return null;

  const renderModalIcon = () => {
    switch (channel.key) {
      case 'telegram':
        return <TelegramBrandIcon size={30} />;
      case 'linkedin':
        return <LinkedInBrandIcon size={30} />;
      case 'twitter':
        return <XTwitterBrandIcon size={28} />;
      case 'youtube':
        return <YouTubeBrandIcon size={30} />;
      case 'tiktok':
        return <TikTokBrandIcon size={28} />;
      default:
        return <Lock size={28} className="stroke-[2.5]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header with Icon */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-flex">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${channel.iconColor || 'bg-slate-100 text-slate-700'}`}>
              {renderModalIcon()}
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full shadow-xs">
              <Sparkles size={12} />
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              Coming Soon
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{channel.name}</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{channel.tagline || 'Future Integration'}</p>
          </div>
        </div>

        {/* Description Body */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            This channel connector is currently under active engineering and will be available in a future UWO CONNECT platform update.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Active production channels currently available for messaging and bots are <strong className="text-slate-700 font-bold">WhatsApp</strong>, <strong className="text-slate-700 font-bold">Facebook</strong>, and <strong className="text-slate-700 font-bold">Instagram</strong>.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Understood</span>
        </button>
      </div>
    </div>
  );
}

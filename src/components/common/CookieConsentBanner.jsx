'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check, Settings, X, ArrowRight } from 'lucide-react';
import CookiePreferencesModal from './CookiePreferencesModal';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('uwo_cookie_consent');
      if (!consent) {
        setShowBanner(true);
      }
    } catch (e) {
      console.error('Error checking cookie consent:', e);
    }

    const handleOpenSettings = () => {
      setShowModal(true);
    };
    window.addEventListener('open_cookie_settings', handleOpenSettings);
    return () => window.removeEventListener('open_cookie_settings', handleOpenSettings);
  }, []);

  const saveConsent = (consentObj) => {
    try {
      localStorage.setItem('uwo_cookie_consent', JSON.stringify(consentObj));
    } catch (e) {
      console.error('Error saving cookie consent:', e);
    }
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      preferences: true,
      analytics: true,
      version: '1.0',
      consentedAt: new Date().toISOString(),
    });
  };

  const handleNecessaryOnly = () => {
    saveConsent({
      essential: true,
      preferences: false,
      analytics: false,
      version: '1.0',
      consentedAt: new Date().toISOString(),
    });
  };

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 inset-x-0 z-[110] p-3.5 sm:p-5 md:p-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-emerald-500/30 text-slate-900 dark:text-slate-100 shadow-[0_-15px_40px_-10px_rgba(5,150,105,0.15)] animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-5">
            
            {/* Banner Text with Times New Roman & Brand Badge */}
            <div className="space-y-1 text-left max-w-3xl w-full">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  <Cookie size={12} className="text-emerald-700 dark:text-emerald-400" />
                  <span>COOKIE &amp; PRIVACY CONSENT</span>
                </div>

                {/* Mobile Quick Dismiss Button */}
                <button
                  type="button"
                  onClick={handleNecessaryOnly}
                  className="md:hidden p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Dismiss"
                  aria-label="Dismiss cookie banner"
                >
                  <X size={16} />
                </button>
              </div>
              
              <h4 
                className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-serif leading-snug"
                style={serifStyle}
              >
                We use cookies
              </h4>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                We use essential cookies to keep UWO Connect™ working properly. With your permission, we may also use optional cookies to improve your experience and understand how the website is used.{' '}
                <Link
                  href="/cookie-policy"
                  className="text-[#059669] hover:text-emerald-800 dark:hover:text-emerald-400 font-bold underline transition-colors"
                >
                  Cookie Policy
                </Link>
              </p>
            </div>

            {/* Responsive Action Buttons: Full grid & prominent Accept All on mobile, inline on md+ */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                <button
                  type="button"
                  onClick={handleNecessaryOnly}
                  className="w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center"
                >
                  Necessary Only
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#059669] dark:text-emerald-400 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 text-center"
                >
                  <Settings size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Customize</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Accept All</span>
                <Check size={15} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Cookie Preferences Customization Modal */}
      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(consentObj) => {
          saveConsent(consentObj);
        }}
      />
    </>
  );
}

export const openCookieSettings = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open_cookie_settings'));
  }
};

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
        <div className="fixed bottom-0 inset-x-0 z-[110] p-5 sm:p-6 bg-white/95 backdrop-blur-2xl border-t-2 border-emerald-500/30 text-slate-900 shadow-[0_-15px_40px_-10px_rgba(5,150,105,0.15)] animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            
            {/* Banner Text with Times New Roman & Brand Badge */}
            <div className="space-y-1.5 text-left max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
                  <Cookie size={13} className="text-emerald-700" />
                  <span>COOKIE &amp; PRIVACY CONSENT</span>
                </div>
              </div>
              
              <h4 
                className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif leading-snug"
                style={serifStyle}
              >
                We use cookies
              </h4>

              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                We use essential cookies to keep UwoConnect working properly. With your permission, we may also use optional cookies to improve your experience and understand how the website is used.{' '}
                <Link
                  href="/cookie-policy"
                  className="text-[#059669] hover:text-emerald-800 font-bold underline transition-colors"
                >
                  Cookie Policy
                </Link>
              </p>
            </div>

            {/* Light Theme Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                Necessary Only
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[#059669] text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Settings size={14} className="text-emerald-700" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
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

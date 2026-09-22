'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cookie, 
  Check, 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export default function CookiePolicyClient() {
  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

  const [preferences, setPreferences] = useState({
    essential: true,
    preference: true,
    analytics: false,
    functional: true,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('uwo_cookie_consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({
          essential: true,
          preference: parsed.preference ?? true,
          analytics: parsed.analytics ?? false,
          functional: parsed.functional ?? true,
        });
      }
    } catch (e) {
      console.error('Failed to load cookie preferences:', e);
    }
  }, []);

  const handleSave = () => {
    const consentObj = {
      essential: true,
      preference: Boolean(preferences.preference),
      analytics: Boolean(preferences.analytics),
      functional: Boolean(preferences.functional),
      version: '1.0',
      consentedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('uwo_cookie_consent', JSON.stringify(consentObj));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save cookie preferences:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="text-emerald-400 font-bold text-xs sm:text-sm hover:text-emerald-300 transition-colors inline-flex items-center gap-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 border border-emerald-500/30 p-0.5 flex items-center justify-center">
              <img src="/favicon.png" alt="UWO Connect" className="w-full h-full object-contain rounded-lg" width={32} height={32} />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight italic font-serif" style={serifStyle}>
              UWO <span className="text-emerald-500">Connect</span>
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        
        {/* Title Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Cookie size={14} />
            <span>PRIVACY &amp; CONSENT</span>
          </div>
          <h1 
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-serif leading-tight" 
            style={serifStyle}
          >
            Cookie Policy &amp; Preferences
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            This Cookie Policy explains how UWO Connect uses cookies, local storage, and similar technologies to keep your session secure and improve your experience.
          </p>
        </section>

        {/* Notice Card */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-3">
          <ShieldCheck size={20} className="shrink-0 text-emerald-400 mt-0.5" />
          <p>
            You can customize your cookie choices below at any time. Changes to optional cookies take effect immediately and are saved locally in your browser.
          </p>
        </div>

        {/* Section 1: What Are Cookies */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2" style={serifStyle}>
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold flex items-center justify-center">1</span>
            What Are Cookies?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-4 bg-slate-950/60 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-white block">Definition</span>
              <span className="text-slate-400 text-xs block leading-relaxed">Small encrypted text files stored in your web browser when visiting UWO Connect.</span>
            </div>
            <div className="p-4 bg-slate-950/60 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-white block">Purpose</span>
              <span className="text-slate-400 text-xs block leading-relaxed">Authenticate your login session, protect against CSRF attacks, and remember workspace preferences.</span>
            </div>
            <div className="p-4 bg-slate-950/60 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-white block">Duration</span>
              <span className="text-slate-400 text-xs block leading-relaxed">Session cookies expire when browser closes; persistent cookies remember settings across visits.</span>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Cookie Preferences */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2" style={serifStyle}>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold flex items-center justify-center">2</span>
                Manage Cookie Preferences
              </h2>
              <p className="text-slate-400 text-xs mt-1">Configure which categories of cookies UWO Connect is allowed to use.</p>
            </div>
            
            {savedSuccess && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 size={14} />
                <span>Preferences Saved!</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Essential */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Essential Cookies</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/30">Always Active</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Strictly necessary for user authentication, API token security, workspace routing, and cross-site forgery protection. Cannot be disabled.
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-1">
                <Check size={14} />
              </div>
            </div>

            {/* Preference */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">Preference Cookies</span>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Remember your UI theme preference (dark/light mode), interface language, and notification display settings.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={preferences.preference}
                  onChange={(e) => setPreferences(prev => ({ ...prev, preference: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Functional */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">Functional Cookies</span>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Maintain active live chat tab states, real-time socket sessions, and selected AI copilot filters.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Analytics */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">Analytics Cookies (Optional)</span>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Collect anonymized platform telemetry to help our engineering team diagnose performance bottlenecks and improve page speed.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-700/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Check size={16} />
              <span>Save Cookie Preferences</span>
            </button>
          </div>
        </section>

        {/* Section 3: Local Storage */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2" style={serifStyle}>
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold flex items-center justify-center">3</span>
            Local Storage &amp; Session Storage
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            In addition to cookies, UWO Connect uses standard HTML5 Web Storage (`localStorage` and `sessionStorage`) to store non-sensitive application state such as your active chat filter tabs, sidebar collapse status, and temporary form drafts for offline resilience. You can clear this data anytime through your browser settings.
          </p>
        </section>

        {/* Section 4: Third-Party Services */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2" style={serifStyle}>
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold flex items-center justify-center">4</span>
            Third-Party Cookies
          </h2>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
            <li><strong>Authentication Providers:</strong> Google OAuth and Firebase for single sign-on security.</li>
            <li><strong>Payment Gateways:</strong> Cashfree and Razorpay for PCI-DSS compliant payment processing.</li>
            <li><strong>Meta Graph API:</strong> Embedded WhatsApp Business and Instagram webhook verification frames.</li>
          </ul>
        </section>

        {/* Questions Box */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 text-xs sm:text-sm space-y-3">
          <span className="font-bold text-white block">Questions About Cookies or Privacy?</span>
          <p className="text-slate-400 text-xs">For any inquiries regarding data protection and cookie policies, please reach out to:</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="flex items-center gap-1.5 text-emerald-400 hover:underline font-bold">
              <Mail size={14} />
              <span>{SITE_CONFIG.supportEmail}</span>
            </a>
            <a href="tel:+918358990909" className="flex items-center gap-1.5 text-emerald-400 hover:underline font-bold">
              <Phone size={14} />
              <span>+91 83589 90909</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 px-4 text-center text-xs text-slate-400 space-y-3 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
          <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">Terms &amp; Conditions</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund Policy</Link>
        </div>
        <p className="text-slate-500">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

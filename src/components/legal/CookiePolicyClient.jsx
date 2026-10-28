'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cookie, 
  Check, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';
import { cn } from '@/lib/utils';
import LandingLayout from '@/components/landing/LandingLayout';

export default function CookiePolicyClient() {
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
    <LandingLayout activePage="cookie-policy">
      {({ isDarkMode }) => (
        <div className={cn(
          "w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300",
          isDarkMode ? "bg-[#070B14] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
        )}>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title Header */}
            <section className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Cookie size={14} />
                <span>PRIVACY &amp; CONSENT</span>
              </div>
              <h1 className={cn(
                "text-3xl sm:text-5xl font-black tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Cookie Policy &amp; Preferences
              </h1>
              <p className={cn(
                "text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}>
                This Cookie Policy explains how UWO Connect uses cookies, local storage, and similar technologies to keep your session secure and improve your experience.
              </p>
            </section>

            {/* Notice Card */}
            <div className={cn(
              "p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-3",
              isDarkMode
                ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                : "bg-emerald-50/80 border-emerald-200 text-emerald-800"
            )}>
              <ShieldCheck size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <p>
                You can customize your cookie choices below at any time. Changes to optional cookies take effect immediately and are saved locally in your browser.
              </p>
            </div>

            {/* Section 1: What Are Cookies */}
            <section className={cn(
              "border rounded-3xl p-6 sm:p-8 space-y-4 transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80"
            )}>
              <h2 className={cn("text-lg sm:text-xl font-black flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                What Are Cookies?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className={cn(
                  "p-4 border rounded-2xl space-y-1",
                  isDarkMode ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200/60"
                )}>
                  <span className={cn("font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Definition</span>
                  <span className={cn("text-xs block leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                    Small encrypted text files stored in your web browser when visiting UWO Connect.
                  </span>
                </div>
                <div className={cn(
                  "p-4 border rounded-2xl space-y-1",
                  isDarkMode ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200/60"
                )}>
                  <span className={cn("font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Purpose</span>
                  <span className={cn("text-xs block leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                    Authenticate your login session, protect against CSRF attacks, and remember workspace preferences.
                  </span>
                </div>
                <div className={cn(
                  "p-4 border rounded-2xl space-y-1",
                  isDarkMode ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200/60"
                )}>
                  <span className={cn("font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Duration</span>
                  <span className={cn("text-xs block leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                    Session cookies expire when browser closes; persistent cookies remember settings across visits.
                  </span>
                </div>
              </div>
            </section>

            {/* Section 2: Interactive Cookie Preferences */}
            <section className={cn(
              "border rounded-3xl p-6 sm:p-8 space-y-6 transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200/60 dark:border-slate-800">
                <div>
                  <h2 className={cn("text-lg sm:text-xl font-black flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                    Manage Cookie Preferences
                  </h2>
                  <p className={cn("text-xs mt-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                    Configure which categories of cookies UWO Connect is allowed to use.
                  </p>
                </div>
                
                {savedSuccess && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span>Preferences Saved!</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Essential */}
                <div className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-4",
                  isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200/60"
                )}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-slate-900")}>Essential Cookies</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/20">
                        Always Active
                      </span>
                    </div>
                    <p className={cn("text-xs leading-relaxed max-w-xl", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Strictly necessary for user authentication, API token security, workspace routing, and cross-site forgery protection. Cannot be disabled.
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Check size={14} />
                  </div>
                </div>

                {/* Preference */}
                <div className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-4",
                  isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200/60"
                )}>
                  <div className="space-y-1">
                    <span className={cn("text-sm font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Preference Cookies</span>
                    <p className={cn("text-xs leading-relaxed max-w-xl", isDarkMode ? "text-slate-400" : "text-slate-600")}>
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
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Functional */}
                <div className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-4",
                  isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200/60"
                )}>
                  <div className="space-y-1">
                    <span className={cn("text-sm font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Functional Cookies</span>
                    <p className={cn("text-xs leading-relaxed max-w-xl", isDarkMode ? "text-slate-400" : "text-slate-600")}>
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
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Analytics */}
                <div className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-4",
                  isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200/60"
                )}>
                  <div className="space-y-1">
                    <span className={cn("text-sm font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>Analytics Cookies (Optional)</span>
                    <p className={cn("text-xs leading-relaxed max-w-xl", isDarkMode ? "text-slate-400" : "text-slate-600")}>
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
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Check size={16} />
                  <span>Save Cookie Preferences</span>
                </button>
              </div>
            </section>

            {/* Section 3: Local Storage */}
            <section className={cn(
              "border rounded-3xl p-6 sm:p-8 space-y-4 transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200/80 text-slate-700"
            )}>
              <h2 className={cn("text-lg sm:text-xl font-black flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                Local Storage &amp; Session Storage
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed">
                In addition to cookies, UWO Connect uses standard HTML5 Web Storage (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 font-mono text-xs">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 font-mono text-xs">sessionStorage</code>) to store non-sensitive application state such as your active chat filter tabs, sidebar collapse status, and temporary form drafts for offline resilience. You can clear this data anytime through your browser settings.
              </p>
            </section>

            {/* Section 4: Third-Party Services */}
            <section className={cn(
              "border rounded-3xl p-6 sm:p-8 space-y-4 transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200/80 text-slate-700"
            )}>
              <h2 className={cn("text-lg sm:text-xl font-black flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">4</span>
                Third-Party Cookies
              </h2>
              <ul className="list-disc pl-5 text-xs sm:text-sm space-y-2 leading-relaxed">
                <li><strong>Authentication Providers:</strong> Google OAuth and Firebase for single sign-on security.</li>
                <li><strong>Payment Gateways:</strong> Cashfree and Razorpay for PCI-DSS compliant payment processing.</li>
                <li><strong>Meta Graph API:</strong> Embedded WhatsApp Business and Instagram webhook verification frames.</li>
              </ul>
            </section>

            {/* Questions Box */}
            <div className={cn(
              "p-6 rounded-3xl border text-xs sm:text-sm space-y-3",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200/80 text-slate-700 shadow-xs"
            )}>
              <span className={cn("font-bold block", isDarkMode ? "text-white" : "text-slate-900")}>
                Questions About Cookies or Privacy?
              </span>
              <p className={cn("text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                For any inquiries regarding data protection and cookie policies, please reach out to:
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline font-bold">
                  <Mail size={14} />
                  <span>{SITE_CONFIG.supportEmail}</span>
                </a>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline font-bold">
                  <Phone size={14} />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </LandingLayout>
  );
}

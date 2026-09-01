'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, ShieldCheck, Check, Mail, Phone } from 'lucide-react';

export default function CookiePreferencesModal({ isOpen, onClose, onSave }) {
  const [preferences, setPreferences] = useState({
    essential: true,
    preference: true,
    analytics: false,
    functional: true,
  });

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

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
    } catch (e) {
      console.error('Failed to save cookie preferences:', e);
    }

    onSave && onSave(consentObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white relative flex items-center justify-between shrink-0 text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
              <Cookie size={12} />
              <span>AISA™ PRIVACY &amp; COOKIES</span>
            </div>
            <h3 
              className="text-2xl sm:text-3xl font-bold text-white font-serif leading-tight" 
              style={serifStyle}
            >
              Cookie Preferences
            </h3>
            <p className="text-xs text-slate-300">
              Control your cookie and local storage settings anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - Scrollable Content with User Specifications */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-slate-700 custom-scrollbar flex-1">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium leading-relaxed">
            This Cookie Policy explains how <strong>AISA™</strong> uses cookies and similar technologies to enhance your experience. You can control cookie preferences anytime.
          </div>

          {/* Section 1: What Are Cookies? */}
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-sans font-bold flex items-center justify-center">1</span>
              What Are Cookies?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">Definition</span>
                <span className="text-slate-600 text-[11px] block">Small text files placed on your device when you visit AISA™</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">Purpose</span>
                <span className="text-slate-600 text-[11px] block">Recognize you and remember your preferences</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">Duration</span>
                <span className="text-slate-600 text-[11px] block">Some expire when you close browser, others persist longer</span>
              </div>
            </div>
          </section>

          {/* Section 2: Types of Cookies We Use */}
          <section className="space-y-3">
            <h4 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-sans font-bold flex items-center justify-center">2</span>
              Types of Cookies We Use
            </h4>
            
            <div className="space-y-2.5">
              
              {/* Essential */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Essential (Required)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">Required</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Authentication, session management, security.</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
              </div>

              {/* Preference */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Preference Cookies</span>
                  <p className="text-[11px] text-slate-600">Language, theme (light/dark), notification settings.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={preferences.preference}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preference: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Functional */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Functional Cookies</span>
                  <p className="text-[11px] text-slate-600">Chat history sync, AI agent selection, feature preferences.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Analytics (Optional)</span>
                  <p className="text-[11px] text-slate-600">Usage tracking with your consent to improve services.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

            </div>
          </section>

          {/* Section 3: Local Storage & Session Storage */}
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-sans font-bold flex items-center justify-center">3</span>
              Local Storage &amp; Session Storage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-slate-900 block">Chat Sessions</span>
                <span className="text-slate-600 text-[11px] block">Stored locally for quick access and offline capability</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-slate-900 block">User Preferences</span>
                <span className="text-slate-600 text-[11px] block">Settings like AI agent and interface customizations</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-slate-900 block">Session Management</span>
                <span className="text-slate-600 text-[11px] block">Active chat state, expires when browser closes</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <span className="font-bold text-slate-900 block">Data Control</span>
                <span className="text-slate-600 text-[11px] block">Delete individual chats or clear all data anytime</span>
              </div>
            </div>
          </section>

          {/* Section 4: Third-Party Cookies */}
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-sans font-bold flex items-center justify-center">4</span>
              Third-Party Cookies
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>Analytics</strong>: Anonymized usage data to understand engagement</li>
              <li><strong>AI Providers</strong>: Secure query processing with encryption</li>
              <li><strong>Payment</strong>: Fraud prevention during transactions</li>
              <li><strong>Control</strong>: Review partner privacy policies for their practices</li>
            </ul>
          </section>

          {/* Section 5: Your Cookie Choices */}
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-sans font-bold flex items-center justify-center">5</span>
              Your Cookie Choices
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>Browser Controls</strong>: Block, delete, or get warnings about cookies</li>
              <li><strong>Opt-Out</strong>: Disable analytics from profile settings under Privacy &amp; Data</li>
              <li><strong>Do Not Track</strong>: We respect DNT signals from your browser</li>
              <li><strong>Impact</strong>: Blocking may limit features like auto-login and preferences</li>
            </ul>
          </section>

          {/* Questions About Cookies? */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 space-y-2">
            <span className="font-bold text-emerald-950 block">Questions About Cookies?</span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <a href="mailto:admin@uwo24.com" className="flex items-center gap-1.5 text-emerald-800 hover:underline font-bold">
                <Mail size={13} />
                <span>admin@uwo24.com</span>
              </a>
              <a href="tel:+918358990909" className="flex items-center gap-1.5 text-emerald-800 hover:underline font-bold">
                <Phone size={13} />
                <span>+91 83589 90909</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Save Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-200/60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}

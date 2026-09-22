'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  MessageSquare, 
  Zap, 
  Bot, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Mail, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export default function AboutClient() {
  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="text-emerald-400 font-bold text-xs sm:text-sm hover:text-emerald-300 transition-colors inline-flex items-center gap-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 border border-emerald-500/30 p-0.5 flex items-center justify-center">
                <img src="/favicon.png" alt="UWO Connect" className="w-full h-full object-contain rounded-lg" width={32} height={32} />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight italic font-serif" style={serifStyle}>
                UWO <span className="text-emerald-500">Connect</span>
              </span>
            </Link>
          </div>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-700/20 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Building2 size={14} />
            <span>ENTERPRISE PLATFORM</span>
          </div>
          <h1 
            className="text-4xl sm:text-6xl font-bold tracking-tight text-white italic font-serif leading-tight" 
            style={serifStyle}
          >
            About UWO Connect
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Enterprise Business Communication, Multi-Channel Messaging &amp; AI Workflow Platform operated by Aisa Technologies.
          </p>
        </section>

        {/* Section 1: Who We Are */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white italic font-serif" style={serifStyle}>
              Who We Are
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-1 sm:pl-13">
            <strong className="text-white">UWO Connect</strong> (operated by Aisa Technologies) is a premier enterprise SaaS platform providing official WhatsApp Business Meta API integration, multi-channel inbox unified messaging, AI assistant automation, and CRM workflow management.
          </p>
        </section>

        {/* Section 2: Our Services & Products */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Layers size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white italic font-serif" style={serifStyle}>
              Our Services &amp; Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <MessageSquare size={18} />
                <span>WhatsApp Meta Cloud API</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Verified business messaging, broadcast campaigns, and automated message templates integrated with Meta Cloud API.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <Zap size={18} />
                <span>No-Code Workflow Builder</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Custom drag-and-drop conversational bot triggers, multi-step customer journeys, and automated routing rules.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <Bot size={18} />
                <span>AI Customer Assistant</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Intelligent RAG vector database document search answering business inquiries automatically 24/7 with zero hallucinations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <Cpu size={18} />
                <span>Unified Team Inbox</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Single unified dashboard for multi-agent support across WhatsApp, Instagram Direct, and Facebook Messenger.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Subscription Software Model */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Cpu size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white italic font-serif" style={serifStyle}>
              Subscription Software Model
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-1 sm:pl-13">
            UWO Connect operates on a cloud subscription model offering tiered software plans (Starter, Growth, and Advanced/Enterprise) billed monthly or annually. Subscriptions grant businesses full access to our cloud dashboard, API webhooks, team licenses, and automated message broadcasting.
          </p>
        </section>

        {/* Section 4: Security & Compliance */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white italic font-serif" style={serifStyle}>
              Security &amp; Compliance
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-1 sm:pl-13">
            We prioritize enterprise-grade data security with 256-bit SSL encryption, granular role permissions, and full Meta API compliance for secure business communications.
          </p>
        </section>

        {/* Official Entity & Contact Details */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Official Organization Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-slate-400 block font-bold">Registered Entity</span>
              <span className="font-extrabold text-white text-sm">UWO Connect / Aisa Technologies</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-bold">Official Website</span>
              <a 
                href={`https://${SITE_CONFIG.domain}`} 
                target="_blank" 
                rel="noreferrer"
                className="font-extrabold text-emerald-400 hover:underline flex items-center gap-1.5 text-sm"
              >
                <Globe size={14} />
                <span>{SITE_CONFIG.domain}</span>
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-bold">Contact Email</span>
              <a 
                href={`mailto:${SITE_CONFIG.supportEmail}`} 
                className="font-extrabold text-emerald-400 hover:underline flex items-center gap-1.5 text-sm"
              >
                <Mail size={14} />
                <span>{SITE_CONFIG.supportEmail}</span>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="text-center pt-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 px-4 text-center text-xs text-slate-400 space-y-3 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
          <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">Terms &amp; Conditions</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/cookie-policy" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
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

'use client';

import React from 'react';
import { 
  X, 
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
  Mail 
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-emerald-950/30 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white relative flex items-center justify-between border-b border-slate-800 shrink-0 text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Building2 size={13} />
              <span>ENTERPRISE PLATFORM</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white italic font-serif leading-tight" 
              style={serifStyle}
            >
              About Uwo Connect
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium">
              <span>Enterprise Business Communication &amp; AI Workflow Platform</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all cursor-pointer shadow-sm shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-left text-slate-700 text-sm leading-relaxed space-y-8 custom-scrollbar">
          
          {/* Section 1: Who We Are */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Sparkles size={18} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 italic font-serif" style={serifStyle}>
                Who We Are
              </h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-12">
              <strong className="text-slate-900">Uwo Connect</strong> (operated by Aisa Technologies) is a premier enterprise SaaS platform providing official WhatsApp Business Meta API integration, multi-channel inbox unified messaging, AI assistant automation, and CRM workflow management.
            </p>
          </section>

          {/* Section 2: Our Services & Products */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Layers size={18} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 italic font-serif" style={serifStyle}>
                Our Services &amp; Products
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <MessageSquare size={15} />
                  <span>WhatsApp Meta Cloud API</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Verified business messaging, broadcast campaigns, and automated message templates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Zap size={15} />
                  <span>No-Code Workflow Builder</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Custom drag-and-drop conversational bot triggers and multi-step customer journeys.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Bot size={15} />
                  <span>AI Customer Assistant</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Intelligent RAG vector database document search answering business inquiries automatically 24/7.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Cpu size={15} />
                  <span>Unified Team Inbox</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Single dashboard for multi-agent support across WhatsApp, Instagram Direct, and Facebook Messenger.
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Subscription Software Model */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Cpu size={18} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 italic font-serif" style={serifStyle}>
                Subscription Software Model
              </h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-12">
              Uwo Connect operates on a cloud subscription model offering tiered software plans (Starter, Growth, and Enterprise) billed monthly or annually. Subscriptions grant businesses full access to our cloud dashboard, API webhooks, team licenses, and automated message broadcasting.
            </p>
          </section>

          {/* Section 4: Security & Compliance */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 italic font-serif" style={serifStyle}>
                Security &amp; Compliance
              </h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-12">
              We prioritize enterprise-grade data security with 256-bit SSL encryption, granular role permissions, and full Meta API compliance for secure business communications.
            </p>
          </section>

          {/* Registered Business & Contact Card */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>Official Organization Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
              <div>
                <span className="text-slate-500 block font-bold">Registered Entity</span>
                <span className="font-extrabold text-slate-900">Uwo Connect / Aisa Technologies</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">Official Website</span>
                <a 
                  href="https://uwoconnect.aisa24.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-extrabold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Globe size={12} />
                  <span>uwoconnect.aisa24.com</span>
                </a>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">Contact Email</span>
                <a 
                  href="mailto:support@uwo24.com" 
                  className="font-extrabold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Mail size={12} />
                  <span>support@uwo24.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">© {new Date().getFullYear()} Uwo Connect</span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

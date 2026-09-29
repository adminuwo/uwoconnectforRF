'use client';

import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Copy, Check, Cpu, CheckCircle2, ShieldCheck, Mail, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomPlanSection({ isDarkMode = false }) {
  const [copied, setCopied] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState([
    'Advanced Automation',
    'AI Integration',
    'Business Workflow Solutions'
  ]);

  const capabilities = [
    {
      id: 'website-building',
      emoji: '🌐',
      title: 'Website Building',
      desc: 'Create a new professional website from scratch.',
      tag: 'Frontend & UI'
    },
    {
      id: 'website-revamp',
      emoji: '🔄',
      title: 'Website Revamp',
      desc: 'Redesign, modernize, and improve your existing website.',
      tag: 'Modern UX'
    },
    {
      id: 'advanced-automation',
      emoji: '⚙️',
      title: 'Advanced Automation',
      desc: 'Automate repetitive business processes and workflows.',
      tag: 'Workflow Logic'
    },
    {
      id: 'ai-integration',
      emoji: '🤖',
      title: 'AI Integration',
      desc: 'Add AI-powered features, assistants, and intelligent workflows.',
      tag: 'GenAI & LLM'
    },
    {
      id: 'third-party-integrations',
      emoji: '🔗',
      title: 'Third-Party Integrations',
      desc: 'Connect your platform with the tools and services you already use.',
      tag: 'APIs & Webhooks'
    },
    {
      id: 'custom-features',
      emoji: '📱',
      title: 'Custom Features',
      desc: 'Build features specifically for your business needs.',
      tag: 'Proprietary IP'
    },
    {
      id: 'platform-improvements',
      emoji: '🛠️',
      title: 'Platform Improvements',
      desc: 'Optimize, upgrade, or extend your existing system.',
      tag: 'Performance & Scale'
    },
    {
      id: 'business-workflow-solutions',
      emoji: '📊',
      title: 'Business Workflow Solutions',
      desc: 'Create customized digital workflows to make your operations faster and more efficient.',
      tag: 'Operations'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Tell Us What You Need',
      desc: 'Share your requirements, ideas, or the problem you want to solve.'
    },
    {
      step: '02',
      title: 'We Understand Your Requirements',
      desc: 'Our team reviews your needs and determines the right solution.'
    },
    {
      step: '03',
      title: 'Get Your Custom Plan',
      desc: "You'll receive a customized scope, timeline, and pricing based on your requirements."
    },
    {
      step: '04',
      title: 'We Build & Deliver',
      desc: 'Once approved, we start building your customized solution.'
    }
  ];

  const toggleCapability = (title) => {
    setSelectedCapabilities((prev) =>
      prev.includes(title)
        ? prev.length > 1
          ? prev.filter((item) => item !== title)
          : prev
        : [...prev, title]
    );
  };

  const handleEmailClick = (e) => {
    e?.preventDefault();
    const recipient = 'connect@uwo24.com';
    const subject = encodeURIComponent('Custom Plan Request - UWO Connect');
    const selectedList = selectedCapabilities.join('\n- ');
    const body = encodeURIComponent(
      `Hello UWO Connect Team,\n\nI am interested in a Custom Plan for my business.\n\nSelected Capabilities Needed:\n- ${selectedList}\n\nBusiness Name: \nExpected Volume / Channels: \nContact Number: \n\nThank you!`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    try {
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.click();
    } catch (_) {}
  };

  const handleCopyEmail = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('connect@uwo24.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full mt-12 text-left font-sans">
      <div
        className={cn(
          "relative rounded-3xl sm:rounded-[2.5rem] border p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-300 shadow-xl",
          isDarkMode
            ? "bg-slate-950/95 border-slate-800 text-white shadow-2xl shadow-emerald-950/20"
            : "bg-white border-slate-200/90 text-slate-900 shadow-xl shadow-slate-200/50"
        )}
      >
        {/* Ambient Subtle Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 1. HEADER: CUSTOM PLAN & ARCHITECTURE CONSULTING              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 max-w-4xl space-y-4 pb-8 border-b", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase",
              isDarkMode
                ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            )}
          >
            <Sparkles size={13} className="text-emerald-500 shrink-0" />
            <span>BESPOKE ENTERPRISE ARCHITECTURE</span>
          </div>

          <div className="space-y-1">
            <h2 className={cn("text-3xl sm:text-5xl font-black tracking-tight leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>
              Custom Plan
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-[#0B8F78]">
              Build What You Actually Need
            </p>
          </div>

          <div className="space-y-2 text-sm sm:text-base font-normal leading-relaxed max-w-3xl">
            <p className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
              Every business is different. If our standard plans don't cover your requirements, create a <strong className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>Custom Plan</strong> designed specifically for your business, workflow, and goals.
            </p>
            <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
              Whether you need a new website, want to revamp your existing platform, or need advanced automation — we can build a solution around your exact requirements.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 2. INTERACTIVE CAPABILITY SELECTOR (NO GENERIC CARDS)          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 py-10 border-b space-y-8", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block mb-1">
                INTERACTIVE ARCHITECTURE DESIGNER
              </span>
              <h3 className={cn("text-2xl sm:text-3xl font-extrabold tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>
                What You Can Request
              </h3>
              <p className={cn("text-xs sm:text-sm font-normal mt-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                Click capabilities below to compose your bespoke operational scope.
              </p>
            </div>
            <div className="text-xs font-medium text-slate-500">
              <span className="font-bold text-emerald-600">{selectedCapabilities.length}</span> of {capabilities.length} capabilities selected
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {capabilities.map((item) => {
              const isSelected = selectedCapabilities.includes(item.title);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCapability(item.title)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between group",
                    isSelected
                      ? isDarkMode
                        ? "bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/30"
                        : "bg-emerald-50/70 border-emerald-500/80 shadow-sm ring-1 ring-emerald-500/20"
                      : isDarkMode
                        ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                        : "bg-slate-50/60 border-slate-200/70 hover:border-slate-300 hover:bg-white"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl leading-none">{item.emoji}</span>
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                        isSelected
                          ? "bg-[#0B8F78] text-white"
                          : isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400"
                      )}>
                        {isSelected ? <Check size={12} strokeWidth={3} /> : '+'}
                      </span>
                    </div>
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold transition-colors leading-snug",
                        isSelected
                          ? isDarkMode ? "text-emerald-300" : "text-emerald-900"
                          : isDarkMode ? "text-slate-200" : "text-slate-800"
                      )}>
                        {item.title}
                      </h4>
                      <p className={cn(
                        "text-xs leading-relaxed mt-1 font-normal",
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      )}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>{item.tag}</span>
                    <span className={cn(isSelected ? "text-emerald-600 font-bold" : "opacity-0 group-hover:opacity-100")}>
                      {isSelected ? 'Active Scope' : 'Add to Scope'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Scope Summary Bar */}
          <div className={cn(
            "p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4",
            isDarkMode
              ? "bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-slate-800"
              : "bg-gradient-to-r from-slate-50 via-white to-emerald-50/60 border-slate-200"
          )}>
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 justify-center md:justify-start">
                <Cpu size={14} /> Custom Scope Specification
              </span>
              <p className={cn("text-xs sm:text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                Selected: <strong className="text-emerald-600">{selectedCapabilities.join(', ')}</strong>
              </p>
            </div>
            <button
              onClick={handleEmailClick}
              className="px-6 py-3 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-md shadow-emerald-800/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <Send size={14} />
              <span>Request Custom Scope</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 3. HOW IT WORKS (EDITORIAL TIMELINE, NO REPETITIVE CARDS)      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 py-10 border-b space-y-8", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
              ENGAGEMENT LIFECYCLE
            </span>
            <h3 className={cn("text-2xl sm:text-3xl font-extrabold tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>
              How It Works
            </h3>
            <p className={cn("text-xs sm:text-sm font-normal", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              From initial discovery to enterprise deployment in 4 streamlined phases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => (
              <div key={st.step} className="relative group text-left space-y-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all",
                    isDarkMode
                      ? "bg-slate-800 text-emerald-400 group-hover:bg-[#0B8F78] group-hover:text-white"
                      : "bg-emerald-50 text-[#0B8F78] border border-emerald-200 group-hover:bg-[#0B8F78] group-hover:text-white"
                  )}>
                    {st.step}
                  </span>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 hidden lg:block group-last:hidden" />
                </div>
                <h4 className={cn("text-base font-bold transition-colors leading-snug pt-1", isDarkMode ? "text-white" : "text-slate-900")}>
                  {st.title}
                </h4>
                <p className={cn("text-xs leading-relaxed font-normal", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 4. DIRECT CONTACT & ACTION BAR                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-slate-900")}>
              Speak Directly with Our Solution Architects
            </h4>
            <p className={cn("text-xs sm:text-sm font-normal", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              Send your scope overview to <strong className="text-emerald-600">connect@uwo24.com</strong> or launch instant email composer.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={handleEmailClick}
              className="px-6 py-3.5 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-lg shadow-emerald-700/20 inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mail size={16} />
              <span>Contact via Email</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={handleCopyEmail}
              className={cn(
                "px-5 py-3.5 rounded-xl border text-xs font-bold inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer",
                copied
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
              )}
            >
              {copied ? (
                <>
                  <Check size={15} />
                  <span>connect@uwo24.com Copied</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Copy connect@uwo24.com</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

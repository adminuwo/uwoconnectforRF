'use client';

import React from 'react';
import { 
  Sparkles, ArrowRight, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomPlanSection({ isDarkMode = false }) {
  const [copied, setCopied] = React.useState(false);

  const handleEmailClick = (e) => {
    e?.preventDefault();
    const recipient = 'admin@uwo24.com';
    const subject = encodeURIComponent('Custom Plan Request - UWO Connect');
    const body = encodeURIComponent(
      'Hello UWO Connect Team,\n\nI am interested in a Custom Plan for my business.\n\nBusiness Name: \nRequirements / Features Needed: \nExpected Volume / Channels: \nContact Number: \n\nThank you!'
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // 1. Direct open in Gmail Web (guaranteed to open compose tab in Chrome/Windows)
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // 2. Also trigger mailto in background in case desktop app is preferred
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
      navigator.clipboard.writeText('admin@uwo24.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const requestItems = [
    {
      emoji: '🌐',
      title: 'Website Building',
      desc: 'Create a new professional website from scratch.'
    },
    {
      emoji: '🔄',
      title: 'Website Revamp',
      desc: 'Redesign, modernize, and improve your existing website.'
    },
    {
      emoji: '⚙️',
      title: 'Advanced Automation',
      desc: 'Automate repetitive business processes and workflows.'
    },
    {
      emoji: '🤖',
      title: 'AI Integration',
      desc: 'Add AI-powered features, assistants, and intelligent workflows.'
    },
    {
      emoji: '🔗',
      title: 'Third-Party Integrations',
      desc: 'Connect your platform with the tools and services you already use.'
    },
    {
      emoji: '📱',
      title: 'Custom Features',
      desc: 'Build features specifically for your business needs.'
    },
    {
      emoji: '🛠️',
      title: 'Platform Improvements',
      desc: 'Optimize, upgrade, or extend your existing system.'
    },
    {
      emoji: '📊',
      title: 'Business Workflow Solutions',
      desc: 'Create customized digital workflows to make your operations faster and more efficient.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Tell Us What You Need',
      desc: 'Share your requirements, ideas, or the problem you want to solve.'
    },
    {
      step: '2',
      title: 'We Understand Your Requirements',
      desc: 'Our team reviews your needs and determines the right solution.'
    },
    {
      step: '3',
      title: 'Get Your Custom Plan',
      desc: "You'll receive a customized scope, timeline, and pricing based on your requirements."
    },
    {
      step: '4',
      title: 'We Build & Deliver',
      desc: 'Once approved, we start building your customized solution.'
    }
  ];

  return (
    <div className="w-full mt-12 text-left font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div
        className={cn(
          "relative rounded-3xl sm:rounded-[2.5rem] border p-6 sm:p-10 lg:p-14 overflow-hidden transition-all duration-300 shadow-xl",
          isDarkMode
            ? "bg-slate-950/95 border-slate-800 text-white shadow-2xl shadow-emerald-950/30"
            : "bg-white border-slate-200/90 text-slate-900 shadow-xl shadow-slate-200/50"
        )}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 1. HEADER: CUSTOM PLAN & BUILD WHAT YOU ACTUALLY NEED          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 max-w-4xl space-y-4 pb-8 border-b", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-black tracking-wider uppercase",
              isDarkMode
                ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            )}
          >
            <Sparkles size={13} className="text-emerald-500 shrink-0" />
            <span>BESPOKE TAILORED ARCHITECTURE</span>
          </div>

          <h2
            className={cn(
              "text-3xl sm:text-5xl font-bold tracking-tight italic leading-tight",
              isDarkMode ? "text-white" : "text-slate-900"
            )}
            style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
          >
            Custom Plan
          </h2>

          <h3
            className={cn(
              "text-xl sm:text-2xl font-bold tracking-tight",
              isDarkMode ? "text-emerald-400" : "text-[#059669]"
            )}
          >
            Build What You Actually Need
          </h3>

          <div className="space-y-2 text-sm sm:text-base font-medium leading-relaxed max-w-3xl">
            <p className={isDarkMode ? "text-slate-200" : "text-slate-600"}>
              Every business is different. If our standard plans don't cover your requirements, create a <span className={cn("font-bold", isDarkMode ? "text-emerald-400" : "text-emerald-600")}>Custom Plan</span> designed specifically for your business, workflow, and goals.
            </p>
            <p className={isDarkMode ? "text-slate-300" : "text-slate-500"}>
              Whether you need a new website, want to revamp your existing platform, or need advanced automation — we can build a solution around your exact requirements.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 2. WHAT YOU CAN REQUEST                                       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 py-10 border-b space-y-6", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div className="space-y-1">
            <h4
              className={cn(
                "text-2xl sm:text-3xl font-bold italic tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              What You Can Request
            </h4>
            <p className={cn("text-xs sm:text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-500")}>
              Select any combination of specialized solutions tailored to your operational scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {requestItems.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1",
                  isDarkMode
                    ? "bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850"
                    : "bg-slate-50/80 border-slate-200/90 hover:border-emerald-300 hover:bg-white hover:shadow-md"
                )}
              >
                <div className="space-y-2.5">
                  <span className="text-2xl sm:text-3xl block leading-none filter drop-shadow-xs">
                    {item.emoji}
                  </span>
                  <h5 className={cn("text-base font-black transition-colors", isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-700")}>
                    {item.title}
                  </h5>
                  <p className={cn("text-xs font-medium leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 3. HOW IT WORKS                                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className={cn("relative z-10 py-10 border-b space-y-6", isDarkMode ? "border-slate-800" : "border-slate-100")}>
          <div className="space-y-1">
            <h4
              className={cn(
                "text-2xl sm:text-3xl font-bold italic tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              How It Works
            </h4>
            <p className={cn("text-xs sm:text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-500")}>
              From discovery to final delivery, our engineering team works directly with you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-5 sm:p-6 rounded-2xl border relative flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1",
                  isDarkMode
                    ? "bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850"
                    : "bg-slate-50/60 border-slate-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-md"
                )}
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {s.step}
                  </div>

                  <h5 className={cn("text-base font-black transition-colors", isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-700")}>
                    {s.step}. {s.title}
                  </h5>

                  <p className={cn("text-xs font-medium leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 4. NEED SOMETHING BEYOND THE STANDARD PLANS? & CTA            */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "relative z-10 mt-8 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left transition-all",
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/50 border-slate-800"
              : "bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border-emerald-200/90 shadow-sm"
          )}
        >
          <div className="space-y-2 max-w-2xl">
            <h4
              className={cn(
                "text-2xl sm:text-3xl font-bold italic tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Need Something Beyond the Standard Plans?
            </h4>

            <p className={cn("text-sm sm:text-base font-black", isDarkMode ? "text-emerald-400" : "text-[#059669]")}>
              Don't limit your business to a fixed package.
            </p>

            <p className={cn("text-xs sm:text-sm font-medium leading-relaxed", isDarkMode ? "text-slate-200" : "text-slate-600")}>
              Tell us what you want to build, improve, or automate, and we'll create a plan around it.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-end gap-2.5">
            <button
              type="button"
              onClick={handleEmailClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl sm:rounded-2xl bg-[#059669] hover:bg-emerald-600 text-white text-sm font-black shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Request a Custom Plan</span>
              <ArrowRight size={16} />
            </button>

            <div className={cn("flex items-center gap-1.5 text-xs", isDarkMode ? "text-slate-300" : "text-slate-500")}>
              <span>Direct:</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={cn("font-bold hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0", isDarkMode ? "text-emerald-400" : "text-emerald-600")}
                title="Click to copy email address"
              >
                <span>admin@uwo24.com</span>
                {copied ? (
                  <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-bold", isDarkMode ? "text-emerald-400" : "text-emerald-600")}>
                    <Check size={12} className="stroke-[3]" /> Copied!
                  </span>
                ) : (
                  <Copy size={12} className="opacity-70 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

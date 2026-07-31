'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Zap, Clock, ShieldCheck, CheckCircle2, ArrowRight, Play, Database, Layers, UserCheck } from 'lucide-react';

export default function DailyImpactSection({ isDark = true }) {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      id: "lead-qualification",
      title: "AI Lead Qualification",
      headline: "Wake up to qualified leads, not a cluttered inbox.",
      desc: "Our AI assistant engages incoming leads 24/7, asks qualifying questions based on your custom criteria, and routes hot prospects directly to your sales team.",
      impactMetric: "+340% Lead Conversion Rate",
      icon: UserCheck,
      badge: "24/7 Autopilot",
      highlights: [
        "Instant intent classification (Hot, Warm, Cold)",
        "Automated budget & timeline qualification",
        "Direct CRM sync and instant WhatsApp notifications"
      ],
      previewContent: {
        chatUser: "Hi, I need enterprise pricing for 50 users.",
        aiResponse: "Hello! I can help with that. Our Growth Plan covers up to 50 licenses with custom AI agents at ₹7,999/mo. Would you like a 1-on-1 demo with our senior solution advisor today?",
        status: "Lead Qualified • Priority: High"
      }
    },
    {
      id: "omnichannel-sync",
      title: "Omnichannel Thread Sync",
      headline: "All customer history, one unified thread.",
      desc: "No more asking customers to repeat themselves. Conversations across WhatsApp Business API, Instagram Direct, Facebook Messenger, and Web Chat merge seamlessly.",
      impactMetric: "100% Cross-Channel Context",
      icon: Layers,
      badge: "Unified Workspace",
      highlights: [
        "Single dashboard for WhatsApp, Meta & Web Chat",
        "Universal customer timeline & purchase history",
        "Multi-agent internal notes & collision detection"
      ],
      previewContent: {
        chatUser: "I messaged on Instagram yesterday about Order #9482.",
        aiResponse: "Found your record! Order #9482 was shipped yesterday via BlueDart tracking #BD83912. Current status: Out for delivery.",
        status: "Context Synced Across Channels"
      }
    },
    {
      id: "automated-workflows",
      title: "Automated Workflows",
      headline: "Automate routine tasks, reclaim 15+ hours every week.",
      desc: "Build powerful no-code automation workflows to handle order updates, appointment booking, support tickets, and post-purchase follow-ups effortlessly.",
      impactMetric: "15+ Hours Saved / Week",
      icon: Clock,
      badge: "Zero Manual Repetition",
      highlights: [
        "Visual drag-and-drop workflow canvas",
        "Custom webhook triggers & REST API integration",
        "Automated Google Sheets & CRM lead sync"
      ],
      previewContent: {
        chatUser: "I would like to book a product demo for tomorrow 3 PM.",
        aiResponse: "Demo confirmed for tomorrow at 3:00 PM IST! Calendar invite & WhatsApp reminder scheduled.",
        status: "Workflow Executed • Webhook Triggered"
      }
    }
  ];

  const currentMod = modules[activeModule];
  const IconComp = currentMod.icon;

  return (
    <section className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#030712]' : 'bg-[#F1F5F9]'}`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest mb-6">
            <Zap size={14} />
            <span>Daily Business Transformation</span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Real-World Impact on Your <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Daily Operations.
            </span>
          </h2>
          <p className={`text-base md:text-lg font-medium ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
            See how UWO Connect simplifies team workflows, speeds up sales pipelines, and eliminates manual repetitive effort.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          {modules.map((mod, idx) => {
            const ModIcon = mod.icon;
            const isSelected = activeModule === idx;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(idx)}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02]'
                    : isDark
                    ? 'bg-slate-950/60 border-white/5 hover:border-white/20 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#10B981] text-black' : 'bg-white/10 text-white'}`}>
                    <ModIcon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${isSelected ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-slate-400'}`}>
                    {mod.badge}
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>{mod.title}</h3>
                <p className="text-xs text-[#8E99A8] line-clamp-2">{mod.headline}</p>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Box */}
        <div className={`border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors ${isDark ? 'bg-[#0B0D11] border-white/10' : 'bg-white border-emerald-100'}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold uppercase tracking-wider">
                <IconComp size={14} /> {currentMod.badge}
              </div>

              <h3 className={`text-2xl md:text-4xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentMod.headline}
              </h3>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
                {currentMod.desc}
              </p>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] font-extrabold text-sm flex items-center gap-3">
                <Sparkles size={18} />
                <span>Impact Metric: {currentMod.impactMetric}</span>
              </div>

              <ul className="space-y-3">
                {currentMod.highlights.map((h, i) => (
                  <li key={i} className={`flex items-center gap-3 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Live Interactive Simulator Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-white">Live AI Simulator</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">{currentMod.previewContent.status}</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Incoming customer message */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0">
                    User
                  </div>
                  <div className="bg-slate-900 border border-white/10 text-slate-200 p-3.5 rounded-2xl max-w-[85%] leading-relaxed">
                    {currentMod.previewContent.chatUser}
                  </div>
                </div>

                {/* Instant AI automated response */}
                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-black font-bold shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    AI
                  </div>
                  <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-white p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm">
                    {currentMod.previewContent.aiResponse}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

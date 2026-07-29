'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquare, Layers, Clock, Zap, ArrowRight, XCircle, TrendingUp, Sparkles, Inbox, RefreshCw } from 'lucide-react';

export default function BeforeAfterSection({ isDark = true }) {
  const [activeTab, setActiveTab] = useState('after'); // 'before' | 'after'

  return (
    <section className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0B0D11]' : 'bg-[#F8FAFC]'}`}>
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>The Transformation Journey</span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            From Disconnected Chaos to <br />
            <span className="bg-gradient-to-r from-emerald-400 via-[#10B981] to-teal-300 bg-clip-text text-transparent">
              Intelligent Connection.
            </span>
          </h2>
          <p className={`text-base md:text-lg font-medium ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
            Compare how business communication transforms when you switch from fragmented apps to UWO Connect's unified AI automation workspace.
          </p>

          {/* Interactive Toggle */}
          <div className="mt-10 inline-flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl">
            <button
              onClick={() => setActiveTab('before')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'before'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <XCircle size={16} /> Disconnected Reality (Before)
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'after'
                  ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 size={16} /> Intelligent Connection (After)
            </button>
          </div>
        </div>

        {/* Split Screen Contrast View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* BEFORE CARD */}
          <div
            className={`rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'before'
                ? 'bg-gradient-to-b from-red-950/30 to-slate-950 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)] scale-[1.02] z-20'
                : 'bg-slate-950/40 border-white/5 opacity-60 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Disconnected Reality</h3>
                    <p className="text-xs text-red-400 font-medium">Without UWO Connect</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-500/30">
                  Low Efficiency
                </span>
              </div>

              {/* Chaos Visual representation */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">⚠️ 15+ Tabs Open:</span>
                  <span>Constantly switching between WhatsApp Web, Instagram App, Gmail, Webchat & Excel sheets.</span>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">⏰ Slow Responses:</span>
                  <span>Leads wait 4–12 hours for reply after work hours, resulting in 60%+ lost sales opportunities.</span>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">🤯 Manual Burnout:</span>
                  <span>Support agents manually answer the exact same FAQ inquiries 100+ times every single day.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Customer Satisfaction: <strong className="text-red-400">42%</strong></span>
              <span>Lead Response Time: <strong className="text-red-400">~6 Hours</strong></span>
            </div>
          </div>

          {/* AFTER CARD */}
          <div
            className={`rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'after'
                ? 'bg-gradient-to-b from-[#10B981]/15 via-slate-950 to-slate-950 border-[#10B981]/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] scale-[1.02] z-20'
                : 'bg-slate-950/40 border-white/5 opacity-60 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#10B981]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center border border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Intelligent Connection</h3>
                    <p className="text-xs text-[#10B981] font-medium">Powered by UWO Connect AI</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#10B981]/40">
                  +340% Growth
                </span>
              </div>

              {/* Serene AI Visual representation */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0">⚡ 1 Unified Thread:</span>
                  <span>WhatsApp, Instagram, Email & Webchat merged into a single multi-agent collaborative workspace.</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0">🤖 24/7 AI Qualification:</span>
                  <span>Instant responses in under 2 seconds. RAG Vector AI answers complex queries & qualifies leads automatically.</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-[#10B981] font-bold shrink-0">📈 Automated Workflows:</span>
                  <span>Reclaim 15+ hours weekly. Auto-assign inquiries to agents, trigger webhooks, and log to CRM.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Customer Satisfaction: <strong className="text-[#10B981]">98%</strong></span>
              <span>Lead Response Time: <strong className="text-[#10B981]">Instant (&lt; 2s)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

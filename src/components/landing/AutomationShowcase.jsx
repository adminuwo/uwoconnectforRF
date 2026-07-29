'use client';

import React, { useState } from 'react';
import { Layers, Zap, Users, MessageSquare, BarChart, Settings, ArrowRight, Webhook, Brain, GitBranch, Database, Smartphone, Bell, Mail } from 'lucide-react';

export default function AutomationShowcase({ isDark = true }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <section className={`py-24 md:py-32 relative border-y ${isDark ? 'bg-[#0B0D11] border-white/5' : 'bg-white border-[#10B981]/10'}`}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest block mb-3">Versatility</span>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          One Platform. Endless Possibilities.
        </h2>
        <p className={`text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
          Whether you're generating leads or scaling operations, UWO Connect helps every team work smarter with connected data, AI-powered automation, and seamless collaboration.
        </p>

        <div className={`max-w-5xl mx-auto rounded-[32px] p-8 md:p-12 relative overflow-hidden border ${isDark
            ? 'bg-slate-950/40 border-white/5 shadow-2xl'
            : 'bg-white/60 border-[#059669]/10 backdrop-blur-xl shadow-xl'
          }`}>
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A085]/10 rounded-full blur-[80px]" />

          {/* UI Mockup Header */}
          <div className={`flex justify-between items-center mb-12 border-b pb-6 ${isDark ? 'border-white/5' : 'border-[#059669]/10'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <Settings size={18} className={isDark ? 'text-[#8E99A8]' : 'text-slate-500'} />
              </div>
              <div>
                <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Lead Qualification Flow</h4>
                <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-wider">Active • 1,204 runs today</span>
              </div>
            </div>
            <button className="btn-accent px-6 py-3">Edit Flow</button>
          </div>

          {/* Visual Canvas */}
          <div className="relative flex flex-col gap-10 py-8">
            {/* Row 1: Pipeline Inbound */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative">
              {/* Connection Line Desktop */}
              <div className={`hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 -translate-y-1/2 z-0 ${isDark ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/40 to-emerald-500/10' : 'bg-gradient-to-r from-[#059669]/10 via-[#059669]/30 to-[#059669]/10'
                }`} />

              {/* Step 1: Webhook */}
              <div className="relative z-10 group" onMouseEnter={() => setHoveredNode('webhook')} onMouseLeave={() => setHoveredNode(null)}>
                <div className={`rounded-2xl p-5 w-52 border transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${isDark ? 'bg-slate-900/40 border-white/10' : 'border-[#059669]/15 bg-white shadow-sm'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#20C997]">
                      <Webhook size={18} />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-[#20C997] font-bold">Trigger</span>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Inbound Webhook</h5>
                    </div>
                  </div>
                  <p className={`text-[10px] leading-relaxed text-left ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>New lead submitted via contact form or ad landing page.</p>
                </div>
              </div>

              <ArrowRight className="text-[#8E99A8] shrink-0 md:rotate-0 rotate-90" size={16} />

              {/* Step 2: AI Screening */}
              <div className="relative z-10 group" onMouseEnter={() => setHoveredNode('ai')} onMouseLeave={() => setHoveredNode(null)}>
                <div className={`rounded-2xl p-5 w-52 border transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${isDark ? 'bg-slate-900/40 border-white/10' : 'border-[#059669]/15 bg-white shadow-sm'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Brain size={18} />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-purple-400 font-bold">AI Agent</span>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Intent Classifier</h5>
                    </div>
                  </div>
                  <p className={`text-[10px] leading-relaxed text-left ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>Evaluates intent, qualifies interest level, & extracts core entities.</p>
                </div>
              </div>

              <ArrowRight className="text-[#8E99A8] shrink-0 md:rotate-0 rotate-90" size={16} />

              {/* Step 3: Decision Gate */}
              <div className="relative z-10 group" onMouseEnter={() => setHoveredNode('gate')} onMouseLeave={() => setHoveredNode(null)}>
                <div className={`rounded-2xl p-5 w-52 border transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${isDark ? 'bg-slate-900/40 border-[#20C997]/30' : 'border-[#059669]/30 bg-white shadow-sm'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                      <GitBranch size={18} />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-amber-500 font-bold">Filter Gate</span>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Is Qualified?</h5>
                    </div>
                  </div>
                  <p className={`text-[10px] leading-relaxed text-left ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>Splits workflow path based on classified lead intent query.</p>
                </div>
              </div>
            </div>

            {/* Connection Lines from Row 1 to Row 2 */}
            <div className="hidden md:flex justify-around px-24 relative -my-6 h-12 z-0">
              {/* Yes branch line */}
              <div className="w-1/2 border-l-2 border-dashed border-emerald-500/20 flex flex-col justify-end items-start pl-4">
                <span className={`text-[9px] uppercase tracking-wider text-emerald-500 font-bold px-2 py-0.5 rounded border ${isDark ? 'bg-[#030712] border-emerald-500/10' : 'bg-[#F3FBF7] border-emerald-500/20'
                  }`}>Yes (Qualified)</span>
              </div>
              {/* No branch line */}
              <div className="w-1/2 border-r-2 border-dashed border-rose-500/20 flex flex-col justify-end items-end pr-4">
                <span className={`text-[9px] uppercase tracking-wider text-rose-500 font-bold px-2 py-0.5 rounded border ${isDark ? 'bg-[#030712] border-rose-500/10' : 'bg-[#F3FBF7] border-rose-500/20'
                  }`}>No (Not Qualified)</span>
              </div>
            </div>

            {/* Row 2: Branch Paths */}
            <div className="flex flex-col md:flex-row gap-12">

              {/* Branch YES Container */}
              <div className={`flex-1 rounded-3xl p-6 border flex flex-col gap-4 relative overflow-hidden ${isDark ? 'bg-slate-900/20 border-emerald-500/10' : 'bg-[#eefcf7] border-[#059669]/15 shadow-sm'
                }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold">Qualified Path</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4">
                  {/* 4a: CRM Log */}
                  <div className={`rounded-xl p-4 flex-1 w-full border ${isDark ? 'border-white/5 bg-slate-950/40' : 'border-[#059669]/10 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={14} className="text-[#20C997]" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 4a</span>
                    </div>
                    <h6 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>CRM Record Log</h6>
                    <p className={`text-[9px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Log new lead & append classification tags.</p>
                  </div>

                  <ArrowRight className="text-[#8E99A8] shrink-0 lg:rotate-0 rotate-90" size={12} />

                  {/* 5a: WhatsApp Reply */}
                  <div className={`rounded-xl p-4 flex-1 w-full border ${isDark ? 'border-white/5 bg-slate-950/40' : 'border-[#059669]/10 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone size={14} className="text-[#20C997]" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 5a</span>
                    </div>
                    <h6 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>WhatsApp Reply</h6>
                    <p className={`text-[9px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Send automated Calendly meeting invitation.</p>
                  </div>

                  <ArrowRight className="text-[#8E99A8] shrink-0 lg:rotate-0 rotate-90" size={12} />

                  {/* 6a: Slack Notify */}
                  <div className={`rounded-xl p-4 flex-1 w-full border ${isDark ? 'border-white/5 bg-slate-950/40' : 'border-[#059669]/10 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Bell size={14} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 6a</span>
                    </div>
                    <h6 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Slack Alert</h6>
                    <p className={`text-[9px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Alert internal sales channel of hot lead inbound.</p>
                  </div>
                </div>
              </div>

              {/* Branch NO Container */}
              <div className={`w-full md:w-80 rounded-3xl p-6 border flex flex-col gap-4 relative overflow-hidden ${isDark ? 'bg-slate-900/20 border-rose-500/10' : 'bg-[#fff5f5] border-rose-500/15 shadow-sm'
                }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-rose-400 font-bold">Unqualified Path</span>
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                </div>

                <div className="flex flex-col gap-4">
                  {/* 4b: Low priority tag */}
                  <div className={`rounded-xl p-4 border ${isDark ? 'border-white/5 bg-slate-950/40' : 'border-rose-500/10 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={14} className="text-rose-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 4b</span>
                    </div>
                    <h6 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Tag as Low-Priority</h6>
                    <p className={`text-[9px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sort lead score & update record index.</p>
                  </div>

                  {/* 5b: Email Nurture */}
                  <div className={`rounded-xl p-4 border ${isDark ? 'border-white/5 bg-slate-950/40' : 'border-rose-500/10 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={14} className="text-rose-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 5b</span>
                    </div>
                    <h6 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Email Nurturing</h6>
                    <p className={`text-[9px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trigger follow-up value newsletters weekly.</p>
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

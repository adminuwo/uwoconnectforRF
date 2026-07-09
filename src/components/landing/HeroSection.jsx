'use client';

import React from 'react';
import { Sparkles, MessageSquare, Database, Users, TrendingUp, Layers, Mail, Activity, Play } from 'lucide-react';

export default function HeroSection({ isDark = true }) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col lg:flex-row items-center gap-16 min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#10B981]/20 rounded-full blur-[120px] pointer-events-none animate-slow-glow" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#20C997]/15 rounded-full blur-[100px] pointer-events-none animate-slow-glow [animation-delay:3s]" />

      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left max-w-2xl relative z-10 animate-fade-in-up">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg text-[10px] uppercase tracking-widest font-bold text-[#20C997] mb-8 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#059669]/5 border-[#059669]/20'}`}
        >
          <Sparkles size={14} className="" />
          <span>The Next Generation OS</span>
        </div>

        <h1
          className={`text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          One AI Platform.<br />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.2)] ${isDark ? 'from-white to-emerald-400' : 'from-slate-900 to-emerald-700'}`}>Every Business Operation.</span>
        </h1>

        <p
          className={`text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}
        >
          Run your CRM, Marketing, Sales, Projects, Finance, HR, AI Automation, Communication, and Analytics from a single, unified enterprise intelligence kernel.
        </p>

        <div
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
        >
          <button className="btn-accent text-[12px] px-10 py-5 flex items-center gap-2">
            Start Free
            <Sparkles size={14} />
          </button>
          <button className="btn-secondary text-[12px] px-10 py-5">
            Book Demo
          </button>
        </div>
      </div>

      {/* Right Content - 3D Glass Dashboard */}
      <div className="flex-1 w-full max-w-[640px] relative z-10 perspective-1000 animate-float">
        <div
          className={`rounded-[32px] p-6 shadow-2xl relative overflow-hidden group transition-all duration-500 transform-gpu border ${
            isDark 
              ? 'bg-slate-950/40 border-white/5 backdrop-blur-xl' 
              : 'bg-white/60 border-[#059669]/10 backdrop-blur-xl'
          }`}
        >
          {/* Dashboard Header */}
          <div className={`flex items-center justify-between pb-6 border-b mb-6 ${isDark ? 'border-white/5' : 'border-[#059669]/10'}`}>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/20 border border-[#FF5F56]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/20 border border-[#FFBD2E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/20 border border-[#27C93F]/50" />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-2 ${isDark ? 'bg-white/5 text-[#8E99A8]' : 'bg-[#059669]/5 text-[#059669]'}`}>
                <Database size={10} className="text-[#20C997]" /> meta-connect.app
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Left Sidebar Miniature */}
            <div className={`w-12 flex flex-col gap-4 border-r pr-4 py-2 ${isDark ? 'border-white/10' : 'border-[#059669]/10'}`}>
              <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.25)] animate-pulse">
                <MessageSquare size={14} />
              </div>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${isDark ? 'bg-white/5 border-white/5 text-[#8E99A8] hover:text-white hover:bg-white/10' : 'bg-[#059669]/5 border-[#059669]/10 text-[#059669] hover:bg-[#059669]/10'}`}>
                <Users size={14} />
              </div>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${isDark ? 'bg-white/5 border-white/5 text-[#8E99A8] hover:text-white hover:bg-white/10' : 'bg-[#059669]/5 border-[#059669]/10 text-[#059669] hover:bg-[#059669]/10'}`}>
                <Database size={14} />
              </div>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${isDark ? 'bg-white/5 border-white/5 text-[#8E99A8] hover:text-white hover:bg-white/10' : 'bg-[#059669]/5 border-[#059669]/10 text-[#059669] hover:bg-[#059669]/10'}`}>
                <Activity size={14} />
              </div>
            </div>

            {/* Central Screen */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Sales Revenue */}
              <div className={`col-span-2 border p-4 rounded-2xl relative overflow-hidden backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-slate-900/60 border-white/5 text-white'
                  : 'bg-white/40 border-[#059669]/15 text-[#0f2d19] shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>Q3 Revenue Projection</span>
                    <div className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#2f593b]'}`}>$1.48M</div>
                  </div>
                  <div className={`px-2 py-1 border rounded-lg text-[10px] font-bold ${isDark ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-[#059669]/10 border-[#059669]/20 text-[#059669]'}`}>
                    +24.8%
                  </div>
                </div>
                <div className="h-12 w-full flex items-end gap-2">
                  {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
                    <div 
                      key={i}
                      style={{ height: `${height}%` }}
                      className="flex-1 bg-gradient-to-t from-[#10B981] to-[#20C997] rounded-t-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-y-110"
                    />
                  ))}
                </div>
              </div>

              {/* Live WhatsApp Queue */}
              <div className={`col-span-2 border p-4 rounded-2xl backdrop-blur-md ${
                isDark
                  ? 'bg-slate-900/60 border-white/5 text-white'
                  : 'bg-white/40 border-[#059669]/15 text-[#0f2d19] shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider ${isDark ? 'text-white' : 'text-[#2f593b]'}`}>Live Incoming Queue</span>
                  </div>
                  <span className={`text-[9px] font-bold ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>3 pending</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "John D.", msg: "Interested in upgrade...", time: "Just now" },
                    { name: "Sarah M.", msg: "When does it ship?", time: "2m ago" }
                  ].map((chat, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border transition-all hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-white/80 border-[#059669]/10 text-slate-700 shadow-sm'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[10px] font-bold text-[#10B981]">
                          {chat.name.charAt(0)}
                        </div>
                        <div>
                          <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{chat.name}</div>
                          <div className={`text-[9px] truncate w-32 ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>{chat.msg}</div>
                        </div>
                      </div>
                      <div className={`text-[8px] ${isDark ? 'text-[#8E99A8]' : 'text-slate-400'}`}>{chat.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRM Stats */}
              <div className={`col-span-2 border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md ${
                isDark
                  ? 'bg-slate-900/60 border-white/5 text-white'
                  : 'bg-white/40 border-[#059669]/15 text-[#0f2d19] shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-[#059669]/10 border-[#059669]/20 text-[#059669]'}`}>
                    <Users size={16} />
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>Active CRM Contacts</div>
                    <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#2f593b]'}`}>12,842</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 overflow-hidden ${isDark ? 'bg-[#171A20] border-[#101B2D]' : 'bg-white border-[#f0fdf4]'}`}>
                      <div className="w-full h-full bg-gradient-to-br from-[#10B981] to-[#059669] opacity-70" />
                    </div>
                  ))}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold backdrop-blur-sm ${isDark ? 'bg-white/10 border-[#101B2D] text-white' : 'bg-[#059669]/10 border-[#f0fdf4] text-[#059669]'}`}>
                    +99
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#20C997]/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}




'use client';

import React from 'react';
import { Sparkles, MessageSquare, Database, Users, TrendingUp, Layers, Mail, Activity, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col lg:flex-row items-center gap-16 min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#10B981]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#20C997]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left max-w-2xl relative z-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg text-[10px] uppercase tracking-widest font-bold text-[#20C997] mb-8 backdrop-blur-md"
        >
          <Sparkles size={14} className="" />
          <span>The Next Generation OS</span>
        </div>

        <h1
          className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          One AI Platform.<br />
          <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">Every Business Operation.</span>
        </h1>

        <p
          className="text-lg md:text-xl text-[var(--secondary-text)] font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
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
      <div className="flex-1 w-full max-w-[640px] relative z-10 perspective-1000">
        <div
          className="glass-card rounded-[32px] p-6 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-500 transform-gpu"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/20 border border-[#FF5F56]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/20 border border-[#FFBD2E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/20 border border-[#27C93F]/50" />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-[#8E99A8] font-medium flex items-center gap-2">
                <Database size={10} className="text-[#20C997]" /> meta-connect.app
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Left Sidebar Miniature */}
            <div className="w-12 flex flex-col gap-4 border-r border-white/10 pr-4 py-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.3)]">
                <MessageSquare size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0668E1]/20 flex items-center justify-center text-[#0668E1] hover:bg-[#0668E1]/40 transition-colors cursor-pointer">
                <Users size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#8E99A8] hover:bg-white/10 transition-colors cursor-pointer">
                <Database size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#8E99A8] hover:bg-white/10 transition-colors cursor-pointer">
                <Activity size={14} />
              </div>
            </div>

            {/* Central Screen */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Sales Revenue */}
              <div className="col-span-2 bg-[#171A20]/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-[#8E99A8] uppercase tracking-widest font-bold">Q3 Revenue Projection</span>
                    <div className="text-3xl font-bold text-white mt-1">$1.48M</div>
                  </div>
                  <div className="px-2 py-1 bg-[#10B981]/20 border border-[#10B981]/30 rounded-lg text-[10px] text-[#10B981] font-bold">
                    +24.8%
                  </div>
                </div>
                <div className="h-12 w-full flex items-end gap-2">
                  {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
                    <div 
                      key={i}
                      animate={{ height: `${height}%` }}
                      className="flex-1 bg-gradient-to-t from-[#10B981] to-[#20C997] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>

              {/* Live WhatsApp Queue */}
              <div className="col-span-2 bg-[#171A20]/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#25D366]" />
                    <span className="text-[10px] text-white font-bold tracking-wider">Live Incoming Queue</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#8E99A8]">3 pending</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "John D.", msg: "Interested in upgrade...", time: "Just now" },
                    { name: "Sarah M.", msg: "When does it ship?", time: "2m ago" }
                  ].map((chat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[10px] font-bold text-[#10B981]">
                          {chat.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-white">{chat.name}</div>
                          <div className="text-[9px] text-[#8E99A8] truncate w-32">{chat.msg}</div>
                        </div>
                      </div>
                      <div className="text-[8px] text-[#8E99A8]">{chat.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRM Stats */}
              <div className="col-span-2 bg-[#171A20]/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#10B981]/20 rounded-xl text-[#10B981]">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8E99A8] font-bold uppercase tracking-wider">Active CRM Contacts</div>
                    <div className="text-xl font-bold text-white">12,842</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#171A20] border-2 border-[#101B2D] overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#10B981] to-[#059669] opacity-70" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#101B2D] flex items-center justify-center text-[9px] font-bold text-white backdrop-blur-sm">
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




'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Database, Users, TrendingUp, Layers, Mail, Activity, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col lg:flex-row items-center gap-16 min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#0F6B52]/20 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#16A085]/15 rounded-full blur-[100px] pointer-events-none animate-glow" />

      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left max-w-2xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg text-[10px] uppercase tracking-widest font-bold text-[#20C997] mb-8 backdrop-blur-md"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>The Next Generation OS</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-[var(--foreground)]"
        >
          One AI Platform.<br />
          <span className="text-gradient-primary">Every Business Operation.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--secondary-text)] font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
        >
          Run your CRM, Marketing, Sales, Projects, Finance, HR, AI Automation, Communication, and Analytics from a single, unified enterprise intelligence kernel.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
        >
          <button className="btn-accent text-[12px] px-10 py-5 flex items-center gap-2">
            Start Free
            <Sparkles size={14} />
          </button>
          <button className="btn-secondary text-[12px] px-10 py-5">
            Book Demo
          </button>
        </motion.div>
      </div>

      {/* Right Content - 3D Glass Dashboard */}
      <div className="flex-1 w-full max-w-[640px] relative z-10 perspective-1000">
        <motion.div 
          initial={{ opacity: 0, rotateX: 10, rotateY: -10, y: 40 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.4 }}
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
                <Database size={10} className="text-[#20C997]" /> efv-unified-kernel.app
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Sales Revenue */}
            <div className="col-span-2 bg-[#171A20]/60 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] text-[#8E99A8] uppercase tracking-widest font-bold">Q3 Revenue Projection</span>
                  <div className="text-3xl font-bold text-white mt-1">$1.48M</div>
                </div>
                <div className="px-2 py-1 bg-[#0F6B52]/20 border border-[#0F6B52]/30 rounded-lg text-[10px] text-[#20C997] font-bold">
                  +24.8%
                </div>
              </div>
              <div className="h-16 w-full flex items-end gap-2">
                {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="flex-1 bg-gradient-to-t from-[#0F6B52] to-[#20C997] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-[#171A20]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-[#16A085]/20 rounded-lg text-[#20C997]">
                  <Sparkles size={14} />
                </div>
                <span className="text-[10px] text-white font-bold tracking-wider">AI Assistant</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded-lg rounded-tl-none text-[10px] text-[#8E99A8] w-[85%]">
                  Drafting WhatsApp campaign...
                </div>
                <div className="p-2 bg-[#0F6B52]/20 border border-[#0F6B52]/30 rounded-lg rounded-tr-none text-[10px] text-white w-[90%] self-end ml-auto">
                  Campaign ready. Estimated open rate: 84%.
                </div>
              </div>
            </div>

            {/* CRM Stats */}
            <div className="bg-[#171A20]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/5 rounded-lg text-white">
                  <Users size={14} />
                </div>
                <span className="text-[10px] text-white font-bold tracking-wider">Active Leads</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">1,284</div>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-[#171A20] border-2 border-[#101B2D] flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#16A085] to-[#0F6B52] opacity-50" />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#101B2D] flex items-center justify-center text-[8px] font-bold text-white backdrop-blur-sm">
                    +42
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions / Integration */}
            <div className="col-span-2 flex gap-3">
              {[
                { icon: MessageSquare, label: "WhatsApp", color: "#25D366" },
                { icon: Mail, label: "Email", color: "#EA4335" },
                { icon: TrendingUp, label: "Sales", color: "#3B82F6" },
                { icon: Layers, label: "Projects", color: "#8B5CF6" }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 bg-[#171A20]/60 border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer">
                  <item.icon size={16} color={item.color} />
                  <span className="text-[9px] font-bold text-[#8E99A8]">{item.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#20C997]/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { UserPlus, Zap, Users, Sparkles } from 'lucide-react';

export default function WorkflowTimeline() {
  const timeline = [
    { title: "Every customer interaction", desc: "is connected to a complete customer profile.", icon: UserPlus },
    { title: "Every message", desc: "can trigger intelligent automation.", icon: Zap },
    { title: "Every team", desc: "works from the same customer context.", icon: Users },
    { title: "Every workflow", desc: "is powered by AI.", icon: Sparkles }
  ];

  return (
    <section className="bg-[#0B0D11]/50 border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest block mb-3">Unified Ecosystem</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Everything Connected. Everything Smarter.
        </h2>
        <p className="text-lg font-medium text-[#8E99A8] max-w-2xl mx-auto mb-20">
          From the first conversation to long-term customer relationships, UWO Connect keeps your entire customer journey connected.
        </p>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-white/5 z-0">
            <div className="h-full bg-gradient-to-r from-transparent via-[#10B981] to-transparent w-1/3 animate-[pulse-line-move_3s_linear_infinite] shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-12 md:gap-0">
            {timeline.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#111318] border border-white/10 flex items-center justify-center mb-6 text-[#8E99A8] group-hover:text-[#10B981] group-hover:border-[#10B981] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10">
                    <div className="absolute inset-0 rounded-full bg-[#10B981]/0 group-hover:bg-[#10B981]/10 transition-colors" />
                    <Icon size={22} className="relative z-10 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <div className="absolute -inset-2 rounded-full border border-[#10B981]/0 group-hover:border-[#10B981]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#10B981] transition-colors">{step.title}</h4>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#8E99A8] max-w-[140px] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

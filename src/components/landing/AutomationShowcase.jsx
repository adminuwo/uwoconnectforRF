'use client';

import React from 'react';
import { Layers, Zap, Users, MessageSquare, BarChart, Settings } from 'lucide-react';

export default function AutomationShowcase({ isDark = true }) {
  const possibilities = [
    { name: "Generating leads", icon: Zap },
    { name: "Managing customer conversations", icon: MessageSquare },
    { name: "Supporting customers", icon: Users },
    { name: "Running marketing campaigns", icon: BarChart },
    { name: "Automating workflows", icon: Settings },
    { name: "Scaling your operations", icon: Layers }
  ];

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {possibilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`rounded-2xl p-6 border flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02] ${
                isDark 
                  ? 'bg-[#171A20] border-white/10 hover:border-[#20C997]/50' 
                  : 'bg-[#F3FBF7] border-[#10B981]/20 hover:border-[#10B981]/50'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/5 text-[#20C997]' : 'bg-[#10B981]/10 text-[#059669]'
                }`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className={`text-sm md:text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {item.name}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

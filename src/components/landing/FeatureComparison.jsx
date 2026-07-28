'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FeatureComparison({ isDark = true }) {
  return (
    <section className={`max-w-7xl mx-auto px-6 py-24 md:py-32 ${isDark ? 'bg-[#030712]' : 'bg-[#F3FBF7]'}`}>
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left text */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest block mb-3">The Advantage</span>
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why Businesses Choose UWO Connect
          </h2>
          <p className={`text-lg md:text-xl font-medium leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Because customer engagement should feel connected—not complicated.
          </p>
          <p className={`text-base md:text-lg mb-8 ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
            Instead of juggling multiple tools for messaging, CRM, automation, and support, UWO Connect brings everything together in one intelligent platform.
          </p>
          <button className="btn-accent px-8 py-4 flex items-center justify-center lg:justify-start gap-2 mx-auto lg:mx-0">
            See It In Action <ArrowRight size={16} />
          </button>
        </div>

        {/* Right highlights */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "More productivity",
            "Better customer experiences",
            "Smarter decisions",
            "Less complexity"
          ].map((item, idx) => (
            <div key={idx} className={`p-8 rounded-3xl border flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 ${
              isDark 
                ? 'bg-slate-900/50 border-white/10 hover:border-[#20C997]/50 shadow-lg' 
                : 'bg-white border-[#10B981]/20 hover:border-[#10B981]/50 shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[#10B981]/20 text-[#20C997]' : 'bg-[#10B981]/10 text-[#059669]'
              }`}>
                <CheckCircle2 size={24} />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {item}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

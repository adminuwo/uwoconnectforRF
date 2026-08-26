'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

const GlassTrustPill = ({ text = "One connected workspace for your entire business" }) => {
  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 font-sans group">
      {/* Decorative Dots */}
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-teal-400/80" />
        <span className="w-2 h-2 rounded-full bg-blue-400/60" />
      </div>

      <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-100">
        {text}
      </span>

      <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
    </div>
  );
};

export default GlassTrustPill;

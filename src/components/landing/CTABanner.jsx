'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-24 md:pb-32">
      <div className="glass-card rounded-[32px] p-10 md:p-16 text-center border border-white/10 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#20C997] to-transparent" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#0F6B52]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#16A085]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#0F6B52] to-[#16A085] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(22,160,133,0.3)]">
          <Sparkles size={24} className="text-white" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white max-w-2xl mx-auto">
          Ready to initialize your enterprise kernel?
        </h2>
        <p className="text-[#8E99A8] text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed">
          Create your workspace in 30 seconds. Connect your data, activate your AI assistants, and let the system run.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button className="btn-accent px-10 py-5 w-full sm:w-auto">
            Deploy Workspace
          </button>
          <button className="btn-secondary px-10 py-5 w-full sm:w-auto">
            Talk to Engineering
          </button>
        </div>
      </div>
    </section>
  );
}

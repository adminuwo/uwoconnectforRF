'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function WhyEFV({ isDark = true }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">The Problem</span>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          The Future of Customer Engagement Starts Here
        </h2>
        <p className={`text-xl font-medium leading-relaxed ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
          Today's customers expect businesses to be available everywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* The Problem */}
        <div className={`rounded-[32px] p-10 md:p-12 border ${
          isDark 
            ? 'bg-slate-900/40 border-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.03)]' 
            : 'bg-red-50/50 border-red-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>
              <ShieldAlert size={24} />
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>The Disconnected Reality</h3>
          </div>
          
          <ul className="space-y-4 mb-8">
            {[
              "They message you on WhatsApp.",
              "Discover you on Instagram.",
              "Reach out through Email.",
              "Chat from your website."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-500/50' : 'bg-red-400'}`} />
                <span className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
              </li>
            ))}
          </ul>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-500/5 border-red-500/10 text-red-200' : 'bg-red-50 border-red-100 text-red-800'}`}>
            <p className="font-medium">But managing these conversations across multiple tools creates disconnected experiences, slower responses, and missed opportunities.</p>
          </div>
        </div>

        {/* The Solution */}
        <div className={`rounded-[32px] p-10 md:p-12 border relative overflow-hidden ${
          isDark 
            ? 'bg-[#059669]/5 border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]' 
            : 'bg-[#F3FBF7] border-[#10B981]/20 shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-[#10B981]/20 text-[#20C997]' : 'bg-[#10B981]/20 text-[#059669]'}`}>
                <CheckCircle2 size={24} />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>UWO Connect changes that.</h3>
            </div>
            
            <p className={`text-xl leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              By bringing every conversation, every customer, and every workflow into one unified platform, your business can respond faster, automate repetitive tasks, and deliver exceptional customer experiences—without switching between apps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

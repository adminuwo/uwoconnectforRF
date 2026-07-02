'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TrustedBy() {
  const logos = ["Stripe", "Linear", "Vercel", "Framer", "Notion", "Slack", "Retool", "Attio"];
  
  return (
    <section className="bg-[#171A20]/30 border-y border-white/5 py-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-center text-[10px] font-bold text-[#8E99A8] uppercase tracking-[0.25em]">
          Trusted by Next-Generation Enterprise Teams
        </p>
      </div>
      
      {/* Infinite Logo Marquee */}
      <div className="flex w-max gap-16 animate-[pulse-line-move_30s_linear_infinite] whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity duration-500">
        {[...logos, ...logos, ...logos].map((logo, idx) => (
          <div key={idx} className="inline-flex items-center justify-center font-bold text-lg text-[#8E99A8] px-4 group hover:text-white transition-colors duration-300 cursor-default">
            <Sparkles size={16} className="text-[#16A085]/40 group-hover:text-[#20C997] transition-colors mr-3" />
            <span>{logo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

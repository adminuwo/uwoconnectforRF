'use client';

import React from 'react';
import { Layers, Shield, Zap, Cpu, ArrowRight } from 'lucide-react';

export default function WhyEFV() {
  const pillars = [
    {
      icon: Layers,
      title: "Everything in one platform",
      desc: "Eliminate subscription chaos. Replaces HubSpot, Monday, QuickBooks, and disjointed tools with a unified kernel."
    },
    {
      icon: Cpu,
      title: "AI-first architecture",
      desc: "Built from the ground up on semantic vector indexing. Your data is instantly searchable and actionable by AI."
    },
    {
      icon: Zap,
      title: "Modular workspace",
      desc: "Turn on the modules you need. As your business grows, instantly activate HR, Finance, or Support layers."
    },
    {
      icon: Shield,
      title: "Enterprise security",
      desc: "End-to-end encryption, strict role-based access control, SSO integration, and dedicated private DB clusters."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Core Philosophy</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Why EFV Unified?
        </h2>
        <p className="text-[#8E99A8] text-lg font-medium">
          The traditional SaaS stack is broken. Data is siloed, automation is fragile, and intelligence is bolted on. We built a better way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => (
          <div 
            key={idx}
            className="glass-card rounded-[24px] p-8 hover:border-[#16A085]/30 hover:bg-white/5 transition-all duration-500 flex flex-col group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F6B52]/20 border border-[#0F6B52]/40 flex items-center justify-center text-[#20C997] mb-8 group-hover:scale-110 transition-transform duration-500">
              <pillar.icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">{pillar.title}</h3>
            <p className="text-sm text-[#8E99A8] font-medium leading-relaxed mb-6 flex-1">
              {pillar.desc}
            </p>
            <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#16A085] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              Explore Module <ArrowRight size={14} className="ml-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

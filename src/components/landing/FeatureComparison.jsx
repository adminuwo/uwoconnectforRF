'use client';

import React from 'react';

export default function FeatureComparison() {
  const comparisons = [
    { title: "Database Architecture", trad: "Siloed SQL & CSV Exports", efv: "Unified Vector Database" },
    { title: "Automation", trad: "Zapier & 3rd Party Connectors", efv: "Native Neural Workflows" },
    { title: "Customer Communication", trad: "Middleware APIs with markup", efv: "Direct Meta Cloud API integration" },
    { title: "Analytics", trad: "Weekly manual reports", efv: "Real-time AI Business Intelligence" },
    { title: "Data Security", trad: "Fragmented across 10 apps", efv: "Single Encrypted Enterprise Cluster" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">The Paradigm Shift</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Why switch to a unified kernel?
        </h2>
      </div>

      <div className="max-w-4xl mx-auto glass-card rounded-[24px] overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest bg-[#171A20]/60">
          <div className="text-[#8E99A8]">Capability</div>
          <div className="text-[#8E99A8]">Traditional Stack</div>
          <div className="text-[#20C997]">EFV Unified Platform</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {comparisons.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
              <div className="text-sm font-bold text-white flex items-center">{item.title}</div>
              <div className="text-sm font-medium text-[#8E99A8] flex items-center">{item.trad}</div>
              <div className="text-sm font-bold text-[#20C997] flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0F6B52]/20 flex items-center justify-center shrink-0">
                  ✓
                </div>
                {item.efv}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

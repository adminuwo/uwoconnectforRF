'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

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
        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest block mb-3">The Paradigm Shift</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Why switch to a unified kernel?
        </h2>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest bg-transparent">
          <div className="flex-1 text-[#8E99A8]">Capability</div>
          <div className="flex-1 text-[#8E99A8] pl-6 border-l border-transparent">Traditional Stack</div>
          <div className="flex-1 text-[#10B981] pl-6 border-l border-white/5 bg-[#10B981]/[0.01]">EFV UNIFIED PLATFORM</div>
        </div>
        
        {/* Rows */}
        <div className="flex flex-col">
          {comparisons.map((item, idx) => (
            <div key={idx} className="flex items-stretch border-b border-white/5 hover:bg-white/5 transition-colors group">
              <div className="flex-1 p-6 text-sm font-bold text-white flex items-center">{item.title}</div>
              <div className="flex-1 p-6 text-sm font-medium text-slate-500 flex items-center border-l border-transparent">{item.trad}</div>
              <div className="flex-1 p-6 text-sm font-bold text-[#10B981] flex items-center gap-3 border-l border-[#10B981]/20 bg-[#10B981]/[0.03] group-hover:bg-[#10B981]/[0.05] transition-colors relative overflow-hidden shadow-[inset_1px_0_10px_rgba(16,185,129,0.05)]">
                <CheckCircle size={18} className="text-[#10B981] shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                {item.efv}
                <div className="absolute inset-0 border border-[#10B981]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


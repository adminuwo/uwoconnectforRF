'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WorkflowTimeline() {
  const timeline = [
    { title: "Lead Captured", desc: "Via WhatsApp or Web Form" },
    { title: "CRM Profile Created", desc: "Data structured automatically" },
    { title: "AI Qualification", desc: "Intent scoring & routing" },
    { title: "Proposal Sent", desc: "Generated via knowledge base" },
    { title: "Payment Secured", desc: "Ledger updated via Stripe" },
    { title: "Project Initialized", desc: "Team tasks assigned" }
  ];

  return (
    <section className="bg-[#171A20]/20 border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-20 text-white">
          A seamless lifecycle.
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-1 bg-white/5 z-0">
            <div className="h-full bg-gradient-to-r from-transparent via-[#20C997] to-transparent w-1/4 animate-[pulse-line-move_4s_linear_infinite]" />
          </div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div className="w-14 h-14 rounded-2xl bg-[#171A20] border border-white/10 flex items-center justify-center mb-6 text-xl font-bold text-[#8E99A8] group-hover:text-[#20C997] group-hover:border-[#16A085] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#8E99A8]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

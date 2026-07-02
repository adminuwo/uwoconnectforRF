'use client';

import React from 'react';
import { Network } from 'lucide-react';

export default function Integrations() {
  const logos = ["WhatsApp", "Meta", "Gmail", "Outlook", "Slack", "Drive", "Zoom", "Shopify", "Stripe", "REST API"];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0F6B52]/20 border border-[#0F6B52]/40 flex items-center justify-center text-[#20C997] mb-6 mx-auto md:mx-0">
            <Network size={24} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Connects with your entire stack
          </h2>
          <p className="text-[#8E99A8] text-lg font-medium mb-8">
            Native integrations with the tools you already use. Sync data bi-directionally without writing a single line of code.
          </p>
          <button className="text-[11px] font-bold uppercase tracking-widest text-[#20C997] hover:text-white transition-colors pb-1 border-b border-[#20C997]/30 hover:border-white">
            View Integration Directory
          </button>
        </div>

        {/* Right Side Integrations Grid */}
        <div className="flex-1 w-full max-w-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {logos.map((logo, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square hover:border-[#16A085]/50 hover:bg-[#16A085]/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  {/* Placeholder for actual logo icons */}
                  <span className="text-[#8E99A8] group-hover:text-white font-bold text-lg">{logo.charAt(0)}</span>
                </div>
                <span className="text-[10px] font-bold text-[#8E99A8] group-hover:text-white transition-colors">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

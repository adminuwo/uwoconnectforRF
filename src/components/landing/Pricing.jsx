'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "For early stage startups.",
      monthly: 49,
      annual: 39,
      features: ["5 User Licenses", "10,000 CRM Contacts", "WhatsApp Meta API", "Basic AI Chat Assistant"]
    },
    {
      name: "Growth",
      desc: "Perfect for scaling operations.",
      monthly: 99,
      annual: 79,
      popular: true,
      features: ["25 User Licenses", "100,000 CRM Contacts", "3 Custom AI Assistants", "Unified Financial Ledger", "Granular Roles"]
    },
    {
      name: "Enterprise",
      desc: "Custom scale cluster deployment.",
      monthly: 299,
      annual: 239,
      features: ["Unlimited Licenses", "Unlimited CRM Contacts", "Dedicated Vector DB", "Custom Webhooks", "99.99% SLA"]
    }
  ];

  return (
    <section className="bg-[#171A20]/40 border-y border-white/5 py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Transparent Scaling
          </h2>
          <p className="text-[#8E99A8] text-lg font-medium mb-10">
            Choose the workspace scale suited specifically to fit your transaction volumes.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${!annual ? 'text-white' : 'text-[#8E99A8]'}`}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-white/5 border border-white/10 p-0.5 relative transition-colors cursor-pointer"
            >
              <motion.div 
                layout
                className="w-5 h-5 rounded-full bg-[#16A085]"
                animate={{ x: annual ? 24 : 0 }}
              />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${annual ? 'text-[#20C997]' : 'text-[#8E99A8]'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass-card rounded-[32px] p-8 flex flex-col relative ${plan.popular ? 'border-[#16A085] shadow-[0_0_30px_rgba(22,160,133,0.15)] scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F6B52] border border-[#20C997] text-white px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-[#8E99A8] font-medium">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">${annual ? plan.annual : plan.monthly}</span>
                <span className="text-sm text-[#8E99A8] font-medium"> / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#0F6B52]/20 flex items-center justify-center text-[#20C997] shrink-0">
                      ✓
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${plan.popular ? 'bg-[#16A085] text-white hover:bg-[#20C997]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

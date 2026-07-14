'use client';

import React, { useState } from 'react';
import { Layers, Shield, Zap, Cpu, ArrowRight, X } from 'lucide-react';

export default function WhyEFV({ isDark = true }) {
  const [activePillar, setActivePillar] = useState(null);

  const pillars = [
    {
      icon: Layers,
      title: "Everything in one platform",
      desc: "Eliminate subscription chaos. Replaces HubSpot, Monday, QuickBooks, and disjointed tools with a unified kernel.",
      features: [
        { name: "CRM Unified", detail: "Sync all contacts, communication channels, and sales history automatically." },
        { name: "Sales & Campaigns", detail: "Launch bulk email campaigns or WhatsApp sequences with custom schedules." },
        { name: "Finance & Invoices", detail: "Automatically track business revenue, generate invoices, and project budgets." },
        { name: "HR Management", detail: "Manage employee profiles, onboarding pipelines, and team roles centrally." }
      ]
    },
    {
      icon: Cpu,
      title: "AI-first architecture",
      desc: "Built from the ground up on semantic vector indexing. Your data is instantly searchable and actionable by AI.",
      features: [
        { name: "Vector Indexing", detail: "All database records, messages, and docs are indexed semantically." },
        { name: "Autonomous Agents", detail: "Deploy support agents, sales qualifying agents, or database analysts." },
        { name: "Natural Language DB", detail: "Query your enterprise data tables in plain conversational English." },
        { name: "AI Automation", detail: "Trigger smart follow-ups or draft responses based on incoming chat context." }
      ]
    },
    {
      icon: Zap,
      title: "Modular workspace",
      desc: "Turn on the modules you need. As your business grows, instantly activate HR, Finance, or Support layers.",
      features: [
        { name: "Hot-Reload Modules", detail: "Toggle CRM, Helpdesk, or Finance functions on/off without downtime." },
        { name: "Custom Workspaces", detail: "Tailor unique dashboard layouts for sales agents, accountants, or HR managers." },
        { name: "Flexible Scalability", detail: "Seamlessly scales from single users to millions of daily business interactions." },
        { name: "API Extensions", detail: "Integrate custom microservices easily through standard webhook bindings." }
      ]
    },
    {
      icon: Shield,
      title: "Enterprise security",
      desc: "End-to-end encryption, strict role-based access control, SSO integration, and dedicated private DB clusters.",
      features: [
        { name: "E2E Encryption", detail: "Industry-standard encryption for data transit and storage at rest." },
        { name: "Granular RBAC", detail: "Restrict read/write permissions down to specific data columns." },
        { name: "Dedicated Clusters", detail: "Isolate high-volume analytical processes on private hardware nodes." },
        { name: "Audit Trail Logging", detail: "Full activity logging tracking user database actions and administrative overrides." }
      ]
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Core Philosophy</span>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Why Uwo Connect Unified?
        </h2>
        <p className={`text-lg font-medium ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
          The traditional SaaS stack is broken. Data is siloed, automation is fragile, and intelligence is boiled on. We built a better way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => (
          <div 
            key={idx}
            onClick={() => setActivePillar(pillar)}
            className={`rounded-[24px] p-8 transition-all duration-500 flex flex-col group border cursor-pointer ${
              isDark 
                ? 'bg-slate-900/40 border-white/5 hover:border-[#16A085]/30 hover:bg-white/5' 
                : 'bg-white/60 border-[#059669]/10 hover:border-[#059669]/30 hover:bg-white shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F6B52]/20 border border-[#0F6B52]/40 flex items-center justify-center text-[#20C997] mb-8 transition-transform duration-500">
              <pillar.icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>{pillar.title}</h3>
            <p className={`text-sm font-medium leading-relaxed mb-6 flex-1 ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
              {pillar.desc}
            </p>
            <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#16A085] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              Explore Module <ArrowRight size={14} className="ml-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activePillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setActivePillar(null)}
          />
          
          {/* Card Container */}
          <div 
            className={`relative max-w-lg w-full rounded-3xl p-8 border shadow-2xl transition-all transform-gpu scale-100 animate-fade-in-up z-10 ${
              isDark 
                ? 'bg-slate-900/95 border-white/10 text-white' 
                : 'bg-white/95 border-[#059669]/20 text-slate-900'
            }`}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActivePillar(null)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-black'
              }`}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0F6B52]/20 border border-[#0F6B52]/40 flex items-center justify-center text-[#20C997]">
                <activePillar.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold">{activePillar.title}</h3>
            </div>

            <p className={`text-sm leading-relaxed mb-6 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {activePillar.desc}
            </p>

            <hr className={`my-6 ${isDark ? 'border-white/5' : 'border-slate-100'}`} />

            <div className="space-y-4 mb-8">
              <h4 className={`text-xs uppercase tracking-wider font-bold ${isDark ? 'text-[#20C997]' : 'text-[#059669]'}`}>Key Capabilities</h4>
              <div className="grid gap-3">
                {activePillar.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex gap-3 items-start">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#20C997] shrink-0" />
                    <div>
                      <div className="text-sm font-bold">{feature.name}</div>
                      <div className={`text-xs leading-relaxed ${isDark ? 'text-[#8E99A8]' : 'text-slate-500'}`}>{feature.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setActivePillar(null)}
              className="w-full btn-accent py-4 flex items-center justify-center gap-2"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}



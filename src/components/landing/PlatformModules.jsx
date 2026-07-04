'use client';

import React from 'react';
import { Users, TrendingUp, Mail, MessageSquare, Layers, Award, DollarSign, Activity, FileText, Headphones } from 'lucide-react';

export default function PlatformModules() {
  const modules = [
    { icon: Users, name: "CRM", status: "Active" },
    { icon: TrendingUp, name: "Sales", status: "Active" },
    { icon: Mail, name: "Marketing", status: "Active" },
    { icon: MessageSquare, name: "WhatsApp", status: "Active" },
    { icon: MessageSquare, name: "Email", status: "Active" },
    { icon: Layers, name: "Projects", status: "Active" },
    { icon: Award, name: "HR", status: "Available" },
    { icon: DollarSign, name: "Finance", status: "Available" },
    { icon: Activity, name: "Analytics", status: "Active" },
    { icon: FileText, name: "Documents", status: "Active" },
    { icon: Headphones, name: "Support", status: "Available" }
  ];

  return (
    <section className="bg-[#171A20]/40 border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0F6B52]/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Ecosystem</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Platform Modules
            </h2>
            <p className="text-[#8E99A8] text-lg font-medium">
              A comprehensive suite of enterprise modules, seamlessly interconnected through our vector intelligence layer.
            </p>
          </div>
          <button className="btn-secondary px-6 py-3 whitespace-nowrap">
            View All Capabilities
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-5 border ${mod.status === 'Active' ? 'border-white/10 hover:border-[#16A085]/50' : 'border-white/5 opacity-60'} flex flex-col items-center justify-center text-center cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${mod.status === 'Active' ? 'bg-[#0F6B52]/20 text-[#20C997]' : 'bg-white/5 text-[#8E99A8]'}`}>
                <mod.icon size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{mod.name}</h4>
              <span className={`text-[9px] uppercase tracking-wider font-bold ${mod.status === 'Active' ? 'text-[#16A085]' : 'text-[#8E99A8]'}`}>
                {mod.status}
              </span>
            </div>
          ))}
          
          <div className="glass-card rounded-2xl p-5 border border-white/5 border-dashed flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center mb-4 text-white">
              +
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Custom Module</h4>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#8E99A8]">API Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}



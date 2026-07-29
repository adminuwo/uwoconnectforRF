'use client';

import React from 'react';
import { Users, TrendingUp, Mail, MessageSquare, Layers, Award, DollarSign, Activity, FileText, Headphones } from 'lucide-react';

export default function PlatformModules({ isDark = true }) {
  const modules = [
    { icon: Users, name: "CRM", status: "Active" },
    { icon: TrendingUp, name: "Sales", status: "Active" },
    { icon: Mail, name: "Marketing", status: "Active" },
    { icon: MessageSquare, name: "WhatsApp", status: "Active" },
    { icon: MessageSquare, name: "Email", status: "Active" },
    { icon: Layers, name: "Projects", status: "Active" },
    { icon: Award, name: "HR", status: "Active" },
    { icon: DollarSign, name: "Finance", status: "Active" },
    { icon: Activity, name: "Analytics", status: "Active" },
    { icon: FileText, name: "Documents", status: "Active" },
    { icon: Headphones, name: "Support", status: "Active" }
  ];

  return (
    <section className="bg-[#171A20]/40 border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0F6B52]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Ecosystem</span>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform Modules
            </h2>
            <p className={`text-lg font-medium ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
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
              className={`glass-card rounded-2xl p-5 border border-white/10 hover:border-[#16A085]/50 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.3)]`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#0F6B52]/20 text-[#20C997]">
                <mod.icon size={20} strokeWidth={1.5} />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{mod.name}</h4>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#16A085]">
                {mod.status}
              </span>
            </div>
          ))}

          <div className={`glass-card rounded-2xl p-5 border border-white/10 hover:border-[#16A085]/50 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.3)]`}>
            <div className="w-10 h-10 rounded-xl bg-[#0F6B52]/20 text-[#20C997] flex items-center justify-center mb-4">
              +
            </div>
            <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Custom Module</h4>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#16A085]">API Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}



'use client';

import React from 'react';
import { MessageSquare, Bot, Users, Database, Zap, Megaphone, BarChart3 } from 'lucide-react';

export default function PlatformModules({ isDark = true }) {
  const modules = [
    { 
      icon: MessageSquare, 
      name: "Omnichannel Conversations", 
      desc: "Manage customer conversations across WhatsApp, Instagram, Email, and Web Chat from one shared inbox."
    },
    { 
      icon: Bot, 
      name: "AI That Works Alongside Your Team", 
      desc: "Automate routine conversations, answer questions, qualify leads, and escalate to the right team member."
    },
    { 
      icon: Database, 
      name: "Customer CRM", 
      desc: "Keep track of every interaction, purchase, and follow-up in one centralized CRM for a 360° customer view."
    },
    { 
      icon: Zap, 
      name: "Intelligent Automation", 
      desc: "Transform conversations into automated actions. Capture leads, assign tasks, and trigger campaigns with zero code."
    },
    { 
      icon: Megaphone, 
      name: "Campaigns That Connect", 
      desc: "Reach the right audience with personalized campaigns across supported channels and measure engagement in real-time."
    },
    { 
      icon: BarChart3, 
      name: "Insights That Drive Growth", 
      desc: "Track customer engagement, team performance, campaign results, and AI metrics from one intuitive dashboard."
    }
  ];

  return (
    <section className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#171A20]/40 border-y border-white/5' : 'bg-[#F3FBF7] border-y border-[#10B981]/10'}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0F6B52]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Core Capabilities</span>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Built to Connect Your Business
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border flex flex-col items-start cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                isDark 
                  ? 'glass-card border-white/10 hover:border-[#16A085]/50 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.3)]' 
                  : 'bg-white border-[#10B981]/20 hover:border-[#10B981]/50 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.15)]'
              }`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#0F6B52]/20 text-[#20C997]">
                <mod.icon size={24} strokeWidth={1.5} />
              </div>
              <h4 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>{mod.name}</h4>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
                {mod.desc}
              </p>
            </div>
          ))}

          <div className={`rounded-2xl p-5 border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] ${
            isDark 
              ? 'glass-card border-white/10 hover:border-[#16A085]/50 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.3)]' 
              : 'bg-white border-[#10B981]/20 hover:border-[#10B981]/50 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.15)]'
          }`}>
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

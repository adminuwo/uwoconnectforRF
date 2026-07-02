'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowRight, Webhook, Brain, Database, Smartphone } from 'lucide-react';

export default function AutomationShowcase() {
  const steps = [
    { icon: Webhook, label: "Webhook Trigger", delay: 0 },
    { icon: Brain, label: "AI Screening", delay: 1 },
    { icon: Database, label: "CRM Log", delay: 2 },
    { icon: Smartphone, label: "WhatsApp Reply", delay: 3 }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Workflow Engine</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Visual Automation Builder
        </h2>
        <p className="text-[#8E99A8] text-lg font-medium">
          Drag, drop, and deploy complex autonomous pipelines that execute tasks without human intervention.
        </p>
      </div>

      <div className="max-w-5xl mx-auto glass-card rounded-[32px] p-8 md:p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A085]/10 rounded-full blur-[80px]" />
        
        {/* UI Mockup Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Settings size={18} className="text-[#8E99A8]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Lead Qualification Flow</h4>
              <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-wider">Active • 1,204 runs today</span>
            </div>
          </div>
          <button className="btn-accent px-6 py-3">Edit Flow</button>
        </div>

        {/* Workflow Nodes */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-10">
          
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-white/5 -translate-y-1/2 z-0">
            <div className="h-full bg-gradient-to-r from-transparent via-[#20C997] to-transparent w-1/3 animate-[pulse-line-move_2s_linear_infinite]" />
          </div>

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay * 0.2 }}
              className="relative z-10 w-full md:w-auto"
            >
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center w-full md:w-40 hover:border-[#16A085]/40 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#171A20] border border-white/10 flex items-center justify-center mb-4 text-[#8E99A8] group-hover:text-[#20C997] group-hover:border-[#20C997]/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <step.icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {step.label}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight size={16} className="md:hidden mt-4 text-[#8E99A8]" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Cpu,
  UserCheck,
  Bot,
  Database,
  BellRing,
  BarChart2,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function KinsoAIAutomation({ isDark }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Customer Message',
      subtitle: 'Inbound conversation received via WhatsApp / Email',
      icon: MessageSquare,
      detail: "Customer: 'Hi! We need to upgrade our workspace tier and connect 10 team seats.'",
    },
    {
      step: '02',
      title: 'AI Intent Parsing',
      subtitle: 'Neural model classifies intent & urgency in 12ms',
      icon: Cpu,
      detail: 'Parsed Intent: Account Upgrade • Urgency: High • Sentiment: Positive',
    },
    {
      step: '03',
      title: 'Smart Team Assignment',
      subtitle: 'Routes directly to senior account manager',
      icon: UserCheck,
      detail: 'Routed to Account Specialist (Marcus) based on customer LTV tier.',
    },
    {
      step: '04',
      title: 'AI Response Generation',
      subtitle: 'Drafts contextual reply trained on KB',
      icon: Bot,
      detail: "'Hi! I have generated your custom 10-seat upgrade invoice with 15% annual discount.'",
    },
    {
      step: '05',
      title: 'CRM Auto-Update',
      subtitle: 'Synchronizes HubSpot & Salesforce',
      icon: Database,
      detail: 'HubSpot Deal Stage changed from Lead ➔ Contract Sent ($12,000 ARR).',
    },
    {
      step: '06',
      title: 'Manager Notification',
      subtitle: 'Instant alert dispatched to Slack / Teams',
      icon: BellRing,
      detail: 'Notification sent to #sales-leads channel: High-intent upgrade proposal sent.',
    },
    {
      step: '07',
      title: 'Analytics Tracking',
      subtitle: 'Resolution & SLA response logged',
      icon: BarChart2,
      detail: 'Log recorded: Total response duration 1.4s • CSAT predicted 99.8%',
    },
  ];

  return (
    <section id="automation" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20">
            Autonomous Workflows
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            End-to-End AI Automation Pipeline
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Watch how UWO Connect processes, routes, responds, and records every customer message in milliseconds.
          </p>
        </div>

        {/* Step Flow Navigation & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isActive
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-lg shadow-[#16A34A]/20'
                      : isDark
                      ? 'bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/[0.05]'
                      : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#16A34A]/10 text-[#16A34A]'
                    }`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold leading-tight">{item.title}</h3>
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                  {isActive && <CheckCircle className="w-5 h-5 text-white shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Animated Step Card */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden space-y-6 ${
                isDark ? 'bg-[#0E131F] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                    {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">
                      Pipeline Step {steps[activeStep].step} of 07
                    </span>
                    <h3 className="text-xl font-bold">{steps[activeStep].title}</h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                  Status: Executed (12ms)
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-500">Live Execution Payload:</p>
                <div className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed ${
                  isDark ? 'bg-black/40 border-white/10 text-emerald-400' : 'bg-gray-900 text-emerald-400'
                }`}>
                  {steps[activeStep].detail}
                </div>
              </div>

              {/* Progress Line */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Autonomous Workflow Engine v4.2</span>
                <span className="text-[#16A34A] font-bold">100% Deterministic Execution</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

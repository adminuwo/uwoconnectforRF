'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, Bot, FileCheck, CreditCard, Receipt, 
  CheckCircle2, ArrowRight, Sparkles, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WORKFLOW_STEPS = [
  {
    id: 1,
    channel: 'WhatsApp',
    title: 'Incoming Customer Message',
    subtext: '"Hi! Can I get a quotation & catalog?"',
    status: 'RECEIVED',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <MessageSquare size={16} className="text-blue-600" />
  },
  {
    id: 2,
    channel: 'CRM Module',
    title: 'Customer Lead Created',
    subtext: 'Auto-saved contact to Lead Pipeline',
    status: 'PROCESSING',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Users size={16} className="text-purple-600" />
  },
  {
    id: 3,
    channel: 'Auto Reply',
    title: 'AI Bot Sent Catalog',
    subtext: 'Product Catalog & PDF dispatched in 0.2s',
    status: 'AUTOMATED',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: <Bot size={16} className="text-emerald-600" />
  },
  {
    id: 4,
    channel: 'Quotation Module',
    title: 'Quotation Generated (#QT-8402)',
    subtext: 'PDF Quotation generated & synced to Google Docs',
    status: 'AUTOMATED',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: <FileCheck size={16} className="text-amber-600" />
  },
  {
    id: 5,
    channel: 'Payment Gateway',
    title: 'UPI Payment Link Sent',
    subtext: 'Razorpay UPI payment link shared via WhatsApp',
    status: 'AUTOMATED',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: <CreditCard size={16} className="text-rose-600" />
  },
  {
    id: 6,
    channel: 'Invoice Module',
    title: 'Invoice Issued & Recorded',
    subtext: 'GST Invoice created & appended to Google Sheets',
    status: 'COMPLETED',
    badgeClass: 'bg-emerald-600 text-white border-emerald-600',
    icon: <Receipt size={16} className="text-emerald-600" />
  }
];

export default function HeroWorkflowAnimation() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-3xl bg-white/90 border border-slate-200 shadow-xl backdrop-blur-md">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            REAL-TIME AUTOMATION SIMULATOR
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <RefreshCw size={13} className="animate-spin text-emerald-600" />
          <span>Live Workflow Playback</span>
        </div>
      </div>

      {/* Workflow Step Indicator Progress Line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isPassed = index < activeStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "p-3.5 rounded-2xl border transition-all duration-300 relative text-left",
                isActive
                  ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-102"
                  : (isPassed
                    ? "bg-slate-50/70 border-slate-200"
                    : "bg-white border-slate-100 opacity-60")
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-700">{step.channel}</span>
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
                  step.badgeClass
                )}>
                  {step.status}
                </span>
              </div>

              <h5 className="text-xs font-extrabold text-slate-900 leading-snug">{step.title}</h5>
              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">{step.subtext}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

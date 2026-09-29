'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MessageSquare, Users, Bot, FileCheck, CreditCard, Receipt,
  CheckCircle2, Sparkles, ArrowRight, Zap, Play, Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    step: 'STEP 01',
    id: 'step-01',
    title: 'Customer Message',
    sub: 'WhatsApp / DM query received',
    icon: <MessageSquare size={18} />,
    color: '#25D366',
    bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    details: 'New customer message arrives via WhatsApp Business API or Instagram DM. UWO Connect parses intent and customer details instantly.',
    stat: 'Response time: < 0.1s'
  },
  {
    step: 'STEP 02',
    id: 'step-02',
    title: 'CRM Lead Created',
    sub: 'Auto-saved to sales pipeline',
    icon: <Users size={18} />,
    color: '#0B8F78',
    bgBadge: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    details: 'Lead profile is immediately generated with phone, source channel, timestamp, and sales stage in your central CRM pipeline.',
    stat: '0 Manual Data Entry'
  },
  {
    step: 'STEP 03',
    id: 'step-03',
    title: 'AI Auto Reply',
    sub: 'Catalog & price bot dispatches',
    icon: <Bot size={18} />,
    color: '#4F46E5',
    bgBadge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    details: 'AI conversational bot analyzes inquiry, verifies product availability, and dispatches accurate pricing and interactive catalog buttons.',
    stat: 'Instant Multi-Turn FAQ'
  },
  {
    step: 'STEP 04',
    id: 'step-04',
    title: 'Quotation Generated',
    sub: 'Instant GST quotation PDF',
    icon: <FileCheck size={18} />,
    color: '#D97706',
    bgBadge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    details: 'Official branded quotation with tax calculations, GSTIN, discounts, and itemized terms compiled and sent automatically as a PDF.',
    stat: 'Auto GST & PDF Generation'
  },
  {
    step: 'STEP 05',
    id: 'step-05',
    title: 'Payment Link Sent',
    sub: 'Native Razorpay UPI link',
    icon: <CreditCard size={18} />,
    color: '#E11D48',
    bgBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    details: 'Dynamic payment gateway link dispatched straight into the chat with UPI, QR code, and card options for frictionless one-click checkout.',
    stat: 'Native Razorpay Integration'
  },
  {
    step: 'STEP 06',
    id: 'step-06',
    title: 'Invoice Issued',
    sub: 'Synced to Google Sheets',
    icon: <Receipt size={18} />,
    color: '#059669',
    bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    details: 'On payment confirmation webhook, final GST tax invoice is dispatched to customer and ledger row is auto-synced to Google Sheets.',
    stat: 'Synced to Accounting'
  },
  {
    step: 'STEP 07',
    id: 'step-07',
    title: 'Workflow Completed',
    sub: 'Closed deal in 0.2s',
    icon: <CheckCircle2 size={18} />,
    color: '#0B1220',
    bgBadge: 'bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-500/20',
    details: 'Deal moved to Won status in CRM. Notification pushed to team Slack/WhatsApp. Customer added to post-sale onboarding journey.',
    stat: 'Full Cycle: 0.2s'
  }
];

export default function AutomationShowcaseNew({ isDarkMode = false }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play through 7 steps
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex(prev => (prev + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeStep = STEPS[activeStepIndex];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 w-[650px] h-[450px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Editorial Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-[#0B8F78] dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            ABHA’S AUTOMATION ENGINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0B1220] dark:text-white">
            From Conversation to Completion — Automatically
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn everyday customer messages into an automated pipeline. From first inquiry to instant quotation and paid GST invoice in seconds.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Grid: Abha Character Left, Connected Workflow Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Abha Character & Her Dynamic Reaction Box */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <ScrollReveal delay={100}>
            <div className="relative group">
              {/* Backlight glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-80" />

              {/* Abha Character Container */}
              <div className="relative w-64 h-84 sm:w-72 sm:h-96 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-950 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
                {/* Header Tag */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0B8F78] text-white shadow-sm shadow-emerald-500/30">
                    Abha · Automation
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Step {activeStepIndex + 1} of 7
                  </span>
                </div>

                {/* Abha Character Image */}
                <div className="relative w-full h-full flex items-center justify-center my-2">
                  <Image
                    src="/Abha.png"
                    alt="Abha - UWO Connect Automation Specialist"
                    width={280}
                    height={380}
                    className="object-contain max-h-72 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Dynamic Floating Action Chip Reacting to Current Step */}
                <div className="z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-emerald-200/80 dark:border-emerald-800/80 shadow-lg text-left">
                  <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                    <Sparkles size={11} /> Abha Executing:
                  </div>
                  <div className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                    {activeStep.title} — {activeStep.stat}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Abha Commentary Box */}
          <ScrollReveal delay={200}>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-left max-w-sm">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong className="text-[#0B8F78] dark:text-emerald-400">Abha says:</strong> “I orchestrate the entire customer loop so your sales team never loses a lead or wastes hours generating manual quotations.”
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Single Connected Workflow Timeline (Not 7 separate cards) */}
        <div className="lg:col-span-8">
          <ScrollReveal delay={200}>
            <div className="relative p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Play / Pause & Controls Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Continuous Automation Pipeline
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#0B8F78] dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                    Live Simulator
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>

              {/* Connected Timeline List with Glowing SVG Line */}
              <div className="relative mt-6 space-y-3">
                {/* Glowing Vertical Connection Rail */}
                <div className="absolute top-6 bottom-6 left-5 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-blue-500 rounded-full opacity-30 pointer-events-none" />

                {STEPS.map((s, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveStepIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={cn(
                        "relative flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none",
                        isActive
                          ? "bg-gradient-to-r from-emerald-50/80 via-white to-slate-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 border-[#0B8F78] shadow-md shadow-emerald-500/10 ring-1 ring-[#0B8F78]/30 scale-[1.01]"
                          : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      {/* Step Circle with Glowing Ripple if active */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 text-white shadow-sm",
                            isActive ? "scale-110 shadow-lg" : "opacity-80"
                          )}
                          style={{ backgroundColor: s.color }}
                        >
                          {s.icon}
                        </div>
                      </div>

                      {/* Content Row */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              {s.step}
                            </span>
                            <h4 className={cn(
                              "text-xs sm:text-sm font-extrabold truncate",
                              isActive ? "text-[#0B8F78] dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"
                            )}>
                              {s.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {s.sub}
                          </p>
                        </div>

                        {/* Stat Badge */}
                        <div className="shrink-0">
                          <span className={cn(
                            "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border inline-block",
                            s.bgBadge
                          )}>
                            {s.stat}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Step Details Sub-Panel */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs text-[#0B8F78] dark:text-emerald-400 shrink-0 mt-0.5">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeStep.step}: {activeStep.title} in Action
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                    {activeStep.details}
                  </p>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

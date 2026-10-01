'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, CheckCircle2, MessageSquare, Users,
  Bot, FileCheck, CreditCard, Receipt, Activity, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      num: '01',
      phase: 'DEV ORCHESTRATION',
      title: 'CONNECT',
      leadCharacter: 'DEV',
      headline: 'Dev links your channels & business connectors',
      shortText: 'Connect WhatsApp, Instagram, Facebook, YouTube, Gmail, and Google Sheets in seconds.',
      badge: 'Step 1 • Connect',
      color: 'border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10',
      screenshot: '/dashboard/dashboard_channels.png',
      uiObject: (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-2 text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-blue-700 dark:text-blue-400 font-extrabold">
            <span>Dev OAuth Integration</span>
            <span>Status: Connected</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Meta Cloud API • WhatsApp + IG DM Synced</div>
        </div>
      )
    },
    {
      num: '02',
      phase: 'CHANNEL INGESTION',
      title: 'COMMUNICATE',
      leadCharacter: 'DEV',
      headline: 'Customer inquiry enters unified team inbox',
      shortText: 'Incoming messages are aggregated instantly with 0.1s latency.',
      badge: 'Step 2 • Communicate',
      color: 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      screenshot: '/dashboard/dashboard_inbox.png',
      uiObject: (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-2 text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">
            <span>Customer WhatsApp Query</span>
            <span>0.1s Ingest</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">“Hi, can I get a quotation for the Growth Plan?”</div>
        </div>
      )
    },
    {
      num: '03',
      phase: 'ABHA INTELLIGENCE',
      title: 'AUTOMATE',
      leadCharacter: 'ABHA',
      headline: 'Abha AI identifies intent & queries knowledgebase',
      shortText: 'AI bot auto-replies in 0.2s with accurate business catalog info.',
      badge: 'Step 3 • Automate',
      color: 'border-violet-500/50 text-violet-600 dark:text-violet-400 bg-violet-500/10',
      screenshot: '/dashboard/dashboard_automation.png',
      uiObject: (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-2 text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-violet-700 dark:text-violet-400 font-extrabold">
            <span>Abha AI Bot • Match 99.4%</span>
            <span>0.2s Latency</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">“Hello Rohan! Here is our 2026 Growth Plan overview.”</div>
        </div>
      )
    },
    {
      num: '04',
      phase: 'WORKFLOW & CRM',
      title: 'MANAGE',
      leadCharacter: 'ABHA + DEV',
      headline: 'Lead logged in CRM & GST quotation dispatched',
      shortText: 'Contact scored, deal stage updated, and GST quote PDF sent to WhatsApp.',
      badge: 'Step 4 • Manage',
      color: 'border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10',
      screenshot: '/dashboard/dashboard_crm.png',
      uiObject: (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-2 text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400 font-extrabold">
            <span>CRM Deal #LD-9421</span>
            <span>GST PDF Dispatched</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Quotation #QT-8402 (₹2,999/mo + 18% GST)</div>
        </div>
      )
    },
    {
      num: '05',
      phase: 'FULFILLMENT & TAX',
      title: 'COMPLETE',
      leadCharacter: 'ABHA + DEV',
      headline: 'UPI payment received & GST invoice issued automatically',
      shortText: 'Payment confirmed via webhook, invoice generated, deal Closed-Won.',
      badge: 'Step 5 • Complete',
      color: 'border-teal-500/50 text-teal-600 dark:text-teal-400 bg-teal-500/10',
      screenshot: '/dashboard/dashboard_quotations.png',
      uiObject: (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-2 text-left border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-teal-700 dark:text-teal-400 font-extrabold">
            <span>Payment Confirmed</span>
            <span>Closed-Won</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Tax Invoice #INV-2901 issued &amp; Google Sheet updated</div>
        </div>
      )
    }
  ];

  const currentJourneyStep = journeySteps[activeStep];

  return (
    <LandingLayout activePage="how-it-works">
      {({ isDarkMode }) => (
        <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48 py-16 sm:py-24 lg:py-32 overflow-hidden">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: EXACT SIGNATURE HEADING FORMAT               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-10">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-4"
            >
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  Abha + Dev • Product Journey
                </span>
              </div>

              {/* Main Headline Format */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>Connect. Automate. </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Grow Seamlessly.
                </span>
              </h1>

              <p className={cn(
                "text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto",
                isDarkMode ? "text-slate-300" : "text-slate-600"
              )}>
                Dev connects your communications. Abha automates your front office. Together, they scale your business revenue.
              </p>
            </motion.div>

            {/* Character Duo Showcase */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800/60 shadow-lg text-left">
                <img src="/Dev_transparent.png" alt="Dev" className="w-16 h-auto object-contain" />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">DEV</div>
                  <div className="text-[11px] text-blue-500 font-bold">CONNECTS CHANNELS</div>
                </div>
              </div>

              <div className="text-2xl font-black text-slate-300">+</div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800/60 shadow-lg text-left">
                <img src="/Abha_transparent.png" alt="Abha" className="w-16 h-auto object-contain" />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">ABHA</div>
                  <div className="text-[11px] text-emerald-500 font-bold">AUTOMATES WORKFLOWS</div>
                </div>
              </div>
            </div>

          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. VISUAL 5-STEP JOURNEY STORYBOARD (SIGNATURE HEADING)       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60"
          >

            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  VISUAL JOURNEY
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                <span className="text-slate-900 dark:text-white">The 5-Step Visual Story </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  From Lead To Deal.
                </span>
              </h2>
            </div>

            {/* Horizontal Timeline Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {journeySteps.map((s, idx) => {
                const isActive = idx === activeStep;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "p-4 rounded-2xl text-left transition-all cursor-pointer border space-y-2",
                      isActive
                        ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-lg scale-105"
                        : "bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0B8F78]"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>{s.num}</span>
                      <span className="text-[9px] opacity-80">{s.leadCharacter}</span>
                    </div>
                    <div className="text-sm font-black">{s.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Journey Showcase Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-6 space-y-5">
                <span className={cn("text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase", currentJourneyStep.color)}>
                  {currentJourneyStep.badge}
                </span>

                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{currentJourneyStep.headline}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{currentJourneyStep.shortText}</p>

                {/* UI Object Fragment */}
                <div className="pt-2">{currentJourneyStep.uiObject}</div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl bg-white dark:bg-transparent">
                  <img
                    src={currentJourneyStep.screenshot || '/dashboard/dashboard_main.png'}
                    alt={currentJourneyStep.headline}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

          </motion.section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. CTA                                                         */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white text-center space-y-6 shadow-2xl border border-slate-800">
              <h2 className="text-3xl sm:text-4xl font-black">
                Ready to transform how your business works?
              </h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Connect. Automate. Grow. Start your free trial today.
              </p>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      )}
    </LandingLayout>
  );
}

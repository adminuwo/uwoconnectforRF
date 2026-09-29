'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, CheckCircle2, MessageSquare, Users,
  Bot, FileCheck, CreditCard, Receipt, Activity, Zap, Layers,
  ChevronRight, ChevronLeft, Play, ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import { motion } from 'framer-motion';

export default function AutomationPage() {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      const activeCard = carouselRef.current.children[activeStepIndex];
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStepIndex]);

  const scrollLeft = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    } else {
      setActiveStepIndex(visualNodes.length - 1);
    }
  };

  const scrollRight = () => {
    if (activeStepIndex < visualNodes.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      setActiveStepIndex(0);
    }
  };

  const visualNodes = [
    {
      step: '01',
      title: 'Customer Message',
      badge: 'TRIGGER',
      icon: <MessageSquare size={20} className="text-emerald-500" />,
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">WhatsApp • Inbound Query</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">“Hi! Need a GST quotation for the Growth Plan.”</div>
        </div>
      )
    },
    {
      step: '02',
      title: 'AI Bot Auto-Reply',
      badge: 'AI INTENT',
      icon: <Bot size={20} className="text-blue-500" />,
      color: 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-blue-700 dark:text-blue-400 font-extrabold">Intent Parser • 0.2s</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Intent: Quotation_Request • Confidence: 99.4%</div>
        </div>
      )
    },
    {
      step: '03',
      title: 'Product Catalog',
      badge: 'AI CATALOG MATCH',
      icon: <Layers size={20} className="text-amber-500" />,
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold">Catalog SKU Match</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Growth Plan 2026 • HSN: 998313</div>
        </div>
      )
    },
    {
      step: '04',
      title: 'Knowledgebase',
      badge: 'DOC RETRIEVAL',
      icon: <Zap size={20} className="text-violet-500" />,
      color: 'border-violet-500/50 bg-violet-500/10 text-violet-600 dark:text-violet-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-violet-700 dark:text-violet-400 font-extrabold">Knowledge Retrieval</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">AI Knowledge Matching • 100% Accuracy</div>
        </div>
      )
    },
    {
      step: '05',
      title: 'CRM Lead Pipeline',
      badge: 'LEAD CREATED',
      icon: <Users size={20} className="text-emerald-500" />,
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">CRM Pipeline Lead #9421</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Stage: Inbound Qualified • Score: 98/100</div>
        </div>
      )
    },
    {
      step: '06',
      title: 'Node Workflow',
      badge: 'ORCHESTRATION',
      icon: <Activity size={20} className="text-indigo-500" />,
      color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-extrabold">Node Pipeline Active</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Trigger: Quotation → Checkout Link</div>
        </div>
      )
    },
    {
      step: '07',
      title: 'GST Quotation',
      badge: 'GST PDF',
      icon: <FileCheck size={20} className="text-pink-500" />,
      color: 'border-pink-500/50 bg-pink-500/10 text-pink-600 dark:text-pink-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-pink-700 dark:text-pink-400 font-extrabold">GST Quote #QT-8402</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">₹2,999/mo (+18% GST) PDF Dispatched</div>
        </div>
      )
    },
    {
      step: '08',
      title: 'UPI Payment & Order',
      badge: 'CHECKOUT SYNC',
      icon: <CreditCard size={20} className="text-rose-500" />,
      color: 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-rose-700 dark:text-rose-400 font-extrabold">UPI / Webhook Order</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Payment Confirmed: ₹3,538.82</div>
        </div>
      )
    },
    {
      step: '09',
      title: 'Official Tax Invoice',
      badge: 'CLOSED WON',
      icon: <Receipt size={20} className="text-emerald-500" />,
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      uiFragment: (
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs space-y-1.5 text-left border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">Official Tax Invoice #INV-2901</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">Logged to Google Sheets • Deal Won</div>
        </div>
      )
    }
  ];

  return (
    <LandingLayout activePage="automation">
      {({ isDarkMode }) => (
        <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48 py-16 sm:py-24 lg:py-32 overflow-hidden">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: ABHA & AUTOMATION CAPABILITIES                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 pb-12 sm:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Left Column: Signature Headline */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-6 text-left"
              >
                {/* Top Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                    Abha • Business Automation
                  </span>
                </div>

                {/* Main Headline Format */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                    <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>Let Work Flow </span>
                    <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                      Automatically.
                    </span>
                  </h1>

                  <p className={cn(
                    "text-base sm:text-lg font-normal leading-relaxed",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}>
                    Abha powers your entire front office—from AI bot auto-replies to CRM deal creation, interactive product catalog, GST quotation dispatches, UPI payments, and official GST invoices.
                  </p>
                </div>

                {/* Abha Core Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'WORKFLOWS', 'AI BOT', 'CATALOG', 'QUOTATIONS',
                    'INVOICES', 'ORDERS', 'KNOWLEDGEBASE', 'BROADCAST', 'CRM'
                  ].map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-900 dark:text-white shadow-xs">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/register')}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Build Your Workflows</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>

              {/* Right Column: Prominent Abha Art + Orbiting Capabilities */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-7 relative flex items-center justify-center min-h-[480px] sm:min-h-[540px]"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent rounded-3xl blur-3xl" />

                {/* Abha Character Artwork */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                    <img
                      src="/Abha_transparent.png"
                      alt="Abha Business Automation Specialist"
                      className="w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Surrounding Visual Capabilities */}
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-2 left-2 sm:left-6 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-[#0B8F78] flex items-center gap-2">
                    <Activity size={16} />
                    <span>WORKFLOWS</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.3 }} className="absolute -top-2 right-2 sm:right-6 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-blue-500 flex items-center gap-2">
                    <Bot size={16} />
                    <span>AI BOT</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.5 }} className="absolute top-1/4 -left-4 sm:left-0 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Layers size={16} />
                    <span>CATALOG</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: 0.7 }} className="absolute top-1/4 -right-4 sm:right-0 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-pink-500 flex items-center gap-2">
                    <FileCheck size={16} />
                    <span>GST QUOTATIONS</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.4, repeat: Infinity, delay: 0.9 }} className="absolute top-1/2 -left-6 sm:left-2 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-indigo-500 flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>BROADCAST</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1.1 }} className="absolute bottom-12 left-2 sm:left-8 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-violet-500 flex items-center gap-2">
                    <Zap size={16} />
                    <span>KNOWLEDGEBASE</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 1.3 }} className="absolute bottom-12 right-2 sm:right-8 z-20">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs font-extrabold text-emerald-500 flex items-center gap-2">
                    <Users size={16} />
                    <span>CRM PIPELINE</span>
                  </div>
                </motion.div>

                <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-6 z-20">
                  <div className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5">
                    <Receipt size={18} className="text-rose-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">UPI PAYMENTS &amp; TAX INVOICES</span>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. DEMONSTRATE AUTOMATION VISUALLY (SLIDER CAROUSEL)          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 sm:py-20 space-y-12 border-t border-slate-200/60 dark:border-slate-800/60 relative">

            {/* Ambient Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-blue-500/5 rounded-3xl blur-3xl -z-10" />

            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wider uppercase">
                  END-TO-END AUTOMATION FLOW
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                <span className="text-slate-900 dark:text-white">Message To Invoice </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Fully Automated.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Drag or use the controls below to explore the 9-step automated pipeline.
              </p>
            </div>

            {/* Horizontal Interactive Carousel */}
            <div className="relative pt-2 pb-2">
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-6 px-4 sm:px-8 items-center"
                style={{ scrollBehavior: 'smooth' }}
              >
                {visualNodes.map((node, index) => {
                  const isActive = index === activeStepIndex;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveStepIndex(index)}
                      className={cn(
                        "w-[290px] sm:w-[350px] shrink-0 snap-center p-6 rounded-3xl transition-all duration-300 cursor-pointer text-left space-y-5 relative overflow-hidden group border",
                        isActive
                          ? "bg-white dark:bg-slate-900 border-[#0B8F78] ring-4 ring-[#0B8F78]/20 shadow-2xl scale-105 z-10"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:scale-102 hover:border-[#0B8F78]"
                      )}
                    >
                      {/* Step Number & Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black bg-gradient-to-r from-[#0B8F78] to-blue-600 bg-clip-text text-transparent">
                          {node.step}
                        </span>
                        <span className={cn("text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider", node.color)}>
                          {node.badge}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xs">
                          {node.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                            {node.title}
                          </h3>
                        </div>
                      </div>

                      {/* UI Fragment */}
                      <div>{node.uiFragment}</div>

                      {/* Accent Underline */}
                      <div className="pt-2 flex justify-center">
                        <div className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          isActive ? "w-16 bg-gradient-to-r from-[#0B8F78] to-blue-500 shadow-md shadow-emerald-500/50" : "w-8 bg-slate-200 dark:bg-slate-800"
                        )} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Navigation Controls (Left Arrow, Progress Trackbar, Right Arrow) */}
            <div className="max-w-2xl mx-auto space-y-6 pt-2">
              <div className="flex items-center justify-between gap-6 px-4">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Previous Step"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#0B8F78] dark:hover:text-emerald-400 hover:border-[#0B8F78] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Progress Trackbar */}
                <div className="flex-1 space-y-2">
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#0B8F78] via-teal-500 to-blue-500 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${((activeStepIndex + 1) / visualNodes.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 dark:text-slate-400 px-1">
                    <span>Step {activeStepIndex + 1} of {visualNodes.length}</span>
                    <span className="text-[#0B8F78] font-black">{visualNodes[activeStepIndex].title}</span>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Next Step"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#0B8F78] dark:hover:text-emerald-400 hover:border-[#0B8F78] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Step Selector Buttons (01 - 09) */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {visualNodes.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    className={cn(
                      "w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer border",
                      i === activeStepIndex
                        ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-md scale-110"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    )}
                  >
                    {n.step}
                  </button>
                ))}
              </div>
            </div>

          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. CTA WITH SPACING                                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12"
          >
            <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white text-center space-y-6 shadow-2xl border border-slate-800">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Automate your business workflows today.
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
                Let Abha respond to queries, issue quotations, and log payments on autopilot.
              </p>
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-9 py-4 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Automating Free</span>
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

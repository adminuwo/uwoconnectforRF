'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, LayoutDashboard, Users, Bot, FileCheck,
  Receipt, MessageSquare, Layers, ShieldCheck, Zap, Activity, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const featureShowcase = [
    {
      id: 'dashboard',
      name: 'Team Dashboard',
      badge: 'DEV + ABHA CORE',
      tagline: 'Multi-user team permissions & real-time activity feed',
      screenshot: '/dashboard/dashboard_main.png',
      smallLabels: ['Real-time Feed Sync', 'Role-Based Access', 'Live Activity Stream'],
    },
    {
      id: 'inbox',
      name: 'Unified Inbox',
      badge: 'DEV CHANNELS',
      tagline: 'WhatsApp, Instagram & Facebook messages in one inbox',
      screenshot: '/dashboard/dashboard_inbox.png',
      smallLabels: ['0.1s Latency', 'Multi-channel Stream', 'Round-Robin Dispatch'],
    },
    {
      id: 'crm',
      name: 'Unified CRM',
      badge: 'ABHA SALES ENGINE',
      tagline: 'Auto-capture leads & visual deal pipeline stages',
      screenshot: '/dashboard/dashboard_crm.png',
      smallLabels: ['Auto Lead Scoring', 'Custom Deal Stages', 'Contact Timeline'],
    },
    {
      id: 'automation',
      name: 'AI Auto Reply & Bot',
      badge: 'ABHA INTELLIGENCE',
      tagline: '24/7 knowledgebase responses & instant resolution',
      screenshot: '/dashboard/dashboard_automation.png',
      smallLabels: ['0.2s Dispatch', 'Multi-lingual Understanding', 'Knowledgebase Matching'],
    },
    {
      id: 'quotations',
      name: 'Quotations & Invoicing',
      badge: 'ABHA BILLING',
      tagline: 'Instant GST quotation PDFs & automatic tax invoice generation',
      screenshot: '/dashboard/dashboard_quotations.png',
      smallLabels: ['GST/HSN Tax Compliant', 'PDF WhatsApp Dispatch', 'Google Sheets Sync'],
    },
    {
      id: 'connectors',
      name: 'Tools & Connectors',
      badge: 'DEV INTEGRATIONS',
      tagline: 'Gmail, Outlook, Sheets, Docs, OneDrive, Maps & News Feed',
      screenshot: '/dashboard/dashboard_connectors.png',
      smallLabels: ['Gmail Sync', 'Google Sheets Sync', 'Google Docs PDF Engine'],
    }
  ];

  const currentFeature = featureShowcase.find(f => f.id === activeTab) || featureShowcase[0];

  return (
    <LandingLayout activePage="features">
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
                  Abha + Dev • Product Capabilities
                </span>
              </div>

              {/* Main Headline Format */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>Connect Channels. </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Automate Work.
                </span>
              </h1>

              <p className={cn(
                "text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto",
                isDarkMode ? "text-slate-300" : "text-slate-600"
              )}>
                Dev connects your communication and integrations. Abha powers your AI, CRM, and billing workflows.
              </p>
            </motion.div>

            {/* Visual Character Duo Hero Concept */}
            <div className="relative max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Left Side: Dev (Connect) */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <img
                    src="/Dev_transparent.png"
                    alt="Dev"
                    className="w-36 sm:w-44 h-auto object-contain mx-auto drop-shadow-xl hover:scale-105 transition-transform"
                  />
                  <div className="mt-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase">
                    DEV → CONNECT
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Channels • Integrations • Inbox
                </div>
              </div>

              {/* Right Side: Abha (Automate) */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <img
                    src="/Abha_transparent.png"
                    alt="Abha"
                    className="w-36 sm:w-44 h-auto object-contain mx-auto drop-shadow-xl hover:scale-105 transition-transform"
                  />
                  <div className="mt-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase">
                    ABHA → AUTOMATE
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  AI Bot • CRM • Quotations • Invoices
                </div>
              </div>

            </div>

          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. VISUAL PRODUCT SHOWCASE (SIGNATURE HEADING)                 */}
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
                  PRODUCT SHOWCASE
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                <span className="text-slate-900 dark:text-white">Explore Product Capabilities </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Visually In Action.
                </span>
              </h2>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {featureShowcase.map((f) => {
                const isActive = f.id === activeTab;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveTab(f.id)}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer border",
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-lg scale-105"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    )}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>

            {/* Active Visual Product Showcase */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl text-left space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                    {currentFeature.badge}
                  </span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{currentFeature.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{currentFeature.tagline}</p>
                </div>

                {/* Small labels */}
                <div className="flex flex-wrap gap-2">
                  {currentFeature.smallLabels.map((lbl, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                      ✓ {lbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Screenshot */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
                <img
                  src={currentFeature.screenshot}
                  alt={currentFeature.name}
                  className="w-full h-auto object-cover"
                />
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
                Experience the full UWO Connect platform.
              </h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Connect your team, channels, and automation workflows in minutes.
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

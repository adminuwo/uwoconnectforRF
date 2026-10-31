'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════
// 8 INDUSTRY SHOWCASE DATA (EDITORIAL SPLIT-SCREEN)
// ════════════════════════════════════════════════════════════════
export const INDUSTRIES = [
  {
    id: 'education',
    num: '01',
    name: 'Education',
    tagline: 'Admissions & Campus CRM',
    description: 'Automate student enquiries, fee reminders and admission pipelines on WhatsApp, web chat and SMS. Free up administrative staff while providing parents with instant answers.',
    visual: '/solutions/education_3d_loop.webp',
    metric: '45% Faster Admissions',
    features: ['Instant Lead Capture', 'Automated Fee Alerts', 'Parent WhatsApp Bot', 'Multi-Campus CRM Sync'],
    link: '/auth/register?industry=education'
  },
  {
    id: 'real-estate',
    num: '02',
    name: 'Real Estate',
    tagline: 'Property Leads & Site Visits',
    description: 'Capture buyer inquiries from social ads instantly, dispatch digital floorplans via WhatsApp, and schedule site visits automatically without manual back-and-forth.',
    visual: '/solutions/real_estate_3d_loop.webp',
    metric: '3x Lead Conversion',
    features: ['Brochure Dispatch Bot', 'Site Visit Scheduler', 'Agent Assignment CRM', 'Virtual Tour Sharing'],
    link: '/auth/register?industry=real-estate'
  },
  {
    id: 'finance',
    num: '03',
    name: 'Finance & Banking',
    tagline: 'Secure FinTech Comms',
    description: 'Streamline loan inquiries, automated KYC document collection, EMI payment alerts, and transactional notifications with banking-grade 256-bit encryption.',
    visual: '/solutions/finance_3d_loop.webp',
    metric: '99.9% Enterprise SLA',
    features: ['Instant KYC Collection', 'Secure OTP & Auth', 'EMI Payment Reminders', 'Automated Account Alerts'],
    link: '/auth/register?industry=finance'
  },
  {
    id: 'healthcare',
    num: '04',
    name: 'Healthcare & Clinics',
    tagline: 'Patient Care & Triage',
    description: 'Enable 24/7 doctor appointment bookings, smart symptom triage, and automated digital lab test report delivery. Reduce OPD waiting times and clinic phone traffic.',
    visual: '/solutions/healthcare_3d_loop.webp',
    metric: 'Zero Patient Wait Time',
    features: ['24/7 OPD Booking', 'Automated Lab Reports', 'Doctor Schedule Sync', 'Prescription Dispatch'],
    link: '/auth/register?industry=healthcare'
  },
  {
    id: 'automobile',
    num: '05',
    name: 'Automobile',
    tagline: 'Dealership & Service CRM',
    description: 'Drive showroom footfall, automate test-drive schedules, and notify car owners for periodic vehicle service intervals with automated WhatsApp booking links.',
    visual: '/solutions/automobile_3d_loop.webp',
    metric: '2.5x Booking Rate',
    features: ['Test Drive Booking', 'Service Due Reminders', 'Trade-In Valuation Bot', 'Showroom Lead Routing'],
    link: '/auth/register?industry=automobile'
  },
  {
    id: 'logistics',
    num: '06',
    name: 'Logistics & Supply',
    tagline: 'Dispatch & Shipment Tracking',
    description: 'Keep customers updated with live delivery alerts, driver coordination webhooks, and real-time tracking links directly in their messaging inbox.',
    visual: '/solutions/logistics_3d_loop.webp',
    metric: 'Instant Delivery Updates',
    features: ['Live Order Tracking', 'Driver Dispatch Sync', 'Proof of Delivery Bot', 'Exception Alerts'],
    link: '/auth/register?industry=logistics'
  },
  {
    id: 'ecommerce',
    num: '07',
    name: 'E-Commerce & Retail',
    tagline: 'Cart Recovery & Support',
    description: 'Recover abandoned carts with personalized WhatsApp incentives, broadcast deals, confirm cash-on-delivery orders, and resolve customer queries 24/7.',
    visual: '/solutions/ecommerce_3d_loop.webp',
    metric: '+32% Cart Recovery',
    features: ['Cart Drop Recovery', 'COD Confirmation Bot', 'Order Status & Returns', 'VIP Discount Blasts'],
    link: '/auth/register?industry=ecommerce'
  },
  {
    id: 'travel',
    num: '08',
    name: 'Travel & Hospitality',
    tagline: 'Bookings & Concierge',
    description: 'Deliver instant 24/7 guest concierge, room booking confirmations, and automated itinerary updates seamlessly across domestic and international travelers.',
    visual: '/solutions/travel_3d_loop.webp',
    metric: 'Zero Missed Enquiries',
    features: ['Itinerary WhatsApp Bot', 'Check-In Reminders', 'VIP Guest Concierge', 'Instant Room Service'],
    link: '/auth/register?industry=travel'
  }
];

export default function ScrollIndustryShowcase({ isDarkMode = false }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIndustry = INDUSTRIES[activeIdx];

  return (
    <section
      id="solutions-showcase"
      className="w-full relative scroll-mt-16 pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden"
    >
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SUBTLE UNIFIED BACKGROUND AMBIENCE                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0B8F78]/5 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION HEADER (CLEAN & MINIMAL)                              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className={cn(
            "text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            Built for how your industry{' '}
            <span className="text-[#0B8F78]">
              communicates.
            </span>
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MOBILE HORIZONTAL SELECTOR (CLEAN PILL TABS)                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDUSTRIES.map((ind, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                  isActive
                    ? "bg-[#0B8F78] text-white shadow-md shadow-emerald-800/30"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white bg-transparent border border-white/10"
                    : "text-slate-600 hover:text-slate-900 bg-transparent border border-slate-200"
                )}
              >
                <span className="text-[10px] font-mono opacity-70">{ind.num}</span>
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MODERN EDITORIAL SPLIT-SCREEN (100% PURE & BORDERLESS)        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: EDITORIAL INDUSTRY LIST (Clean Typography)     */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col space-y-1">
            {INDUSTRIES.map((ind, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={ind.id}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "group relative pl-6 pr-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between",
                    isActive
                      ? "bg-[#0B8F78]/10"
                      : (isDarkMode ? "hover:bg-white/5 bg-transparent" : "hover:bg-slate-100/50 bg-transparent")
                  )}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndustryIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-[#0B8F78] rounded-r-full shadow-[0_0_8px_#0B8F78]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-mono font-bold transition-colors",
                        isActive
                          ? "text-[#0B8F78]"
                          : (isDarkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600")
                      )}>
                        {ind.num}
                      </span>
                      <h3 className={cn(
                        "text-base font-bold tracking-tight transition-colors",
                        isActive
                          ? (isDarkMode ? "text-white" : "text-slate-900")
                          : (isDarkMode ? "text-slate-400 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900")
                      )}>
                        {ind.name}
                      </h3>
                    </div>
                    <p className={cn(
                      "text-xs transition-colors",
                      isActive
                        ? (isDarkMode ? "text-slate-300" : "text-slate-600")
                        : (isDarkMode ? "text-slate-500 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-600")
                    )}>
                      {ind.tagline}
                    </p>
                  </div>

                  <ArrowRight
                    size={14}
                    className={cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-[#0B8F78] translate-x-0 opacity-100"
                        : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: EXPANSIVE INTERACTIVE STAGE (Borderless)       */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* Visual Stage & 3D Object */}
                <div className="relative flex items-center justify-center p-6 sm:p-10 rounded-3xl overflow-hidden">
                  {/* Subtle Background Glow behind 3D Object */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 bg-[#0B8F78]/15 blur-3xl rounded-full" />
                  </div>

                  {/* 3D Visual Loop */}
                  <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center select-none pointer-events-none">
                    <img
                      src={activeIndustry.visual}
                      alt={activeIndustry.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="space-y-4">
                  
                  {/* Header Badge & Metric */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-[#0B8F78] bg-[#0B8F78]/10 border border-[#0B8F78]/20">
                      <Sparkles size={12} />
                      <span>{activeIndustry.tagline}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B8F78]">
                      <CheckCircle2 size={14} />
                      <span>{activeIndustry.metric}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "text-2xl sm:text-3xl font-black tracking-tight",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}>
                    {activeIndustry.name}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    "text-sm sm:text-base leading-relaxed font-normal",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}>
                    {activeIndustry.description}
                  </p>

                  {/* Feature Capabilities (Borderless Clean Pills) */}
                  <div className="pt-2">
                    <div className={cn(
                      "text-xs font-bold uppercase tracking-wider mb-2.5",
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    )}>
                      Pre-Configured Capabilities:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeIndustry.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            isDarkMode
                              ? "bg-[#0B8F78]/5 text-emerald-300 border border-[#0B8F78]/25"
                              : "bg-emerald-50/80 text-emerald-950 border border-emerald-200/80"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B8F78]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <div className="pt-4 flex items-center gap-4">
                    <Link
                      href={activeIndustry.link}
                      className="px-6 py-3 rounded-full bg-[#0B8F78] hover:bg-[#097361] text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 hover:scale-105 active:scale-95"
                    >
                      <span>Explore {activeIndustry.name} Solutions</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* BOTTOM ENTERPRISE INLINE BANNER (NO CHUNKY CARD)               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="pt-10 sm:pt-14 border-t border-[#0B8F78]/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className={cn(
                "text-base sm:text-lg font-bold tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Need a custom workflow for your enterprise?
              </h4>
              <p className={cn(
                "text-xs sm:text-sm",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}>
                UWO Connect integrates with custom ERPs, legacy databases and proprietary CRMs.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="px-6 py-2.5 rounded-full bg-[#0B8F78] hover:bg-[#097361] text-white text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shadow-md shadow-emerald-950/20 shrink-0"
            >
              <span>Connect with an Expert →</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import ScrollIndustryShowcase from '../solutions/ScrollIndustryShowcase';

export default function SolutionsPage() {
  const scrollToSolutions = () => {
    const el = document.getElementById('solutions-showcase');
    if (el) {
      const navbarHeight = 72;
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - navbarHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <LandingLayout activePage="solutions">
      {({ isDarkMode }) => (
        <div className="w-full">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: CLEAN EDITORIAL HERO (NO CHUNKY CARDS)              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pt-16 sm:pt-24 pb-8 sm:pb-12 flex flex-col items-center justify-center">
            
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute inset-0 -top-24 -z-10 pointer-events-none flex justify-center overflow-hidden">
              <div className="w-[680px] h-[340px] bg-gradient-to-tr from-[#0B8F78]/15 via-teal-500/5 to-transparent blur-[140px] rounded-full opacity-60" />
            </div>

            {/* Minimalist Pill Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0B8F78]/30 bg-[#0B8F78]/5 text-xs font-bold uppercase tracking-widest text-[#0B8F78] mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B8F78] animate-ping" />
              <span>Industry-Specific AI Solutions</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl"
            >
              <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>
                Solutions for Every{' '}
              </span>
              <span className="text-[#0B8F78]">
                Industry
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                "text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed mt-5",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}
            >
              Pre-built multi-channel bots, intelligent lead pipelines and CRM integrations tailored for how your business works.
            </motion.p>

            {/* Clean Inline Highlights (Borderless & Elegant) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs sm:text-sm font-medium"
            >
              <span className={cn(isDarkMode ? "text-slate-400" : "text-slate-600")}>
                ⚡ <strong className={isDarkMode ? "text-white" : "text-slate-900"}>3x Higher</strong> Lead Conversion
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className={cn(isDarkMode ? "text-slate-400" : "text-slate-600")}>
                💬 <strong className={isDarkMode ? "text-white" : "text-slate-900"}>Zero Missed</strong> Enquiries 24/7
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className={cn(isDarkMode ? "text-slate-400" : "text-slate-600")}>
                🛡️ <strong className={isDarkMode ? "text-white" : "text-slate-900"}>99.9% Uptime</strong> Enterprise SLA
              </span>
            </motion.div>

            {/* Single Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8"
            >
              <button
                type="button"
                onClick={scrollToSolutions}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-sm font-bold shadow-lg shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Solutions</span>
                <ArrowDown size={16} />
              </button>
            </motion.div>

          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: EDITORIAL SPLIT-SCREEN SHOWCASE (ZERO CARDS)        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <ScrollIndustryShowcase isDarkMode={isDarkMode} />

        </div>
      )}
    </LandingLayout>
  );
}

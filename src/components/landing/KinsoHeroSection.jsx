'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function KinsoHeroSection({ isDark }) {
  return (
    <section className="relative pt-16 pb-20 lg:pt-28 lg:pb-32 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00AB56]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* AI Workspace Tag Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide uppercase shadow-sm backdrop-blur-md"
          style={{
            borderColor: isDark ? 'rgba(0, 171, 86, 0.3)' : 'rgba(0, 171, 86, 0.25)',
            backgroundColor: isDark ? 'rgba(0, 171, 86, 0.1)' : 'rgba(0, 171, 86, 0.08)',
            color: '#00AB56',
          }}
        >
          <Sparkles className="w-4 h-4 text-[#00AB56]" />
          <span>Next-Gen Enterprise AI Workspace</span>
        </motion.div>

        {/* Crisp & Visible Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          One AI Workspace for Every{' '}
          <span className="text-[#00AB56] underline decoration-[#00AB56]/30 underline-offset-8">
            Customer Conversation.
          </span>
        </motion.h1>

        {/* Centered Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto font-normal ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Manage conversations from WhatsApp, Facebook, Instagram, Telegram, LinkedIn, X,
          YouTube, TikTok, Email, and more from one intelligent dashboard powered by AI
          automation, CRM, team collaboration, and workflow automation.
        </motion.p>

        {/* Centered CTA Buttons: 1 Solid Green Button & 1 Solid Blue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Solid Green CTA Button */}
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00AB56] hover:bg-[#008947] text-white px-9 py-4.5 rounded-2xl font-semibold text-base shadow-lg shadow-[#00AB56]/30 hover:shadow-xl hover:shadow-[#00AB56]/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Start Free
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Solid Blue CTA Button */}
          <Link
            href="/book"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-9 py-4.5 rounded-2xl font-semibold text-base shadow-lg shadow-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Book Demo
          </Link>
        </motion.div>

        {/* Centered Key Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-gray-500"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00AB56]" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00AB56]" />
            <span>14-Day Free Trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00AB56]" />
            <span>SOC 2 Compliant</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

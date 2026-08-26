'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function KinsoProblemStatement({ isDark }) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
        {/* Editorial Subtitle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
            The Omnichannel Dilemma
          </span>
        </motion.div>

        {/* Main Kinso Narrative Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Customer conversations are everywhere.{' '}
          <span className="text-[#00AB56] underline decoration-[#00AB56]/30 underline-offset-4 sm:underline-offset-8">
            Your team shouldn't be.
          </span>
        </motion.h2>

        {/* Clean Editorial Story Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 sm:space-y-6 text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-left sm:text-center max-w-3xl mx-auto"
        >
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Customers reach your business through WhatsApp, Facebook, Instagram, Telegram,
            LinkedIn, Email, X, YouTube, TikTok, websites, and other communication channels. Switching
            between apps slows your team, creates missed opportunities, and makes customer support
            difficult.
          </p>

          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            UWO Connect brings every conversation into one AI-powered workspace where your team can
            collaborate, automate repetitive work, prioritize important conversations, and deliver
            exceptional customer experiences from a single dashboard.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

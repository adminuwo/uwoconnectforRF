'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function KinsoProblemStatement({ isDark }) {
  return (
    <section className="py-28 sm:py-36 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
        {/* Editorial Subtitle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] px-4 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20">
            The Omnichannel Dilemma
          </span>
        </motion.div>

        {/* Main Kinso Narrative Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Customer conversations are everywhere.{' '}
          <span className="text-[#16A34A] underline decoration-[#16A34A]/30 underline-offset-8">
            Your team shouldn't be.
          </span>
        </motion.h2>

        {/* Clean Editorial Story Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-left sm:text-center max-w-3xl mx-auto"
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

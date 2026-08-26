'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function KinsoCTA({ isDark }) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`p-6 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl border relative shadow-xl sm:shadow-2xl space-y-6 sm:space-y-8 overflow-hidden ${
            isDark
              ? 'bg-[#0E131F] border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900 shadow-xl'
          }`}
        >
          {/* Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[300px] bg-[#00AB56]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none -z-10 max-w-full" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#00AB56] bg-[#00AB56]/10 border-[#00AB56]/20">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Instant Setup • No Credit Card Required</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.2] max-w-3xl mx-auto ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to manage every customer conversation from one intelligent platform?
          </h2>

          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join enterprise support teams, revenue leaders, and fast-growing businesses scaling with UWO Connect today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto w-full">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00AB56] hover:bg-[#008947] text-white px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base shadow-lg shadow-[#00AB56]/30 hover:shadow-xl hover:shadow-[#00AB56]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base shadow-lg shadow-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Book Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

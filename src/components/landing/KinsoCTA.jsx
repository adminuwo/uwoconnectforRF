'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function KinsoCTA({ isDark }) {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`p-10 sm:p-16 rounded-3xl border relative shadow-2xl space-y-8 ${
            isDark
              ? 'bg-[#0E131F] border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900 shadow-xl'
          }`}
        >
          {/* Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#16A34A]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Setup • No Credit Card Required</span>
          </div>

          <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] max-w-3xl mx-auto ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to manage every customer conversation from one intelligent platform?
          </h2>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join enterprise support teams, revenue leaders, and fast-growing businesses scaling with UWO Connect today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00AB56] hover:bg-[#008947] text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-[#00AB56]/30 hover:shadow-xl hover:shadow-[#00AB56]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Book a Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Cpu, Layers } from 'lucide-react';

export default function KinsoTrustedBy({ isDark }) {
  const logos = [
    { name: 'Acme Corp', symbol: '❖ ACME' },
    { name: 'Linear', symbol: '▲ LINEAR' },
    { name: 'Notion', symbol: '🅝 NOTION' },
    { name: 'Vercel', symbol: '▲ VERCEL' },
    { name: 'Supabase', symbol: '⚡ SUPABASE' },
    { name: 'Stripe', symbol: 'S STRIPE' },
  ];

  const pillars = [
    {
      title: 'Fast onboarding',
      description: 'Connect all your communication channels in under 5 minutes without developer assistance.',
      icon: Rocket,
    },
    {
      title: 'Enterprise security',
      description: 'Bank-grade encryption, SOC-ready infrastructure, strict role-based access, and full audit trails.',
      icon: ShieldCheck,
    },
    {
      title: 'AI powered',
      description: 'Context-aware neural agents that understand intent, sentiment, customer history, and business rules.',
      icon: Cpu,
    },
    {
      title: 'Multi-channel communication',
      description: 'Unified inbox handling WhatsApp, Instagram, Telegram, Email, LinkedIn, X, TikTok, and more.',
      icon: Layers,
    },
  ];

  return (
    <section className={`py-16 border-y transition-colors duration-300 ${
      isDark ? 'bg-[#080B12] border-white/10' : 'bg-[#EBF7F1]/70 border-[#16A34A]/15'
    }`}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Company Logos Header */}
        <div className="text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Trusted by Modern Businesses & Global Support Teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {logos.map((logo) => (
              <span
                key={logo.name}
                className={`text-lg sm:text-xl font-bold tracking-tighter ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors cursor-default`}
              >
                {logo.symbol}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                    : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

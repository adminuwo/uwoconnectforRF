'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, CheckCircle2, Sparkles, ArrowUpRight,
  HelpCircle, Shield, Zap, Users, MessageSquare,
  ChevronDown, ChevronUp, Plus, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import PricingComparisonTable from '@/components/pricing/PricingComparisonTable';
import CustomPlanSection from '@/components/landing/CustomPlanSection';
import { motion, AnimatePresence } from 'framer-motion';

const trustSignals = [
  {
    icon: <Shield size={18} />,
    title: 'No Hidden Charges',
    desc: 'Subscription and wallet are completely separate. You always know what you pay.',
    color: 'text-blue-500',
  },
  {
    icon: <Zap size={18} />,
    title: 'Instant Activation',
    desc: 'Your workspace activates immediately after payment confirmation.',
    color: 'text-amber-500',
  },
  {
    icon: <Users size={18} />,
    title: 'Cancel Anytime',
    desc: 'No lock-in contracts. Manage or cancel your plan directly from your dashboard.',
    color: 'text-emerald-500',
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'Dedicated Support',
    desc: 'Every plan includes access to our support and onboarding assistance.',
    color: 'text-violet-500',
  },
];

const pricingFaqs = [
  {
    q: 'What is included in my UWO Connect plan?',
    a: 'Each plan includes a specific set of features, channels, connectors and usage limits. The exact features included in each plan are shown in the Pricing Plans section above.'
  },
  {
    q: 'Are subscription and wallet charges separate?',
    a: 'Yes. Your UWO Connect subscription and prepaid usage wallet are completely separate. Subscription pays for your platform plan, while the wallet covers usage-based services. Wallet balance is not used to pay the subscription.'
  },
  {
    q: 'What is the UWO Connect wallet?',
    a: 'The wallet is a prepaid balance that can be used for applicable usage-based UWO Connect services. You can add money to the wallet separately from your subscription.'
  },
  {
    q: 'What happens after I use all my included broadcasts?',
    a: 'Once the broadcasts included in your plan have been used, additional broadcasts can be charged from your wallet if sufficient wallet balance is available. The applicable additional broadcast price will be shown in UWO Connect.'
  },
  {
    q: 'What happens if my wallet balance reaches zero?',
    a: 'Your subscription can remain active. However, usage-based services that require wallet balance may be restricted until you recharge your wallet.'
  },
  {
    q: 'Does UWO Connect offer white-label solutions?',
    a: 'Yes. UWO Connect provides white-label/agency capabilities for eligible partners. Availability and commercial terms may vary.'
  },
  {
    q: 'Is my payment information secure?',
    a: 'Payments are processed through supported payment providers. UWO Connect does not ask users to share payment credentials directly through normal chat or support channels.'
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes. You can manage your subscription plan directly from your UWO Connect account dashboard. Changes take effect according to your billing cycle.'
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <LandingLayout activePage="pricing">
      {({ isDarkMode }) => (
        <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48 py-16 sm:py-24 lg:py-32 overflow-hidden">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: EXACT SIGNATURE HEADING FORMAT               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                  Transparent Pricing
                </span>
              </div>

              {/* Main Headline Format */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>Simple Plans For </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Every Business Size.
                </span>
              </h1>

              <p className={cn(
                'text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto',
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              )}>
                One subscription gives you access to all 9 business engines — AI automation, unified CRM, GST invoicing, product catalogs, and much more.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Start Free — No Credit Card</span>
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/features"
                  className={cn(
                    'px-7 py-3.5 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95',
                    isDarkMode
                      ? 'bg-transparent border-slate-800 text-slate-200 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  )}
                >
                  <span>Compare All Features</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </motion.div>

            {/* Trust Signals Strip */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {trustSignals.map((t, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className={cn(
                    'p-4 rounded-2xl border text-center space-y-2 transition-all',
                    isDarkMode ? 'bg-transparent border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  )}
                >
                  <span className={cn('flex justify-center', t.color)}>{t.icon}</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{t.title}</div>
                </motion.div>
              ))}
            </motion.div>

          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. PRICING TABLE                                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            <PricingComparisonTable
              onSelectPlan={() => router.push('/auth/login')}
              dark={isDarkMode}
            />
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. CUSTOM PLAN SECTION                                         */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            <CustomPlanSection isDarkMode={isDarkMode} />
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 4. PRICING FAQs                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                  BILLING FAQs
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                <span className="text-slate-900 dark:text-white">Common Pricing </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Questions Answered.
                </span>
              </h2>
              <p className={cn('text-sm sm:text-base font-normal max-w-xl mx-auto', isDarkMode ? 'text-slate-300' : 'text-slate-600')}>
                Everything you need to know about UWO Connect billing and plans.
              </p>
            </motion.div>

            <div className="space-y-3">
              {pricingFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className={cn(
                      'rounded-2xl border transition-all overflow-hidden',
                      isDarkMode ? 'bg-transparent border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <Minus size={18} className="text-[#0B8F78] shrink-0" /> : <Plus size={18} className="text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </section>

        </div>
      )}
    </LandingLayout>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Database, ExternalLink, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';
import { cn } from '@/lib/utils';
import LandingLayout from '@/components/landing/LandingLayout';

export default function PrivacyClient() {
  return (
    <LandingLayout activePage="privacy">
      {({ isDarkMode }) => (
        <div className={cn(
          "w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300",
          isDarkMode ? "bg-[#070B14] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
        )}>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Hero */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>DATA PRIVACY &amp; PROTECTION</span>
              </div>
              <h1 className={cn(
                "text-3xl sm:text-5xl font-black tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Privacy Policy
              </h1>
              <p className={cn(
                "text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}>
                At UWO Connect, we are committed to safeguarding your personal and business communication data with end-to-end security and international data compliance standards.
              </p>
            </div>

            {/* Content Card */}
            <div className={cn(
              "rounded-3xl p-6 sm:p-10 md:p-12 space-y-8 text-xs sm:text-sm leading-relaxed border transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200/80 text-slate-700"
            )}>
              <div>
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                  Information We Collect
                </h2>
                <p className="mb-3">
                  We collect account registration details (such as your name, corporate email address, and phone number), business profile configurations, and authentication credentials required to interface with third-party messaging providers.
                </p>
                <ul className={cn(
                  "list-disc pl-5 space-y-2 text-xs sm:text-sm",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  <li><strong>Account Data:</strong> Name, work email, encrypted authentication credentials, and billing details.</li>
                  <li><strong>Channel Integration Tokens:</strong> Meta WhatsApp Cloud API credentials, Instagram graph tokens, and connected webhook URLs.</li>
                  <li><strong>Usage Telemetry:</strong> Anonymized interaction logs and performance metrics used to ensure zero message latency.</li>
                </ul>
              </div>

              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6">
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                  How We Protect Your Communications
                </h2>
                <p className="mb-2">
                  All customer chat interactions and database communications are transmitted across 256-bit TLS encrypted tunnels. We never sell, monetize, or rent your business communication records to advertising brokers.
                </p>
                <p>
                  API tokens and Meta webhook signing secrets are stored using AES-256 server-side encryption with strict hardware security modules (HSMs).
                </p>
              </div>

              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6">
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                  Third-Party Integrations &amp; Subprocessors
                </h2>
                <p>
                  We utilize enterprise cloud infrastructure providers (MongoDB Atlas, AWS, Firebase) and authorized payment processors (Cashfree, Razorpay) strictly to provide infrastructure and payment processing under binding Data Processing Agreements (DPAs).
                </p>
              </div>

              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6">
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">4</span>
                  Data Subject Rights &amp; Inquiries
                </h2>
                <p className="mb-3">
                  You have the right to request access, correction, or deletion of your personal data at any time. For privacy inquiries or compliance verification, contact our Data Protection Officer at:
                </p>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LandingLayout>
  );
}

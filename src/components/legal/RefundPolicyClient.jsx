'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '@/components/landing/LandingLayout';

export default function RefundPolicyClient() {
  return (
    <LandingLayout activePage="refund-policy">
      {({ isDarkMode }) => (
        <div className={cn(
          "w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300",
          isDarkMode ? "bg-[#070B14] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
        )}>
          <div className="max-w-4xl mx-auto">
            {/* Header Hero */}
            <div className="mb-10 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>CUSTOMER ASSURANCE &amp; GUARANTEE</span>
              </div>
              <h1 className={cn(
                "text-3xl sm:text-5xl font-black tracking-tight",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Cancellation &amp; Refund Policy
              </h1>
              <p className={cn(
                "text-xs sm:text-sm",
                isDarkMode ? "text-slate-400" : "text-slate-500"
              )}>
                Last updated: July 2026 • 7-Day Money-Back Guarantee
              </p>
            </div>

            <div className={cn(
              "rounded-3xl p-6 sm:p-10 md:p-12 space-y-6 text-xs sm:text-sm leading-relaxed border transition-all shadow-xs",
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200/80 text-slate-700"
            )}>
              <div>
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                  Subscription Cancellation
                </h2>
                <p className="mb-2">
                  You can cancel your UWO Connect subscription plan at any time from your Account Settings page or by submitting a written request to our support team at <a href="mailto:connect@uwo24.com" className="text-emerald-600 font-bold hover:underline">connect@uwo24.com</a>.
                </p>
                <p>
                  Upon cancellation, your subscription will remain active until the end of your current paid billing cycle (monthly or annual). You will not be charged for subsequent billing periods after cancellation.
                </p>
              </div>

              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6">
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                  Money-Back Guarantee &amp; Refund Eligibility
                </h2>
                <p className="mb-3">
                  We offer a <strong>7-day money-back guarantee</strong> for all new workspace subscription plans (Starter, Growth, Enterprise). If you are unsatisfied with our platform services within 7 calendar days of your initial purchase, you may request a 100% full refund.
                </p>
                <ul className={cn(
                  "list-disc pl-5 space-y-2 text-xs sm:text-sm",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  <li>Refund requests must be made within 7 days of subscription activation.</li>
                  <li>Refunds apply to initial subscription sign-ups and do not apply to recurring renewals after 7 days unless there is a duplicate charge or billing error.</li>
                  <li>Add-on services or third-party WhatsApp Meta conversation API charges billed directly by Meta are non-refundable through UWO Connect.</li>
                </ul>
              </div>

              <div className="border-t border-slate-200/60 dark:border-slate-800 pt-6">
                <h2 className={cn("text-lg sm:text-xl font-black mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                  Refund Processing Timeline
                </h2>
                <p>
                  Approved refunds will be processed within 5 to 7 business days via the original method of payment (UPI, Credit/Debit Card, or Net Banking).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </LandingLayout>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-[#10B981] font-bold text-sm hover:underline flex items-center gap-2">
            ← Back to Home
          </Link>
          <div className="text-xl font-extrabold text-white">Uwo Connect.</div>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Cancellation & Refund Policy</h1>
          <p className="text-[#8E99A8] text-sm">Last updated: July 2026</p>
        </div>

        <div className="bg-[#0B0D11] border border-white/10 rounded-3xl p-8 md:p-12 space-y-6 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white">1. Subscription Cancellation</h2>
          <p>
            You can cancel your Uwo Connect subscription plan at any time from your Account Settings page or by submitting a written request to our support team at <a href="mailto:support@uwo24.com" className="text-[#10B981] underline">support@uwo24.com</a>.
          </p>
          <p>
            Upon cancellation, your subscription will remain active until the end of your current paid billing cycle (monthly or annual). You will not be charged for subsequent billing periods after cancellation.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Money-Back Guarantee & Refund Eligibility</h2>
          <p>
            We offer a <strong>7-day money-back guarantee</strong> for all new workspace subscription plans (Starter, Growth, Enterprise). If you are unsatisfied with our platform services within 7 calendar days of your initial purchase, you may request a 100% full refund.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Refund requests must be made within 7 days of subscription activation.</li>
            <li>Refunds apply to initial subscription sign-ups and do not apply to recurring renewals after 7 days unless there is a duplicate charge or billing error.</li>
            <li>Add-on services or third-party WhatsApp Meta conversation API charges billed directly by Meta are non-refundable through Uwo Connect.</li>
          </ul>

          <h2 className="text-xl font-bold text-white pt-4">3. Refund Processing Time & Payment Gateway</h2>
          <p>
            All approved refunds are processed via our payment gateway provider (<strong>Razorpay Payments</strong>) to the original payment method used during checkout (Credit/Debit Card, UPI, Netbanking, or Wallet).
          </p>
          <p>
            Once initiated, refunds typically reflect in your bank account or card statement within <strong>5 to 7 business days</strong>, depending on your card issuer or banking provider.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">4. Duplicate Charges & Billing Discrepancies</h2>
          <p>
            If you suspect an accidental duplicate charge or an error on your account invoice, please notify us immediately at <a href="mailto:support@uwo24.com" className="text-[#10B981] underline">support@uwo24.com</a> with your Order ID. Valid duplicate transactions will be refunded immediately without delay.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">5. Contact Support for Refund Requests</h2>
          <p>
            For any queries regarding cancellations or refunds, please contact our dedicated support team:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-slate-300 space-y-1">
            <p><strong>Email Support:</strong> support@uwo24.com / verify@uwo24.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Business Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-slate-500">
          © 2026 Uwo Connect Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/billing/PaymentModal';

export default function Pricing() {
  const router = useRouter();
  const [annual, setAnnual] = useState(true);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const plans = [
    {
      name: "Starter",
      id: "STARTER",
      desc: "For early stage startups.",
      monthly: 49,
      annual: 39,
      monthlyInr: 3999,
      annualInr: 3199,
      features: ["5 User Licenses", "10,000 CRM Contacts", "WhatsApp Meta API", "Basic AI Chat Assistant"]
    },
    {
      name: "Growth",
      id: "GROWTH",
      desc: "Perfect for scaling operations.",
      monthly: 99,
      annual: 79,
      monthlyInr: 7999,
      annualInr: 6399,
      popular: true,
      features: ["25 User Licenses", "100,000 CRM Contacts", "3 Custom AI Assistants", "Unified Financial Ledger", "Granular Roles"]
    },
    {
      name: "Enterprise",
      id: "ENTERPRISE",
      desc: "Custom scale cluster deployment.",
      monthly: 299,
      annual: 239,
      monthlyInr: 23999,
      annualInr: 19199,
      features: ["Unlimited Licenses", "Unlimited CRM Contacts", "Dedicated Vector DB", "Custom Webhooks", "99.99% SLA"]
    }
  ];

  const handleSelectPlan = (planId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/auth/login?redirect=pricing');
    } else {
      setSelectedPlanForPayment(planId);
    }
  };

  return (
    <section className="bg-[#171A20]/40 border-y border-white/5 py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Transparent Scaling
          </h2>
          <p className="text-[#8E99A8] text-lg font-medium mb-10">
            Choose the workspace scale suited specifically to fit your transaction volumes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${!annual ? 'text-white' : 'text-[#8E99A8]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-white/10 border border-white/20 p-0.5 relative transition-colors cursor-pointer hover:bg-white/20"
            >
              <div
                className={`w-5 h-5 rounded-full transition-all duration-200 ${annual ? 'bg-[#10B981] ml-auto' : 'bg-[#8E99A8]'}`}
              />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${annual ? 'text-[#10B981]' : 'text-[#8E99A8]'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-card rounded-[32px] p-8 flex flex-col relative ${plan.popular ? 'border-2 border-[#10B981] shadow-[0_0_40px_rgba(16,185,129,0.2)] scale-105 z-10 bg-[#111827]/80' : 'border border-white/10 bg-[#111827]/40'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#10B981] text-[#030712] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.5)] whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-[#8E99A8] font-medium">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    ₹{(annual ? plan.annualInr : plan.monthlyInr).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#8E99A8] font-medium"> (${annual ? plan.annual : plan.monthly}/mo)</span>
                </div>
                <span className="text-xs text-[#8E99A8] font-medium"> Billed {annual ? 'annually' : 'monthly'} via Razorpay</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/10 text-white'}`}>
                      ✓
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-4 px-2 rounded-2xl font-bold uppercase tracking-widest text-[11px] md:text-[10px] lg:text-[11px] whitespace-normal md:whitespace-nowrap transition-all duration-300 hover:shadow-lg cursor-pointer ${plan.popular ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cashfree Payment Modal */}
      {selectedPlanForPayment && (
        <PaymentModal
          isOpen={!!selectedPlanForPayment}
          onClose={() => setSelectedPlanForPayment(null)}
          selectedPlan={selectedPlanForPayment}
          billingCycle={annual ? 'ANNUAL' : 'MONTHLY'}
          onSuccess={() => {
            router.push('/client/settings');
          }}
        />
      )}
    </section>
  );
}

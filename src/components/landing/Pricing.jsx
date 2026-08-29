'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PricingComparisonTable from '@/components/pricing/PricingComparisonTable';
import PaymentModal from '@/components/billing/PaymentModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { Loader2 } from 'lucide-react';

export default function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  useEffect(() => {
    async function fetchPublicPlans() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/plans/`);
        if (res.data && res.data.results && Array.isArray(res.data.results)) {
          setPlans(res.data.results);
        } else if (Array.isArray(res.data)) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error('Error fetching public plans:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/auth/login?redirect=pricing');
    } else {
      setSelectedPlanForPayment(plan.id || plan.name);
    }
  };

  return (
    <section className="bg-slate-900 border-y border-white/5 py-16 md:py-24 relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Transparent, Scalable Pricing
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            Choose the perfect plan tailored to your messaging volume, team capacity, and automated channels.
          </p>
        </div>

        {loading ? (
          <div className="w-full h-80 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 sm:p-8 text-slate-900 shadow-2xl">
            <PricingComparisonTable
              plansData={plans}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedPlanForPayment && (
        <PaymentModal
          isOpen={!!selectedPlanForPayment}
          onClose={() => setSelectedPlanForPayment(null)}
          selectedPlan={selectedPlanForPayment}
          billingCycle="MONTHLY"
          onSuccess={() => {
            router.push('/client/settings');
          }}
        />
      )}
    </section>
  );
}

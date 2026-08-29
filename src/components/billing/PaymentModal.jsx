'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { initiateRazorpayCheckout } from '@/utils/razorpay';
import {
  X,
  CheckCircle2,
  Zap,
  Loader2,
  CreditCard,
  AlertCircle,
  Lock,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_PLANS = {
  FREE: {
    name: 'Free Plan',
    monthly: 0,
    annual: 0,
    features: ['WhatsApp Direct Connect', 'Basic Live Inbox', 'Standard CRM Contact Storage', 'Community Support']
  },
  STARTER: {
    name: 'Starter Plan',
    monthly: 999,
    annual: 799,
    features: ['5 Team Seats', '10,000 CRM Contacts', 'WhatsApp & Facebook Messenger', 'Product Catalog & Orders', 'Standard Webhooks']
  },
  PROFESSIONAL: {
    name: 'Professional Plan',
    monthly: 2999,
    annual: 2399,
    features: ['15 Team Seats', '100,000 CRM Contacts', 'WhatsApp, FB, IG & Telegram', 'AI Smart Copilot & Bot Builder', 'Quotations, Proposals & Invoices']
  },
  GROWTH: {
    name: 'Professional Plan',
    monthly: 2999,
    annual: 2399,
    features: ['15 Team Seats', '100,000 CRM Contacts', 'WhatsApp, FB, IG & Telegram', 'AI Smart Copilot & Bot Builder', 'Quotations, Proposals & Invoices']
  },
  ENTERPRISE: {
    name: 'Enterprise Plan',
    monthly: 9999,
    annual: 7999,
    features: ['Unlimited Team Seats', 'Unlimited CRM Contacts', 'All Channels & Connectors', 'Custom AI Bots & Workflows', 'Audit Logs & Dedicated SLA']
  },
  CUSTOM: {
    name: 'Custom Tailored Plan',
    monthly: 4999,
    annual: 3999,
    features: ['Tailored Feature Entitlements', 'Dedicated Cloud Sync', 'Custom Storage Limits', 'White-label Support']
  }
};

export default function PaymentModal({ isOpen, onClose, selectedPlan = 'PROFESSIONAL', planDetails = null, billingCycle = 'MONTHLY', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockSession, setMockSession] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const planKey = typeof selectedPlan === 'string' ? selectedPlan.toUpperCase() : 'PROFESSIONAL';
  const defaultInfo = DEFAULT_PLANS[planKey] || DEFAULT_PLANS.PROFESSIONAL;

  const planInfo = planDetails ? {
    name: planDetails.name || defaultInfo.name,
    monthly: Number(planDetails.price) || defaultInfo.monthly,
    annual: Math.round((Number(planDetails.price) || defaultInfo.monthly) * 0.85),
    features: planDetails.features || defaultInfo.features
  } : defaultInfo;

  const isAnnual = billingCycle.toUpperCase() === 'ANNUAL';
  const pricePerMonth = isAnnual ? planInfo.annual : planInfo.monthly;
  const totalAmount = isAnnual ? planInfo.annual * 12 : planInfo.monthly;

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to upgrade your workspace plan.');
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/payments/create-order`,
        { plan: planInfo.name || selectedPlan, billing_cycle: billingCycle.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const {
        order_id,
        razorpay_order_id,
        razorpay_key_id,
        amount_paise,
        customer_name,
        customer_email,
        customer_phone,
        is_mock
      } = res.data;

      if (is_mock) {
        setMockSession({ order_id, razorpay_order_id });
        setLoading(false);
        return;
      }

      // Launch Razorpay SDK Popup
      await initiateRazorpayCheckout({
        keyId: razorpay_key_id,
        orderId: razorpay_order_id,
        amount: amount_paise,
        currency: 'INR',
        name: 'Uwo Connect',
        description: `${planInfo.name} (${billingCycle})`,
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        onSuccess: async (rzpPayload) => {
          await verifyOrder({
            order_id,
            razorpay_order_id: rzpPayload.razorpay_order_id,
            razorpay_payment_id: rzpPayload.razorpay_payment_id,
            razorpay_signature: rzpPayload.razorpay_signature
          });
        },
        onDismiss: () => {
          setError('Payment was cancelled.');
          setLoading(false);
        }
      });
      setLoading(false);
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.response?.data?.error || 'Failed to initialize Razorpay payment session.');
      setLoading(false);
    }
  };

  const verifyOrder = async ({ order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, forceMock = false }) => {
    try {
      setVerifying(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/payments/verify-order`,
        {
          order_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          force_mock_success: forceMock
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccessData(res.data);
        if (onSuccess) onSuccess(res.data);
      } else {
        setError(res.data.message || 'Payment verification failed.');
      }
    } catch (err) {
      console.error('Verify payment error:', err);
      setError(err.response?.data?.message || 'Failed to verify payment status.');
    } finally {
      setVerifying(false);
      setMockSession(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0D11] border border-white/10 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {successData ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#10B981]/20 border border-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 text-[#10B981]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-[#8E99A8] text-sm mb-6">
              Your workspace has been upgraded to <span className="text-[#10B981] font-semibold">{successData.plan}</span> plan.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#10B981] text-black font-bold rounded-2xl hover:bg-[#059669] transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Continue to Workspace
            </button>
          </div>
        ) : mockSession ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Zap size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Razorpay Sandbox Test Mode</h4>
            <p className="text-xs text-slate-400 mb-6">
              Order Receipt: <code className="text-slate-200">{mockSession.order_id}</code>
              <br />
              (Simulate a successful Razorpay payment transaction)
            </p>

            <div className="space-y-3">
              <button
                disabled={verifying}
                onClick={() => verifyOrder({ order_id: mockSession.order_id, forceMock: true })}
                className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                {verifying ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Simulate Successful Payment
              </button>
              <button
                onClick={() => setMockSession(null)}
                className="w-full py-3 text-slate-400 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Checkout</h3>
                <p className="text-xs text-[#8E99A8]">Secured by Razorpay Payments</p>
              </div>
            </div>

            {/* Plan Card Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold">{planInfo.name}</span>
                <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {billingCycle}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3 mb-3">
                <span className="text-xs text-[#8E99A8]">Price</span>
                <span className="text-xl font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <ul className="space-y-2">
                {planInfo.features.map((f, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={loading}
              onClick={handleInitiatePayment}
              className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Initializing Razorpay...
                </>
              ) : (
                <>
                  <Lock size={16} /> Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={14} className="text-[#10B981]" />
              256-bit SSL Encrypted & PCI-DSS Compliant Payment
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { X, Wallet, ShieldCheck, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : null;

// Dynamically load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function AddMoneyModal({ isOpen, onClose, onSuccess }) {
  const [selectedPreset, setSelectedPreset] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const PRESETS = [500, 1000, 2000, 5000];

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedPreset;

  const handlePayWithRazorpay = async () => {
    setError('');
    setSuccessMsg('');
    const token = getToken();
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      return;
    }

    if (!currentAmount || isNaN(currentAmount) || currentAmount < 1) {
      setError('Please select or enter a valid amount (minimum ₹1.00)');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await axios.post(
        `${API()}/api/wallet/recharge/create/`,
        { amount: currentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderData = res.data;

      // 2. Ensure Razorpay SDK script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Official Checkout Options
      const razorpayKey = orderData.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TGv2xByWyhTGoM';

      const options = {
        key: razorpayKey,
        amount: orderData.amount_paise || Math.round(currentAmount * 100),
        currency: 'INR',
        name: 'UWO Connect Wallet Top-up',
        description: `Prepaid Usage Wallet Recharge (₹${currentAmount})`,
        prefill: {
          name: 'UWO Connect Client',
          email: 'client@uwoconnect.com',
          contact: '9999999999'
        },
        theme: {
          color: '#059669'
        },
        handler: async (response) => {
          setLoading(true);
          try {
            // 4. Verify payment signature on backend before crediting wallet
            const verifyRes = await axios.post(
              `${API()}/api/wallet/recharge/verify/`,
              {
                order_id: orderData.order_id,
                razorpay_order_id: response.razorpay_order_id || orderData.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_rzp_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'mock_sig_pass',
                force_mock_success: orderData.is_mock || false
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setSuccessMsg(`Payment Successful! ₹${currentAmount.toLocaleString('en-IN')} has been added to your wallet.`);
              setTimeout(() => {
                if (onSuccess) onSuccess(verifyRes.data);
                onClose();
              }, 1200);
            } else {
              setError(verifyRes.data.message || 'Payment verification failed.');
            }
          } catch (err) {
            console.error('Wallet verification error:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      if (!orderData.is_mock && orderData.razorpay_order_id) {
        options.order_id = orderData.razorpay_order_id;
      }

      // 5. Open Official Razorpay Checkout Modal Window
      const rzp = new window.Razorpay(options);
      setLoading(false);
      rzp.open();

    } catch (err) {
      console.error('Razorpay payment initiation error:', err);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to initiate Razorpay payment.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white relative flex items-center justify-between">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
              <Wallet size={12} />
              <span>PREPAID USAGE WALLET</span>
            </div>
            <h3 className="text-2xl font-black text-white italic font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              Add Money to Wallet
            </h3>
            <p className="text-xs text-slate-300">
              100% of your recharge is credited directly to your usage balance via Razorpay.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 text-left">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold flex items-center gap-2.5 animate-in zoom-in-95 duration-150">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <div>
                <span>{successMsg}</span>
                <span className="block text-[11px] font-medium text-emerald-700 mt-0.5">⚡ Broadcast entitlement unlocked &amp; enabled!</span>
              </div>
            </div>
          )}

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Select Preset Amount</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(amt);
                    setCustomAmount('');
                  }}
                  className={`py-3 px-4 rounded-2xl border font-black text-sm transition-all cursor-pointer ${
                    selectedPreset === amt && !customAmount
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-100'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Or Enter Custom Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-base">₹</span>
              <input
                type="number"
                min="1"
                placeholder="Enter custom amount (e.g. 1500)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Wallet Summary Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Recharge Amount:</span>
              <span className="text-sm font-black text-emerald-700">₹{(currentAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-emerald-200/60">
              <span>New Wallet Credit:</span>
              <span className="text-xs font-extrabold text-slate-700">+ ₹{(currentAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              * Note: The ₹499/mo UWO Connect subscription is managed separately and will not be deducted from this credit.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading || !!successMsg}
              onClick={handlePayWithRazorpay}
              className="px-7 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-700/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Opening secure payment...</span>
                </>
              ) : successMsg ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Recharged!</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{(currentAmount || 0).toLocaleString('en-IN')} &amp; Recharge</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

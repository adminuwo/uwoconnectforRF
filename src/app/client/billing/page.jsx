'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, CreditCard, ShieldCheck, AlertCircle, AlertTriangle, Plus, RefreshCw,
  TrendingDown, TrendingUp, CheckCircle2, History, Zap, Sparkles, ArrowUpRight, ArrowDownLeft, Megaphone, Lock
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddMoneyModal from '@/components/billing/AddMoneyModal';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('uwo_token') : null;

export default function ClientBillingPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    wallet_balance_inr: 0,
    wallet_balance_paise: 0,
    low_balance_threshold_inr: 100,
    is_low_balance: false,
    is_zero_balance: false,
    usage_this_month_inr: 0,
    subscription: {
      plan_name: 'UWO Connect Pro',
      price_monthly: '499.00',
      status: 'ACTIVE',
      current_period_end: null
    },
    transactions: []
  });

  const [broadcastSummary, setBroadcastSummary] = useState({
    included_quantity: 1,
    used_quantity: 0,
    remaining_quantity: 1,
    is_included_available: true,
    broadcast_rate_inr: 0.94,
    next_broadcast_cost_inr: 0.00,
    can_broadcast: true
  });

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchWalletSummary = useCallback(async () => {
    setLoading(true);
    try {
      const [walletRes, broadcastRes] = await Promise.all([
        axios.get(`${API()}/api/wallet/dashboard`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API()}/api/broadcasts/entitlement`, { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);
      setSummary(walletRes.data);
      if (broadcastRes.data) {
        setBroadcastSummary(broadcastRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch wallet/broadcast dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletSummary();
  }, [fetchWalletSummary]);

  const handleRechargeSuccess = (data) => {
    setToastMessage(data.message || 'Wallet recharged successfully!');
    fetchWalletSummary();
    setTimeout(() => setToastMessage(''), 5000);
  };

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-full selection:bg-emerald-500/20 selection:text-emerald-900 font-sans">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>BILLING & PREPAID WALLET</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 italic font-serif" style={serifStyle}>
              Account Billing & Usage Wallet
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Manage your fixed UWO Connect subscription and prepaid usage wallet for metered services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchWalletSummary}
              className="p-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-emerald-600' : ''} />
            </button>

            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Money to Wallet</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Zero / Low Balance Warning Banners */}
        {summary.is_zero_balance ? (
          <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-rose-900">Your wallet balance is ₹0</h4>
                <p className="text-xs text-rose-700">
                  Your platform subscription remains Active, but metered features (WhatsApp messaging & AI API responses) are paused. Please recharge to continue usage-based services.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Recharge Now
            </button>
          </div>
        ) : summary.is_low_balance ? (
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-amber-900">Your wallet balance is running low</h4>
                <p className="text-xs text-amber-800">
                  Current balance (₹{summary.wallet_balance_inr}) is below your threshold of ₹{summary.low_balance_threshold_inr}. Top up now to prevent interruption.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Add Money
            </button>
          </div>
        ) : null}

        {/* Primary 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: Subscription Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Subscription Plan</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  summary.subscription.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Status: {summary.subscription.status}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{summary.subscription.plan_name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 font-serif" style={serifStyle}>₹{summary.subscription.price_monthly}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                This fixed platform fee is billed separately. It is <strong>NOT</strong> deducted from your usage wallet.
              </p>
            </div>
          </div>

          {/* CARD 2: Prepaid Wallet Balance */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl text-left flex flex-col justify-between relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Wallet size={14} /> PREPAID USAGE WALLET
                </span>
                <button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
                >
                  + Add Money
                </button>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Available Balance</span>
                <div className="text-4xl font-extrabold text-white font-serif tracking-tight mt-0.5" style={serifStyle}>
                  ₹{summary.wallet_balance_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                Used for metered WhatsApp messages, AI completing API costs & add-on services.
              </p>
            </div>
          </div>

          {/* CARD 3: Usage This Month */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Current Month Metered Usage</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingDown size={18} />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Total Usage Deducted</span>
                <div className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight mt-0.5" style={serifStyle}>
                  ₹{summary.usage_this_month_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Low Balance Alert Threshold:</span>
                <span className="font-extrabold text-slate-800">₹{summary.low_balance_threshold_inr}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BROADCAST ENTITLEMENT & WALLET USAGE CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                <Megaphone size={12} />
                <span>PLAN BROADCAST ENTITLEMENTS</span>
              </div>
              <h3 className="text-2xl font-black italic font-serif text-white" style={serifStyle}>
                Monthly Included Broadcasts
              </h3>
              <p className="text-xs text-slate-300">
                Included broadcasts are provided with your subscription plan and do <strong>NOT</strong> consume your wallet balance.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 font-medium block">Additional Broadcast Rate</span>
              <span className="text-xl font-extrabold text-emerald-400 font-serif" style={serifStyle}>
                ₹{broadcastSummary.broadcast_rate_inr.toFixed(2)} / broadcast
              </span>
              <span className="text-[10px] text-slate-400 block">(Billed via Prepaid Wallet)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Included In Plan</span>
              <div className="text-3xl font-black text-white">{broadcastSummary.included_quantity} Broadcast{broadcastSummary.included_quantity > 1 ? 's' : ''}</div>
              <span className="text-[11px] text-slate-400 block">Resets each billing period</span>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Used This Period</span>
              <div className="text-3xl font-black text-amber-400">{broadcastSummary.used_quantity} Used</div>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (broadcastSummary.used_quantity / (broadcastSummary.included_quantity || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining Included</span>
              <div className={`text-3xl font-black ${broadcastSummary.remaining_quantity > 0 ? 'text-emerald-400' : 'text-rose-400 flex items-center gap-2'}`}>
                {broadcastSummary.remaining_quantity > 0 ? (
                  <span>{broadcastSummary.remaining_quantity} Remaining</span>
                ) : (
                  <>
                    <Lock size={22} />
                    <span>0 (Exhausted)</span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-slate-300 block">
                {broadcastSummary.remaining_quantity > 0 
                  ? 'No wallet charge for next broadcast' 
                  : `Next broadcast costs ₹${broadcastSummary.broadcast_rate_inr.toFixed(2)} from wallet`}
              </span>
            </div>
          </div>
        </div>

        {/* Immutable Wallet Transaction Ledger Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 italic font-serif" style={serifStyle}>
                Recent Transactions & Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Immutable, auditable transaction log of all credits, debits, and adjustments.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Showing last 50 transactions</span>
          </div>

          {summary.transactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <History size={40} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold uppercase tracking-wider">No transaction history yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you top up your wallet or use metered WhatsApp/AI services, transaction logs will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Type & Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Reference ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {summary.transactions.map((tx) => {
                    const isCredit = tx.amount_inr > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 block">{tx.type}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{tx.service_category}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-800 font-bold max-w-xs truncate">
                          {tx.description}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {tx.reference_id}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(tx.created_at).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>

                        <td className={`py-3.5 px-4 text-right font-black text-sm ${
                          isCredit ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {isCredit ? '+' : ''} ₹{tx.amount_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-slate-600">
                          ₹{tx.balance_after_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add Money Modal */}
      {isAddMoneyOpen && (
        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={() => setIsAddMoneyOpen(false)}
          onSuccess={handleRechargeSuccess}
        />
      )}
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, ShieldCheck, RefreshCw, Plus, Search, AlertTriangle, AlertCircle,
  CheckCircle2, Sliders, DollarSign, ArrowUpRight, Loader2, Edit, X
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('uwo_token') : null;

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [rates, setRates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'rates'

  // Adjustment Modal State
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('ADJUSTMENT');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Rate Edit Modal State
  const [editingRate, setEditingRate] = useState(null);
  const [newRatePaise, setNewRatePaise] = useState('');
  const [submittingRate, setSubmittingRate] = useState(false);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const [clientRes, rateRes] = await Promise.all([
        axios.get(`${API()}/api/admin/wallet/overview`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API()}/api/admin/wallet/rates`, { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);
      setClients(clientRes.data.clients || []);
      setRates(rateRes.data.rates || []);
    } catch (err) {
      console.error('Failed to fetch admin wallet overview:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleApplyAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedClient || !adjustmentAmount || !adjustmentReason) return;

    setSubmittingAdjustment(true);
    try {
      const res = await axios.post(
        `${API()}/api/admin/wallet/adjustment`,
        {
          client_id: selectedClient.client_id,
          type: adjustmentType,
          amount: parseFloat(adjustmentAmount),
          reason: adjustmentReason
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setToastMessage(res.data.message || 'Adjustment applied successfully.');
      setIsAdjustmentModalOpen(false);
      setAdjustmentAmount('');
      setAdjustmentReason('');
      fetchOverview();
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply adjustment');
    } finally {
      setSubmittingAdjustment(false);
    }
  };

  const handleUpdateRate = async (e) => {
    e.preventDefault();
    if (!editingRate || !newRatePaise) return;

    setSubmittingRate(true);
    try {
      const res = await axios.post(
        `${API()}/api/admin/wallet/rates`,
        {
          country_code: editingRate.country_code,
          service_category: editingRate.service_category,
          unit_price_paise: parseInt(newRatePaise)
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setToastMessage(res.data.message || 'Rate updated successfully.');
      setEditingRate(null);
      fetchOverview();
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update rate');
    } finally {
      setSubmittingRate(false);
    }
  };

  const filteredClients = clients.filter(c =>
    c.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(c.client_id).includes(searchQuery)
  );

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-full selection:bg-emerald-500/20 selection:text-emerald-900 font-sans">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>SUPER ADMIN BILLING CONTROL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 italic font-serif" style={serifStyle}>
              Master Wallet & Rate Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Inspect client subscriptions, balances, issue adjustments/refunds, and update usage rates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOverview}
              className="p-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-emerald-600' : ''} />
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
            <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-5 py-3 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'clients'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Client Wallet Directory ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-5 py-3 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'rates'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Usage Rate Cards ({rates.length})
            </button>
          </div>

          {activeTab === 'clients' && (
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search business name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* TAB 1: CLIENT DIRECTORY */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm text-left">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Client Wallets...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Client Business</th>
                      <th className="py-3 px-4">Subscription</th>
                      <th className="py-3 px-4 text-right">Wallet Balance</th>
                      <th className="py-3 px-4 text-right">Usage (Month)</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredClients.map((client) => (
                      <tr key={client.client_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">{client.business_name}</div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">ID: #{client.client_id}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            ₹{client.subscription_amount}/mo ({client.subscription_status})
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-black text-sm ${
                            client.is_zero_balance 
                              ? 'text-rose-600' 
                              : client.is_low_balance 
                              ? 'text-amber-600' 
                              : 'text-emerald-700'
                          }`}>
                            ₹{client.wallet_balance_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                          {client.is_zero_balance && <span className="block text-[9px] font-bold text-rose-500 uppercase">ZERO BALANCE</span>}
                          {client.is_low_balance && !client.is_zero_balance && <span className="block text-[9px] font-bold text-amber-500 uppercase">LOW BALANCE</span>}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          ₹{client.usage_this_month_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {client.last_transaction ? (
                            <div>
                              <span className="font-bold text-slate-800 block">{client.last_transaction.type} (₹{client.last_transaction.amount_inr})</span>
                              <span>{new Date(client.last_transaction.timestamp).toLocaleDateString()}</span>
                            </div>
                          ) : 'No transactions'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setIsAdjustmentModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Adjust / Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RATE CARDS */}
        {activeTab === 'rates' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm text-left space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 italic font-serif" style={serifStyle}>
                Configurable Metered Usage Rates
              </h3>
              <p className="text-xs text-slate-500">
                Configure rates for WhatsApp messaging categories (Marketing, Utility, Auth, Service) and AI completions. Backend will dynamically calculate usage costs based on these rates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Country</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Unit Price (Paise)</th>
                    <th className="py-3 px-4">Unit Price (INR)</th>
                    <th className="py-3 px-4">Effective Date</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {rates.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">{r.country_code}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{r.service_category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{r.unit_price_paise} paise</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">₹{r.unit_price_inr}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{new Date(r.effective_from).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingRate(r);
                            setNewRatePaise(r.unit_price_paise);
                          }}
                          className="p-2 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ADJUSTMENT MODAL */}
      {isAdjustmentModalOpen && selectedClient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 text-left shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 italic font-serif" style={serifStyle}>
                  Manual Wallet Adjustment
                </h3>
                <p className="text-xs text-slate-500">Client: {selectedClient.business_name}</p>
              </div>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Adjustment Type</label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="ADJUSTMENT">Manual Adjustment (Credit +)</option>
                  <option value="REFUND">Refund Credit (+)</option>
                  <option value="BONUS">Promotional Bonus (+)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Auditable Reason (Mandatory)</label>
                <textarea
                  placeholder="e.g. Goodwill refund for campaign issue..."
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none h-20"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2.5 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjustment}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submittingAdjustment ? <Loader2 size={16} className="animate-spin" /> : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RATE MODAL */}
      {editingRate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-6 text-left shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 italic font-serif" style={serifStyle}>
                  Update Usage Rate
                </h3>
                <p className="text-xs text-slate-500">{editingRate.country_code} - {editingRate.service_category}</p>
              </div>
              <button onClick={() => setEditingRate(null)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Unit Price (in Paise)</label>
                <input
                  type="number"
                  placeholder="e.g. 78 (for ₹0.78)"
                  value={newRatePaise}
                  onChange={(e) => setNewRatePaise(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 block pt-1 font-semibold">
                  Equivalent to ₹{round(parseFloat(newRatePaise || 0) / 100.0, 4)} per event
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRate(null)}
                  className="px-4 py-2 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRate}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submittingRate ? <Loader2 size={16} className="animate-spin" /> : 'Save Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

function round(val, decimals) {
  return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

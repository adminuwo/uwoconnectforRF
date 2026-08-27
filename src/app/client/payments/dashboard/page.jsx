'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, IndianRupee, CheckCircle2, XCircle, Clock,
  RefreshCcw, AlertCircle, Loader2, Search, Filter, ArrowLeft,
  Download, ChevronLeft, ChevronRight, RotateCcw, User,
  ShoppingBag, CreditCard, Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';

import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('uwo_token') : null;

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const STATUS_CONFIG = {
  PAID:                 { label: 'Paid',             bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  PENDING:              { label: 'Pending',           bg: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  FAILED:               { label: 'Failed',            bg: 'bg-red-100 text-red-600',       dot: 'bg-red-500' },
  REFUNDED:             { label: 'Refunded',          bg: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  PARTIALLY_REFUNDED:   { label: 'Part. Refunded',   bg: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-black text-slate-900">{value}</p>
    <p className="text-sm font-bold text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

export default function PaymentsDashboardPage() {
  const router = useRouter();

  const [loading, setLoading]             = useState(true);
  const [dashStats, setDashStats]         = useState(null);
  const [payments, setPayments]           = useState([]);
  const [total, setTotal]                 = useState(0);
  const [page, setPage]                   = useState(1);
  const [statusFilter, setStatusFilter]   = useState('');
  const [search, setSearch]               = useState('');
  const [refundLoading, setRefundLoading] = useState(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState(null);
  const [toast, setToast]                 = useState(null);
  const PER_PAGE = 15;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [statsRes, paymentsRes] = await Promise.all([
        axios.get(`${API()}/api/razorpay/sales/dashboard`, { headers }),
        axios.get(`${API()}/api/razorpay/sales`, {
          headers,
          params: { page, per_page: PER_PAGE, ...(statusFilter && { status: statusFilter }) },
        }),
      ]);
      setDashStats(statsRes.data);
      setPayments(paymentsRes.data.payments || []);
      setTotal(paymentsRes.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch payment data:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleRefund = async (paymentId) => {
    setRefundLoading(paymentId);
    try {
      await axios.post(
        `${API()}/api/razorpay/refund`,
        { payment_record_id: paymentId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      showToast('Refund initiated successfully', 'success');
      setShowRefundConfirm(null);
      fetchDashboard();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Refund failed', 'error');
    } finally {
      setRefundLoading(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (p.customer_name || '').toLowerCase().includes(s) ||
      (p.customer_email || '').toLowerCase().includes(s) ||
      (p.product_name || '').toLowerCase().includes(s) ||
      (p.razorpay_payment_id || '').toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-bold ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/client/payments')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">All product transactions for your workspace</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchDashboard(); }}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={IndianRupee}
                label="Total Revenue"
                value={formatCurrency(dashStats?.total_revenue || 0)}
                color="bg-emerald-500"
              />
              <StatCard
                icon={TrendingUp}
                label="This Month"
                value={formatCurrency(dashStats?.monthly_revenue || 0)}
                sub={`Today: ${formatCurrency(dashStats?.today_revenue || 0)}`}
                color="bg-blue-500"
              />
              <StatCard
                icon={CheckCircle2}
                label="Successful"
                value={dashStats?.total_sales || 0}
                sub={`of ${dashStats?.total_transactions || 0} total`}
                color="bg-indigo-500"
              />
              <StatCard
                icon={XCircle}
                label="Failed"
                value={dashStats?.failed_payments || 0}
                sub={`${dashStats?.refunds || 0} refunds • ${dashStats?.pending_payments || 0} pending`}
                color="bg-red-500"
              />
            </div>

            {/* ── Transaction Table ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Table Header */}
              <div className="p-5 border-b border-slate-50 flex flex-wrap items-center gap-3">
                <h2 className="font-black text-slate-800 text-base flex-1">Transactions</h2>

                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customer, product…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 w-56"
                  />
                </div>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              {/* Table */}
              {filteredPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <CreditCard size={40} className="mb-3 opacity-30" />
                  <p className="font-bold">No transactions found</p>
                  <p className="text-sm mt-1">Payments will appear here after customers checkout</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Customer', 'Product', 'Amount', 'Payment ID', 'Method', 'Date', 'Status', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPayments.map(p => {
                        const sc = STATUS_CONFIG[p.payment_status] || STATUS_CONFIG.PENDING;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                            {/* Customer */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                  {(p.customer_name || 'C')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 truncate max-w-[140px]">
                                    {p.customer_name || 'Anonymous'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                    {p.customer_email || p.customer_phone || '—'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Product */}
                            <td className="px-4 py-4">
                              <p className="font-medium text-slate-700 truncate max-w-[160px]">
                                {p.product_name || 'Unknown Product'}
                              </p>
                            </td>

                            {/* Amount */}
                            <td className="px-4 py-4">
                              <p className="font-black text-slate-900">
                                {formatCurrency(p.amount, p.currency)}
                              </p>
                              {p.refunded_amount && (
                                <p className="text-[10px] text-slate-400">
                                  Refunded: {formatCurrency(p.refunded_amount, p.currency)}
                                </p>
                              )}
                            </td>

                            {/* Payment ID */}
                            <td className="px-4 py-4">
                              <p className="font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                                {p.razorpay_payment_id || p.razorpay_order_id || '—'}
                              </p>
                            </td>

                            {/* Method */}
                            <td className="px-4 py-4">
                              <p className="text-xs text-slate-600 font-medium capitalize">
                                {p.payment_method || '—'}
                              </p>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-4">
                              <p className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(p.paid_at || p.created_at)}
                              </p>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black whitespace-nowrap ${sc.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                {sc.label}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4">
                              {p.payment_status === 'PAID' && (
                                <button
                                  onClick={() => setShowRefundConfirm(p)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  <RotateCcw size={11} />
                                  Refund
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-50 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">
                    {total} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Refund Confirmation Modal */}
        {showRefundConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw size={24} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 text-center mb-1">Initiate Refund?</h3>
              <div className="bg-slate-50 rounded-xl p-4 my-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-bold">{showRefundConfirm.customer_name || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Product</span>
                  <span className="font-bold">{showRefundConfirm.product_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-black text-slate-900">
                    {formatCurrency(showRefundConfirm.amount, showRefundConfirm.currency)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center mb-6">
                This will initiate a full refund through Razorpay. The refund will be processed to the customer's payment method.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRefundConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRefund(showRefundConfirm.id)}
                  disabled={refundLoading === showRefundConfirm.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm"
                >
                  {refundLoading === showRefundConfirm.id && <Loader2 size={14} className="animate-spin" />}
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

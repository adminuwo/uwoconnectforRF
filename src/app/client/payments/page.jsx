'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard, CheckCircle2, XCircle, AlertCircle, Loader2,
  Link2, Link2Off, RefreshCw, Settings2, Shield, Zap,
  ToggleLeft, ToggleRight, ExternalLink, Copy, CheckCheck,
  TrendingUp, IndianRupee, Clock
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';

import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('uwo_token') : null;

// ─── Razorpay SVG logo ────────────────────────────────────────────────────────
const RazorpayLogo = () => (
  <svg width="28" height="28" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 56L28.5 16H44L36.5 40H50L22 56H16Z" fill="#3395FF"/>
    <path d="M36.5 40L44 16H58L50 40H36.5Z" fill="#072654"/>
  </svg>
);

export default function PaymentsGatewayPage() {
  const searchParams  = useSearchParams();
  const router        = useRouter();

  const [loading, setLoading]             = useState(true);
  const [connecting, setConnecting]       = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [copied, setCopied]               = useState(false);
  const [toast, setToast]                 = useState(null);

  const [connection, setConnection] = useState({
    connected: false,
    connection_status: 'DISCONNECTED',
    mode: 'TEST',
    razorpay_account_id: '',
    connected_at: null,
    linked_key_id: '',
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API()}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setConnection(res.data);
    } catch (err) {
      console.error('Failed to fetch Razorpay status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Handle OAuth callback result from URL params
  useEffect(() => {
    const razorpayStatus = searchParams.get('razorpay_status');
    if (razorpayStatus === 'connected') {
      showToast('🎉 Razorpay connected successfully!', 'success');
      fetchStatus();
      router.replace('/client/payments');
    } else if (razorpayStatus === 'error') {
      const msg = searchParams.get('message') || 'Connection failed';
      showToast(`Connection failed: ${msg}`, 'error');
      router.replace('/client/payments');
    }
  }, [searchParams, fetchStatus, router]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await axios.get(`${API()}/api/razorpay/connect`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.data.setup_required) {
        showToast(
          'Razorpay Technology Partner credentials not configured. See console for setup instructions.',
          'warning'
        );
        console.warn('[UWOConnect] Razorpay partner setup required:', res.data.message);
        return;
      }

      if (res.data.oauth_url) {
        window.location.href = res.data.oauth_url;
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to initiate connection', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await axios.delete(`${API()}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showToast('Razorpay disconnected. Historical records preserved.', 'success');
      setConnection(prev => ({ ...prev, connected: false, connection_status: 'DISCONNECTED' }));
      setShowDisconnectConfirm(false);
    } catch (err) {
      showToast('Failed to disconnect. Please try again.', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleModeSwitch = async () => {
    const newMode = connection.mode === 'TEST' ? 'LIVE' : 'TEST';
    setSwitchingMode(true);
    try {
      const res = await axios.post(
        `${API()}/api/razorpay/mode`,
        { mode: newMode },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setConnection(prev => ({ ...prev, mode: res.data.mode }));
      showToast(`Switched to ${res.data.mode} mode`, 'success');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Mode switch failed', 'error');
    } finally {
      setSwitchingMode(false);
    }
  };

  const copyAccountId = () => {
    navigator.clipboard.writeText(connection.razorpay_account_id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = connection.connected && connection.connection_status === 'CONNECTED';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">

          {/* ── Toast ── */}
          {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2 duration-300 ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' :
              toast.type === 'error'   ? 'bg-red-600 text-white' :
              'bg-amber-500 text-white'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={16} />}
              {toast.type === 'error'   && <XCircle size={16} />}
              {toast.type === 'warning' && <AlertCircle size={16} />}
              {toast.msg}
            </div>
          )}

          {/* ── Page Header ── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <CreditCard size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Gateways</h1>
                <p className="text-sm text-slate-500 font-medium">Connect your payment account to accept online payments</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">

              {/* ── Razorpay Card ── */}
              <div className={`bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all duration-300 ${
                isConnected ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-100'
              }`}>

                {/* Card Header */}
                <div className="p-6 border-b border-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <RazorpayLogo />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-black text-slate-900">Razorpay</h2>
                          {isConnected && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              connection.mode === 'LIVE'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${connection.mode === 'LIVE' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                              {connection.mode} MODE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {isConnected
                            ? 'Your Razorpay account is connected and ready to accept payments.'
                            : 'Connect your Razorpay account to accept online payments for your products.'}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : connection.connection_status === 'ERROR'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {isConnected ? (
                        <><CheckCircle2 size={12} className="text-emerald-500" /> CONNECTED</>
                      ) : connection.connection_status === 'ERROR' ? (
                        <><XCircle size={12} className="text-red-500" /> ERROR</>
                      ) : (
                        <><XCircle size={12} className="text-slate-400" /> NOT CONNECTED</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connected Details */}
                {isConnected && (
                  <div className="px-6 py-4 bg-emerald-50/30 border-b border-emerald-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Account ID</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-700 font-mono truncate">
                            {connection.razorpay_account_id || connection.linked_key_id || 'Connected'}
                          </p>
                          {connection.razorpay_account_id && (
                            <button
                              onClick={copyAccountId}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {copied ? <CheckCheck size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Connected On</p>
                        <p className="text-sm font-bold text-slate-700">
                          {connection.connected_at
                            ? new Date(connection.connected_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })
                            : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Mode toggle */}
                    <div className="mt-4 flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-black text-slate-700">
                          {connection.mode === 'LIVE' ? '🟢 Live Mode' : '🟡 Test Mode'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {connection.mode === 'TEST'
                            ? 'Using test credentials — no real money moves'
                            : 'Live mode — real payments are being processed'}
                        </p>
                      </div>
                      <button
                        onClick={handleModeSwitch}
                        disabled={switchingMode}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          connection.mode === 'LIVE'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {switchingMode ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : connection.mode === 'LIVE' ? (
                          <ToggleRight size={14} />
                        ) : (
                          <ToggleLeft size={14} />
                        )}
                        Switch to {connection.mode === 'LIVE' ? 'TEST' : 'LIVE'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6">
                  {!isConnected ? (
                    <div className="flex flex-col gap-3">
                      {/* What you'll get */}
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        {[
                          { icon: Shield, label: 'Secure OAuth', desc: 'No API keys needed' },
                          { icon: Zap, label: 'Instant Setup', desc: 'Connect in 2 minutes' },
                          { icon: TrendingUp, label: 'Full Analytics', desc: 'Track every payment' },
                        ].map(({ icon: Icon, label, desc }) => (
                          <div key={label} className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-xl">
                            <Icon size={16} className="text-blue-500" />
                            <p className="text-[10px] font-black text-slate-700">{label}</p>
                            <p className="text-[9px] text-slate-400 text-center">{desc}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {connecting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <RazorpayLogo />
                        )}
                        {connecting ? 'Redirecting to Razorpay…' : 'Connect Razorpay Account'}
                        {!connecting && <ExternalLink size={14} className="opacity-70" />}
                      </button>

                      <p className="text-center text-[10px] text-slate-400">
                        You'll be redirected to Razorpay to authorize. No API keys or passwords needed.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => router.push('/client/payments/dashboard')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
                      >
                        <TrendingUp size={15} />
                        View Dashboard
                      </button>
                      <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                      >
                        {connecting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Reconnect
                      </button>
                      <button
                        onClick={() => setShowDisconnectConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-all"
                      >
                        <Link2Off size={14} />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Info Cards ── */}
              {!isConnected && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-blue-800 mb-1">How it works</p>
                      <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>You connect your own Razorpay account — not UWOConnect's</li>
                        <li>Customer payments go directly to your Razorpay account</li>
                        <li>UWOConnect only records transactions — never touches your funds</li>
                        <li>Each workspace is fully isolated — no mixing of accounts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Quick Actions (if connected) ── */}
              {isConnected && (
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => router.push('/client/payments/dashboard')}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <IndianRupee size={20} className="text-emerald-500 mb-2" />
                    <p className="font-black text-slate-800 text-sm">Sales Dashboard</p>
                    <p className="text-xs text-slate-400 mt-0.5">View transactions & revenue</p>
                  </button>
                  <button
                    onClick={() => router.push('/client/invoices')}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <CreditCard size={20} className="text-emerald-600 mb-2" />
                    <p className="font-black text-slate-800 text-sm">Automated Invoices</p>
                    <p className="text-xs text-slate-400 mt-0.5">View & download PDF invoices</p>
                  </button>
                  <button
                    onClick={() => router.push('/client/catalog')}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <Link2 size={20} className="text-blue-500 mb-2" />
                    <p className="font-black text-slate-800 text-sm">Share Checkout Links</p>
                    <p className="text-xs text-slate-400 mt-0.5">Go to Catalog to copy checkout URLs</p>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Disconnect Confirmation Modal ── */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2Off size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Disconnect Razorpay?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Online payments will be disabled. All historical transaction records will be preserved.
              You can reconnect anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
              >
                {disconnecting ? <Loader2 size={14} className="animate-spin" /> : null}
                Yes, Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

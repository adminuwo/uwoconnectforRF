'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, X, AlertCircle, Loader2, Key, ExternalLink,
  Shield, Zap, RefreshCw, Link2Off, Eye, EyeOff, ToggleLeft, ToggleRight, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;
const getToken = () => typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : null;

// Razorpay Brand SVG
export const RazorpayBrandIcon = ({ size = 26, isDark = false, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 56L28.5 16H44L36.5 40H50L22 56H16Z" fill="#3395FF" />
    <path d="M36.5 40L44 16H58L50 40H36.5Z" fill="#072654" />
  </svg>
);

export default function RazorpayConfigModal({ isOpen, onClose, onSaved }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'oauth'

  const [connection, setConnection] = useState({
    connected: false,
    connection_status: 'DISCONNECTED',
    mode: 'TEST',
    razorpay_account_id: '',
    linked_key_id: '',
  });

  const [keyForm, setKeyForm] = useState({
    key_id: '',
    key_secret: '',
    webhook_secret: '',
  });

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API()}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setConnection(res.data);
      if (res.data?.linked_key_id) {
        setKeyForm(prev => ({ ...prev, key_id: res.data.linked_key_id }));
      }
    } catch (err) {
      console.warn('Failed to fetch Razorpay status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, fetchStatus]);

  const handleSaveKeys = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const kid = (keyForm.key_id || '').trim();
    const ksec = (keyForm.key_secret || '').trim();
    const wsec = (keyForm.webhook_secret || '').trim();

    if (!kid || !ksec) {
      setError('Both Key ID and Key Secret are required.');
      return;
    }

    if (!kid.startsWith('rzp_test_') && !kid.startsWith('rzp_live_')) {
      setError('Invalid format. Key ID must start with "rzp_test_" or "rzp_live_".');
      return;
    }

    setSavingKeys(true);
    try {
      const res = await axios.post(`${API()}/api/razorpay/keys`, {
        key_id: kid,
        key_secret: ksec,
        webhook_secret: wsec,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Razorpay connected successfully!');
        fetchStatus();
        if (onSaved) onSaved();
      } else {
        setError(res.data.error || 'Failed to connect Razorpay.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to verify keys with Razorpay.');
    } finally {
      setSavingKeys(false);
    }
  };

  const handleOAuthConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await axios.get(`${API()}/api/razorpay/connect`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.data?.oauth_url) {
        window.location.href = res.data.oauth_url;
      } else {
        setError(res.data?.message || 'Failed to get authorization URL.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to initiate Razorpay OAuth.');
    } finally {
      setConnecting(false);
    }
  };

  const handleModeSwitch = async () => {
    const newMode = connection.mode === 'TEST' ? 'LIVE' : 'TEST';
    setSwitchingMode(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API()}/api/razorpay/mode`,
        { mode: newMode },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setConnection(prev => ({ ...prev, mode: res.data.mode }));
      setSuccessMsg(`Switched to ${res.data.mode} mode`);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to switch mode.');
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Razorpay? Online customer payments will be stopped.')) return;
    setDisconnecting(true);
    setError(null);
    try {
      await axios.delete(`${API()}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSuccessMsg('Razorpay disconnected. Historical records preserved.');
      setConnection(prev => ({ ...prev, connected: false, connection_status: 'DISCONNECTED' }));
      if (onSaved) onSaved();
    } catch (err) {
      setError('Failed to disconnect Razorpay.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isOpen) return null;

  const isConnected = connection.connected && connection.connection_status === 'CONNECTED';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800 relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <RazorpayBrandIcon size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Razorpay Payment Gateway</h2>
                {isConnected && (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    connection.mode === 'LIVE' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {connection.mode} MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Direct customer payments into your own bank account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Notifications */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
              <p className="text-xs font-medium">Checking gateway status…</p>
            </div>
          ) : isConnected ? (
            /* ── ALREADY CONNECTED VIEW ── */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Your Razorpay Account is Connected
                </div>
                <p className="text-xs text-slate-600">
                  Customer payments for products and invoices will settle directly to this account.
                </p>
                <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Linked Key:</span>
                  <span className="font-mono font-bold text-slate-700">{connection.linked_key_id || 'Connected'}</span>
                </div>
              </div>

              {/* Mode Switch Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Payment Mode: <span className={connection.mode === 'LIVE' ? 'text-emerald-600' : 'text-amber-600'}>{connection.mode}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {connection.mode === 'LIVE' ? 'Real payments accepted' : 'Test mode — no real money charged'}
                  </p>
                </div>
                <button
                  onClick={handleModeSwitch}
                  disabled={switchingMode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  {switchingMode ? <Loader2 size={12} className="animate-spin" /> : connection.mode === 'LIVE' ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-amber-500" />}
                  Switch to {connection.mode === 'LIVE' ? 'TEST' : 'LIVE'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push('/client/payments');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Payments Dashboard</span>
                  <ArrowUpRight size={14} />
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {disconnecting ? <Loader2 size={14} className="animate-spin" /> : <Link2Off size={14} />}
                  <span>Disconnect Razorpay</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── NOT CONNECTED VIEW: TABS FOR API KEYS OR OAUTH ── */
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('keys')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'keys'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  API Key &amp; Secret (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'oauth'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1-Click OAuth Login
                </button>
              </div>

              {activeTab === 'keys' ? (
                /* Tab 1: Direct Keys */
                <form onSubmit={handleSaveKeys} className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed">
                    <span className="font-bold">How to get your keys:</span> Open your{' '}
                    <a
                      href="https://dashboard.razorpay.com/app/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline inline-flex items-center gap-0.5"
                    >
                      Razorpay Dashboard <ExternalLink size={10} />
                    </a>{' '}
                    &gt; <b>Settings</b> &gt; <b>API Keys</b> &gt; <b>Generate Key</b>.
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Key ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx"
                      value={keyForm.key_id}
                      onChange={(e) => setKeyForm({ ...keyForm, key_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Key Secret <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        required
                        placeholder="Enter your Razorpay Key Secret"
                        value={keyForm.key_secret}
                        onChange={(e) => setKeyForm({ ...keyForm, key_secret: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Webhook Secret <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Optional webhook secret"
                      value={keyForm.webhook_secret}
                      onChange={(e) => setKeyForm({ ...keyForm, webhook_secret: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingKeys}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {savingKeys ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Verifying with Razorpay…</span>
                        </>
                      ) : (
                        <>
                          <Key size={15} />
                          <span>Save &amp; Connect Gateway</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab 2: OAuth */
                <div className="space-y-4 py-2 text-center">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Log in with your official Razorpay credentials to authorize UwoConnect with zero API keys.
                  </p>
                  <button
                    type="button"
                    onClick={handleOAuthConnect}
                    disabled={connecting}
                    className="w-full py-3 px-4 bg-[#02042B] hover:bg-[#1a1c3d] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-300 disabled:opacity-60"
                  >
                    {connecting ? <Loader2 size={15} className="animate-spin" /> : <RazorpayBrandIcon size={20} />}
                    <span>{connecting ? 'Redirecting to Razorpay…' : 'Connect via Razorpay Login'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-500" />
            256-bit encrypted credential storage
          </span>
          <button
            onClick={() => {
              onClose();
              router.push('/client/payments');
            }}
            className="text-blue-600 font-bold hover:underline"
          >
            Payments Page &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

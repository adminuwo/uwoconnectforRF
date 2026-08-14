'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, X, AlertCircle, Loader2
} from 'lucide-react';
import axios from 'axios';

export const ZohoIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="4" fill="#E62C2D"/>
    <path d="M7 8H17L7 16H17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ZohoConfigModal({ client, isOpen, onClose, onSaved }) {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const isConnected = Boolean(client?.zoho_enabled);
  const config = client?.zoho_config || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/zoho/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('Failed to initiate Zoho connection.');
        setConnecting(false);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to initiate Zoho connection.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Zoho?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/zoho/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect Zoho.');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleTestLead = async () => {
    setTesting(true);
    setError(null);
    setTestResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/zoho/test-lead/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestResult('Test Lead successfully created in Zoho!');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create test lead.');
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50/80 border border-red-100 flex items-center justify-center shrink-0 shadow-xs">
                <ZohoIcon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Zoho
                  {isConnected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sync your CRM leads and data.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {testResult && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-6 text-center">
            {isConnected ? (
              <>
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Zoho is Connected</h3>
                <p className="text-sm text-slate-500 mb-6">Your workspace is successfully authenticated with Zoho.</p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleTestLead}
                    disabled={testing || disconnecting}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {testing ? <Loader2 size={16} className="animate-spin" /> : null}
                    Test Sync Lead
                  </button>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting || testing}
                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {disconnecting ? <Loader2 size={16} className="animate-spin" /> : null}
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <ZohoIcon size={32} className="opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Connect your Zoho Account</h3>
                <p className="text-sm text-slate-500 mb-6">Authenticate to allow the platform to sync leads and data.</p>
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="px-6 py-2.5 bg-[#E62C2D] text-white hover:bg-[#c92424] font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {connecting ? <Loader2 size={18} className="animate-spin" /> : null}
                  Authenticate with Zoho
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

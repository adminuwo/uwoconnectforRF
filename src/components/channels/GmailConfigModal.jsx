'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Globe, AlertCircle, Check, Loader2, Settings as SettingsIcon, Database, Sparkles, LogOut
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/apiConfig';

export const GmailBrandIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M42 12V36C42 38.2 40.2 40 38 40H34V20.5L24 28L14 20.5V40H10C7.8 40 6 38.2 6 36V12C6 9.8 7.8 8 10 8H12.5L24 16.5L35.5 8H38C40.2 8 42 9.8 42 12Z" fill="#EA4335"/>
    <path d="M38 8H35.5L24 16.5L12.5 8H10C7.8 8 6 9.8 6 12V14L24 27.5L42 14V12C42 9.8 40.2 8 38 8Z" fill="#FBBC04"/>
    <path d="M6 14V36C6 38.2 7.8 40 10 40H14V20.5L6 14Z" fill="#4285F4"/>
    <path d="M42 14L34 20.5V40H38C40.2 40 42 38.2 42 36V14Z" fill="#34A853"/>
  </svg>
);

export default function GmailConfigModal({ client, isOpen, onClose, onSaved }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, SCOPES, SETTINGS
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [toast, setToast] = useState(null);

  const gmailConfig = client?.gmail_config || {};
  const isConnected = Boolean(
    client?.gmail_enabled || 
    gmailConfig.email_address || 
    gmailConfig.email || 
    gmailConfig.token || 
    gmailConfig.access_token
  );
  
  const connectedEmail = gmailConfig.email || gmailConfig.email_address || 'Connected Account';

  if (!isOpen) return null;

  const showNotification = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleConnectOrSwitch = async () => {
    setConnecting(true);
    try {
      const token =
        typeof window !== 'undefined'
          ? (localStorage.getItem('uwo_token') ||
             localStorage.getItem('token') ||
             localStorage.getItem('access_token'))
          : null;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const baseUrl = (API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

      // Check endpoints in order of reliability with strict 3.5s timeout:
      // 1. Next.js rewrite proxy (/api/auth/gmail/connect/)
      // 2. Direct configured API_BASE_URL
      // 3. Local Django fallback port 8080
      const candidateUrls = [
        '/api/auth/gmail/connect/',
        '/api/auth/gmail/connect',
        baseUrl ? `${baseUrl}/api/auth/gmail/connect/` : null,
        baseUrl ? `${baseUrl}/api/auth/gmail/connect` : null,
        'http://127.0.0.1:8080/api/auth/gmail/connect/',
      ].filter((u, idx, arr) => u && arr.indexOf(u) === idx);

      let authUrl = null;

      for (const url of candidateUrls) {
        try {
          const res = await axios.get(url, { headers, timeout: 3500 });
          const candidateFound = res?.data?.url || res?.data?.auth_url;
          if (candidateFound) {
            authUrl = candidateFound;
            break;
          }
        } catch (candidateErr) {
          console.warn(`[GmailConnect] Endpoint ${url} did not respond:`, candidateErr?.message);
        }
      }

      if (authUrl) {
        window.location.href = authUrl;
        return;
      }

      // If AJAX/CORS was blocked, execute direct browser navigation with token
      if (token) {
        const directBase = baseUrl || '';
        window.location.href = `${directBase}/api/auth/gmail/connect/?token=${encodeURIComponent(token)}&redirect=true`;
        return;
      }

      showNotification('Could not retrieve Google authorization URL. Please sign in again.', 'error');
      setConnecting(false);
    } catch (err) {
      console.error('Error fetching Gmail auth URL:', err);
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Failed to initiate Google sign-in. Please try again.';
      showNotification(errMsg, 'error');
      setConnecting(false);
    } finally {
      // Small timeout to allow redirect to proceed or restore button state
      setTimeout(() => {
        setConnecting(false);
      }, 4000);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect Gmail (${connectedEmail})?`)) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      if (client?.id) {
        await axios.patch(`${API_BASE_URL}/api/clients/${client.id}/`, {
          gmail_enabled: false,
          gmail_config: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      showNotification('Gmail workspace disconnected successfully.', 'info');
      if (onSaved) onSaved();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      showNotification('Failed to disconnect Gmail.', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleGoToInbox = () => {
    onClose();
    router.push('/client/gmail');
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900">
        
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="absolute top-4 right-4 z-[350] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-2">
            <Sparkles size={14} className="text-emerald-400" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* MODAL HEADER */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0">
              <GmailBrandIcon size={26} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                  Gmail Workspace Integration
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  Email Sync V2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Connect Google Workspace & Gmail to automate customer email replies, sync inbox & lead capture.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL NAVIGATION TABS */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'OVERVIEW' ? 'bg-white text-slate-900 border-slate-200 shadow-2xs' : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            Overview & Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SCOPES')}
            className={`px-3.5 py-2 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'SCOPES' ? 'bg-white text-slate-900 border-slate-200 shadow-2xs' : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            OAuth Scopes & Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3.5 py-2 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap ${
              activeTab === 'SETTINGS' ? 'bg-white text-slate-900 border-slate-200 shadow-2xs' : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            Automation Settings
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1">
          
          {/* TAB 1: OVERVIEW & STATUS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              
              {/* CONNECTED STATUS CARD */}
              <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isConnected 
                  ? 'bg-emerald-50/50 border-emerald-200/90 shadow-xs' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        Connection Status
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900">
                      {isConnected ? connectedEmail : 'No Account Connected'}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isConnected 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isConnected ? 'Active & Synced' : 'Disconnected'}
                  </span>
                </div>

                {isConnected && (
                  <div className="mt-4 pt-3.5 border-t border-emerald-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                      <span><strong>Auth Method:</strong> Google OAuth 2.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={15} className="text-emerald-600 shrink-0" />
                      <span><strong>Auto Sync:</strong> Real-time Inbox & Triggers</span>
                    </div>
                  </div>
                )}
              </div>

              {/* FEATURES & CAPABILITIES HIGHLIGHTS */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Gmail Integration Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Shared Email Inbox</strong>
                      <span className="text-[11px] text-slate-500">Manage customer emails alongside WhatsApp & Social DMs.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">AI Auto-Reply Bot</strong>
                      <span className="text-[11px] text-slate-500">Automatically answer customer inquiries via AI Copilot.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Lead Capture & CRM Sync</strong>
                      <span className="text-[11px] text-slate-500">Turn email senders into CRM contacts automatically.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Automated Email Workflows</strong>
                      <span className="text-[11px] text-slate-500">Trigger drip campaigns & instant confirmation emails.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={handleGoToInbox}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Mail size={15} />
                      <span>Open Gmail Inbox & Settings</span>
                      <ExternalLink size={13} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConnectOrSwitch}
                        disabled={connecting}
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <RefreshCw size={13} className={connecting ? 'animate-spin' : ''} />
                        <span>Switch Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={disconnecting}
                        className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200"
                      >
                        {disconnecting ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectOrSwitch}
                    disabled={connecting}
                    className="w-full py-3 bg-[#EA4335] hover:bg-[#d93025] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-500/20"
                  >
                    {connecting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    <span>Connect Google Workspace / Gmail Account</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: OAUTH SCOPES & SECURITY */}
          {activeTab === 'SCOPES' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Granted Google OAuth Scopes
                </h4>
                <p className="text-slate-500 text-[11px]">
                  UWOConnect requests the official restricted Gmail scope verified by Google's Trust & Safety Team:
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        https://www.googleapis.com/auth/gmail.readonly
                      </span>
                      <span className="text-emerald-700 font-sans text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified Scope
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allows UWOConnect to read and sync customer support emails and search incoming messages (Read-Only).
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                    <span>https://www.googleapis.com/auth/userinfo.email</span>
                    <span className="text-slate-600 font-sans text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded">Identity</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATION SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Email Synchronization Settings
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <strong className="block text-slate-900">Auto-sync incoming emails</strong>
                      <span className="text-[11px] text-slate-500">Automatically pull customer emails into UWO Connect Inbox</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <strong className="block text-slate-900">Enable AI Auto-Replies</strong>
                      <span className="text-[11px] text-slate-500">Allow AI Copilot to draft or send email responses automatically</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted OAuth Token Storage</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

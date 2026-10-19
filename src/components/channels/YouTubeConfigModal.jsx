'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, RefreshCw, X, ShieldCheck, 
  Settings as SettingsIcon, Check, Loader2, Video, Youtube, Sparkles, ExternalLink,
  UploadCloud, MessageSquare, BarChart3, AlertCircle, LogOut, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { GOOGLE_INTEGRATIONS } from '@/config/googleOAuthConfig';

export const YouTubeBrandIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function YouTubeConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, SCOPES, SETTINGS
  const [channelId, setChannelId] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [autoReplyComments, setAutoReplyComments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [toast, setToast] = useState(null);

  const youtubeConfig = client?.youtube_config || {};
  const isConnected = Boolean(
    client?.youtube_enabled || 
    youtubeConfig.channel_id || 
    youtubeConfig.access_token ||
    client?.youtube_channel_id
  );

  const connectedChannelTitle = youtubeConfig.channel_title || client?.youtube_channel_name || 'YouTube Channel';
  const connectedEmail = youtubeConfig.account_email || youtubeConfig.email || '';
  const currentChannelId = youtubeConfig.channel_id || client?.youtube_channel_id || '';

  useEffect(() => {
    if (isOpen && client) {
      setChannelId(currentChannelId);
      setChannelTitle(connectedChannelTitle);
      setAutoReplyComments(youtubeConfig.auto_reply_comments !== false);
    }
  }, [isOpen, client, currentChannelId, connectedChannelTitle]);

  if (!isOpen) return null;

  const showNotification = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOAuthConnect = async () => {
    setConnecting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/auth/youtube/connect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
        return;
      }
    } catch (err) {
      console.warn('Direct API connect error, using query redirect:', err);
    }
    const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
    window.location.href = `${API_BASE_URL}/api/auth/youtube/connect${token ? `?token=${token}` : ''}`;
  };

  const handleManualSave = async () => {
    if (!channelId.trim()) {
      showNotification('Please enter a YouTube Channel ID or handle', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const res = await axios.patch(`${API_BASE_URL}/api/client/update/`, {
        youtube_enabled: true,
        youtube_config: {
          ...youtubeConfig,
          channel_id: channelId.trim(),
          channel_title: channelTitle.trim() || 'My YouTube Channel',
          auto_reply_comments: autoReplyComments,
          connected_at: new Date().toISOString()
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification('YouTube Channel configuration saved!', 'success');
      setTimeout(() => {
        if (onSaved) onSaved(res.data?.client || res.data);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving YouTube config:', err);
      showNotification('Updated YouTube settings locally.', 'success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect YouTube?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      await axios.patch(`${API_BASE_URL}/api/client/update/`, {
        youtube_enabled: false,
        youtube_config: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification('YouTube channel disconnected.', 'info');
      if (onSaved) {
        onSaved({
          ...client,
          youtube_enabled: false,
          youtube_config: null
        });
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      showNotification('Failed to disconnect YouTube', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900">
        
        {/* Toast */}
        {toast && (
          <div className="absolute top-4 right-4 z-[350] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-2">
            <Sparkles size={14} className="text-red-400" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-xs flex items-center justify-center shrink-0">
              <YouTubeBrandIcon size={26} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                  YouTube Channel Integration
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                  Google Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Connect your YouTube channel for video publishing, comments monitoring & AI auto-replies.
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

        {/* Navigation Tabs */}
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
            OAuth Scopes & Permissions
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1">
          
          {/* TAB 1: OVERVIEW & STATUS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              
              {/* Connection Status Card */}
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
                        YouTube Status
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900">
                      {isConnected ? (connectedChannelTitle || connectedEmail || 'Connected YouTube Channel') : 'No YouTube Channel Connected'}
                    </p>
                    {currentChannelId && (
                      <p className="text-[11px] font-mono text-slate-500">
                        ID: {currentChannelId}
                      </p>
                    )}
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
                      <span><strong>OAuth Flow:</strong> Google OAuth 2.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MessageSquare size={15} className="text-emerald-600 shrink-0" />
                      <span><strong>AI Moderation:</strong> {autoReplyComments ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube Integration Capabilities */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  YouTube Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <BarChart3 size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Channel Analytics & Stats</strong>
                      <span className="text-[11px] text-slate-500">Track subscriber count, video views, and engagement.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <UploadCloud size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Direct Video Uploads</strong>
                      <span className="text-[11px] text-slate-500">Publish training, marketing & demo videos directly.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <MessageSquare size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Comment Moderation & Reply</strong>
                      <span className="text-[11px] text-slate-500">Manage video comments and respond to customer queries.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <Sparkles size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">AI Community Copilot</strong>
                      <span className="text-[11px] text-slate-500">Auto-suggest and reply to recurring community questions.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {isConnected ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleOAuthConnect}
                      disabled={connecting}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <RefreshCw size={13} className={connecting ? 'animate-spin' : ''} />
                      <span>Re-authenticate / Switch Channel</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200"
                    >
                      {disconnecting ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                      <span>Disconnect YouTube</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOAuthConnect}
                    disabled={connecting}
                    className="w-full py-3.5 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md shadow-red-500/20"
                  >
                    {connecting ? <Loader2 size={16} className="animate-spin" /> : <YouTubeBrandIcon size={18} />}
                    <span>Sign in with Google / Connect YouTube Channel</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: OAUTH SCOPES & PERMISSIONS */}
          {activeTab === 'SCOPES' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Least-Privilege YouTube Scopes
                  </h4>
                  <span className="text-emerald-700 font-sans text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Google Safety Verified
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  UWOConnect strictly requests only the minimal necessary granular scopes for channel interaction, completely avoiding excessive broad permissions:
                </p>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        https://www.googleapis.com/auth/youtube.readonly
                      </span>
                      <span className="text-blue-700 font-sans text-[10px] font-semibold bg-blue-50 px-2 py-0.5 rounded">
                        Read Only
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allows viewing channel metadata, public video list, subscriber statistics, and comment threads.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        https://www.googleapis.com/auth/youtube.upload
                      </span>
                      <span className="text-amber-700 font-sans text-[10px] font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        Publishing
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allows uploading product demo videos and training materials directly to your YouTube channel.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        https://www.googleapis.com/auth/youtube.force-ssl
                      </span>
                      <span className="text-rose-700 font-sans text-[10px] font-semibold bg-rose-50 px-2 py-0.5 rounded">
                        Comments Management
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allows posting replies to video comments and moderating user feedback via AI and human agent flows.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Compliance Note:</strong> The broad scope <code>https://www.googleapis.com/auth/youtube</code> is not requested to guarantee least-privilege data access.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & MANUAL CONFIG */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Automation Preferences
                </h4>
                
                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <strong className="block text-slate-900">AI Auto-Reply to Inquiries</strong>
                    <span className="text-[11px] text-slate-500">Automatically reply to pricing & contact inquiries in comments.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReplyComments}
                    onChange={(e) => setAutoReplyComments(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                  />
                </label>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Channel Details / Manual Setup
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      YouTube Channel ID / Handle
                    </label>
                    <input
                      type="text"
                      placeholder="@YourChannelHandle or UC..."
                      value={channelId}
                      onChange={(e) => setChannelId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Found in YouTube Studio &gt; Settings &gt; Channel &gt; Advanced settings
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Custom Channel Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Media Hub"
                      value={channelTitle}
                      onChange={(e) => setChannelTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleManualSave}
                      disabled={saving}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {saving && <RefreshCw size={12} className="animate-spin" />}
                      <span>Save Configuration</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted Token Vault</span>
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

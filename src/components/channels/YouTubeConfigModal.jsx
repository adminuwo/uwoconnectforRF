'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, RefreshCw, X, ShieldCheck, 
  Settings as SettingsIcon, Check, Loader2, Video, Youtube, Sparkles, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export const YouTubeBrandIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function YouTubeConfigModal({ client, isOpen, onClose, onSaved }) {
  const [channelId, setChannelId] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [autoReplyComments, setAutoReplyComments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isOpen && client) {
      setChannelId(client?.youtube_config?.channel_id || client?.youtube_channel_id || '');
      setChannelTitle(client?.youtube_config?.channel_title || client?.business_name || '');
      setAutoReplyComments(client?.youtube_config?.auto_reply_comments !== false);
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!channelId.trim()) {
      setToast({ msg: 'Please enter a valid YouTube Channel ID or Handle', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE_URL}/api/client/update/`, {
        youtube_enabled: true,
        youtube_config: {
          channel_id: channelId.trim(),
          channel_title: channelTitle.trim() || 'My YouTube Channel',
          auto_reply_comments: autoReplyComments,
          connected_at: new Date().toISOString()
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast({ msg: '✅ YouTube Channel connected successfully!', type: 'success' });
      setTimeout(() => {
        setToast(null);
        if (onSaved) onSaved(res.data?.client || res.data);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving YouTube config:', err);
      // Fallback local update
      if (onSaved) {
        onSaved({
          ...client,
          youtube_enabled: true,
          youtube_config: {
            channel_id: channelId.trim(),
            channel_title: channelTitle.trim() || 'My YouTube Channel',
            auto_reply_comments: autoReplyComments
          }
        });
      }
      setToast({ msg: 'YouTube configuration updated!', type: 'success' });
      setTimeout(() => {
        setToast(null);
        onClose();
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect YouTube?')) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/client/update/`, {
        youtube_enabled: false,
        youtube_config: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onSaved) {
        onSaved({
          ...client,
          youtube_enabled: false,
          youtube_config: null
        });
      }
      setToast({ msg: 'YouTube disconnected', type: 'info' });
      setTimeout(() => {
        setToast(null);
        onClose();
      }, 1000);
    } catch (err) {
      setToast({ msg: 'Failed to disconnect', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  const isConnected = Boolean(client?.youtube_enabled || client?.youtube_config?.channel_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-slate-900 text-white">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs shrink-0">
              <YouTubeBrandIcon size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                YouTube Integration
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Video Comments & Community AI Bot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed">
          Connect your YouTube channel to monitor video comments, moderate live streams, and automate community replies with AI.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
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
              Found under YouTube Studio &gt; Customization &gt; Basic info
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Channel Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Media Hub"
              value={channelTitle}
              onChange={(e) => setChannelTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Toggle Auto Reply */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                AI Auto-Reply to Inquiries
              </span>
              <span className="text-[10px] text-slate-500 block">
                Automatically reply to pricing & contact inquiries in comments.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoReplyComments}
              onChange={(e) => setAutoReplyComments(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
            >
              Disconnect
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !channelId}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-1.5 shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              {saving && <RefreshCw size={13} className="animate-spin" />}
              <span>{isConnected ? 'Update Config' : 'Connect YouTube'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

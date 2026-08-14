'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper, CheckCircle2, RefreshCw, X, ShieldCheck, 
  Settings as SettingsIcon, Check, Loader2, Globe, Tag, Sparkles
} from 'lucide-react';
import axios from 'axios';

export const GoogleNewsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="4" fill="#4285F4"/>
    <path d="M7 6H17V8H7V6Z" fill="white"/>
    <path d="M7 10H13V12H7V10Z" fill="white"/>
    <path d="M7 14H17V16H7V14Z" fill="white"/>
    <path d="M7 18H14V19H7V18Z" fill="white"/>
    <rect x="15" y="10" width="2" height="3" fill="#34A853"/>
  </svg>
);

export default function GoogleNewsConfigModal({ client, isOpen, onClose, onSaved }) {
  const [enabled, setEnabled] = useState(false);
  const [defaultTopic, setDefaultTopic] = useState('TECHNOLOGY');
  const [keywordsInput, setKeywordsInput] = useState('ai, technology, business');
  const [summaryTone, setSummaryTone] = useState('professional');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-news/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setEnabled(Boolean(res.data.enabled));
        setDefaultTopic(res.data.default_topic || 'TECHNOLOGY');
        setKeywordsInput(Array.isArray(res.data.keywords) ? res.data.keywords.join(', ') : 'ai, technology, business');
        setSummaryTone(res.data.auto_summary_tone || 'professional');
      }
    } catch (err) {
      console.warn('Failed to load Google News settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isTogglingEnable = null) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const targetEnabled = isTogglingEnable !== null ? isTogglingEnable : enabled;
      
      const keywordsArray = keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const res = await axios.post(
        `${apiUrl}/api/google-news/settings`,
        {
          enabled: targetEnabled,
          default_topic: defaultTopic,
          keywords: keywordsArray,
          auto_summary_tone: summaryTone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        setEnabled(targetEnabled);
        setToast({ msg: 'Google News settings updated successfully!', type: 'success' });
        setTimeout(() => setToast(null), 3000);
        if (onSaved) onSaved();
      }
    } catch (err) {
      console.error('Error saving Google News settings:', err);
      setToast({ msg: 'Failed to save settings.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden space-y-6">
        
        {/* Toast */}
        {toast && (
          <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded-xl text-xs font-bold shadow-lg ${
            toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <GoogleNewsIcon size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                Google News Integration
                {enabled && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full">ACTIVE</span>}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live news articles, topic monitoring & AI summaries
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Status Toggle Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Integration Status</span>
                <span className="text-[11px] text-slate-500">
                  {enabled ? 'Google News is enabled for your workspace.' : 'Enable to access live news and AI summary features.'}
                </span>
              </div>
              <button
                disabled={saving}
                onClick={() => handleSave(!enabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  enabled 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : enabled ? 'Disable' : 'Enable Now'}
              </button>
            </div>

            {/* Default Topic Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe size={14} className="text-blue-600" />
                Default Preferred Topic
              </label>
              <select
                value={defaultTopic}
                onChange={(e) => setDefaultTopic(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="TECHNOLOGY">Technology</option>
                <option value="BUSINESS">Business & Finance</option>
                <option value="WORLD">World News</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="SPORTS">Sports</option>
                <option value="SCIENCE">Science</option>
                <option value="HEALTH">Health</option>
              </select>
            </div>

            {/* Keyword Monitor Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag size={14} className="text-blue-600" />
                Tracked Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="ai, technology, business, crypto..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Summary Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                AI Summary Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['concise', 'friendly', 'professional'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSummaryTone(t)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                      summaryTone === t
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(enabled)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

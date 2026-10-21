'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Search, X, Loader2, ArrowRight, CheckCircle2, AlertCircle, 
  ExternalLink, Calendar, FileText, FileSpreadsheet, Presentation, HardDrive, Mail, Bot
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const QUICK_PROMPTS = [
  { icon: Calendar, label: 'Schedule team sync tomorrow at 10 AM', query: 'Schedule team sync tomorrow at 10:00 AM' },
  { icon: Presentation, label: 'Create a 6-slide pitch deck for UWO Connect', query: 'Create a 6-slide pitch deck for UWO Connect' },
  { icon: FileText, label: 'Draft a client business proposal document', query: 'Draft a client business proposal document for automated CRM' },
  { icon: FileSpreadsheet, label: 'Create a quarterly sales tracker spreadsheet', query: 'Create a monthly sales tracking spreadsheet with target metrics' },
  { icon: Mail, label: 'Find unread customer inquiry emails', query: 'Find latest unread client inquiry emails' },
  { icon: HardDrive, label: 'Search my Google Drive for recent files', query: 'List all recent presentation and contract files' },
];

export default function GoogleAICommanderModal({ isOpen, onClose, onActionCompleted }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleExecute = async (commandText = prompt) => {
    const q = (commandText || '').trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const res = await axios.post(
        `${API_BASE_URL}/api/google/ai-command`,
        { prompt: q },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      if (onActionCompleted) onActionCompleted(res.data);
    } catch (err) {
      console.error('AI command error:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to process Google Workspace AI command.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="Ask AI to schedule meetings, create decks, draft docs, or build spreadsheets..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base font-medium outline-hidden"
            disabled={loading}
          />
          {prompt && !loading && (
            <button 
              onClick={() => setPrompt('')} 
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => handleExecute()}
            disabled={!prompt.trim() || loading}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
            <span>Run</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-bounce">
                <Bot size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Processing with Google Workspace AI...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analyzing connected account and synthesizing real data</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700 dark:text-red-300">
                <p className="font-semibold">Action could not be completed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Service: {result.service || 'Workspace'}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {result.response}
                </div>
              </div>

              {/* Action output links */}
              {result.action_result && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Created / Updated Resource:</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {result.action_result.url && (
                      <a
                        href={result.action_result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-xs"
                      >
                        <ExternalLink size={12} />
                        <span>Open in Google Workspace</span>
                      </a>
                    )}
                    {result.action_result.meet_link && (
                      <a
                        href={result.action_result.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
                      >
                        <ExternalLink size={12} />
                        <span>Join Google Meet</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Suggested Actions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(item.query);
                        handleExecute(item.query);
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center shrink-0 transition-colors">
                        <Icon size={14} />
                      </div>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px] text-slate-600 dark:text-slate-300">Enter</kbd>
            <span>to execute</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Powered by UWO Connect AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

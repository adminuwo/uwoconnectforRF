'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';
import {
  Bot,
  Zap,
  Check,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Eye,
  Tag,
  Ban,
  Inbox,
  Send,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Mail,
  Megaphone,
  Bell,
  Globe,
  AtSign,
  Plus,
  X
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

// Helper to reliably normalize comma-separated strings or arrays into clean string arrays
const normalizeArray = (val) => {
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === 'string' && val.trim()) {
    return val.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// ── Tag / Chip Input Component with Enter & Comma Support ───────────────────
function TagChipInput({
  label,
  icon: Icon,
  placeholder = "Type and press Enter or comma to add...",
  hint,
  tags = [],
  onChange,
  badgeTheme = 'rose',
  suggestions = [],
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (text) => {
    const raw = (text !== undefined ? text : inputValue).trim();
    if (!raw) return;
    const parts = raw
      .split(/[,;\n]+/)
      .map((s) => s.trim().replace(/^@/, ''))
      .filter((s) => s.length > 0);

    if (parts.length === 0) return;
    const current = Array.isArray(tags) ? tags : [];
    const merged = Array.from(new Set([...current, ...parts]));
    onChange(merged);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      addTag(inputValue);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      e.stopPropagation();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    const current = Array.isArray(tags) ? tags : [];
    onChange(current.filter((t) => t !== tagToRemove));
  };

  const themeClasses = {
    rose: {
      tag: "bg-rose-50 text-black border-2 border-rose-300 hover:bg-rose-100/90",
      btn: "text-black hover:text-rose-800 hover:bg-rose-200/80",
      badgeCount: "bg-rose-100 text-black font-bold",
      inputFocus: "focus:ring-rose-500/20 focus:border-rose-500",
      iconColor: "text-rose-600",
    },
    amber: {
      tag: "bg-amber-50 text-black border-2 border-amber-300 hover:bg-amber-100/90",
      btn: "text-black hover:text-amber-900 hover:bg-amber-200/80",
      badgeCount: "bg-amber-100 text-black font-bold",
      inputFocus: "focus:ring-amber-500/20 focus:border-amber-500",
      iconColor: "text-amber-600",
    },
    emerald: {
      tag: "bg-emerald-50 text-black border-2 border-emerald-300 hover:bg-emerald-100/90",
      btn: "text-black hover:text-emerald-900 hover:bg-emerald-200/80",
      badgeCount: "bg-emerald-100 text-black font-bold",
      inputFocus: "focus:ring-[#00AB56]/20 focus:border-[#00AB56]",
      iconColor: "text-[#00AB56]",
    },
    slate: {
      tag: "bg-slate-100 text-black border-2 border-slate-300 hover:bg-slate-200/90",
      btn: "text-black hover:text-slate-900 hover:bg-slate-300/80",
      badgeCount: "bg-slate-200 text-black font-bold",
      inputFocus: "focus:ring-slate-400/20 focus:border-slate-500",
      iconColor: "text-slate-600",
    }
  }[badgeTheme] || {
    tag: "bg-slate-100 text-black border-2 border-slate-300 hover:bg-slate-200/90",
    btn: "text-black hover:text-slate-900 hover:bg-slate-300/80",
    badgeCount: "bg-slate-200 text-black font-bold",
    inputFocus: "focus:ring-slate-400/20 focus:border-slate-500",
    iconColor: "text-slate-600",
  };

  const safeTags = Array.isArray(tags) ? tags : [];
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm md:text-base font-bold text-black">
          {label}
        </label>
        {safeTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", themeClasses.badgeCount)}>
              {safeTags.length} {safeTags.length === 1 ? 'item' : 'items'}
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs md:text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Input container with Add button */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none flex items-center justify-center">
            <Icon size={18} className={themeClasses.iconColor} />
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={placeholder}
          className={cn(
            "w-full pl-11 pr-24 py-3 text-sm md:text-base font-semibold text-black placeholder:text-slate-500 placeholder:font-normal rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 transition-all shadow-xs",
            themeClasses.inputFocus
          )}
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-black hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs md:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
        >
          <Plus size={15} />
          <span>Add</span>
        </button>
      </div>

      {/* Chips display (always visible when items exist) */}
      {safeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {safeTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg text-sm font-bold shadow-xs transition-all",
                themeClasses.tag
              )}
            >
              <span className="font-mono text-xs md:text-sm font-bold text-black select-all">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={cn("p-1 rounded-full transition-colors cursor-pointer bg-white/80 hover:bg-white shadow-3xs", themeClasses.btn)}
                title="Remove"
              >
                <X size={13} className="text-black" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Collapsible Info Dropdown Toggle to keep box clean & minimal */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowInfo((prev) => !prev)}
          className="inline-flex items-center gap-2 text-xs md:text-sm text-black hover:text-black font-bold py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer group"
        >
          <HelpCircle size={15} className="text-black" />
          <span>{showInfo ? "Hide tips & examples" : "Tips & quick examples"}</span>
          <ChevronDown
            size={15}
            className={cn("text-black transition-transform duration-200", showInfo && "rotate-180")}
          />
        </button>

        {showInfo && (
          <div className="mt-2 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-300 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150 shadow-xs">
            {hint && (
              <p className="text-xs md:text-sm text-black font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                <span>{hint}</span>
              </p>
            )}

            <div className="text-xs md:text-sm text-black font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span>Press <kbd className="px-2 py-0.5 bg-white border border-slate-400 rounded text-xs font-mono text-black font-bold shadow-3xs">Enter</kbd> or click <b className="text-black font-bold">Add</b> to add</span>
            </div>

            {suggestions.length > 0 && (
              <div className="pt-2 border-t border-slate-300 flex flex-wrap items-center gap-2">
                <span className="text-xs md:text-sm text-black font-bold">Quick add:</span>
                {suggestions
                  .filter((s) => !safeTags.includes(s))
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addTag(s)}
                      className="text-xs md:text-sm px-3 py-1 rounded-md bg-white hover:bg-slate-100 hover:border-black border border-slate-300 text-black font-bold transition-all cursor-pointer font-mono shadow-xs"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailAutomationManager({ accountId = null, provider = 'gmail' }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'filters' | 'logs'
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Auto-Reply Rule State ─────────────────────────────────────────────────
  const [autoReplyActive, setAutoReplyActive] = useState(true);
  const [autoReplySubject, setAutoReplySubject] = useState('Thank you for emailing us, {{first_name}}!');
  const [autoReplyBody, setAutoReplyBody] = useState(
    'Hi {{first_name}},\n\nThank you for reaching out to UWO Connect. We have received your email and will respond to you shortly.\n\nBest regards,\nAbha Jatav\nUWO Connect Team'
  );
  const [savingRule, setSavingRule] = useState(false);

  // ── Advanced Automation Settings State ────────────────────────────────────
  const [settings, setSettings] = useState({
    is_enabled: true,
    auto_reply_business_inquiry: true,
    auto_reply_customer_support: true,
    auto_reply_sales_inquiry: true,
    auto_reply_advertisement: false,
    auto_reply_newsletter: false,
    auto_reply_promotion: false,
    auto_reply_notification: false,
    auto_reply_spam: false,
    allowed_senders: [],
    excluded_senders: [],
    allowed_domains: [],
    excluded_domains: [],
    include_keywords: [],
    exclude_keywords: [],
    allowlist_mode: false,
    uncertain_fallback: 'skip',
    reply_to_threads: true
  });

  // ── Decision Logs State ───────────────────────────────────────────────────
  const [logs, setLogs] = useState([]);
  const [logsSummary, setLogsSummary] = useState({
    total_evaluated: 0,
    replied: 0,
    skipped: 0,
    pending_review: 0,
    failed: 0,
    categories: {}
  });
  const [logFilterDecision, setLogFilterDecision] = useState('all');
  const [logFilterCategory, setLogFilterCategory] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  const getHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('uwo_token') || localStorage.getItem('access_token') || '';
    return { Authorization: `Bearer ${token}` };
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch Current Settings & Rules ────────────────────────────────────────
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const relUrl = accountId
        ? `/api/email/automation-settings/current/?account_id=${accountId}`
        : `/api/email/automation-settings/current/`;
      const directUrl = accountId
        ? `${API_BASE_URL}/api/email/automation-settings/current/?account_id=${accountId}`
        : `${API_BASE_URL}/api/email/automation-settings/current/`;
      const localUrl = accountId
        ? `http://127.0.0.1:8080/api/email/automation-settings/current/?account_id=${accountId}`
        : `http://127.0.0.1:8080/api/email/automation-settings/current/`;

      const candidateUrls = [directUrl, localUrl, relUrl].filter((u, i, arr) => u && arr.indexOf(u) === i);

      let res = null;
      for (const url of candidateUrls) {
        try {
          res = await axios.get(url, { headers: getHeaders(), timeout: 4000 });
          if (res?.data) break;
        } catch {
          // try next
        }
      }

      if (res?.data) {
        const d = res.data;
        setSettings({
          is_enabled: d.is_enabled ?? true,
          auto_reply_business_inquiry: d.auto_reply_business_inquiry ?? true,
          auto_reply_customer_support: d.auto_reply_customer_support ?? true,
          auto_reply_sales_inquiry: d.auto_reply_sales_inquiry ?? true,
          auto_reply_advertisement: d.auto_reply_advertisement ?? false,
          auto_reply_newsletter: d.auto_reply_newsletter ?? false,
          auto_reply_promotion: d.auto_reply_promotion ?? false,
          auto_reply_notification: d.auto_reply_notification ?? false,
          auto_reply_spam: d.auto_reply_spam ?? false,
          allowed_senders: normalizeArray(d.allowed_senders),
          excluded_senders: normalizeArray(d.excluded_senders),
          allowed_domains: normalizeArray(d.allowed_domains),
          excluded_domains: normalizeArray(d.excluded_domains),
          include_keywords: normalizeArray(d.include_keywords),
          exclude_keywords: normalizeArray(d.exclude_keywords),
          allowlist_mode: d.allowlist_mode ?? false,
          uncertain_fallback: d.uncertain_fallback || 'skip',
          reply_to_threads: d.reply_to_threads ?? true
        });
      }
    } catch (err) {
      console.warn('Could not fetch automation settings, using default.', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingRule = async () => {
    try {
      const candidateUrls = [
        `${API_BASE_URL}/api/email/auto-replies/`,
        'http://127.0.0.1:8080/api/email/auto-replies/',
        '/api/email/auto-replies/'
      ].filter((u, i, arr) => u && arr.indexOf(u) === i);

      let res = null;
      for (const url of candidateUrls) {
        try {
          res = await axios.get(url, { headers: getHeaders(), timeout: 4000 });
          if (res?.data) break;
        } catch {
          // try next
        }
      }

      const rules = res?.data?.results || res?.data || [];
      if (rules.length > 0) {
        const r = rules[0];
        setAutoReplySubject(r.reply_subject || 'Thank you for emailing us, {{first_name}}!');
        setAutoReplyBody(r.reply_body || '');
        setAutoReplyActive(r.is_active ?? true);
      }
    } catch {
      // ignore
    }
  };

  // ── Fetch Decision Logs ───────────────────────────────────────────────────
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const params = new URLSearchParams();
      if (logFilterDecision !== 'all') params.append('decision', logFilterDecision);
      if (logFilterCategory !== 'all') params.append('category', logFilterCategory);
      if (logSearch.trim()) params.append('search', logSearch.trim());
      if (accountId) params.append('account_id', accountId);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const candidateLogsUrls = [
        `${API_BASE_URL}/api/email/automation-logs/${qs}`,
        `http://127.0.0.1:8080/api/email/automation-logs/${qs}`,
        `/api/email/automation-logs/${qs}`
      ].filter((u, i, arr) => u && arr.indexOf(u) === i);

      let logsRes = null;
      for (const url of candidateLogsUrls) {
        try {
          logsRes = await axios.get(url, { headers: getHeaders(), timeout: 4000 });
          if (logsRes?.data) break;
        } catch {
          // try next
        }
      }

      const logList = logsRes?.data?.results || logsRes?.data || [];
      setLogs(logList);

      try {
        const sumRes = await axios.get(`${API_BASE_URL}/api/email/automation-logs/summary/`, { headers: getHeaders(), timeout: 4000 });
        if (sumRes.data) setLogsSummary(sumRes.data);
      } catch {
        // ignore summary error
      }
    } catch (err) {
      console.warn('Could not fetch automation logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchExistingRule();
  }, [accountId]);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab, logFilterDecision, logFilterCategory]);

  // ── Save Message Rule ─────────────────────────────────────────────────────
  const handleSaveRule = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingRule(true);
    try {
      const payload = {
        name: `${provider === 'gmail' ? 'Gmail' : 'Outlook'} Instant Auto-Reply`,
        reply_type: 'thank_you',
        reply_subject: autoReplySubject,
        reply_body: autoReplyBody,
        is_active: autoReplyActive
      };

      const candidateUrls = [
        `${API_BASE_URL}/api/email/auto-replies/`,
        'http://127.0.0.1:8080/api/email/auto-replies/',
        '/api/email/auto-replies/'
      ].filter((u, i, arr) => u && arr.indexOf(u) === i);

      let saved = false;
      for (const url of candidateUrls) {
        try {
          await axios.post(url, payload, { headers: getHeaders(), timeout: 5000 });
          saved = true;
          break;
        } catch {
          // try next
        }
      }

      if (saved) {
        showToast('✅ Reply message saved successfully!');
      } else {
        showToast('❌ Could not save reply message. Please try again.', true);
      }
    } catch {
      showToast('❌ Could not save reply message. Please try again.', true);
    } finally {
      setSavingRule(false);
    }
  };

  // ── Save Category & Filtering Settings with Auto-Save Support ─────────────
  const saveSettingsPayload = async (targetSettings, isAutoSave = false) => {
    if (!isAutoSave) setSavingSettings(true);
    try {
      const s = targetSettings || settings;
      const payload = {
        is_enabled: s.is_enabled,
        auto_reply_business_inquiry: s.auto_reply_business_inquiry,
        auto_reply_customer_support: s.auto_reply_customer_support,
        auto_reply_sales_inquiry: s.auto_reply_sales_inquiry,
        auto_reply_advertisement: s.auto_reply_advertisement,
        auto_reply_newsletter: s.auto_reply_newsletter,
        auto_reply_promotion: s.auto_reply_promotion,
        auto_reply_notification: s.auto_reply_notification,
        auto_reply_spam: s.auto_reply_spam,
        allowed_senders: normalizeArray(s.allowed_senders),
        excluded_senders: normalizeArray(s.excluded_senders),
        allowed_domains: normalizeArray(s.allowed_domains).map((str) => str.replace(/^@/, '')),
        excluded_domains: normalizeArray(s.excluded_domains).map((str) => str.replace(/^@/, '')),
        include_keywords: normalizeArray(s.include_keywords),
        exclude_keywords: normalizeArray(s.exclude_keywords),
        allowlist_mode: s.allowlist_mode,
        uncertain_fallback: s.uncertain_fallback,
        reply_to_threads: s.reply_to_threads
      };

      const relUrl = accountId
        ? `/api/email/automation-settings/current/?account_id=${accountId}`
        : `/api/email/automation-settings/current/`;
      const directUrl = accountId
        ? `${API_BASE_URL}/api/email/automation-settings/current/?account_id=${accountId}`
        : `${API_BASE_URL}/api/email/automation-settings/current/`;
      const localUrl = accountId
        ? `http://127.0.0.1:8080/api/email/automation-settings/current/?account_id=${accountId}`
        : `http://127.0.0.1:8080/api/email/automation-settings/current/`;

      const candidateUrls = [directUrl, localUrl, relUrl].filter((u, i, arr) => u && arr.indexOf(u) === i);

      let saved = false;
      for (const url of candidateUrls) {
        try {
          await axios.post(url, payload, { headers: getHeaders(), timeout: 5000 });
          saved = true;
          break;
        } catch {
          // try next
        }
      }

      if (saved) {
        showToast(isAutoSave ? '✅ Rules saved!' : '✅ Changes saved successfully!');
      } else if (!isAutoSave) {
        showToast('❌ Could not save changes. Please try again.', true);
      }
    } catch (err) {
      console.error('Settings save error:', err);
      if (!isAutoSave) showToast('❌ Could not save changes. Please try again.', true);
    } finally {
      if (!isAutoSave) setSavingSettings(false);
    }
  };

  const handleSaveSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    return saveSettingsPayload(settings, false);
  };

  const updateSettingsWithAutoSave = (newPartial) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      saveSettingsPayload(updated, true);
      return updated;
    });
  };

  // ── Manual Approve for Pending Review ─────────────────────────────────────
  const handleApproveReview = async (logId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/email/automation-logs/${logId}/approve_review/`, {}, { headers: getHeaders() });
      showToast('✅ Reply sent successfully!');
      fetchLogs();
      if (selectedLogDetail && selectedLogDetail.id === logId) {
        setSelectedLogDetail(null);
      }
    } catch (err) {
      showToast('❌ Could not send reply: ' + (err.response?.data?.error || err.message), true);
    }
  };

  const handleInsertTag = (tag) => {
    setAutoReplyBody(prev => prev + ` ${tag}`);
  };

  return (
    <div className="p-6 w-full space-y-5">
      {/* Toast Alert */}
      {toast && (
        <div className={cn(
          "fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border transition-all animate-in fade-in",
          toast.isError
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-emerald-50 text-emerald-800 border-emerald-200"
        )}>
          {toast.isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header with Top Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-[#00AB56] flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Email Auto-Reply</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Smart Filter Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Control automatic replies and filter unwanted promotional emails</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-sm md:text-base font-bold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={cn(
                "px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer",
                activeTab === 'rules' ? "bg-white text-black shadow-xs font-bold" : "text-slate-600 hover:text-black font-semibold"
              )}
            >
              <Bot size={17} />
              <span>Reply Message</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('filters')}
              className={cn(
                "px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer",
                activeTab === 'filters' ? "bg-white text-black shadow-xs font-bold" : "text-slate-600 hover:text-black font-semibold"
              )}
            >
              <SlidersHorizontal size={17} />
              <span>Email Rules</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={cn(
                "px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer",
                activeTab === 'logs' ? "bg-white text-black shadow-xs font-bold" : "text-slate-600 hover:text-black font-semibold"
              )}
            >
              <Clock size={17} />
              <span>Reply History</span>
              {logsSummary.total_evaluated > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white">
                  {logsSummary.total_evaluated}
                </span>
              )}
            </button>
          </div>

          {/* Top Save Changes Button (Instant Save) */}
          {activeTab !== 'logs' && (
            <button
              type="button"
              onClick={activeTab === 'rules' ? handleSaveRule : handleSaveSettings}
              disabled={activeTab === 'rules' ? savingRule : savingSettings}
              className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white text-sm md:text-base font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Check size={18} />
              <span>{(activeTab === 'rules' ? savingRule : savingSettings) ? "Saving..." : "Save Changes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── TAB 1: REPLY MESSAGE ──────────────────────────────────── */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveRule} className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00AB56] flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Automatic Reply Message</h3>
                <p className="text-xs text-slate-500 mt-0.5">This message will be sent when someone emails you</p>
              </div>
            </div>
            
            {/* Custom Pill Toggle Switch */}
            <button
              type="button"
              onClick={() => setAutoReplyActive(!autoReplyActive)}
              className="flex items-center gap-3 cursor-pointer group bg-slate-50 hover:bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              <span className="text-xs font-bold text-slate-700">{autoReplyActive ? 'Auto-Reply On' : 'Auto-Reply Off'}</span>
              <div className={cn(
                "w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0",
                autoReplyActive ? "bg-[#00AB56]" : "bg-slate-300"
              )}>
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
                  autoReplyActive ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </button>
          </div>

          <div>
            <label className="block text-base font-bold text-black mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={autoReplySubject}
              onChange={(e) => setAutoReplySubject(e.target.value)}
              placeholder="Thank you for reaching out!"
              className="w-full px-4 py-3 text-base font-semibold text-black placeholder:text-slate-500 rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56] shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-black">Message Body</label>
              <span className="text-xs md:text-sm text-black font-medium">Click to add customer details:</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { tag: '{{first_name}}', label: 'First Name' },
                { tag: '{{last_name}}', label: 'Last Name' },
                { tag: '{{full_name}}', label: 'Full Name' },
                { tag: '{{email}}', label: 'Email' },
                { tag: '{{company}}', label: 'Company' }
              ].map(t => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => handleInsertTag(t.tag)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-black text-xs md:text-sm font-bold rounded-lg border border-slate-300 transition-all cursor-pointer shadow-xs"
                >
                  + {t.label}
                </button>
              ))}
            </div>
            <textarea
              rows={6}
              required
              value={autoReplyBody}
              onChange={(e) => setAutoReplyBody(e.target.value)}
              placeholder="Type your reply message here..."
              className="w-full p-4 text-base font-medium text-black placeholder:text-slate-500 rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56] leading-relaxed font-sans shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-3 pb-8 border-t border-slate-100">
            <span className="text-xs text-slate-400">Personalized replies build customer trust instantly.</span>
            <button
              type="submit"
              disabled={savingRule}
              className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{savingRule ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 2: EMAIL RULES & CATEGORY FILTERS ───────────────────── */}
      {activeTab === 'filters' && (
        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Turn Auto-Reply On/Off */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
                settings.is_enabled ? "bg-emerald-50 text-[#00AB56] border border-emerald-200" : "bg-slate-100 text-slate-400 border border-slate-200"
              )}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-black">Turn Auto-Reply On/Off</h3>
                <p className="text-xs md:text-sm text-black font-medium mt-0.5">Turn automatic responses on or off for your whole email account</p>
              </div>
            </div>

            {/* Custom Pill Toggle */}
            <button
              type="button"
              onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
              className="flex items-center gap-3 cursor-pointer group bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border-2 border-slate-300 transition-colors shadow-xs"
            >
              <span className="text-sm md:text-base font-bold text-black">{settings.is_enabled ? 'On' : 'Off'}</span>
              <div className={cn(
                "w-12 h-6.5 rounded-full transition-colors relative p-0.5 shrink-0",
                settings.is_enabled ? "bg-[#00AB56]" : "bg-slate-300"
              )}>
                <div className={cn(
                  "w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform",
                  settings.is_enabled ? "translate-x-5.5" : "translate-x-0"
                )} />
              </div>
            </button>
          </div>

          {/* Choose Which Emails Get Replies */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-black flex items-center gap-2">
                  <Sparkles size={20} className="text-[#00AB56]" />
                  <span>Choose Which Emails Get Replies</span>
                </h3>
                <p className="text-xs md:text-sm text-black font-medium mt-0.5">Pick which types of emails should receive an automatic response</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs md:text-sm text-black font-medium hidden sm:inline">Click any card to toggle</span>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="px-5 py-2.5 bg-black hover:bg-slate-900 text-white text-xs md:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Check size={15} />
                  <span>{savingSettings ? "Saving..." : "Save Selection"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {[
                {
                  key: 'auto_reply_business_inquiry',
                  label: 'Customer Questions',
                  desc: 'Questions about your products or pricing',
                  safe: true,
                  icon: MessageSquare,
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
                },
                {
                  key: 'auto_reply_customer_support',
                  label: 'Customer Support',
                  desc: 'Help requests and support tickets',
                  safe: true,
                  icon: HelpCircle,
                  color: 'text-sky-600 bg-sky-50 border-sky-100'
                },
                {
                  key: 'auto_reply_sales_inquiry',
                  label: 'Sales & Demos',
                  desc: 'New leads and demo requests',
                  safe: true,
                  icon: Sparkles,
                  color: 'text-violet-600 bg-violet-50 border-violet-100'
                },
                {
                  key: 'auto_reply_advertisement',
                  label: 'Advertisements & Pitches',
                  desc: 'Sales offers and promotional cold emails',
                  safe: false,
                  icon: Megaphone,
                  color: 'text-amber-600 bg-amber-50 border-amber-100'
                },
                {
                  key: 'auto_reply_newsletter',
                  label: 'Newsletters & Bulletins',
                  desc: 'Subscribed digests and mass mailings',
                  safe: false,
                  icon: Mail,
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
                },
                {
                  key: 'auto_reply_promotion',
                  label: 'Offers & Discounts',
                  desc: 'Coupons, flash deals, and promotions',
                  safe: false,
                  icon: Tag,
                  color: 'text-pink-600 bg-pink-50 border-pink-100'
                },
                {
                  key: 'auto_reply_notification',
                  label: 'Automatic Emails & OTPs',
                  desc: 'Password resets, receipts, and alert messages',
                  safe: false,
                  icon: Bell,
                  color: 'text-slate-600 bg-slate-100 border-slate-200'
                },
                {
                  key: 'auto_reply_spam',
                  label: 'Spam & Unwanted Emails',
                  desc: 'Spam, scams, and suspicious emails',
                  safe: false,
                  icon: Ban,
                  color: 'text-rose-600 bg-rose-50 border-rose-100'
                }
              ].map((item) => {
                const IconComponent = item.icon;
                const isChecked = !!settings[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => updateSettingsWithAutoSave({ [item.key]: !isChecked })}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer gap-3 select-none",
                      isChecked
                        ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200/80 shadow-2xs"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border shrink-0", item.color)}>
                          <IconComponent size={16} />
                        </div>
                        <span className="text-sm md:text-base font-bold text-black truncate">{item.label}</span>
                      </div>
                      
                      {/* Pill toggle on card */}
                      <div className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0",
                        isChecked ? "bg-[#00AB56]" : "bg-slate-200"
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white shadow-xs transition-transform",
                          isChecked ? "translate-x-4" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-black font-medium leading-relaxed pl-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Rules */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-black flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-[#00AB56]" />
                  <span>Email Rules</span>
                </h3>
                <p className="text-xs md:text-sm text-black font-medium mt-0.5">
                  Set extra rules for specific people, websites, or words
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white text-xs md:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Check size={16} />
                <span>{savingSettings ? "Saving..." : "Save Rules"}</span>
              </button>
            </div>

            {/* Blocked Senders & Domains with Enter key & badge chip support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagChipInput
                label="Blocked Email Addresses"
                icon={AtSign}
                placeholder="Type email & press Enter or click Add..."
                hint="Never reply to these emails"
                tags={settings.excluded_senders}
                onChange={(newTags) => updateSettingsWithAutoSave({ excluded_senders: newTags })}
                badgeTheme="rose"
                suggestions={['aditi@uwo24.com', 'devansh@uwo24.com', 'noreply@vendor.com']}
              />

              <TagChipInput
                label="Blocked Websites/Email Domains"
                icon={Globe}
                placeholder="Type domain & press Enter or click Add..."
                hint="Never reply to anyone from these website domains"
                tags={settings.excluded_domains}
                onChange={(newTags) => updateSettingsWithAutoSave({ excluded_domains: newTags })}
                badgeTheme="rose"
                suggestions={['coldreach.io', 'adcompany.com', 'promomail.net']}
              />
            </div>

            {/* Skip Keywords & Must-Include Keywords with Enter key & badge chip support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TagChipInput
                label="Skip Emails Containing These Words"
                icon={Ban}
                placeholder="Type word & press Enter or click Add..."
                hint="Do not reply if subject or body contains any of these words"
                tags={settings.exclude_keywords}
                onChange={(newTags) => updateSettingsWithAutoSave({ exclude_keywords: newTags })}
                badgeTheme="amber"
                suggestions={['unsubscribe', 'blast', 'promo', 'seo', 'sponsored']}
              />

              <TagChipInput
                label="Reply Only If These Words Appear"
                icon={Check}
                placeholder="Type word & press Enter or click Add..."
                hint="Optional: only send a reply if the email contains these words"
                tags={settings.include_keywords}
                onChange={(newTags) => updateSettingsWithAutoSave({ include_keywords: newTags })}
                badgeTheme="emerald"
                suggestions={['question', 'pricing', 'quote', 'help', 'demo']}
              />
            </div>

            {/* Approved Senders Only & What to Do When Unsure */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => updateSettingsWithAutoSave({ allowlist_mode: !settings.allowlist_mode })}
                  className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <div className="pr-3">
                    <span className="font-bold text-sm md:text-base text-black flex items-center gap-2">
                      <ShieldCheck size={18} className={settings.allowlist_mode ? "text-[#00AB56]" : "text-black"} />
                      <span>Reply Only to Approved Senders</span>
                    </span>
                    <span className="text-black font-medium text-xs md:text-sm mt-0.5 block">
                      Strict mode: only reply to contacts you have approved
                    </span>
                  </div>
                  <div className={cn(
                    "w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0",
                    settings.allowlist_mode ? "bg-[#00AB56]" : "bg-slate-300"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
                      settings.allowlist_mode ? "translate-x-5" : "translate-x-0"
                    )} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="font-bold text-sm md:text-base text-black flex items-center gap-2">
                      <AlertCircle size={18} className="text-amber-500" />
                      <span>What to Do When Unsure</span>
                    </span>
                    <span className="text-black font-medium text-xs md:text-sm mt-0.5 block">
                      When the email category cannot be determined
                    </span>
                  </div>
                  <select
                    value={settings.uncertain_fallback}
                    onChange={(e) => updateSettingsWithAutoSave({ uncertain_fallback: e.target.value })}
                    className="px-4 py-2.5 text-sm md:text-base rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 font-bold text-black shadow-xs shrink-0 cursor-pointer"
                  >
                    <option value="skip">Do Not Reply</option>
                    <option value="require_review">Hold for My Review</option>
                  </select>
                </div>
              </div>

              {/* Conditionally reveal Approved Senders list if strict mode is active */}
              {settings.allowlist_mode && (
                <div className="p-4.5 rounded-xl border border-emerald-200/80 bg-emerald-50/20">
                  <TagChipInput
                    label="Approved Senders List (Allowlist)"
                    icon={CheckCircle2}
                    placeholder="Type approved email & press Enter or click Add..."
                    hint="Only emails matching this list will receive auto-replies when strict mode is on"
                    tags={settings.allowed_senders}
                    onChange={(newTags) => updateSettingsWithAutoSave({ allowed_senders: newTags })}
                    badgeTheme="emerald"
                    suggestions={['vip@client.com', 'partner@enterprise.com']}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Save Bar (with extra bottom margin so it is never hidden behind floating widgets) */}
          <div className="flex items-center justify-between pt-4 pb-20 border-t border-slate-200/70">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={16} className="text-[#00AB56]" />
              <span>All changes will take effect immediately upon saving. Tip: Press <b>Ctrl+Enter</b> to save quickly.</span>
            </div>
            <button
              type="submit"
              disabled={savingSettings}
              className="px-7 py-3 bg-[#00AB56] hover:bg-[#009249] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{savingSettings ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 3: REPLY HISTORY ─────────────────────────────────── */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Checked</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">{logsSummary.total_evaluated || 0}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Replies Sent</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{logsSummary.replied || 0}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Skipped</span>
              <div className="text-2xl font-bold text-slate-600 mt-1">{logsSummary.skipped || 0}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
              <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">Needs Review</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">{logsSummary.pending_review || 0}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-black" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                  placeholder="Search sender or subject..."
                  className="pl-10 pr-3.5 py-2.5 text-sm md:text-base font-semibold text-black placeholder:text-slate-500 rounded-xl border-2 border-slate-300 w-60 sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#00AB56] shadow-xs"
                />
              </div>

              <select
                value={logFilterDecision}
                onChange={(e) => setLogFilterDecision(e.target.value)}
                className="px-3.5 py-2.5 text-sm md:text-base rounded-xl border-2 border-slate-300 bg-white font-bold text-black focus:outline-none shadow-xs"
              >
                <option value="all">All Status</option>
                <option value="replied">🟢 Replied</option>
                <option value="skipped">⚪ Skipped</option>
                <option value="pending_review">🟡 Needs Review</option>
                <option value="failed">🔴 Failed</option>
              </select>

              <select
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="px-3.5 py-2.5 text-sm md:text-base rounded-xl border-2 border-slate-300 bg-white font-bold text-black focus:outline-none shadow-xs"
              >
                <option value="all">All Email Types</option>
                <option value="business_inquiry">Customer Questions</option>
                <option value="customer_support">Customer Support</option>
                <option value="sales_inquiry">Sales & Demos</option>
                <option value="advertisement">Advertisements</option>
                <option value="newsletter">Newsletters</option>
                <option value="promotion">Offers & Discounts</option>
                <option value="notification">Automatic Emails & OTPs</option>
                <option value="spam">Spam & Unwanted</option>
                <option value="uncertain">Not Sure</option>
              </select>
            </div>

            <button
              type="button"
              onClick={fetchLogs}
              disabled={loadingLogs}
              className="p-2.5 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-black font-bold transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw size={16} className={loadingLogs ? "animate-spin text-black" : "text-black"} />
            </button>
          </div>

          {/* Logs Table / List */}
          <div className="bg-white rounded-xl border-2 border-slate-300 overflow-hidden shadow-xs">
            {loadingLogs ? (
              <div className="p-8 text-center text-sm md:text-base font-bold text-black">Loading reply history...</div>
            ) : logs.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-black">
                  <Inbox size={24} />
                </div>
                <h4 className="text-base font-bold text-black">No reply history yet</h4>
                <p className="text-xs md:text-sm text-black font-medium">
                  When new emails arrive, you will see what happened to them here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-100 text-xs md:text-sm font-bold text-black uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Sender</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Email Type</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-black font-sans">
                    {logs.map((log) => {
                      const isReplied = log.decision === 'replied';
                      const isSkipped = log.decision === 'skipped';
                      const isPending = log.decision === 'pending_review';
                      const isFailed = log.decision === 'failed';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 text-xs md:text-sm font-semibold text-black whitespace-nowrap">
                            {log.created_at ? new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-black block text-sm md:text-base">{log.sender_name || 'Unknown'}</span>
                            <span className="text-xs md:text-sm font-semibold text-black">{log.sender_email}</span>
                          </td>
                          <td className="py-3.5 px-4 max-w-[220px] truncate text-sm md:text-base" title={log.subject}>
                            <span className="font-bold text-black">{log.subject || '(No Subject)'}</span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
                              log.category === 'business_inquiry' && "bg-blue-100 text-blue-900 border border-blue-300",
                              log.category === 'customer_support' && "bg-cyan-100 text-cyan-900 border border-cyan-300",
                              log.category === 'sales_inquiry' && "bg-indigo-100 text-indigo-900 border border-indigo-300",
                              log.category === 'advertisement' && "bg-amber-100 text-amber-900 border border-amber-300",
                              log.category === 'newsletter' && "bg-purple-100 text-purple-900 border border-purple-300",
                              log.category === 'promotion' && "bg-pink-100 text-pink-900 border border-pink-300",
                              log.category === 'notification' && "bg-slate-200 text-black border border-slate-300",
                              log.category === 'spam' && "bg-red-100 text-red-900 border border-red-300",
                              log.category === 'uncertain' && "bg-yellow-100 text-yellow-900 border border-yellow-300"
                            )}>
                              {log.category === 'business_inquiry' ? 'Questions' :
                               log.category === 'customer_support' ? 'Support' :
                               log.category === 'sales_inquiry' ? 'Sales' :
                               log.category === 'advertisement' ? 'Ad' :
                               log.category === 'newsletter' ? 'Newsletter' :
                               log.category === 'promotion' ? 'Promo' :
                               log.category === 'notification' ? 'Alert/OTP' :
                               log.category === 'spam' ? 'Spam' :
                               log.category === 'uncertain' ? 'Unsure' :
                               (log.category ? log.category.replace('_', ' ') : 'Unknown')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5",
                              isReplied && "bg-emerald-100 text-emerald-900 border border-emerald-300",
                              isSkipped && "bg-slate-200 text-black border border-slate-300",
                              isPending && "bg-amber-100 text-amber-900 border border-amber-300",
                              isFailed && "bg-red-100 text-red-900 border border-red-300"
                            )}>
                              {isReplied && <CheckCircle2 size={13} />}
                              {isSkipped && <Ban size={13} />}
                              {isPending && <Clock size={13} />}
                              {isFailed && <XCircle size={13} />}
                              <span>{isReplied ? 'Replied' : isSkipped ? 'Skipped' : isPending ? 'Needs Review' : 'Failed'}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs md:text-sm font-semibold text-black max-w-[260px] truncate" title={log.reason}>
                            {log.reason || '-'}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => handleApproveReview(log.id)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                              >
                                Send Reply
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedLogDetail(log)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                title="View details"
                              >
                                <Eye size={15} />
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
          </div>

          {/* Details Modal */}
          {selectedLogDetail && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">Email Reply Details</h4>
                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">Sender</span>
                      <span className="font-semibold text-slate-900">{selectedLogDetail.sender_name}</span>
                      <span className="block text-xs text-slate-500">{selectedLogDetail.sender_email}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">What Happened</span>
                      <span className="font-bold text-slate-900 capitalize">
                        {selectedLogDetail.decision === 'replied' ? 'Reply Sent' :
                         selectedLogDetail.decision === 'skipped' ? 'Skipped' :
                         selectedLogDetail.decision === 'pending_review' ? 'Needs Review' : 'Failed'}
                      </span>
                      <span className="block text-xs text-slate-500">{selectedLogDetail.reply_status}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase block">Subject</span>
                    <span className="font-medium text-slate-800">{selectedLogDetail.subject || '(None)'}</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase block">Why this happened</span>
                    <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                      {selectedLogDetail.reason || 'No specific reason recorded.'}
                    </p>
                  </div>

                  {selectedLogDetail.rule_name && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">Rule Used</span>
                      <span className="font-semibold text-emerald-700">{selectedLogDetail.rule_name}</span>
                    </div>
                  )}

                  {selectedLogDetail.classification_details?.signals && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Details Detected</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedLogDetail.classification_details.signals.map((sig, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                            {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

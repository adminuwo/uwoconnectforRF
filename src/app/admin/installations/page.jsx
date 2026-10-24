'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  HardDriveDownload, Globe, Smartphone, Apple, CheckCircle2,
  XCircle, Search, RefreshCw, Download, Filter, ChevronLeft,
  ChevronRight, Laptop, Monitor, AlertCircle, ExternalLink,
  Copy, Check, Clock, UserCheck, ShieldAlert, Trash2, ArrowUpRight,
  TrendingDown, TrendingUp, Layers, Activity, Calendar, RotateCcw, X
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function InstallationsAnalyticsPage() {
  const [data, setData] = useState({
    summary: {
      total_installations: 0,
      active_installations: 0,
      uninstalled_count: 0,
      web: { total: 0, active: 0, uninstalled: 0, retention_rate: 100 },
      android: { total: 0, active: 0, uninstalled: 0, retention_rate: 100 },
      ios: { total: 0, active: 0, uninstalled: 0, retention_rate: 100 },
    },
    installations: [],
    pagination: {
      page: 1,
      page_size: 25,
      total_count: 0,
      total_pages: 1,
    }
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL'); // ALL, WEB, ANDROID, IOS
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, UNINSTALLED
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL'); // ALL, TODAY, 7D, 30D
  const [sortBy, setSortBy] = useState('-first_installed_at');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const abortControllerRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch installation analytics from backend
  const fetchInstallations = useCallback(async (manual = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (manual) setIsRefreshing(true);
      else setLoading(true);

      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await axios.get(`${API_BASE_URL}/api/admin/installations/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: debouncedSearch,
          platform: platformFilter,
          status: statusFilter,
          date_range: dateRangeFilter,
          sort_by: sortBy,
          page,
          page_size: pageSize,
        },
        timeout: 10000,
        signal: controller.signal,
      });

      if (res.data?.success) {
        setData(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      console.error('[InstallationsAnalytics] Fetch error:', err);
      const msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Unable to load installation details.';
      setError(msg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, platformFilter, statusFilter, dateRangeFilter, sortBy, page, pageSize]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  // Toggle installation status (Active <-> Uninstalled)
  const handleToggleStatus = async (installation) => {
    const instId = installation.installation_id || installation.id;
    setTogglingId(instId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/installations/${instId}/toggle-status/`,
        { reason: installation.is_uninstalled ? '' : 'Marked uninstalled by Super Admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        // Optimistic UI update
        setData((prev) => ({
          ...prev,
          installations: prev.installations.map((item) =>
            (item.installation_id === instId || item.id === instId)
              ? {
                  ...item,
                  is_uninstalled: res.data.is_uninstalled,
                  status: res.data.status,
                  uninstalled_at: res.data.uninstalled_at,
                }
              : item
          ),
          summary: {
            ...prev.summary,
            active_installations: res.data.is_uninstalled
              ? prev.summary.active_installations - 1
              : prev.summary.active_installations + 1,
            uninstalled_count: res.data.is_uninstalled
              ? prev.summary.uninstalled_count + 1
              : prev.summary.uninstalled_count - 1,
          }
        }));

        setToast({
          type: 'success',
          message: res.data.message || 'Status updated successfully.',
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error('[ToggleStatus] Error:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.error || 'Failed to update installation status.',
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setTogglingId(null);
    }
  };

  // Copy email helper
  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!data.installations || data.installations.length === 0) return;
    const headers = [
      'Installation ID', 'User Name', 'Email', 'Client Name', 'Platform',
      'Device Model', 'OS Version', 'App Version', 'Status', 'Installed At',
      'Uninstalled At', 'Last Active At', 'Open Count', 'IP Address'
    ];
    const rows = data.installations.map((i) => [
      `"${i.installation_id || ''}"`,
      `"${i.user_name || ''}"`,
      `"${i.user_email || ''}"`,
      `"${i.client_name || ''}"`,
      `"${i.platform || ''}"`,
      `"${i.device_model || ''}"`,
      `"${i.os_version || ''}"`,
      `"${i.app_version || ''}"`,
      `"${i.status || ''}"`,
      `"${i.installed_at || ''}"`,
      `"${i.uninstalled_at || ''}"`,
      `"${i.last_active_at || ''}"`,
      `"${i.open_count || 1}"`,
      `"${i.ip_address || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uwo_installations_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format timestamp helper
  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 30) return `${diffDay}d ago`;
    return `${Math.floor(diffDay / 30)}mo ago`;
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
    setDateRangeFilter('ALL');
    setSortBy('-first_installed_at');
    setPage(1);
  };

  const hasActiveFilters = searchInput !== '' || platformFilter !== 'ALL' || statusFilter !== 'ALL' || dateRangeFilter !== 'ALL';

  const getStatusCounts = () => {
    const web = data.summary.web || { total: 0, active: 0, uninstalled: 0 };
    const android = data.summary.android || { total: 0, active: 0, uninstalled: 0 };
    const ios = data.summary.ios || { total: 0, active: 0, uninstalled: 0 };

    if (platformFilter === 'WEB') {
      return { all: web.total, active: web.active, uninstalled: web.uninstalled };
    }
    if (platformFilter === 'ANDROID') {
      return { all: android.total, active: android.active, uninstalled: android.uninstalled };
    }
    if (platformFilter === 'IOS') {
      return { all: ios.total, active: ios.active, uninstalled: ios.uninstalled };
    }
    return {
      all: data.summary.total_installations || 0,
      active: data.summary.active_installations || 0,
      uninstalled: data.summary.uninstalled_count || 0,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5 w-full max-w-full min-h-screen font-sans">
        {/* Toast Notification */}
        {toast && (
          <div className={cn(
            "fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition-all animate-bounce",
            toast.type === 'success' ? "bg-emerald-900 text-white border-emerald-700" : "bg-red-900 text-white border-red-700"
          )}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                <HardDriveDownload className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Installation & Uninstallation Analytics
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80">
                    Audit Trail
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Track who installed, when they installed, who uninstalled, and exact device activity across Web, Android, and iOS.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {lastUpdated && (
              <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => fetchInstallations(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-indigo-600")} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!data.installations || data.installations.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-red-700 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => fetchInstallations(true)} className="text-xs font-bold underline hover:text-red-900">
              Retry
            </button>
          </div>
        )}

        {/* ── 1. Summary Cards (6 KPIs) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {/* Total Installations */}
          <div
            onClick={() => { setPlatformFilter('ALL'); setStatusFilter('ALL'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              platformFilter === 'ALL' && statusFilter === 'ALL' && !searchInput && dateRangeFilter === 'ALL' && "ring-2 ring-indigo-500/80 bg-indigo-50/20"
            )}
            title="Click to view all installations"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Installs</span>
              <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HardDriveDownload className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {loading ? '...' : data.summary.total_installations}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">All recorded devices</p>
            </div>
          </div>

          {/* Active Installations */}
          <div
            onClick={() => { setStatusFilter('ACTIVE'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              statusFilter === 'ACTIVE' && "ring-2 ring-emerald-500/80 bg-emerald-50/20"
            )}
            title="Click to filter active devices"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Active Installed</span>
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">
                {loading ? '...' : data.summary.active_installations}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Currently active app users</p>
            </div>
          </div>

          {/* Total Uninstalled */}
          <div
            onClick={() => { setStatusFilter('UNINSTALLED'); setPlatformFilter('ALL'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-red-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              statusFilter === 'UNINSTALLED' && "ring-2 ring-red-500/80 bg-red-50/20"
            )}
            title="Click to filter uninstalled devices across all platforms"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Total Uninstalled</span>
              <div className="w-7 h-7 rounded-md bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight">
                {loading ? '...' : data.summary.uninstalled_count}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Removed / Uninstalled</p>
            </div>
          </div>

          {/* Web Deployments */}
          <div
            onClick={() => { setPlatformFilter('WEB'); setStatusFilter('ALL'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              platformFilter === 'WEB' && statusFilter === 'ALL' && "ring-2 ring-blue-500/80 bg-blue-50/20"
            )}
            title="Click to filter Web portal sessions"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Web Portal</span>
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.web.total}
                </span>
                <span className="text-[11px] font-semibold text-blue-600">
                  ({data.summary.web.active} active)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Desktop & browser</p>
            </div>
          </div>

          {/* Android App Installs */}
          <div
            onClick={() => { setPlatformFilter('ANDROID'); setStatusFilter('ALL'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              platformFilter === 'ANDROID' && statusFilter === 'ALL' && "ring-2 ring-emerald-500/80 bg-emerald-50/20"
            )}
            title="Click to filter Android app devices"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Android Installs</span>
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.android.total}
                </span>
                {data.summary.android.uninstalled > 0 && (
                  <span className="text-[11px] font-semibold text-red-600">
                    ({data.summary.android.uninstalled} uninstalled)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {data.summary.android.active} active devices
              </p>
            </div>
          </div>

          {/* iOS Installs */}
          <div
            onClick={() => { setPlatformFilter('IOS'); setStatusFilter('ALL'); setPage(1); }}
            className={cn(
              "bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-sky-400 cursor-pointer select-none transition-all hover:scale-[1.01] flex flex-col justify-between",
              platformFilter === 'IOS' && statusFilter === 'ALL' && "ring-2 ring-sky-500/80 bg-sky-50/20"
            )}
            title="Click to filter iOS iPhone app devices"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">iOS Installs</span>
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <Apple className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.ios.total}
                </span>
                {data.summary.ios.uninstalled > 0 && (
                  <span className="text-[11px] font-semibold text-red-600">
                    ({data.summary.ios.uninstalled} uninstalled)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {data.summary.ios.active} active iPhones
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. Platform Retention & Churn Comparison ── */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Platform Retention & Uninstallation Ratios
              </h2>
              <p className="text-xs text-slate-500">
                Comparison of active installed devices vs uninstalled devices by platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Web Stats */}
            <div
              onClick={() => { setPlatformFilter('WEB'); setPage(1); }}
              className={cn(
                "p-3.5 rounded-lg border border-blue-100 bg-blue-50/40 space-y-2 cursor-pointer select-none hover:border-blue-300 hover:shadow-xs transition-all",
                platformFilter === 'WEB' && "ring-2 ring-blue-500/80 bg-blue-100/40"
              )}
              title="Click to filter Web devices"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Web Portal
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {data.summary.web.retention_rate}% Retention
                </span>
              </div>
              <div className="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${data.summary.web.retention_rate}%` }}
                  className="bg-blue-600 h-full transition-all"
                />
              </div>
              <div className="flex justify-between text-[11px] text-blue-800/80 font-medium">
                <span>Active: <strong className="text-blue-900">{data.summary.web.active}</strong></span>
                <span>Uninstalled/Revoked: <strong className="text-blue-900">{data.summary.web.uninstalled}</strong></span>
                <span>Total: <strong className="text-blue-900">{data.summary.web.total}</strong></span>
              </div>
            </div>

            {/* Android Stats */}
            <div
              onClick={() => { setPlatformFilter('ANDROID'); setPage(1); }}
              className={cn(
                "p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-2 cursor-pointer select-none hover:border-emerald-300 hover:shadow-xs transition-all",
                platformFilter === 'ANDROID' && "ring-2 ring-emerald-500/80 bg-emerald-100/40"
              )}
              title="Click to filter Android devices"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Android Native App
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {data.summary.android.retention_rate}% Retention
                </span>
              </div>
              <div className="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${data.summary.android.retention_rate}%` }}
                  className="bg-emerald-600 h-full transition-all"
                />
              </div>
              <div className="flex justify-between text-[11px] text-emerald-800/80 font-medium">
                <span>Active: <strong className="text-emerald-900">{data.summary.android.active}</strong></span>
                <span>Uninstalled: <strong className="text-red-700">{data.summary.android.uninstalled}</strong></span>
                <span>Total: <strong className="text-emerald-900">{data.summary.android.total}</strong></span>
              </div>
            </div>

            {/* iOS Stats */}
            <div
              onClick={() => { setPlatformFilter('IOS'); setPage(1); }}
              className={cn(
                "p-3.5 rounded-lg border border-sky-100 bg-sky-50/40 space-y-2 cursor-pointer select-none hover:border-sky-300 hover:shadow-xs transition-all",
                platformFilter === 'IOS' && "ring-2 ring-sky-500/80 bg-sky-100/40"
              )}
              title="Click to filter iOS devices"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sky-900 text-xs">
                  <Apple className="w-3.5 h-3.5 text-sky-600" />
                  iOS / iPhone App
                </div>
                <span className="text-xs font-bold text-sky-700">
                  {data.summary.ios.retention_rate}% Retention
                </span>
              </div>
              <div className="w-full h-2 bg-sky-200/50 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${data.summary.ios.retention_rate}%` }}
                  className="bg-sky-600 h-full transition-all"
                />
              </div>
              <div className="flex justify-between text-[11px] text-sky-800/80 font-medium">
                <span>Active: <strong className="text-sky-900">{data.summary.ios.active}</strong></span>
                <span>Uninstalled: <strong className="text-red-700">{data.summary.ios.uninstalled}</strong></span>
                <span>Total: <strong className="text-sky-900">{data.summary.ios.total}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Filters & Search Toolbar (Redesigned Compact Row) ── */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search user, client name, email, device, or OS..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Control */}
              <div className="inline-flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 text-xs">
                {[
                  { key: 'ALL', label: 'All', count: statusCounts.all },
                  { key: 'ACTIVE', label: 'Active', count: statusCounts.active },
                  { key: 'UNINSTALLED', label: 'Uninstalled', count: statusCounts.uninstalled },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs transition-all font-medium inline-flex items-center gap-1.5",
                      statusFilter === tab.key
                        ? "bg-white text-slate-900 shadow-2xs font-semibold"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    <span>{tab.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      statusFilter === tab.key
                        ? tab.key === 'UNINSTALLED' && tab.count > 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                        : tab.key === 'UNINSTALLED' && tab.count > 0 ? "bg-red-50 text-red-600 font-semibold" : "bg-slate-200/60 text-slate-500"
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative inline-block">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={dateRangeFilter}
                  onChange={(e) => { setDateRangeFilter(e.target.value); setPage(1); }}
                  className="pl-8 pr-7 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none"
                >
                  <option value="ALL">All Dates</option>
                  <option value="TODAY">Installed Today</option>
                  <option value="7D">Last 7 Days</option>
                  <option value="30D">Last 30 Days</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>

              {/* Subtle Reset Action */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-lg transition-all"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Tags Row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Applied filters:</span>
              {platformFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-medium text-[11px]">
                  Platform: <strong className="font-semibold">{platformFilter === 'IOS' ? 'iOS' : platformFilter === 'ANDROID' ? 'Android' : 'Web'}</strong>
                  <button onClick={() => { setPlatformFilter('ALL'); setPage(1); }} className="hover:text-indigo-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/70 text-purple-700 font-medium text-[11px]">
                  Status: <strong className="font-semibold">{statusFilter === 'ACTIVE' ? 'Active Installed' : 'Uninstalled'}</strong>
                  <button onClick={() => { setStatusFilter('ALL'); setPage(1); }} className="hover:text-purple-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {dateRangeFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]">
                  Date: <strong className="font-semibold">{dateRangeFilter === 'TODAY' ? 'Today' : dateRangeFilter === '7D' ? 'Last 7 Days' : 'Last 30 Days'}</strong>
                  <button onClick={() => { setDateRangeFilter('ALL'); setPage(1); }} className="hover:text-slate-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchInput && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-medium text-[11px]">
                  Search: <strong className="font-semibold">&quot;{searchInput}&quot;</strong>
                  <button onClick={() => setSearchInput('')} className="hover:text-amber-900 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 hover:text-indigo-600 underline font-medium ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* ── 4. Installation & Uninstallation Details Table ── */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 sm:px-6">User / Client Name</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Device & OS Version</th>
                  <th className="py-3 px-4">App Version</th>
                  <th className="py-3 px-4">Installed Date & Time</th>
                  <th className="py-3 px-4">Uninstalled / Last Active</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && data.installations.length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-200" />
                          <div className="space-y-1.5">
                            <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
                            <div className="w-16 h-2.5 bg-slate-100 rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><div className="w-28 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-3.5 px-4"><div className="w-16 h-5 bg-slate-200 rounded-full" /></td>
                      <td className="py-3.5 px-4"><div className="w-24 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-3.5 px-4"><div className="w-12 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-3.5 px-4"><div className="w-24 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-3.5 px-4"><div className="w-24 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-3.5 px-4"><div className="w-16 h-5 bg-slate-200 rounded-full" /></td>
                      <td className="py-3.5 px-4 text-right"><div className="w-20 h-7 bg-slate-200 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : data.installations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 px-4 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <HardDriveDownload className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">No installation records found</h3>
                        <p className="text-xs text-slate-500">
                          {hasActiveFilters
                            ? "No installation records match your selected filters. Try clearing or changing your filters."
                            : "No device installations have been registered yet."}
                        </p>

                        {/* Smart Suggestion if user searched for uninstalled on a platform with 0 uninstalls */}
                        {statusFilter === 'UNINSTALLED' && data.summary.uninstalled_count > 0 && (
                          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 text-left space-y-2 mt-3 shadow-xs">
                            <div className="font-bold flex items-center gap-1.5 text-amber-900">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              {platformFilter !== 'ALL' ? (
                                <span>No uninstalled devices found on {platformFilter === 'ANDROID' ? 'Android' : platformFilter === 'WEB' ? 'Web' : 'iOS'}.</span>
                              ) : (
                                <span>No uninstalled devices found matching your current filters.</span>
                              )}
                            </div>
                            <p className="text-[11px] text-amber-800 leading-relaxed">
                              However, there are <strong>{data.summary.uninstalled_count} uninstalled device</strong> records registered:
                              {data.summary.ios?.uninstalled > 0 && ` iOS / iPhone (${data.summary.ios.uninstalled})`}
                              {data.summary.android?.uninstalled > 0 && ` Android (${data.summary.android.uninstalled})`}
                              {data.summary.web?.uninstalled > 0 && ` Web (${data.summary.web.uninstalled})`}.
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {data.summary.ios?.uninstalled > 0 && platformFilter !== 'IOS' && (
                                <button
                                  onClick={() => { setPlatformFilter('IOS'); setPage(1); }}
                                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                                >
                                  <Apple className="w-3 h-3" />
                                  View iOS ({data.summary.ios.uninstalled} uninstalled)
                                </button>
                              )}
                              {data.summary.android?.uninstalled > 0 && platformFilter !== 'ANDROID' && (
                                <button
                                  onClick={() => { setPlatformFilter('ANDROID'); setPage(1); }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                                >
                                  <Smartphone className="w-3 h-3" />
                                  View Android ({data.summary.android.uninstalled} uninstalled)
                                </button>
                              )}
                              <button
                                onClick={() => { setPlatformFilter('ALL'); setPage(1); }}
                                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1"
                              >
                                View All ({data.summary.uninstalled_count})
                              </button>
                            </div>
                          </div>
                        )}

                        {hasActiveFilters && (
                          <div className="pt-2">
                            <button
                              onClick={handleResetFilters}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                            >
                              Clear all filters
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.installations.map((item) => {
                    const isIos = item.platform === 'ios';
                    const isAndroid = item.platform === 'android';
                    const isWeb = item.platform === 'web';
                    const isUninstalled = item.is_uninstalled;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* 1. User / Client Name */}
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs",
                              isIos ? "bg-sky-50 text-sky-700 border border-sky-200/80" :
                              isAndroid ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" :
                              "bg-blue-50 text-blue-700 border border-blue-200/80"
                            )}>
                              {item.user_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                {item.user_name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {item.client_name !== '—' ? item.client_name : (item.installation_id?.substring(0, 14) + '...')}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Email */}
                        <td className="py-3 px-4">
                          {item.user_email ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-600 font-mono">
                                {item.user_email}
                              </span>
                              <button
                                onClick={() => handleCopyEmail(item.user_email)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
                                title="Copy email address"
                              >
                                {copiedEmail === item.user_email ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Unlinked Device</span>
                          )}
                        </td>

                        {/* 3. Platform Badge */}
                        <td className="py-3 px-4">
                          {isIos && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                              <Apple className="w-3 h-3" />
                              iOS (iPhone)
                            </span>
                          )}
                          {isAndroid && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              <Smartphone className="w-3 h-3" />
                              Android
                            </span>
                          )}
                          {isWeb && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                              <Globe className="w-3 h-3" />
                              Web Portal
                            </span>
                          )}
                        </td>

                        {/* 4. Device & OS Version */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 text-xs">
                            {item.device_model}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.os_version}
                          </div>
                        </td>

                        {/* 5. App Version */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            v{item.app_version.replace(/^v/, '')}
                          </span>
                        </td>

                        {/* 6. Installed Date & Time */}
                        <td className="py-3 px-4">
                          <div className="text-xs font-semibold text-slate-800">
                            {formatDateTime(item.installed_at)}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(item.installed_at)}
                          </div>
                        </td>

                        {/* 7. Uninstalled / Last Active */}
                        <td className="py-3 px-4">
                          {isUninstalled ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                                <Trash2 className="w-3 h-3" />
                                {formatDateTime(item.uninstalled_at)}
                              </span>
                              {item.uninstall_reason && (
                                <div className="text-[10px] text-red-600/80 mt-0.5 truncate max-w-[140px]" title={item.uninstall_reason}>
                                  {item.uninstall_reason}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active {formatRelativeTime(item.last_active_at)}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {formatDateTime(item.last_active_at)}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 8. Status */}
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                              isUninstalled
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isUninstalled ? "bg-red-500" : "bg-emerald-500"
                              )}
                            />
                            {item.status}
                          </span>
                        </td>

                        {/* 9. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(item)}
                              disabled={togglingId === (item.installation_id || item.id)}
                              className={cn(
                                "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all",
                                isUninstalled
                                  ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
                                togglingId === (item.installation_id || item.id) && "opacity-50"
                              )}
                              title={isUninstalled ? "Restore to Active Installed device" : "Mark as Uninstalled device"}
                            >
                              {togglingId === (item.installation_id || item.id)
                                ? "Saving..."
                                : isUninstalled ? "Mark Active" : "Mark Uninstalled"}
                            </button>

                            {item.client_id && (
                              <Link
                                href={`/admin/clients/${item.client_id}`}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                                title="View client directory profile"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {data.pagination && data.pagination.total_pages > 1 && (
            <div className="p-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
              <div>
                Showing <span className="font-bold text-slate-900">{data.installations.length}</span> of{' '}
                <span className="font-bold text-slate-900">{data.pagination.total_count}</span> installation records
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.pagination.page <= 1}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <span className="font-mono px-2 font-bold">
                  {data.pagination.page} / {data.pagination.total_pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.total_pages, p + 1))}
                  disabled={data.pagination.page >= data.pagination.total_pages}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

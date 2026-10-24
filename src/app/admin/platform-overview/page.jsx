'use client';

import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, Globe, Smartphone, Apple, CheckCircle2, XCircle,
  Search, RefreshCw, Download, Filter, ArrowUpDown, ChevronLeft,
  ChevronRight, Laptop, Monitor, AlertCircle, ExternalLink,
  Copy, Check, ShieldCheck, Activity, Clock, Layers, Sparkles
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function ClientPlatformOverviewPage() {
  const router = useRouter();

  // Data states
  const [data, setData] = useState({
    summary: {
      total_clients: 0,
      web_clients: 0,
      android_clients: 0,
      ios_clients: 0,
      mobile_clients: 0,
      mobile_adoption_pct: 0,
      active_clients: 0,
      inactive_clients: 0,
      uninstalled_clients: 0,
    },
    distribution: {
      web: { count: 0, percentage: 0, label: 'Web Clients' },
      android: { count: 0, percentage: 0, label: 'Android App' },
      ios: { count: 0, percentage: 0, label: 'iOS / iPhone App' },
    },
    clients: [],
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

  // Filter & Search states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL'); // ALL, WEB, ANDROID, IOS
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL'); // ALL, TODAY, 7D, 30D, 90D
  const [sortBy, setSortBy] = useState('-last_active_at');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const abortControllerRef = useRef(null);

  // Debounce search with snappy 150ms interval
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch telemetry data from backend
  const fetchData = useCallback(async (manual = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (manual) setIsRefreshing(true);
      else if (loading) setLoading(true);

      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await axios.get(`${API_BASE_URL}/api/admin/client-platform-overview/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: debouncedSearch,
          platform: platformFilter,
          status: statusFilter,
          date_range: dateRangeFilter,
          sort_by: sortBy,
          page,
          page_size: pageSize,
          refresh: manual ? 'true' : undefined,
        },
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
      console.error('[ClientPlatformOverview] Fetch error:', err);
      setError(err.response?.data?.error || 'Unable to load client platform data. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, platformFilter, statusFilter, dateRangeFilter, sortBy, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Copy email to clipboard
  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export visible data to CSV
  const handleExportCSV = () => {
    if (!data.clients || data.clients.length === 0) return;
    const headers = ['Business Name', 'Owner Name', 'Owner Email', 'Registration Platform', 'Device Model', 'OS Version', 'App Version', 'Last Active', 'Account Status', 'Is Uninstalled', 'Uninstalled At'];
    const rows = data.clients.map(c => [
      `"${c.business_name || ''}"`,
      `"${c.owner_name || ''}"`,
      `"${c.owner_email || ''}"`,
      `"${(c.registration_platform || c.primary_platform || 'web').toUpperCase()}"`,
      `"${c.primary_platform || ''}"`,
      `"${c.device_model || ''}"`,
      `"${c.os_version || ''}"`,
      `"${c.app_version || ''}"`,
      `"${c.last_active_at || ''}"`,
      `"${c.status || ''}"`,
      `"${c.is_uninstalled ? 'Yes' : 'No'}"`,
      `"${c.uninstalled_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uwo_client_platform_overview_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
    setDateRangeFilter('ALL');
    setSortBy('-last_active_at');
    setPage(1);
  };

  const hasActiveFilters = searchInput !== '' || platformFilter !== 'ALL' || statusFilter !== 'ALL' || dateRangeFilter !== 'ALL';

  // Format relative time helper
  const formatLastActive = (isoString) => {
    if (!isoString) return 'Never';
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-full min-h-screen font-sans">
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Client Platform Overview
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live Telemetry
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Real-time client platform footprint, device telemetry, and multi-platform analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {lastUpdated && (
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
              title="Refresh telemetry metrics"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-emerald-600")} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!data.clients || data.clients.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Error Notification ── */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => fetchData(true)} className="text-xs font-bold underline hover:text-red-900">
              Retry
            </button>
          </div>
        )}

        {/* ── 1. KPI Summary Cards (4 Cards) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total Registered Clients */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Clients</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : data.summary.total_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Registered unique organizations</p>
            </div>
          </div>

          {/* Card 2: Active Accounts */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Accounts</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {loading ? '...' : data.summary.active_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Active operational status</p>
            </div>
          </div>

          {/* Card 3: Inactive / Suspended */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inactive Accounts</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-2xs">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-600 tracking-tight">
                {loading ? '...' : data.summary.inactive_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Pending, suspended or inactive</p>
            </div>
          </div>

          {/* Card 4: Mobile App Adoption */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Mobile Adoption</span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-2xs">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {loading ? '...' : (data.summary.mobile_clients ?? (data.summary.android_clients + data.summary.ios_clients))}
                </span>
                <span className="text-xs font-bold text-violet-600">
                  ({data.summary.mobile_adoption_pct || 0}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Clients with Android / iOS mobile</p>
            </div>
          </div>
        </div>

        {/* ── 2. Platform Distribution Visual Section ── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Platform Distribution & User Footprint
              </h2>
              <p className="text-xs text-slate-500">
                Exact counts and real-time usage share across Web, Android, and iOS clients. Click any card below to filter table.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span className="text-slate-700">Web ({data.distribution.web.percentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-700">Android ({data.distribution.android.percentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
                <span className="text-slate-700">iOS ({data.distribution.ios.percentage}%)</span>
              </div>
            </div>
          </div>

          {/* Stacked Proportional Distribution Bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {data.distribution.web.count > 0 && (
              <div
                style={{ width: `${data.distribution.web.share_pct || data.distribution.web.percentage}%` }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 relative group cursor-pointer"
                title={`Web: ${data.distribution.web.count} clients (${data.distribution.web.percentage}% adoption)`}
              />
            )}
            {data.distribution.android.count > 0 && (
              <div
                style={{ width: `${data.distribution.android.share_pct || data.distribution.android.percentage}%` }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 relative group cursor-pointer"
                title={`Android: ${data.distribution.android.count} clients (${data.distribution.android.percentage}% adoption)`}
              />
            )}
            {data.distribution.ios.count > 0 && (
              <div
                style={{ width: `${data.distribution.ios.share_pct || data.distribution.ios.percentage}%` }}
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-500 relative group cursor-pointer"
                title={`iOS: ${data.distribution.ios.count} clients (${data.distribution.ios.percentage}% adoption)`}
              />
            )}
          </div>

          {/* Detailed Platform Cards Grid (Interactive Filters) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Web Card */}
            <div
              onClick={() => {
                setPlatformFilter(prev => prev === 'WEB' ? 'ALL' : 'WEB');
                setPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none group",
                platformFilter === 'WEB'
                  ? "border-blue-500 bg-blue-50/90 ring-2 ring-blue-400/40 shadow-sm"
                  : "border-blue-100 bg-blue-50/40 hover:bg-blue-50/70 hover:border-blue-300"
              )}
              title="Click to filter clients by Web platform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    Web Portal & PWA
                    {platformFilter === 'WEB' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white rounded-md font-semibold">Filtered</span>
                    )}
                  </div>
                  <div className="text-[11px] text-blue-700/80">Desktop, Chrome, Safari, Edge</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-blue-900">{data.distribution.web.count}</div>
                <div className="text-[11px] font-bold text-blue-600">{data.distribution.web.percentage}% of clients</div>
              </div>
            </div>

            {/* Android Card */}
            <div
              onClick={() => {
                setPlatformFilter(prev => prev === 'ANDROID' ? 'ALL' : 'ANDROID');
                setPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none group",
                platformFilter === 'ANDROID'
                  ? "border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-400/40 shadow-sm"
                  : "border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50/70 hover:border-emerald-300"
              )}
              title="Click to filter clients by Android platform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    Android App
                    {platformFilter === 'ANDROID' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-md font-semibold">Filtered</span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-700/80">Google Play Store & APK</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-emerald-900">{data.distribution.android.count}</div>
                <div className="text-[11px] font-bold text-emerald-600">{data.distribution.android.percentage}% of clients</div>
              </div>
            </div>

            {/* iOS Card */}
            <div
              onClick={() => {
                setPlatformFilter(prev => prev === 'IOS' ? 'ALL' : 'IOS');
                setPage(1);
              }}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none group",
                platformFilter === 'IOS'
                  ? "border-sky-500 bg-sky-50/90 ring-2 ring-sky-400/40 shadow-sm"
                  : "border-sky-100 bg-sky-50/40 hover:bg-sky-50/70 hover:border-sky-300"
              )}
              title="Click to filter clients by iOS platform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    iOS / iPhone App
                    {platformFilter === 'IOS' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-sky-600 text-white rounded-md font-semibold">Filtered</span>
                    )}
                  </div>
                  <div className="text-[11px] text-sky-700/80">Apple App Store & TestFlight</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-sky-900">{data.distribution.ios.count}</div>
                <div className="text-[11px] font-bold text-sky-600">{data.distribution.ios.percentage}% of clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Filters & Search Toolbar ── */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by client name, owner email, device, or OS..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <span className="px-2 text-[11px] text-slate-400 uppercase tracking-wider font-bold">Status:</span>
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'ACTIVE', label: 'Active' },
                  { key: 'INACTIVE', label: 'Inactive' },
                  { key: 'UNINSTALLED', label: 'Uninstalled' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5",
                      statusFilter === tab.key
                        ? tab.key === 'UNINSTALLED'
                          ? "bg-rose-500 text-white shadow-xs font-bold"
                          : "bg-white text-slate-900 shadow-xs font-bold"
                        : "hover:text-slate-900"
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.key === 'UNINSTALLED' && data.summary?.uninstalled_clients > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-black",
                        statusFilter === 'UNINSTALLED'
                          ? "bg-white text-rose-600"
                          : "bg-rose-100 text-rose-700"
                      )}>
                        {data.summary.uninstalled_clients}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Platform Filter indicator if filtered via top cards */}
              {platformFilter !== 'ALL' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-white shadow-xs">
                  <span>Platform: {platformFilter === 'WEB' ? 'Web' : platformFilter === 'ANDROID' ? 'Android' : 'iOS'}</span>
                  <button
                    onClick={() => { setPlatformFilter('ALL'); setPage(1); }}
                    className="hover:text-rose-300 ml-0.5 text-xs font-bold"
                    title="Clear platform filter"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Date Activity Filter */}
              <select
                value={dateRangeFilter}
                onChange={(e) => { setDateRangeFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border-none rounded-xl text-slate-700 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                <option value="ALL">All Activity</option>
                <option value="TODAY">Active Today</option>
                <option value="7D">Active Last 7 Days</option>
                <option value="30D">Active Last 30 Days</option>
                <option value="90D">Active Last 90 Days</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-all"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 4. Client Details Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Client / Business Name</th>
                  <th className="py-3.5 px-4">Owner / Email</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Device & OS Version</th>
                  <th className="py-3.5 px-4">App Version</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && data.clients.length === 0 ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-200" />
                          <div className="space-y-1.5">
                            <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
                            <div className="w-16 h-2.5 bg-slate-100 rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-32 h-3.5 bg-slate-200 rounded-md mb-1" />
                        <div className="w-20 h-2.5 bg-slate-100 rounded-md" />
                      </td>
                      <td className="py-4 px-4"><div className="w-16 h-5 bg-slate-200 rounded-full" /></td>
                      <td className="py-4 px-4"><div className="w-24 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-4 px-4"><div className="w-12 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-4 px-4"><div className="w-16 h-3.5 bg-slate-200 rounded-md" /></td>
                      <td className="py-4 px-4"><div className="w-14 h-5 bg-slate-200 rounded-full" /></td>
                      <td className="py-4 px-4 text-right"><div className="w-8 h-8 bg-slate-200 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : data.clients.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">No client platform records found</h3>
                        <p className="text-xs text-slate-500">
                          {hasActiveFilters
                            ? "No clients match your selected filters. Try clearing filters or searching for another keyword."
                            : "No client telemetry records have been registered yet."}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.clients.map((client) => {
                    const regPlatform = (client.registration_platform || client.primary_platform || (client.platforms && client.platforms[0]) || 'web').toLowerCase();
                    const isIos = regPlatform === 'ios';
                    const isAndroid = regPlatform === 'android';
                    const isWeb = regPlatform === 'web';

                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* 1. Client / Business Name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                              {client.business_name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {client.business_name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                ID: {client.id?.substring(0, 10)}...
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Owner / Email */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 text-xs">
                            {client.owner_name || '—'}
                          </div>
                          {client.owner_email ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[11px] text-slate-500 font-mono">
                                {client.owner_email}
                              </span>
                              <button
                                onClick={() => handleCopyEmail(client.owner_email)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-sm"
                                title="Copy email address"
                              >
                                {copiedEmail === client.owner_email ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">No email</span>
                          )}
                        </td>

                        {/* 3. Platform Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isIos && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                                <Apple className="w-3 h-3" />
                                iOS
                              </span>
                            )}
                            {isAndroid && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                <Smartphone className="w-3 h-3" />
                                Android
                              </span>
                            )}
                            {isWeb && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                                <Globe className="w-3 h-3" />
                                Web
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Device & OS Version */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                            {client.device_model || 'Unknown Device'}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {client.os_version || 'N/A'}
                          </div>
                        </td>

                        {/* 5. App Version */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {client.app_version || 'v1.0.0'}
                          </span>
                        </td>

                        {/* 6. Last Active */}
                        <td className="py-3.5 px-4">
                          <div
                            className="text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-help"
                            title={client.last_active_at ? new Date(client.last_active_at).toLocaleString() : 'Never'}
                          >
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatLastActive(client.last_active_at)}
                          </div>
                          {client.last_active_at && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(client.last_active_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </td>

                        {/* 7. Account Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            {client.is_uninstalled ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                UNINSTALLED
                              </span>
                            ) : (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                                  client.status === 'ACTIVE'
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : client.status === 'PENDING'
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    client.status === 'ACTIVE' ? "bg-emerald-500" : client.status === 'PENDING' ? "bg-amber-500" : "bg-red-500"
                                  )}
                                />
                                {client.status || 'UNKNOWN'}
                              </span>
                            )}
                            {client.is_uninstalled && client.uninstalled_at && (
                              <span className="text-[10px] text-rose-600 font-medium">
                                {new Date(client.uninstalled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-all"
                            title="View full client details in Client Directory"
                          >
                            <span>Manage</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
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
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
              <div>
                Showing <span className="font-bold text-slate-900">{data.clients.length}</span> of{' '}
                <span className="font-bold text-slate-900">{data.pagination.total_count}</span> clients
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

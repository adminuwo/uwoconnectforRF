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
      active_clients: 0,
      inactive_clients: 0,
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

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
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
    const headers = ['Business Name', 'Owner Name', 'Owner Email', 'Platforms', 'Primary Platform', 'Device Model', 'OS Version', 'App Version', 'Last Active', 'Account Status'];
    const rows = data.clients.map(c => [
      `"${c.business_name || ''}"`,
      `"${c.owner_name || ''}"`,
      `"${c.owner_email || ''}"`,
      `"${(c.platforms || []).join(', ')}"`,
      `"${c.primary_platform || ''}"`,
      `"${c.device_model || ''}"`,
      `"${c.os_version || ''}"`,
      `"${c.app_version || ''}"`,
      `"${c.last_active_at || ''}"`,
      `"${c.status || ''}"`,
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
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

        {/* ── 1. Platform Summary Cards (6 Cards) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* Card 1: Total Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Clients</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : data.summary.total_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Registered unique clients</p>
            </div>
          </div>

          {/* Card 2: Web Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Web Clients</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-all">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.web_clients}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  ({data.distribution.web.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Web / Desktop Portal</p>
            </div>
          </div>

          {/* Card 3: Android Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Android Clients</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-all">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.android_clients}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  ({data.distribution.android.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Android Native App</p>
            </div>
          </div>

          {/* Card 4: iOS Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">iOS Clients</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-100 transition-all">
                <Apple className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {loading ? '...' : data.summary.ios_clients}
                </span>
                <span className="text-xs font-bold text-sky-600">
                  ({data.distribution.ios.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Apple iPhone & iPad</p>
            </div>
          </div>

          {/* Card 5: Active Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Clients</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {loading ? '...' : data.summary.active_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Active account status</p>
            </div>
          </div>

          {/* Card 6: Inactive Clients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inactive Clients</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-600 tracking-tight">
                {loading ? '...' : data.summary.inactive_clients}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Pending or suspended</p>
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
                Exact counts and real-time usage share across Web, Android, and iOS clients.
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
            {data.distribution.web.percentage > 0 && (
              <div
                style={{ width: `${Math.max(5, data.distribution.web.percentage)}%` }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 relative group cursor-pointer"
                title={`Web: ${data.distribution.web.count} clients (${data.distribution.web.percentage}%)`}
              />
            )}
            {data.distribution.android.percentage > 0 && (
              <div
                style={{ width: `${Math.max(5, data.distribution.android.percentage)}%` }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 relative group cursor-pointer"
                title={`Android: ${data.distribution.android.count} clients (${data.distribution.android.percentage}%)`}
              />
            )}
            {data.distribution.ios.percentage > 0 && (
              <div
                style={{ width: `${Math.max(5, data.distribution.ios.percentage)}%` }}
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-500 relative group cursor-pointer"
                title={`iOS: ${data.distribution.ios.count} clients (${data.distribution.ios.percentage}%)`}
              />
            )}
          </div>

          {/* Detailed Platform Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Web Portal & PWA</div>
                  <div className="text-xs text-blue-700/80">Desktop, Chrome, Safari, Edge</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-900">{data.distribution.web.count}</div>
                <div className="text-[11px] font-bold text-blue-600">{data.distribution.web.percentage}% of clients</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">Android App</div>
                  <div className="text-xs text-emerald-700/80">Google Play Store & APK</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-900">{data.distribution.android.count}</div>
                <div className="text-[11px] font-bold text-emerald-600">{data.distribution.android.percentage}% of clients</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-900">iOS / iPhone App</div>
                  <div className="text-xs text-sky-700/80">Apple App Store & TestFlight</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-sky-900">{data.distribution.ios.count}</div>
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
              {/* Platform Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <span className="px-2 text-[11px] text-slate-400 uppercase tracking-wider font-bold">Platform:</span>
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'WEB', label: 'Web' },
                  { key: 'ANDROID', label: 'Android' },
                  { key: 'IOS', label: 'iOS' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setPlatformFilter(tab.key); setPage(1); }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-all",
                      platformFilter === tab.key
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <span className="px-2 text-[11px] text-slate-400 uppercase tracking-wider font-bold">Status:</span>
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'ACTIVE', label: 'Active' },
                  { key: 'INACTIVE', label: 'Inactive' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-all",
                      statusFilter === tab.key
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

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
                    const platforms = client.platforms || [];
                    const isIos = platforms.includes('ios');
                    const isAndroid = platforms.includes('android');
                    const isWeb = platforms.includes('web');

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

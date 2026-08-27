'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Zap, TrendingUp, ArrowUpRight, ArrowDownRight,
  ShieldCheck, ShieldAlert, Activity, Target, ChevronRight,
  Loader2, GitBranch, MessageSquare, Brain, ShoppingBag,
  Receipt, FileCheck, FileText, Mail, PhoneCall, RefreshCw,
  Search, CheckCircle2, Clock, DollarSign, Bot, Globe,
  User, ExternalLink, Layers, Sparkles, Filter, ArrowUpDown, Smartphone, Share2
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function SuperAdminOverview() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [compSearch, setCompSearch] = useState('');
  const [compSortKey, setCompSortKey] = useState('messages');
  const [compSortOrder, setCompSortOrder] = useState('desc');

  const [intelStats, setIntelStats] = useState(null);

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const [resOverview, resIntel] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/admin/overview/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/admin/client-intelligence/stats/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resOverview.status === 'fulfilled') {
        setData(resOverview.value.data);
      } else {
        console.error('Overview API failed:', resOverview.reason);
        setError(resOverview.reason?.response?.data?.detail || resOverview.reason?.message || 'Failed to fetch overview data.');
      }
      
      if (resIntel.status === 'fulfilled') {
        setIntelStats(resIntel.value.data);
      } else {
        console.error('Intel Stats API failed:', resIntel.reason);
      }
    } catch (err) {
      console.error('Failed to fetch super admin overview', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpis = data?.kpis || {};
  const clientComparison = data?.clientComparison || [];
  const recentActivity = data?.recentActivity || [];
  const recentLogins = data?.recentLogins || [];

  const approvalData = intelStats?.approvalStatus || {
    total: kpis.totalClients || 0,
    approved: kpis.activeClients || 0,
    pending: 0,
    rejected: 0,
    approvedPercentage: 100,
    pendingPercentage: 0,
    rejectedPercentage: 0
  };

  const overviewData = intelStats?.overview || {
    totalClients: kpis.totalClients || 0,
    activeClients: kpis.activeClients || 0,
    inactiveClients: 0
  };

  const rowMetrics = intelStats?.rowMetrics || {};

  const mainKpis = [
    { name: 'Total Team Members', value: rowMetrics.totalTeamMembers ?? (kpis.totalTeamMembers ?? 0), sub: 'Across workspaces', icon: Users, href: '/admin/team' },
    { name: 'Channels Active', value: kpis.activeChannels ?? 0, sub: `${kpis.totalChannels ?? 0} configured`, icon: Globe, href: '/admin/channels' },
    { name: 'Total Messages', value: (kpis.totalMessages ?? 0).toLocaleString(), sub: `${kpis.botMessages ?? 0} bot handled`, icon: MessageSquare, href: '/admin/inbox' },
    { name: 'Active AI Bots', value: kpis.activeBots ?? 0, sub: `${kpis.humanTakeoverCount ?? 0} handoffs`, icon: Bot, href: '/admin/ai' },
    { name: 'Total Invoices', value: kpis.totalInvoices ?? (rowMetrics.totalInvoices ?? 0), sub: `₹${(kpis.totalInvoiceValue || rowMetrics.totalRevenue || 0).toLocaleString()}`, icon: Receipt, href: '/admin/invoices' },
    { name: 'Active Projects', value: rowMetrics.activeProjects ?? (kpis.activeProjects ?? 0), sub: `${rowMetrics.totalProjects ?? (kpis.totalProjects ?? 0)} total`, icon: Layers, href: '/admin/team' },
  ];

  const handleSort = (key) => {
    if (compSortKey === key) {
      setCompSortOrder(compSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setCompSortKey(key);
      setCompSortOrder('desc');
    }
  };

  const sortedClients = [...clientComparison]
    .filter(c => {
      return !compSearch || c.company_name?.toLowerCase().includes(compSearch.toLowerCase()) ||
             c.client_name?.toLowerCase().includes(compSearch.toLowerCase());
    })
    .sort((a, b) => {
      let valA = a[compSortKey];
      let valB = b[compSortKey];
      if (typeof valA === 'string') {
        return compSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return compSortOrder === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

  if (loading && !data) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-full py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#059669]" size={36} />
          <p className="text-xs font-semibold text-slate-400">Loading Control Center...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !data) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-full py-32 flex flex-col items-center justify-center gap-3">
          <ShieldAlert className="text-rose-500" size={48} />
          <p className="text-sm font-bold text-slate-800">Failed to load dashboard</p>
          <p className="text-xs font-medium text-slate-500">{error}</p>
          <button 
            onClick={() => fetchData(true)}
            className="mt-4 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-20 px-3.5 sm:px-6 lg:px-10 font-sans w-full min-w-0">
        
        {/* ── Clean Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 my-6 sm:my-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Control Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Multi-client monitoring, messaging volume, active channels, and business telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              href="/admin/clients"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all whitespace-nowrap"
            >
              <Users size={15} /> Clients Directory
            </Link>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2 sm:p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Refresh"
            >
              <RefreshCw size={15} className={cn(refreshing && "animate-spin text-[#059669]")} />
            </button>
          </div>
        </div>

        {/* ── 1. Admin Overview — Client Summary (Interactive & Clickable) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Clients Card */}
          <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-600" />
                Client Summary
              </span>
              <Link
                href="/admin/clients"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={13} />
              </Link>
            </div>
            
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {overviewData.totalClients}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Total Registered Clients</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {overviewData.activeClients} Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 border-t border-slate-100 text-center">
              <Link href="/admin/clients?status=ACTIVE" className="p-2 rounded-xl hover:bg-slate-50 transition-all">
                <div className="text-xs font-bold text-slate-900">{overviewData.activeClients}</div>
                <div className="text-[10px] text-slate-400 font-medium">Active</div>
              </Link>
              <Link href="/admin/clients?status=TRIAL" className="p-2 rounded-xl hover:bg-slate-50 transition-all">
                <div className="text-xs font-bold text-slate-900">{overviewData.trialClients || 0}</div>
                <div className="text-[10px] text-slate-400 font-medium">Trial</div>
              </Link>
              <Link href="/admin/clients?status=SUSPENDED" className="p-2 rounded-xl hover:bg-slate-50 transition-all">
                <div className="text-xs font-bold text-slate-900">{overviewData.suspendedClients || 0}</div>
                <div className="text-[10px] text-slate-400 font-medium">Suspended</div>
              </Link>
            </div>
          </div>

          {/* Approval Status Distribution Card */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Approval Status Distribution
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {approvalData.total} Total Registered
                </span>
              </div>

              {/* Status Visual Distribution Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex gap-0.5 mb-4 p-0.5">
                <div 
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-500" 
                  style={{ width: `${Math.max(4, approvalData.approvedPercentage || 0)}%` }} 
                  title={`Approved: ${approvalData.approved} (${approvalData.approvedPercentage}%)`}
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.max(approvalData.pending > 0 ? 4 : 0, approvalData.pendingPercentage || 0)}%` }} 
                  title={`Pending: ${approvalData.pending} (${approvalData.pendingPercentage}%)`}
                />
                <div 
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-500" 
                  style={{ width: `${Math.max(approvalData.rejected > 0 ? 4 : 0, approvalData.rejectedPercentage || 0)}%` }} 
                  title={`Rejected: ${approvalData.rejected} (${approvalData.rejectedPercentage}%)`}
                />
              </div>
            </div>

            {/* Clickable Filter Tiles */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Approved */}
              <Link
                href="/admin/clients?approval=APPROVED"
                className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 transition-all flex items-center justify-between group min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-800 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">Approved</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-emerald-950 mt-0.5 sm:mt-1">{approvalData.approved}</div>
                </div>
                <ChevronRight size={15} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block" />
              </Link>

              {/* Pending */}
              <Link
                href="/admin/clients?approval=PENDING"
                className="p-2.5 sm:p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 transition-all flex items-center justify-between group min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-800 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                    <span className="truncate">Pending</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-amber-950 mt-0.5 sm:mt-1">{approvalData.pending}</div>
                </div>
                <ChevronRight size={15} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block" />
              </Link>

              {/* Rejected */}
              <Link
                href="/admin/clients?approval=REJECTED"
                className="p-2.5 sm:p-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 transition-all flex items-center justify-between group min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-rose-800 truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate">Rejected</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-rose-950 mt-0.5 sm:mt-1">{approvalData.rejected}</div>
                </div>
                <ChevronRight size={15} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main Clean KPI Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {mainKpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={idx}
                href={kpi.href}
                className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between min-w-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate pr-1">{kpi.name}</span>
                  <Icon size={14} className="text-slate-400 shrink-0" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">{kpi.value}</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">{kpi.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Clean Client Comparison Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Client Comparison</h3>
              <p className="text-xs text-slate-400">Benchmark clients across channels, messages, bot usage, and projects.</p>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search clients..."
                value={compSearch}
                onChange={(e) => setCompSearch(e.target.value)}
                className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-[#059669]"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('company_name')}>Client</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('channels')}>Channels</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('messages')}>Messages</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('bot_usage_pct')}>Bot %</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('emails')}>Emails</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('invoices')}>Invoices</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('projects')}>Projects</th>
                  <th className="py-3 px-3 text-center cursor-pointer" onClick={() => handleSort('progress')}>Progress</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {sortedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/clients/${client.id}`)}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{client.company_name}</p>
                      <span className="text-[10px] text-slate-400">{client.plan}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-800">{client.channels}</td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-800">{client.messages.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">
                        {client.bot_usage_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700">{client.emails}</td>
                    <td className="py-3.5 px-3 text-center text-slate-700">₹{client.total_invoiced.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-center text-slate-700">{client.projects}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="text-[10px] font-bold text-slate-700">{client.progress}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-xs font-bold text-[#059669] hover:underline">View Details &rarr;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Two Column Bottom Feeds ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Live Platform Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Live Platform Feed</h3>
            <p className="text-xs text-slate-400 mb-4">Real-time messaging, invoices, and audit actions.</p>
            <div className="space-y-2.5">
              {recentActivity.slice(0, 5).map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2.5 text-xs hover:bg-slate-100/50 transition-colors min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 truncate max-w-[160px] sm:max-w-none">{act.client_name}</span>
                      <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-semibold shrink-0">{act.type}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate">{act.title}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                    <Clock size={11} className="shrink-0" />
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-xs text-slate-400 italic py-6 text-center">No platform activity yet.</p>
              )}
            </div>
          </div>

          {/* Recent Logins Feed (Mobile-Optimized Layout) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Recent User Logins</h3>
            <p className="text-xs text-slate-400 mb-4">Track who logged in and when across client workspaces.</p>
            <div className="space-y-2.5">
              {recentLogins.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl flex items-start sm:items-center justify-between gap-2.5 text-xs hover:bg-slate-100/50 transition-colors min-w-0">
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-100/30 shrink-0 mt-0.5 sm:mt-0">
                      <User size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 truncate max-w-[160px] sm:max-w-[220px]">{log.username}</span>
                        <span className={cn(
                          "px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider border shrink-0",
                          log.action === 'LOGIN' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {log.action}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[10px] font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="truncate max-w-[180px] sm:max-w-none">
                          Workspace: <strong className="text-slate-700 font-bold">{log.client_name}</strong>
                        </span>
                        {log.ip_address && (
                          <span className="text-slate-500 font-mono text-[9px] bg-slate-200/70 px-1.5 py-0.2 rounded shrink-0 truncate max-w-[150px] sm:max-w-none" title={log.ip_address}>
                            IP: {log.ip_address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0 self-start sm:self-center mt-0.5 sm:mt-0">
                    <Clock size={11} className="shrink-0" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {recentLogins.length === 0 && (
                <p className="text-xs text-slate-400 italic py-6 text-center">No user login records found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

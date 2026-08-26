'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, Search, Plus, Trash2, Mail, ShieldCheck, Loader2,
  ChevronRight, Activity, Power, X, Globe, Smartphone,
  MoreVertical, MessageSquare, Eye, ExternalLink, CheckCircle2,
  XCircle, Clock, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon,
  Layers, Bot, Receipt, FileText, Share2, Key, EyeOff, Download,
  Filter, ArrowUpDown, UserPlus, FolderPlus, DollarSign, Brain, ShoppingBag,
  Sliders, AlertCircle, Phone, Check, ArrowRight, RotateCcw
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ClientHealthBadge, AdminAddTeamMemberModal, AdminAssignProjectModal } from '@/components/admin/ClientIntelligenceComponents';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminClients() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial params from URL query (e.g. ?approval=PENDING)
  const initialApproval = searchParams.get('approval') || 'ALL';
  const initialStatus = searchParams.get('status') || 'ALL';

  const [clients, setClients] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // Search, Filter & Sort states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [approvalFilter, setApprovalFilter] = useState(initialApproval);
  const [planFilter, setPlanFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination (Default 25)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Actions
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [clientForPassword, setClientForPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Client form
  const [clientFormData, setClientFormData] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    plan: 'GROWTH'
  });

  // Active request controller ref for cancellation
  const abortControllerRef = useRef(null);

  // 1. Debounce Search Input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 2. High-Performance Unified Fetch with Request Cancellation
  const fetchClientDirectory = useCallback(async (isManualRefresh = false) => {
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isManualRefresh) setIsFetching(true);
      else if (clients.length === 0) setLoading(true);
      else setIsFetching(true);

      setError(null);
      const token = localStorage.getItem('token');

      const res = await axios.get(`${API_BASE_URL}/api/admin/clients/overview/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: debouncedSearch,
          status: statusFilter,
          approval: approvalFilter,
          plan: planFilter,
          sort_by: sortKey,
          sort_order: sortOrder,
          page: page,
          page_size: pageSize
        },
        signal: controller.signal
      });

      setClients(res.data.clients || res.data.results || []);
      const pagination = res.data.pagination || {};
      setTotalPages(pagination.total_pages || res.data.total_pages || 1);
      setTotalCount(pagination.total || res.data.total_count || 0);

      if (res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError' || err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      console.error('[AdminClients] Fetch error:', err);
      setError('Unable to load client data. Please check connection and retry.');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [debouncedSearch, statusFilter, approvalFilter, planFilter, sortKey, sortOrder, page, pageSize, summary]);

  useEffect(() => {
    fetchClientDirectory();
  }, [debouncedSearch, statusFilter, approvalFilter, planFilter, sortKey, sortOrder, page, pageSize]);

  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleClientAction = async (clientId, action, extraPayload = {}) => {
    try {
      setActionLoading(prev => ({ ...prev, [clientId]: true }));
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${clientId}/action/`,
        { action, ...extraPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClientDirectory(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [clientId]: false }));
      setActiveMenuId(null);
    }
  };

  const handleOpenClientWorkspace = async (client) => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('user');

      localStorage.setItem('admin_backup_token', token);
      localStorage.setItem('admin_backup_user', currentUser);

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/impersonate/`,
        { client_id: client.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.access) {
        localStorage.setItem('token', res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('impersonation_session', JSON.stringify({
          client_id: client.id,
          client_name: client.business_name || client.client_name,
          admin_name: res.data.impersonating?.impersonator_name || 'Admin'
        }));

        window.location.href = '/client';
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open client workspace.');
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/clients/`, clientFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddClientModalOpen(false);
      setClientFormData({ business_name: '', email: '', phone_number: '', plan: 'GROWTH' });
      fetchClientDirectory(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register client.');
    }
  };

  const handleExportCSV = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_BASE_URL}/api/admin/client-intelligence/export/?token=${token}`, '_blank');
  };

  const approvalStats = summary || {
    totalClients: totalCount,
    approved: totalCount,
    pending: 0,
    rejected: 0
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-24 px-4 sm:px-10 lg:px-12 font-sans" onClick={() => setActiveMenuId(null)}>
        
        {/* ── 1. Page Header & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Client Approvals & Directory
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                {totalCount} Total
              </span>
              {(loading || isFetching) && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                  <Loader2 size={11} className="animate-spin text-emerald-600" /> Fetching data...
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review client registrations, approve or reject access requests, and manage active workspaces.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Download size={14} className="text-slate-500" /> Export CSV
            </button>
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Plus size={15} /> Add New Client
            </button>
            <button
              onClick={() => fetchClientDirectory(true)}
              disabled={isFetching}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} className={cn(isFetching && "animate-spin text-emerald-600")} />
            </button>
          </div>
        </div>

        {/* ── 2. Sleek Status Tabs (Zero Clutter, Instant Filter) ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => { setApprovalFilter('ALL'); setPage(1); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs whitespace-nowrap",
              approvalFilter === 'ALL'
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 hover:text-slate-900 border-slate-200/80 hover:bg-slate-50"
            )}
          >
            <Users size={14} />
            <span>All Clients</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'ALL' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            )}>
              {approvalStats.totalClients ?? totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setApprovalFilter('APPROVED'); setPage(1); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs whitespace-nowrap",
              approvalFilter === 'APPROVED'
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 hover:text-emerald-700 border-slate-200/80 hover:bg-emerald-50/50"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Approved</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'APPROVED' ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
            )}>
              {approvalStats.approved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setApprovalFilter('PENDING'); setPage(1); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs whitespace-nowrap",
              approvalFilter === 'PENDING'
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-slate-600 hover:text-amber-700 border-slate-200/80 hover:bg-amber-50/50"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Pending</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'PENDING' ? "bg-white/20 text-white" : "bg-amber-50 text-amber-700"
            )}>
              {approvalStats.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setApprovalFilter('REJECTED'); setPage(1); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs whitespace-nowrap",
              approvalFilter === 'REJECTED'
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-600 hover:text-rose-700 border-slate-200/80 hover:bg-rose-50/50"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Rejected</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'REJECTED' ? "bg-white/20 text-white" : "bg-rose-50 text-rose-700"
            )}>
              {approvalStats.rejected}
            </span>
          </button>
        </div>

        {/* ── 3. Clean Search & Filter Bar (Zero Redundancy) ── */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input with Debounce */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by client, business, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns (Only Unique Filters) */}
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="TRIAL">Trial</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="STARTER">Starter</option>
              <option value="GROWTH">Growth</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>

            {/* Reset Filters */}
            {(searchInput || statusFilter !== 'ALL' || approvalFilter !== 'ALL' || planFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setStatusFilter('ALL');
                  setApprovalFilter('ALL');
                  setPlanFilter('ALL');
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── 4. Main Enterprise Client Management Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-8 relative">
          {/* Sleek top indeterminate progress bar when fetching */}
          {isFetching && (
            <div className="h-1 w-full bg-emerald-50 overflow-hidden absolute top-0 left-0 right-0 z-20">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 animate-pulse" />
            </div>
          )}

          {error ? (
            <div className="py-12 px-4 text-center">
              <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">{error}</h3>
              <p className="text-xs text-slate-400 mt-1">Check your network connection and credentials.</p>
              <button
                onClick={() => fetchClientDirectory(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all"
              >
                <RotateCcw size={13} /> Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar min-h-[360px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-6 sticky left-0 bg-slate-50 z-10 cursor-pointer" onClick={() => handleSort('business_name')}>
                      <div className="flex items-center gap-1">
                        Client & Business
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 cursor-pointer" onClick={() => handleSort('approval_status')}>
                      <div className="flex items-center gap-1">
                        Approval Status
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 cursor-pointer" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-1">
                        Registered Date
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 text-right sticky right-0 bg-slate-50 z-10">Approval Decision & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {(loading || (isFetching && clients.length === 0)) ? (
                    // High-End Animated Loader State
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-3.5">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-14 h-14 rounded-2xl bg-emerald-500/15 animate-ping" />
                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-800 tracking-tight">Loading Clients...</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              Fetching client approval statuses and workspace records
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle size={28} className="text-slate-300" />
                          <p className="text-xs font-bold text-slate-600">No clients match your filter criteria.</p>
                          <button
                            onClick={() => { setSearchInput(''); setStatusFilter('ALL'); setApprovalFilter('ALL'); setPlanFilter('ALL'); }}
                            className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client, index) => {
                      const isMenuOpen = activeMenuId === client.id;
                      const isRowActionLoading = actionLoading[client.id];
                      const openUpward = index >= 2;

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* 1. Client & Business */}
                          <td className="py-4 px-6 sticky left-0 bg-white z-10 border-r border-slate-100">
                            <Link href={`/admin/clients/${client.id}`} className="flex items-center gap-3.5 group">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-sm uppercase border border-emerald-100 group-hover:scale-105 transition-transform shadow-2xs">
                                {client.business_name?.charAt(0) || 'C'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                                  {client.business_name}
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{client.client_name || client.email}</span>
                                  <span>•</span>
                                  <span className="uppercase text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{client.plan}</span>
                                  {client.phone_number && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-500">{client.phone_number}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </td>

                          {/* 2. Approval Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5 border shadow-2xs",
                              client.approval_status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              client.approval_status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-rose-50 text-rose-700 border-rose-200"
                            )}>
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                client.approval_status === 'APPROVED' ? "bg-emerald-500" :
                                client.approval_status === 'PENDING' ? "bg-amber-500 animate-pulse" :
                                "bg-rose-500"
                              )} />
                              {client.approval_status || 'APPROVED'}
                            </span>
                          </td>

                          {/* 3. Registered Date / Last Active */}
                          <td className="py-4 px-6 whitespace-nowrap text-slate-600 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400" />
                              <span>{client.created_date_formatted || client.last_activity_formatted || 'Recently'}</span>
                            </div>
                          </td>

                          {/* 4. Decision & Actions */}
                          <td className={cn(
                            "py-4 px-6 text-right sticky right-0 bg-white border-l border-slate-100",
                            isMenuOpen ? "z-30" : "z-10"
                          )}>
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              {/* Direct 1-Click Approval Decision */}
                              {client.approval_status === 'PENDING' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'APPROVED' })}
                                    disabled={isRowActionLoading}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'REJECTED' })}
                                    disabled={isRowActionLoading}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    <XCircle size={14} />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : client.approval_status === 'REJECTED' ? (
                                <button
                                  onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'APPROVED' })}
                                  disabled={isRowActionLoading}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                  <CheckCircle2 size={14} />
                                  <span>Re-Approve</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'REJECTED' })}
                                  disabled={isRowActionLoading}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
                                  title="Revoke access"
                                >
                                  <XCircle size={13} />
                                  <span>Revoke</span>
                                </button>
                              )}

                              {/* Secondary Options Menu */}
                              <div className="relative inline-block text-left">
                                <button
                                  onClick={() => setActiveMenuId(isMenuOpen ? null : client.id)}
                                  className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-all cursor-pointer"
                                  title="More options"
                                >
                                  <MoreVertical size={15} />
                                </button>

                                {isMenuOpen && (
                                  <div className={cn(
                                    "absolute right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 text-left text-xs",
                                    openUpward 
                                      ? "bottom-full mb-1.5 origin-bottom-right" 
                                      : "top-full mt-1.5 origin-top-right"
                                  )}>
                                    <Link
                                      href={`/admin/clients/${client.id}`}
                                      className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-semibold"
                                    >
                                      <Eye size={14} className="text-emerald-600" />
                                      360° Profile
                                    </Link>
                                    <button
                                      onClick={() => handleOpenClientWorkspace(client)}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-purple-50 text-purple-700 font-semibold"
                                    >
                                      <ExternalLink size={14} />
                                      Open Workspace
                                    </button>
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                      onClick={() => {
                                        setClientForPassword(client);
                                        setIsPasswordModalOpen(true);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                                    >
                                      <Key size={14} className="text-amber-500" />
                                      Change Password
                                    </button>
                                    <button
                                      onClick={() => {
                                        setClientToDelete(client);
                                        setIsDeleteModalOpen(true);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 font-semibold"
                                    >
                                      <Trash2 size={14} />
                                      Delete Client
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Table Footer & Server-Side Pagination ── */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-900">{clients.length}</span> of <span className="font-bold text-slate-900">{totalCount}</span> clients
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page <= 1 || isFetching}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-slate-800">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || isFetching}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Add Client Modal ── */}
        {isAddClientModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900">Register New Client</h3>
                <button onClick={() => setIsAddClientModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={clientFormData.business_name}
                    onChange={(e) => setClientFormData({ ...clientFormData, business_name: e.target.value })}
                    placeholder="Acme Technologies Pvt Ltd"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientFormData.email}
                    onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                    placeholder="admin@acme.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="text"
                    value={clientFormData.phone_number}
                    onChange={(e) => setClientFormData({ ...clientFormData, phone_number: e.target.value })}
                    placeholder="+919876543210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
                  <select
                    value={clientFormData.plan}
                    onChange={(e) => setClientFormData({ ...clientFormData, plan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  >
                    <option value="FREE">Free</option>
                    <option value="STARTER">Starter</option>
                    <option value="GROWTH">Growth</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddClientModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Change Password Modal ── */}
        {isPasswordModalOpen && clientForPassword && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-500">
                  Override password for <span className="font-bold text-slate-900">{clientForPassword.business_name}</span>.
                </p>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button onClick={() => setIsPasswordModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleClientAction(clientForPassword.id, 'CHANGE_PASSWORD', { new_password: newPassword });
                      setIsPasswordModalOpen(false);
                    }}
                    disabled={!newPassword}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                  >
                    Save Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Client Confirmation Modal ── */}
        {isDeleteModalOpen && clientToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
                <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                  <Trash2 size={16} className="text-rose-600" /> Confirm Deletion
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600">
                  Are you sure you want to permanently delete <span className="font-bold text-slate-900">{clientToDelete.business_name}</span>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleClientAction(clientToDelete.id, 'DELETE_CLIENT');
                      setIsDeleteModalOpen(false);
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

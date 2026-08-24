'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Globe, CheckCircle2, XCircle, Search, Loader2,
  ExternalLink, Layers, RefreshCw, MessageCircle,
  Mail, FolderOpen, Calendar, FileText, Database,
  AlertCircle, X, Phone, FileSpreadsheet, LayoutGrid,
  Table as TableIcon, Lock, ShieldCheck, ShieldAlert,
  Power, Check, Clock, Filter, Users, ChevronRight,
  SlidersHorizontal, CheckSquare, Square
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { CHANNEL_DEFINITIONS, GLOBAL_ACTIVE_CHANNELS } from '@/config/channelsConfig';

// Custom Brand Icons
const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function AdminChannelsPage() {
  const [activeMainTab, setActiveMainTab] = useState('matrix'); // 'matrix' | 'audit_logs'
  const [clients, setClients] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL'); // 'ALL' | 'whatsapp' | 'facebook' | 'instagram'
  
  // Selection & Bulk Actions
  const [selectedClientIds, setSelectedClientIds] = useState(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkActionConfig, setBulkActionConfig] = useState({
    channel: 'whatsapp',
    action: 'grant',
    notes: ''
  });
  const [bulkLoading, setBulkLoading] = useState(false);

  // Single Toggle Action State
  const [togglingClientChannel, setTogglingClientChannel] = useState(null); // 'clientId_channelKey'

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

  const fetchMatrix = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/matrix/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClients(res.data.clients || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      console.error('[AdminChannels] Error loading channel matrix:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingAuditLogs(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/audit-logs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(res.data.audit_logs || []);
    } catch (err) {
      console.error('[AdminChannels] Error loading audit logs:', err);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
    fetchAuditLogs();
  }, []);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = 
        c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        String(c.client_id).includes(search);

      if (!matchesSearch) return false;

      if (channelFilter === 'whatsapp') return c.channel_access?.whatsapp;
      if (channelFilter === 'facebook') return c.channel_access?.facebook;
      if (channelFilter === 'instagram') return c.channel_access?.instagram;

      return true;
    });
  }, [clients, search, channelFilter]);

  // Handle Single Toggle
  const handleToggleAccess = async (clientId, channelKey, currentVal) => {
    const toggleKey = `${clientId}_${channelKey}`;
    try {
      setTogglingClientChannel(toggleKey);
      const token = localStorage.getItem('token');
      const newVal = !currentVal;

      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/client/${clientId}/`, {
        channel: channelKey,
        enabled: newVal,
        notes: `Admin toggled ${channelKey} to ${newVal ? 'ENABLED' : 'DISABLED'} via Matrix`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistic update
      setClients(prev => prev.map(c => {
        if (c.client_id === clientId) {
          return {
            ...c,
            channel_access: {
              ...c.channel_access,
              [channelKey]: newVal
            }
          };
        }
        return c;
      }));

      // Refresh in background
      fetchAuditLogs();
    } catch (err) {
      console.error('Failed to toggle channel access:', err);
      alert(err?.response?.data?.error || 'Failed to update channel permission.');
      fetchMatrix();
    } finally {
      setTogglingClientChannel(null);
    }
  };

  // Handle Select All / Toggle Select
  const handleSelectAll = () => {
    if (selectedClientIds.size === filteredClients.length) {
      setSelectedClientIds(new Set());
    } else {
      setSelectedClientIds(new Set(filteredClients.map(c => c.client_id)));
    }
  };

  const handleToggleSelect = (clientId) => {
    const newSet = new Set(selectedClientIds);
    if (newSet.has(clientId)) newSet.delete(clientId);
    else newSet.add(clientId);
    setSelectedClientIds(newSet);
  };

  // Handle Bulk Action Submit
  const handleBulkSubmit = async () => {
    if (selectedClientIds.size === 0) return;
    try {
      setBulkLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/channel-access/bulk/`, {
        client_ids: Array.from(selectedClientIds),
        channel: bulkActionConfig.channel,
        action: bulkActionConfig.action,
        notes: bulkActionConfig.notes || `Bulk ${bulkActionConfig.action} for ${bulkActionConfig.channel}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsBulkModalOpen(false);
      setSelectedClientIds(new Set());
      await fetchMatrix();
      await fetchAuditLogs();
    } catch (err) {
      console.error('Bulk update error:', err);
      alert(err?.response?.data?.error || 'Bulk channel update failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Impersonate / Open Client
  const handleOpenClientWorkspace = (client) => {
    if (typeof window !== 'undefined') {
      window.open(`/client/channels?impersonate_client_id=${client.client_id}`, '_blank');
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-24 px-4 sm:px-10 lg:px-12 font-sans space-y-6">

        {/* ── 1. Page Header ── */}
        <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Channel Feature Lock & Access Governance</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Control active communication channels (WhatsApp, Facebook, Instagram) per workspace and manage global connector locks.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchMatrix(true);
                fetchAuditLogs();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={cn(isRefreshing && "animate-spin text-emerald-600")} />
              <span>Refresh Matrix</span>
            </button>
          </div>
        </div>

        {/* ── 2. Top Summary KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workspaces</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{summary?.total_clients || clients.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Active client organizations</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">WhatsApp Enabled</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                <MessageCircle size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{summary?.whatsapp_enabled_count ?? '—'}</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Active messaging API seats</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Facebook Enabled</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                <FacebookIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{summary?.facebook_enabled_count ?? '—'}</div>
            <div className="text-[11px] text-blue-600 font-bold mt-0.5">Page Messenger authorized</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">Instagram Enabled</span>
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                <InstagramIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{summary?.instagram_enabled_count ?? '—'}</div>
            <div className="text-[11px] text-pink-600 font-bold mt-0.5">Direct Message seats</div>
          </div>
        </div>

        {/* ── 3. Tabs Navigation (Matrix vs Audit Logs) ── */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab('matrix')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                activeMainTab === 'matrix' ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <SlidersHorizontal size={14} />
              <span>Channel Access Matrix</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {filteredClients.length}
              </span>
            </button>
            <button
              onClick={() => setActiveMainTab('audit_logs')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                activeMainTab === 'audit_logs' ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Clock size={14} />
              <span>Permission Audit Logs</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {auditLogs.length}
              </span>
            </button>
          </div>

          {/* Bulk Action Trigger Bar (When selected) */}
          {selectedClientIds.size > 0 && activeMainTab === 'matrix' && (
            <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {selectedClientIds.size} Clients Selected
              </span>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Power size={13} />
                <span>Bulk Update Channels</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 4. Main Tab 1: MATRIX VIEW ── */}
        {activeMainTab === 'matrix' && (
          <div className="space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workspace, owner, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="ALL">All Permissions</option>
                  <option value="whatsapp">WhatsApp Enabled Only</option>
                  <option value="facebook">Facebook Enabled Only</option>
                  <option value="instagram">Instagram Enabled Only</option>
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            {loading ? (
              <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto mb-2" />
                <span className="text-xs font-bold">Loading Matrix Access Data...</span>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-400 shadow-2xs">
                <AlertCircle size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No workspaces match the current criteria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                        <th className="py-3.5 px-4 w-10 text-center">
                          <button
                            onClick={handleSelectAll}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {selectedClientIds.size === filteredClients.length && filteredClients.length > 0 ? (
                              <CheckSquare size={16} className="text-emerald-600" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </th>
                        <th className="py-3.5 px-4">Client Workspace</th>
                        <th className="py-3.5 px-4 text-center">WhatsApp Access</th>
                        <th className="py-3.5 px-4 text-center">Facebook Access</th>
                        <th className="py-3.5 px-4 text-center">Instagram Access</th>
                        <th className="py-3.5 px-4 text-center">Other Connectors</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredClients.map((client) => {
                        const isSelected = selectedClientIds.has(client.client_id);
                        const waEnabled = Boolean(client.channel_access?.whatsapp);
                        const waConnected = Boolean(client.channels_status?.whatsapp?.connected);

                        const fbEnabled = Boolean(client.channel_access?.facebook);
                        const fbConnected = Boolean(client.channels_status?.facebook?.connected);

                        const igEnabled = Boolean(client.channel_access?.instagram);
                        const igConnected = Boolean(client.channels_status?.instagram?.connected);

                        const isTogglingWa = togglingClientChannel === `${client.client_id}_whatsapp`;
                        const isTogglingFb = togglingClientChannel === `${client.client_id}_facebook`;
                        const isTogglingIg = togglingClientChannel === `${client.client_id}_instagram`;

                        return (
                          <tr key={client.client_id} className={cn("hover:bg-slate-50/60 transition-colors", isSelected && "bg-emerald-50/30")}>
                            {/* Checkbox */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleToggleSelect(client.client_id)}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare size={16} className="text-emerald-600" />
                                ) : (
                                  <Square size={16} />
                                )}
                              </button>
                            </td>

                            {/* Client Workspace Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs uppercase border border-emerald-100 shrink-0">
                                  {client.client_name?.charAt(0) || 'W'}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 text-xs">
                                    {client.client_name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium">
                                    {client.owner_name} • {client.email}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    ID: #{client.client_id} • {client.team_members_count || 0} Team Members
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* WhatsApp Cell */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex flex-col items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleAccess(client.client_id, 'whatsapp', waEnabled)}
                                  disabled={isTogglingWa}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border inline-flex items-center gap-1.5 cursor-pointer shadow-2xs",
                                    waEnabled
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                  )}
                                >
                                  {isTogglingWa ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <Power size={11} />
                                  )}
                                  <span>{waEnabled ? 'Enabled' : 'Disabled'}</span>
                                </button>
                                <span className={cn(
                                  "text-[10px] font-semibold flex items-center gap-1",
                                  waConnected ? "text-emerald-600" : "text-slate-400"
                                )}>
                                  <span className={cn("w-1.5 h-1.5 rounded-full", waConnected ? "bg-emerald-500" : "bg-slate-300")} />
                                  <span>{waConnected ? 'Connected' : 'Offline'}</span>
                                </span>
                              </div>
                            </td>

                            {/* Facebook Cell */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex flex-col items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleAccess(client.client_id, 'facebook', fbEnabled)}
                                  disabled={isTogglingFb}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border inline-flex items-center gap-1.5 cursor-pointer shadow-2xs",
                                    fbEnabled
                                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                  )}
                                >
                                  {isTogglingFb ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <Power size={11} />
                                  )}
                                  <span>{fbEnabled ? 'Enabled' : 'Disabled'}</span>
                                </button>
                                <span className={cn(
                                  "text-[10px] font-semibold flex items-center gap-1",
                                  fbConnected ? "text-blue-600" : "text-slate-400"
                                )}>
                                  <span className={cn("w-1.5 h-1.5 rounded-full", fbConnected ? "bg-blue-500" : "bg-slate-300")} />
                                  <span>{fbConnected ? 'Connected' : 'Offline'}</span>
                                </span>
                              </div>
                            </td>

                            {/* Instagram Cell */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex flex-col items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleAccess(client.client_id, 'instagram', igEnabled)}
                                  disabled={isTogglingIg}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border inline-flex items-center gap-1.5 cursor-pointer shadow-2xs",
                                    igEnabled
                                      ? "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                  )}
                                >
                                  {isTogglingIg ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <Power size={11} />
                                  )}
                                  <span>{igEnabled ? 'Enabled' : 'Disabled'}</span>
                                </button>
                                <span className={cn(
                                  "text-[10px] font-semibold flex items-center gap-1",
                                  igConnected ? "text-pink-600" : "text-slate-400"
                                )}>
                                  <span className={cn("w-1.5 h-1.5 rounded-full", igConnected ? "bg-pink-500" : "bg-slate-300")} />
                                  <span>{igConnected ? 'Connected' : 'Offline'}</span>
                                </span>
                              </div>
                            </td>

                            {/* Other Connectors */}
                            <td className="py-3.5 px-4 text-center">
                              {(() => {
                                const extraActive = Object.entries(client.channel_access || {})
                                  .filter(([k, v]) => !['whatsapp', 'facebook', 'instagram'].includes(k) && Boolean(v));
                                if (extraActive.length > 0) {
                                  return (
                                    <Link
                                      href={`/admin/clients/${client.client_id}?tab=channels`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                      title={extraActive.map(([k]) => k).join(', ')}
                                    >
                                      <CheckCircle2 size={10} className="text-emerald-600" />
                                      <span>+{extraActive.length} Custom Active</span>
                                    </Link>
                                  );
                                }
                                return (
                                  <Link
                                    href={`/admin/clients/${client.client_id}?tab=channels`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors"
                                  >
                                    <Lock size={10} /> + Allot More
                                  </Link>
                                );
                              })()}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenClientWorkspace(client)}
                                  className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition-all cursor-pointer"
                                  title="Open Client Dashboard View"
                                >
                                  <ExternalLink size={14} />
                                </button>
                                <Link
                                  href={`/admin/clients/${client.client_id}?tab=channels`}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-2xs flex items-center gap-1"
                                >
                                  <span>Manage</span>
                                  <ChevronRight size={12} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── 5. Main Tab 2: AUDIT LOGS VIEW ── */}
        {activeMainTab === 'audit_logs' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={18} className="text-slate-600" />
                  System-Wide Channel Permission Audit Trail
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete immutable record of all channel permission grants, revocations, and bulk administrative events.
                </p>
              </div>

              <button
                onClick={fetchAuditLogs}
                disabled={loadingAuditLogs}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={12} className={cn(loadingAuditLogs && "animate-spin")} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {loadingAuditLogs ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-600" />
                <span>Loading permission logs...</span>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No channel permission changes recorded in system yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200">
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Admin</th>
                      <th className="py-3 px-3">Client Organization</th>
                      <th className="py-3 px-3">Channel</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">State Transition</th>
                      <th className="py-3 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {log.admin_name}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {log.client_name} (ID: #{log.client_id})
                        </td>
                        <td className="py-3 px-3 uppercase font-extrabold text-[11px] text-slate-700">
                          {log.channel}
                        </td>
                        <td className="py-3 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                            log.action === 'GRANTED' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          <span className={log.previous_state ? "text-emerald-600" : "text-rose-600"}>
                            {log.previous_state ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className="mx-1 text-slate-400">&rarr;</span>
                          <span className={log.new_state ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                            {log.new_state ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic max-w-sm truncate">
                          {log.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── 6. Bulk Action Modal ── */}
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Bulk Update Channel Access</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Apply channel permission to {selectedClientIds.size} selected workspaces</p>
                </div>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Target Channel</label>
                  <select
                    value={bulkActionConfig.channel}
                    onChange={(e) => setBulkActionConfig({ ...bulkActionConfig, channel: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="whatsapp">WhatsApp Business Cloud API</option>
                    <option value="facebook">Facebook Page Messenger</option>
                    <option value="instagram">Instagram Direct Message</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Action</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBulkActionConfig({ ...bulkActionConfig, action: 'grant' })}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                        bulkActionConfig.action === 'grant' ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs" : "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      <Check size={14} className="text-emerald-600" />
                      <span>Grant Access</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkActionConfig({ ...bulkActionConfig, action: 'revoke' })}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                        bulkActionConfig.action === 'revoke' ? "bg-rose-50 text-rose-800 border-rose-300 shadow-2xs" : "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      <X size={14} className="text-rose-600" />
                      <span>Revoke Access</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Admin Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Plan upgrade or compliance update"
                    value={bulkActionConfig.notes}
                    onChange={(e) => setBulkActionConfig({ ...bulkActionConfig, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSubmit}
                  disabled={bulkLoading}
                  className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {bulkLoading ? <Loader2 size={13} className="animate-spin" /> : <Power size={13} />}
                  <span>Execute Bulk Update</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

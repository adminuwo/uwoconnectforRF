'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Globe, CheckCircle2, XCircle, Search, Loader2,
  ExternalLink, Layers, RefreshCw, MessageCircle,
  Mail, FolderOpen, Calendar, FileText, Database,
  AlertCircle, X, Phone, FileSpreadsheet, LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

// Custom SVG Icons for brands
const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const CHANNEL_DEFINITIONS = [
  { key: 'whatsapp', name: 'WhatsApp Cloud API', shortName: 'WhatsApp', category: 'MESSAGING', icon: MessageCircle, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'instagram', name: 'Instagram Direct', shortName: 'Instagram', category: 'MESSAGING', icon: InstagramIcon, bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { key: 'facebook', name: 'Facebook Messenger', shortName: 'Facebook', category: 'MESSAGING', icon: FacebookIcon, bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'youtube', name: 'YouTube Channel', shortName: 'YouTube', category: 'MESSAGING', icon: YoutubeIcon, bg: 'bg-red-50 text-red-700 border-red-200' },
  { key: 'gmail', name: 'Gmail Workspace', shortName: 'Gmail', category: 'PRODUCTIVITY', icon: Mail, bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'outlook', name: 'Microsoft Outlook', shortName: 'Outlook', category: 'PRODUCTIVITY', icon: Mail, bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { key: 'google_sheets', name: 'Google Sheets', shortName: 'Google Sheets', category: 'STORAGE', icon: FileSpreadsheet, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'onedrive', name: 'Microsoft OneDrive', shortName: 'OneDrive', category: 'STORAGE', icon: FolderOpen, bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'google_calendar', name: 'Google Calendar', shortName: 'G-Calendar', category: 'PRODUCTIVITY', icon: Calendar, bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'google_docs', name: 'Google Docs', shortName: 'G-Docs', category: 'STORAGE', icon: FileText, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'google_slides', name: 'Google Slides', shortName: 'G-Slides', category: 'STORAGE', icon: FileText, bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'zoho', name: 'Zoho CRM', shortName: 'Zoho CRM', category: 'CRM', icon: Database, bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  { key: 'google_news', name: 'Google News', shortName: 'Google News', category: 'CRM', icon: Globe, bg: 'bg-teal-50 text-teal-700 border-teal-200' }
];

export default function AdminChannelsPage() {
  const [channelsData, setChannelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedWorkspaceModal, setSelectedWorkspaceModal] = useState(null);

  const fetchChannels = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-channels/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannelsData(res.data || []);
    } catch (err) {
      console.error('[AdminChannels] Error loading channels inventory:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Filter Workspaces
  const filteredWorkspaces = useMemo(() => {
    return channelsData.filter(client => {
      const matchesSearch = 
        client.client_name?.toLowerCase().includes(search.toLowerCase()) ||
        client.client_id?.toLowerCase().includes(search.toLowerCase()) ||
        client.whatsapp?.phone_number_id?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      const activeCount = CHANNEL_DEFINITIONS.filter(def => 
        def.key === 'whatsapp' ? client.whatsapp?.connected : client[def.key]
      ).length;

      if (statusFilter === 'CONNECTED_ONLY' && activeCount === 0) return false;
      if (statusFilter === 'NO_CHANNELS' && activeCount > 0) return false;

      return true;
    });
  }, [channelsData, search, statusFilter]);

  const handleOpenClientWorkspace = async (client) => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('user');

      localStorage.setItem('admin_backup_token', token);
      localStorage.setItem('admin_backup_user', currentUser);

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/impersonate/`,
        { client_id: client.client_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.access) {
        localStorage.setItem('token', res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('impersonation_session', JSON.stringify({
          client_id: client.client_id,
          client_name: client.client_name,
          admin_name: res.data.impersonating?.impersonator_name || 'Admin'
        }));

        window.location.href = '/client';
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open client workspace.');
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* ── 1. Ultra-Clean Minimalist Header (Subtitle Line Removed) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Channel Management & Integrations
              </h1>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                {channelsData.length} Workspaces
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchChannels(true)}
              disabled={isRefreshing}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="Refresh Channels"
            >
              <RefreshCw size={15} className={cn(isRefreshing && "animate-spin text-emerald-600")} />
            </button>
            <Link
              href="/admin/clients"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Layers size={14} /> Manage Clients
            </Link>
          </div>
        </div>

        {/* ── 2. Search, Status Filter & Table/Card View Toggle ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by client name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 font-medium transition-all shadow-2xs"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Workspaces</option>
              <option value="CONNECTED_ONLY">Has Active Connections</option>
              <option value="NO_CHANNELS">No Connected Channels</option>
            </select>

            {/* View Mode Toggle: Table vs Cards */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'table' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
                title="Switch to Table Format"
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'cards' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
                title="Switch to Cards Format"
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Data View Rendering (Table or Cards) ── */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto mb-2" />
            <span className="text-xs font-bold">Loading Channels Inventory...</span>
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            <AlertCircle size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No workspaces found matching your search.</p>
          </div>
        ) : viewMode === 'table' ? (
          /* ── Table View Format ── */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-4">Client Workspace</th>
                    <th className="py-3.5 px-3 text-center">Active Count</th>
                    <th className="py-3.5 px-4">Connected Integrations</th>
                    <th className="py-3.5 px-3">WhatsApp Phone ID</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkspaces.map((client) => {
                    const activeChannels = CHANNEL_DEFINITIONS.filter(def => 
                      def.key === 'whatsapp' ? Boolean(client.whatsapp?.connected) : Boolean(client[def.key])
                    );

                    return (
                      <tr key={client.client_id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Workspace Info */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase border border-emerald-100">
                              {client.client_name?.charAt(0) || 'W'}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 text-xs">
                                {client.client_name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ID: #{client.client_id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Active Count */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1",
                            activeChannels.length > 0
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              activeChannels.length > 0 ? "bg-emerald-500" : "bg-slate-400"
                            )} />
                            {activeChannels.length} / 13 Active
                          </span>
                        </td>

                        {/* Connected Integrations Chips */}
                        <td className="py-3.5 px-4">
                          {activeChannels.length === 0 ? (
                            <span className="text-slate-400 text-xs italic">No active integrations</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {activeChannels.map(channel => {
                                const Icon = channel.icon;
                                return (
                                  <span
                                    key={channel.key}
                                    className={cn(
                                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold whitespace-nowrap",
                                      channel.bg
                                    )}
                                  >
                                    <Icon size={12} />
                                    <span>{channel.shortName}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>

                        {/* Phone ID */}
                        <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                          {client.whatsapp?.phone_number_id || '—'}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedWorkspaceModal(client)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Audit All 13
                            </button>
                            <button
                              onClick={() => handleOpenClientWorkspace(client)}
                              className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition-all"
                              title="Impersonate & Open Client Workspace"
                            >
                              <ExternalLink size={14} />
                            </button>
                            <Link
                              href={`/admin/clients/${client.client_id}?tab=channels`}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-all shadow-2xs"
                            >
                              Configure
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
        ) : (
          /* ── Cards View Format ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkspaces.map((client) => {
              const activeChannels = CHANNEL_DEFINITIONS.filter(def => 
                def.key === 'whatsapp' ? Boolean(client.whatsapp?.connected) : Boolean(client[def.key])
              );

              return (
                <div
                  key={client.client_id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase border border-emerald-100 shrink-0">
                          {client.client_name?.charAt(0) || 'W'}
                        </div>
                        <div className="truncate">
                          <h3 className="font-extrabold text-slate-900 text-sm truncate">
                            {client.client_name}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: #{client.client_id.slice(-6)}
                          </span>
                        </div>
                      </div>

                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0",
                        activeChannels.length > 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      )}>
                        {activeChannels.length} Active
                      </span>
                    </div>

                    {/* Active Connected Brand Chips */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Connected Integrations
                      </div>

                      {activeChannels.length === 0 ? (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-400 font-medium">
                          No active integrations connected.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {activeChannels.map(channel => {
                            const Icon = channel.icon;
                            return (
                              <span
                                key={channel.key}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold",
                                  channel.bg
                                )}
                              >
                                <Icon size={13} />
                                <span>{channel.shortName}</span>
                                <CheckCircle2 size={12} className="text-emerald-600 ml-0.5" />
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* WhatsApp Phone Snippet */}
                      {client.whatsapp?.connected && (
                        <div className="text-[11px] text-slate-600 font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 mt-2 flex items-center gap-1.5">
                          <Phone size={12} className="text-emerald-600" />
                          <span className="truncate">WA Phone ID: {client.whatsapp.phone_number_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    <button
                      onClick={() => setSelectedWorkspaceModal(client)}
                      className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      Audit All 13 Channels &rarr;
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenClientWorkspace(client)}
                        className="p-1.5 hover:bg-purple-50 text-slate-500 hover:text-purple-700 rounded-lg transition-all"
                        title="Impersonate & Open Client Workspace"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <Link
                        href={`/admin/clients/${client.client_id}?tab=channels`}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-all"
                      >
                        Configure
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ── 4. Audit Modal (Shows All 13 Channels when clicked) ── */}
        {selectedWorkspaceModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{selectedWorkspaceModal.client_name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Workspace ID: #{selectedWorkspaceModal.client_id}</p>
                </div>
                <button
                  onClick={() => setSelectedWorkspaceModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body - 13 Channels Breakdown */}
              <div className="p-5 overflow-y-auto space-y-2 text-xs">
                <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-2">
                  Full Integrations Matrix (13 Connectors)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHANNEL_DEFINITIONS.map(def => {
                    const isConn = def.key === 'whatsapp'
                      ? Boolean(selectedWorkspaceModal.whatsapp?.connected)
                      : Boolean(selectedWorkspaceModal[def.key]);
                    const Icon = def.icon;

                    return (
                      <div
                        key={def.key}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold",
                          isConn ? "bg-emerald-50/50 border-emerald-200 text-slate-900" : "bg-slate-50/60 border-slate-100 text-slate-400"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon size={14} className={isConn ? "text-emerald-600" : "text-slate-400"} />
                          <span className="truncate">{def.name}</span>
                        </div>
                        {isConn ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-bold">Connected</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Disabled</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setSelectedWorkspaceModal(null)}
                  className="px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <Link
                  href={`/admin/clients/${selectedWorkspaceModal.client_id}?tab=channels`}
                  className="px-4 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs"
                >
                  Edit Configuration
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

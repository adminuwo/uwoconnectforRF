'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Search, Loader2, Globe, Filter,
  ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock,
  Building2, Sparkles, Bot, User, RefreshCw, ChevronDown,
  ChevronRight, Mail, Send, Eye, Shield, Check, AlertCircle,
  Layers, X, ExternalLink, Activity, Phone, ArrowRight, Maximize2
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

// Authentic Channel Logos with Brand Colors
const WhatsAppIcon = ({ size = 15, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.43 0 .07 5.36.07 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.91 11.91 0 005.81 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.49-8.43zM12.04 21.84h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.88 9.88 0 01-1.52-5.24C2.17 6.52 6.6 2.08 12.04 2.08c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 6.99c0 5.44-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" fill="#25D366"/>
  </svg>
);

const InstagramIcon = ({ size = 15, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="igGradientModal" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.73-2.12 1.39C1.36 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.3.79.73 1.46 1.39 2.12.66.66 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.73 2.12-1.39.66-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91-.3-.79-.73-1.46-1.39-2.12C21.32 1.36 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 2.16c3.2 0 3.59.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.26.07 1.65.07 4.86 0 3.2-.01 3.59-.07 4.85-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.26.06-1.65.07-4.86.07-3.2 0-3.59-.01-4.85-.07-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.65-.07-4.86 0-3.2.01-3.59.07-4.85.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.26-.06 1.65-.07 4.85-.07zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.84a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" fill="url(#igGradientModal)"/>
  </svg>
);

const FacebookIcon = ({ size = 15, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const GmailBrandIcon = ({ size = 15, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.691 2.279 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

const CHANNELS_CONFIG = {
  WHATSAPP: {
    label: 'WhatsApp',
    icon: WhatsAppIcon,
    brandColor: '#25D366',
    activeTabClass: 'bg-[#25D366] text-white shadow-md shadow-[#25D366]/30 border-[#25D366]',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bubbleBorder: 'border-l-4 border-l-[#25D366]',
  },
  INSTAGRAM: {
    label: 'Instagram',
    icon: InstagramIcon,
    brandColor: '#E1306C',
    activeTabClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-md shadow-pink-500/30 border-transparent',
    badgeBg: 'bg-pink-50 text-pink-800 border-pink-200',
    bubbleBorder: 'border-l-4 border-l-[#E1306C]',
  },
  FACEBOOK: {
    label: 'Facebook',
    icon: FacebookIcon,
    brandColor: '#1877F2',
    activeTabClass: 'bg-[#1877F2] text-white shadow-md shadow-blue-500/30 border-[#1877F2]',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    bubbleBorder: 'border-l-4 border-l-[#1877F2]',
  },
  GMAIL: {
    label: 'Gmail',
    icon: GmailBrandIcon,
    brandColor: '#EA4335',
    activeTabClass: 'bg-[#EA4335] text-white shadow-md shadow-red-500/30 border-[#EA4335]',
    badgeBg: 'bg-red-50 text-red-800 border-red-200',
    bubbleBorder: 'border-l-4 border-l-[#EA4335]',
  }
};

const AdminInboxPage = () => {
  // Main Data States
  const [messages, setMessages] = useState([]);
  const [clientsBreakdown, setClientsBreakdown] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total_messages: 0,
    total_whatsapp: 0,
    total_instagram: 0,
    total_facebook: 0,
    total_gmail: 0,
    total_clients: 0,
    active_clients_with_messages: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('CLIENT_TABLE'); // 'CLIENT_TABLE' | 'ALL_MESSAGES'

  // Selected Client Center Modal State
  const [selectedClientModal, setSelectedClientModal] = useState(null);
  const [modalChannelFilter, setModalChannelFilter] = useState('ALL');
  const [modalTypeFilter, setModalTypeFilter] = useState('ALL');
  const [modalSearch, setModalSearch] = useState('');

  const fetchMessages = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else if (messages.length === 0) setLoading(true);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-messages/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = res.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setMessages(data.messages || []);
        const clients = data.clients || [];
        setClientsBreakdown(clients);
        if (data.summary) setSummaryStats(data.summary);

        if (selectedClientModal) {
          const updated = clients.find(c => c.client_id === selectedClientModal.client_id);
          if (updated) setSelectedClientModal(updated);
        }
      } else if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.warn('Live messages fetch info:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filtered Client Rows for Table
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clientsBreakdown;
    const q = searchTerm.toLowerCase();
    return clientsBreakdown.filter(c => 
      c.client_name?.toLowerCase().includes(q) ||
      c.phone_number?.toLowerCase().includes(q) ||
      c.plan?.toLowerCase().includes(q) ||
      c.client_id?.toLowerCase().includes(q)
    );
  }, [clientsBreakdown, searchTerm]);

  // Messages to show in the Selected Client Center Modal
  const modalMessages = useMemo(() => {
    if (!selectedClientModal) return [];
    let list = selectedClientModal.messages || [];
    if (modalChannelFilter === 'WHATSAPP') list = selectedClientModal.whatsapp_messages || [];
    else if (modalChannelFilter === 'INSTAGRAM') list = selectedClientModal.instagram_messages || [];
    else if (modalChannelFilter === 'FACEBOOK') list = selectedClientModal.facebook_messages || [];
    else if (modalChannelFilter === 'GMAIL') list = selectedClientModal.gmail_messages || [];

    if (modalTypeFilter !== 'ALL') {
      list = list.filter(m => m.message_type === modalTypeFilter);
    }
    if (modalSearch) {
      const q = modalSearch.toLowerCase();
      list = list.filter(m => 
        (m.body || '').toLowerCase().includes(q) ||
        (m.from_address || '').toLowerCase().includes(q) ||
        (m.to_address || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedClientModal, modalChannelFilter, modalTypeFilter, modalSearch]);

  const openClientModal = (client, specificChannel = 'ALL') => {
    setSelectedClientModal(client);
    setModalChannelFilter(specificChannel);
    setModalTypeFilter('ALL');
    setModalSearch('');
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* ── 1. Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Client Messages & Channel Traffic
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                {summaryStats.total_messages || messages.length} Total Messages
              </span>
              {(loading || refreshing) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <Loader2 size={11} className="animate-spin text-emerald-600" /> Syncing...
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
              Click any client or channel badge to open their messages in the center view.
            </p>
          </div>

          {/* View Mode Toggle & Refresh */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('CLIENT_TABLE')}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'CLIENT_TABLE'
                    ? "bg-white text-emerald-700 shadow-2xs border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Client Overview Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ALL_MESSAGES')}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'ALL_MESSAGES'
                    ? "bg-white text-emerald-700 shadow-2xs border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                All Messages Stream
              </button>
            </div>

            <button
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw size={12} className={cn(refreshing && "animate-spin text-emerald-600")} /> Refresh
            </button>
          </div>
        </div>

        {/* ── 2. Top Summary KPI Row (With Authentic Brand Colors) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
          {/* Total Traffic */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">All Workspaces</p>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <MessageSquare size={14} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{summaryStats.total_messages}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{summaryStats.total_clients} Clients</p>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs hover:border-[#25D366]/40 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#1da851] uppercase tracking-wider flex items-center gap-1.5">
                <WhatsAppIcon size={14} /> WhatsApp
              </p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#25D366] flex items-center justify-center font-bold">
                <WhatsAppIcon size={15} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{summaryStats.total_whatsapp}</h3>
            <p className="text-[11px] text-[#1da851] mt-0.5 font-medium">Cloud API Chats</p>
          </div>

          {/* Instagram */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs hover:border-pink-300 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1.5">
                <InstagramIcon size={14} /> Instagram
              </p>
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <InstagramIcon size={15} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{summaryStats.total_instagram}</h3>
            <p className="text-[11px] text-pink-600 mt-0.5 font-medium">Direct Messages</p>
          </div>

          {/* Facebook */}
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-2xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#1877F2] uppercase tracking-wider flex items-center gap-1.5">
                <FacebookIcon size={14} /> Facebook
              </p>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold">
                <FacebookIcon size={15} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{summaryStats.total_facebook}</h3>
            <p className="text-[11px] text-[#1877F2] mt-0.5 font-medium">Messenger</p>
          </div>

          {/* Gmail / Email */}
          <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-2xs hover:border-red-300 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#EA4335] uppercase tracking-wider flex items-center gap-1.5">
                <GmailBrandIcon size={14} /> Gmail
              </p>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#EA4335] flex items-center justify-center font-bold">
                <GmailBrandIcon size={15} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{summaryStats.total_gmail}</h3>
            <p className="text-[11px] text-[#EA4335] mt-0.5 font-medium">Inboxes & Rules</p>
          </div>
        </div>

        {/* ── 3. MAIN TABLE: CLIENT MESSAGE MATRIX ── */}
        {viewMode === 'CLIENT_TABLE' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {/* Search Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Filter client workspace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Showing {filteredClients.length} Client Workspaces
              </span>
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-emerald-600" size={28} />
                <p className="text-xs font-semibold text-slate-500">Loading Client Message Matrix...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs font-medium italic">
                No client workspaces found.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] uppercase font-bold tracking-wider">
                      <th className="py-3.5 px-6">Client Workspace</th>
                      <th className="py-3.5 px-4 text-center">Total Messages</th>
                      <th className="py-3.5 px-4 text-center">WhatsApp</th>
                      <th className="py-3.5 px-4 text-center">Instagram</th>
                      <th className="py-3.5 px-4 text-center">Facebook</th>
                      <th className="py-3.5 px-4 text-center">Gmail</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredClients.map((client) => {
                      const waCount = client.channel_counts?.WHATSAPP || 0;
                      const igCount = client.channel_counts?.INSTAGRAM || 0;
                      const fbCount = client.channel_counts?.FACEBOOK || 0;
                      const gmCount = client.channel_counts?.GMAIL || 0;
                      const hasMessages = client.total_messages > 0;

                      return (
                        <tr 
                          key={client.client_id} 
                          className="hover:bg-emerald-50/20 transition-colors group cursor-pointer"
                          onClick={() => openClientModal(client, 'ALL')}
                        >
                          {/* Client Workspace Info */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border",
                                hasMessages 
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              )}>
                                {client.client_name?.charAt(0) || 'C'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                                  {client.client_name}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400">
                                  ID: {client.client_id.slice(-8)} • {client.plan || 'STARTER'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Total Traffic Count */}
                          <td className="py-4 px-4 text-center">
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-bold inline-block border",
                              hasMessages 
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-black" 
                                : "bg-slate-100 text-slate-400 border-slate-200 font-medium"
                            )}>
                              {client.total_messages}
                            </span>
                          </td>

                          {/* WhatsApp (Clickable Brand Pill) */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openClientModal(client, 'WHATSAPP'); }}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                                waCount > 0 
                                  ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200/60"
                              )}
                            >
                              <WhatsAppIcon size={13} />
                              <span>{waCount}</span>
                            </button>
                          </td>

                          {/* Instagram (Clickable Brand Pill) */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openClientModal(client, 'INSTAGRAM'); }}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                                igCount > 0 
                                  ? "bg-pink-50 text-pink-900 border-pink-300 hover:bg-pink-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200/60"
                              )}
                            >
                              <InstagramIcon size={13} />
                              <span>{igCount}</span>
                            </button>
                          </td>

                          {/* Facebook (Clickable Brand Pill) */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openClientModal(client, 'FACEBOOK'); }}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                                fbCount > 0 
                                  ? "bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200/60"
                              )}
                            >
                              <FacebookIcon size={13} />
                              <span>{fbCount}</span>
                            </button>
                          </td>

                          {/* Gmail (Clickable Brand Pill) */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openClientModal(client, 'GMAIL'); }}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                                gmCount > 0 
                                  ? "bg-red-50 text-red-900 border-red-300 hover:bg-red-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200/60"
                              )}
                            >
                              <GmailBrandIcon size={13} />
                              <span>{gmCount}</span>
                            </button>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-semibold border",
                              client.status === 'ACTIVE' 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {client.status || 'ACTIVE'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openClientModal(client, 'ALL'); }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              <Eye size={12} />
                              <span>View Chats ({client.total_messages})</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── 4. ALL MESSAGES UNIFIED STREAM (Alternative View) ── */}
        {viewMode === 'ALL_MESSAGES' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {loading ? (
              <div className="py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-emerald-600" size={28} />
                <p className="text-xs font-semibold text-slate-500">Retrieving Live Messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
                No messages found matching search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-6">Client Workspace</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">From / Sender</th>
                      <th className="py-3 px-4">To / Recipient</th>
                      <th className="py-3 px-6">Message Body</th>
                      <th className="py-3 px-4 text-center">Direction</th>
                      <th className="py-3 px-6 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {messages.map((msg) => {
                      const channelConf = CHANNELS_CONFIG[msg.channel] || CHANNELS_CONFIG.WHATSAPP;
                      const ChannelIcon = channelConf.icon;

                      return (
                        <tr key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-slate-800 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                              <Building2 size={12} className="text-emerald-700" />
                              {msg.client_name}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border",
                              channelConf.badgeBg
                            )}>
                              <ChannelIcon size={11} />
                              {channelConf.label}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 min-w-[140px]">
                            <p className="font-bold text-slate-800">{msg.sender_name || msg.from_address}</p>
                            <p className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">{msg.from_address}</p>
                          </td>

                          <td className="py-3.5 px-4 min-w-[140px]">
                            <p className="font-mono font-bold text-slate-800 truncate max-w-[130px]">{msg.to_address}</p>
                          </td>

                          <td className="py-3.5 px-6 max-w-md">
                            <p className="text-slate-700 font-medium line-clamp-2">{msg.body}</p>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-bold uppercase inline-flex items-center gap-1 border",
                              msg.message_type === 'INCOMING'
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            )}>
                              {msg.message_type === 'INCOMING' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                              {msg.message_type === 'INCOMING' ? 'IN' : 'OUT'}
                            </span>
                          </td>

                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <p className="text-[11px] font-bold text-slate-800">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── 5. CENTER MODAL FOR CLIENT CHATS (With Brand Colors & Center Alignment) ── */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-600/30">
                  {selectedClientModal.client_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900">{selectedClientModal.client_name}</h3>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                      {selectedClientModal.plan || 'STARTER'} Plan
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {selectedClientModal.status || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Workspace ID: <span className="font-mono text-slate-700 font-bold">{selectedClientModal.client_id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs rounded-xl hidden sm:inline-block">
                  {selectedClientModal.total_messages} Total Messages
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClientModal(null)}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow-2xs transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Channel Filter Tabs (With Brand Colors matching Logos) */}
            <div className="px-5 pt-3.5 pb-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto custom-scrollbar">
              {/* All Channels */}
              <button
                type="button"
                onClick={() => setModalChannelFilter('ALL')}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1.5",
                  modalChannelFilter === 'ALL'
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                <MessageSquare size={13} />
                <span>All Channels ({selectedClientModal.total_messages})</span>
              </button>

              {/* WhatsApp Brand Pill */}
              <button
                type="button"
                onClick={() => setModalChannelFilter('WHATSAPP')}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border",
                  modalChannelFilter === 'WHATSAPP'
                    ? CHANNELS_CONFIG.WHATSAPP.activeTabClass
                    : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70"
                )}
              >
                <WhatsAppIcon size={14} />
                <span>WhatsApp ({selectedClientModal.channel_counts?.WHATSAPP || 0})</span>
              </button>

              {/* Instagram Brand Pill */}
              <button
                type="button"
                onClick={() => setModalChannelFilter('INSTAGRAM')}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border",
                  modalChannelFilter === 'INSTAGRAM'
                    ? CHANNELS_CONFIG.INSTAGRAM.activeTabClass
                    : "bg-pink-50/70 text-pink-900 border-pink-200 hover:bg-pink-100/70"
                )}
              >
                <InstagramIcon size={14} />
                <span>Instagram ({selectedClientModal.channel_counts?.INSTAGRAM || 0})</span>
              </button>

              {/* Facebook Brand Pill */}
              <button
                type="button"
                onClick={() => setModalChannelFilter('FACEBOOK')}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border",
                  modalChannelFilter === 'FACEBOOK'
                    ? CHANNELS_CONFIG.FACEBOOK.activeTabClass
                    : "bg-blue-50/70 text-blue-900 border-blue-200 hover:bg-blue-100/70"
                )}
              >
                <FacebookIcon size={14} />
                <span>Facebook ({selectedClientModal.channel_counts?.FACEBOOK || 0})</span>
              </button>

              {/* Gmail Brand Pill */}
              <button
                type="button"
                onClick={() => setModalChannelFilter('GMAIL')}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border",
                  modalChannelFilter === 'GMAIL'
                    ? CHANNELS_CONFIG.GMAIL.activeTabClass
                    : "bg-red-50/70 text-red-900 border-red-200 hover:bg-red-100/70"
                )}
              >
                <GmailBrandIcon size={14} />
                <span>Gmail ({selectedClientModal.channel_counts?.GMAIL || 0})</span>
              </button>
            </div>

            {/* Search & Direction Filter Bar inside Modal */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Search message text, customer phone or email..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none font-medium focus:border-emerald-500"
                />
              </div>

              <select
                value={modalTypeFilter}
                onChange={(e) => setModalTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Directions</option>
                <option value="INCOMING">Incoming 📥</option>
                <option value="OUTGOING">Outgoing 📤</option>
              </select>
            </div>

            {/* Message Feed Stream inside Modal */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-3 bg-slate-50/60 max-h-[55vh]">
              {modalMessages.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
                  <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No messages found for this filter.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select another channel or clear search query.</p>
                </div>
              ) : (
                modalMessages.map((msg) => {
                  const channelConf = CHANNELS_CONFIG[msg.channel] || CHANNELS_CONFIG.WHATSAPP;
                  const ChannelIcon = channelConf.icon;
                  const isIncoming = msg.message_type === 'INCOMING';

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-all",
                        channelConf.bubbleBorder
                      )}
                    >
                      {/* Top Meta Line */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Channel Badge */}
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border",
                            channelConf.badgeBg
                          )}>
                            <ChannelIcon size={12} />
                            {channelConf.label}
                          </span>

                          {/* Direction Badge */}
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                            isIncoming ? "bg-emerald-100 text-emerald-900 border border-emerald-200" : "bg-blue-100 text-blue-900 border border-blue-200"
                          )}>
                            {isIncoming ? 'INCOMING 📥' : 'OUTGOING 📤'}
                          </span>

                          {msg.is_bot ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-200 rounded text-[9px] font-bold">
                              <Bot size={11} /> AI Bot Reply
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[9px] font-bold">
                              <User size={11} /> {msg.sender_name || 'Staff'}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Routing details */}
                      <div className="text-[11px] text-slate-600 font-mono flex items-center gap-2 flex-wrap bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                        <span><strong className="text-slate-700">From:</strong> {msg.from_address}</span>
                        <span className="text-slate-400 font-bold">➔</span>
                        <span><strong className="text-slate-700">To:</strong> {msg.to_address}</span>
                      </div>

                      {/* Message body */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-900 font-medium whitespace-pre-wrap break-words leading-relaxed">
                        {msg.body}
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-0.5 text-[10px] text-slate-400">
                        <span>Source: <strong className="text-slate-600">{selectedClientModal.client_name}</strong> Dashboard</span>
                        <span className="px-2 py-0.2 rounded bg-slate-100 font-bold text-slate-700 uppercase">{msg.status}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Showing {modalMessages.length} Messages for {selectedClientModal.client_name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedClientModal(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminInboxPage;

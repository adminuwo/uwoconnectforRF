'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, MessageSquare, Globe, Bot, Brain, Mail,
  ShoppingBag, DollarSign, FileCheck, FileText, Receipt,
  Activity, ShieldCheck, ShieldAlert, CheckCircle2, XCircle,
  Clock, ArrowLeft, ExternalLink, RefreshCw, Loader2,
  Calendar, Layers, Sparkles, ChevronRight, Phone, Check, Eye,
  Sliders, Settings, AlertTriangle, Play, Pause, Power,
  ChevronDown, Filter, Search, Download, Trash2, Edit3, Plus,
  Send, UserCheck, UserX, ArrowUpRight, TrendingUp, AlertCircle,
  Smartphone, Share2, CornerDownRight, Inbox, Tag, File
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function ClientAdminDetailDashboard({ params }) {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.id;
  const router = useRouter();

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(false);

  // Filter & Search states
  const [msgFilterChannel, setMsgFilterChannel] = useState('ALL');
  const [msgFilterBot, setMsgFilterBot] = useState('ALL');
  const [selectedProductInvoice, setSelectedProductInvoice] = useState(null);
  const [activityFilterModule, setActivityFilterModule] = useState('ALL');

  // Interactive Modal / Drawer States
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditBotOpen, setIsEditBotOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Form states for modals
  const [profileForm, setProfileForm] = useState({ business_name: '', phone_number: '', address: '', plan: 'GROWTH', status: 'ACTIVE' });
  const [botForm, setBotForm] = useState({ ai_enabled: false, automation_enabled: true, ai_context: '', greeting_enabled: true, greeting_message: '' });
  const [memberForm, setMemberForm] = useState({ enterprise_role: 'EMPLOYEE', department: '', designation: '', status: 'APPROVED' });
  const [projectForm, setProjectForm] = useState({ name: '', status: 'PLANNING', priority: 'MEDIUM', progress_percentage: 0, deadline: '' });
  const [productForm, setProductForm] = useState({ price: 0, stock_quantity: 0, in_stock: true, category: '' });

  const fetchClientDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/clients/${clientId}/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientData(res.data);

      if (res.data.overview) {
        setProfileForm({
          business_name: res.data.overview.business_name || '',
          phone_number: res.data.overview.phone_number || '',
          address: res.data.overview.address || '',
          plan: res.data.overview.plan || 'GROWTH',
          status: res.data.overview.status || 'ACTIVE'
        });
      }
      if (res.data.botAnalytics) {
        setBotForm({
          ai_enabled: res.data.botAnalytics.ai_enabled || false,
          automation_enabled: res.data.botAnalytics.automation_enabled !== false,
          ai_context: res.data.botAnalytics.ai_context || '',
          greeting_enabled: res.data.botAnalytics.greeting_enabled !== false,
          greeting_message: res.data.botAnalytics.greeting_message || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch client dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientDashboard();
    }
  }, [clientId]);

  const handleClientAction = async (action, payload = {}) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/clients/${clientId}/action/`,
        { action, ...payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchClientDashboard();
      setConfirmModal(null);
      setIsEditProfileOpen(false);
      setIsEditBotOpen(false);
      setSelectedTeamMember(null);
      setSelectedProject(null);
      setSelectedProduct(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenClientWorkspace = async () => {
    if (!clientData) return;
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('user');

      localStorage.setItem('admin_backup_token', token);
      localStorage.setItem('admin_backup_user', currentUser);

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/impersonate/`,
        { client_id: clientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.access) {
        localStorage.setItem('token', res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('impersonation_session', JSON.stringify({
          client_id: clientId,
          client_name: clientData.overview?.business_name,
          admin_name: res.data.impersonating?.impersonator_name || 'Admin'
        }));

        window.location.href = '/client';
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open client workspace.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#059669]" size={36} />
          <p className="text-xs font-semibold text-slate-400">Loading Workspace Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!clientData) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-6xl mx-auto py-24 text-center">
          <h2 className="text-lg font-bold text-slate-800">Client workspace not found</h2>
          <Link href="/admin/clients" className="mt-3 inline-block text-[#059669] font-bold text-xs">
            &larr; Back to Clients
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const {
    overview = {},
    messagesAnalytics = {},
    channels = [],
    whatsapp = {},
    facebook = {},
    instagram = {},
    botAnalytics = {},
    emailMetrics = {},
    proposals = {},
    quotations = {},
    invoices = {},
    sales = {},
    team = {},
    projects = {},
    activityTimeline = []
  } = clientData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'channels', label: 'Channels', icon: Globe, count: channels.filter(c => c.connected).length },
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, count: whatsapp.total_messages || 0 },
    { id: 'facebook', label: 'Facebook', icon: Share2, count: facebook.total_messages || 0 },
    { id: 'instagram', label: 'Instagram', icon: Share2, count: instagram.total_messages || 0 },
    { id: 'ai', label: 'Bot & AI', icon: Bot },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: messagesAnalytics.total || 0 },
    { id: 'email', label: 'Email', icon: Mail, count: emailMetrics.total_emails || 0 },
    { id: 'proposals', label: 'Proposals', icon: FileText, count: proposals.total_count || 0 },
    { id: 'quotations', label: 'Quotations', icon: FileCheck, count: quotations.total_count || 0 },
    { id: 'invoices', label: 'Invoices', icon: Receipt, count: invoices.total_count || 0 },
    { id: 'products', label: 'Products', icon: ShoppingBag, count: sales.total_products || 0 },
    { id: 'team', label: 'Team', icon: Users, count: team.total_members || 0 },
    { id: 'projects', label: 'Projects', icon: Layers, count: projects.total_projects || 0 },
    { id: 'activity', label: 'Activity', icon: Activity, count: activityTimeline.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-20 px-4 sm:px-10 lg:px-12 font-sans">
        
        {/* ── Top Breadcrumb ── */}
        <div className="my-5 flex items-center justify-between">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#059669] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Clients
          </Link>

          <span className="text-xs text-slate-400 font-mono">Workspace #{overview.id}</span>
        </div>

        {/* ── Client Header Banner ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-black text-xl uppercase shrink-0 border border-emerald-100">
              {(overview.business_name || 'C')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {overview.business_name}
                </h1>
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                  overview.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                )}>
                  {overview.status}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                  {overview.plan}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {overview.email || '—'} • {overview.phone_number || '—'} • Registered {overview.created_at ? new Date(overview.created_at).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={handleOpenClientWorkspace}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <ExternalLink size={13} /> Open Workspace
            </button>
          </div>
        </div>

        {/* ── Clean Tab Navigation Bar ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-3 mb-6 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                )}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-md text-[10px]",
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            TAB: OVERVIEW
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Clean Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-400 mb-0.5">Active Channels</p>
                <h4 className="text-xl font-extrabold text-slate-900">{channels.filter(c => c.connected).length} <span className="text-xs font-normal text-slate-400">/ {channels.length}</span></h4>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-400 mb-0.5">Total Messages</p>
                <h4 className="text-xl font-extrabold text-slate-900">{messagesAnalytics.total ?? 0}</h4>
                <p className="text-[10px] text-purple-600 font-semibold">{botAnalytics.total_messages_handled ?? 0} by bot</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-400 mb-0.5">Invoices & Sales</p>
                <h4 className="text-xl font-extrabold text-slate-900">{invoices.total_count ?? 0}</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">₹{(invoices.paid_amount || 0).toLocaleString()} paid</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-semibold text-slate-400 mb-0.5">Projects</p>
                <h4 className="text-xl font-extrabold text-slate-900">{projects.total_projects ?? 0}</h4>
                <p className="text-[10px] text-amber-600 font-semibold">{projects.average_progress}% avg progress</p>
              </div>
            </div>

            {/* Channel Activity & 7-Day Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Channel Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Connected Channels</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="text-[#059669]" size={18} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">WhatsApp</p>
                        <p className="text-[10px] text-slate-400">{whatsapp.total_messages || 0} messages • {whatsapp.bot_replies || 0} bot replies</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('whatsapp')} className="text-xs font-bold text-[#059669] hover:underline">
                      Inspect &rarr;
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Share2 className="text-blue-600" size={18} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Facebook Messenger</p>
                        <p className="text-[10px] text-slate-400">{facebook.total_messages || 0} messages</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('facebook')} className="text-xs font-bold text-blue-600 hover:underline">
                      Inspect &rarr;
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mail className="text-sky-600" size={18} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Email & Gmail</p>
                        <p className="text-[10px] text-slate-400">{emailMetrics.total_emails || 0} emails • {emailMetrics.auto_replies_sent || 0} auto</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('email')} className="text-xs font-bold text-sky-600 hover:underline">
                      Inspect &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* 7-Day Message Analytics */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Message Trends (Last 7 Days)</h3>
                  <button onClick={() => setActiveTab('messages')} className="text-xs font-bold text-[#059669] hover:underline">
                    View Live &rarr;
                  </button>
                </div>
                <div className="space-y-2">
                  {(messagesAnalytics.messageTrends || []).map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{t.date}</span>
                      <div className="flex items-center gap-3 font-semibold">
                        <span className="text-emerald-600">In: {t.incoming}</span>
                        <span className="text-blue-600">Out: {t.outgoing}</span>
                        <span className="text-purple-600">Bot: {t.bot || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            TAB: CHANNELS
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div key={ch.key} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{ch.name}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                      ch.connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {ch.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{ch.details}</p>
                  <div className="text-xs text-slate-600 space-y-1 mb-4">
                    <p>Messages: <strong>{ch.messages_count}</strong></p>
                    <p>Bot replies: <strong>{ch.bot_replies || 0}</strong></p>
                  </div>
                </div>

                <button
                  onClick={() => handleClientAction('TOGGLE_FEATURE', { feature: `${ch.key}_enabled` })}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {ch.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            TAB: WHATSAPP
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Total Messages</p>
                <h4 className="text-xl font-bold text-slate-900">{whatsapp.total_messages ?? 0}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Incoming / Outgoing</p>
                <h4 className="text-xl font-bold text-slate-900">{whatsapp.incoming ?? 0} / {whatsapp.outgoing ?? 0}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Bot Handled</p>
                <h4 className="text-xl font-bold text-purple-600">{whatsapp.bot_handled_conversations ?? 0}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Human Handled</p>
                <h4 className="text-xl font-bold text-emerald-600">{whatsapp.human_handled_conversations ?? 0}</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
                Recent WhatsApp Conversations
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Last Message</th>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(whatsapp.conversations || []).map((convo) => (
                    <tr key={convo.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{convo.customer_name} ({convo.customer_phone})</td>
                      <td className="p-3.5 max-w-xs truncate text-slate-500">{convo.last_message || '—'}</td>
                      <td className="p-3.5 text-slate-400">{new Date(convo.last_message_time).toLocaleString()}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedConversation(convo)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#059669] hover:text-white rounded-lg font-bold text-slate-700 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            TAB: INVOICES & PRODUCT AGGREGATOR
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Total Invoices</p>
                <h4 className="text-xl font-bold text-slate-900">{invoices.total_count ?? 0}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Paid Amount</p>
                <h4 className="text-xl font-bold text-emerald-600">₹{(invoices.paid_amount || 0).toLocaleString()}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Pending Amount</p>
                <h4 className="text-xl font-bold text-amber-600">₹{(invoices.pending_amount || 0).toLocaleString()}</h4>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] text-slate-400 font-semibold">Overdue</p>
                <h4 className="text-xl font-bold text-rose-600">{invoices.overdue_count ?? 0}</h4>
              </div>
            </div>

            {/* Product-Wise Filter Cards */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Product-Wise Invoices</h3>
                {selectedProductInvoice && (
                  <button onClick={() => setSelectedProductInvoice(null)} className="text-xs font-bold text-[#059669] hover:underline">
                    Show All Invoices &rarr;
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(invoices.product_wise_invoices || []).map((pwi) => (
                  <div
                    key={pwi.product_id}
                    onClick={() => setSelectedProductInvoice(selectedProductInvoice === pwi.product_name ? null : pwi.product_name)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all cursor-pointer",
                      selectedProductInvoice === pwi.product_name ? "bg-emerald-50 border-[#059669]" : "bg-slate-50 border-slate-200/80 hover:bg-slate-100"
                    )}
                  >
                    <p className="text-xs font-bold text-slate-900 truncate">{pwi.product_name}</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">₹{pwi.total_amount.toLocaleString()}</p>
                    <span className="text-[10px] text-slate-500">{pwi.invoice_count} invoices</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(invoices.documents || [])
                    .filter(inv => !selectedProductInvoice || inv.product_name.toLowerCase().includes(selectedProductInvoice.toLowerCase()))
                    .map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-slate-900">#{inv.invoice_number}</td>
                        <td className="p-3.5">{inv.product_name}</td>
                        <td className="p-3.5 font-bold text-slate-900">₹{inv.total.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            inv.payment_status === 'PAID' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {inv.payment_status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleClientAction('UPDATE_DOCUMENT_STATUS', { document_id: inv.id, doc_type: 'INVOICE', status: inv.payment_status === 'PAID' ? 'PENDING' : 'PAID' })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
                          >
                            {inv.payment_status === 'PAID' ? 'Mark Pending' : 'Mark Paid'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            OTHER TABS (Bot, Team, Projects, Activity, Settings)
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">AI Bot Configuration</h3>
              <button onClick={() => setIsEditBotOpen(true)} className="px-3.5 py-1.5 bg-[#059669] text-white rounded-xl text-xs font-bold cursor-pointer">
                Edit Prompt & Greeting
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold text-[10px] uppercase">AI Context / System Prompt:</span>
                <p className="text-slate-700 font-medium whitespace-pre-wrap">{botAnalytics.ai_context || 'Standard UWO Connect Assistant'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Greeting Message:</span>
                <p className="text-slate-700 font-medium whitespace-pre-wrap">{botAnalytics.greeting_message || 'Welcome! How can we help you today?'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                  <th className="p-3.5">Member</th>
                  <th className="p-3.5">Role & Dept</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(team.members || []).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{m.name} ({m.email})</td>
                    <td className="p-3.5">{m.enterprise_role} • {m.department}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{m.status}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedTeamMember(m);
                          setMemberForm({ enterprise_role: m.enterprise_role, department: m.department, designation: m.designation, status: m.status });
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(projects.projects || []).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{p.description || 'Project workspace'}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Progress</span>
                      <span className="text-[#059669]">{p.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#059669] h-full rounded-full" style={{ width: `${p.progress_percentage}%` }} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setProjectForm({ name: p.name, status: p.status, priority: p.priority, progress_percentage: p.progress_percentage, deadline: p.deadline || '' });
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Edit Project
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-slate-900">Workspace Profile</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleClientAction('UPDATE_PROFILE', profileForm); }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Business Name</label>
                <input
                  type="text"
                  value={profileForm.business_name}
                  onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Plan</label>
                <select
                  value={profileForm.plan}
                  onChange={(e) => setProfileForm({ ...profileForm, plan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="GROWTH">Growth</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* ── Modals ── */}
        {selectedConversation && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-sm font-bold text-slate-900">Conversation: {selectedConversation.customer_name}</h3>
                <button onClick={() => setSelectedConversation(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                {(selectedConversation.thread || []).map((msg) => (
                  <div key={msg.id} className={cn("p-2.5 rounded-xl max-w-[80%]", msg.type === 'OUTGOING' ? "ml-auto bg-emerald-600 text-white" : "mr-auto bg-slate-100 text-slate-800")}>
                    <p>{msg.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
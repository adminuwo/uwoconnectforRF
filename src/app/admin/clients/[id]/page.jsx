'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, MessageSquare, Globe, Bot, Brain, Mail,
  ShoppingBag, DollarSign, FileCheck, FileText, Receipt,
  Activity, ShieldCheck, ShieldAlert, CheckCircle2, XCircle,
  Clock, ArrowLeft, ExternalLink, RefreshCw, Loader2,
  Calendar, Layers, Sparkles, ChevronRight, Phone, Check, Eye,
  Sliders, Settings, AlertTriangle, Play, Pause, Power,
  ChevronDown, Filter, Search, Download, Trash2, Edit3, Plus,
  Send, UserCheck, UserX, ArrowUpRight, TrendingUp, AlertCircle,
  Smartphone, Share2, CornerDownRight, Inbox, Tag, File, Lock,
  Key, Cloud, BookOpen, Briefcase
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  ClientHealthBadge, 
  ChannelAccessMatrix, 
  QuotationConversionPipeline,
  AdminAddTeamMemberModal,
  AdminAssignProjectModal 
} from '@/components/admin/ClientIntelligenceComponents';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { CHANNEL_DEFINITIONS, GLOBAL_ACTIVE_CHANNELS } from '@/config/channelsConfig';

export default function ClientAdminDetailDashboard({ params }) {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || 'overview');
  
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Channel Access Management State
  const [channelAccessData, setChannelAccessData] = useState(null);
  const [togglingChannel, setTogglingChannel] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

  // Modals
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAssignProjectOpen, setIsAssignProjectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Activity Filters
  const [activityModuleFilter, setActivityModuleFilter] = useState('ALL');
  const [activitySearch, setActivitySearch] = useState('');

  // Edit Profile Form
  const [profileForm, setProfileForm] = useState({
    business_name: '',
    phone_number: '',
    address: '',
    plan: 'GROWTH',
    status: 'ACTIVE'
  });

  const fetchClientIntelligence = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/client-intelligence/clients/${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientData(res.data);

      if (res.data.client) {
        setProfileForm({
          business_name: res.data.client.business_name || '',
          phone_number: res.data.client.phone_number || '',
          address: res.data.client.address || '',
          plan: res.data.client.plan || 'GROWTH',
          status: res.data.client.status || 'ACTIVE'
        });
      }
    } catch (err) {
      console.error('Failed to fetch client intelligence', err);
      // Fallback
      try {
        const token = localStorage.getItem('token');
        const resFallback = await axios.get(`${API_BASE_URL}/api/admin/clients/${clientId}/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Adapt fallback format
        setClientData({
          client: {
            id: clientId,
            business_name: resFallback.data.overview?.business_name,
            owner_name: resFallback.data.overview?.client_name,
            email: resFallback.data.overview?.email,
            phone_number: resFallback.data.overview?.phone_number,
            plan: resFallback.data.overview?.plan || 'GROWTH',
            status: resFallback.data.overview?.status || 'ACTIVE',
            approval_status: 'APPROVED',
            created_at: resFallback.data.overview?.created_at,
            last_active: 'Recent',
            health: { score: 85, status: 'HEALTHY', label: 'Healthy' }
          },
          tabs: {
            overview: { summary_counts: {}, recent_activity: [] },
            projects: [],
            team: [],
            channels: [],
            channel_matrix: [],
            activity: resFallback.data.activityTimeline || [],
            bot_usage: { total_conversations: 0, total_messages: 0, daily_usage: [] },
            knowledge_base: { total_documents: 0, documents: [] },
            products: [],
            sales: { orders: [], total_revenue: 0 },
            invoices: [],
            proposals: [],
            quotations: []
          }
        });
      } catch (fallbackErr) {
        console.error('Fallback failed', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/client/${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannelAccessData(res.data);
    } catch (err) {
      console.error('Failed to fetch channel access data', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingAuditLogs(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/audit-logs/?client_id=${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(res.data.audit_logs || []);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  const handleToggleChannelAccess = async (channelKey, currentAccess) => {
    try {
      setTogglingChannel(channelKey);
      const token = localStorage.getItem('token');
      const newAccess = !currentAccess;
      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/client/${clientId}/`, {
        channel: channelKey,
        enabled: newAccess,
        notes: `Admin toggled ${channelKey} to ${newAccess ? 'ENABLED' : 'DISABLED'}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchChannelAccess();
      await fetchClientIntelligence();
      await fetchAuditLogs();
    } catch (err) {
      console.error('Failed to toggle channel access', err);
      alert(err?.response?.data?.error || 'Failed to update channel permission.');
    } finally {
      setTogglingChannel(null);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientIntelligence();
      fetchChannelAccess();
      fetchAuditLogs();
    }
  }, [clientId]);

  const handleAction = async (actionName, payload = {}) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${clientId}/action/`,
        { action: actionName, ...payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchClientIntelligence();
      setIsAddMemberOpen(false);
      setIsAssignProjectOpen(false);
      setIsEditProfileOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenClientWorkspace = async () => {
    if (!clientData?.client) return;
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
          client_name: clientData.client.business_name,
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
          <Loader2 className="animate-spin text-emerald-600" size={36} />
          <p className="text-xs font-semibold text-slate-400">Loading 360° Client Intelligence...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!clientData?.client) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-6xl mx-auto py-24 text-center">
          <h2 className="text-lg font-bold text-slate-800">Client intelligence profile not found</h2>
          <Link href="/admin/clients" className="mt-3 inline-block text-emerald-600 font-bold text-xs">
            &larr; Back to Clients Directory
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { client, tabs = {} } = clientData;
  const health = client.health || { score: 85, status: 'HEALTHY', label: 'Healthy' };

  const tabList = [
    { id: 'overview', label: 'Overview & Health', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Layers, count: tabs.projects?.length || 0 },
    { id: 'team', label: 'Team', icon: Users, count: tabs.team?.length || 0 },
    { id: 'channels', label: 'Channels', icon: Globe, count: tabs.channels?.filter(c => c.is_connected).length || 0 },
    { id: 'matrix', label: 'Channel Matrix', icon: ShieldCheck },

    { id: 'bot_usage', label: 'Bot & AI Usage', icon: Bot, count: tabs.bot_usage?.total_messages || 0 },
    { id: 'knowledge_base', label: 'Knowledge Base', icon: Brain, count: tabs.knowledge_base?.total_documents || 0 },
    { id: 'products', label: 'Products', icon: ShoppingBag, count: tabs.products?.length || 0 },
    { id: 'sales', label: 'Sales & Orders', icon: DollarSign, count: tabs.sales?.orders?.length || 0 },
    { id: 'invoices', label: 'Invoices', icon: Receipt, count: tabs.invoices?.length || 0 },
    { id: 'proposals', label: 'Proposals', icon: FileText, count: tabs.proposals?.length || 0 },
    { id: 'quotations', label: 'Quotations', icon: FileCheck, count: tabs.quotations?.length || 0 },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-24 px-4 sm:px-10 lg:px-12 font-sans">
        
        {/* ── 1. Top Breadcrumb & Navigation ── */}
        <div className="my-5 flex items-center justify-between">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Clients Directory
          </Link>
          <span className="text-xs text-slate-400 font-mono">Workspace #{client.id}</span>
        </div>

        {/* ── 2. Client 360° Header Banner ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-2xl uppercase shrink-0 border border-emerald-100 shadow-2xs">
              {(client.business_name || 'C')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {client.business_name}
                </h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                  client.approval_status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  client.approval_status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-rose-50 text-rose-700 border-rose-200"
                )}>
                  {client.approval_status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {client.plan} Plan
                </span>
                <ClientHealthBadge health={health} size="md" />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {client.owner_name} • {client.email} • {client.phone_number || 'No phone'} • Registered {client.created_at} • Last active {client.last_active}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleOpenClientWorkspace}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Open client workspace in secure view mode"
            >
              <ExternalLink size={14} /> Open Client Dashboard
            </button>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Team Member
            </button>
            <button
              onClick={() => setIsAssignProjectOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Layers size={14} className="text-blue-500" /> Assign Project
            </button>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="Edit Client"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {/* ── 3. 13-Tab Navigation Bar (Scrollable) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-2xs mb-6 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {tabList.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  <Icon size={14} className={cn(isActive ? "text-white" : "text-slate-400")} />
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. Tab Content Area ── */}
        <div>
          {/* TAB 1: OVERVIEW & HEALTH SCORE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Row 1: Health Score Deep Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-600" size={18} />
                      Client Operational Health Score
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Composite score based on channel connectivity, team size, project engagement, and commercial usage.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold font-mono text-slate-900">{health.score}/100</span>
                    <ClientHealthBadge health={health} size="md" showScore={false} />
                  </div>
                </div>

                {/* Factors grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {health.breakdown?.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[11px] text-slate-500 font-semibold">{item.factor}</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">+{item.points} pts</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5 uppercase">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>



              {/* Row 3: Pipeline & Channel Matrix Quick View */}
              <QuotationConversionPipeline
                quotations={tabs.quotations || []}
                proposals={tabs.proposals || []}
                invoices={tabs.invoices || []}
              />
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Client Projects & Team Assignments</h3>
                  <p className="text-xs text-slate-400">View project status, deadlines, assigned team members and assigned channels.</p>
                </div>
                <button
                  onClick={() => setIsAssignProjectOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={13} /> Assign Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabs.projects?.map((proj) => (
                  <div key={proj.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                          proj.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700" :
                          proj.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {proj.status}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">{proj.progress_percentage}% Done</span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900">{proj.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{proj.description || 'No description provided.'}</p>
                      
                      {/* Assigned Team Members */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span>Assigned Team ({proj.assigned_members?.length || 0}):</span>
                          <span className="text-[10px] text-slate-400">Deadline: {proj.deadline || 'None'}</span>
                        </div>
                        <div className="space-y-1.5">
                          {proj.assigned_members?.map((m) => (
                            <div key={m.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl">
                              <span className="font-semibold text-slate-800">{m.name}</span>
                              <span className="text-[10px] text-purple-700 font-bold uppercase">{m.enterprise_role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Total Team Management</h3>
                  <p className="text-xs text-slate-400">All registered users, assigned roles, projects, and permissions.</p>
                </div>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Team Member
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Member</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Department</th>
                        <th className="py-3 px-3">Assigned Projects</th>
                        <th className="py-3 px-3">Assigned Channels</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tabs.team?.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{m.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{m.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold uppercase">
                              {m.enterprise_role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{m.department}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800">
                              {m.assigned_projects?.length > 0 ? m.assigned_projects.join(', ') : 'None'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-700 font-semibold">
                              {m.assigned_channels?.length > 0 ? m.assigned_channels.join(', ') : 'All Granted (Admin)'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              m.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            )}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400 text-[11px]">{m.last_active_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHANNEL ACCESS CONTROL & GOVERNANCE */}
          {activeTab === 'channels' && (
            <div className="space-y-8 animate-in fade-in">
              
              {/* Header & Quick stats */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-600" size={20} />
                      Channel Feature Lock & Admin Access Control
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      Control which communication channels are authorized for this client workspace. Revoking access restricts client visibility and blocks team member assignments immediately.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        fetchChannelAccess();
                        fetchAuditLogs();
                      }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={13} className={cn(togglingChannel && "animate-spin")} />
                      <span>Refresh Permissions</span>
                    </button>
                  </div>
                </div>

                {/* Quick Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-slate-100">
                  {GLOBAL_ACTIVE_CHANNELS.map((chKey) => {
                    const chDef = CHANNEL_DEFINITIONS.find(c => c.key === chKey);
                    const isPermitted = channelAccessData?.channel_access?.[chKey] ?? (chKey === 'whatsapp' ? (client.whatsapp_enabled ?? true) : true);
                    const isConn = tabs.channels?.find(c => c.key === chKey)?.is_connected ?? false;

                    return (
                      <div key={chKey} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-2xs",
                            isPermitted ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                          )}>
                            {chKey === 'whatsapp' ? 'WA' : chKey === 'facebook' ? 'FB' : 'IG'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{chDef?.name || chKey}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              {isConn ? 'Account Connected' : 'Account Offline'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                            isPermitted ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                          )}>
                            {isPermitted ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Master Permission Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Platform Channels & Enterprise Connectors</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle channel authorization for this client. When enabled by Admin, the connector immediately appears and unlocks on the client&apos;s dashboard.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200/70">
                        <th className="py-3 px-5">Channel</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Admin Permission</th>
                        <th className="py-3 px-4">Client Connection</th>
                        <th className="py-3 px-5 text-right">Access Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {CHANNEL_DEFINITIONS.map((channel) => {
                        const isPermitted = channelAccessData?.channel_access?.[channel.key] !== undefined
                          ? Boolean(channelAccessData.channel_access[channel.key])
                          : channel.key === 'whatsapp'
                            ? Boolean(client.whatsapp_enabled ?? true)
                            : (channel.key === 'facebook' || channel.key === 'instagram')
                              ? true
                              : Boolean(client[`${channel.key}_enabled`]);
                        
                        const connObj = tabs.channels?.find(c => c.key === channel.key);
                        const isConnected = connObj?.is_connected ?? false;
                        const isToggling = togglingChannel === channel.key;

                        return (
                          <tr key={channel.key} className="hover:bg-slate-50/50 transition-colors">
                            {/* Channel */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                                  isPermitted ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" : "bg-slate-100 text-slate-400"
                                )}>
                                  {isPermitted ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Lock size={15} className="text-slate-400" />}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{channel.name}</span>
                                    {channel.isCore ? (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                        Core Channel
                                      </span>
                                    ) : !isPermitted ? (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200">
                                        Default Locked
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Custom Allotted
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">{channel.tagline}</div>
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                {channel.category}
                              </span>
                            </td>

                            {/* Admin Permission */}
                            <td className="py-4 px-4">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border",
                                isPermitted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                              )}>
                                {isPermitted ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                <span>{isPermitted ? 'Access Enabled' : 'Access Restricted'}</span>
                              </span>
                            </td>

                            {/* Client Connection */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                <span className="font-semibold text-slate-700">{isConnected ? 'Connected' : 'Not Connected'}</span>
                              </div>
                            </td>

                            {/* Action */}
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => handleToggleChannelAccess(channel.key, isPermitted)}
                                disabled={isToggling}
                                className={cn(
                                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50",
                                  isPermitted
                                    ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                )}
                              >
                                {isToggling ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : isPermitted ? (
                                  <Power size={12} />
                                ) : (
                                  <Check size={12} />
                                )}
                                <span>{isPermitted ? 'Revoke Access' : 'Grant Access'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Log Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      Channel Permission Audit Log
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Chronological record of admin permission changes for this workspace.</p>
                  </div>
                  
                  <span className="text-xs text-slate-400 font-mono font-semibold">
                    {auditLogs.length} Records
                  </span>
                </div>

                {loadingAuditLogs ? (
                  <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 size={15} className="animate-spin" />
                    <span>Loading audit records...</span>
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    No permission change events recorded yet for this client.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200/70">
                          <th className="py-2.5 px-3">Timestamp</th>
                          <th className="py-2.5 px-3">Admin</th>
                          <th className="py-2.5 px-3">Channel</th>
                          <th className="py-2.5 px-3">Action</th>
                          <th className="py-2.5 px-3">State Change</th>
                          <th className="py-2.5 px-3">Notes</th>
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
                            <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">
                              {log.notes || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: CHANNEL ACCESS MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 animate-in fade-in">
              <ChannelAccessMatrix
                team={tabs.team || []}
                channels={tabs.channels || []}
                onUpdateAccess={(userId, channels) => handleAction('UPDATE_CHANNEL_ACCESS', { user_id: userId, channels })}
                loading={actionLoading}
              />
            </div>
          )}



          {/* TAB 7: BOT & AI USAGE */}
          {activeTab === 'bot_usage' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold">Total Conversations</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{tabs.bot_usage?.total_conversations || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold">Total Messages</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{tabs.bot_usage?.total_messages || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold">AI Generated Replies</span>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">{tabs.bot_usage?.ai_responses || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold">User Queries</span>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1">{tabs.bot_usage?.user_queries || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: KNOWLEDGE BASE */}
          {activeTab === 'knowledge_base' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">RAG Knowledge Base Documents</h3>
                  <p className="text-xs text-slate-400">Total Storage: {tabs.knowledge_base?.total_size_formatted || '0 KB'}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100">
                {tabs.knowledge_base?.documents?.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Brain size={18} className="text-purple-600" />
                      <div>
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.file_size_formatted} • {doc.chunks_count} chunks indexed</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tabs.products?.map((p) => (
                  <div key={p.id} className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>{p.sku}</span>
                        <span className="text-emerald-700 uppercase">{p.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                      <div className="text-lg font-extrabold text-slate-900 mt-2 font-mono">
                        ${p.price}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between mt-3">
                      <span>Stock: {p.stock_quantity}</span>
                      <span className="text-emerald-600 font-bold">${p.revenue_generated} Revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SALES & ORDERS */}
          {activeTab === 'sales' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tabs.sales?.orders?.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">#{ord.id.slice(-6)}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{ord.customer_name}</td>
                        <td className="py-3 px-3 font-mono font-bold">${ord.total_amount}</td>
                        <td className="py-3 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            ord.payment_status === 'PAID' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {ord.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">{ord.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Invoice Number</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Payment Status</th>
                      <th className="py-3 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tabs.invoices?.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{inv.invoice_number}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{inv.customer_name}</td>
                        <td className="py-3 px-3 font-mono font-bold">{inv.currency_symbol}{inv.total}</td>
                        <td className="py-3 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            inv.payment_status === 'PAID' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {inv.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">{inv.invoice_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: PROPOSALS */}
          {activeTab === 'proposals' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Proposal Number</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tabs.proposals?.map((prop) => (
                      <tr key={prop.id}>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{prop.document_number}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{prop.customer_name}</td>
                        <td className="py-3 px-3 font-mono font-bold">{prop.currency_symbol}{prop.grand_total}</td>
                        <td className="py-3 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            prop.status === 'ACCEPTED' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {prop.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">{prop.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 13: QUOTATIONS */}
          {activeTab === 'quotations' && (
            <div className="space-y-6 animate-in fade-in">
              <QuotationConversionPipeline
                quotations={tabs.quotations || []}
                proposals={tabs.proposals || []}
                invoices={tabs.invoices || []}
              />

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Quotation Number</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Valid Until</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tabs.quotations?.map((q) => (
                      <tr key={q.id}>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{q.document_number}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{q.customer_name}</td>
                        <td className="py-3 px-3 font-mono font-bold">{q.currency_symbol}{q.grand_total}</td>
                        <td className="py-3 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            q.status === 'ACCEPTED' || q.status === 'CONVERTED' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">{q.valid_until}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Modals ── */}
        <AdminAddTeamMemberModal
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          onSubmit={(data) => handleAction('ADD_TEAM_MEMBER', data)}
          projects={tabs.projects || []}
          loading={actionLoading}
        />

        <AdminAssignProjectModal
          isOpen={isAssignProjectOpen}
          onClose={() => setIsAssignProjectOpen(false)}
          onSubmit={(data) => handleAction('ASSIGN_PROJECT_MEMBER', data)}
          projects={tabs.projects || []}
          team={tabs.team || []}
          loading={actionLoading}
        />

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-xs">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Edit Client Profile</h3>
                <button onClick={() => setIsEditProfileOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAction('EDIT_PROFILE', profileForm); }} className="p-6 space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={profileForm.business_name}
                    onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
                    <select
                      value={profileForm.plan}
                      onChange={(e) => setProfileForm({ ...profileForm, plan: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                    >
                      <option value="FREE">Free</option>
                      <option value="STARTER">Starter</option>
                      <option value="GROWTH">Growth</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={profileForm.status}
                      onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="TRIAL">Trial</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl shadow-2xs">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
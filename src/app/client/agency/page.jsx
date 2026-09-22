'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Globe, ShieldCheck, Plus, Search, 
  CheckCircle2, AlertCircle, Clock, ExternalLink, RefreshCw, 
  Settings, CreditCard, Sparkles, X, Check, KeyRound, 
  Layers, Lock, Phone, Mail, ArrowUpRight, ChevronRight, Loader2,
  DollarSign, Edit3, Save, Copy, CheckCheck, Palette, CheckSquare
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';
import { cn } from '@/lib/utils';

export default function AgencyAdminDashboard() {
  const { brand } = useBrand();
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'plans' | 'branding'
  const [stats, setStats] = useState(null);
  const [subClients, setSubClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  // Plans Management State
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansSaving, setPlansSaving] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);

  // Create Sub-Client Form State
  const [formState, setFormState] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    owner_name: '',
    password: 'Welcome@2026',
    plan: 'STARTER'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAgencyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, subClientsRes, plansRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/agency/stats/`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/agency/sub-clients/`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/agency/plans/`, { headers }).catch(() => ({ data: { custom_plans: [] } }))
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (Array.isArray(subClientsRes.data)) setSubClients(subClientsRes.data);
      if (plansRes.data?.custom_plans) setPlans(plansRes.data.custom_plans);
    } catch (err) {
      console.error('Failed to load agency dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyData();
  }, []);

  const handleSubClientAction = async (clientId, action, extraPayload = {}) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/agency/sub-clients/${clientId}/action/`,
        { action, ...extraPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message || 'Action executed successfully!');
      fetchAgencyData();
      setIsPasswordModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubClient = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/agency/sub-clients/`,
        formState,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message || 'New Sub-Client Workspace provisioned!');
      setIsCreateModalOpen(false);
      setFormState({
        business_name: '',
        email: '',
        phone_number: '',
        owner_name: '',
        password: 'Welcome@2026',
        plan: 'STARTER'
      });
      fetchAgencyData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register sub-client');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlanPriceChange = (index, field, value) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const handleSavePlans = async () => {
    try {
      setPlansSaving(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/agency/plans/`,
        { custom_plans: plans },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message || 'Plans & Pricing updated for your sub-clients!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save plans');
    } finally {
      setPlansSaving(false);
    }
  };

  const filteredSubClients = subClients.filter(c => {
    const matchesSearch = (
      c.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone_number?.includes(searchQuery)
    );
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && c.status === filterStatus;
  });

  const agencyDomain = stats?.custom_domain || brand?.custom_domain || '';
  const themeColor = stats?.theme_color || brand?.primary_color || '#2563EB';

  const copyCnameValue = () => {
    navigator.clipboard.writeText('aisa24.com');
    setCopiedCname(true);
    setTimeout(() => setCopiedCname(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      
      {/* ── Toast Alert ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Agency Hero Banner ── */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/10"
        style={{ background: `linear-gradient(135deg, ${themeColor}, #0f172a 85%)` }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide">
              <ShieldCheck size={14} className="text-white" />
              <span>WHITE-LABEL RESELLER COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {stats?.agency_name || 'Agency Command Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
              Manage your sub-clients, customize subscription prices, approve client signups, and collect 100% direct payments to your connected Razorpay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Provision Sub-Client</span>
            </button>
            <Link
              href="/client/payments"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <CreditCard size={14} />
              <span>My Razorpay Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Top-Level Tab Switcher ── */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 inline-flex flex-wrap items-center gap-1.5 shadow-inner">
        <button
          onClick={() => setActiveTab('clients')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === 'clients'
              ? "bg-white text-slate-900 shadow-md font-black border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          )}
        >
          <Users size={15} className={activeTab === 'clients' ? "text-blue-600" : "text-slate-400"} />
          <span>1. Sub-Clients & Workspaces</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
            {subClients.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ring-2 ring-transparent",
            activeTab === 'plans'
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/80 font-extrabold animate-pulse hover:animate-none"
          )}
        >
          <DollarSign size={15} className={activeTab === 'plans' ? "text-white" : "text-emerald-600"} />
          <span>2. 💰 Edit Sub-Client Plans & Pricing (Sale Markup)</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            activeTab === 'branding'
              ? "bg-white text-slate-900 shadow-md font-black border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          )}
        >
          <Palette size={15} className={activeTab === 'branding' ? "text-blue-600" : "text-slate-400"} />
          <span>3. Brand Identity & DNS</span>
        </button>
      </div>

      {/* ── 3. KPI Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sub-Clients */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sub-Clients</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats?.total_sub_clients || subClients.length}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Registered under your brand</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
        </div>

        {/* Active Workspaces */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Workspaces</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {stats?.active_workspaces || subClients.filter(c => c.status === 'APPROVED').length}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">100% Live on portal</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Custom Domains */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Custom Domains</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {subClients.filter(c => c.domain || c.white_label_domain).length || 0}
            </div>
            <span className="text-[11px] text-slate-400 font-bold mt-1 inline-block">White-label branded</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Globe size={22} />
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Razorpay Gateway</span>
            <div className="text-sm font-black text-slate-900 mt-1.5 flex items-center gap-1.5">
              {stats?.gateway_connected ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-black">
                  <CheckCircle2 size={14} /> Connected ({stats.gateway_mode})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 font-black">
                  <AlertCircle size={14} /> Not Connected
                </span>
              )}
            </div>
            <Link href="/client/payments" className="text-[11px] text-blue-600 hover:underline font-bold mt-1 inline-block">
              Manage Gateway ➔
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* ── TAB 1: Sub-Clients Directory ── */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in">
          
          {/* Table Top Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>My Agency Sub-Clients</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {filteredSubClients.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Clients registered on your custom domain <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-bold">{agencyDomain || 'portal.youragency.com'}</code>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sub-clients..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all w-52 sm:w-64"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                {['ALL', 'APPROVED', 'PENDING'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      filterStatus === st 
                        ? "bg-white text-slate-900 shadow-xs font-black" 
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* + Register Sub-Client Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Register Sub-Client</span>
              </button>
            </div>
          </div>

          {/* Sub-Clients Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Client Business</th>
                  <th className="py-3.5 px-6">Contact &amp; Email</th>
                  <th className="py-3.5 px-6">Plan</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Usage Metrics</th>
                  <th className="py-3.5 px-6">Registered On</th>
                  <th className="py-3.5 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
                      <span>Loading agency sub-clients...</span>
                    </td>
                  </tr>
                ) : filteredSubClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Users size={20} />
                      </div>
                      <div className="font-bold text-slate-700">No Sub-Clients Found</div>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        When customers sign up on <span className="font-mono text-blue-600 font-bold">{agencyDomain || 'your domain'}</span> or you click "+ Register Sub-Client", they will appear here!
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Business Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                            {client.logo_url ? (
                              <img src={client.logo_url} alt={client.business_name} className="w-full h-full object-contain" />
                            ) : (
                              <span>{client.business_name?.charAt(0)?.toUpperCase() || 'C'}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-xs">{client.business_name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{client.owner_name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div className="font-mono text-[11px] text-slate-800 font-bold">{client.email}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{client.phone_number || 'No phone'}</div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {client.plan}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        {client.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : client.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock size={10} /> Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertCircle size={10} /> Suspended
                          </span>
                        )}
                      </td>

                      {/* Usage Metrics */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span className="font-bold text-slate-700">{(client.usage?.messages || 0).toLocaleString()}</span> msgs
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="font-bold text-slate-700">{(client.usage?.contacts || 0).toLocaleString()}</span> contacts
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            <span className="font-bold text-slate-700">{(client.usage?.products || 0).toLocaleString()}</span> products
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span className="font-bold text-slate-700">{(client.usage?.knowledge_docs || 0).toLocaleString()}</span> AI docs
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-[11px] text-slate-400 font-mono">
                        {client.created_at || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {client.status === 'PENDING' && (
                            <button
                              onClick={() => handleSubClientAction(client.id, 'APPROVE')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {client.status === 'APPROVED' ? (
                            <button
                              onClick={() => handleSubClientAction(client.id, 'SUSPEND')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : client.status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleSubClientAction(client.id, 'REACTIVATE')}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Reactivate
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Reset Sub-Client Password"
                          >
                            <KeyRound size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: Sub-Client Plans & Pricing Manager ── */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-200">
                <Sparkles size={12} className="text-emerald-600" />
                <span>Zero-Code Profit Markup System</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Set Your Reseller Profit Margins</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Super Admin sets the base platform cost. You simply add your <strong>Extra Profit Markup</strong>. Your sub-clients will see <strong>(Base Cost + Your Margin)</strong> as the final price, and 100% of your profit goes to your connected Razorpay!
              </p>
            </div>
            <button
              onClick={handleSavePlans}
              disabled={plansSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {plansSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>Save & Publish Prices</span>
            </button>
          </div>

          {/* 3 Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const baseMonthly = plan.base_monthly_price || (plan.slug === 'starter' ? 499 : plan.slug === 'growth' ? 999 : 2499);
              const markupMonthly = Number(plan.markup_monthly !== undefined ? plan.markup_monthly : (plan.price_monthly - baseMonthly));
              const finalMonthly = baseMonthly + (markupMonthly > 0 ? markupMonthly : 0);

              const baseY = plan.base_yearly_price || (plan.slug === 'starter' ? 4999 : plan.slug === 'growth' ? 9999 : 24999);
              const markupY = Number(plan.markup_yearly !== undefined ? plan.markup_yearly : (plan.price_yearly - baseY));
              const finalY = baseY + (markupY > 0 ? markupY : 0);

              const handleQuickMarkup = (amount) => {
                const updated = [...plans];
                updated[idx] = {
                  ...updated[idx],
                  markup_monthly: amount,
                  price_monthly: baseMonthly + amount,
                  markup_yearly: amount * 10,
                  price_yearly: baseY + (amount * 10)
                };
                setPlans(updated);
              };

              return (
                <div 
                  key={plan.slug || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                          {plan.slug}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">{plan.name}</h4>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Active Tier
                      </span>
                    </div>

                    {/* 1. Monthly Pricing Breakdown */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400">🔒 Super Admin Base Cost:</span>
                        <span className="font-mono font-black text-slate-700">₹{baseMonthly} / mo</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>➕ Your Extra Profit Margin:</span>
                          <span className="text-emerald-600 font-extrabold">+₹{markupMonthly > 0 ? markupMonthly : 0}</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-sm">+₹</span>
                          <input
                            type="number"
                            value={markupMonthly >= 0 ? markupMonthly : 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...plans];
                              updated[idx] = {
                                ...updated[idx],
                                markup_monthly: val,
                                price_monthly: baseMonthly + val
                              };
                              setPlans(updated);
                            }}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border-2 border-emerald-400 rounded-xl font-black text-slate-900 text-base outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
                            placeholder="e.g. 1500"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
                          {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => handleQuickMarkup(amt)}
                              className="px-2 py-0.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              +₹{amt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Final Customer Price Result */}
                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Sells At:</span>
                          <span className="text-lg font-black text-slate-900 leading-none">₹{finalMonthly}</span>
                          <span className="text-[10px] text-slate-400 font-medium"> / month</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-600 block">Your Net Profit:</span>
                          <span className="text-sm font-black text-emerald-600">₹{markupMonthly > 0 ? markupMonthly : 0} / mo</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Yearly Pricing Breakdown */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400">🔒 Base Yearly Cost:</span>
                        <span className="font-mono font-bold text-slate-700">₹{baseY} / yr</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">➕ Extra Yearly Margin:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-bold text-xs">+₹</span>
                          <input
                            type="number"
                            value={markupY >= 0 ? markupY : 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const updated = [...plans];
                              updated[idx] = {
                                ...updated[idx],
                                markup_yearly: val,
                                price_yearly: baseY + val
                              };
                              setPlans(updated);
                            }}
                            className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-xs text-right outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Customer Yearly Price:</span>
                        <span className="text-sm font-black text-blue-700">₹{finalY} / yr</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Included Features for Sub-Clients</span>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {(plan.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: Branding & DNS Setup ── */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Brand Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Palette size={18} className="text-blue-600" />
              <span>Brand Identity & Logo</span>
            </h3>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-xs">
                <img 
                  src={stats?.brand_logo || brand?.logo_url || "/download (3).gif"} 
                  alt="Brand Logo" 
                  width={56}
                  height={56}
                  style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-black text-slate-900 text-sm">{stats?.agency_name || brand?.brand_name}</div>
                <div className="text-xs text-slate-500 mt-0.5">Primary Theme: <span className="font-mono font-bold" style={{ color: themeColor }}>{themeColor}</span></div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              To edit your logo, color palette, company tax GSTIN, or footer copy, visit your full account settings.
            </p>

            <Link
              href="/client/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Settings size={14} />
              <span>Open Branding Settings</span>
            </Link>
          </div>

          {/* CNAME DNS Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              <span>Custom Domain & CNAME</span>
            </h3>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Configured Custom Domain</span>
              <div className="font-mono text-xs font-bold text-blue-700 bg-blue-50/80 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                <span>{agencyDomain || 'portal.youragency.com'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">ACTIVE</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DNS CNAME Record Target</span>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                <span>aisa24.com</span>
                <button
                  onClick={copyCnameValue}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {copiedCname ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedCname ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Point your domain's CNAME to <code className="font-mono font-bold text-slate-700">aisa24.com</code> in Cloudflare or GoDaddy for zero-downtime routing with free SSL.
            </p>
          </div>
        </div>
      )}

      {/* ── 4. Create New Sub-Client Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Provision Sub-Client Workspace</h3>
                  <p className="text-xs text-slate-500">Create an isolated client account under your agency</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubClient} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Client Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.business_name}
                  onChange={(e) => setFormState({ ...formState, business_name: e.target.value })}
                  placeholder="e.g. Dr. Sharma Dental Clinic"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Client Admin Email (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="doctor@clinic.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formState.phone_number}
                    onChange={(e) => setFormState({ ...formState, phone_number: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.password}
                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Sub-Client Plan
                  </label>
                  <select
                    value={formState.plan}
                    onChange={(e) => setFormState({ ...formState, plan: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                  >
                    <option value="STARTER">Starter Plan</option>
                    <option value="GROWTH">Growth Plan</option>
                    <option value="ADVANCED">Advanced Plan</option>
                    <option value="ENTERPRISE">Enterprise Plan</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-blue-900 leading-relaxed">
                <strong>Sub-Client Isolation:</strong> This client will log in on your domain <code className="bg-white px-1 py-0.5 rounded font-bold font-mono text-blue-700">{agencyDomain || 'portal.apex.com'}</code> and will only see your custom brand name and logo!
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Register Sub-Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. Reset Password Modal ── */}
      {isPasswordModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <KeyRound size={16} className="text-blue-600" />
                <span>Reset Password</span>
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Set a new password for <span className="font-bold text-slate-800">{selectedClient.business_name}</span> ({selectedClient.email}):
            </p>

            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubClientAction(selectedClient.id, 'CHANGE_PASSWORD', { new_password: newPassword })}
                disabled={actionLoading || newPassword.length < 6}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Save Password'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

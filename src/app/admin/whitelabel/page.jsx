'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Globe, Plus, Search, RefreshCw, ExternalLink, ShieldCheck, Sparkles,
  Building2, CheckCircle2, AlertCircle, Copy, Check, Eye, Edit3, Trash2,
  Users, Layers, ArrowRight, Loader2, Palette, Mail, Smartphone, ArrowUpRight,
  HelpCircle, X, Camera, Upload, Sliders, DollarSign, CreditCard, TrendingUp, Receipt
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function AdminWhiteLabelPage() {
  const [mainTab, setMainTab] = useState('partners'); // 'partners' | 'revenue'
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ACTIVE_DOMAIN, PENDING_DOMAIN
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCnameModalOpen, setIsCnameModalOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for Adding / Editing White Label Partner
  const [provisionMode, setProvisionMode] = useState('NEW'); // 'NEW' or 'EXISTING'
  const [formState, setFormState] = useState({
    clientId: '',
    business_name: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    owner_password: '',
    white_label_name: '',
    white_label_domain: '',
    white_label_logo: '',
    primary_color: '#059669',
    accent_color: '#10B981',
    support_email: '',
    tagline: 'Multi-channel automation platform',
    is_agency: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getValidAdminToken = () => {
    if (typeof window === 'undefined') return '';
    const backupToken = localStorage.getItem('admin_backup_token');
    const backupUser = localStorage.getItem('admin_backup_user');
    const currentToken = localStorage.getItem('token') || localStorage.getItem('uwo_token');
    const userStr = localStorage.getItem('user');

    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role !== 'ADMIN' && backupToken && backupUser) {
          localStorage.setItem('token', backupToken);
          localStorage.setItem('uwo_token', backupToken);
          localStorage.setItem('user', backupUser);
          localStorage.removeItem('admin_backup_token');
          localStorage.removeItem('admin_backup_user');
          localStorage.removeItem('impersonation_session');
          return backupToken;
        }
      } catch (e) {}
    }
    return currentToken;
  };

  const fetchClients = async () => {
    try {
      setIsFetching(true);
      const token = getValidAdminToken();
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/admin/clients-directory/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 150 }
      });
      setClients(res.data?.results || []);
    } catch (err) {
      console.error('Failed to fetch clients for white label hub', err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      setRevenueLoading(true);
      const token = getValidAdminToken();
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/admin/whitelabel/revenue/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueData(res.data);
    } catch (err) {
      console.error('Failed to fetch white-label revenue analytics', err);
    } finally {
      setRevenueLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchRevenueData();
  }, []);

  // Filter white-label agencies and regular clients
  const { whiteLabelAgencies, regularClients } = useMemo(() => {
    const wl = [];
    const regular = [];

    clients.forEach(c => {
      const hasDomain = Boolean(c.white_label_domain || c.settings?.custom_domain);
      const hasWlName = Boolean(c.white_label_name);
      if (hasDomain || hasWlName) {
        wl.push(c);
      } else {
        regular.push(c);
      }
    });

    return { whiteLabelAgencies: wl, regularClients: regular };
  }, [clients]);

  // Filtered list based on search and tab
  const filteredAgencies = useMemo(() => {
    return whiteLabelAgencies.filter(c => {
      const domain = (c.white_label_domain || c.settings?.custom_domain || '').toLowerCase();
      const name = (c.white_label_name || c.business_name || c.company_name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch = !query || domain.includes(query) || name.includes(query) || email.includes(query);

      if (!matchesSearch) return false;
      if (filterType === 'ACTIVE_DOMAIN') return Boolean(domain);
      if (filterType === 'PENDING_DOMAIN') return !domain;
      return true;
    });
  }, [whiteLabelAgencies, search, filterType]);

  // Open Edit / Configure Modal
  const handleOpenEdit = (client) => {
    setSelectedAgency(client);
    setProvisionMode('EXISTING');
    const s = client.settings && typeof client.settings === 'object' ? client.settings : {};
    setFormState({
      clientId: client.id,
      business_name: client.business_name || client.company_name || '',
      owner_name: client.client_name || client.name || '',
      owner_email: client.email || '',
      owner_phone: client.phone || client.phone_number || '',
      owner_password: '',
      white_label_name: client.white_label_name || client.business_name || client.company_name || '',
      white_label_domain: client.white_label_domain || s.custom_domain || '',
      white_label_logo: client.white_label_logo || client.company_logo_url || '',
      primary_color: s.primary_color || '#059669',
      accent_color: s.accent_color || '#10B981',
      support_email: s.support_email || client.email || '',
      tagline: s.tagline || 'Multi-channel automation platform',
      is_agency: true
    });
    setIsEditModalOpen(true);
  };

  // Open Create New Modal (defaults to Brand New Agency mode)
  const handleOpenCreate = () => {
    setSelectedAgency(null);
    setProvisionMode('NEW');
    setFormState({
      clientId: regularClients[0]?.id || '',
      business_name: '',
      owner_name: '',
      owner_email: '',
      owner_phone: '',
      owner_password: 'Welcome@2026',
      white_label_name: '',
      white_label_domain: '',
      white_label_logo: '',
      primary_color: '#059669',
      accent_color: '#10B981',
      support_email: '',
      tagline: 'Multi-channel automation platform',
      is_agency: true
    });
    setIsEditModalOpen(true);
  };

  // Save White-Label Configuration
  const handleSaveWhiteLabel = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const cleanDomain = (formState.white_label_domain || '').toLowerCase().replace(/^(https?:\/\/)/, '').trim();

      // Case A: Create Brand New Agency from Scratch
      if (provisionMode === 'NEW' && !selectedAgency) {
        if (!formState.business_name && !formState.white_label_name) {
          alert('Please enter the Agency Business Name.');
          setSaving(false);
          return;
        }
        if (!formState.owner_email) {
          alert('Please enter the Admin Owner Email address.');
          setSaving(false);
          return;
        }

        const createPayload = {
          business_name: formState.business_name || formState.white_label_name,
          email: formState.owner_email.toLowerCase().trim(),
          phone_number: formState.owner_phone || '',
          plan: 'AGENCY',
          white_label_name: formState.white_label_name || formState.business_name,
          white_label_domain: cleanDomain,
          white_label_logo: formState.white_label_logo || '',
          settings: {
            primary_color: formState.primary_color,
            accent_color: formState.accent_color,
            support_email: formState.support_email || formState.owner_email,
            tagline: formState.tagline,
            custom_domain: cleanDomain
          }
        };

        const res = await axios.post(`${API_BASE_URL}/api/clients/`, createPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Set password and ensure APPROVED status for immediate login
        if (res.data?.id) {
          try {
            await axios.post(
              `${API_BASE_URL}/api/admin/client-intelligence/clients/${res.data.id}/action/`,
              { action: 'APPROVE' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (formState.owner_password) {
              await axios.post(
                `${API_BASE_URL}/api/admin/client-intelligence/clients/${res.data.id}/action/`,
                { action: 'CHANGE_PASSWORD', new_password: formState.owner_password },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
          } catch (pErr) {}
        }

        showToast(`New White-Label Agency '${formState.white_label_name || formState.business_name}' created & provisioned successfully!`);
      } else {
        // Case B: Upgrade Existing Client or Edit Existing Partner
        const targetId = selectedAgency?.id || formState.clientId;
        if (!targetId) {
          alert('Please select a client workspace.');
          setSaving(false);
          return;
        }

        const payload = {
          action: 'EDIT_PROFILE',
          business_name: formState.business_name || formState.white_label_name,
          white_label_name: formState.white_label_name,
          white_label_domain: cleanDomain,
          white_label_logo: formState.white_label_logo,
          primary_color: formState.primary_color,
          accent_color: formState.accent_color,
          support_email: formState.support_email,
          tagline: formState.tagline
        };

        await axios.post(
          `${API_BASE_URL}/api/admin/client-intelligence/clients/${targetId}/action/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        showToast(`White-Label settings updated for '${formState.white_label_name || 'Agency'}'!`);
      }

      setIsEditModalOpen(false);
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save White-Label configuration');
    } finally {
      setSaving(false);
    }
  };

  // Direct Image File Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('File size exceeds 4MB limit. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      if (base64) {
        setFormState(prev => ({ ...prev, white_label_logo: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Workspace Impersonation
  const handleAccessWorkspace = async (client) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
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
        localStorage.setItem('uwo_token', res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('impersonation_session', JSON.stringify({
          client_id: client.id,
          client_name: client.white_label_name || client.business_name || client.company_name,
          admin_name: res.data.impersonating?.impersonator_name || 'Admin'
        }));

        window.location.href = '/client';
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open agency workspace.');
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-24 px-4 sm:px-10 lg:px-12 font-sans">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-emerald-800 text-white border border-emerald-700 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── 1. Page Header & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                <Globe size={20} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  White-Label & Reseller Command Center
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  Configure custom partner domains, brand assets, color themes, and agency sub-client quotas without deploying separate frontends.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsCnameModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle size={14} className="text-slate-500" /> DNS Instructions
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus size={15} /> Provision White-Label Agency
            </button>
            <button
              onClick={fetchClients}
              disabled={isFetching}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh partners"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin text-emerald-600" : ""} />
            </button>
          </div>
        </div>

        {/* ── Top-Level Tab Switcher ── */}
        <div className="flex items-center gap-2 mb-8 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 w-fit shadow-inner">
          <button
            onClick={() => setMainTab('partners')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
              mainTab === 'partners'
                ? "bg-white text-slate-900 shadow-md font-black border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <Globe size={15} className={mainTab === 'partners' ? "text-emerald-600" : "text-slate-400"} />
            <span>White-Label Agencies & Portals</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {whiteLabelAgencies.length}
            </span>
          </button>

          <button
            onClick={() => {
              setMainTab('revenue');
              fetchRevenueData();
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
              mainTab === 'revenue'
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            )}
          >
            <DollarSign size={15} className={mainTab === 'revenue' ? "text-white" : "text-emerald-600"} />
            <span>💰 White-Label Revenue & Inflow Breakdown</span>
            {revenueData?.total_white_label_revenue > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black">
                ₹{Number(revenueData.total_white_label_revenue).toLocaleString()}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB 1: White-Label Agencies Grid ── */}
        {mainTab === 'partners' && (
          <>
            {/* ── 2. KPI Metrics Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active WL Agencies</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{whiteLabelAgencies.length}</h3>
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">● Multi-tenant active</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Building2 size={22} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Custom Domains Live</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {whiteLabelAgencies.filter(a => a.white_label_domain || a.settings?.custom_domain).length}
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">CNAME Points to Central IP</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe size={22} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Agency Sub-Workspaces</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {clients.reduce((acc, curr) => acc + (curr.team_members || 1), 0)}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Isolated Tenant Users</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users size={22} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Architecture Status</p>
                  <h3 className="text-base font-black text-emerald-700 mt-1">Single Codebase</h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">Zero frontend clones required</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
              </div>

            </div>

            {/* ── 3. Filters & Search Bar ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    filterType === 'ALL' ? "bg-slate-900 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  All White-Label Partners ({whiteLabelAgencies.length})
                </button>
                <button
                  onClick={() => setFilterType('ACTIVE_DOMAIN')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    filterType === 'ACTIVE_DOMAIN' ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Active Custom Domains ({whiteLabelAgencies.filter(a => a.white_label_domain || a.settings?.custom_domain).length})
                </button>
                <button
                  onClick={() => setFilterType('PENDING_DOMAIN')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    filterType === 'PENDING_DOMAIN' ? "bg-amber-600 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Domain Pending ({whiteLabelAgencies.filter(a => !(a.white_label_domain || a.settings?.custom_domain)).length})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search partner, domain, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* ── 4. White-Label Partners Grid ── */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-500">Loading White-Label Reseller Directory...</p>
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Globe size={32} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">No White-Label Agencies Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
                  You haven't provisioned any White-Label reseller agencies yet, or no agencies match your search query.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Provision First White-Label Partner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => {
                  const domain = agency.white_label_domain || agency.settings?.custom_domain || '';
                  const brandName = agency.white_label_name || agency.business_name || agency.company_name;
                  const logo = agency.white_label_logo || agency.company_logo_url || '/download (3).gif';
                  const primaryColor = agency.settings?.primary_color || '#059669';

                  return (
                    <div 
                      key={agency.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                    >
                      {/* Top Color Accent Ribbon */}
                      <div className="h-2 w-full" style={{ backgroundColor: primaryColor }} />

                      <div className="p-6 space-y-4">
                        {/* Header: Logo & Name */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                              <img src={logo} alt={brandName} className="w-full h-full object-contain rounded-xl" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base font-extrabold text-slate-900 truncate">{brandName}</h3>
                              <span className="text-[10px] font-bold text-slate-400 block truncate">
                                {agency.email || agency.client_name || 'Partner Workspace'}
                              </span>
                            </div>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {agency.plan || 'AGENCY'}
                          </span>
                        </div>

                        {/* Domain & DNS Status */}
                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Custom Portal Domain</span>
                            {domain ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <CheckCircle2 size={11} /> CNAME Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                <AlertCircle size={11} /> No Domain Set
                              </span>
                            )}
                          </div>

                          {domain ? (
                            <a
                              href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? `http://localhost:3000/?brand_domain=${domain}` : `https://${domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 bg-white p-2 rounded-xl border border-slate-200 group/link"
                              title="Open Live Brand Portal"
                            >
                              <span className="truncate">https://{domain}</span>
                              <ExternalLink size={12} className="shrink-0 text-slate-400 group-hover/link:text-emerald-700" />
                            </a>
                          ) : (
                            <div className="text-xs font-mono text-slate-400 italic bg-white p-2 rounded-xl border border-slate-200">
                              Domain not configured yet
                            </div>
                          )}
                        </div>

                        {/* Telemetry Chips */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block">Theme Color</span>
                            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                              <div className="w-3.5 h-3.5 rounded-md border border-slate-300" style={{ backgroundColor: primaryColor }} />
                              <span className="font-mono font-bold text-slate-700 text-[11px]">{primaryColor}</span>
                            </div>
                          </div>
                          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block">Team Members</span>
                            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{agency.team_members || 1} Seats</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccessWorkspace(agency)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex-1 justify-center"
                        >
                          <Sparkles size={13} />
                          <span>Impersonate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(agency)}
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer"
                          title="Edit Branding & Domain"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAgency(agency);
                            setIsPreviewModalOpen(true);
                          }}
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer"
                          title="Preview Live Portal Theme"
                        >
                          <Eye size={14} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── TAB 2: White-Label Revenue Intelligence & Inflow Breakdown ── */}
        {mainTab === 'revenue' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Revenue KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Revenue */}
              <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total WL Revenue Inflow</span>
                <div className="text-3xl font-black mt-1 text-emerald-400">
                  ₹{Number(revenueData?.total_white_label_revenue || 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-300 font-medium mt-1 inline-block">Direct Razorpay Collection</span>
              </div>

              {/* WL Agencies */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Partner Portals</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{revenueData?.total_agencies_count || whiteLabelAgencies.length}</div>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Generating Sub-Clients</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 size={22} />
                </div>
              </div>

              {/* Sub-Client Subscriptions */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sub-Client Subscriptions</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{revenueData?.total_sub_clients_count || 0}</div>
                  <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">Under Agency Networks</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Users size={22} />
                </div>
              </div>

              {/* Total Paid Orders */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Transactions</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{revenueData?.total_transactions_count || 0}</div>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Razorpay Verified</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Receipt size={22} />
                </div>
              </div>

            </div>

            {/* ── Per-Agency Revenue Breakdown Table ── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Per-Agency Revenue Performance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live breakdown of payments collected across each white-label agency portal.
                  </p>
                </div>
                <button
                  onClick={fetchRevenueData}
                  disabled={revenueLoading}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer"
                  title="Refresh Revenue Data"
                >
                  <RefreshCw size={14} className={revenueLoading ? "animate-spin text-emerald-600" : ""} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Agency Brand</th>
                      <th className="py-3.5 px-6">Custom Domain</th>
                      <th className="py-3.5 px-6">Owner & Contact</th>
                      <th className="py-3.5 px-6 text-center">Sub-Clients</th>
                      <th className="py-3.5 px-6 text-right">Total Revenue Inflow</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {revenueLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Loader2 size={24} className="animate-spin mx-auto mb-2 text-emerald-600" />
                          <span>Calculating white-label revenue...</span>
                        </td>
                      </tr>
                    ) : (revenueData?.agency_breakdown || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No White-Label Agencies Found
                        </td>
                      </tr>
                    ) : (
                      (revenueData?.agency_breakdown || []).map((ag) => (
                        <tr key={ag.agency_id} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Brand */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                <img src={ag.logo_url} alt={ag.agency_name} className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <div className="font-black text-slate-900 text-xs">{ag.agency_name}</div>
                                <div className="text-[10px] text-slate-400">Partner ID: {ag.agency_id.slice(-6)}</div>
                              </div>
                            </div>
                          </td>

                          {/* Domain */}
                          <td className="py-4 px-6">
                            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              {ag.custom_domain}
                            </span>
                          </td>

                          {/* Owner */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-slate-800">{ag.owner_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{ag.owner_email}</div>
                            </div>
                          </td>

                          {/* Sub-Clients */}
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                              <Users size={11} /> {ag.total_sub_clients} Clients
                            </span>
                          </td>

                          {/* Revenue */}
                          <td className="py-4 px-6 text-right">
                            <div className="text-sm font-black text-slate-900">
                              ₹{Number(ag.total_revenue_generated || 0).toLocaleString()}
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold">100% Inflow</span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                const matchedClient = clients.find(c => String(c.id) === String(ag.agency_id));
                                if (matchedClient) handleAccessWorkspace(matchedClient);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Open Agency Hub
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Sub-Clients Recent Plan Purchases Feed ── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Recent Sub-Client Plan Subscriptions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transactions paid by sub-clients under all white-label reseller domains.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Agency Network</th>
                      <th className="py-3.5 px-6">Sub-Client</th>
                      <th className="py-3.5 px-6">Plan Purchased</th>
                      <th className="py-3.5 px-6 text-right">Amount (₹)</th>
                      <th className="py-3.5 px-6 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Payment Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(revenueData?.all_transactions || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          <Receipt size={24} className="mx-auto mb-2 text-slate-300" />
                          <span>No transactions recorded yet. Sub-client plan upgrades will appear here in real time!</span>
                        </td>
                      </tr>
                    ) : (
                      (revenueData?.all_transactions || []).map((tx, tIdx) => (
                        <tr key={tIdx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px]">{tx.created_at}</td>
                          <td className="py-3.5 px-6">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                              {tx.agency_name}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="font-bold text-slate-900 text-xs">{tx.sub_client_name}</div>
                            <div className="text-[10px] text-slate-400">{tx.sub_client_email}</div>
                          </td>
                          <td className="py-3.5 px-6 font-bold text-slate-800">
                            {tx.plan} ({tx.billing_cycle})
                          </td>
                          <td className="py-3.5 px-6 text-right font-black text-slate-900 text-xs">
                            ₹{Number(tx.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={10} /> {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right font-mono text-[10px] text-slate-400">
                            {tx.razorpay_payment_id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── 5. Provision / Edit White-Label Modal ── */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {selectedAgency ? `Configure White-Label: ${selectedAgency.business_name || selectedAgency.company_name}` : 'Provision New White-Label Agency'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Set custom brand name, custom subdomain, logo, and theme tokens.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveWhiteLabel} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
                
                {/* Mode Selector (Only when creating, not when editing) */}
                {!selectedAgency && (
                  <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80 mb-2">
                    <button
                      type="button"
                      onClick={() => setProvisionMode('NEW')}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        provisionMode === 'NEW' 
                          ? "bg-white text-emerald-800 shadow-sm border border-slate-200/60 font-black" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <Sparkles size={14} className={provisionMode === 'NEW' ? "text-emerald-600" : "text-slate-400"} />
                      <span>✨ Register Brand New Agency</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProvisionMode('EXISTING')}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        provisionMode === 'EXISTING' 
                          ? "bg-white text-emerald-800 shadow-sm border border-slate-200/60 font-black" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <Building2 size={14} className={provisionMode === 'EXISTING' ? "text-emerald-600" : "text-slate-400"} />
                      <span>🔄 Upgrade Existing Client</span>
                    </button>
                  </div>
                )}

                {/* Case A: Creating Brand New Agency Details */}
                {!selectedAgency && provisionMode === 'NEW' && (
                  <div className="bg-emerald-50/40 p-4.5 rounded-2xl border border-emerald-200/70 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-700" />
                      <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                        New Agency Account & Credentials
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Agency / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.business_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormState(prev => ({
                              ...prev,
                              business_name: val,
                              white_label_name: prev.white_label_name ? prev.white_label_name : val
                            }));
                          }}
                          placeholder="e.g. Apex Digital Marketing"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Admin Owner Email (Login ID) *
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.owner_email}
                          onChange={(e) => {
                            const emailVal = e.target.value;
                            setFormState(prev => ({
                              ...prev,
                              owner_email: emailVal,
                              support_email: prev.support_email ? prev.support_email : emailVal
                            }));
                          }}
                          placeholder="owner@apexdigital.com"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Admin Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formState.owner_phone}
                          onChange={(e) => setFormState({ ...formState, owner_phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Initial Password
                        </label>
                        <input
                          type="text"
                          value={formState.owner_password}
                          onChange={(e) => setFormState({ ...formState, owner_password: e.target.value })}
                          placeholder="Welcome@2026"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Case B: Select Target Client Workspace if Upgrading Existing */}
                {!selectedAgency && provisionMode === 'EXISTING' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Select Existing Client Workspace to White-Label *
                    </label>
                    <select
                      value={formState.clientId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        const match = clients.find(c => c.id === cid);
                        setFormState(prev => ({
                          ...prev,
                          clientId: cid,
                          business_name: match?.business_name || match?.company_name || '',
                          white_label_name: match?.white_label_name || match?.business_name || match?.company_name || '',
                          support_email: match?.email || ''
                        }));
                      }}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.business_name || c.company_name} ({c.email || 'No email'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Brand Display Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      White-Label Brand Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.white_label_name}
                      onChange={(e) => setFormState({ ...formState, white_label_name: e.target.value })}
                      placeholder="e.g. Apex Marketing Automation"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  {/* Custom Domain */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Custom Domain / Subdomain (CNAME)
                    </label>
                    <input
                      type="text"
                      value={formState.white_label_domain}
                      onChange={(e) => setFormState({ ...formState, white_label_domain: e.target.value.toLowerCase().replace(/^(https?:\/\/)/, '') })}
                      placeholder="e.g. portal.apexagency.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  {/* Brand Logo Upload & URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Brand Logo (PNG / SVG / WebP / JPG)
                    </label>
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-2xs">
                        {formState.white_label_logo ? (
                          <img src={formState.white_label_logo} alt="Logo Preview" className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-bold uppercase text-center">No Logo</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer shadow-2xs transition-all">
                            <Upload size={13} />
                            <span>{formState.white_label_logo ? 'Change Image File' : 'Upload from Device'}</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                          {formState.white_label_logo && (
                            <button
                              type="button"
                              onClick={() => setFormState(prev => ({ ...prev, white_label_logo: '' }))}
                              className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                              Remove Logo
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">PNG or SVG (Max 4MB)</span>
                        </div>

                        <input
                          type="text"
                          value={formState.white_label_logo?.startsWith('data:') ? '' : formState.white_label_logo}
                          onChange={(e) => setFormState({ ...formState, white_label_logo: e.target.value })}
                          placeholder="Or paste external logo image URL (https://...)"
                          className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Color Palette */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Primary Theme Color
                    </label>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {[
                        { hex: '#059669' },
                        { hex: '#2563EB' },
                        { hex: '#4F46E5' },
                        { hex: '#7C3AED' },
                        { hex: '#DC2626' },
                        { hex: '#EA580C' },
                        { hex: '#0F172A' }
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setFormState({ ...formState, primary_color: c.hex })}
                          className={cn(
                            "w-7 h-7 rounded-lg transition-all cursor-pointer",
                            formState.primary_color === c.hex ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "opacity-80 hover:opacity-100"
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border border-slate-200 shrink-0" style={{ backgroundColor: formState.primary_color }} />
                      <input
                        type="text"
                        value={formState.primary_color}
                        onChange={(e) => setFormState({ ...formState, primary_color: e.target.value })}
                        className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Support Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      White-Label Support Email
                    </label>
                    <input
                      type="email"
                      value={formState.support_email}
                      onChange={(e) => setFormState({ ...formState, support_email: e.target.value })}
                      placeholder="support@partnerdomain.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong>Zero Code Cloning:</strong> When sub-clients or agents access <code className="bg-white px-1.5 py-0.5 rounded text-emerald-800 font-mono font-bold">{formState.white_label_domain || 'custom-domain.com'}</code>, our single Next.js app will dynamically brand the entire UI with this exact logo, color, and name.
                  </div>
                </div>

                </div>

                {/* Sticky Modal Action Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Save White-Label Partner</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ── 6. Live Portal Preview Simulation Modal ── */}
        {isPreviewModalOpen && selectedAgency && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden text-white my-8">
              
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-extrabold">
                    Live Portal Simulation: {selectedAgency.white_label_name || selectedAgency.business_name}
                  </h3>
                </div>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Browser Address Bar Simulation */}
                <div className="bg-slate-800 rounded-xl p-2.5 flex items-center gap-3 border border-slate-700 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 bg-slate-900 px-3 py-1 rounded-lg text-emerald-400 truncate">
                    🔒 https://{selectedAgency.white_label_domain || 'portal.agency.com'}/auth/login
                  </div>
                </div>

                {/* Simulated Login Modal */}
                <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedAgency.white_label_logo || selectedAgency.company_logo_url || '/download (3).gif'}
                        alt="Logo"
                        width={48}
                        height={48}
                        style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">
                        {selectedAgency.white_label_name || selectedAgency.business_name || 'Agency Portal'}
                      </h4>
                      <p className="text-[11px] text-slate-400">Multi-Channel Business Automation</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled
                      placeholder="client@customer.com"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400"
                    />
                    <input
                      type="password"
                      disabled
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400"
                    />
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: selectedAgency.settings?.primary_color || '#059669' }}
                    >
                      Sign In to {selectedAgency.white_label_name || selectedAgency.business_name}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Simulation
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── 7. DNS Setup Instructions Modal ── */}
        {isCnameModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe size={18} className="text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">DNS CNAME Routing Guide</h3>
                </div>
                <button onClick={() => setIsCnameModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
                <p>
                  To white-label any agency or client, tell them to log into their DNS manager (Cloudflare, GoDaddy, Namecheap, Route53) and add the following <strong>CNAME record</strong>:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono space-y-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Record Type:</span>
                    <strong className="text-slate-900 font-bold">CNAME</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Host / Name:</span>
                    <strong className="text-slate-900 font-bold">portal (or custom subdomain)</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200">
                    <span className="text-slate-500">Points To:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-700 font-black">uwoconnect.aisa24.com</strong>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('uwoconnect.aisa24.com');
                          setCopiedCname(true);
                          setTimeout(() => setCopiedCname(false), 2000);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                      >
                        {copiedCname ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs">
                  ✅ <strong>Instant Activation:</strong> Once the DNS record propagates, any user opening that custom domain will automatically see the partner's brand logo, color theme, and custom portal login.
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCnameModalOpen(false)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Got It
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

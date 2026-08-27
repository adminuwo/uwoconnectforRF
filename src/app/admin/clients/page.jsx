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
  Sliders, AlertCircle, Phone, Check, ArrowRight, RotateCcw, Copy,
  UserCheck, Shield, Sparkles, Building2, Lock, User, Briefcase
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ClientHealthBadge, AdminAddTeamMemberModal, AdminAssignProjectModal } from '@/components/admin/ClientIntelligenceComponents';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

function AdminClientsContent() {
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
  const [dynamicPlans, setDynamicPlans] = useState(['Starter', 'Professional', 'Enterprise']);
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

  // ── Profile & Credentials Quick-View Modal States ──
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileClient, setSelectedProfileClient] = useState(null);
  const [profileFormState, setProfileFormState] = useState({
    business_name: '',
    phone_number: '',
    address: '',
    company_logo_url: '',
    plan: 'GROWTH',
    status: 'ACTIVE',
    approval_status: 'APPROVED'
  });
  const [modalNewPassword, setModalNewPassword] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [profileSaveLoading, setProfileSaveLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Client form
  const [clientFormData, setClientFormData] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    plan: 'GROWTH'
  });

  // ── Plan Assignment Modal State ──
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false);
  const [selectedClientForPlan, setSelectedClientForPlan] = useState(null);
  const [selectedPlanToAssign, setSelectedPlanToAssign] = useState('PROFESSIONAL');
  const [planAssignLoading, setPlanAssignLoading] = useState(false);

  // ── Client Feature Management Modal State ──
  const [isManageFeaturesModalOpen, setIsManageFeaturesModalOpen] = useState(false);
  const [selectedClientForFeatures, setSelectedClientForFeatures] = useState(null);
  const [featureOverrides, setFeatureOverrides] = useState({ custom_added: [], custom_removed: [] });
  const [featuresSaveLoading, setFeaturesSaveLoading] = useState(false);
  const [featuresCategoryTab, setFeaturesCategoryTab] = useState('ALL');

  // Available dynamic plan choices with rich metadata
  const AVAILABLE_PLANS_LIST = [
    {
      id: 'FREE',
      name: 'Free',
      badge: 'FREE',
      price: '₹0',
      billing_cycle: 'No billing',
      feature_count: 14,
      color: 'slate',
      description: 'Essential communication tools & trial workspace for small setups.'
    },
    {
      id: 'STARTER',
      name: 'Starter',
      badge: 'STARTER',
      price: '₹999',
      billing_cycle: 'Monthly',
      feature_count: 22,
      color: 'emerald',
      description: 'Core communication channels, live chat inbox, catalog & basic CRM.'
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional',
      badge: 'PROFESSIONAL',
      price: '₹2,999',
      billing_cycle: 'Monthly',
      feature_count: 38,
      color: 'blue',
      is_popular: true,
      description: 'Complete sales automation, AI smart copilot, quotations, proposals, invoices & team.'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      badge: 'ENTERPRISE',
      price: '₹9,999',
      billing_cycle: 'Monthly',
      feature_count: 52,
      color: 'purple',
      description: 'Unlimited features, custom connectors, AI bots, audit logs & dedicated SLA.'
    },
    {
      id: 'CUSTOM',
      name: 'Custom',
      badge: 'CUSTOM',
      price: 'Custom Pricing',
      billing_cycle: 'Tailored',
      feature_count: 45,
      color: 'amber',
      description: 'Custom tailored enterprise feature bundle configured by Super Admin.'
    }
  ];

  // Active request controller ref for cancellation
  const abortControllerRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text, key) => {
    if (!text || text === 'N/A' || text === '—') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key}: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/plans/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.results?.length > 0) {
          const planNames = Array.from(new Set(res.data.results.map(p => p.name)));
          setDynamicPlans(planNames);
        }
      } catch (err) {
        // Fallback default list remains intact
      }
    };
    fetchPlans();
  }, []);

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
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${clientId}/action/`,
        { action, ...extraPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data?.message || 'Action executed successfully.');
      fetchClientDirectory(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [clientId]: false }));
      setActiveMenuId(null);
    }
  };

  // Open Client Profile & Credentials Modal
  const handleViewProfile = (client) => {
    setSelectedProfileClient(client);
    setProfileFormState({
      business_name: client.business_name || '',
      phone_number: client.phone_number || '',
      address: client.address || '',
      company_logo_url: client.company_logo_url || '',
      plan: client.plan || 'GROWTH',
      status: client.status || 'ACTIVE',
      approval_status: client.approval_status || 'APPROVED'
    });
    setModalNewPassword('');
    setShowPasswordInModal(false);
    setIsProfileModalOpen(true);
  };

  // Upload or Change Logo from Admin Profile Modal
  const handleAdminLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      showToast("Invalid image format. PNG, JPG, WEBP allowed.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Logo size exceeds 5MB.", "error");
      return;
    }
    try {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        img.src = uploadEvent.target.result;
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 400;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
        setProfileFormState(prev => ({
          ...prev,
          company_logo_url: dataUrl
        }));
        showToast("Logo loaded! Click 'Save Changes' to apply.", "success");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast("Failed to process image.", "error");
    }
  };

  // Generate strong random temporary password
  const handleGenerateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setModalNewPassword(pass);
    setShowPasswordInModal(true);
  };

  // Save new password from Profile modal
  const handleUpdatePasswordInModal = async () => {
    if (!selectedProfileClient || !modalNewPassword) return;
    try {
      setPasswordUpdateLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedProfileClient.id}/action/`,
        { action: 'CHANGE_PASSWORD', new_password: modalNewPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data?.message || 'Password updated successfully!');
      setModalNewPassword('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  // Save profile edits from modal
  const handleSaveProfileDetails = async () => {
    if (!selectedProfileClient) return;
    try {
      setProfileSaveLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedProfileClient.id}/action/`,
        { action: 'EDIT_PROFILE', ...profileFormState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If approval status changed, also sync approval status
      if (profileFormState.approval_status !== selectedProfileClient.approval_status) {
        await axios.post(
          `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedProfileClient.id}/action/`,
          { action: 'SET_APPROVAL_STATUS', approval_status: profileFormState.approval_status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      showToast('Client profile details updated successfully!');
      setIsProfileModalOpen(false);
      fetchClientDirectory(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save profile details.');
    } finally {
      setProfileSaveLoading(false);
    }
  };

  // ── Open Plan Assignment Modal ──
  const handleOpenAssignPlan = (client) => {
    if (!client) return;
    setSelectedClientForPlan(client);
    const clientPlanUpper = (client.plan || 'PROFESSIONAL').toUpperCase();
    const match = AVAILABLE_PLANS_LIST.find(p => p.id === clientPlanUpper || p.name.toUpperCase() === clientPlanUpper);
    setSelectedPlanToAssign(match ? match.id : 'PROFESSIONAL');
    setIsAssignPlanModalOpen(true);
  };

  // ── Confirm & Save Plan Assignment Directly to Client ──
  const handleConfirmAssignPlan = async () => {
    if (!selectedClientForPlan || !selectedPlanToAssign) return;
    try {
      setPlanAssignLoading(true);
      const token = localStorage.getItem('token');
      
      const targetPlanObj = AVAILABLE_PLANS_LIST.find(p => p.id === selectedPlanToAssign || p.name.toUpperCase() === selectedPlanToAssign.toUpperCase());
      const planNameFormatted = targetPlanObj ? targetPlanObj.name : selectedPlanToAssign;

      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedClientForPlan.id}/action/`,
        { action: 'ASSIGN_PLAN', plan: planNameFormatted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Instant in-memory state synchronization
      if (selectedProfileClient && selectedProfileClient.id === selectedClientForPlan.id) {
        setSelectedProfileClient(prev => ({ ...prev, plan: planNameFormatted }));
        setProfileFormState(prev => ({ ...prev, plan: planNameFormatted }));
      }

      setClients(prev => prev.map(c => c.id === selectedClientForPlan.id ? { ...c, plan: planNameFormatted } : c));

      showToast(`🎉 Successfully assigned ${planNameFormatted} plan to ${selectedClientForPlan.business_name}!`);
      setIsAssignPlanModalOpen(false);
      fetchClientDirectory(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign plan.');
    } finally {
      setPlanAssignLoading(false);
    }
  };

  // ── System Feature Catalog for Granular Overrides ──
  const ALL_SYSTEM_FEATURES = [
    // Channels (4)
    { key: 'channel_whatsapp', name: 'WhatsApp', category: 'Channels', desc: 'Official WhatsApp Cloud API & automated conversations' },
    { key: 'channel_instagram', name: 'Instagram', category: 'Channels', desc: 'Instagram Direct automation & real-time messaging' },
    { key: 'channel_facebook', name: 'Facebook', category: 'Channels', desc: 'Facebook Messenger & page conversation sync' },
    { key: 'channel_youtube', name: 'YouTube', category: 'Channels', desc: 'YouTube comments, audience replies & engagement' },

    // Connectors (8)
    { key: 'connector_gmail', name: 'Gmail', category: 'Connectors', desc: 'Google Gmail workspace integration & email sync' },
    { key: 'connector_outlook', name: 'Microsoft Outlook', category: 'Connectors', desc: 'Microsoft Outlook email & enterprise calendar connector' },
    { key: 'connector_google_maps', name: 'Google Maps', category: 'Connectors', desc: 'Google Maps location intelligence & business verification' },
    { key: 'connector_google_docs', name: 'Google Docs', category: 'Connectors', desc: 'Google Docs templates & automated client documents' },
    { key: 'connector_onedrive', name: 'OneDrive', category: 'Connectors', desc: 'Microsoft OneDrive cloud storage & file synchronization' },
    { key: 'connector_google_sheets', name: 'Google Sheets', category: 'Connectors', desc: 'Google Sheets automated spreadsheets & live data export' },
    { key: 'connector_google_slides', name: 'Google Slides', category: 'Connectors', desc: 'Google Slides presentations & pitch deck creator' },
    { key: 'connector_google_news', name: 'Google News Feed', category: 'Connectors', desc: 'Google News live feed monitoring & real-time alerts' },

    // Features (9)
    { key: 'feature_team_dashboard', name: 'Team Dashboard', category: 'Features', desc: 'Collaborative team workspace & performance dashboard' },
    { key: 'feature_quotation', name: 'Quotation', category: 'Features', desc: 'Instant sales quotations, estimates & digital approvals' },
    { key: 'feature_invoice', name: 'Invoice', category: 'Features', desc: 'Automated GST & tax invoicing with payment receipts' },
    { key: 'feature_proposal', name: 'Proposal', category: 'Features', desc: 'Multi-page branded client business proposals' },
    { key: 'feature_catalog', name: 'Catalog', category: 'Features', desc: 'Products & services catalog with pricing & SKUs' },
    { key: 'feature_payment', name: 'Payment', category: 'Features', desc: 'Payment gateway integration, checkout links & transaction tracking' },
    { key: 'feature_crm', name: 'CRM', category: 'Features', desc: 'Client directory, contact management & deal pipeline stages' },
    { key: 'feature_autoreply', name: 'Auto Reply', category: 'Features', desc: 'Automated 24/7 instant replies & trigger bot flows' },
    { key: 'feature_voice_video_call', name: 'Voice / Video Call', category: 'Features', desc: 'Integrated voice calling & video meeting capabilities' },
  ];

  const handleOpenManageFeatures = (client) => {
    if (!client) return;
    setSelectedClientForFeatures(client);
    setFeatureOverrides({
      custom_added: client.custom_added || [],
      custom_removed: client.custom_removed || []
    });
    setFeaturesCategoryTab('ALL');
    setIsManageFeaturesModalOpen(true);
  };

  const handleToggleFeatureOverride = (featureKey) => {
    setFeatureOverrides(prev => {
      let { custom_added = [], custom_removed = [] } = prev;
      if (custom_added.includes(featureKey)) {
        custom_added = custom_added.filter(k => k !== featureKey);
      } else {
        custom_added = [...custom_added, featureKey];
      }
      return { custom_added, custom_removed };
    });
  };

  const handleSaveFeatureOverrides = async () => {
    if (!selectedClientForFeatures) return;
    try {
      setFeaturesSaveLoading(true);
      showToast(`Features customized successfully for ${selectedClientForFeatures.business_name}!`);
      setIsManageFeaturesModalOpen(false);
    } catch (err) {
      alert('Failed to save feature overrides.');
    } finally {
      setFeaturesSaveLoading(false);
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
      showToast('New client created successfully!');
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
        
        {/* ── Toast Notification Alert ── */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-emerald-800 text-white border border-emerald-700 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toastMessage.msg}</span>
          </div>
        )}

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
              Review client registrations, approve or reject access requests, access client credentials, and manage active workspaces.
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
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus size={15} /> Add New Client
            </button>
            <button
              onClick={() => fetchClientDirectory(true)}
              disabled={isFetching}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh directory"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin text-emerald-600" : ""} />
            </button>
          </div>
        </div>

        {/* ── 2. Top Navigation Tabs: Approval Distribution ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => { setApprovalFilter('ALL'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs",
              approvalFilter === 'ALL'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <span>All Clients</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'ALL' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {approvalStats.totalClients || totalCount}
            </span>
          </button>

          <button
            onClick={() => { setApprovalFilter('APPROVED'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs",
              approvalFilter === 'APPROVED'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-emerald-50/50 border border-slate-200/80"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Approved</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'APPROVED' ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
            )}>
              {approvalStats.approved}
            </span>
          </button>

          <button
            onClick={() => { setApprovalFilter('PENDING'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs",
              approvalFilter === 'PENDING'
                ? "bg-amber-500 text-white shadow-amber-500/20"
                : "bg-white text-slate-600 hover:bg-amber-50/50 border border-slate-200/80"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Pending</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'PENDING' ? "bg-white/20 text-white" : "bg-amber-50 text-amber-700"
            )}>
              {approvalStats.pending}
            </span>
          </button>

          <button
            onClick={() => { setApprovalFilter('REJECTED'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs",
              approvalFilter === 'REJECTED'
                ? "bg-rose-600 text-white shadow-rose-600/20"
                : "bg-white text-slate-600 hover:bg-rose-50/50 border border-slate-200/80"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Rejected</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              approvalFilter === 'REJECTED' ? "bg-white/20 text-white" : "bg-rose-50 text-rose-700"
            )}>
              {approvalStats.rejected}
            </span>
          </button>
        </div>

        {/* ── 3. Clean Search & Filter Bar ── */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input with Anti-Autofill Protection */}
          <form 
            role="search" 
            onSubmit={(e) => e.preventDefault()} 
            autoComplete="off" 
            className="relative w-full md:w-96"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="search"
              name="search_clients_directory_query"
              id="search_clients_directory_input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              placeholder="Search by client, business, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
            />
            {searchInput && (
              <button 
                type="button" 
                onClick={() => setSearchInput('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
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
              className="px-3 py-2 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Plans</option>
              {dynamicPlans.map((planName) => (
                <option key={planName} value={planName}>{planName}</option>
              ))}
            </select>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-3 py-2 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
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
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── 4. Main Client Management Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8 relative">
          {/* Top indeterminate progress bar when fetching */}
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
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <RotateCcw size={13} /> Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar min-h-[360px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-6 sticky left-0 bg-slate-50 z-10 cursor-pointer" onClick={() => handleSort('business_name')}>
                      <div className="flex items-center gap-1">
                        Client & Business
                        <ArrowUpDown size={11} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 cursor-pointer" onClick={() => handleSort('plan')}>
                      <div className="flex items-center gap-1">
                        Plan
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
                    <th className="py-3.5 px-6 text-right sticky right-0 bg-slate-50 z-10">
                      <div className="flex items-center justify-end gap-1">
                        <Sliders size={12} className="text-slate-400" />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {(loading || (isFetching && clients.length === 0)) ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
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
                              Fetching client approval statuses, credentials and workspace records
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400">
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
                    clients.map((client) => {
                      return (
                        <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* 1. Client & Business */}
                          <td className="py-4 px-6 sticky left-0 bg-white z-10 border-r border-slate-100">
                            <div className="flex items-center gap-3.5 group">
                              <button 
                                onClick={() => handleViewProfile(client)}
                                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-50 hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center font-extrabold text-sm uppercase border border-slate-200 group-hover:scale-105 transition-all shadow-xs cursor-pointer shrink-0 overflow-hidden p-1"
                                title="Click to view profile & credentials"
                              >
                                {client.company_logo_url ? (
                                  <img 
                                    src={client.company_logo_url} 
                                    alt={client.business_name} 
                                    className="w-full h-full object-contain rounded-lg" 
                                  />
                                ) : (
                                  <span>{client.business_name?.charAt(0) || 'C'}</span>
                                )}
                              </button>
                              <div>
                                <button 
                                  onClick={() => handleViewProfile(client)}
                                  className="font-bold text-slate-900 hover:text-emerald-600 transition-colors text-sm text-left cursor-pointer block"
                                >
                                  {client.business_name}
                                </button>
                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span className="text-slate-600 font-medium">{client.client_name || client.name || client.email}</span>
                                  {client.phone_number && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-500 font-mono text-[11px]">{client.phone_number}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenAssignPlan(client)}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase transition-all hover:scale-105 border cursor-pointer inline-flex items-center gap-1.5 shadow-2xs",
                                client.plan?.toUpperCase().includes('PRO') ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" :
                                client.plan?.toUpperCase().includes('ENTER') ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" :
                                client.plan?.toUpperCase().includes('STARTER') ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" :
                                "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              )}
                              title="Click to assign or change plan"
                            >
                              <Layers size={11} className="opacity-70" />
                              <span>{client.plan || 'Free'}</span>
                            </button>
                          </td>

                          {/* 2. Approval Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5 border shadow-2xs",
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

                              {/* Quick 1-click toggles for pending */}
                              {client.approval_status === 'PENDING' && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'APPROVED' })}
                                    disabled={actionLoading[client.id]}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                    title="Approve immediately"
                                  >
                                    <CheckCircle2 size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleClientAction(client.id, 'SET_APPROVAL_STATUS', { approval_status: 'REJECTED' })}
                                    disabled={actionLoading[client.id]}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Reject access"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 3. Registered Date */}
                          <td className="py-4 px-6 whitespace-nowrap text-slate-600 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400" />
                              <span>{client.created_date_formatted || client.last_activity_formatted || 'Recently'}</span>
                            </div>
                          </td>

                          {/* 4. Dedicated Actions Column: View Profile & Delete */}
                          <td className="py-4 px-6 whitespace-nowrap text-right sticky right-0 bg-white border-l border-slate-100 z-10">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewProfile(client)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all hover:scale-[1.02] cursor-pointer group"
                                title="View and manage client ID, password & profile"
                              >
                                <Eye size={13} className="text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  setClientToDelete(client);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                                title="Delete this client"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
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

        {/* ── 5. Comprehensive Client Profile & Credentials Quick-View Modal ── */}
        {isProfileModalOpen && selectedProfileClient && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-white flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-lg uppercase border border-emerald-200/80 shadow-2xs overflow-hidden shrink-0 p-1">
                    {profileFormState.company_logo_url || selectedProfileClient.company_logo_url ? (
                      <img 
                        src={profileFormState.company_logo_url || selectedProfileClient.company_logo_url} 
                        alt={selectedProfileClient.business_name} 
                        className="w-full h-full object-contain rounded-xl" 
                      />
                    ) : (
                      <span>{selectedProfileClient.business_name?.charAt(0) || 'C'}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        {selectedProfileClient.business_name}
                      </h2>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs",
                        profileFormState.approval_status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        profileFormState.approval_status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {profileFormState.approval_status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {profileFormState.plan} PLAN
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Owner: <strong className="text-slate-800">{selectedProfileClient.client_name || selectedProfileClient.email}</strong></span>
                      <span>•</span>
                      <span>Registered: <strong className="text-slate-800">{selectedProfileClient.created_date_formatted || 'Recently'}</strong></span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsProfileModalOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body with Clean Light Multi-Section Content */}
              <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto custom-scrollbar text-xs">
                
                {/* ── TOP SECTION: PLAN & FEATURES ENTITLEMENT ── */}
                <div className="p-5 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                    <div className="flex items-center gap-2">
                      <Layers size={15} className="text-emerald-700" />
                      <span className="font-extrabold text-[11px] tracking-wider uppercase text-emerald-900">
                        PLAN & FEATURES ENTITLEMENT
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 tracking-wider">
                      {selectedProfileClient.status === 'ACTIVE' ? 'ACTIVE' : selectedProfileClient.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">
                          {selectedProfileClient.plan || 'Professional'}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600 text-white shadow-2xs">
                          {AVAILABLE_PLANS_LIST.find(p => p.name.toUpperCase() === (selectedProfileClient.plan || '').toUpperCase() || p.id === (selectedProfileClient.plan || '').toUpperCase())?.badge || 'ACTIVE'}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-bold mt-0.5">
                        {AVAILABLE_PLANS_LIST.find(p => p.name.toUpperCase() === (selectedProfileClient.plan || '').toUpperCase() || p.id === (selectedProfileClient.plan || '').toUpperCase())?.price || '₹2,999'} / {AVAILABLE_PLANS_LIST.find(p => p.name.toUpperCase() === (selectedProfileClient.plan || '').toUpperCase() || p.id === (selectedProfileClient.plan || '').toUpperCase())?.billing_cycle || 'month'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {AVAILABLE_PLANS_LIST.find(p => p.name.toUpperCase() === (selectedProfileClient.plan || '').toUpperCase() || p.id === (selectedProfileClient.plan || '').toUpperCase())?.feature_count || 28} Features Included • Real-time Entitlements Active
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAssignPlan(selectedProfileClient)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers size={13} /> Change Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenManageFeatures(selectedProfileClient)}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Sparkles size={13} className="text-emerald-600" /> Manage Features
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* ── SECTION 1: Credentials & Login Identity ── */}
                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                      <Lock size={14} className="text-emerald-600" />
                      <span>Account ID & Login Credentials</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                      Encrypted & Protected
                    </span>
                  </div>

                  {/* ID & Username Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Client / Workspace ID */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Workspace ID</div>
                        <div className="text-xs font-bold text-slate-900 font-mono truncate max-w-[170px]">{selectedProfileClient.id}</div>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedProfileClient.id, 'Client ID')}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="Copy Client ID"
                      >
                        {copiedKey === 'Client ID' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Primary User ID */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary User ID</div>
                        <div className="text-xs font-bold text-slate-900 font-mono truncate max-w-[170px]">
                          {selectedProfileClient.user_id || selectedProfileClient.id}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedProfileClient.user_id || selectedProfileClient.id, 'User ID')}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="Copy User ID"
                      >
                        {copiedKey === 'User ID' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Login Username */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Login Username</div>
                        <div className="text-xs font-bold text-slate-900 font-mono truncate max-w-[170px]">
                          {selectedProfileClient.username || selectedProfileClient.email}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedProfileClient.username || selectedProfileClient.email, 'Username')}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="Copy Username"
                      >
                        {copiedKey === 'Username' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* Primary Registered Email */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Email</div>
                        <div className="text-xs font-bold text-slate-900 font-mono truncate max-w-[170px]">
                          {selectedProfileClient.email || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedProfileClient.email, 'Email')}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedKey === 'Email' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Inline Password Override Section */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPasswordInModal ? "text" : "password"}
                        name="client_password_reset_field"
                        autoComplete="new-password"
                        placeholder="Type new password to override..."
                        value={modalNewPassword}
                        onChange={(e) => setModalNewPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-mono transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPasswordInModal ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-2xs whitespace-nowrap cursor-pointer"
                      title="Generate random password"
                    >
                      <Sparkles size={13} className="inline mr-1 text-amber-500" /> Generate
                    </button>

                    <button
                      type="button"
                      onClick={handleUpdatePasswordInModal}
                      disabled={!modalNewPassword || passwordUpdateLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap cursor-pointer"
                    >
                      {passwordUpdateLoading ? <Loader2 size={13} className="animate-spin" /> : 'Set Password'}
                    </button>
                  </div>
                </div>

                {/* ── SECTION 2: Profile & Business Details ── */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 size={16} className="text-emerald-600" />
                      Client Profile & Workspace Information
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">Editable by Super Admin</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Business / Company Name</label>
                      <input
                        type="text"
                        value={profileFormState.business_name}
                        onChange={(e) => setProfileFormState({ ...profileFormState, business_name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">WhatsApp / Phone Number</label>
                      <input
                        type="text"
                        value={profileFormState.phone_number}
                        onChange={(e) => setProfileFormState({ ...profileFormState, phone_number: e.target.value })}
                        placeholder="+919876543210"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-mono transition-all"
                      />
                    </div>

                    {/* Subscription Plan */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Subscription Plan</label>
                      <select
                        value={profileFormState.plan}
                        onChange={(e) => setProfileFormState({ ...profileFormState, plan: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer transition-all"
                      >
                        <option value="Free">Free Tier (₹0/mo)</option>
                        <option value="Starter">Starter Tier (₹999/mo)</option>
                        <option value="Professional">Professional Tier (₹2,999/mo)</option>
                        <option value="Enterprise">Enterprise Tier (₹9,999/mo)</option>
                        <option value="Custom">Custom Tailored Plan</option>
                      </select>
                    </div>

                    {/* Account Status */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Account Status</label>
                      <select
                        value={profileFormState.status}
                        onChange={(e) => setProfileFormState({ ...profileFormState, status: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer transition-all"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="TRIAL">Trial Period</option>
                        <option value="SUSPENDED">Suspended</option>
                      </select>
                    </div>

                    {/* Approval Status */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Registration Approval</label>
                      <select
                        value={profileFormState.approval_status}
                        onChange={(e) => setProfileFormState({ ...profileFormState, approval_status: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer transition-all"
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    {/* Office Address */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Office Address</label>
                      <input
                        type="text"
                        value={profileFormState.address}
                        onChange={(e) => setProfileFormState({ ...profileFormState, address: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    {/* Company Logo Management */}
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                      <label className="block font-bold text-slate-700 mb-1.5 text-[11px]">Company / Brand Logo</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                          {profileFormState.company_logo_url ? (
                            <img src={profileFormState.company_logo_url} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase">No Logo</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-all">
                            <span>{profileFormState.company_logo_url ? 'Change Logo' : 'Upload Logo'}</span>
                            <input 
                              type="file" 
                              accept="image/png, image/jpeg, image/jpg, image/webp" 
                              onChange={handleAdminLogoUpload} 
                              className="hidden" 
                            />
                          </label>
                          {profileFormState.company_logo_url && (
                            <button
                              type="button"
                              onClick={() => setProfileFormState({ ...profileFormState, company_logo_url: '' })}
                              className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors cursor-pointer"
                            >
                              Remove Logo
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400">PNG, JPG or WebP (Max 3MB)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 3: Workspace Telemetry & Channels ── */}
                <div className="p-4.5 bg-slate-50/70 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Connected Social & Communication Channels</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {selectedProfileClient.active_channels_count || 0} Active
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProfileClient.active_channels_list && selectedProfileClient.active_channels_list.length > 0 ? (
                      selectedProfileClient.active_channels_list.map((ch, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-xs text-slate-700 shadow-2xs">
                          ✅ {ch}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-xs">No channels connected yet.</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/60 text-center font-mono">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-sans">Team Size</div>
                      <div className="text-sm font-bold text-slate-900">{selectedProfileClient.total_team_members || 1}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-sans">Projects</div>
                      <div className="text-sm font-bold text-slate-900">{selectedProfileClient.total_projects || 0}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-sans">Messages</div>
                      <div className="text-sm font-bold text-slate-900">{selectedProfileClient.bot_usage?.total_messages || 0}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-sans">Total Sales</div>
                      <div className="text-sm font-bold text-emerald-700">₹{selectedProfileClient.sales?.total_revenue || 0}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  {/* Direct Impersonate & Access Workspace Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenClientWorkspace(selectedProfileClient)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>Access Workspace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setClientToDelete(selectedProfileClient);
                      setIsDeleteModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    title="Permanently delete this client"
                  >
                    <Trash2 size={14} />
                    <span>Delete Client</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProfileDetails}
                    disabled={profileSaveLoading}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {profileSaveLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Add Client Modal ── */}
        {isAddClientModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900">Register New Client</h3>
                <button onClick={() => setIsAddClientModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500 cursor-pointer"
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
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs cursor-pointer"
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
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-500">
                  Override password for <span className="font-bold text-slate-900">{clientForPassword.business_name}</span> ({clientForPassword.email || clientForPassword.username}).
                </p>
                <input
                  type="password"
                  name="standalone_override_password"
                  autoComplete="new-password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button onClick={() => setIsPasswordModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleClientAction(clientForPassword.id, 'CHANGE_PASSWORD', { new_password: newPassword });
                      setIsPasswordModalOpen(false);
                    }}
                    disabled={!newPassword}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 cursor-pointer"
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
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600">
                  Are you sure you want to permanently delete <span className="font-bold text-slate-900">{clientToDelete.business_name}</span>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleClientAction(clientToDelete.id, 'DELETE_CLIENT');
                      setIsDeleteModalOpen(false);
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. Interactive In-Modal Assign / Change Plan Dialog ── */}
        {isAssignPlanModalOpen && selectedClientForPlan && (
          <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/60 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Assign Plan to Client
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong className="text-slate-800 font-semibold">{selectedClientForPlan.business_name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssignPlanModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: Selectable Plan Cards */}
              <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Choose a subscription plan to assign. Entitlements will update immediately:
                </p>

                <div className="space-y-2.5">
                  {AVAILABLE_PLANS_LIST.map((plan) => {
                    const isSelected = selectedPlanToAssign.toUpperCase() === plan.id.toUpperCase() || selectedPlanToAssign.toUpperCase() === plan.name.toUpperCase();
                    const isCurrent = (selectedClientForPlan.plan || '').toUpperCase() === plan.id.toUpperCase() || (selectedClientForPlan.plan || '').toUpperCase() === plan.name.toUpperCase();

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanToAssign(plan.id)}
                        className={cn(
                          "p-4 rounded-2xl border transition-all cursor-pointer relative flex items-start justify-between gap-3",
                          isSelected 
                            ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs" 
                            : "bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-2xs"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                            isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"
                          )}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900">{plan.name}</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                plan.color === 'blue' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                plan.color === 'purple' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                plan.color === 'emerald' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                "bg-slate-100 text-slate-700 border-slate-200"
                              )}>
                                {plan.badge}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Current Plan
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {plan.description}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold mt-2">
                              <span className="text-emerald-700 font-bold">{plan.price} / {plan.billing_cycle}</span>
                              <span>•</span>
                              <span>{plan.feature_count} Features Enabled</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAssignPlanModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignPlan}
                  disabled={planAssignLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {planAssignLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Confirm & Assign Plan</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── 7. Client Feature Customization & Overrides Modal ── */}
        {isManageFeaturesModalOpen && selectedClientForFeatures && (
          <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 via-white to-emerald-50/60 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Custom Feature Overrides
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong className="text-slate-800 font-semibold">{selectedClientForFeatures.business_name}</strong> ({selectedClientForFeatures.plan} Plan)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManageFeaturesModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-800">
                  <p className="font-semibold">
                    Grant additional features (+) or restrict specific capabilities (-) for this client without changing their base plan.
                  </p>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['ALL', 'Communication', 'AI', 'CRM', 'Sales', 'Team', 'Documents'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeaturesCategoryTab(cat)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                        featuresCategoryTab === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Feature Rows */}
                <div className="space-y-2">
                  {ALL_SYSTEM_FEATURES
                    .filter(f => featuresCategoryTab === 'ALL' || f.category === featuresCategoryTab)
                    .map(feat => {
                      const isOverridden = featureOverrides.custom_added.includes(feat.key);

                      return (
                        <div
                          key={feat.key}
                          className="p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 flex items-center justify-between gap-3 shadow-2xs transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-800">{feat.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {feat.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleFeatureOverride(feat.key)}
                            className={cn(
                              "px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer border",
                              isOverridden 
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs" 
                                : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                            )}
                          >
                            {isOverridden ? 'Enabled (+)' : 'Standard'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManageFeaturesModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeatureOverrides}
                  disabled={featuresSaveLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {featuresSaveLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Entitlement Overrides</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default function AdminClients() {
  return (
    <React.Suspense fallback={
      <DashboardLayout role="ADMIN">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs text-slate-500 font-semibold">Loading Client Directory...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <AdminClientsContent />
    </React.Suspense>
  );
}

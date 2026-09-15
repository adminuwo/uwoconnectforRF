'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  LayoutTemplate, 
  Scale, 
  Save, 
  Send, 
  Eye, 
  RotateCcw, 
  Plus, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  Image as ImageIcon, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  History, 
  Activity, 
  X, 
  Edit3, 
  Trash2, 
  Upload, 
  Smartphone, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Check,
  Globe,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  HelpCircle,
  Layers
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function AdminContentManagementPage() {
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'banners' | 'maintenance' | 'features' | 'history' | 'audit'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Content state
  const [contentItems, setContentItems] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [lastPublishedAt, setLastPublishedAt] = useState(null);
  const [lastPublishedBy, setLastPublishedBy] = useState('System Admin');
  const [draftChangesCount, setDraftChangesCount] = useState(0);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState(['en', 'hi']);
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedLang, setSelectedLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Banners state
  const [banners, setBanners] = useState([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image_url: '',
    action_type: 'route',
    action_url: 'connectors',
    placement: 'home_hero',
    display_order: 1,
    is_active: true,
    draft_mode: false,
    image_file: null
  });

  // Maintenance state
  const [maintenance, setMaintenance] = useState({
    is_enabled: false,
    title: 'Under Maintenance',
    message: 'We are upgrading UWO Connect to deliver better speed and reliability. We will be back shortly.',
    estimated_completion: 'Within 30 minutes'
  });
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  // Feature flags state
  const [featureFlags, setFeatureFlags] = useState([]);
  const [flagsLoading, setFlagsLoading] = useState(false);

  // Version History state
  const [versions, setVersions] = useState([]);
  const [selectedRollbackVersion, setSelectedRollbackVersion] = useState(null);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals & Preview
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormValue, setEditFormValue] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishChangelog, setPublishChangelog] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewScreen, setPreviewScreen] = useState('home'); // 'home' | 'support' | 'maintenance'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Fetch CMS Content
  const fetchCMSContent = async (quiet = false) => {
    if (!quiet) setLoading(true);
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/`, {
        headers: getAuthHeaders()
      });
      if (res.data) {
        setContentItems(res.data.items || []);
        setCurrentVersion(res.data.current_version || 1);
        setLastPublishedAt(res.data.last_published_at);
        setLastPublishedBy(res.data.last_published_by || 'System Admin');
        setDraftChangesCount(res.data.draft_changes_count || 0);
        if (res.data.sections) setSections(res.data.sections);
        if (res.data.languages && res.data.languages.length > 0) {
          setLanguages(res.data.languages);
        }
      }
    } catch (err) {
      console.error('[CMS Content Fetch Error]', err);
      showToast('Failed to load content. Please verify admin credentials.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Fetch Banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/banners/`, {
        headers: getAuthHeaders()
      });
      setBanners(res.data || []);
    } catch (err) {
      console.error('[Banners Fetch Error]', err);
    }
  };

  // 3. Fetch Maintenance Config
  const fetchMaintenance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/maintenance/`, {
        headers: getAuthHeaders()
      });
      if (res.data) {
        setMaintenance(res.data);
      }
    } catch (err) {
      console.error('[Maintenance Fetch Error]', err);
    }
  };

  // 4. Fetch Feature Flags
  const fetchFeatureFlags = async () => {
    setFlagsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/feature-flags/`, {
        headers: getAuthHeaders()
      });
      setFeatureFlags(res.data || []);
    } catch (err) {
      console.error('[Feature Flags Fetch Error]', err);
    } finally {
      setFlagsLoading(false);
    }
  };

  // 5. Fetch Version History
  const fetchVersions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/versions/`, {
        headers: getAuthHeaders()
      });
      setVersions(res.data || []);
    } catch (err) {
      console.error('[Versions Fetch Error]', err);
    }
  };

  // 6. Fetch Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/content/audit-logs/`, {
        headers: getAuthHeaders()
      });
      setAuditLogs(res.data || []);
    } catch (err) {
      console.error('[Audit Logs Fetch Error]', err);
    }
  };

  useEffect(() => {
    fetchCMSContent();
    fetchBanners();
    fetchMaintenance();
    fetchFeatureFlags();
    fetchVersions();
    fetchAuditLogs();
  }, []);

  // Save Draft Item
  const handleSaveDraft = async (item, newValue) => {
    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/content/draft/`, {
        key: item.key,
        language: item.language,
        value: newValue,
        section: item.section,
        content_type: item.content_type,
        label: item.label
      }, {
        headers: getAuthHeaders()
      });

      showToast(`Draft saved for "${item.label || item.key}".`);
      setIsEditModalOpen(false);
      setEditingItem(null);
      await fetchCMSContent(true);
    } catch (err) {
      console.error('[Draft Save Error]', err);
      showToast('Error saving draft. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Publish All Drafts
  const handlePublishAll = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/content/publish/`, {
        changelog: publishChangelog || 'Published updates via Admin Dashboard'
      }, {
        headers: getAuthHeaders()
      });

      showToast(res.data.message || 'Content published successfully!');
      setIsPublishModalOpen(false);
      setPublishChangelog('');
      await fetchCMSContent(true);
      await fetchVersions();
      await fetchAuditLogs();
    } catch (err) {
      console.error('[Publish Error]', err);
      showToast('Failed to publish content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Load Preview Data
  const handleOpenPreview = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/content/preview/`, {
        lang: selectedLang
      }, {
        headers: getAuthHeaders()
      });
      setPreviewData(res.data);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error('[Preview Error]', err);
      showToast('Could not load draft preview.', 'error');
    }
  };

  // Rollback to version
  const handleRollback = async () => {
    if (!selectedRollbackVersion) return;
    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/content/rollback/`, {
        version_number: selectedRollbackVersion.version_number
      }, {
        headers: getAuthHeaders()
      });
      showToast(res.data.message || `Rolled back to v${selectedRollbackVersion.version_number}`);
      setIsRollbackModalOpen(false);
      setSelectedRollbackVersion(null);
      await fetchCMSContent(true);
      await fetchVersions();
      await fetchAuditLogs();
    } catch (err) {
      console.error('[Rollback Error]', err);
      showToast('Rollback failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save / Update Banner
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', bannerForm.title);
      formData.append('description', bannerForm.description);
      formData.append('image_url', bannerForm.image_url);
      formData.append('action_type', bannerForm.action_type);
      formData.append('action_url', bannerForm.action_url);
      formData.append('placement', bannerForm.placement);
      formData.append('display_order', bannerForm.display_order);
      formData.append('is_active', bannerForm.is_active);
      formData.append('draft_mode', bannerForm.draft_mode);

      if (bannerForm.image_file) {
        formData.append('image', bannerForm.image_file);
      }

      if (editingBanner) {
        await axios.put(`${API_BASE_URL}/api/admin/content/banners/${editingBanner.id}/`, formData, {
          headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
        });
        showToast('Banner updated successfully.');
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/content/banners/`, formData, {
          headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
        });
        showToast('New banner created successfully.');
      }

      setIsBannerModalOpen(false);
      setEditingBanner(null);
      setBannerForm({
        title: '',
        description: '',
        image_url: '',
        action_type: 'route',
        action_url: 'connectors',
        placement: 'home_hero',
        display_order: 1,
        is_active: true,
        draft_mode: false,
        image_file: null
      });
      await fetchBanners();
    } catch (err) {
      console.error('[Banner Save Error]', err);
      showToast('Error saving banner.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id, title) => {
    if (!confirm(`Are you sure you want to delete banner "${title}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/content/banners/${id}/`, {
        headers: getAuthHeaders()
      });
      showToast('Banner deleted.');
      await fetchBanners();
    } catch (err) {
      console.error('[Banner Delete Error]', err);
      showToast('Failed to delete banner.', 'error');
    }
  };

  // Toggle Maintenance Mode
  const handleSaveMaintenance = async (newIsEnabled) => {
    setMaintenanceSaving(true);
    try {
      const payload = {
        is_enabled: newIsEnabled !== undefined ? newIsEnabled : maintenance.is_enabled,
        title: maintenance.title,
        message: maintenance.message,
        estimated_completion: maintenance.estimated_completion
      };
      const res = await axios.post(`${API_BASE_URL}/api/admin/content/maintenance/`, payload, {
        headers: getAuthHeaders()
      });
      setMaintenance(res.data.config);
      showToast(`Maintenance mode set to ${payload.is_enabled ? 'ON' : 'OFF'}.`);
      await fetchCMSContent(true);
    } catch (err) {
      console.error('[Maintenance Save Error]', err);
      showToast('Failed to update maintenance settings.', 'error');
    } finally {
      setMaintenanceSaving(false);
    }
  };

  // Toggle Feature Flag
  const handleToggleFeature = async (feature_key, currentVal) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/content/feature-flags/`, {
        feature_key,
        is_enabled: !currentVal
      }, {
        headers: getAuthHeaders()
      });
      setFeatureFlags(prev => prev.map(f => f.feature_key === feature_key ? { ...f, is_enabled: !currentVal } : f));
      showToast(`Feature "${feature_key}" ${!currentVal ? 'enabled' : 'disabled'}.`);
      await fetchCMSContent(true);
    } catch (err) {
      console.error('[Feature Flag Toggle Error]', err);
      showToast('Failed to toggle feature flag.', 'error');
    }
  };

  // Filtered Content Items
  const filteredItems = useMemo(() => {
    return contentItems.filter(item => {
      const matchSection = selectedSection === 'ALL' || item.section === selectedSection;
      const matchLang = item.language === selectedLang;
      const matchSearch = !searchQuery || 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.label && item.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.published_value && item.published_value.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.draft_value && item.draft_value.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSection && matchLang && matchSearch;
    });
  }, [contentItems, selectedSection, selectedLang, searchQuery]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Toast Notification */}
        {toast && (
          <div className={cn(
            "fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-4",
            toast.type === 'error' ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          )}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {toast.msg}
          </div>
        )}

        {/* Header & Status Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <LayoutTemplate size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Content Management System
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                v{currentVersion} Live
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Real-time remote content, banners, feature toggles, and legal documents for UWO Connect Mobile App.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => fetchCMSContent()}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all text-xs font-semibold flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleOpenPreview}
              className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Smartphone size={15} />
              Mobile Preview
            </button>

            <button
              onClick={() => setIsPublishModalOpen(true)}
              disabled={saving}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all flex items-center gap-2 shadow-md",
                draftChangesCount > 0 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20 animate-pulse" 
                  : "bg-gray-900 text-white hover:bg-gray-800"
              )}
            >
              <Send size={14} />
              Publish to Mobile
              {draftChangesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-extrabold">
                  {draftChangesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Published Live Version</p>
              <p className="text-xl font-bold text-gray-900">v{currentVersion}</p>
              <p className="text-[11px] text-gray-400 truncate">By {lastPublishedBy}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Edit3 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pending Draft Changes</p>
              <p className="text-xl font-bold text-gray-900">{draftChangesCount}</p>
              <p className="text-[11px] text-amber-600 font-medium">
                {draftChangesCount > 0 ? "Ready to publish" : "All items synced"}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              maintenance.is_enabled ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            )}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">App Maintenance Mode</p>
              <p className={cn("text-xl font-bold", maintenance.is_enabled ? "text-red-600" : "text-gray-900")}>
                {maintenance.is_enabled ? "ACTIVE (BLOCKED)" : "NORMAL (OPEN)"}
              </p>
              <p className="text-[11px] text-gray-400">Remote blocker</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Languages Managed</p>
              <p className="text-xl font-bold text-gray-900">{languages.length} Active</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">{languages.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'content'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <FileText size={15} />
            App Content & Texts
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {contentItems.filter(i => i.language === selectedLang).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'banners'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <ImageIcon size={15} />
            Banners & Promotions
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {banners.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'maintenance'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <AlertTriangle size={15} className={maintenance.is_enabled ? "text-red-500 animate-pulse" : ""} />
            Maintenance Mode
            {maintenance.is_enabled && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">ON</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'features'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <Sliders size={15} />
            Feature Flags
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
              {featureFlags.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'history'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <History size={15} />
            Version History & Rollback
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={cn(
              "px-5 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === 'audit'
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            <Activity size={15} />
            Audit Logs
          </button>

          <Link
            href="/admin/settings/legal"
            className="px-5 py-3.5 text-xs font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 border-b-2 border-transparent ml-auto"
          >
            <Scale size={15} className="text-[#059669]" />
            <span>Legal Policies &amp; Terms</span>
            <ExternalLink size={12} className="opacity-70" />
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: APP CONTENT & TEXTS                                          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Language:</span>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all uppercase",
                        selectedLang === lang 
                          ? "bg-white text-emerald-700 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {lang === 'en' ? 'English (en)' : lang === 'hi' ? 'Hindi (hi)' : lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Filters & Search */}
              <div className="flex items-center gap-3 flex-wrap flex-1 md:justify-end">
                <div className="relative min-w-[220px]">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by key or text..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="ALL">All Sections ({contentItems.filter(i => i.language === selectedLang).length})</option>
                  {sections.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-5">Content Key & Label</th>
                      <th className="py-3.5 px-5">Section</th>
                      <th className="py-3.5 px-5">Live Published Value</th>
                      <th className="py-3.5 px-5">Current Draft Value</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                          No content items found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => {
                        const isModified = item.draft_value !== item.published_value;
                        return (
                          <tr key={item.id || item.key} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-4 px-5">
                              <p className="font-bold text-gray-900 text-sm">{item.label || item.key}</p>
                              <p className="font-mono text-[11px] text-gray-400">{item.key}</p>
                              {item.description && (
                                <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">{item.description}</p>
                              )}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {item.section}
                              </span>
                            </td>
                            <td className="py-4 px-5 max-w-xs truncate text-gray-700 font-medium">
                              {item.published_value || <span className="text-gray-300 italic">Empty</span>}
                            </td>
                            <td className="py-4 px-5 max-w-xs truncate">
                              {isModified ? (
                                <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
                                  {item.draft_value}
                                </span>
                              ) : (
                                <span className="text-gray-500 font-normal">
                                  {item.draft_value || <span className="text-gray-300 italic">Same as live</span>}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              {isModified ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                                  <Clock size={11} /> Draft Changed
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                                  <Check size={11} /> Live Synced
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setEditFormValue(item.draft_value || item.published_value || '');
                                  setIsEditModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-bold text-xs"
                              >
                                Edit Content
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: BANNERS & PROMOTIONS                                         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Mobile Promotional Banners</h3>
                <p className="text-xs text-gray-500">Manage dynamic image carousels and announcement banners displayed on the home screen.</p>
              </div>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setBannerForm({
                    title: '',
                    description: '',
                    image_url: '',
                    action_type: 'route',
                    action_url: 'connectors',
                    placement: 'home_hero',
                    display_order: banners.length + 1,
                    is_active: true,
                    draft_mode: false,
                    image_file: null
                  });
                  setIsBannerModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 shadow-sm"
              >
                <Plus size={15} /> Add New Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Banner Image Preview */}
                    <div className="h-44 w-full bg-slate-100 relative overflow-hidden group">
                      {banner.image_url_display || banner.image_url ? (
                        <img 
                          src={banner.image_url_display || banner.image_url} 
                          alt={banner.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <ImageIcon size={32} />
                          <span className="text-xs">No image provided</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md",
                          banner.is_active ? "bg-emerald-500/90 text-white" : "bg-gray-800/80 text-gray-300"
                        )}>
                          {banner.is_active ? "Active" : "Inactive"}
                        </span>
                        {banner.draft_mode && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-white shadow-sm">
                            Draft Only
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold">
                        Order #{banner.display_order}
                      </div>
                    </div>

                    {/* Banner Info */}
                    <div className="p-5">
                      <h4 className="text-base font-bold text-gray-900 mb-1">{banner.title}</h4>
                      {banner.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{banner.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-600">Action:</span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
                          {banner.action_type} → {banner.action_url || 'none'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banner Card Actions */}
                  <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setBannerForm({
                          title: banner.title,
                          description: banner.description || '',
                          image_url: banner.image_url || '',
                          action_type: banner.action_type || 'route',
                          action_url: banner.action_url || '',
                          placement: banner.placement || 'home_hero',
                          display_order: banner.display_order || 0,
                          is_active: banner.is_active,
                          draft_mode: banner.draft_mode,
                          image_file: null
                        });
                        setIsBannerModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Edit Banner"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id, banner.title)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: MAINTENANCE MODE                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'maintenance' && (
          <div className="max-w-3xl space-y-6">
            <div className={cn(
              "p-6 rounded-3xl border transition-all",
              maintenance.is_enabled 
                ? "bg-red-50 border-red-200 shadow-lg shadow-red-500/10" 
                : "bg-white border-gray-100 shadow-sm"
            )}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    maintenance.is_enabled ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Emergency Maintenance Blocker</h3>
                    <p className="text-xs text-gray-500">
                      When enabled, the mobile app immediately renders a full-screen maintenance message for non-admin users.
                    </p>
                  </div>
                </div>

                {/* Main Toggle Switch */}
                <button
                  onClick={() => handleSaveMaintenance(!maintenance.is_enabled)}
                  disabled={maintenanceSaving}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2",
                    maintenance.is_enabled 
                      ? "bg-red-600 text-white hover:bg-red-700 shadow-red-500/30" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  {maintenance.is_enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  Maintenance Mode: {maintenance.is_enabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* Maintenance Details Form */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Screen Title
                  </label>
                  <input
                    type="text"
                    value={maintenance.title}
                    onChange={(e) => setMaintenance({ ...maintenance, title: e.target.value })}
                    placeholder="e.g. Under Maintenance"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    User Explanation Message
                  </label>
                  <textarea
                    rows={3}
                    value={maintenance.message}
                    onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                    placeholder="Explain why the app is temporarily down..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Estimated Completion Time
                  </label>
                  <input
                    type="text"
                    value={maintenance.estimated_completion}
                    onChange={(e) => setMaintenance({ ...maintenance, estimated_completion: e.target.value })}
                    placeholder="e.g. Within 30 minutes / 2:00 PM IST"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleSaveMaintenance()}
                    disabled={maintenanceSaving}
                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <Save size={14} /> Save Maintenance Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: FEATURE FLAGS                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'features' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="text-base font-bold text-gray-900">App Remote Feature Flags</h3>
              <p className="text-xs text-gray-500">
                Safely enable or disable application modules over the air without updating the APK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureFlags.map((flag) => (
                <div 
                  key={flag.feature_key} 
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      flag.is_enabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                    )}>
                      <Sliders size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{flag.name}</h4>
                      <p className="font-mono text-[10px] text-gray-400">{flag.feature_key}</p>
                      {flag.description && (
                        <p className="text-xs text-gray-500 mt-1">{flag.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggleFeature(flag.feature_key, flag.is_enabled)}
                    className={cn(
                      "w-12 h-7 rounded-full transition-colors relative p-1 shrink-0",
                      flag.is_enabled ? "bg-emerald-600" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                      flag.is_enabled ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: VERSION HISTORY & ROLLBACK                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="text-base font-bold text-gray-900">Published Version Snapshots</h3>
              <p className="text-xs text-gray-500">
                Every publish event is securely recorded. Rollback to any prior state instantly.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-5">Version</th>
                      <th className="py-3.5 px-5">Published Date</th>
                      <th className="py-3.5 px-5">Published By</th>
                      <th className="py-3.5 px-5">Changelog Summary</th>
                      <th className="py-3.5 px-5 text-right">Rollback Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {versions.map((ver) => {
                      const isCurrent = ver.version_number === currentVersion;
                      return (
                        <tr key={ver.id || ver.version_number} className="hover:bg-gray-50/60">
                          <td className="py-4 px-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-black",
                              isCurrent ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-gray-100 text-gray-700"
                            )}>
                              v{ver.version_number} {isCurrent && "★ (Current Live)"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-600">
                            {new Date(ver.published_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 font-semibold text-gray-800">
                            {ver.published_by_name || 'System Admin'}
                          </td>
                          <td className="py-4 px-5 text-gray-600 italic">
                            {ver.changelog || 'Published content update.'}
                          </td>
                          <td className="py-4 px-5 text-right">
                            {!isCurrent && (
                              <button
                                onClick={() => {
                                  setSelectedRollbackVersion(ver);
                                  setIsRollbackModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors font-bold text-xs flex items-center gap-1.5 ml-auto"
                              >
                                <RotateCcw size={12} /> Rollback to v{ver.version_number}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 6: AUDIT LOGS                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'audit' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h3 className="text-base font-bold text-gray-900">CMS Activity Audit Log</h3>
              <p className="text-xs text-gray-500">Immutable trace of all CMS edits, drafts, publishes, rollbacks, and toggles.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-5">Timestamp</th>
                      <th className="py-3.5 px-5">Admin User</th>
                      <th className="py-3.5 px-5">Action</th>
                      <th className="py-3.5 px-5">Details</th>
                      <th className="py-3.5 px-5">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60">
                        <td className="py-3.5 px-5 text-gray-500 text-[11px] whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-gray-800">
                          {log.admin_name}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase",
                            log.action === 'PUBLISH' ? "bg-emerald-100 text-emerald-800" :
                            log.action === 'ROLLBACK' ? "bg-amber-100 text-amber-800" :
                            log.action === 'DRAFT_SAVE' ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-gray-700 max-w-md truncate">
                          {log.details}
                        </td>
                        <td className="py-3.5 px-5 font-mono text-gray-400 text-[10px]">
                          {log.ip_address || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODAL 1: EDIT CONTENT ITEM (DRAFT)                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isEditModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit {editingItem.label || editingItem.key}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Key: {editingItem.key} ({editingItem.language.toUpperCase()})
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Live vs Draft indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Live Published Value</p>
                    <p className="text-gray-700 mt-1 font-medium truncate">{editingItem.published_value || 'None'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-700 uppercase">Draft Status</p>
                    <p className="text-amber-900 mt-1 font-medium">
                      {editingItem.draft_value !== editingItem.published_value ? "Modified (Pending Publish)" : "Synced with live"}
                    </p>
                  </div>
                </div>

                {/* Edit Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Draft Value ({editingItem.content_type})
                  </label>
                  {editingItem.content_type === 'rich_text' || editFormValue.length > 80 ? (
                    <textarea
                      rows={6}
                      value={editFormValue}
                      onChange={(e) => setEditFormValue(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-gray-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editFormValue}
                      onChange={(e) => setEditFormValue(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveDraft(editingItem, editFormValue)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Save size={14} /> Save Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODAL 2: ADD / EDIT BANNER                                          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100">
              <form onSubmit={handleSaveBanner}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingBanner ? 'Edit Promotional Banner' : 'Add New Promotional Banner'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Banner Title *</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="e.g. Supercharge Omnichannel Sales"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                      placeholder="Short promo summary..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Upload Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setBannerForm({ ...bannerForm, image_file: e.target.files[0] });
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Or Image URL</label>
                    <input
                      type="url"
                      value={bannerForm.image_url}
                      onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-600 uppercase mb-1">Action Type</label>
                      <select
                        value={bannerForm.action_type}
                        onChange={(e) => setBannerForm({ ...bannerForm, action_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                      >
                        <option value="none">None</option>
                        <option value="route">In-App Route</option>
                        <option value="url">External Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-600 uppercase mb-1">Action Target</label>
                      <input
                        type="text"
                        value={bannerForm.action_url}
                        onChange={(e) => setBannerForm({ ...bannerForm, action_url: e.target.value })}
                        placeholder="connectors or https://..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center pt-2">
                    <div>
                      <label className="block font-bold text-gray-600 uppercase mb-1">Display Order</label>
                      <input
                        type="number"
                        min={0}
                        value={bannerForm.display_order}
                        onChange={(e) => setBannerForm({ ...bannerForm, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bannerForm.is_active}
                          onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-bold text-gray-700">Active</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bannerForm.draft_mode}
                          onChange={(e) => setBannerForm({ ...bannerForm, draft_mode: e.target.checked })}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-bold text-amber-700">Draft Only</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  >
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODAL 3: PUBLISH CONFIRMATION                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Publish Content to Mobile</h3>
                  <p className="text-xs text-gray-500">Live Over-The-Air Update</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Publishing will update the global content version from <strong className="text-gray-900">v{currentVersion}</strong> to <strong className="text-emerald-700">v{currentVersion + 1}</strong>.
                All mobile devices will automatically fetch and display the updated content on app launch or resume without requiring an APK update.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Changelog Note (Optional)
                </label>
                <input
                  type="text"
                  value={publishChangelog}
                  onChange={(e) => setPublishChangelog(e.target.value)}
                  placeholder="e.g. Updated festive welcome messages and banners"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishAll}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Send size={14} /> Confirm & Publish Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODAL 4: ROLLBACK CONFIRMATION                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isRollbackModalOpen && selectedRollbackVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Version Rollback</h3>
                  <p className="text-xs text-amber-700 font-medium">Reverting to v{selectedRollbackVersion.version_number}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                This will restore all active content to the exact snapshot recorded at version <strong>v{selectedRollbackVersion.version_number}</strong>.
                A new version will be published so mobile users receive the rollback state immediately.
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Target Snapshot Details:</p>
                <p className="mt-1">Date: {new Date(selectedRollbackVersion.published_at).toLocaleString()}</p>
                <p>By: {selectedRollbackVersion.published_by_name}</p>
                <p className="italic mt-1">"{selectedRollbackVersion.changelog}"</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsRollbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRollback}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md shadow-amber-500/20 flex items-center gap-2"
                >
                  <RotateCcw size={14} /> Revert to v{selectedRollbackVersion.version_number}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODAL 5: INTERACTIVE SMARTPHONE PREVIEW                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isPreviewModalOpen && previewData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Preview Controls Pane */}
              <div className="w-full md:w-72 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={14} /> Draft Live Preview
                  </div>
                  <h3 className="text-xl font-black text-white">Mobile Simulator</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visual preview rendering your current draft changes without altering live mobile users.
                  </p>

                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulate Screen:</p>
                    <button
                      onClick={() => setPreviewScreen('home')}
                      className={cn(
                        "w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between",
                        previewScreen === 'home' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      Home Screen {previewScreen === 'home' && <ChevronRight size={14} />}
                    </button>
                    <button
                      onClick={() => setPreviewScreen('support')}
                      className={cn(
                        "w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between",
                        previewScreen === 'support' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      Support & Help {previewScreen === 'support' && <ChevronRight size={14} />}
                    </button>
                    <button
                      onClick={() => setPreviewScreen('maintenance')}
                      className={cn(
                        "w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between",
                        previewScreen === 'maintenance' ? "bg-red-500/20 text-red-300 border border-red-500/30" : "text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      Maintenance Barrier {previewScreen === 'maintenance' && <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      setIsPublishModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Send size={14} /> Ready? Publish
                  </button>
                  <button
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="w-full mt-2 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
                  >
                    Close Simulator
                  </button>
                </div>
              </div>

              {/* Smartphone Frame Mockup */}
              <div className="flex-1 p-6 flex items-center justify-center bg-slate-950 overflow-y-auto">
                <div className="w-[340px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
                  
                  {/* Phone Notch / Dynamic Island */}
                  <div className="w-28 h-4 bg-black rounded-b-xl absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                  </div>

                  {/* Phone Screen Inner */}
                  <div className="flex-1 bg-slate-900 text-white rounded-[38px] overflow-hidden flex flex-col pt-7 relative font-sans text-xs">
                    
                    {/* Status Bar */}
                    <div className="px-6 py-1 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <span>5G</span>
                        <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5">
                          <div className="w-full h-full bg-emerald-400"></div>
                        </div>
                      </div>
                    </div>

                    {/* SCREEN 1: HOME PREVIEW */}
                    {previewScreen === 'home' && (
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {/* Welcome header */}
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-[11px] text-slate-400">
                              {previewData.content.welcome_title || 'Welcome'}
                            </p>
                            <h4 className="text-base font-black text-white">
                              {previewData.content.app_name || 'UWO Connect'}
                            </h4>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                            U
                          </div>
                        </div>

                        {/* Top Announcement Banner */}
                        {previewData.content.announcement_active === 'true' && (
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 flex items-start gap-2.5">
                            <Megaphone size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-[11px] text-emerald-300">
                                {previewData.content.announcement_title || 'Announcement'}
                              </p>
                              <p className="text-[10px] text-slate-300 leading-snug mt-0.5">
                                {previewData.content.announcement_message}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Dynamic Promotional Banner Carousel Simulator */}
                        {previewData.banners && previewData.banners.length > 0 && (
                          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 overflow-hidden relative shadow-lg">
                            <img
                              src={previewData.banners[0].image_url_display || previewData.banners[0].image_url}
                              alt={previewData.banners[0].title}
                              className="w-full h-32 object-cover"
                            />
                            <div className="p-3 bg-slate-900/90 backdrop-blur-sm">
                              <p className="font-bold text-white text-[11px]">{previewData.banners[0].title}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{previewData.banners[0].description}</p>
                            </div>
                          </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                            <p className="text-emerald-400 font-bold text-sm">Active Flow</p>
                            <p className="text-[10px] text-slate-400">Omnichannel Sync</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                            <p className="text-blue-400 font-bold text-sm">CRM Leads</p>
                            <p className="text-[10px] text-slate-400">Pipeline Ready</p>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 italic text-center pt-2">
                          {previewData.content.welcome_subtitle}
                        </p>
                      </div>
                    )}

                    {/* SCREEN 2: SUPPORT & HELP PREVIEW */}
                    {previewScreen === 'support' && (
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <h4 className="text-sm font-bold text-white pt-2">Help & Contact Center</h4>
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                            <Mail size={16} className="text-emerald-400" />
                            <div>
                              <p className="text-[10px] text-slate-400">Email Support</p>
                              <p className="text-white font-semibold">{previewData.content.support_email}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                            <Phone size={16} className="text-emerald-400" />
                            <div>
                              <p className="text-[10px] text-slate-400">Helpline Phone</p>
                              <p className="text-white font-semibold">{previewData.content.support_phone}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                            <Clock size={16} className="text-emerald-400" />
                            <div>
                              <p className="text-[10px] text-slate-400">Working Hours</p>
                              <p className="text-white font-semibold">{previewData.content.support_hours}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                            <MapPin size={16} className="text-emerald-400" />
                            <div>
                              <p className="text-[10px] text-slate-400">Head Office</p>
                              <p className="text-white text-[10px] leading-tight">{previewData.content.support_address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SCREEN 3: MAINTENANCE OVERLAY PREVIEW */}
                    {previewScreen === 'maintenance' && (
                      <div className="flex-1 bg-red-950/90 p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                          <AlertTriangle size={28} />
                        </div>
                        <h3 className="text-base font-black text-white">{maintenance.title}</h3>
                        <p className="text-[11px] text-red-200 leading-relaxed">{maintenance.message}</p>
                        <div className="px-3 py-1.5 rounded-full bg-red-900/60 border border-red-700 text-red-300 text-[10px] font-bold">
                          {maintenance.estimated_completion}
                        </div>
                        <button className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow-md">
                          Check Again
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

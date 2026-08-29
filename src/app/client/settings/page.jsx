'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Lock, Loader2, ShieldCheck, LogOut, MapPin, Sparkles, ArrowUpRight, Upload, Trash2, Check, Building2, CheckCircle2, Camera, ExternalLink, CreditCard, X, Layers } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { useTour } from '@/context/TourContext';
import PaymentModal from '@/components/billing/PaymentModal';
import { API_BASE_URL } from '@/config/apiConfig';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import { cn } from '@/lib/utils';

const ClientSettingsPage = () => {
  const searchParams = useSearchParams();
  const { resetTour } = useTour();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoSuccessMessage, setLogoSuccessMessage] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [paymentOrders, setPaymentOrders] = useState([]);
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [planDetailsForPayment, setPlanDetailsForPayment] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activePlans, setActivePlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [editData, setEditData] = useState({ 
    name: '', 
    phone_number: '',
    address: '',
    business_name: '',
    tax_id_gstin: '',
    company_logo_url: ''
  });
  
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const clientData = (res.data?.client && typeof res.data.client === 'object') ? res.data.client : (typeof res.data === 'object' ? res.data : {});
      const userData = (res.data?.user && typeof res.data.user === 'object') ? res.data.user : (typeof res.data === 'object' ? res.data : {});

      setClient(clientData);
      
      const logoUrl = clientData.company_logo_url || '';
      if (logoUrl) {
        localStorage.setItem('client_company_logo', logoUrl);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { company_logo_url: logoUrl } }));
      }

      setEditData({
        name: userData.name || userData.first_name || user.first_name || '',
        business_name: clientData.business_name || '',
        phone_number: clientData.phone_number || userData.phone_number || '',
        address: clientData.address || '',
        company_logo_url: logoUrl,
        tax_id_gstin: clientData.tax_id_gstin || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      alert("Invalid image file type. Please upload PNG, JPG, or WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please select a smaller logo file.");
      return;
    }

    try {
      setLogoSaving(true);
      const compressedLogoDataUrl = await compressImage(file, 400, 400, 0.85);

      setEditData((prev) => ({
        ...prev,
        company_logo_url: compressedLogoDataUrl
      }));
      setClient((prev) => ({
        ...(prev || {}),
        company_logo_url: compressedLogoDataUrl
      }));
      localStorage.setItem('client_company_logo', compressedLogoDataUrl);
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { company_logo_url: compressedLogoDataUrl } }));

      // Immediate auto-save to backend
      const token = localStorage.getItem('uwo_token');
      const res = await axios.patch(`${API_BASE_URL}/api/profile`, {
        company_logo_url: compressedLogoDataUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const clientData = (res.data?.client && typeof res.data.client === 'object') ? res.data.client : (typeof res.data === 'object' ? res.data : {});
      if (clientData?.company_logo_url) {
        setClient(prev => ({ ...(prev || {}), company_logo_url: clientData.company_logo_url }));
        setEditData(prev => ({ ...prev, company_logo_url: clientData.company_logo_url }));
        localStorage.setItem('client_company_logo', clientData.company_logo_url);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { company_logo_url: clientData.company_logo_url } }));
      }
      setLogoSuccessMessage("Logo saved successfully!");
      setTimeout(() => setLogoSuccessMessage(null), 3500);
    } catch (err) {
      console.error("Failed to process or save logo", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to save logo. Please try again.");
    } finally {
      setLogoSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setLogoSaving(true);
      setEditData((prev) => ({
        ...prev,
        company_logo_url: ''
      }));
      setClient(prev => prev ? { ...prev, company_logo_url: '' } : prev);
      localStorage.removeItem('client_company_logo');
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { company_logo_url: '' } }));
      
      const token = localStorage.getItem('uwo_token');
      await axios.patch(`${API_BASE_URL}/api/profile`, {
        company_logo_url: ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogoSuccessMessage("Logo removed successfully.");
      setTimeout(() => setLogoSuccessMessage(null), 3000);
    } catch (err) {
      alert("Failed to remove logo");
    } finally {
      setLogoSaving(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/payments/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch payment history', err);
    }
  };

  const fetchActivePlans = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/plans/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.results && res.data.results.length > 0) {
        const mapped = res.data.results
          .filter(p => p.status === 'ACTIVE' || p.is_active !== false)
          .map(p => ({
            id: p.id || p.name.toUpperCase(),
            name: p.name,
            badge: p.badge_text || p.name.toUpperCase(),
            price: Number(p.price) || 0,
            billing_cycle: p.billing_cycle || 'Monthly',
            description: p.description || 'Custom feature tier',
            is_popular: p.is_popular || false,
            features: p.feature_keys?.length > 0
              ? p.feature_keys.map(k => k.replace(/^(channel_|connector_|feature_|crm_|sales_|team_|ai_)/, '').replace(/_/g, ' ').toUpperCase())
              : [
                  'WHATSAPP CHANNEL',
                  'GMAIL & OUTLOOK CONNECTORS',
                  'CRM & CLIENT PIPELINE',
                  'CATALOG & INVOICING',
                  'TEAM DASHBOARD'
                ]
          }));
        if (mapped.length > 0) {
          setActivePlans(mapped);
          return;
        }
      }
    } catch (e) {
      console.warn('Using default active plans catalog fallback');
    }
    // Default active plans fallback
    setActivePlans([
      {
        id: 'STARTER',
        name: 'Starter Plan',
        badge: 'STARTER',
        price: 999,
        billing_cycle: 'Monthly',
        description: 'Core communication channels, live chat inbox, catalog & basic CRM.',
        features: ['5 Team Seats', '10,000 CRM Contacts', 'WhatsApp & Facebook Messenger', 'Product Catalog & Orders', 'Standard Webhooks']
      },
      {
        id: 'PROFESSIONAL',
        name: 'Professional Plan',
        badge: 'PROFESSIONAL',
        price: 2999,
        billing_cycle: 'Monthly',
        is_popular: true,
        description: 'Full AI bots, smart assistant, quotes, proposals, invoices & team.',
        features: ['15 Team Seats', '100,000 CRM Contacts', 'WhatsApp, FB, IG & Telegram', 'AI Smart Copilot & Bot Builder', 'Quotations, Proposals & Invoices']
      },
      {
        id: 'ENTERPRISE',
        name: 'Enterprise Plan',
        badge: 'ENTERPRISE',
        price: 9999,
        billing_cycle: 'Monthly',
        description: 'Unlimited features, custom connectors, AI bots, audit logs & dedicated SLA.',
        features: ['Unlimited Team Seats', 'Unlimited CRM Contacts', 'All Channels & Connectors', 'Custom AI Bots & Workflows', 'Audit Logs & Dedicated SLA']
      },
      {
        id: 'CUSTOM',
        name: 'Custom Plan',
        badge: 'CUSTOM',
        price: 4999,
        billing_cycle: 'Custom',
        description: 'Tailored enterprise bundle configured by Super Admin.',
        features: ['Custom Tailored Features', 'Dedicated Storage Limit', 'White-Label Branding', 'Priority Phone Support']
      }
    ]);
  };

  useEffect(() => {
    fetchProfile();
    fetchPaymentHistory();
    fetchActivePlans();
  }, []);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('uwo_token');

      const payload = {
        name: editData.name,
        business_name: editData.business_name,
        phone_number: editData.phone_number,
        address: editData.address,
        tax_id_gstin: editData.tax_id_gstin,
        company_logo_url: editData.company_logo_url
      };

      const res = await axios.patch(`${API_BASE_URL}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);

      // Update local storage user if name changed
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          first_name: editData.name || storedUser.first_name,
          name: editData.name || storedUser.name
        }));
        if (editData.company_logo_url) {
          localStorage.setItem('client_company_logo', editData.company_logo_url);
        } else {
          localStorage.removeItem('client_company_logo');
        }
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: { company_logo_url: editData.company_logo_url || '', name: editData.name }
        }));
      } catch (e) {}

      await fetchProfile();
      setLogoSuccessMessage("Profile updated successfully!");
      setTimeout(() => setLogoSuccessMessage(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout role="CLIENT">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-slate-500">Loading Account Settings...</p>
      </div>
    </DashboardLayout>
  );

  const displayLogo = editData.company_logo_url || client?.company_logo_url;
  const displayBusinessName = editData.business_name || client?.business_name || 'Your Company Name';

  return (
    <DashboardLayout role="CLIENT">
      <div className="w-full pb-20 px-3 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-300">
        
        {/* ── Unified Settings Container ── */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100">
          
          {/* 1. Header Bar */}
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-slate-50/50 via-white to-emerald-50/20">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Workspace Settings
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {client?.plan || 'FREE'} PLAN
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Account Profile & Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Manage your business identity, branding assets, and primary contact information.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => { setIsEditing(false); fetchProfile(); }} 
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdate} 
                    disabled={isSaving} 
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Company Brand & Logo */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5 sm:gap-6">
                
                {/* Logo Upload Box */}
                <label className="relative group cursor-pointer shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50/20 transition-all flex items-center justify-center overflow-hidden p-2 relative shadow-2xs">
                    {displayLogo ? (
                      <img 
                        src={displayLogo} 
                        alt="Company Logo" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="text-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <Camera size={26} className="mx-auto mb-1 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-wider block">Add Logo</span>
                      </div>
                    )}

                    {/* Hover upload overlay */}
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Upload size={18} className="mb-0.5" />
                      <span>{displayLogo ? 'Change' : 'Upload'}</span>
                    </div>

                    {logoSaving && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-emerald-600" />
                      </div>
                    )}
                  </div>

                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                    onChange={handleLogoUpload} 
                    disabled={logoSaving}
                    className="hidden" 
                  />
                </label>

                {/* Info & Actions */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {displayBusinessName}
                    </h2>
                    {logoSuccessMessage && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-in fade-in">
                        ✓ {logoSuccessMessage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Upload your official company brand logo (PNG, JPG, WEBP). Featured automatically on invoices, quotes, and proposals.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition">
                      <Upload size={13} className="text-emerald-600" />
                      <span>{displayLogo ? 'Change Logo' : 'Upload Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        onChange={handleLogoUpload} 
                        disabled={logoSaving}
                        className="hidden" 
                      />
                    </label>
                    {displayLogo && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={logoSaving}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition cursor-pointer border border-rose-200/60"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Upgrade Pill */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-3">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan Status</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    ● {client?.plan || 'Free'} Tier Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Upgrade Plan
                </button>
              </div>

            </div>
          </div>

          {/* 3. Company Identity Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Company Identity</h3>
                <p className="text-xs text-slate-400">Official business registration and tax identification details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Company / Business Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Company / Business Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.business_name}
                    onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                    placeholder="e.g. Unified Web Options"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <p className="text-base font-bold text-slate-900">
                    {client?.business_name || editData.business_name || 'Not Configured'}
                  </p>
                )}
              </div>

              {/* GSTIN / Tax ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    GSTIN / Tax ID
                  </label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Optional
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.tax_id_gstin}
                    onChange={(e) => setEditData({ ...editData, tax_id_gstin: e.target.value })}
                    placeholder="e.g. 07AAAAA0000A1Z5 (Optional)"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all uppercase"
                  />
                ) : (
                  <p className="text-sm font-mono font-semibold text-slate-800">
                    {client?.tax_id_gstin || editData.tax_id_gstin || 'Not Configured (Optional)'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Personal & Contact Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <User size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Personal & Contact Details</h3>
                <p className="text-xs text-slate-400">Primary administrator profile, reachable email, and office location</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter Full Name"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <p className="text-base font-bold text-slate-900 truncate">
                    {editData.name || client?.name || user.first_name || user.username || 'N/A'}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mail ID
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user.email || client?.email || 'N/A'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.phone_number}
                    onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <p className="text-sm font-mono font-bold text-slate-900">
                    {client?.phone_number || editData.phone_number || 'Not Linked'}
                  </p>
                )}
              </div>

              {/* Location / Office Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Location / Office Address
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="e.g. Shop 12, Main Market, MG Road, Connaught Place, New Delhi"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {client?.address || editData.address || 'No address configured'}
                    </p>
                    {(client?.address || editData.address) && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client?.address || editData.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                      >
                        <MapPin size={13} />
                        <span>View on Google Maps</span>
                        <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Security & Actions */}
          <div className="p-6 sm:p-8 space-y-5 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Security & Account Access</h3>
                <p className="text-xs text-slate-400">Manage account credentials and login session</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center justify-between sm:justify-start gap-3 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition text-left cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Lock size={15} className="text-slate-500 group-hover:text-emerald-600 transition" />
                  <span className="text-xs font-bold text-slate-800">Change Password</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                type="button"
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth/login'; }}
                className="inline-flex items-center justify-between sm:justify-start gap-3 px-5 py-3 bg-rose-50/60 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition text-left cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut size={15} className="text-rose-600" />
                  <span className="text-xs font-bold text-rose-700">Sign Out</span>
                </div>
                <span className="text-xs text-rose-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setIsPasswordModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div className="relative bg-white w-full max-w-md rounded-[28px] sm:rounded-[32px] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Update Password</h2>
                <p className="text-sm text-slate-400 italic font-medium">Ensure your account is using a strong password.</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm text-slate-800" />
                </div>
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-slate-100 mt-4">
                  Save New Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Dynamic Workspace Upgrade Plans Selection Modal ── */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/60 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Workspace Plans & Scale
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      Current: {client?.plan || 'Free'} Tier
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Upgrade Your Workspace Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Choose the plan suited for your team size, communication channels, and automation volume.
                  </p>
                </div>

                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Billing Toggle (Monthly / Annual) */}
              <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center justify-center gap-4">
                <span className={cn(
                  "text-xs font-bold transition-colors cursor-pointer",
                  billingCycle === 'MONTHLY' ? "text-slate-900" : "text-slate-400"
                )} onClick={() => setBillingCycle('MONTHLY')}>
                  Monthly Billing
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(prev => prev === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
                  className="w-12 h-6 rounded-full bg-slate-200 p-0.5 relative transition-colors cursor-pointer hover:bg-slate-300"
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full bg-emerald-600 transition-all duration-200",
                    billingCycle === 'ANNUAL' ? "ml-6 bg-emerald-600" : "ml-0 bg-slate-400"
                  )} />
                </button>
                <span className={cn(
                  "text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer",
                  billingCycle === 'ANNUAL' ? "text-emerald-700" : "text-slate-400"
                )} onClick={() => setBillingCycle('ANNUAL')}>
                  Annual Billing
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Save 15%
                  </span>
                </span>
              </div>

              {/* Body: Dynamic Active Plans Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 max-h-[62vh] overflow-y-auto custom-scrollbar items-stretch">
                {activePlans.map((plan) => {
                  const isCurrent = (client?.plan || '').toUpperCase() === plan.id.toUpperCase() || (client?.plan || '').toUpperCase() === plan.name.toUpperCase();
                  const monthlyPrice = Number(plan.price) || 0;
                  const displayPrice = billingCycle === 'ANNUAL' 
                    ? Math.round(monthlyPrice * 0.85) 
                    : monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "rounded-3xl p-6 flex flex-col justify-between transition-all relative border",
                        plan.is_popular 
                          ? "bg-gradient-to-b from-emerald-50/60 to-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md" 
                          : "bg-white hover:bg-slate-50/50 border-slate-200/90 shadow-2xs"
                      )}
                    >
                      {plan.is_popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                          Most Popular
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="text-base font-extrabold text-slate-900">{plan.name}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {plan.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
                          {plan.description}
                        </p>

                        {/* Price */}
                        <div className="my-5 pb-4 border-b border-slate-100">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-slate-900 tracking-tight">
                              ₹{displayPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">/ month</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {billingCycle === 'ANNUAL' ? 'Billed annually via Razorpay' : 'Billed monthly via Razorpay'}
                          </span>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Upgrade Action Button */}
                      <div>
                        {isCurrent ? (
                          <button
                            disabled
                            className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs cursor-not-allowed border border-slate-200 text-center"
                          >
                            Current Active Plan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlanModal(plan.id);
                              setPlanDetailsForPayment(plan);
                              setIsUpgradeModalOpen(false);
                            }}
                            className={cn(
                              "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer text-center",
                              plan.is_popular 
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md" 
                                : "bg-slate-900 hover:bg-black text-white"
                            )}
                          >
                            Upgrade with Razorpay
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>256-bit SSL Secure checkout via Razorpay Payments</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Payment Modal */}
        {selectedPlanModal && (
          <PaymentModal
            isOpen={!!selectedPlanModal}
            onClose={() => setSelectedPlanModal(null)}
            selectedPlan={selectedPlanModal}
            planDetails={planDetailsForPayment}
            billingCycle={billingCycle}
            onSuccess={() => {
              fetchProfile();
              fetchPaymentHistory();
            }}
          />
        )}

        {/* Interactive Settings Learning Guide Modal */}
        <LearningCenterModal
          guideSlug="settings"
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientSettingsPage;

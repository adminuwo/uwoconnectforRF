'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Hash, CreditCard, Lock, Settings, Loader2, ShieldCheck, LogOut, MapPin, Key, Globe, Paintbrush, Sparkles, Calendar, ArrowUpRight, Upload, Trash2, Check } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { useTour } from '@/context/TourContext';
import PaymentModal from '@/components/billing/PaymentModal';
import { API_BASE_URL } from '@/config/apiConfig';
import LearningCenterModal from '@/components/guides/LearningCenterModal';

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
  const [editData, setEditData] = useState({ 
    name: '', 
    phone_number: '',
    address: '',
    whatsapp_access_token: '',
    whatsapp_phone_number_id: '',
    whatsapp_waba_id: '',
    whatsapp_verify_token: '',
    api_key: '',
    white_label_name: '',
    white_label_domain: '',
    google_sheets_enabled: false,
    google_spreadsheet_id: '',
    google_access_token: ''
  });
  
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data.client);
      
      const clientSettings = res.data.client.settings || {};
      const sheetsConfig = clientSettings.google_sheets || {};
      
      setEditData({
        name: res.data.user.name,
        business_name: res.data.client.business_name || '',
        phone_number: res.data.client.phone_number || '',
        address: res.data.client.address || '',
        company_logo_url: res.data.client.company_logo_url || '',
        tax_id_gstin: res.data.client.tax_id_gstin || '',
        invoice_prefix: res.data.client.invoice_prefix || 'INV',
        website: res.data.client.website || '',
        whatsapp_access_token: res.data.client.whatsapp_access_token || '',
        whatsapp_phone_number_id: res.data.client.whatsapp_phone_number_id || '',
        whatsapp_waba_id: res.data.client.whatsapp_waba_id || '',
        whatsapp_verify_token: res.data.client.whatsapp_verify_token || '',
        api_key: res.data.client.api_key || '',
        white_label_name: res.data.client.white_label_name || '',
        white_label_domain: res.data.client.white_label_domain || '',
        google_sheets_enabled: sheetsConfig.enabled || false,
        google_spreadsheet_id: sheetsConfig.spreadsheet_id || '',
        google_access_token: sheetsConfig.access_token || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile');
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

      // Immediate auto-save to backend
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/profile`, {
        company_logo_url: compressedLogoDataUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setClient(prev => prev ? { ...prev, company_logo_url: compressedLogoDataUrl } : prev);
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
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/profile`, {
        company_logo_url: ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(prev => prev ? { ...prev, company_logo_url: '' } : prev);
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
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/payments/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch payment history', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const processWhatsAppCode = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`${API_BASE_URL}/api/auth/whatsapp/embedded-signup`, { code }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert("WhatsApp Embedded Signup successful!");
          fetchProfile();
          // Optional: clear the code from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Failed to process WhatsApp code', err);
          alert("Failed to complete WhatsApp signup. Check console for details.");
        }
      };
      processWhatsAppCode();
    }
  }, [searchParams]);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      // Build client settings payload matching backend structure
      const updatedSettings = {
        ...(client?.settings || {}),
        google_sheets: {
          enabled: editData.google_sheets_enabled,
          spreadsheet_id: editData.google_spreadsheet_id,
          access_token: editData.google_access_token
        }
      };

      const payload = {
        ...editData,
        settings: updatedSettings
      };

      await axios.patch(`${API_BASE_URL}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <DashboardLayout role="CLIENT"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-600" /></div></DashboardLayout>;

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Account Settings</h1>
            <p className="text-slate-500 font-medium italic">Manage your profile, integration and security.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
            {/* View Complete Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all shadow-md flex-1 sm:flex-initial text-center cursor-pointer"
              title="Open step-by-step documentation guide for Settings"
            >
              <Sparkles size={15} className="text-emerald-400" />
              View Complete Guide
            </button>
            {/* Restart Product Tour button */}
            <button
              onClick={resetTour}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-2xl font-bold text-xs hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-sm group flex-1 sm:flex-initial text-center cursor-pointer"
              title="Replay the guided product tour"
            >
              <MapPin size={15} className="group-hover:animate-bounce" />
              Restart Tour
            </button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex-1 sm:flex-initial text-center cursor-pointer">
                Edit Settings
              </button>
            ) : (
              <div className="flex items-center gap-3 flex-1 sm:flex-initial w-full sm:w-auto">
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all flex-1 text-center">
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={isSaving} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 flex-1 text-center">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          {/* Company Branding & Logo System */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Company Branding & Document Settings</h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6">
              
              {/* Logo Upload & Preview (Always Active 1-Click Upload) */}
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6">
                <label className="relative group cursor-pointer shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-2 group-hover:border-emerald-500 group-hover:shadow-md transition-all shadow-2xs">
                    {(editData.company_logo_url || client?.company_logo_url) ? (
                      <img 
                        src={editData.company_logo_url || client?.company_logo_url} 
                        alt="Company Logo" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="text-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <Upload size={22} className="mx-auto mb-1 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-wider block">Upload</span>
                      </div>
                    )}
                    {logoSaving && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                        <Loader2 size={22} className="animate-spin text-emerald-600" />
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

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">Company Brand Logo</h4>
                    {logoSuccessMessage && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-in fade-in">
                        ✓ {logoSuccessMessage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Appears top-left on all Proposals, Quotations, Invoices (web & PDF), and Admin Dashboard. Supported: PNG, JPG, WEBP (Max 3MB).
                  </p>
                  
                  {/* Always Visible Upload & Remove Buttons */}
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 flex-wrap">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-emerald-600/20">
                      {logoSaving ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      <span>{(editData.company_logo_url || client?.company_logo_url) ? 'Change Logo' : 'Upload Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        onChange={handleLogoUpload} 
                        disabled={logoSaving}
                        className="hidden" 
                      />
                    </label>

                    {(editData.company_logo_url || client?.company_logo_url) && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={logoSaving}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-200/80 disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                  {isEditing ? (
                    <input 
                      value={editData.business_name} 
                      onChange={e => setEditData({...editData, business_name: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 font-semibold text-xs" 
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 font-semibold text-slate-900 text-xs">
                      {client?.business_name || 'Not Configured'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GSTIN / Tax ID</label>
                  {isEditing ? (
                    <input 
                      value={editData.tax_id_gstin} 
                      onChange={e => setEditData({...editData, tax_id_gstin: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 font-semibold text-xs" 
                      placeholder="e.g. 07AAAAA0000A1Z5"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 font-semibold text-slate-900 text-xs">
                      {client?.tax_id_gstin || 'Not Configured'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Document Prefix</label>
                  {isEditing ? (
                    <input 
                      value={editData.invoice_prefix} 
                      onChange={e => setEditData({...editData, invoice_prefix: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 font-semibold text-xs" 
                      placeholder="e.g. INV"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 font-semibold text-slate-900 text-xs">
                      {client?.invoice_prefix || 'INV'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal & Business Information */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Personal & Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl transition-all hover:border-emerald-100 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white shrink-0">
                  <User size={22} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p>
                  {isEditing ? (
                    <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-slate-50 border-none p-0 focus:ring-0 font-semibold text-slate-900 text-base" />
                  ) : (
                    <p className="text-base font-semibold text-slate-900 tracking-tight truncate">{client?.name || user.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl transition-all opacity-60">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                  <Mail size={22} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                  <p className="text-base font-semibold text-slate-900 tracking-tight truncate">{user.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl transition-all hover:border-emerald-100 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white shrink-0">
                  <Phone size={22} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                  {isEditing ? (
                    <input value={editData.phone_number} onChange={e => setEditData({...editData, phone_number: e.target.value})} className="w-full bg-slate-50 border-none p-0 focus:ring-0 font-semibold text-slate-900 text-base" placeholder="e.g. +91 9876543210" />
                  ) : (
                    <p className="text-base font-semibold text-slate-900 tracking-tight truncate">{client?.phone_number || 'Not Linked'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-3xl transition-all hover:border-emerald-100 group">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center transition-colors group-hover:bg-rose-600 group-hover:text-white shrink-0">
                  <MapPin size={22} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Business Address & Map Location</p>
                  {isEditing ? (
                    <textarea 
                      value={editData.address} 
                      onChange={e => setEditData({...editData, address: e.target.value})} 
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 font-semibold text-slate-900 text-sm focus:outline-none focus:border-emerald-500" 
                      placeholder="e.g. Shop 12, Main Market, MG Road, Connaught Place, New Delhi" 
                    />
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">{client?.address || 'No address configured'}</p>
                      {client?.address && (
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                        >
                          <span>View Map Path & Directions</span>
                          <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Integration Section */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">WhatsApp Integration</h3>
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number ID</label>
                  {isEditing ? (
                    <input 
                      value={editData.whatsapp_phone_number_id} 
                      onChange={e => setEditData({...editData, whatsapp_phone_number_id: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. 1151075064754011"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent">
                      {client?.whatsapp_phone_number_id || 'Not configured'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WABA ID (Business Account ID)</label>
                  {isEditing ? (
                    <input 
                      value={editData.whatsapp_waba_id} 
                      onChange={e => setEditData({...editData, whatsapp_waba_id: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. 1003621608783022"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent">
                      {client?.whatsapp_waba_id || 'Not configured'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
                {isEditing ? (
                  <textarea 
                    value={editData.whatsapp_access_token} 
                    onChange={e => setEditData({...editData, whatsapp_access_token: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm h-24 resize-none" 
                    placeholder="Enter your Meta Access Token here..."
                  />
                ) : (
                  <div className="bg-slate-50 rounded-2xl px-5 py-4 font-mono text-slate-500 text-[10px] border border-transparent break-all line-clamp-2">
                    {client?.whatsapp_access_token ? '••••••••••••••••••••••••••••••••' : 'Not configured'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Webhook Verify Token</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {isEditing ? (
                    <input 
                      value={editData.whatsapp_verify_token} 
                      onChange={e => setEditData({...editData, whatsapp_verify_token: e.target.value})} 
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. my_secure_token_123"
                    />
                  ) : (
                    <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent">
                      {client?.whatsapp_verify_token || 'Not configured'}
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                      setEditData({...editData, whatsapp_verify_token: token});
                    }}
                    disabled={!isEditing}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-0"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic ml-1 mt-2">Use this token when setting up the Webhook in Meta Developer Dashboard.</p>
              </div>
            </div>
          </div>

          {/* Account Identity */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">System Identity</h3>
            <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Hash size={22} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Profile ID</p>
                <p className="text-base font-semibold text-slate-700 tracking-tight italic">#KB-{client?.id || '0000'}</p>
              </div>
            </div>
          </div>

          {/* Enterprise Features */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Enterprise Features</h3>
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"><Key size={12}/> API Key</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {isEditing ? (
                    <input 
                      value={editData.api_key} 
                      onChange={e => setEditData({...editData, api_key: e.target.value})} 
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. sk_live_xxxxxxxxxx"
                    />
                  ) : (
                    <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 font-mono text-slate-700 text-sm border border-transparent">
                      {client?.api_key || 'No API Key generated'}
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                      setEditData({...editData, api_key: 'ak_' + uuid.replace(/-/g, '')});
                    }}
                    disabled={!isEditing}
                    className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-0"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"><Paintbrush size={12}/> White-label Name</label>
                  {isEditing ? (
                    <input 
                      value={editData.white_label_name} 
                      onChange={e => setEditData({...editData, white_label_name: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. My Agency"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent">
                      {client?.white_label_name || 'Not configured'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"><Globe size={12}/> White-label Domain</label>
                  {isEditing ? (
                    <input 
                      value={editData.white_label_domain} 
                      onChange={e => setEditData({...editData, white_label_domain: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                      placeholder="e.g. app.myagency.com"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent">
                      {client?.white_label_domain || 'Not configured'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Google Sheets Integration Section */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Integrations & Sync</h3>
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between p-1">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Google Sheets Sync</h4>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">Automatically sync newly captured leads to a Google Spreadsheet.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editData.google_sheets_enabled}
                    disabled={!isEditing}
                    onChange={e => setEditData({...editData, google_sheets_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {editData.google_sheets_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Spreadsheet ID</label>
                    {isEditing ? (
                      <input 
                        value={editData.google_spreadsheet_id} 
                        onChange={e => setEditData({...editData, google_spreadsheet_id: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                        placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-700 text-sm border border-transparent truncate">
                        {editData.google_spreadsheet_id || 'Not configured'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Google OAuth Access Token</label>
                    {isEditing ? (
                      <input 
                        type="password"
                        value={editData.google_access_token} 
                        onChange={e => setEditData({...editData, google_access_token: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 transition-all font-semibold text-sm" 
                        placeholder="Paste your access token..."
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-2xl px-5 py-4 font-semibold text-slate-500 text-sm border border-transparent truncate">
                        {editData.google_access_token ? '••••••••••••••••••••••••••••••••' : 'Not configured'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscription & Billing Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Plan & Billing</h3>
            
            {/* Active Plan Card */}
            <div className="bg-gradient-to-br from-slate-900 via-[#111827] to-slate-900 border border-slate-800 text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Current Active Plan
                    </span>
                    <span className="text-xs text-slate-400">Cashfree Billing</span>
                  </div>
                  <h4 className="text-3xl font-extrabold text-white tracking-tight capitalize">
                    {client?.plan || 'Free'} Plan
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md">
                    Full access to automated messaging, WhatsApp Meta API, and AI integrations for your business.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedPlanModal('STARTER')}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer border border-white/10"
                  >
                    Starter (₹3,999)
                  </button>
                  <button
                    onClick={() => setSelectedPlanModal('GROWTH')}
                    className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
                  >
                    <Sparkles size={14} /> Upgrade to Growth
                  </button>
                  <button
                    onClick={() => setSelectedPlanModal('ENTERPRISE')}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer border border-slate-700"
                  >
                    Enterprise
                  </button>
                </div>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard size={16} className="text-emerald-600" /> Payment & Order History
                </h4>
                <span className="text-xs text-slate-400 font-medium">{paymentOrders.length} transactions</span>
              </div>

              {paymentOrders.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium italic">No past Cashfree payment transactions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Plan</th>
                        <th className="pb-3">Cycle</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-mono font-medium text-slate-700">{order.order_id}</td>
                          <td className="py-3 font-bold text-slate-900">{order.plan}</td>
                          <td className="py-3 text-slate-500 capitalize">{order.billing_cycle?.toLowerCase()}</td>
                          <td className="py-3 font-bold text-emerald-600">₹{parseFloat(order.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3 text-slate-400">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>


          {/* Security Actions */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Security & Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl hover:border-emerald-100 transition-all group text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white shrink-0">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-slate-900">Change Password</span>
              </button>
              <button 
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth/login'; }}
                className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl hover:border-red-100 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center transition-colors group-hover:bg-red-600 group-hover:text-white shrink-0">
                  <LogOut size={18} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-slate-900">Sign Out Account</span>
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

        {/* Payment Modal */}
        {selectedPlanModal && (
          <PaymentModal
            isOpen={!!selectedPlanModal}
            onClose={() => setSelectedPlanModal(null)}
            selectedPlan={selectedPlanModal}
            billingCycle="MONTHLY"
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




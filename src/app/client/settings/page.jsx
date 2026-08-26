'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Lock, Loader2, ShieldCheck, LogOut, MapPin, Sparkles, ArrowUpRight, Upload, Trash2, Check, Building2, CheckCircle2, Camera } from 'lucide-react';
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
    business_name: '',
    tax_id_gstin: '',
    company_logo_url: ''
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
      
      setEditData({
        name: res.data.user.name || res.data.user.first_name || '',
        business_name: res.data.client.business_name || '',
        phone_number: res.data.client.phone_number || '',
        address: res.data.client.address || '',
        company_logo_url: res.data.client.company_logo_url || '',
        tax_id_gstin: res.data.client.tax_id_gstin || ''
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

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');

      const payload = {
        name: editData.name,
        business_name: editData.business_name,
        phone_number: editData.phone_number,
        address: editData.address,
        tax_id_gstin: editData.tax_id_gstin,
        company_logo_url: editData.company_logo_url
      };

      await axios.patch(`${API_BASE_URL}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchProfile();
      setLogoSuccessMessage("Profile updated successfully!");
      setTimeout(() => setLogoSuccessMessage(null), 3500);
    } catch (err) {
      alert('Failed to update profile');
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

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-8 pb-24 space-y-8 animate-in fade-in duration-300">
        
        {/* ── 1. Modern Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Workspace Profile
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {client?.plan || 'FREE'} PLAN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Account Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage your company branding, profile details, and account security.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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

        {/* ── 2. Hero Company Brand Card ── */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/30 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Logo Section with 1-Click Upload */}
            <div className="flex items-center gap-5">
              <label className="relative group cursor-pointer shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:shadow-lg transition-all flex items-center justify-center overflow-hidden p-2.5 shadow-2xs relative">
                  {(editData.company_logo_url || client?.company_logo_url) ? (
                    <img 
                      src={editData.company_logo_url || client?.company_logo_url} 
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
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                    <Upload size={18} className="mb-0.5" />
                    <span>Upload</span>
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

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {client?.business_name || editData.business_name || 'Your Company Name'}
                  </h3>
                  {logoSuccessMessage && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-in fade-in">
                      ✓ {logoSuccessMessage}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  Upload your brand logo (PNG, JPG, WEBP). It will be featured across your workspace, invoices, and proposals.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs">
                    <Upload size={13} className="text-emerald-600" />
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
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer border border-rose-200/60"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Plan Tier Highlight Card */}
            <div className="w-full md:w-auto bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-5">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subscription Plan</div>
                <div className="text-base font-extrabold text-slate-900 uppercase mt-0.5">
                  {client?.plan || 'Free'} Tier
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active & Verified</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlanModal('GROWTH')}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Upgrade Plan
              </button>
            </div>

          </div>
        </div>

        {/* ── 3. Profile Information Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Company Identity */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Company Identity</h2>
                <p className="text-[11px] text-slate-400">Official business registration details</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company / Business Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.business_name}
                    onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                    placeholder="e.g. Unified Web Options"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900">
                    {client?.business_name || editData.business_name || 'Not Configured'}
                  </div>
                )}
              </div>

              {/* GSTIN (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all uppercase"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-semibold text-slate-800">
                    {client?.tax_id_gstin || 'Not Configured (Optional)'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Contact & Personal Details */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <User size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Personal & Contact Details</h2>
                <p className="text-[11px] text-slate-400">Primary workspace administrator information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Enter Full Name"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 truncate">
                      {client?.name || user.first_name || user.username || 'N/A'}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mail ID
                  </label>
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 truncate flex items-center justify-between">
                    <span>{user.email || client?.email || 'N/A'}</span>
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.phone_number}
                    onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold text-slate-900">
                    {client?.phone_number || 'Not Linked'}
                  </div>
                )}
              </div>

              {/* Location / Office Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location / Office Address
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="e.g. Shop 12, Main Market, MG Road, Connaught Place, New Delhi"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800">
                    <p className="font-semibold">{client?.address || 'No address configured'}</p>
                    {client?.address && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                      >
                        <MapPin size={12} />
                        <span>View on Google Maps</span>
                        <ArrowUpRight size={11} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── 4. Security & Account Access ── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Security & Account Access</h2>
              <p className="text-[11px] text-slate-400">Manage login credentials and workspace session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center group-hover:border-emerald-400 group-hover:text-emerald-700 transition-colors shadow-2xs">
                  <Lock size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Change Password</span>
                  <span className="text-[10px] text-slate-400">Update your account login password</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              type="button"
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth/login'; }}
              className="flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-200/60 rounded-2xl transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center group-hover:border-rose-400 transition-colors shadow-2xs">
                  <LogOut size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-900 block">Sign Out</span>
                  <span className="text-[10px] text-rose-600/80">End your active login session</span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
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




'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Hash, CreditCard, Lock, Settings, Loader2, ShieldCheck, LogOut, MapPin, Key, Globe, Paintbrush } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { useTour } from '@/lib/TourContext';
const ClientSettingsPage = () => {
  const { resetTour } = useTour();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editData, setEditData] = useState({ 
    name: '', 
    phone_number: '',
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data.client);
      
      const clientSettings = res.data.client.settings || {};
      const sheetsConfig = clientSettings.google_sheets || {};
      
      setEditData({
        name: res.data.user.name,
        phone_number: res.data.client.phone_number || '',
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

  useEffect(() => {
    fetchProfile();
  }, []);

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

      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, payload, {
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
      <div className="max-w-7xl mx-auto pb-20 px-2 sm:px-4 md:px-0">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Account Settings</h1>
            <p className="text-slate-500 font-medium italic">Manage your profile, integration and security.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
            {/* Restart Product Tour button */}
            <button
              onClick={resetTour}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-2xl font-bold text-xs hover:bg-emerald-50 hover:border-emerald-400 transition-all shadow-sm group flex-1 sm:flex-initial text-center"
              title="Replay the guided product tour"
            >
              <MapPin size={15} className="group-hover:animate-bounce" />
              Restart Tour
            </button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex-1 sm:flex-initial text-center">
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
          {/* Personal Information */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Subscription Section */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Plan & Billing</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-100 rounded-3xl gap-4 group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CreditCard size={22} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-900 tracking-tight">Pro Subscription</p>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">Active</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">Next billing on June 01, 2026</p>
                </div>
              </div>
              <button className="text-xs font-bold text-emerald-600 hover:text-slate-900 transition-colors uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl w-full sm:w-auto text-center">
                Manage
              </button>
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
        
      </div>
    </DashboardLayout>
  );
};

export default ClientSettingsPage;



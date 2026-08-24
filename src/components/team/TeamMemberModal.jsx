'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, UserPlus, UserCheck, Key, Mail, User, Phone, Check, 
  ArrowRight, ArrowLeft, RefreshCw, Sparkles, Shield,
  MessageSquare, ShoppingBag, BarChart3, Zap
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const DEPARTMENTS = ['Sales', 'Support', 'Marketing', 'Engineering', 'Operations', 'Finance', 'HR', 'General'];

const SIMPLE_ROLES = [
  { value: 'ORG_ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'INTERN', label: 'Intern' },
];

const PERMISSION_GROUPS = [
  {
    title: 'Messaging & Inbox',
    icon: MessageSquare,
    color: 'text-emerald-600',
    features: [
      { key: 'whatsapp', label: 'WhatsApp Business' },
      { key: 'instagram', label: 'Instagram DMs' },
      { key: 'facebook', label: 'Facebook Page Inbox' },
    ]
  },
  {
    title: 'Automations & AI',
    icon: Zap,
    color: 'text-amber-600',
    features: [
      { key: 'workflows', label: 'Workflows & Triggers' },
      { key: 'broadcast', label: 'Broadcast Campaigns' },
      { key: 'knowledge_base', label: 'AI Knowledge Base' },
    ]
  },
  {
    title: 'Sales & CRM',
    icon: ShoppingBag,
    color: 'text-blue-600',
    features: [
      { key: 'crm', label: 'Leads (CRM)' },
      { key: 'catalog', label: 'Product Catalog' },
      { key: 'orders', label: 'Orders & Payments' },
    ]
  },
  {
    title: 'Reports & Settings',
    icon: BarChart3,
    color: 'text-purple-600',
    features: [
      { key: 'reports', label: 'Daily Work Reports' },
      { key: 'analytics', label: 'Analytics & Insights' },
    ]
  }
];

const WhatsAppIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.43 0 .07 5.36.07 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.91 11.91 0 005.81 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.49-8.43zM12.04 21.84h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.88 9.88 0 01-1.52-5.24C2.17 6.52 6.6 2.08 12.04 2.08c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 6.99c0 5.44-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" fill="currentColor"/>
  </svg>
);

const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.73-2.12 1.39C1.36 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.3.79.73 1.46 1.39 2.12.66.66 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.73 2.12-1.39.66-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91-.3-.79-.73-1.46-1.39-2.12C21.32 1.36 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 2.16c3.2 0 3.59.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.26.07 1.65.07 4.86 0 3.2-.01 3.59-.07 4.85-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.26.06-1.65.07-4.86.07-3.2 0-3.59-.01-4.85-.07-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.65-.07-4.86 0-3.2.01-3.59.07-4.85.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.26-.06 1.65-.07 4.85-.07zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.84a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" fill="currentColor"/>
  </svg>
);

const FacebookIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
  </svg>
);

const CONNECTED_CHANNELS = [
  { 
    id: 'wa_default', 
    channelKey: 'whatsapp',
    name: 'WhatsApp Business', 
    details: 'Cloud API Phone', 
    icon: WhatsAppIcon, 
    color: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
  },
  { 
    id: 'ig_main', 
    channelKey: 'instagram',
    name: 'Instagram Direct', 
    details: 'Business DM Account', 
    icon: InstagramIcon, 
    color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm shadow-pink-500/30' 
  },
  { 
    id: 'fb_page', 
    channelKey: 'facebook',
    name: 'Facebook Page', 
    details: 'Page Messenger', 
    icon: FacebookIcon, 
    color: 'bg-[#1877F2] text-white shadow-sm shadow-blue-500/30' 
  },
];

export default function TeamMemberModal({ isOpen, onClose, onSuccess, existingMembers = [], editMember = null, initialTab = 'basic' }) {
  const [activeStep, setActiveStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('UWOConnect123!');
  const [department, setDepartment] = useState('Sales');
  const [enterpriseRole, setEnterpriseRole] = useState('EMPLOYEE');
  const [designation, setDesignation] = useState('Sales Specialist');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Permissions Matrix
  const [permissionMatrix, setPermissionMatrix] = useState(() => {
    const initial = {};
    PERMISSION_GROUPS.forEach(grp => {
      grp.features.forEach(f => {
        initial[f.key] = 'FULL';
      });
    });
    return initial;
  });

  // Assigned Channels
  const [assignedSocialChannels, setAssignedSocialChannels] = useState(['wa_default', 'ig_main']);

  useEffect(() => {
    if (isOpen) {
      if (editMember) {
        setUsername(editMember.username || editMember.name || '');
        setEmail(editMember.email || '');
        setPhone(editMember.phone_number || '');
        setPassword('');
        setDepartment(editMember.department || 'Sales');
        setEnterpriseRole(editMember.enterprise_role || editMember.role || 'EMPLOYEE');
        setDesignation(editMember.designation || 'Team Member');
        if (editMember.permission_matrix) setPermissionMatrix(editMember.permission_matrix);
        if (editMember.assigned_social_channels) setAssignedSocialChannels(editMember.assigned_social_channels);
      } else {
        setUsername('');
        setEmail('');
        setPhone('');
        setPassword('UWOConnect123!');
        setDepartment('Sales');
        setEnterpriseRole('EMPLOYEE');
        setDesignation('Sales Specialist');
        setAssignedSocialChannels(['wa_default', 'ig_main']);
      }

      if (initialTab === 'channels') setActiveStep(2);
      else if (initialTab === 'permissions') setActiveStep(3);
      else setActiveStep(1);

      setError('');
    }
  }, [isOpen, editMember, initialTab]);

  if (!isOpen) return null;

  const handlePermissionChange = (featureKey, level) => {
    setPermissionMatrix(prev => ({ ...prev, [featureKey]: level }));
  };

  const applyPreset = (presetName) => {
    const updated = {};
    if (presetName === 'ALL_FULL') {
      PERMISSION_GROUPS.forEach(g => g.features.forEach(f => { updated[f.key] = 'FULL'; }));
    } else if (presetName === 'SUPPORT') {
      PERMISSION_GROUPS.forEach(g => g.features.forEach(f => {
        if (['whatsapp', 'instagram', 'facebook', 'telegram', 'crm'].includes(f.key)) {
          updated[f.key] = 'FULL';
        } else {
          updated[f.key] = 'VIEW';
        }
      }));
    } else if (presetName === 'SALES') {
      PERMISSION_GROUPS.forEach(g => g.features.forEach(f => {
        if (['whatsapp', 'crm', 'catalog', 'orders'].includes(f.key)) {
          updated[f.key] = 'FULL';
        } else {
          updated[f.key] = 'VIEW';
        }
      }));
    } else if (presetName === 'VIEW_ONLY') {
      PERMISSION_GROUPS.forEach(g => g.features.forEach(f => { updated[f.key] = 'VIEW'; }));
    }
    setPermissionMatrix(updated);
  };

  const toggleSocialChannel = (channelId) => {
    setAssignedSocialChannels(prev => 
      prev.includes(channelId) ? prev.filter(c => c !== channelId) : [...prev, channelId]
    );
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setError('Member Name and Email are required.');
      setActiveStep(1);
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        username: username.trim(),
        first_name: username.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone.trim(),
        role: 'AGENT',
        enterprise_role: enterpriseRole,
        department,
        designation,
        permission_matrix: permissionMatrix,
        assigned_social_channels: assignedSocialChannels
      };
      if (password) payload.password = password;

      if (editMember) {
        await axios.patch(
          `${API_BASE_URL}/api/team/members/${editMember.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/team/members/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save member details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {editMember ? <UserCheck size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {editMember ? `Edit: ${username || 'Team Member'}` : 'Add Team Member'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {activeStep === 1 && '1. Member profile & role'}
                {activeStep === 2 && `2. Assign channels (${assignedSocialChannels.length} active)`}
                {activeStep === 3 && '3. Permission access levels'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Minimal Stepper Bar */}
        <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs font-bold">
          {[
            { step: 1, label: 'Profile & Role' },
            { step: 2, label: 'Channels' },
            { step: 3, label: 'Permissions' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeStep === s.step 
                  ? 'text-emerald-700 font-black' 
                  : activeStep > s.step 
                  ? 'text-slate-700' 
                  : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeStep === s.step 
                  ? 'bg-emerald-600 text-white' 
                  : activeStep > s.step 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {activeStep > s.step ? <Check size={11} /> : s.step}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* ======================================================== */}
          {/* STEP 1: CLEAN PROFILE & ROLE FORM                        */}
          {/* ======================================================== */}
          {activeStep === 1 && (
            <div className="space-y-4">
              
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password {editMember ? '(optional)' : <span className="text-emerald-600">*</span>}
                    </label>
                    <button 
                      type="button" 
                      onClick={handleGeneratePassword} 
                      className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editMember ? 'Leave blank to keep current' : '••••••••••••'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Role Selection (Simple Pills) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Role
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SIMPLE_ROLES.map((r) => {
                    const isSelected = enterpriseRole === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setEnterpriseRole(r.value)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Department & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Sales Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: SIMPLE CLEAN CHANNEL LIST                        */}
          {/* ======================================================== */}
          {activeStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 text-xs">
                <span className="font-bold text-slate-700">Assign Connected Channels</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px]">
                  {assignedSocialChannels.length} Selected
                </span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {CONNECTED_CHANNELS.map((ch) => {
                  const isAssigned = assignedSocialChannels.includes(ch.id);
                  const Icon = ch.icon;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => toggleSocialChannel(ch.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isAssigned 
                          ? 'bg-emerald-50/50 border-emerald-400/80 shadow-2xs' 
                          : 'bg-white border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ch.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{ch.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{ch.details}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                        isAssigned ? 'bg-emerald-600 text-white shadow-xs' : 'border border-slate-300'
                      }`}>
                        {isAssigned && <Check size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: MINIMAL PERMISSION ACCESS MATRIX                 */}
          {/* ======================================================== */}
          {activeStep === 3 && (
            <div className="space-y-3">
              {/* Presets */}
              <div className="flex items-center justify-between gap-2 pb-1">
                <span className="text-xs font-bold text-slate-700">Presets:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => applyPreset('ALL_FULL')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    Full Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('SUPPORT')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    Support
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('SALES')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    Sales
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('VIEW_ONLY')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    View Only
                  </button>
                </div>
              </div>

              {/* Permission List */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {PERMISSION_GROUPS.map((grp, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                    <p className={`text-[11px] font-black uppercase tracking-wider mb-2 ${grp.color}`}>
                      {grp.title}
                    </p>
                    <div className="space-y-1.5 bg-white rounded-xl p-2 border border-slate-100">
                      {grp.features.map((f) => {
                        const level = permissionMatrix[f.key] || 'FULL';
                        return (
                          <div key={f.key} className="flex items-center justify-between py-1 text-xs">
                            <span className="font-semibold text-slate-800 text-[11px]">{f.label}</span>
                            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                              {['NONE', 'VIEW', 'MANAGE', 'FULL'].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handlePermissionChange(f.key, lvl)}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                                    level === lvl 
                                      ? (lvl === 'NONE' ? 'bg-rose-500 text-white' : lvl === 'FULL' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white')
                                      : 'text-slate-400 hover:text-slate-800'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 1 && (!username.trim() || !email.trim())) {
                    setError('Please enter member Name and Email to continue.');
                    return;
                  }
                  setError('');
                  setActiveStep(prev => prev + 1);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Next: {activeStep === 1 ? 'Channels' : 'Permissions'}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editMember ? 'Update Member' : 'Add Member'}</span>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


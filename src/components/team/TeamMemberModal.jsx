'use client';

import React, { useState } from 'react';
import { X, UserPlus, Shield, Building2, UserCheck, Key, Mail, User, Phone, Globe, Clock, CheckCircle2, Sliders, MessageSquare, Instagram, Facebook } from 'lucide-react';
import axios from 'axios';

const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'Support', 'Design', 'HR', 'Finance', 'Executive'];
const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Owner / Super Admin' },
  { value: 'ORG_ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'TEAM_LEAD', label: 'Team Lead' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'GUEST', label: 'Custom / Guest' },
];

const PERMISSION_FEATURES = [
  { key: 'instagram', label: 'Instagram Inbox & Messages' },
  { key: 'facebook', label: 'Facebook Inbox & Pages' },
  { key: 'whatsapp', label: 'WhatsApp Business Number' },
  { key: 'messenger', label: 'Messenger Chat' },
  { key: 'telegram', label: 'Telegram Support' },
  { key: 'workflows', label: 'Visual Workflows' },
  { key: 'broadcast', label: 'Broadcast Campaigns' },
  { key: 'crm', label: 'Leads & CRM' },
  { key: 'knowledge_base', label: 'AI Knowledge Base' },
  { key: 'catalog', label: 'Product Catalog' },
  { key: 'orders', label: 'Orders & Payments' },
  { key: 'reports', label: 'Daily Work Reports' },
  { key: 'analytics', label: 'Analytics & Insights' },
  { key: 'settings', label: 'Workspace Settings' },
  { key: 'billing', label: 'Billing & Subscriptions' },
];

const CONNECTED_CHANNELS = [
  { id: 'wa_default', name: 'WhatsApp Main (+123456789)', type: 'WhatsApp' },
  { id: 'ig_main', name: 'Instagram Main (@uwoconnect)', type: 'Instagram' },
  { id: 'fb_page', name: 'Facebook Page (UWOConnect)', type: 'Facebook' },
  { id: 'tg_support', name: 'Telegram (@uwosupport)', type: 'Telegram' },
  { id: 'li_company', name: 'LinkedIn Company Page', type: 'LinkedIn' },
];

import { useEffect } from 'react';

export default function TeamMemberModal({ isOpen, onClose, onSuccess, existingMembers = [], editMember = null }) {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'permissions' | 'channels'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('UWOConnect123!');
  const [department, setDepartment] = useState('Engineering');
  const [enterpriseRole, setEnterpriseRole] = useState('EMPLOYEE');
  const [designation, setDesignation] = useState('Software Engineer');
  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportingManager, setReportingManager] = useState('');
  const [timezoneStr, setTimezoneStr] = useState('UTC');
  const [workingHours, setWorkingHours] = useState('9:00 AM - 6:00 PM');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Permissions Matrix State
  const [permissionMatrix, setPermissionMatrix] = useState(() => {
    const initial = {};
    PERMISSION_FEATURES.forEach(f => {
      initial[f.key] = 'FULL';
    });
    return initial;
  });

  // Assigned Channels State
  // Assigned Channels State
  const [assignedSocialChannels, setAssignedSocialChannels] = useState(['wa_default', 'ig_main']);

  useEffect(() => {
    if (isOpen) {
      if (editMember) {
        setUsername(editMember.username || '');
        setEmail(editMember.email || '');
        setPhone(editMember.phone_number || '');
        setPassword('');
        setDepartment(editMember.department || 'General');
        setEnterpriseRole(editMember.enterprise_role || editMember.role || 'EMPLOYEE');
        setDesignation(editMember.designation || '');
        setEmployeeId(editMember.employee_id || '');
        setJoiningDate(editMember.joining_date || new Date().toISOString().split('T')[0]);
        setReportingManager(editMember.reporting_manager || '');
        setTimezoneStr(editMember.timezone || 'UTC');
        setWorkingHours(editMember.working_hours || '9:00 AM - 6:00 PM');
        setLanguage(editMember.language || 'English');
        if (editMember.permission_matrix) setPermissionMatrix(editMember.permission_matrix);
        if (editMember.assigned_social_channels) setAssignedSocialChannels(editMember.assigned_social_channels);
      } else {
        setUsername('');
        setEmail('');
        setPhone('');
        setPassword('UWOConnect123!');
        setDepartment('Engineering');
        setEnterpriseRole('EMPLOYEE');
        setDesignation('Software Engineer');
        setEmployeeId(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
        setJoiningDate(new Date().toISOString().split('T')[0]);
        setReportingManager('');
        setTimezoneStr('UTC');
        setWorkingHours('9:00 AM - 6:00 PM');
        setLanguage('English');
        setAssignedSocialChannels(['wa_default', 'ig_main']);
      }
      setActiveTab('basic');
      setError('');
    }
  }, [isOpen, editMember]);

  if (!isOpen) return null;

  const handlePermissionChange = (featureKey, level) => {
    setPermissionMatrix(prev => ({ ...prev, [featureKey]: level }));
  };

  const toggleSocialChannel = (channelId) => {
    setAssignedSocialChannels(prev => 
      prev.includes(channelId) ? prev.filter(c => c !== channelId) : [...prev, channelId]
    );
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || (!password && !editMember)) {
      setError('Username, email, and password are required.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
          username,
          email,
          phone_number: phone,
          role: 'AGENT',
          enterprise_role: enterpriseRole,
          department,
          designation,
          employee_id: employeeId,
          joining_date: joiningDate,
          reporting_manager: reportingManager || null,
          timezone: timezoneStr,
          working_hours: workingHours,
          language,
          permission_matrix: permissionMatrix,
          assigned_social_channels: assignedSocialChannels
      };
      if (password) payload.password = password;

      if (editMember) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/members/${editMember.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/members/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            {editMember ? <UserCheck size={20} /> : <UserPlus size={20} />}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">{editMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{editMember ? 'Update details and permissions' : 'Create a new employee profile'}</p>
          </div>
        </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4 text-xs font-bold">
          <button 
            type="button" 
            onClick={() => setActiveTab('basic')}
            className={`pb-2 transition-all border-b-2 cursor-pointer ${activeTab === 'basic' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            1. Basic Information
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('permissions')}
            className={`pb-2 transition-all border-b-2 cursor-pointer ${activeTab === 'permissions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            2. Permissions Matrix
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('channels')}
            className={`pb-2 transition-all border-b-2 cursor-pointer ${activeTab === 'channels' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            3. Assigned Channels ({assignedSocialChannels.length})
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" /> Full Name / Username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. aditi_sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@uwo24.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5 justify-between">
                    <span className="flex items-center gap-1.5"><Key size={13} className="text-slate-400" /> Password *</span>
                    <button type="button" onClick={handleGeneratePassword} className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer">Generate Temp</button>
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:border-emerald-500"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Role</label>
                  <select
                    value={enterpriseRole}
                    onChange={(e) => setEnterpriseRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:border-emerald-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Sales Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Reporting Manager</label>
                  <select
                    value={reportingManager}
                    onChange={(e) => setReportingManager(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none"
                  >
                    <option value="">None (Reports to Client Admin)</option>
                    {existingMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.username} ({m.designation || m.role})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERMISSION MATRIX */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/80">
                <p className="text-[11px] font-semibold text-emerald-800">
                  🛡️ <strong>Granular Permission Control</strong>: Set access levels (No Access, View, Manage, Full Access) for every module.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {PERMISSION_FEATURES.map(f => (
                  <div key={f.key} className="p-3 flex items-center justify-between hover:bg-slate-50/50">
                    <span className="font-bold text-slate-800">{f.label}</span>
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      {['NONE', 'VIEW', 'MANAGE', 'FULL'].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handlePermissionChange(f.key, lvl)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider transition-all cursor-pointer ${
                            permissionMatrix[f.key] === lvl 
                              ? (lvl === 'NONE' ? 'bg-rose-500 text-white' : lvl === 'FULL' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white')
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNED CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Assign Social Media Channels</h4>
                <p className="text-[11px] text-slate-500">
                  Select which social channels this employee can view and manage in their dashboard.
                </p>
              </div>

              <div className="space-y-2">
                {CONNECTED_CHANNELS.map(ch => {
                  const isAssigned = assignedSocialChannels.includes(ch.id);
                  return (
                    <div 
                      key={ch.id} 
                      onClick={() => toggleSocialChannel(ch.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isAssigned ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/10' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-emerald-600 shadow-2xs">
                          {ch.type === 'WhatsApp' ? '💬' : ch.type === 'Instagram' ? '📸' : '🌐'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{ch.name}</p>
                          <p className="text-[10px] text-slate-400">{ch.details}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isAssigned ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {isAssigned ? 'Assigned' : 'Unassigned'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">Client Admin Control Panel</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 text-xs font-black tracking-widest uppercase transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : (editMember ? 'Update Member' : 'Create Member')}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

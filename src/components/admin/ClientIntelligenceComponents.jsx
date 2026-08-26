'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  XCircle, Clock, Globe, Smartphone, MessageSquare, 
  Send, Mail, Cloud, FileText, Video, Share2, 
  Users, Layers, ExternalLink, Plus, Edit3, Trash2, 
  Download, RefreshCw, ChevronRight, ArrowRight, 
  Check, X, Bot, Brain, ShoppingBag, Receipt, Sparkles,
  Info, Eye, Lock, Unlock, PhoneCall
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 🟢 ClientHealthBadge Component
 */
export function ClientHealthBadge({ health, showScore = true, size = 'md' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  if (!health) return null;

  const status = health.status || 'HEALTHY';
  const score = health.score ?? 85;
  const label = health.label || (status === 'HEALTHY' ? 'Healthy' : status === 'NEEDS_ATTENTION' ? 'Needs Attention' : 'Inactive');

  const configs = {
    HEALTHY: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-500/20'
    },
    NEEDS_ATTENTION: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500 animate-pulse',
      ring: 'ring-amber-500/20'
    },
    INACTIVE: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      ring: 'ring-rose-500/20'
    }
  };

  const current = configs[status] || configs.HEALTHY;

  return (
    <div className="relative inline-block" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <span className={cn(
        "inline-flex items-center gap-1.5 font-bold rounded-full border shadow-2xs transition-all cursor-help select-none",
        current.bg,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      )}>
        <span className={cn("w-2 h-2 rounded-full", current.dot)} />
        <span>{label}</span>
        {showScore && <span className="opacity-75 font-mono text-[10px]">({score})</span>}
      </span>

      {showTooltip && health.breakdown && health.breakdown.length > 0 && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1.5 animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-1 text-[11px] text-slate-300">
            <span>Health Factors</span>
            <span className="text-emerald-400 font-mono">{score}/100</span>
          </div>
          {health.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{item.factor}:</span>
              <span className="font-semibold text-slate-200">+{item.points} pts ({item.status})</span>
            </div>
          ))}
          <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
}

/**
 * ⚡ ChannelAccessMatrix Component
 * 2D Interactive matrix of Team Members × Channels
 */
export function ChannelAccessMatrix({ team = [], channels = [], onUpdateAccess, loading = false }) {
  const [editingMember, setEditingMember] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const channelKeys = [
    { key: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, category: 'Messaging' },
    { key: 'facebook', name: 'Facebook', icon: Share2, category: 'Social' },
    { key: 'instagram', name: 'Instagram', icon: Share2, category: 'Social' },
    { key: 'telegram', name: 'Telegram', icon: Send, category: 'Messaging' },
    { key: 'linkedin', name: 'LinkedIn', icon: Globe, category: 'Social' },
    { key: 'twitter', name: 'X / Twitter', icon: Globe, category: 'Social' },
    { key: 'youtube', name: 'YouTube', icon: Video, category: 'Media' },
    { key: 'gmail', name: 'Gmail', icon: Mail, category: 'Email' },
    { key: 'outlook', name: 'Outlook', icon: Mail, category: 'Email' },
    { key: 'onedrive', name: 'OneDrive', icon: Cloud, category: 'Storage' },
  ];

  const handleStartEdit = (member) => {
    setEditingMember(member);
    setSelectedChannels(member.assigned_channels || []);
  };

  const handleToggleChannel = (chKey) => {
    setSelectedChannels(prev => 
      prev.includes(chKey) ? prev.filter(k => k !== chKey) : [...prev, chKey]
    );
  };

  const handleSave = async () => {
    if (!editingMember) return;
    if (onUpdateAccess) {
      await onUpdateAccess(editingMember.id, selectedChannels);
    }
    setEditingMember(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={18} />
            Team Member → Channel Access Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage granular communication channel permissions for every team member in this client workspace.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Assigned Access
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> No Access
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10 w-56">Team Member</th>
              <th className="py-3 px-3 w-28">Role</th>
              {channelKeys.map(ch => (
                <th key={ch.key} className="py-3 px-3 text-center min-w-[85px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-slate-700 font-semibold">{ch.name}</span>
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 text-right sticky right-0 bg-slate-50 z-10 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {team.map((member) => {
              const isEditing = editingMember?.id === member.id;
              const assigned = isEditing ? selectedChannels : (member.assigned_channels || []);
              const isAdmin = member.role === 'ADMIN' || member.enterprise_role === 'SUPER_ADMIN';

              return (
                <tr key={member.id} className={cn("hover:bg-slate-50/60 transition-colors", isEditing && "bg-emerald-50/30")}>
                  {/* Member Name */}
                  <td className="py-3.5 px-4 sticky left-0 bg-white z-10 border-r border-slate-100 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-extrabold uppercase border border-slate-200">
                        {member.name?.charAt(0) || member.username?.charAt(0) || 'U'}
                      </div>
                      <div className="truncate">
                        <div className="truncate text-slate-900">{member.name || member.username}</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      isAdmin ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {member.enterprise_role || member.role}
                    </span>
                  </td>

                  {/* Channel Columns */}
                  {channelKeys.map(ch => {
                    const isGranted = isAdmin || assigned.map(k => k.toLowerCase()).includes(ch.key.toLowerCase());

                    return (
                      <td key={ch.key} className="py-3.5 px-3 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleToggleChannel(ch.key)}
                            className={cn(
                              "w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer",
                              isGranted 
                                ? "bg-emerald-500 text-white shadow-2xs hover:bg-emerald-600 scale-105" 
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            )}
                          >
                            {isGranted ? <Check size={14} strokeWidth={3} /> : <X size={12} />}
                          </button>
                        ) : (
                          <div className="flex items-center justify-center">
                            {isGranted ? (
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center" title="Access Granted">
                                <Check size={13} strokeWidth={2.5} />
                              </span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" title="No Access" />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Edit Actions */}
                  <td className="py-3.5 px-4 text-right sticky right-0 bg-white z-10 border-l border-slate-100">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 shadow-2xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMember(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(member)}
                        className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold text-[11px] transition-all"
                      >
                        Edit
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
  );
}

/**
 * 🔄 QuotationConversionPipeline Component
 * Visual Funnel: Quotation ➡️ Proposal ➡️ Invoice
 */
export function QuotationConversionPipeline({ quotations = [], proposals = [], invoices = [] }) {
  const totalQuotations = quotations.length;
  const convertedQuotations = quotations.filter(q => q.status === 'CONVERTED' || q.status === 'ACCEPTED').length;
  
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter(p => p.status === 'ACCEPTED').length;

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.payment_status === 'PAID').length;

  const quoteToPropRate = totalQuotations ? Math.round((convertedQuotations / totalQuotations) * 100) : 0;
  const propToInvRate = totalProposals ? Math.round((acceptedProposals / totalProposals) * 100) : 0;
  const invPaidRate = totalInvoices ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Receipt className="text-emerald-600" size={16} />
          Commercial Conversion Pipeline
        </h4>
        <span className="text-[11px] font-semibold text-slate-400">
          Quotation ➔ Proposal ➔ Invoice Flow
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {/* Stage 1: Quotations */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>1. Quotations</span>
              <span className="text-emerald-700 font-bold">{quoteToPropRate}% Conversion</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{totalQuotations}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{convertedQuotations} Accepted / Converted</p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${quoteToPropRate}%` }} />
          </div>
        </div>

        {/* Stage 2: Proposals */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>2. Proposals</span>
              <span className="text-blue-700 font-bold">{propToInvRate}% Accepted</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{totalProposals}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{acceptedProposals} Digitally Signed</p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${propToInvRate}%` }} />
          </div>
        </div>

        {/* Stage 3: Invoices */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>3. Invoices & Payments</span>
              <span className="text-emerald-700 font-bold">{invPaidRate}% Paid</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{totalInvoices}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{paidInvoices} Fully Settled</p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${invPaidRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ➕ AdminAddTeamMemberModal Component
 */
export function AdminAddTeamMemberModal({ isOpen, onClose, onSubmit, projects = [], loading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    enterprise_role: 'EMPLOYEE',
    department: 'Sales',
    project_id: '',
    assigned_channels: ['whatsapp']
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Team Member to Client</h3>
            <p className="text-xs text-slate-500">Create a user and assign roles, project, and channels.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Rahul"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="rahul@company.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enterprise Role</label>
              <select
                value={formData.enterprise_role}
                onChange={(e) => handleChange('enterprise_role', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
              >
                <option value="ADMIN">Admin / Org Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="EMPLOYEE">Employee / Agent</option>
                <option value="INTERN">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Sales / Support"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
              />
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Project (Optional)</label>
              <select
                value={formData.project_id}
                onChange={(e) => handleChange('project_id', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
              >
                <option value="">-- No Project (Workspace Wide) --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              {loading && <RefreshCw size={12} className="animate-spin" />}
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 📁 AdminAssignProjectModal Component
 */
export function AdminAssignProjectModal({ isOpen, onClose, onSubmit, projects = [], team = [], loading = false }) {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('MEMBER');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId || !userId) return;
    if (onSubmit) onSubmit({ project_id: projectId, user_id: userId, permission_level: permissionLevel });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assign Member to Project</h3>
            <p className="text-xs text-slate-500">Map a team member and define project permissions.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
            >
              <option value="">-- Choose Project --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Team Member *</label>
            <select
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
            >
              <option value="">-- Choose Team Member --</option>
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name || m.username} ({m.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Permission Level</label>
            <select
              value={permissionLevel}
              onChange={(e) => setPermissionLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-500"
            >
              <option value="LEAD">Project Lead / Manager (Full Access)</option>
              <option value="MEMBER">Standard Member (Read / Write)</option>
              <option value="VIEWER">Viewer (Read Only)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !projectId || !userId}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              {loading && <RefreshCw size={12} className="animate-spin" />}
              Assign Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

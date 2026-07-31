'use client';

import React, { useState } from 'react';
import { X, UserPlus, Shield, Building2, UserCheck, Key, Mail, User } from 'lucide-react';
import axios from 'axios';

const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'Support', 'Design', 'HR', 'Finance', 'Executive'];
const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ORG_ADMIN', label: 'Organization Admin' },
  { value: 'HR', label: 'HR Manager' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'TEAM_LEAD', label: 'Team Lead' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'GUEST', label: 'Guest' },
];

export default function TeamMemberModal({ isOpen, onClose, onSuccess, existingMembers = [] }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [enterpriseRole, setEnterpriseRole] = useState('EMPLOYEE');
  const [designation, setDesignation] = useState('Software Engineer');
  const [reportingManager, setReportingManager] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Username, email, and password are required');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/`,
        {
          username,
          email,
          password,
          role: 'AGENT',
          enterprise_role: enterpriseRole,
          department,
          designation,
          reporting_manager: reportingManager || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Add Team Member</h3>
              <p className="text-xs text-slate-400">Create employee account with custom roles and permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. john_doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" /> Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Key size={13} className="text-slate-400" /> Login Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Shield size={13} className="text-slate-400" /> Designation Title
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Frontend Dev"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400" /> Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
                <Shield size={13} className="text-slate-400" /> Organization Role
              </label>
              <select
                value={enterpriseRole}
                onChange={(e) => setEnterpriseRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5">
              <UserCheck size={13} className="text-slate-400" /> Reporting Manager
            </label>
            <select
              value={reportingManager}
              onChange={(e) => setReportingManager(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">None (Reports to Admin)</option>
              {existingMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.username} ({m.designation || m.role})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Employee Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

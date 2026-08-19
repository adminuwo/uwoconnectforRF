'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Plus, Trash2, Mail, ShieldCheck, Loader2,
  ChevronRight, Activity, Power, X, Globe, Smartphone,
  MoreVertical, MessageSquare, Eye, ExternalLink, CheckCircle2,
  XCircle, Clock, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon,
  Layers, Bot, Receipt, FileText, Share2, Key, EyeOff
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminClients() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [approvalFilter, setApprovalFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  // New state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  // New state for password change modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [clientForPassword, setClientForPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    plan: 'GROWTH'
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/clients-directory/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          status: statusFilter,
          approval: approvalFilter,
          page: page,
          page_size: 10
        }
      });
      setClients(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.total_count || 0);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter, approvalFilter, page]);

  const handleClientAction = async (clientId, action, extraPayload = {}) => {
    try {
      setActionLoading(prev => ({ ...prev, [clientId]: true }));
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/clients/${clientId}/action/`,
        { action, ...extraPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [clientId]: false }));
      setActiveMenuId(null);
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
          client_name: client.company_name || client.client_name,
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
      await axios.post(`${API_BASE_URL}/api/clients/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddModalOpen(false);
      setFormData({ business_name: '', email: '', phone_number: '', plan: 'GROWTH' });
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register client.');
    }
  };

  const handleOpenDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await handleClientAction(clientToDelete.id, 'DELETE_CLIENT');
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPasswordModal = (client) => {
    setClientForPassword(client);
    setNewPassword('');
    setShowPassword(false);
    setIsPasswordModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmPasswordChange = async () => {
    if (!clientForPassword || !newPassword) return;
    try {
      await handleClientAction(clientForPassword.id, 'CHANGE_PASSWORD', { new_password: newPassword });
      setIsPasswordModalOpen(false);
      setClientForPassword(null);
      setNewPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-20 px-4 sm:px-10 lg:px-12 font-sans" onClick={() => setActiveMenuId(null)}>
        
        {/* ── Clean Minimal Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Clients
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-[#059669] text-xs font-bold rounded-full border border-emerald-100">
                {totalCount} total
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage client workspaces, channels, messages, and team permissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} /> Add Client
            </button>
            <button
              onClick={fetchClients}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* ── Clean Search & Status Pills Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              name="search_client_directory_input"
              autoComplete="off"
              placeholder="Search by company, name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#059669] transition-all outline-none"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'ACTIVE', label: 'Active' },
              { id: 'SUSPENDED', label: 'Suspended' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  statusFilter === f.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {f.label}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'PENDING', label: 'Pending Approval' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setApprovalFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  approvalFilter === f.id
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spacious, Simple Clients Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-5">Client</th>
                  <th className="py-3.5 px-4">Plan & Status</th>
                  <th className="py-3.5 px-4 text-center">Channels</th>
                  <th className="py-3.5 px-4 text-center">Messages</th>
                  <th className="py-3.5 px-4 text-center">Projects</th>
                  <th className="py-3.5 px-4 text-center">Invoices</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-slate-400">
                      <Loader2 className="animate-spin text-[#059669] mx-auto mb-2" size={28} />
                      <p className="text-xs font-semibold">Loading clients...</p>
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 text-xs">
                      No clients found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                    >
                      {/* Client info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] font-black flex items-center justify-center text-sm uppercase shrink-0 border border-emerald-100">
                            {client.company_name?.[0] || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#059669] transition-colors text-sm">
                              {client.company_name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {client.client_name} • {client.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan & Status */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide",
                            client.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          )}>
                            {client.status}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {client.plan}
                          </span>
                          {client.approval_status === 'PENDING' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-700">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Connected Channels Icons */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px]",
                            client.channels?.whatsapp ? "bg-emerald-50 text-[#059669]" : "bg-slate-100 text-slate-300"
                          )} title="WhatsApp">
                            <Smartphone size={13} />
                          </span>
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px]",
                            client.channels?.facebook ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-300"
                          )} title="Facebook">
                            <Share2 size={13} />
                          </span>
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px]",
                            client.channels?.gmail ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-300"
                          )} title="Gmail">
                            <Mail size={13} />
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 ml-1">
                            {client.active_channels || 0} active
                          </span>
                        </div>
                      </td>

                      {/* Messages */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <p className="font-bold text-slate-900">{client.total_messages ?? 0}</p>
                        <p className="text-[10px] text-slate-400">
                          {client.bot_messages ?? 0} bot • {client.human_replies ?? 0} agent
                        </p>
                      </td>

                      {/* Projects */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="font-bold text-slate-800">
                          {client.active_projects ?? 0} active
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {client.team_members ?? 1} team
                        </p>
                      </td>

                      {/* Invoices */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="font-bold text-slate-800">
                          {client.invoice_count ?? 0} invoices
                        </span>
                        <p className="text-[10px] text-emerald-600 font-semibold">
                          {client.proposal_count ?? 0} proposals
                        </p>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#059669] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all"
                          >
                            Open Workspace
                          </Link>

                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === client.id ? null : client.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeMenuId === client.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in duration-100 font-sans">
                                <button
                                  onClick={() => handleOpenClientWorkspace(client)}
                                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
                                >
                                  <ExternalLink size={13} /> Open Workspace
                                </button>
                                
                                <button
                                  onClick={() => handleOpenPasswordModal(client)}
                                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                  <Key size={13} /> Change Password
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {client.approval_status === 'PENDING' && (
                                  <button
                                    onClick={() => handleClientAction(client.id, 'APPROVE')}
                                    className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#059669] hover:bg-emerald-50 cursor-pointer"
                                  >
                                    <CheckCircle2 size={13} /> Approve Client
                                  </button>
                                )}

                                {client.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => handleClientAction(client.id, 'SUSPEND')}
                                    className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                  >
                                    <Power size={13} /> Suspend Client
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleClientAction(client.id, 'ACTIVATE')}
                                    className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#059669] hover:bg-emerald-50 cursor-pointer"
                                  >
                                    <CheckCircle2 size={13} /> Activate Client
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleOpenDeleteModal(client)}
                                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 size={13} /> Delete Client
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination */}
          <div className="py-3 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page} of {totalPages} ({totalCount} clients)</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
              >
                <ChevronRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Add Client Modal ── */}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && clientToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Delete Client</h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Are you sure you want to delete <strong>{clientToDelete.company_name || clientToDelete.business_name}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={handleConfirmDelete} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Password Change Modal */}
        {isPasswordModalOpen && clientForPassword && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmPasswordChange(); }} autoComplete="off" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Change Password for {clientForPassword.company_name || clientForPassword.business_name}</h3>
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-slate-600 mb-1 font-bold">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="new_password_client_field"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#059669]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Add Client</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corporation"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Primary Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#059669]"
                  >
                    <option value="FREE">Free Tier</option>
                    <option value="STARTER">Starter Tier</option>
                    <option value="GROWTH">Growth Tier</option>
                    <option value="ENTERPRISE">Enterprise Tier</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

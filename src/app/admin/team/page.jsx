'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Search, ShieldCheck, Mail, Phone, Loader2,
  Filter, CheckCircle2, Clock, Activity, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminTeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workforce'); // 'workforce' or 'analytics'

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-team/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, role: roleFilter }
        });
        setTeam(res.data || []);
      } catch (err) {
        console.error('Failed to fetch platform team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [search, roleFilter]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/team-summary/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data || []);
      } catch (err) {
        console.error('Failed to fetch client team summary', err);
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        {/* Header */}
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-100 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full">
              Platform Workforce
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Team Management & Workforce Analytics
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Monitor all registered team members, roles, activity, and message throughput across all client workspaces.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('workforce')}
            className={cn(
              "px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
              activeTab === 'workforce'
                ? "border-[#059669] text-[#059669]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Workforce List ({team.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
              activeTab === 'analytics'
                ? "border-[#059669] text-[#059669]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Client Workspace Analytics ({summary.length})
          </button>
        </div>

        {activeTab === 'analytics' ? (
          <div>
            {/* Summary KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="absolute right-4 bottom-4 opacity-10 text-white font-black text-7xl select-none">W</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Total Workspaces</p>
                <p className="text-3xl font-extrabold mt-1">{summary.length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Teams (Channels)</p>
                <p className="text-3xl font-extrabold mt-1 text-slate-800">
                  {summary.reduce((acc, curr) => acc + curr.total_teams, 0)}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Workforce Members</p>
                <p className="text-3xl font-extrabold mt-1 text-slate-800">
                  {summary.reduce((acc, curr) => acc + curr.total_members, 0)}
                </p>
              </div>
            </div>

            {/* Client-Wise Breakdown List */}
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2 uppercase tracking-wider mb-6">
                <span className="w-1.5 h-4 bg-[#059669] rounded-full inline-block" />
                Workspaces Breakdown
              </h2>
            </div>

            {summaryLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse flex flex-col gap-3 shadow-xs">
                    <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="h-10 bg-slate-50 rounded-xl" />
                      <div className="h-10 bg-slate-50 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                        <th className="p-5 pl-6">Client Workspace</th>
                        <th className="p-5 text-center">Total Teams (Channels)</th>
                        <th className="p-5 text-center">Total Workforce (Members)</th>
                        <th className="p-5 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {summary.map((item) => (
                        <tr key={item.client_id} className="hover:bg-slate-50/50">
                          <td className="p-5 pl-6 font-extrabold text-slate-900 text-sm">
                            {item.client_name}
                          </td>
                          <td className="p-5 text-center text-slate-800 text-sm font-bold">
                            {item.total_teams}
                          </td>
                          <td className="p-5 text-center text-slate-800 text-sm font-bold">
                            {item.total_members}
                          </td>
                          <td className="p-5 pr-6 text-right">
                            {item.client_id !== 'platform' ? (
                              <Link
                                href={`/admin/clients/${item.client_id}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-[#059669] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all"
                              >
                                Manage Client <ExternalLink size={12} />
                              </Link>
                            ) : (
                              <span className="text-slate-300 text-xs italic">System</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search team members by name, email, or client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#059669] transition-all shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none text-slate-700 shadow-2xs focus:border-[#059669]"
                >
                  <option value="ALL">All Enterprise Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ORG_ADMIN">Org Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
            </div>

            {/* Team Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              {loading ? (
                <div className="py-28 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-[#059669]" size={36} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching workforce data...</p>
                </div>
              ) : team.length === 0 ? (
                <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
                  No team members found.
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <th className="p-4 pl-6">Member</th>
                        <th className="p-4">Client Workspace</th>
                        <th className="p-4">Role & Designation</th>
                        <th className="p-4">Engagement</th>
                        <th className="p-4">Last Active</th>
                        <th className="p-4 pr-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {team.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] font-black flex items-center justify-center text-xs uppercase border border-emerald-100/50 shrink-0">
                                {u.name?.[0] || u.username?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-950 text-sm">{u.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono font-medium">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                              {u.client_name}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-800 font-bold text-xs">{u.designation || 'Team Member'}</p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {u.department || 'General'} • <span className="uppercase text-[10px] font-black text-slate-500">{u.role}</span>
                            </p>
                          </td>
                          <td className="p-4 text-slate-500 text-xs">
                            <span className="font-bold text-slate-800">{u.messages_count || 0}</span> msgs
                            <span className="mx-1.5 text-slate-300">•</span>
                            <span className="font-bold text-slate-800">{u.reports_count || 0}</span> reports
                          </td>
                          <td className="p-4 text-slate-500 text-xs font-medium">
                            {u.last_active ? new Date(u.last_active).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                u.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                              )} />
                              <span className={cn(
                                "text-xs font-bold",
                                u.is_online ? "text-emerald-600" : "text-slate-400"
                              )}>
                                {u.is_online ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminTeamPage;

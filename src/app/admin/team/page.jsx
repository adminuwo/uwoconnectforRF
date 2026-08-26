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

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-team/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, role: roleFilter }
        });
        setTeam(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        console.error('Failed to fetch platform team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [search, roleFilter]);

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

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search team members by name, email, or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold focus:border-[#059669]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none text-slate-800"
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
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
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
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4 pl-6">Member & Username</th>
                    <th className="p-4">Client Workspace</th>
                    <th className="p-4">Enterprise Role</th>
                    <th className="p-4">Department & Designation</th>
                    <th className="p-4 text-center">Messages</th>
                    <th className="p-4 text-center">Reports</th>
                    <th className="p-4">Last Active</th>
                    <th className="p-4 pr-6 text-right">Online Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {team.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                        <p className="font-extrabold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800">{u.client_name}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 font-bold">{u.designation || 'Team Member'}</p>
                        <p className="text-[10px] text-slate-400">{u.department || 'General'}</p>
                      </td>
                      <td className="p-4 text-center font-black text-slate-900">{u.messages_count}</td>
                      <td className="p-4 text-center font-black text-slate-900">{u.reports_count}</td>
                      <td className="p-4 text-slate-500">{u.last_active ? new Date(u.last_active).toLocaleString() : 'Never'}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                          u.is_online ? "bg-emerald-100 text-[#059669]" : "bg-slate-100 text-slate-500"
                        )}>
                          {u.is_online ? 'Online' : 'Offline'}
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
    </DashboardLayout>
  );
};

export default AdminTeamPage;

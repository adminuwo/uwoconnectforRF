'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileCheck, Search, Loader2, Clock, CheckSquare } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-reports/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        console.error('Failed to fetch platform reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter(rep =>
    rep.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    rep.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
    rep.todays_work?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full">
              Operations & Submissions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Work Reports & Operational Stream
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Monitor daily employee work submissions, logged hours, completed tasks, and operational blockers across all client workspaces.
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search reports by employee, client, or task details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold focus:border-[#059669]"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-28 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#059669]" size={36} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading work reports...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
              No work reports found.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4 pl-6">Client Workspace</th>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Report Date</th>
                    <th className="p-4">Work Done Summary</th>
                    <th className="p-4">Blockers</th>
                    <th className="p-4 pr-6 text-right">Hours Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filtered.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-900">{rep.client_name}</td>
                      <td className="p-4 font-extrabold text-purple-700">{rep.employee_name}</td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">{rep.report_date}</td>
                      <td className="p-4 max-w-md">
                        <p className="text-slate-800 line-clamp-2">{rep.todays_work}</p>
                      </td>
                      <td className="p-4">
                        {rep.blockers && rep.blockers !== 'None' ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                            {rep.blockers}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right font-black text-slate-900">{rep.hours_worked} hrs</td>
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

export default AdminReportsPage;

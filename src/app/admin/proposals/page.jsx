'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-proposals/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProposals(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        console.error('Failed to fetch platform proposals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const filtered = proposals.filter(p =>
    p.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.document_number?.toLowerCase().includes(search.toLowerCase()) ||
    p.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">
              Sales Documents
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Proposals Management
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Monitor client proposals, digital contracts, and client view tracking.
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search proposals by number, customer, or client..."
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
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading proposals...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
              No proposals found.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4 pl-6">Client Workspace</th>
                    <th className="p-4">Proposal #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Grand Total</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-900">{p.client_name}</td>
                      <td className="p-4 font-mono font-extrabold text-indigo-600">{p.document_number}</td>
                      <td className="p-4">{p.customer_name}</td>
                      <td className="p-4 font-black text-slate-900">{p.currency_symbol}{p.grand_total.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase",
                          p.status === 'ACCEPTED' ? "bg-emerald-100 text-[#059669]" :
                          p.status === 'VIEWED' ? "bg-purple-100 text-purple-700" :
                          p.status === 'SENT' ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-slate-400">{p.document_date}</td>
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

export default AdminProposalsPage;

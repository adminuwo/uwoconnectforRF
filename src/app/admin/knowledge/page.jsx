'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Brain, Search, Loader2, FileText, Database,
  CheckCircle2, Clock, Layers, RefreshCw, X,
  AlertCircle, ExternalLink, Filter
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminKnowledgePage() {
  const [data, setData] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchKnowledgeData = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('token');
      const [overviewRes, clientsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/overview/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/admin/clients/overview/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setData(overviewRes.data);
      setClients(clientsRes.data?.clients || clientsRes.data?.results || []);
    } catch (err) {
      console.error('[AdminKnowledge] Failed to fetch knowledge base stats', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const totalKnowledgeBaseDocs = data?.kpis?.totalKnowledgeBaseDocuments ?? 0;

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Knowledge Base & RAG Document Index
              </h1>
              <span className="px-2.5 py-0.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200">
                {totalKnowledgeBaseDocs} Indexed Docs
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Platform-wide indexed enterprise knowledge documents powering AI semantic search and bot contextual answers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchKnowledgeData(true)}
              disabled={isRefreshing}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} className={cn(isRefreshing && "animate-spin text-emerald-600")} />
            </button>
            <Link
              href="/admin/clients"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Layers size={14} /> Manage Clients
            </Link>
          </div>
        </div>

        {/* ── Search & Summary Row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search workspace or business..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 font-medium transition-all shadow-2xs"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-bold">
            Showing knowledge base index across <span className="text-slate-900">{filteredClients.length}</span> workspaces
          </div>
        </div>

        {/* ── Full-Width Workspaces Knowledge Index Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto mb-2" />
              <span className="text-xs font-bold">Loading Knowledge Index...</span>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle size={24} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">No workspaces match your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3 px-4">Client Workspace</th>
                    <th className="py-3 px-4 text-center">KB Documents</th>
                    <th className="py-3 px-4 text-center">AI Bot Status</th>
                    <th className="py-3 px-4 text-center">Active Plan</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => {
                    const kbCount = client.kb_docs_count || 0;

                    return (
                      <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link href={`/admin/clients/${client.id}?tab=knowledge`} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-extrabold text-xs uppercase border border-violet-100">
                              {client.business_name?.charAt(0) || 'K'}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {client.business_name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {client.client_name || client.email}
                              </div>
                            </div>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 border",
                            kbCount > 0
                              ? "bg-violet-50 text-violet-700 border-violet-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          )}>
                            <FileText size={13} />
                            {kbCount} Documents
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            client.bot_usage?.ai_enabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          )}>
                            {client.bot_usage?.ai_enabled ? 'AI Enabled' : 'Auto Bot'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold uppercase text-[10px] text-slate-600">
                          {client.plan || 'GROWTH'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/clients/${client.id}?tab=knowledge`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg font-bold text-xs transition-all inline-flex items-center gap-1"
                          >
                            Inspect KB &rarr;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

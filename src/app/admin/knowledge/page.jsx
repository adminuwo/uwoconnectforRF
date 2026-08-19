'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, Search, Loader2, FileText, Database,
  CheckCircle2, Clock, Layers
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminKnowledgePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/overview/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch knowledge base stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        {/* Header */}
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-widest rounded-full">
              RAG Embeddings
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Base & Document Index
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Repository of indexed enterprise documents powering semantic search and AI contextual answers.
          </p>
        </div>

        {/* Metric Card */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Brain size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Indexed Documents</p>
              <h3 className="text-3xl font-black text-slate-900">{kpis.totalKnowledgeBaseDocuments ?? 0} Documents</h3>
            </div>
          </div>
          <Link
            href="/admin/clients"
            className="px-5 py-3 bg-[#059669] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#047857] transition-all"
          >
            Inspect by Client &rarr;
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminKnowledgePage;

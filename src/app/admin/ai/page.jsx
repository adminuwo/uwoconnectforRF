'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, Brain, Sparkles, Zap, Loader2, CheckCircle2,
  Clock, ArrowRight, MessageSquare, Database
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminAIPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/overview/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch AI stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIData();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between my-4 pb-3 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Assistant & Bot Control Center
          </h1>
        </div>

        {/* AI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Bot size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active AI Bots</p>
            <h4 className="text-3xl font-black text-slate-900">{kpis.activeBots ?? 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Brain size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Knowledge Base Docs</p>
            <h4 className="text-3xl font-black text-slate-900">{kpis.totalKnowledgeBaseDocuments ?? 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <MessageSquare size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Chats Handled</p>
            <h4 className="text-3xl font-black text-slate-900">{kpis.totalChats ?? 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Messages</p>
            <h4 className="text-3xl font-black text-slate-900">{kpis.totalMessages ?? 0}</h4>
          </div>
        </div>

        {/* AI Control Center Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">RAG Document Ingestion Engine</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
              UWOConnect transforms enterprise PDFs, DOCX files, and policies into 1536-dimensional vector embeddings for low-latency context retrieval during customer chats.
            </p>
            <Link
              href="/admin/knowledge"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Inspect Knowledge Repositories &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">Autonomous Channel Routing</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
              AI bots monitor WhatsApp, Instagram, and Facebook streams 24/7, providing instant answers and triggering human handoffs when high-intent leads request team intervention.
            </p>
            <Link
              href="/admin/channels"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Inspect Connected Channels &rarr;
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminAIPage;

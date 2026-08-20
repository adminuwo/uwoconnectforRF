'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Link2, CheckCircle2, XCircle, Search, Loader2,
  ExternalLink, Layers, MessageSquare, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminChannelsPage = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-channels/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChannels(res.data || []);
      } catch (err) {
        console.error('Failed to fetch channels inventory', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  const filteredChannels = channels.filter(c => 
    c.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        {/* Header */}
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-100 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full">
              Integrations & Connectors
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Channel Management & Integrations Center
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Audit and manage all connected communication, storage, and AI channels across every client node.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search clients by business name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold focus:border-[#059669]"
            />
          </div>
        </div>

        {/* Channels Grid */}
        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#059669]" size={36} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning channels...</p>
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
            No client channels found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChannels.map((c) => (
              <div key={c.client_id} className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{c.client_name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Workspace ID: #{c.client_id}</p>
                    </div>
                    <Link
                      href={`/admin/clients/${c.client_id}`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-[#059669] text-[#059669] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Inspect &rarr;
                    </Link>
                  </div>

                  {/* Channel status badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-4">
                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.whatsapp.connected ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">WhatsApp</span>
                      {c.whatsapp.connected ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.instagram ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">Instagram</span>
                      {c.instagram ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.facebook ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">Facebook</span>
                      {c.facebook ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.gmail ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">Gmail</span>
                      {c.gmail ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.google_sheets ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">G-Sheets</span>
                      {c.google_sheets ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.onedrive ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">OneDrive</span>
                      {c.onedrive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.youtube ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">YouTube</span>
                      {c.youtube ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.outlook ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">Outlook</span>
                      {c.outlook ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>

                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-between", c.zoho ? "bg-emerald-50 border-emerald-100 text-[#059669]" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <span className="font-bold">Zoho CRM</span>
                      {c.zoho ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>WhatsApp Phone ID: {c.whatsapp.phone_number_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminChannelsPage;

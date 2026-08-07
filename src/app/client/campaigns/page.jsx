'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateCampaignModal from '@/components/campaigns/CreateCampaignModal';
import { Megaphone, RefreshCw, Loader2, Play, Users, CheckCircle2, XCircle, AlertCircle, Eye, CheckCheck } from 'lucide-react';
import axios from 'axios';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/campaigns/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  const syncTemplates = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/templates/sync_from_meta/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "Templates synced successfully!");
    } catch (err) {
      console.error("Failed to sync templates", err);
      alert(err.response?.data?.message || "Failed to sync templates. Make sure Meta credentials are set.");
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SENDING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SCHEDULED': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="bg-white font-sans flex flex-col min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-6 sm:py-8 shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <Megaphone size={20} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Broadcast Campaigns</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">Send bulk messages to your contacts using approved Meta templates.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
              onClick={syncTemplates}
              disabled={syncing}
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 flex-1 md:flex-none"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? 'Syncing...' : 'Sync Templates'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-200 flex items-center justify-center gap-2 transition-all flex-1 md:flex-none"
            >
              <Play size={16} />
              New Broadcast
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center max-w-sm mx-auto">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Megaphone size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No campaigns yet</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Start reaching your customers by syncing your Meta templates and creating your first broadcast campaign.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all w-full">
                Create First Broadcast
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-black text-xl border border-slate-100 shrink-0">
                      {campaign.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{campaign.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {campaign.channel || 'WHATSAPP'}
                        </span>
                        <span className="flex items-center gap-1.5"><Users size={12} /> Target: {campaign.audience_filter}</span>
                        <span className="hidden sm:inline">•</span>
                        {campaign.scheduled_at ? (
                          <span className="text-amber-600">📅 Scheduled for: {new Date(campaign.scheduled_at).toLocaleString()}</span>
                        ) : (
                          <span>Created: {new Date(campaign.created_at).toLocaleString()}</span>
                        )}
                        {campaign.body && (
                           <>
                             <span className="hidden sm:inline">•</span>
                             <span className="truncate max-w-[150px] inline-block" title={campaign.body}>"{campaign.body}"</span>
                           </>
                        )}
                      </div>
                    </div>
                  </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex gap-4 sm:gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Sent</p>
                          <p className="font-black text-slate-900 flex items-center justify-center gap-1"><CheckCircle2 size={14} className="text-slate-400"/> {campaign.total_sent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Delivered</p>
                          <p className="font-black text-slate-900 flex items-center justify-center gap-1"><CheckCheck size={14} className="text-emerald-400"/> {campaign.total_delivered}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Read</p>
                          <p className="font-black text-slate-900 flex items-center justify-center gap-1"><Eye size={14} className="text-blue-400"/> {campaign.total_read}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Failed</p>
                          <p className="font-black text-slate-900 flex items-center justify-center gap-1"><XCircle size={14} className="text-rose-400"/> {campaign.total_failed}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-lg border text-xs font-bold tracking-widest uppercase shrink-0 ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={fetchCampaigns} 
      />
    </DashboardLayout>
  );
}


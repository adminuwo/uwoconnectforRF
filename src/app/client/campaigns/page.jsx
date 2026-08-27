'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateCampaignModal from '@/components/campaigns/CreateCampaignModal';
import CampaignDetailModal from '@/components/campaigns/CampaignDetailModal';
import { 
  Megaphone, RefreshCw, Loader2, Play, Users, CheckCircle2, XCircle, 
  CheckCheck, Eye, ChevronRight, Trash2
} from 'lucide-react';
import axios from 'axios';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [platformFilter, setPlatformFilter] = useState('ALL');

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/campaigns/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const campaignsData = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setCampaigns(campaignsData);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  const syncTemplates = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/templates/sync_from_meta/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "Templates synced successfully!");
    } catch (err) {
      console.error("Failed to sync templates", err);
      alert(err.response?.data?.message || "Failed to sync templates.");
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SENDING': return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'SCHEDULED': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleDeleteCampaign = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    
    // Handle MongoDB ObjectId if it comes as an object
    const campaignId = typeof id === 'object' && id !== null ? (id.$oid || id._id || id.id) : id;
    
    try {
      const token = localStorage.getItem('uwo_token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/campaigns/${campaignId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(prev => prev.filter(c => {
         const cId = typeof c.id === 'object' && c.id !== null ? (c.id.$oid || c.id._id || c.id.id) : c.id;
         return cId !== campaignId;
      }));
    } catch (err) {
      console.error("Failed to delete campaign", err);
      alert("Failed to delete campaign.");
    }
  };

  const totalSent = campaigns.reduce((sum, c) => sum + (c.total_sent || 0), 0);
  const totalFailed = campaigns.reduce((sum, c) => sum + (c.total_failed || 0), 0);

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-6xl mx-auto pb-16 space-y-6">
        
        {/* Simple Clean Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00AB56] flex items-center justify-center">
                <Megaphone size={20} />
              </span>
              Broadcast Campaigns
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Send bulk message campaigns across WhatsApp, Email &amp; SMS.</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={syncTemplates}
              disabled={syncing}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin text-[#00AB56]" : "text-slate-500"} />
              {syncing ? 'Syncing...' : 'Sync Templates'}
            </button>

            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play size={14} />
              New Broadcast
            </button>
          </div>
        </div>

        {/* Clean Stat Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Total Campaigns</span>
            <span className="text-lg font-black text-slate-900">{campaigns.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Messages Sent</span>
            <span className="text-lg font-black text-emerald-600">{totalSent.toLocaleString()}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Failed Deliveries</span>
            <span className="text-lg font-black text-rose-600">{totalFailed.toLocaleString()}</span>
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-3">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-semibold gap-2 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="animate-spin text-[#00AB56]" size={20} />
              Loading campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
              <Megaphone size={28} className="text-[#00AB56] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">No campaigns yet</h3>
              <p className="text-xs text-slate-400 mb-4">Create your first broadcast to reach your contacts.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2 bg-[#00AB56] text-white rounded-xl font-bold text-xs"
              >
                Create Broadcast
              </button>
            </div>
          ) : (
            campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaign(camp)}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#00AB56]/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00AB56] border border-emerald-100 flex items-center justify-center font-bold text-sm shrink-0">
                    {camp.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00AB56] transition-colors">
                        {camp.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(camp.status)}`}>
                        {camp.status}
                      </span>
                      {camp.has_followup && (
                        <span title="Auto Follow-up Enabled" className="flex items-center justify-center bg-amber-100 text-amber-600 rounded-full w-5 h-5 text-xs">
                          ⚡
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400 font-medium flex-wrap">
                      {(camp.platforms && camp.platforms.length > 0) ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {camp.platforms.join(', ')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {camp.channel || 'WHATSAPP'}
                        </span>
                      )}
                      <span>•</span>
                      <span>Target: {camp.audience_filter || 'ALL'}</span>
                      <span>•</span>
                      {camp.scheduled_at ? (
                        <span className="text-amber-600">📅 {new Date(camp.scheduled_at).toLocaleString()}</span>
                      ) : (
                        <span>{new Date(camp.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Sent</span>
                      <span className="font-bold text-slate-900">{camp.total_sent || 0}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Delivered</span>
                      <span className="font-bold text-emerald-600">{camp.total_delivered || 0}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Failed</span>
                      <span className="font-bold text-rose-600">{camp.total_failed || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDeleteCampaign(e, camp.id || camp._id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#00AB56] transition-colors" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchCampaigns}
      />

      <CampaignDetailModal
        isOpen={!!selectedCampaign}
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onRefresh={fetchCampaigns}
      />
    </DashboardLayout>
  );
}

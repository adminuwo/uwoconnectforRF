'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateCampaignModal from '@/components/campaigns/CreateCampaignModal';
import CampaignDetailModal from '@/components/campaigns/CampaignDetailModal';
import AddMoneyModal from '@/components/billing/AddMoneyModal';
import { 
  Megaphone, RefreshCw, Loader2, Play, Users, CheckCircle2, XCircle, 
  ChevronRight, Trash2, Search, Filter, Clock, Send, Sparkles, Wallet
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All Campaigns' },
  { id: 'SENDING', label: 'Sending' },
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'FAILED', label: 'Failed' },
];

export default function CampaignsPage() {
  const { isDark } = useTheme();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailModalTab, setDetailModalTab] = useState('SENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const openDetailModal = (camp, tab = 'SENT') => {
    setSelectedCampaign(camp);
    setDetailModalTab(tab);
  };

  const [entitlement, setEntitlement] = useState({
    included_quantity: 1,
    used_quantity: 0,
    remaining_quantity: 1,
    broadcast_rate_inr: 0.94,
    wallet_balance_inr: 0,
    can_broadcast: true
  });

  useEffect(() => {
    fetchCampaigns();
    fetchEntitlement();
    const interval = setInterval(() => {
      fetchCampaigns();
      fetchEntitlement();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchEntitlement = async () => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/broadcasts/entitlement/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setEntitlement(res.data);
    } catch (err) {
      console.error("Failed to fetch entitlement summary", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/campaigns/`, {
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
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/templates/sync_from_meta/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "Templates synced successfully from Meta!");
    } catch (err) {
      console.error("Failed to sync templates", err);
      alert(err.response?.data?.message || "Failed to sync templates from Meta.");
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SENDING': return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'SCHEDULED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleDeleteCampaign = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this broadcast campaign?")) return;
    
    const campaignId = typeof id === 'object' && id !== null ? (id.$oid || id._id || id.id) : id;
    
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/campaigns/${campaignId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(prev => prev.filter(c => {
         const cId = typeof c.id === 'object' && c.id !== null ? (c.id.$oid || c.id._id || c.id.id) : (c.id || c._id);
         return String(cId) !== String(campaignId);
      }));
    } catch (err) {
      console.error("Failed to delete campaign", err);
      alert("Failed to delete campaign.");
    }
  };

  // Filter campaigns by search query and status filter
  const filteredCampaigns = campaigns.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const channel = (c.channel || '').toLowerCase();
    const audience = (c.audience_filter || '').toLowerCase();
    return name.includes(q) || channel.includes(q) || audience.includes(q);
  });

  const totalSent = campaigns.reduce((sum, c) => sum + (c.total_sent || 0), 0);
  const totalFailed = campaigns.reduce((sum, c) => sum + (c.total_failed || 0), 0);

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-6xl mx-auto pb-16 px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className={cn(
          "p-4 sm:p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-colors",
          isDark ? "bg-[#0f172a] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
        )}>
          <div>
            <h1 className={cn("text-lg sm:text-2xl font-extrabold tracking-tight flex items-center gap-2 sm:gap-2.5", isDark ? "text-white" : "text-slate-900")}>
              <span className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs border",
                isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-[#00AB56]"
              )}>
                <Megaphone size={18} />
              </span>
              <span>Broadcast Campaigns</span>
            </h1>
            <p className={cn("text-xs font-medium mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Send bulk marketing campaigns, product updates &amp; announcements across WhatsApp &amp; Meta channels.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button 
              onClick={syncTemplates}
              disabled={syncing}
              className={cn(
                "w-full sm:w-auto justify-center px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs border",
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              )}
              title="Sync Approved Templates from Meta WhatsApp Cloud API"
            >
              <RefreshCw size={13} className={syncing ? "animate-spin text-[#00AB56]" : (isDark ? "text-slate-400" : "text-slate-500")} />
              <span>{syncing ? 'Syncing...' : 'Sync Meta Templates'}</span>
            </button>

            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play size={13} />
              <span>New Broadcast</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsAddMoneyOpen(true)}
            className={cn(
              "p-3 sm:p-4 rounded-2xl border shadow-xs text-left cursor-pointer hover:scale-[1.01] transition-all group relative overflow-hidden",
              isDark
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border-slate-800 text-white"
                : "bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-200/80 text-slate-900"
            )}
            title="Click to Recharge / Add Money to Wallet"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn("text-[9px] sm:text-[10px] font-black uppercase tracking-wider block", isDark ? "text-indigo-300" : "text-emerald-800")}>
                Broadcast Entitlement
              </span>
              <span className={cn(
                "text-[8px] px-1.5 py-0.5 rounded font-black border",
                isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border-emerald-300"
              )}>
                + Topup
              </span>
            </div>
            <span className={`text-sm sm:text-lg font-black block truncate ${entitlement.remaining_quantity > 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-amber-400' : 'text-amber-600')}`}>
              {entitlement.remaining_quantity > 0 
                ? `${entitlement.remaining_quantity} / ${entitlement.included_quantity} Plan Free`
                : `₹${Number(entitlement.broadcast_rate_inr || 0.94).toFixed(2)} / Wallet`}
            </span>
            <span className={cn("text-[10px] block mt-0.5 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
              Wallet: ₹{Number(entitlement.wallet_balance_inr || 0).toFixed(2)}
            </span>
          </button>

          <div className={cn(
            "p-3 sm:p-4 rounded-2xl border shadow-xs transition-colors",
            isDark ? "bg-[#0f172a] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
          )}>
            <span className={cn("text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Total Campaigns
            </span>
            <span className={cn("text-base sm:text-xl font-black block", isDark ? "text-white" : "text-slate-900")}>
              {campaigns.length}
            </span>
            <span className={cn("text-[10px] block mt-0.5", isDark ? "text-slate-400" : "text-slate-400")}>
              Across all channels
            </span>
          </div>
          
          <div className={cn(
            "p-3 sm:p-4 rounded-2xl border shadow-xs transition-colors",
            isDark ? "bg-[#0f172a] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
          )}>
            <span className={cn("text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Messages Sent
            </span>
            <span className="text-base sm:text-xl font-black text-emerald-500 block">
              {totalSent.toLocaleString()}
            </span>
            <span className={cn("text-[10px] block mt-0.5 font-medium", isDark ? "text-emerald-400/80" : "text-emerald-700/80")}>
              Delivered directly
            </span>
          </div>
          
          <div className={cn(
            "p-3 sm:p-4 rounded-2xl border shadow-xs transition-colors",
            isDark ? "bg-[#0f172a] border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
          )}>
            <span className={cn("text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Failed Deliveries
            </span>
            <span className="text-base sm:text-xl font-black text-rose-500 block">
              {totalFailed.toLocaleString()}
            </span>
            <span className={cn("text-[10px] block mt-0.5", isDark ? "text-slate-400" : "text-slate-400")}>
              Eligible for retry
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className={cn(
          "p-3 sm:p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors",
          isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200/80"
        )}>
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
            <input
              type="text"
              placeholder="Search campaigns by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold outline-none transition-all border",
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              )}
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
                  statusFilter === f.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : isDark
                      ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-2.5 sm:space-y-3">
          {loading ? (
            <div className={cn(
              "h-48 flex items-center justify-center text-xs font-semibold gap-2 rounded-2xl border shadow-xs transition-colors",
              isDark ? "bg-[#0f172a] border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-400"
            )}>
              <Loader2 className="animate-spin text-[#00AB56]" size={20} />
              Loading broadcast campaigns...
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className={cn(
              "text-center py-12 rounded-2xl border shadow-xs max-w-md mx-auto p-6 transition-colors",
              isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-900"
            )}>
              <Megaphone size={32} className="text-[#00AB56] mx-auto mb-2.5 opacity-90" />
              <h3 className={cn("text-sm font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                {campaigns.length === 0 ? "No campaigns yet" : "No matching campaigns found"}
              </h3>
              <p className={cn("text-xs mb-4 font-medium", isDark ? "text-slate-400" : "text-slate-400")}>
                {campaigns.length === 0 
                  ? "Create your first broadcast to reach your customers via WhatsApp." 
                  : "Try clearing your search query or status filter."}
              </p>
              {campaigns.length === 0 && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-all"
                >
                  Create New Broadcast
                </button>
              )}
            </div>
          ) : (
            filteredCampaigns.map((camp) => {
              const campId = typeof camp.id === 'object' && camp.id !== null 
                ? (camp.id.$oid || camp.id._id || camp.id.id) 
                : (camp.id || camp._id);

              const total = camp.total_recipients || (camp.total_sent + camp.total_failed) || 0;
              const delivered = camp.total_delivered || camp.total_sent || 0;
              const percent = total > 0 ? Math.min(100, Math.round((delivered / total) * 100)) : 0;

              return (
                <div
                  key={campId}
                  onClick={() => openDetailModal(camp, (camp.total_failed > 0 && (!camp.total_sent || camp.total_sent === 0)) ? 'FAILED' : 'SENT')}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border shadow-xs hover:border-[#00AB56]/50 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group",
                    isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 shadow-xs",
                      isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-400" : "bg-emerald-50 text-[#00AB56] border-emerald-100"
                    )}>
                      {(camp.name || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={cn("text-xs sm:text-sm font-bold group-hover:text-[#00AB56] transition-colors truncate", isDark ? "text-white" : "text-slate-900")}>
                          {camp.name}
                        </h3>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase shrink-0 ${getStatusBadge(camp.status)}`}>
                          {camp.status}
                        </span>
                        {camp.has_followup && (
                          <span title="Smart Auto Follow-up Drip Configured" className="flex items-center justify-center bg-amber-100 text-amber-700 rounded-md px-1.5 py-0.5 text-[10px] font-black shrink-0">
                            ⚡ Drip
                          </span>
                        )}
                      </div>

                      <div className={cn("flex items-center gap-1.5 sm:gap-2 mt-1.5 text-[10px] sm:text-[11px] font-medium flex-wrap", isDark ? "text-slate-400" : "text-slate-500")}>
                        <span className={cn("px-1.5 py-0.5 rounded font-semibold shrink-0 border", isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-transparent text-slate-700")}>
                          {camp.channel || (camp.platforms && camp.platforms[0]) || 'WHATSAPP'}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[140px]">Audience: <strong>{camp.audience_filter || 'ALL'}</strong></span>
                        <span>•</span>
                        {camp.scheduled_at ? (
                          <span className="text-amber-500 font-semibold shrink-0">
                            📅 {new Date(camp.scheduled_at).toLocaleDateString()} {new Date(camp.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="shrink-0">{new Date(camp.created_at).toLocaleDateString()}</span>
                        )}
                      </div>

                      {/* Mini Progress Bar */}
                      {total > 0 && (
                        <div className={cn("w-full max-w-xs h-1.5 rounded-full overflow-hidden mt-2.5", isDark ? "bg-slate-800" : "bg-slate-100")}>
                          <div 
                            className="h-full bg-[#00AB56] rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={cn("flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-xs pt-2.5 sm:pt-0 border-t sm:border-t-0", isDark ? "border-slate-800" : "border-slate-100")}>
                    <div className={cn("flex gap-2 sm:gap-2.5 p-1.5 sm:p-0 rounded-xl sm:rounded-none", isDark ? "bg-slate-800/60 sm:bg-transparent" : "bg-slate-50 sm:bg-transparent")}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openDetailModal(camp, 'SENT'); }}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl border border-transparent transition-all text-center cursor-pointer group/stat",
                          isDark ? "hover:bg-emerald-950/60 hover:border-emerald-800" : "hover:bg-emerald-50 hover:border-emerald-200"
                        )}
                        title="Click to view list of Sent contacts"
                      >
                        <span className={cn("text-[8px] sm:text-[9px] group-hover/stat:text-emerald-500 font-bold uppercase block", isDark ? "text-slate-400" : "text-slate-400")}>Sent</span>
                        <span className={cn("font-extrabold group-hover/stat:text-emerald-500 text-xs sm:text-sm", isDark ? "text-white" : "text-slate-900")}>{camp.total_sent || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openDetailModal(camp, 'SENT'); }}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl border border-transparent transition-all text-center cursor-pointer group/stat",
                          isDark ? "hover:bg-emerald-950/60 hover:border-emerald-800" : "hover:bg-emerald-50 hover:border-emerald-200"
                        )}
                        title="Click to view list of Delivered contacts"
                      >
                        <span className="text-[8px] sm:text-[9px] text-emerald-500 font-bold uppercase block">Delivered</span>
                        <span className="font-extrabold text-emerald-500 text-xs sm:text-sm">{camp.total_delivered || camp.total_sent || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openDetailModal(camp, 'FAILED'); }}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl border transition-all text-center cursor-pointer group/stat",
                          (camp.total_failed || 0) > 0 
                            ? (isDark ? "bg-rose-950/60 border-rose-800 text-rose-300" : "bg-rose-50/80 border-rose-200/90 text-rose-600 hover:bg-rose-100 hover:border-rose-300")
                            : (isDark ? "border-transparent hover:bg-slate-800" : "border-transparent hover:bg-slate-100")
                        )}
                        title="Click to view list of Failed contacts & reasons"
                      >
                        <span className={`text-[8px] sm:text-[9px] font-bold uppercase block ${(camp.total_failed || 0) > 0 ? (isDark ? 'text-rose-400' : 'text-rose-600') : 'text-slate-400'}`}>Failed</span>
                        <span className={`font-extrabold text-xs sm:text-sm ${(camp.total_failed || 0) > 0 ? (isDark ? 'text-rose-400' : 'text-rose-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>{camp.total_failed || 0}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <button 
                        onClick={(e) => handleDeleteCampaign(e, campId)}
                        className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", isDark ? "text-slate-400 hover:text-rose-400 hover:bg-rose-950/60" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50")}
                        title="Delete Campaign"
                      >
                        <Trash2 size={15} />
                      </button>
                      <ChevronRight size={16} className={cn("transition-colors", isDark ? "text-slate-500 group-hover:text-[#00AB56]" : "text-slate-400 group-hover:text-[#00AB56]")} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modals */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchCampaigns}
      />

      <CampaignDetailModal
        isOpen={!!selectedCampaign}
        campaign={selectedCampaign}
        initialTab={detailModalTab}
        onClose={() => setSelectedCampaign(null)}
        onRefresh={fetchCampaigns}
      />

      {isAddMoneyOpen && (
        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={() => setIsAddMoneyOpen(false)}
          onSuccess={() => {
            fetchEntitlement();
          }}
        />
      )}
    </DashboardLayout>
  );
}

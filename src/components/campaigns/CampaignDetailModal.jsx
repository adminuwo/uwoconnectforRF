'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, XCircle, Download, RotateCcw, ShieldAlert, BarChart3, 
  Loader2, Send, Search, CheckCheck, AlertCircle, Phone, User, Clock, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function CampaignDetailModal({ isOpen, campaign, initialTab = 'SENT', onClose, onRefresh }) {
  const [retrying, setRetrying] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab || 'SENT');
  const [modalSearch, setModalSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      } else if (campaign?.total_failed > 0 && (!campaign?.total_sent || campaign?.total_sent === 0)) {
        setActiveTab('FAILED');
      } else {
        setActiveTab('SENT');
      }
      setModalSearch('');
    }
  }, [isOpen, initialTab, campaign]);

  if (!isOpen || !campaign) return null;

  const campId = typeof campaign.id === 'object' && campaign.id !== null 
    ? (campaign.id.$oid || campaign.id._id || campaign.id.id) 
    : (campaign.id || campaign._id);

  const total = campaign.total_recipients || (campaign.total_sent + campaign.total_failed) || 1;
  const sentCount = campaign.total_sent || 0;
  const deliveredCount = campaign.total_delivered || campaign.total_sent || 0;
  const failedCount = campaign.total_failed || 0;
  const progressPercent = Math.min(100, Math.round(((sentCount + failedCount) / total) * 100)) || 0;
  const successRate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;

  const sentItems = campaign.sent_recipients || [];
  const failedItems = campaign.failed_recipients || [];

  const filteredSent = sentItems.filter(item => {
    if (!modalSearch.trim()) return true;
    const q = modalSearch.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.platform || '').toLowerCase().includes(q)
    );
  });

  const filteredFailed = failedItems.filter(item => {
    if (!modalSearch.trim()) return true;
    const q = modalSearch.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q) ||
      (item.reason || '').toLowerCase().includes(q) ||
      (item.platform || '').toLowerCase().includes(q)
    );
  });

  const handleRetryAll = async () => {
    setRetrying(true);
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/campaigns/${campId}/retry_failed/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Retry initiated for all failed recipients!");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Retry failed:", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to initiate retry.");
    } finally {
      setRetrying(false);
    }
  };

  const handleRetrySingle = async (contactId) => {
    if (!contactId) return;
    setRetryingId(contactId);
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/campaigns/${campId}/retry_failed/`,
        { contact_ids: [String(contactId)] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Retry initiated for this recipient!");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Single retry failed:", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to retry recipient.");
    } finally {
      setRetryingId(null);
    }
  };

  const handleExportSent = () => {
    if (!sentItems || sentItems.length === 0) {
      alert("No sent records to export.");
      return;
    }
    const headers = ["Name,Phone,Channel,Status,Time\n"];
    const rows = sentItems.map(s => `"${s.name || ''}","${s.phone || ''}","${s.platform || 'WhatsApp'}","${s.status || 'DELIVERED'}","${s.time || ''}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sent_Report_${(campaign.name || 'Campaign').replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  const handleExportFailed = () => {
    if (!failedItems || failedItems.length === 0) {
      alert("No failed records to export.");
      return;
    }
    const headers = ["Name,Phone,Channel,Reason,Status,Time\n"];
    const rows = failedItems.map(f => `"${f.name || ''}","${f.phone || ''}","${f.platform || 'WhatsApp'}","${f.reason || ''}","${f.status || 'FAILED'}","${f.time || ''}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Failed_Report_${(campaign.name || 'Campaign').replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  const formatDisplayTime = (isoStr) => {
    if (!isoStr) return 'Just now';
    try {
      const dt = new Date(isoStr);
      return `${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${dt.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/80 max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00AB56] flex items-center justify-center font-bold shrink-0 shadow-xs border border-emerald-100">
              <BarChart3 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{campaign.name}</h2>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                  campaign.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  campaign.status === 'SENDING' ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse' :
                  campaign.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                Created on {new Date(campaign.created_at).toLocaleDateString()} • Channel: {campaign.channel || 'WHATSAPP'} • Total: {total} Contacts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {failedCount > 0 && (
              <button
                onClick={handleRetryAll}
                disabled={retrying}
                className="px-3 sm:px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} className={retrying ? "animate-spin" : ""} />
                <span className="hidden sm:inline">{retrying ? 'Retrying...' : 'Retry All Failed'}</span>
                <span className="sm:hidden">Retry All</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Clean Interactive Progress & Metric Cards */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Overall Delivery Progress</span>
            <span className="text-[#00AB56] font-extrabold">{progressPercent}% ({sentCount + failedCount}/{total})</span>
          </div>

          <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mb-3 sm:mb-4">
            <div className="h-full bg-[#00AB56] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
            {/* Sent Clickable Box */}
            <div 
              onClick={() => setActiveTab('SENT')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                activeTab === 'SENT' 
                  ? 'bg-emerald-50/80 border-[#00AB56] ring-2 ring-emerald-500/20' 
                  : 'bg-white border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sent</span>
              <span className="text-base sm:text-lg font-black text-slate-900">{sentCount}</span>
              <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Click to view list</span>
            </div>

            {/* Delivered Clickable Box */}
            <div 
              onClick={() => setActiveTab('SENT')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                activeTab === 'SENT' 
                  ? 'bg-emerald-50/80 border-[#00AB56] ring-2 ring-emerald-500/20' 
                  : 'bg-white border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
              <span className="text-base sm:text-lg font-black text-emerald-600">{deliveredCount}</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">{successRate}% Success</span>
            </div>

            {/* Read Box */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Read</span>
              <span className="text-base sm:text-lg font-black text-blue-600">{campaign.total_read || 0}</span>
              <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Read receipts</span>
            </div>

            {/* Failed Clickable Box */}
            <div 
              onClick={() => setActiveTab('FAILED')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                activeTab === 'FAILED' 
                  ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20' 
                  : 'bg-white border-slate-200/70 hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Failed</span>
              <span className="text-base sm:text-lg font-black text-rose-600">{failedCount}</span>
              <span className="text-[9px] text-rose-600 font-bold block mt-0.5">Click to view reasons</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="px-4 sm:px-6 pt-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex gap-4 sm:gap-6 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('SENT')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'SENT' ? 'border-[#00AB56] text-[#00AB56]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <CheckCheck size={15} />
              <span>Sent Recipients ({sentCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('FAILED')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'FAILED' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <XCircle size={15} />
              <span>Failed Recipients ({failedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ANALYTICS' ? 'border-[#00AB56] text-[#00AB56]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <BarChart3 size={15} />
              <span>Channel Analytics</span>
            </button>
          </div>

          {(activeTab === 'SENT' || activeTab === 'FAILED') && (
            <div className="relative w-full sm:w-64 pb-2 sm:pb-2.5">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'SENT' ? "Search sent numbers or names..." : "Search failed numbers or reasons..."}
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          
          {/* TAB 1: SENT RECIPIENTS */}
          {activeTab === 'SENT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Delivered Messages ({filteredSent.length}{filteredSent.length !== sentItems.length ? ` of ${sentItems.length}` : ''})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    List of customer phone numbers that successfully received this broadcast.
                  </p>
                </div>
                {sentItems.length > 0 && (
                  <button
                    onClick={handleExportSent}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                )}
              </div>

              {filteredSent.length === 0 ? (
                <div className="text-center py-12 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <CheckCircle2 size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    {sentItems.length === 0 ? "No Sent Records Available" : "No matches found"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sentItems.length === 0 ? "Delivered recipients will show here once messages are processed." : "Try adjusting your search query."}
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <div className="max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Recipient Name</th>
                          <th className="p-3">Phone Number</th>
                          <th className="p-3">Channel</th>
                          <th className="p-3">Delivery Time</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredSent.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#00AB56] flex items-center justify-center font-bold text-[10px] shrink-0">
                                {(item.name || 'C')[0].toUpperCase()}
                              </span>
                              <span className="truncate max-w-[150px]">{item.name || 'Customer'}</span>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-600 font-semibold">{item.phone || 'N/A'}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00AB56] border border-emerald-200 text-[10px] font-bold">
                                {item.platform || 'WhatsApp'}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-slate-500">{formatDisplayTime(item.time)}</td>
                            <td className="p-3 text-right">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                                <CheckCheck size={12} /> Delivered
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAILED RECIPIENTS */}
          {activeTab === 'FAILED' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Failed Deliveries ({filteredFailed.length}{filteredFailed.length !== failedItems.length ? ` of ${failedItems.length}` : ''})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Numbers where delivery failed, along with the exact root cause.
                  </p>
                </div>
                {failedItems.length > 0 && (
                  <button
                    onClick={handleExportFailed}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                )}
              </div>

              {filteredFailed.length === 0 ? (
                <div className="text-center py-12 border border-emerald-100 rounded-2xl bg-emerald-50/30">
                  <CheckCircle2 size={36} className="text-[#00AB56] mx-auto mb-2" />
                  <p className="text-xs font-extrabold text-slate-900">Zero Failed Deliveries!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">All campaign recipients were delivered smoothly.</p>
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <div className="max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Recipient Name</th>
                          <th className="p-3">Phone / Contact ID</th>
                          <th className="p-3">Channel</th>
                          <th className="p-3">Reason for Failure</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredFailed.map((item, idx) => {
                          const isRetryingThis = retryingId === item.id;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {(item.name || 'C')[0].toUpperCase()}
                                </span>
                                <span className="truncate max-w-[150px]">{item.name || 'Customer'}</span>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-slate-600 font-semibold">{item.phone || 'N/A'}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                  {item.platform || 'WhatsApp'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-start gap-1.5 text-rose-600 font-bold text-[11px]">
                                  <AlertCircle size={13} className="shrink-0 mt-0.5 text-rose-500" />
                                  <span>{item.reason}</span>
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleRetrySingle(item.id)}
                                  disabled={isRetryingThis || retrying || !item.phone || item.phone === 'N/A'}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-800 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer transition-all disabled:opacity-40"
                                  title={!item.phone || item.phone === 'N/A' ? 'Cannot retry contact with missing phone number' : 'Retry sending message'}
                                >
                                  {isRetryingThis ? 'Retrying...' : 'Retry'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-xs font-bold text-slate-900 block mb-1">WhatsApp Cloud API Delivery</span>
                  <div className="text-xl font-black text-emerald-600 mb-1">{successRate}% Delivery Rate</div>
                  <span className="text-xs text-slate-500 font-medium">Delivered: {deliveredCount} / {total} recipients</span>
                  <div className="mt-3 text-[11px] text-emerald-800 bg-white p-2.5 rounded-xl border border-emerald-200">
                    Official Meta WhatsApp Business Cloud API used for compliant messaging.
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Failure Breakdown</span>
                  <div className="text-xl font-black text-rose-600 mb-1">{failedCount} Failed</div>
                  <span className="text-xs text-slate-500 font-medium">
                    {failedCount > 0 ? "Missing CRM numbers or unsupported Instagram user IDs" : "Zero errors encountered"}
                  </span>
                  <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    Make sure contacts have valid phone numbers with country code (+91) before broadcasting.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  X, CheckCircle2, XCircle, Download, RotateCcw, ShieldAlert, BarChart3, Loader2, Send
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function CampaignDetailModal({ isOpen, campaign, onClose, onRefresh }) {
  const [retrying, setRetrying] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [activeTab, setActiveTab] = useState('FAILED'); // 'FAILED' | 'ANALYTICS'

  if (!isOpen || !campaign) return null;

  const campId = typeof campaign.id === 'object' && campaign.id !== null 
    ? (campaign.id.$oid || campaign.id._id || campaign.id.id) 
    : (campaign.id || campaign._id);

  const total = campaign.total_recipients || (campaign.total_sent + campaign.total_failed) || 1;
  const sentCount = campaign.total_sent || 0;
  const failedCount = campaign.total_failed || 0;
  const progressPercent = Math.min(100, Math.round(((sentCount + failedCount) / total) * 100)) || 0;
  const failedItems = campaign.failed_recipients || [];

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

  const handleExportFailed = () => {
    if (!failedItems || failedItems.length === 0) {
      alert("No failed records to export.");
      return;
    }
    const headers = ["Name,Phone,Platform,Reason,Time,RetryCount,Status\n"];
    const rows = failedItems.map(f => `"${f.name}","${f.phone}","${f.platform}","${f.reason}","${f.time}",${f.retry_count || 0},"${f.status}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Failed_Report_${(campaign.name || 'Campaign').replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/80 max-h-[90vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-[#00AB56] flex items-center justify-center font-bold shrink-0 shadow-xs">
              <BarChart3 size={19} />
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
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Created on {new Date(campaign.created_at).toLocaleDateString()} • Channel: {campaign.channel || 'WHATSAPP'}
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

        {/* Clean Progress Banner */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Overall Delivery Progress</span>
            <span className="text-[#00AB56] font-extrabold">{progressPercent}% ({sentCount + failedCount}/{total})</span>
          </div>

          <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mb-3 sm:mb-4">
            <div className="h-full bg-[#00AB56] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sent</span>
              <span className="text-base font-extrabold text-slate-900">{campaign.total_sent || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
              <span className="text-base font-extrabold text-emerald-600">{campaign.total_delivered || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Read</span>
              <span className="text-base font-extrabold text-blue-600">{campaign.total_read || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Failed</span>
              <span className="text-base font-extrabold text-rose-600">{failedCount}</span>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="px-6 pt-3 bg-white border-b border-slate-100 flex gap-4 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('FAILED')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'FAILED' ? 'border-[#00AB56] text-[#00AB56]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Failed Recipients ({failedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ANALYTICS' ? 'border-[#00AB56] text-[#00AB56]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Channel Analytics
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {activeTab === 'FAILED' && (
            <div className="space-y-4">
              {failedItems.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleExportFailed}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              )}

              {failedItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={32} className="text-[#00AB56] mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Failed Deliveries</p>
                  <p className="text-[11px] text-slate-400">All campaign messages were sent smoothly.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {failedItems.map((item, idx) => {
                        const isRetryingThis = retryingId === item.id;
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-bold text-slate-900">{item.name}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-500">{item.phone}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {item.platform || 'WhatsApp'}
                              </span>
                            </td>
                            <td className="p-3 text-rose-600 font-bold text-[11px]">{item.reason}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRetrySingle(item.id)}
                                disabled={isRetryingThis || retrying}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-800 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer transition-all disabled:opacity-50"
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
              )}
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold text-slate-900 block mb-1">WhatsApp Channel</span>
                <span className="text-xs text-slate-500 font-medium">Sent: {campaign.total_sent || 0} messages</span>
                <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                  Delivered: {campaign.total_delivered || 0} • Failed: {campaign.total_failed || 0}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold text-slate-900 block mb-1">Other Channels</span>
                <span className="text-xs text-slate-500 font-medium">Email / SMS / Instagram: 0 messages</span>
                <div className="mt-2 text-[11px] text-slate-400 font-medium">
                  Configured via primary channel {campaign.channel || 'WHATSAPP'}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  X, CheckCircle2, XCircle, Download, RotateCcw, ShieldAlert, BarChart3
} from 'lucide-react';
import axios from 'axios';

export default function CampaignDetailModal({ isOpen, campaign, onClose, onRefresh }) {
  const [retrying, setRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState('FAILED'); // 'FAILED' | 'ANALYTICS' | 'LIVE'

  if (!isOpen || !campaign) return null;

  const total = campaign.total_recipients || (campaign.total_sent + campaign.total_failed) || 1;
  const sentCount = campaign.total_sent || 0;
  const failedCount = campaign.total_failed || 0;
  const progressPercent = Math.min(100, Math.round(((sentCount + failedCount) / total) * 100)) || 0;
  const failedItems = campaign.failed_recipients || [];

  const handleRetryAll = async () => {
    setRetrying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/campaigns/${campaign.id}/retry_failed/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Retry initiated for failed recipients!");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Retry failed:", err);
      alert("Failed to initiate retry.");
    } finally {
      setRetrying(false);
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
    a.download = `Failed_Report_${campaign.name.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col border border-slate-200/80 max-h-[88vh]">
        
        {/* Simple Header */}
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00AB56] flex items-center justify-center font-bold">
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">{campaign.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  campaign.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  campaign.status === 'SENDING' ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Created on {new Date(campaign.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {failedCount > 0 && (
              <button
                onClick={handleRetryAll}
                disabled={retrying}
                className="px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw size={13} className={retrying ? "animate-spin" : ""} />
                {retrying ? 'Retrying...' : 'Retry Failed'}
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Clean Progress Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Overall Delivery Progress</span>
            <span className="text-[#00AB56]">{progressPercent}% ({sentCount + failedCount}/{total})</span>
          </div>

          <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#00AB56] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sent</span>
              <span className="text-base font-extrabold text-slate-900">{campaign.total_sent || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
              <span className="text-base font-extrabold text-emerald-600">{campaign.total_delivered || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Read</span>
              <span className="text-base font-extrabold text-blue-600">{campaign.total_read || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200/60">
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

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'FAILED' && (
            <div className="space-y-4">
              {failedItems.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleExportFailed}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              )}

              {failedItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={32} className="text-[#00AB56] mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Failed Deliveries</p>
                  <p className="text-[11px] text-slate-400">All campaign messages were delivered cleanly.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
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
                      {failedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{item.phone}</td>
                          <td className="p-3">{item.platform || 'WhatsApp'}</td>
                          <td className="p-3 text-rose-600 font-bold">{item.reason}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={handleRetryAll}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold border border-slate-200"
                            >
                              Retry
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-xs font-bold text-slate-900 block mb-1">WhatsApp Channel</span>
                <span className="text-xs text-slate-500 font-medium">Sent: {campaign.total_sent || 0} messages</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-xs font-bold text-slate-900 block mb-1">Email / SMS Channels</span>
                <span className="text-xs text-slate-500 font-medium">Sent: 0 messages</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

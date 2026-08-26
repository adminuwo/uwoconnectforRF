'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Loader2, Globe, Filter,
  ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminInboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-messages/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          channel: channelFilter,
          type: typeFilter
        }
      });
      setMessages(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Failed to fetch platform messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [searchTerm, channelFilter, typeFilter]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between my-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-100 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full">
                Live Traffic
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Live Message & Chat Explorer
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1 italic">
              Inspect real-time conversation messages across all client channels.
            </p>
          </div>

          <div className="bg-white p-4 px-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queried Messages</p>
            <p className="text-2xl font-black text-slate-900">{messages.length}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search message text, from/to address, or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold focus:border-[#059669]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none text-slate-800"
              >
                <option value="ALL">All Channels</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="GMAIL">Gmail</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none text-slate-800"
              >
                <option value="ALL">All Types</option>
                <option value="INCOMING">Incoming</option>
                <option value="OUTGOING">Outgoing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message Table */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-28 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#059669]" size={36} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
              No messages found matching search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4 pl-6">Client Workspace</th>
                    <th className="p-4">Sender / From</th>
                    <th className="p-4">Message Content</th>
                    <th className="p-4 text-center">Channel</th>
                    <th className="p-4 text-center">Direction</th>
                    <th className="p-4 pr-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-slate-900">{msg.client_name}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{msg.sender_name || msg.from_address}</p>
                        <p className="text-[10px] text-slate-400">To: {msg.to_address}</p>
                      </td>
                      <td className="p-4 max-w-md">
                        <p className="text-slate-800 font-medium line-clamp-2">{msg.body}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                          {msg.channel}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1",
                          msg.message_type === 'INCOMING'
                            ? "bg-emerald-50 text-[#059669] border border-emerald-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        )}>
                          {msg.message_type === 'INCOMING' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {msg.message_type === 'INCOMING' ? 'IN' : 'OUT'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-slate-500 whitespace-nowrap">
                        <p className="text-[11px] font-bold text-slate-900">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminInboxPage;

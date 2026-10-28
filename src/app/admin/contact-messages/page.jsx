'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Send,
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  Globe,
  ArrowLeft,
  User,
  Phone,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, replied: 0, resolved: 0, web: 0, app: 0 });
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const scrollRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('uwo_token') || '';
  };

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      if (unansweredOnly) params.append('unanswered', 'true');

      const res = await axios.get(`${API_BASE_URL}/api/admin/contact-messages/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const list = res.data?.results || [];
      setMessages(list);
      if (res.data?.stats) {
        setStats(res.data.stats);
      }

      // If nothing selected or selected item is no longer in list, select first
      if (list.length > 0 && !selectedId && !silent) {
        setSelectedId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch contact messages:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    if (!id) return;
    setLoadingDetail(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/api/admin/contact-messages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedMessage(res.data);
    } catch (err) {
      console.warn('Failed to load contact message detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, sourceFilter, unansweredOnly]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedMessage?.replies]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedId || isSending) return;
    const textToSend = replyText.trim();
    setIsSending(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/contact-messages/${selectedId}/reply/`,
        { message: textToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText('');
      setSelectedMessage(res.data?.data);
      fetchMessages(true);
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedId) return;
    try {
      const token = getAuthToken();
      const res = await axios.patch(
        `${API_BASE_URL}/api/admin/contact-messages/${selectedId}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedMessage(res.data?.data);
      fetchMessages(true);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex-1 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        {/* Top Header & Metrics Bar */}
        <div className="shrink-0 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Mail className="text-emerald-600" size={24} />
                Contact Messages
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Central inbox for inquiries from both Website and Mobile App
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400">Total:</span>
                <span className="text-slate-900">{stats.total}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 shadow-2xs flex items-center gap-2 text-xs font-bold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending: {stats.pending}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 shadow-2xs flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={13} />
                <span>Replied: {stats.replied}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 shadow-2xs flex items-center gap-2 text-xs font-bold text-blue-700">
                <Globe size={13} />
                <span>Web: {stats.web}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/60 shadow-2xs flex items-center gap-2 text-xs font-bold text-purple-700">
                <Smartphone size={13} />
                <span>App: {stats.app}</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending (Unanswered)</option>
                <option value="REPLIED">Replied</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Sources</option>
                <option value="WEB">🌐 Website</option>
                <option value="APP">📱 Mobile App</option>
              </select>

              {/* Unanswered Toggle */}
              <button
                type="button"
                onClick={() => setUnansweredOnly(!unansweredOnly)}
                className={cn(
                  "px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border",
                  unansweredOnly
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                <AlertCircle size={14} />
                <span>Needs Reply</span>
              </button>

              <button
                type="button"
                onClick={() => fetchMessages()}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-all cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Master-Detail Content */}
        <div className="flex-1 flex bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
          {/* Left Column: Messages List */}
          <div
            className={cn(
              "w-full md:w-[380px] lg:w-[420px] border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/40",
              mobileShowDetail ? "hidden md:flex" : "flex"
            )}
          >
            <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{messages.length} Messages</span>
              <span className="text-[10px] text-slate-400">Click to view conversation</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Loader2 className="animate-spin text-emerald-600" size={24} />
                  <span className="text-xs font-medium">Loading inquiries...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Mail size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">No Messages Found</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
                </div>
              ) : (
                messages.map((item) => {
                  const isSelected = item.id === selectedId;
                  const isApp = item.source === 'APP';

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setMobileShowDetail(true);
                      }}
                      className={cn(
                        "w-full text-left p-4 transition-all flex flex-col gap-1.5 cursor-pointer hover:bg-slate-100/60 relative",
                        isSelected ? "bg-emerald-50/70 border-l-4 border-l-emerald-500" : ""
                      )}
                    >
                      {/* Top Row: Sender & Source */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-black text-slate-900 truncate">
                            {item.name || item.email}
                          </span>
                          {item.is_unanswered && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unanswered" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isApp ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                              <Smartphone size={10} /> App
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                              <Globe size={10} /> Web
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {item.subject || 'Contact Inquiry'}
                      </p>

                      {/* Preview */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Footer: Status badge & timestamp */}
                      <div className="flex items-center justify-between pt-1 text-[10px] font-semibold text-slate-400">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider",
                            item.status === 'RESOLVED' && "bg-slate-100 text-slate-700",
                            item.status === 'REPLIED' && "bg-emerald-100 text-emerald-800",
                            item.status === 'PENDING' && "bg-amber-100 text-amber-800"
                          )}
                        >
                          {item.status}
                        </span>

                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Message Details & Thread */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-white overflow-hidden min-h-0",
              !mobileShowDetail ? "hidden md:flex" : "flex"
            )}
          >
            {loadingDetail ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin text-emerald-600 mr-2" size={20} />
                <span className="text-xs font-medium">Loading conversation...</span>
              </div>
            ) : !selectedMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare size={48} className="text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-700">Select a message to view the conversation</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  You can inspect the inquiry origin, participant details, and submit permanent replies that sync directly to the user's account.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileShowDetail(false)}
                      className="md:hidden p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm md:text-base font-black text-slate-900 truncate">
                          {selectedMessage.subject || 'Contact Inquiry'}
                        </h2>
                        {selectedMessage.source === 'APP' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                            <Smartphone size={11} /> Mobile App
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                            <Globe size={11} /> Website
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Inquiry #{selectedMessage.id} • Submitted on {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Status:</label>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className={cn(
                        "text-xs font-black px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all",
                        selectedMessage.status === 'RESOLVED' && "bg-slate-100 text-slate-700 border-slate-300",
                        selectedMessage.status === 'REPLIED' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                        selectedMessage.status === 'PENDING' && "bg-amber-50 text-amber-800 border-amber-300"
                      )}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REPLIED">REPLIED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                {/* Sender Metadata Banner */}
                <div className="bg-slate-100/60 px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600 shrink-0">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User size={13} className="text-slate-400" />
                    <span>{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-emerald-700 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                  {selectedMessage.client_name && (
                    <div className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-700">
                      Client Workspace: {selectedMessage.client_name}
                    </div>
                  )}
                </div>

                {/* Conversation Thread */}
                <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/20">
                  {/* Original Inquiry Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {selectedMessage.name ? selectedMessage.name[0].toUpperCase() : 'U'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{selectedMessage.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          Original Message
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(selectedMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Thread Replies */}
                  {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {selectedMessage.replies.map((reply) => {
                        const isAdmin = reply.sender_role === 'ADMIN';

                        return (
                          <div
                            key={reply.id}
                            className={cn(
                              "rounded-2xl p-4 md:p-5 border text-xs md:text-sm leading-relaxed max-w-[85%]",
                              isAdmin
                                ? "ml-auto bg-emerald-50/70 border-emerald-200/80 text-emerald-950 shadow-2xs"
                                : "mr-auto bg-white border-slate-200 text-slate-800 shadow-2xs"
                            )}
                          >
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <span
                                className={cn(
                                  "font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md",
                                  isAdmin ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                                )}
                              >
                                {isAdmin ? '🛡️ UWO Support Team' : `👤 ${reply.sender_name || 'User'}`}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {reply.created_at ? new Date(reply.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>

                            <p className="whitespace-pre-line text-xs md:text-sm">{reply.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Reply Box Footer */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={3}
                      placeholder="Type your official reply here... (Sent to user's web/app account & stored permanently in thread)"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                    />

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-400">
                        Press button to dispatch reply and mark status as <strong className="text-emerald-700">REPLIED</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                        className={cn(
                          "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all",
                          replyText.trim() && !isSending
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                      >
                        {isSending ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Send Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

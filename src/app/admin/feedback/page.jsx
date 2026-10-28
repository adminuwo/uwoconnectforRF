'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessagesSquare,
  Send,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Globe,
  ArrowLeft,
  User,
  Star,
  RefreshCw,
  MessageSquare,
  Tag
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const CATEGORY_LABELS = {
  GENERAL: 'General Feedback',
  BUG: 'Bug Report',
  FEATURE: 'Feature Request',
  UX: 'UI / UX Improvement',
  PERFORMANCE: 'Performance Issue',
  BILLING: 'Billing & Plans'
};

const CATEGORY_COLORS = {
  GENERAL: 'bg-slate-100 text-slate-700 border-slate-200',
  BUG: 'bg-rose-100 text-rose-800 border-rose-200',
  FEATURE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  UX: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  PERFORMANCE: 'bg-amber-100 text-amber-800 border-amber-200',
  BILLING: 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [stats, setStats] = useState({ total: 0, new: 0, in_review: 0, replied: 0, resolved: 0, web: 0, app: 0 });
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const scrollRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('uwo_token') || '';
  };

  const fetchFeedbacks = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      if (unansweredOnly) params.append('unanswered', 'true');

      const res = await axios.get(`${API_BASE_URL}/api/admin/user-feedback/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const list = res.data?.results || [];
      setFeedbacks(list);
      if (res.data?.stats) {
        setStats(res.data.stats);
      }

      if (list.length > 0 && !selectedId && !silent) {
        setSelectedId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch feedback entries:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    if (!id) return;
    setLoadingDetail(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/api/admin/user-feedback/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedFeedback(res.data);
    } catch (err) {
      console.warn('Failed to load feedback detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [categoryFilter, statusFilter, sourceFilter, unansweredOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedbacks(true);
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
  }, [selectedFeedback?.replies]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedId || isSending) return;
    const textToSend = replyText.trim();
    setIsSending(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/user-feedback/${selectedId}/reply/`,
        { message: textToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText('');
      setSelectedFeedback(res.data?.data);
      fetchFeedbacks(true);
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
        `${API_BASE_URL}/api/admin/user-feedback/${selectedId}/status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedFeedback(res.data?.data);
      fetchFeedbacks(true);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={cn(
            i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
          )}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex-1 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        {/* Top Header & Metrics Bar */}
        <div className="shrink-0 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <MessagesSquare className="text-emerald-600" size={24} />
                User Feedback
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Feedback, ratings, and feature requests submitted from Web and Mobile App
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
                <span>New: {stats.new}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/60 shadow-2xs flex items-center gap-2 text-xs font-bold text-indigo-700">
                <span>In Review: {stats.in_review}</span>
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
                  placeholder="Search by user, email, feedback text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Categories</option>
                <option value="GENERAL">General</option>
                <option value="BUG">Bug Reports</option>
                <option value="FEATURE">Feature Requests</option>
                <option value="UX">UI / UX</option>
                <option value="PERFORMANCE">Performance</option>
                <option value="BILLING">Billing & Plans</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="IN_REVIEW">In Review</option>
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
                <span>Needs Action</span>
              </button>

              <button
                type="button"
                onClick={() => fetchFeedbacks()}
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
          {/* Left Column: Feedback List */}
          <div
            className={cn(
              "w-full md:w-[380px] lg:w-[420px] border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/40",
              mobileShowDetail ? "hidden md:flex" : "flex"
            )}
          >
            <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{feedbacks.length} Feedback Submissions</span>
              <span className="text-[10px] text-slate-400">Select to review & reply</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Loader2 className="animate-spin text-emerald-600" size={24} />
                  <span className="text-xs font-medium">Loading feedback...</span>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <MessagesSquare size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">No Feedback Found</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try changing category or keyword filters.</p>
                </div>
              ) : (
                feedbacks.map((item) => {
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
                        "w-full text-left p-4 transition-all flex flex-col gap-2 cursor-pointer hover:bg-slate-100/60 relative",
                        isSelected ? "bg-emerald-50/70 border-l-4 border-l-emerald-500" : ""
                      )}
                    >
                      {/* Top Row: User name & Rating */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-black text-slate-900 truncate">
                            {item.name || item.email || 'Anonymous User'}
                          </span>
                          {item.is_unanswered && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unanswered" />
                          )}
                        </div>

                        {renderStars(item.rating)}
                      </div>

                      {/* Category & Source Badges */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                            CATEGORY_COLORS[item.category] || CATEGORY_COLORS.GENERAL
                          )}
                        >
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>

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

                      {/* Preview Text */}
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
                            item.status === 'IN_REVIEW' && "bg-indigo-100 text-indigo-800",
                            item.status === 'NEW' && "bg-amber-100 text-amber-800"
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

          {/* Right Column: Selected Feedback Detail & Conversation */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-white overflow-hidden min-h-0",
              !mobileShowDetail ? "hidden md:flex" : "flex"
            )}
          >
            {loadingDetail ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin text-emerald-600 mr-2" size={20} />
                <span className="text-xs font-medium">Loading feedback conversation...</span>
              </div>
            ) : !selectedFeedback ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare size={48} className="text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-700">Select a feedback item to review</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Read user suggestions, review bug reports, and send answers back to the user's dashboard.
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
                        <span
                          className={cn(
                            "text-xs font-bold px-2.5 py-0.5 rounded-md border",
                            CATEGORY_COLORS[selectedFeedback.category] || CATEGORY_COLORS.GENERAL
                          )}
                        >
                          {CATEGORY_LABELS[selectedFeedback.category] || selectedFeedback.category}
                        </span>

                        {selectedFeedback.source === 'APP' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                            <Smartphone size={11} /> Mobile App
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                            <Globe size={11} /> Website
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(selectedFeedback.rating)}
                        <span className="text-xs text-slate-400 font-medium">
                          • Feedback #{selectedFeedback.id} • {new Date(selectedFeedback.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Status:</label>
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className={cn(
                        "text-xs font-black px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all",
                        selectedFeedback.status === 'RESOLVED' && "bg-slate-100 text-slate-700 border-slate-300",
                        selectedFeedback.status === 'REPLIED' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                        selectedFeedback.status === 'IN_REVIEW' && "bg-indigo-50 text-indigo-800 border-indigo-300",
                        selectedFeedback.status === 'NEW' && "bg-amber-50 text-amber-800 border-amber-300"
                      )}
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_REVIEW">IN REVIEW</option>
                      <option value="REPLIED">REPLIED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                {/* Submitter Metadata Banner */}
                <div className="bg-slate-100/60 px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600 shrink-0">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User size={13} className="text-slate-400" />
                    <span>{selectedFeedback.name || selectedFeedback.email || 'Anonymous Submitter'}</span>
                  </div>
                  {selectedFeedback.email && (
                    <div className="flex items-center gap-1.5">
                      <span>Email:</span>
                      <a href={`mailto:${selectedFeedback.email}`} className="text-emerald-700 hover:underline font-medium">
                        {selectedFeedback.email}
                      </a>
                    </div>
                  )}
                  {selectedFeedback.client_name && (
                    <div className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-700">
                      Client Workspace: {selectedFeedback.client_name}
                    </div>
                  )}
                </div>

                {/* Conversation Thread */}
                <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/20">
                  {/* Original Feedback Message */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {selectedFeedback.name ? selectedFeedback.name[0].toUpperCase() : 'U'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {selectedFeedback.name || selectedFeedback.email || 'User'}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          Original Feedback
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(selectedFeedback.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                      {selectedFeedback.message}
                    </p>
                  </div>

                  {/* Thread Replies */}
                  {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {selectedFeedback.replies.map((reply) => {
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
                      placeholder="Type official reply or status update to this user feedback..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                    />

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-400">
                        Admin replies appear in the user's account and permanently update the conversation.
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
                            <span>Reply to Feedback</span>
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LifeBuoy,
  Send,
  Loader2,
  CheckCheck,
  MessageSquare,
  Mail,
  MessagesSquare,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Globe,
  Clock,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function ClientSupportPage() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'contact' | 'feedback'

  // ── 1. Direct Support Chat State ──
  const [messages, setMessages] = useState([]);
  const [chatReplyText, setChatReplyText] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);
  const chatScrollRef = useRef(null);

  // ── 2. Contact Inquiries State ──
  const [contactInquiries, setContactInquiries] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactReplyText, setContactReplyText] = useState('');
  const [isSendingContactReply, setIsSendingContactReply] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [newContactData, setNewContactData] = useState({ subject: '', message: '', phone: '' });
  const [submittingNewContact, setSubmittingNewContact] = useState(false);
  const contactScrollRef = useRef(null);

  // ── 3. Feedback State ──
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [feedbackReplyText, setFeedbackReplyText] = useState('');
  const [isSendingFeedbackReply, setIsSendingFeedbackReply] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showNewFeedbackModal, setShowNewFeedbackModal] = useState(false);
  const [newFeedbackData, setNewFeedbackData] = useState({ category: 'FEATURE', rating: 5, message: '' });
  const [submittingNewFeedback, setSubmittingNewFeedback] = useState(false);
  const feedbackScrollRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('uwo_token') || '';
  };

  // ── Fetch Chat Messages ──
  const fetchChatMessages = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/support/messages/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.warn('Failed to fetch support messages');
    } finally {
      setLoadingChat(false);
    }
  };

  // ── Fetch Contact Inquiries ──
  const fetchContactInquiries = async () => {
    setLoadingContact(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/api/contact/my-messages/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setContactInquiries(list);
      if (list.length > 0 && !selectedContactId) {
        setSelectedContactId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch contact inquiries:', err);
    } finally {
      setLoadingContact(false);
    }
  };

  // ── Fetch User Feedback ──
  const fetchFeedbackList = async () => {
    setLoadingFeedback(true);
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/api/feedback/my-feedback/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setFeedbacks(list);
      if (list.length > 0 && !selectedFeedbackId) {
        setSelectedFeedbackId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch user feedback:', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'contact') {
      fetchContactInquiries();
    } else if (activeTab === 'feedback') {
      fetchFeedbackList();
    }
  }, [activeTab]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (contactScrollRef.current) {
      contactScrollRef.current.scrollTop = contactScrollRef.current.scrollHeight;
    }
  }, [selectedContactId, contactInquiries]);

  useEffect(() => {
    if (feedbackScrollRef.current) {
      feedbackScrollRef.current.scrollTop = feedbackScrollRef.current.scrollHeight;
    }
  }, [selectedFeedbackId, feedbacks]);

  // ── Send Direct Support Chat Message ──
  const handleSendChatMessage = async () => {
    if (!chatReplyText.trim() || isSendingChat) return;
    const textToSend = chatReplyText.trim();
    setChatReplyText('');
    setIsSendingChat(true);

    const tempMessage = {
      id: `temp_${Date.now()}`,
      body: textToSend,
      sender_role: 'CLIENT',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = getAuthToken();
      await axios.post(`${API_BASE_URL}/api/support/messages/`, {
        body: textToSend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChatMessages();
    } catch (err) {
      console.warn('Failed to send support message');
      alert('Failed to send message');
    } finally {
      setIsSendingChat(false);
    }
  };

  // ── Reply to Contact Inquiry Thread ──
  const handleSendContactReply = async () => {
    if (!contactReplyText.trim() || !selectedContactId || isSendingContactReply) return;
    const textToSend = contactReplyText.trim();
    setIsSendingContactReply(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/api/contact/${selectedContactId}/reply/`, {
        message: textToSend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactReplyText('');
      setContactInquiries(prev => prev.map(m => m.id === selectedContactId ? res.data?.data : m));
    } catch (err) {
      console.error('Failed to submit contact reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSendingContactReply(false);
    }
  };

  // ── Submit New Contact Inquiry ──
  const handleCreateContactInquiry = async (e) => {
    e.preventDefault();
    if (!newContactData.message.trim() || submittingNewContact) return;
    setSubmittingNewContact(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/api/contact/submit/`, {
        subject: newContactData.subject.trim() || 'Account Support Inquiry',
        message: newContactData.message.trim(),
        phone: newContactData.phone.trim(),
        source: 'web'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowNewContactModal(false);
      setNewContactData({ subject: '', message: '', phone: '' });
      fetchContactInquiries();
      if (res.data?.data?.id) {
        setSelectedContactId(res.data.data.id);
      }
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      alert('Failed to submit inquiry.');
    } finally {
      setSubmittingNewContact(false);
    }
  };

  // ── Reply to Feedback Thread ──
  const handleSendFeedbackReply = async () => {
    if (!feedbackReplyText.trim() || !selectedFeedbackId || isSendingFeedbackReply) return;
    const textToSend = feedbackReplyText.trim();
    setIsSendingFeedbackReply(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/api/feedback/${selectedFeedbackId}/reply/`, {
        message: textToSend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbackReplyText('');
      setFeedbacks(prev => prev.map(f => f.id === selectedFeedbackId ? res.data?.data : f));
    } catch (err) {
      console.error('Failed to reply to feedback:', err);
      alert('Failed to send reply.');
    } finally {
      setIsSendingFeedbackReply(false);
    }
  };

  // ── Submit New Feedback ──
  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackData.message.trim() || submittingNewFeedback) return;
    setSubmittingNewFeedback(true);

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/api/feedback/submit/`, {
        category: newFeedbackData.category,
        rating: newFeedbackData.rating,
        message: newFeedbackData.message.trim(),
        source: 'web'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowNewFeedbackModal(false);
      setNewFeedbackData({ category: 'FEATURE', rating: 5, message: '' });
      fetchFeedbackList();
      if (res.data?.data?.id) {
        setSelectedFeedbackId(res.data.data.id);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback.');
    } finally {
      setSubmittingNewFeedback(false);
    }
  };

  const selectedContact = contactInquiries.find(m => m.id === selectedContactId);
  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);

  return (
    <DashboardLayout role="CLIENT">
      <div className="flex-1 h-full flex flex-col max-w-5xl mx-auto w-full p-2 sm:p-4 md:p-6 overflow-hidden min-h-0">
        {/* Header Bar */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <LifeBuoy size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                Customer Support &amp; Feedback Center
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                Direct Helpdesk, Inquiries &amp; Platform Suggestions
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'chat'
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <MessageSquare size={13} />
              <span>Live Desk</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'contact'
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Mail size={13} />
              <span>Contact Inquiries</span>
              {contactInquiries.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  {contactInquiries.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'feedback'
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <MessagesSquare size={13} />
              <span>Feedback</span>
              {feedbacks.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  {feedbacks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: LIVE SUPPORT CHAT
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
            {loadingChat ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : (
              <>
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-4 custom-scrollbar bg-slate-50/40 min-h-0">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 opacity-70 space-y-2.5">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-xs">
                        <MessageSquare size={26} />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800">Welcome to Help Desk</h3>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                        Send a message to our support staff. We will reply promptly.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isAdmin = msg.sender_role === 'ADMIN';
                      return (
                        <div key={msg.id || i} className={cn("flex flex-col", isAdmin ? "items-start" : "items-end")}>
                          <div className={cn(
                            "max-w-[85%] sm:max-w-[72%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs break-words",
                            isAdmin
                              ? "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/50"
                              : "bg-emerald-600 text-white rounded-br-xs font-medium"
                          )}>
                            {msg.body}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 px-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {isAdmin ? 'UWO Connect Support' : 'You'} • {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                            </span>
                            {!isAdmin && <CheckCheck size={11} className="text-emerald-500" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Type your message to support desk..."
                    value={chatReplyText}
                    onChange={(e) => setChatReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSendChatMessage}
                    disabled={!chatReplyText.trim() || isSendingChat}
                    className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    {isSendingChat ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: CONTACT INQUIRIES & REPLIES
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'contact' && (
          <div className="flex-1 flex flex-col md:flex-row bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
            {/* Left list pane */}
            <div className="w-full md:w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
              <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">My Inquiries</span>
                <button
                  type="button"
                  onClick={() => setShowNewContactModal(true)}
                  className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>New Inquiry</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {loadingContact ? (
                  <div className="p-8 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" size={20} />
                  </div>
                ) : contactInquiries.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Mail size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-700">No Inquiries Submitted</p>
                    <p className="text-[11px] text-slate-400 mt-1">Have a sales or support question? Click New Inquiry.</p>
                  </div>
                ) : (
                  contactInquiries.map((inq) => {
                    const isSelected = inq.id === selectedContactId;
                    const isApp = inq.source === 'APP';

                    return (
                      <button
                        key={inq.id}
                        type="button"
                        onClick={() => setSelectedContactId(inq.id)}
                        className={cn(
                          "w-full text-left p-3.5 transition-all flex flex-col gap-1 cursor-pointer hover:bg-slate-100/70",
                          isSelected ? "bg-emerald-50/80 border-l-4 border-l-emerald-600" : ""
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {inq.subject || 'Contact Inquiry'}
                          </span>
                          {isApp ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                              App
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              Web
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1">{inq.message}</p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-semibold">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                              inq.status === 'RESOLVED' && "bg-slate-100 text-slate-600",
                              inq.status === 'REPLIED' && "bg-emerald-100 text-emerald-800",
                              inq.status === 'PENDING' && "bg-amber-100 text-amber-800"
                            )}
                          >
                            {inq.status}
                          </span>
                          <span>{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : ''}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right conversation pane */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-0">
              {!selectedContact ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                  <p className="text-xs font-bold">Select an inquiry to view replies from our support desk</p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">
                        {selectedContact.subject}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Inquiry #{selectedContact.id} • Submitted {new Date(selectedContact.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        selectedContact.status === 'RESOLVED' && "bg-slate-100 text-slate-700",
                        selectedContact.status === 'REPLIED' && "bg-emerald-100 text-emerald-800",
                        selectedContact.status === 'PENDING' && "bg-amber-100 text-amber-800"
                      )}
                    >
                      {selectedContact.status}
                    </span>
                  </div>

                  <div ref={contactScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
                    {/* Original Message Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span>Original Inquiry</span>
                        <span>{new Date(selectedContact.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>

                    {/* Replies */}
                    {selectedContact.replies && selectedContact.replies.map((r) => {
                      const isAdmin = r.sender_role === 'ADMIN';

                      return (
                        <div
                          key={r.id}
                          className={cn(
                            "p-3.5 rounded-xl border text-xs sm:text-sm max-w-[85%] leading-relaxed",
                            isAdmin
                              ? "bg-emerald-50 border-emerald-200 text-emerald-950 mr-auto"
                              : "bg-white border-slate-200 text-slate-800 ml-auto"
                          )}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className={isAdmin ? "text-emerald-700" : "text-slate-600"}>
                              {isAdmin ? '🛡️ UWO Support Admin' : 'You'}
                            </span>
                            <span className="text-slate-400 font-normal">
                              {r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="whitespace-pre-line">{r.message}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply box */}
                  <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Add a reply to this inquiry..."
                      value={contactReplyText}
                      onChange={(e) => setContactReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendContactReply()}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendContactReply}
                      disabled={!contactReplyText.trim() || isSendingContactReply}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isSendingContactReply ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>Reply</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: USER FEEDBACK & REPLIES
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'feedback' && (
          <div className="flex-1 flex flex-col md:flex-row bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
            {/* Left list pane */}
            <div className="w-full md:w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
              <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">My Submissions</span>
                <button
                  type="button"
                  onClick={() => setShowNewFeedbackModal(true)}
                  className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Give Feedback</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {loadingFeedback ? (
                  <div className="p-8 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" size={20} />
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <MessagesSquare size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-700">No Feedback Yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">We value your input! Share a feature idea or bug report.</p>
                  </div>
                ) : (
                  feedbacks.map((item) => {
                    const isSelected = item.id === selectedFeedbackId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedFeedbackId(item.id)}
                        className={cn(
                          "w-full text-left p-3.5 transition-all flex flex-col gap-1 cursor-pointer hover:bg-slate-100/70",
                          isSelected ? "bg-emerald-50/80 border-l-4 border-l-emerald-600" : ""
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            <Star size={11} className="fill-amber-400" />
                            <span className="text-[10px] font-bold text-slate-700">{item.rating}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.message}</p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-semibold">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] uppercase font-bold">
                            {item.status}
                          </span>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right conversation pane */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-0">
              {!selectedFeedback ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                  <p className="text-xs font-bold">Select a feedback submission to view administrative responses</p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900">
                          {selectedFeedback.category}
                        </h3>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i <= selectedFeedback.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Feedback #{selectedFeedback.id} • Submitted {new Date(selectedFeedback.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 uppercase">
                      {selectedFeedback.status}
                    </span>
                  </div>

                  <div ref={feedbackScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
                    {/* Original Feedback Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span>Original Feedback</span>
                        <span>{new Date(selectedFeedback.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        {selectedFeedback.message}
                      </p>
                    </div>

                    {/* Replies */}
                    {selectedFeedback.replies && selectedFeedback.replies.map((r) => {
                      const isAdmin = r.sender_role === 'ADMIN';

                      return (
                        <div
                          key={r.id}
                          className={cn(
                            "p-3.5 rounded-xl border text-xs sm:text-sm max-w-[85%] leading-relaxed",
                            isAdmin
                              ? "bg-emerald-50 border-emerald-200 text-emerald-950 mr-auto"
                              : "bg-white border-slate-200 text-slate-800 ml-auto"
                          )}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className={isAdmin ? "text-emerald-700" : "text-slate-600"}>
                              {isAdmin ? '🛡️ Product Team' : 'You'}
                            </span>
                            <span className="text-slate-400 font-normal">
                              {r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="whitespace-pre-line">{r.message}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply box */}
                  <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Reply to this feedback discussion..."
                      value={feedbackReplyText}
                      onChange={(e) => setFeedbackReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendFeedbackReply()}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendFeedbackReply}
                      disabled={!feedbackReplyText.trim() || isSendingFeedbackReply}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isSendingFeedbackReply ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>Reply</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODAL: SUBMIT NEW CONTACT INQUIRY
            ══════════════════════════════════════════════════════════════ */}
        {showNewContactModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
              <h3 className="text-base font-black text-slate-900 mb-1">Submit Contact Inquiry</h3>
              <p className="text-xs text-slate-500 mb-4">
                Reach out to our executive support team. You will receive replies directly in this portal.
              </p>

              <form onSubmit={handleCreateContactInquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Account Limit or API Integration"
                    value={newContactData.subject}
                    onChange={(e) => setNewContactData({ ...newContactData, subject: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Callback Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newContactData.phone}
                    onChange={(e) => setNewContactData({ ...newContactData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain your question or technical issue..."
                    value={newContactData.message}
                    onChange={(e) => setNewContactData({ ...newContactData, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewContactModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNewContact}
                    className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submittingNewContact ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MODAL: SUBMIT NEW FEEDBACK
            ══════════════════════════════════════════════════════════════ */}
        {showNewFeedbackModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
              <h3 className="text-base font-black text-slate-900 mb-1">Share Product Feedback</h3>
              <p className="text-xs text-slate-500 mb-4">
                Help us improve UWO Connect! Our engineering team reads all feedback and responds directly.
              </p>

              <form onSubmit={handleCreateFeedback} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category</label>
                  <select
                    value={newFeedbackData.category}
                    onChange={(e) => setNewFeedbackData({ ...newFeedbackData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none cursor-pointer"
                  >
                    <option value="GENERAL">General Feedback</option>
                    <option value="FEATURE">Feature Request</option>
                    <option value="BUG">Bug Report</option>
                    <option value="UX">UI / UX Improvement</option>
                    <option value="PERFORMANCE">Performance Issue</option>
                    <option value="BILLING">Billing &amp; Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Overall Experience Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewFeedbackData({ ...newFeedbackData, rating: star })}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={cn(
                            star <= newFeedbackData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-2">
                      {newFeedbackData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Feedback &amp; Suggestions</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you liked or what could be improved..."
                    value={newFeedbackData.message}
                    onChange={(e) => setNewFeedbackData({ ...newFeedbackData, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFeedbackModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNewFeedback}
                    className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submittingNewFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

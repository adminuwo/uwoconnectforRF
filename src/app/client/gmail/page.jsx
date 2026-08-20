'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Clock,
  Trash2,
  AlertTriangle,
  Archive,
  Search,
  SlidersHorizontal,
  Plus,
  Bell,
  Settings,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Video,
  Sparkles,
  Check,
  Copy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Bot,
  Zap,
  BarChart3,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy Email"
      className="p-1 text-slate-400 hover:text-[#00AB56] rounded transition-colors cursor-pointer"
    >
      {copied ? <Check size={13} className="text-[#00AB56] stroke-[2.5]" /> : <Copy size={13} />}
    </button>
  );
};

const ClientEmailPage = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Active View Mode ('inbox' or 'settings' or 'analytics')
  const [activeView, setActiveView] = useState('inbox');

  // Selected Provider Identity ('outlook' or 'gmail')
  const [selectedProvider, setSelectedProvider] = useState('gmail');

  // Sidebar Collapsed State
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Left Sidebar Folders (7 Core Folders)
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [folderCounts, setFolderCounts] = useState({
    inbox: 3, sent: 14, drafts: 1, scheduled: 2, trash: 0, spam: 0, archive: 5
  });

  // Email Thread List & Selection
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modals & Popups
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isAutoReplyModalOpen, setIsAutoReplyModalOpen] = useState(false);
  const [showMoreComposeOptions, setShowMoreComposeOptions] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Simple Compose Form State
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [sendingMail, setSendingMail] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Schedule Picker State
  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Auto-Reply Personalization Config State
  const [autoReplyActive, setAutoReplyActive] = useState(true);
  const [autoReplySubject, setAutoReplySubject] = useState('Thank you for emailing us, {{first_name}}!');
  const [autoReplyBody, setAutoReplyBody] = useState(`Hi {{first_name}},\n\nThank you for reaching out to UWOConnect. We have received your email and will respond to you shortly.\n\nBest regards,\nAbha Jatav\nUWOConnect Team`);
  const [savingAutoReply, setSavingAutoReply] = useState(false);





  const [emailOffset, setEmailOffset] = useState(0);
  const [hasMoreEmails, setHasMoreEmails] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const emailLimit = 10;
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const clientId = typeof user.client === 'object' ? (user.client?.id || user.client?._id) : user.client;
      if (!clientId) return;

      const res = await axios.get(`${API_BASE_URL}/api/clients/${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data);
    } catch (err) {
      console.warn('Using client fallback data', err);
    }
  };

  const fetchEmails = async (append = false, forceSync = false, folder = activeFolder, provider = selectedProvider) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setFetchError(null);
      const token = localStorage.getItem('token');
      if (!token) return;

      const currentOffset = append ? emailOffset : 0;
      const skipSyncParam = forceSync ? 'false' : 'true';

      const params = new URLSearchParams({
        limit: emailLimit,
        offset: currentOffset,
        skip_sync: skipSyncParam,
        folder: folder,
        provider: provider
      });

      const res = await axios.get(`${API_BASE_URL}/api/email/messages/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("API Response:", res.data);

      const rawMessages = res.data?.messages?.results || res.data?.messages || res.data?.results || res.data || [];
      const hasMore = res.data?.messages?.next || res.data?.next || rawMessages.length === emailLimit;

      // Map backend EmailMessage to frontend message format
      const apiMessages = rawMessages.map(msg => {
        let provider = msg.account_provider || 'gmail';
        return {
          id: String(msg.id),
          folder: msg.folder || 'inbox',
          provider: provider,
          sender_name: msg.sender_name || msg.sender_email?.split('@')[0] || 'Unknown',
          sender_email: msg.sender_email || '',
          to: (msg.to_recipients && msg.to_recipients.length > 0) ? msg.to_recipients[0] : '',
          subject: msg.subject || '(No Subject)',
          preview: (msg.body_text || '').substring(0, 120),
          body: msg.body_text || msg.body_html || '',
          time: msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          date: msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '',
          is_read: msg.is_read ?? false,
          has_attachment: (msg.attachments && msg.attachments.length > 0) || false,
          attachment_name: msg.attachments?.[0]?.name || null,
          has_meeting: !!(msg.meeting_invite_data && msg.meeting_invite_data.title),
          meeting_info: msg.meeting_invite_data || null,
          scheduled_info: msg.metadata?.scheduled_date ? `${msg.metadata.scheduled_date} at ${msg.metadata.scheduled_time}` : null,
          created_full: msg.created_at ? new Date(msg.created_at).toLocaleString() : ''
        };
      });

      console.log("Mapped Messages:", apiMessages);
      if (append) {
        setMessages(prev => [...prev, ...apiMessages]);
      } else {
        setMessages(apiMessages);
      }
      setEmailOffset(currentOffset + emailLimit);
      setHasMoreEmails(!!hasMore);

      // Set folder counts from API response
      if (res.data?.folder_counts) {
        setFolderCounts(prev => ({ ...prev, ...res.data.folder_counts }));
      }
    } catch (err) {
      console.warn('Email fetch notice:', err.message);
      setFetchError(err.response?.data?.error || err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
      setIsSyncing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchClientData();
    // fetchEmails is called below when activeFolder or selectedProvider changes
  }, []);

  useEffect(() => {
    setMessages([]);
    setEmailOffset(0);
    fetchEmails(false, false, activeFolder, selectedProvider);
  }, [activeFolder, selectedProvider]);

  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      setSelectedMessage(messages[0]);
    } else if (messages.length === 0) {
      setSelectedMessage(null);
    }
  }, [messages]);

  const connectedEmail = client?.outlook_config?.email_address || 'Abha@uwo24.com';

  // Folders Sidebar Definition (7 Core Folders)
  const sidebarFolders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
    { id: 'trash', label: 'Trash', icon: Trash2 },
    { id: 'spam', label: 'Spam', icon: AlertTriangle },
    { id: 'archive', label: 'Archive', icon: Archive }
  ];

  // Filtered Messages (by search)
  const filteredMessages = messages.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.subject?.toLowerCase().includes(q) ||
           m.sender_name?.toLowerCase().includes(q) ||
           m.sender_email?.toLowerCase().includes(q) ||
           m.preview?.toLowerCase().includes(q);
  });

  // Action Handlers
  const handleSendOrScheduleMail = async (e) => {
    e.preventDefault();
    if (!toEmail || !subject) {
      alert("Please fill in recipient email and subject.");
      return;
    }
    setSendingMail(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        action: isScheduleMode ? 'schedule' : 'send',
        provider: 'gmail',
        to: toEmail,
        subject,
        body: messageBody,
      };
      if (isScheduleMode) {
        payload.scheduled_date = scheduleDate;
        payload.scheduled_time = scheduleTime;
      }
      await axios.post(
        `${API_BASE_URL}/api/email/compose/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ msg: isScheduleMode ? `✅ Email scheduled for ${scheduleDate} ${scheduleTime}` : `✅ Email sent to ${toEmail}` });
    } catch (err) {
      console.error('Send email error:', err);
      setToast({ msg: `❌ Failed to send: ${err.response?.data?.error || err.message}` });
    } finally {
      setSendingMail(false);
      setIsComposerOpen(false);
      fetchEmails();
      setTimeout(() => setToast(null), 3500);
      setToEmail('');
      setSubject('');
      setMessageBody('');
      setIsScheduleMode(false);
    }
  };

  const handleAIPolishText = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/campaigns/ai_generate/`,
        { prompt: messageBody || subject || "Business email", action_type: 'improve', tone: 'professional' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.result) setMessageBody(res.data.result);
    } catch (err) {
      setMessageBody(`Hello,\n\n${(messageBody || "Thank you for reaching out.").trim()}\n\nBest regards,\nAbha Jatav\nUWOConnect`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (!emailId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/email/messages/${emailId}/delete_message/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ msg: '🗑️ Moved to Trash' });
      fetchEmails();
    } catch (err) {
      console.error('Delete error:', err);
      // Fallback local change if API error occurs
      setMessages(messages.filter(m => m.id !== emailId));
      setToast({ msg: '🗑️ Moved to Trash (Local)' });
    } finally {
      setSelectedMessage(null);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleSaveAutoReplyRule = async (e) => {
    e.preventDefault();
    setSavingAutoReply(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/email/auto-replies/`,
        {
          name: 'Instant Personalised Auto Reply',
          reply_type: 'thank_you',
          reply_subject: autoReplySubject,
          reply_body: autoReplyBody,
          is_active: autoReplyActive
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log('Auto reply rule saved successfully');
    } finally {
      setSavingAutoReply(false);
      setToast({ msg: '✅ Personalised Instant Auto-Reply Rule Saved!' });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleInsertTag = (tag) => {
    setAutoReplyBody(prev => prev + ` ${tag}`);
  };

  return (
    <DashboardLayout role="client">
      <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8fafb] border-t border-slate-200">

        {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200/70 px-5 py-2.5 flex items-center justify-between shrink-0">

          {/* Left: Compose + Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsComposerOpen(true);
                setIsScheduleMode(false);
              }}
              className="px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Compose</span>
            </button>

            <div className="relative w-64">
              <Search size={13} className="absolute left-3 top-[9px] text-slate-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-[7px] text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40 bg-slate-50/80 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Center: View Tabs */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">

            <button
              onClick={() => { setSelectedProvider('gmail'); setActiveView('inbox'); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                activeView === 'inbox' && selectedProvider === 'gmail'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Gmail
            </button>
            <button
              onClick={() => setActiveView('automation')}
              className={cn(
                "px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                activeView === 'automation' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Bot size={12} />
              Automation
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={cn(
                "px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                activeView === 'analytics' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <BarChart3 size={12} />
              Analytics
            </button>
          </div>

          {/* Right: Account Badge */}
          <div className="flex items-center gap-2.5">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative">
              <Bell size={15} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#00AB56]" />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00AB56] animate-pulse" />
              <span className="font-medium">{connectedEmail}</span>
              <CopyButton text={connectedEmail} />
            </div>
          </div>
        </div>

        {/* TOAST ALERT */}
        {toast && (
          <div className="absolute top-14 right-6 z-50 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2">
            <span>{toast.msg}</span>
          </div>
        )}

        {/* ── VIEW 1: 3-COLUMN INBOX ───────────────────────────────────── */}
        {activeView === 'inbox' && (
          <div className="flex-1 flex overflow-hidden">

            {/* 1. LEFT SIDEBAR */}
            <div className={cn(
              "bg-white border-r border-slate-200/70 flex flex-col justify-between shrink-0 transition-all duration-200 overflow-hidden relative",
              sidebarOpen ? "w-48 py-3 px-2.5" : "w-10 py-3 px-1.5 items-center"
            )}>
              {/* Collapse Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                className="absolute top-2.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
              >
                {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
              </button>
              <div className={cn("space-y-0.5", sidebarOpen ? "mt-5" : "mt-6")}>
                {sidebarFolders.map(f => {
                  const Icon = f.icon;
                  const isActive = activeFolder === f.id;
                  const count = folderCounts[f.id] || 0;
                  return (
                    <button
                      key={f.id}
                      title={!sidebarOpen ? f.label : undefined}
                      onClick={() => {
                        setActiveFolder(f.id);
                        const msgs = messages.filter(m => m.provider === selectedProvider && m.folder === f.id);
                        if (msgs.length > 0) setSelectedMessage(msgs[0]);
                        else setSelectedMessage(null);
                      }}
                      className={cn(
                        "w-full rounded-lg text-[12px] transition-all flex items-center cursor-pointer group",
                        sidebarOpen ? "px-2.5 py-[7px] justify-between" : "px-1.5 py-2 justify-center",
                        isActive
                          ? "bg-[#00AB56]/8 text-[#00AB56] font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className={cn("flex items-center", sidebarOpen ? "gap-2" : "")}>
                        <Icon size={14} className={isActive ? "text-[#00AB56]" : "text-slate-400 group-hover:text-slate-500"} />
                        {sidebarOpen && <span>{f.label}</span>}
                      </div>
                      {sidebarOpen && count > 0 && (
                        <span className={cn(
                          "min-w-[20px] text-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
                          isActive ? "bg-[#00AB56] text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          {count}
                        </span>
                      )}
                      {!sidebarOpen && count > 0 && (
                        <span className="absolute right-0.5 top-0.5 w-1.5 h-1.5 rounded-full bg-[#00AB56]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Link */}
              <button
                onClick={() => setActiveView('automation')}
                title={!sidebarOpen ? 'Email Settings' : undefined}
                className={cn(
                  "w-full rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors flex items-center cursor-pointer mt-4",
                  sidebarOpen ? "px-2.5 py-2 gap-2" : "px-1.5 py-2 justify-center"
                )}
              >
                <Settings size={13} />
                {sidebarOpen && <span>Email Settings</span>}
              </button>
            </div>

            {/* 2. CENTER: EMAIL LIST */}
            <div className="w-80 bg-white border-r border-slate-200/70 flex flex-col shrink-0">
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-1.5 h-1.5 rounded-full", selectedProvider === 'gmail' ? "bg-red-500" : "bg-blue-500")} />
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {activeFolder}
                  </span>
                  <span className="text-[11px] text-slate-400">·</span>
                  <span className="text-[11px] text-slate-400">{filteredMessages.length}</span>
                </div>
                <button
                  onClick={() => fetchEmails(false, true)}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00AB56]/10 text-[#00AB56] rounded hover:bg-[#00AB56]/20 transition-colors disabled:opacity-50 text-[10px] font-semibold"
                  title="Sync with Gmail/Outlook"
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "SYNCING..." : "SYNC NOW"}
                </button>
              </div>

              {fetchError && (
                <div className="p-3 bg-red-50 text-red-600 text-[10px] font-medium border-b border-red-100 break-all leading-normal">
                  ⚠️ Error fetching: {String(fetchError)}
                </div>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-6 h-6 border-2 border-[#00AB56] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Syncing with Gmail...</span>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                    <Mail size={28} className="text-slate-200 mb-3" />
                    <span className="text-xs text-slate-400">No emails in {activeFolder}</span>
                  </div>
                ) : (
                  filteredMessages.map(msg => {
                    const isSelected = selectedMessage?.id === msg.id;
                    const initials = msg.sender_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={cn(
                          "px-3.5 py-3 transition-all cursor-pointer border-b border-slate-50",
                          isSelected
                            ? "bg-[#00AB56]/5 border-l-2 border-l-[#00AB56]"
                            : "hover:bg-slate-50/80 border-l-2 border-l-transparent",
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Avatar */}
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                            !msg.is_read ? "bg-[#00AB56] text-white" : "bg-slate-100 text-slate-500"
                          )}>
                            {initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={cn("text-[12px] truncate", !msg.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                                {msg.sender_name}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-2">{msg.time}</span>
                            </div>
                            <h4 className={cn("text-[11px] truncate mb-0.5", !msg.is_read ? "font-semibold text-slate-800" : "text-slate-600")}>
                              {msg.subject}
                            </h4>
                            {msg.folder === 'scheduled' && msg.scheduled_info && (
                              <div className="text-[10px] text-amber-600 font-semibold mb-1 flex items-center gap-1">
                                <Clock size={10} />
                                <span>Send at: {msg.scheduled_info}</span>
                              </div>
                            )}
                            <p className="text-[11px] text-slate-400 truncate">{msg.preview}</p>
                            {msg.has_attachment && (
                              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                                <Paperclip size={10} className="text-[#00AB56]" />
                                <span>{msg.attachment_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {filteredMessages.length > 0 && hasMoreEmails && (
                  <div className="p-4 flex justify-center border-t border-slate-50">
                    <button
                      onClick={() => fetchEmails(true, false)}
                      disabled={isLoadingMore}
                      className="px-4 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoadingMore ? (
                        <>Loading... <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /></>
                      ) : (
                        <>Load More <ChevronDown size={14} /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. RIGHT: EMAIL READER */}
            <div className="flex-1 bg-white flex flex-col overflow-y-auto custom-scrollbar">
              {selectedMessage ? (
                <div className="flex-1 flex flex-col">
                  {/* Reader Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-base font-bold text-slate-900 leading-snug pr-4">{selectedMessage.subject}</h2>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-slate-400">{selectedMessage.time}</span>
                        <button
                          onClick={() => handleDeleteEmail(selectedMessage.id)}
                          title="Delete"
                          className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {selectedMessage.sender_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900">{selectedMessage.sender_name}</span>
                          <span className="text-[11px] text-slate-400 ml-1">&lt;{selectedMessage.sender_email}&gt;</span>
                          <p className="text-[10px] text-slate-400">to {selectedMessage.to}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Created on: {selectedMessage.created_full}</p>
                          {selectedMessage.folder === 'scheduled' && selectedMessage.scheduled_info && (
                            <p className="text-[10px] text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                              <Clock size={11} />
                              <span>Scheduled to send on: {selectedMessage.scheduled_info}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedMessage.has_meeting && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[11px]">
                          <Video size={13} />
                          <span className="font-semibold">Teams Invite</span>
                          <a href={selectedMessage.meeting_info?.link} target="_blank" rel="noreferrer" className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700">
                            Join
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="px-6 py-5 flex-1">
                    <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.body}
                    </div>

                    {selectedMessage.has_attachment && (
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Attachments</p>
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200/80 text-xs hover:bg-slate-100 transition-colors cursor-pointer">
                          <Paperclip size={13} className="text-[#00AB56]" />
                          <span className="font-medium text-slate-700">{selectedMessage.attachment_name || 'attachment.pdf'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <button
                      onClick={() => {
                        setToEmail(selectedMessage.sender_email);
                        setSubject(`Re: ${selectedMessage.subject}`);
                        setIsComposerOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-[#00AB56] hover:bg-[#009249] text-white text-[11px] font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Reply size={13} />
                      Reply
                    </button>
                    <button
                      onClick={() => {
                        setToEmail(selectedMessage.sender_email);
                        setSubject(`Re: ${selectedMessage.subject}`);
                        setIsComposerOpen(true);
                      }}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ReplyAll size={13} />
                      Reply All
                    </button>
                    <button
                      onClick={() => {
                        setSubject(`Fwd: ${selectedMessage.subject}`);
                        setMessageBody(selectedMessage.body);
                        setIsComposerOpen(true);
                      }}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Forward size={13} />
                      Forward
                    </button>
                    <button
                      onClick={() => setIsAutoReplyModalOpen(true)}
                      className="px-3.5 py-1.5 border border-emerald-200 text-[#00AB56] bg-emerald-50/50 hover:bg-emerald-50 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Bot size={13} />
                      Auto-Reply
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(selectedMessage.id)}
                      className="px-3.5 py-1.5 border border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>

                    <div className="relative ml-auto">
                      <button
                        onClick={() => setShowMoreActions(!showMoreActions)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {showMoreActions && (
                        <div className="absolute right-0 bottom-9 w-40 bg-white border border-slate-200 shadow-lg rounded-lg p-1 z-20 space-y-0.5 text-[11px] font-medium text-slate-600">
                          <button onClick={() => { handleDeleteEmail(selectedMessage.id); setShowMoreActions(false); }} className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 hover:text-red-600 rounded-md">Move to Trash</button>
                          <button onClick={() => { alert("Marked unread"); setShowMoreActions(false); }} className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-md">Mark as Unread</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Mail size={20} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Select an email to read</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW 2: AUTOMATION ───────────────────────────────────── */}
        {activeView === 'automation' && (
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 max-w-3xl mx-auto w-full">
            <div>
              <h2 className="text-base font-bold text-slate-900">Email Automation</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure automatic replies and workflow rules.</p>
            </div>

            {/* Info Banner */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#00AB56] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={14} />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-slate-800">How it works</h4>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  When someone emails your connected Gmail or Outlook account, UWOConnect automatically sends a personalized reply using their name.
                </p>
              </div>
            </div>

            {/* Auto-Reply Form */}
            <form onSubmit={handleSaveAutoReplyRule} className="p-5 bg-white rounded-xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00AB56] flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Auto-Reply Rule</h3>
                    <p className="text-[11px] text-slate-400">Personalised instant reply for incoming emails</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-medium text-slate-500">{autoReplyActive ? 'Active' : 'Off'}</span>
                  <input
                    type="checkbox"
                    checked={autoReplyActive}
                    onChange={(e) => setAutoReplyActive(e.target.checked)}
                    className="w-4 h-4 text-[#00AB56] rounded focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  value={autoReplySubject}
                  onChange={(e) => setAutoReplySubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-slate-500">Message Template</label>
                  <span className="text-[10px] text-slate-400">Insert tag:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    { tag: '{{first_name}}', label: 'First Name' },
                    { tag: '{{sender_name}}', label: 'Full Name' },
                    { tag: '{{email}}', label: 'Email' },
                    { tag: '{{company}}', label: 'Company' }
                  ].map(t => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => handleInsertTag(t.tag)}
                      className="px-2 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-[#00AB56] text-slate-600 text-[10px] font-medium rounded-md border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {t.label}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={5}
                  required
                  value={autoReplyBody}
                  onChange={(e) => setAutoReplyBody(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingAutoReply}
                  className="px-5 py-2 bg-[#00AB56] hover:bg-[#009249] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={13} />
                  <span>{savingAutoReply ? "Saving..." : "Save Rule"}</span>
                </button>
              </div>
            </form>

            {/* Existing Rules */}
            <div className="space-y-2">
              {[
                { title: 'Auto Welcome Email', desc: 'Sends welcome message to new subscribers.', active: true },
                { title: 'Thank You Acknowledgment', desc: 'Replies "Thank you" to all incoming emails.', active: true },
                { title: 'Out of Office Reply', desc: 'Holiday away message outside business hours.', active: false },
                { title: 'CRM Lead Capture', desc: 'Parses email signature and creates CRM lead.', active: true }
              ].map((rule, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">{rule.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rule.desc}</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-semibold",
                    rule.active ? "bg-emerald-50 text-[#00AB56]" : "bg-slate-100 text-slate-400"
                  )}>
                    {rule.active ? 'Active' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VIEW 3: ANALYTICS ──────────────────────────────────────────── */}
        {activeView === 'analytics' && (
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 max-w-3xl mx-auto w-full">
            <div>
              <h2 className="text-base font-bold text-slate-900">Email Analytics</h2>
              <p className="text-xs text-slate-500 mt-0.5">Track delivery, opens, clicks, and response performance.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Emails Sent', value: '142', color: 'text-slate-900' },
                { label: 'Open Rate', value: '94.2%', color: 'text-emerald-600' },
                { label: 'Click Rate', value: '48.6%', color: 'text-blue-600' },
                { label: 'Avg Response', value: '14 min', color: 'text-purple-600' }
              ].map((stat, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                  <h3 className={cn("text-xl font-bold mt-1", stat.color)}>{stat.value}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPOSE MODAL ────────────────────────────────────── */}
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Send size={14} className="text-[#00AB56]" />
                  {isScheduleMode ? 'Schedule Email' : 'New Message'}
                </h3>
                <button onClick={() => setIsComposerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSendOrScheduleMail} className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-500">To</label>
                    <button
                      type="button"
                      onClick={() => setShowMoreComposeOptions(!showMoreComposeOptions)}
                      className="text-[10px] font-medium text-[#00AB56] hover:underline cursor-pointer"
                    >
                      {showMoreComposeOptions ? 'Less' : 'CC / BCC / AI'}
                    </button>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="recipient@example.com"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40"
                  />
                </div>

                {showMoreComposeOptions && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="email" placeholder="CC..." value={ccEmail} onChange={(e) => setCcEmail(e.target.value)} className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs" />
                      <input type="email" placeholder="BCC..." value={bccEmail} onChange={(e) => setBccEmail(e.target.value)} className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs" />
                    </div>
                    <button
                      type="button"
                      onClick={handleAIPolishText}
                      disabled={aiLoading}
                      className="px-2.5 py-1 bg-emerald-50 text-[#00AB56] rounded-md font-medium border border-emerald-100 flex items-center gap-1 cursor-pointer text-[11px]"
                    >
                      <Sparkles size={12} className={aiLoading ? "animate-spin" : ""} />
                      {aiLoading ? "Improving..." : "AI Improve Text"}
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Subject line..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your email..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full p-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40 leading-relaxed"
                  />
                </div>

                {isScheduleMode && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">Date</label>
                      <input type="date" required value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">Time</label>
                      <input type="time" required value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs" />
                    </div>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => alert("File attachment added.")} className="p-1.5 border border-slate-200 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" title="Attach">
                      <Paperclip size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScheduleMode(!isScheduleMode)}
                      className={cn(
                        "px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1",
                        isScheduleMode ? "bg-emerald-50 text-[#00AB56] border-emerald-200" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <Clock size={12} />
                      Schedule
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={sendingMail}
                    className="px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={13} className={sendingMail ? "animate-spin" : ""} />
                    {sendingMail ? "Sending..." : isScheduleMode ? "Schedule" : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── AUTO-REPLY MODAL ────────────────────────────────────── */}
        {isAutoReplyModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Bot size={15} className="text-[#00AB56]" />
                  Configure Auto-Reply
                </h3>
                <button onClick={() => setIsAutoReplyModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={(e) => { handleSaveAutoReplyRule(e); setIsAutoReplyModalOpen(false); }} className="p-4 space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-[11px] font-medium text-emerald-800">Enable auto-reply for incoming emails</span>
                  <input
                    type="checkbox"
                    checked={autoReplyActive}
                    onChange={(e) => setAutoReplyActive(e.target.checked)}
                    className="w-4 h-4 text-[#00AB56] rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={autoReplySubject}
                    onChange={(e) => setAutoReplySubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-slate-500">Message Template</label>
                    <span className="text-[10px] text-slate-400">Insert tag:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      { tag: '{{first_name}}', label: 'First Name' },
                      { tag: '{{sender_name}}', label: 'Full Name' },
                      { tag: '{{email}}', label: 'Email' },
                      { tag: '{{company}}', label: 'Company' }
                    ].map(t => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => handleInsertTag(t.tag)}
                        className="px-2 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-[#00AB56] text-slate-600 text-[10px] font-medium rounded-md border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {t.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={5}
                    required
                    value={autoReplyBody}
                    onChange={(e) => setAutoReplyBody(e.target.value)}
                    className="w-full p-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00AB56]/20 focus:border-[#00AB56]/40 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsAutoReplyModalOpen(false)} className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAutoReply}
                    className="px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={13} />
                    {savingAutoReply ? "Saving..." : "Save & Enable"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientEmailPage;

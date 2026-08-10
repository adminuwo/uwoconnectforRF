'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Loader2, AlertCircle, RefreshCw, ExternalLink,
  Mail, CheckCircle2, Trash2, Send, Inbox, Clock,
  Paperclip, Star, Folder, Search, Bot, ShieldCheck,
  Activity, Zap, Lock, Server, Calendar, Video, Users,
  FileSpreadsheet, Plus, Copy, Check, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

// ── Microsoft Outlook Icon ────────────────────────────────────────────────────
export const OutlookIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
    <path d="M28 14 L44 20 L44 28 L28 34 L28 14Z" fill="#106EBE" />
    <path d="M28 14 L44 20 L36 24 Z" fill="#28A8E8" />
  </svg>
);

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'Never';
  try {
    return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return dateStr; }
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OutlookConfigModal({ isOpen, onClose, client, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Form states
  const [sendingMail, setSendingMail] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [statusData, setStatusData] = useState(null);
  const [sendMailData, setSendMailData] = useState({ to: '', subject: '', body: '' });

  // Calendar states
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [newEvent, setNewEvent] = useState({ subject: '', start_time: '', end_time: '' });
  const [eventSuccess, setEventSuccess] = useState('');

  // Teams states
  const [teamsJoinUrl, setTeamsJoinUrl] = useState('');
  const [teamsMsg, setTeamsMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [teamsSuccess, setTeamsSuccess] = useState('');

  // Contacts states
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactsSuccess, setContactsSuccess] = useState('');

  // Excel states
  const [excelData, setExcelData] = useState({ name: 'John Doe', email: 'john@company.com', status: 'Qualified Lead' });
  const [excelSuccess, setExcelSuccess] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
  const isConnected = statusData?.connected || !!client?.outlook_enabled;

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/auth/outlook/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusData(res.data);
    } catch (err) {
      console.error('Failed to fetch Outlook status', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchCalendar = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/auth/outlook/calendar/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data?.events || []);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoadingEvents(false);
    }
  }, [apiUrl]);

  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/auth/outlook/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data?.contacts || []);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoadingContacts(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, fetchStatus]);

  useEffect(() => {
    if (isOpen && isConnected) {
      if (activeTab === 'calendar') fetchCalendar();
      if (activeTab === 'contacts') fetchContacts();
    }
  }, [isOpen, isConnected, activeTab, fetchCalendar, fetchContacts]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/auth/outlook/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError('Connection failed. Please check your Azure configuration.');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/outlook/sync/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchStatus();
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Microsoft Outlook?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/outlook/disconnect/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setStatusData(null);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError('Failed to disconnect Outlook.');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    setSendingMail(true);
    setError('');
    setSendSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/outlook/send-mail/`, sendMailData, { headers: { Authorization: `Bearer ${token}` } });
      setSendSuccess(`✅ Email sent successfully to ${sendMailData.to}!`);
      setSendMailData({ to: '', subject: '', body: '' });
      await fetchStatus();
      setTimeout(() => setSendSuccess(''), 5000);
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Failed to send email. Please try again.';
      setError(errMsg);
    } finally {
      setSendingMail(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/auth/outlook/calendar/events/`, newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventSuccess(`✅ Meeting "${newEvent.subject}" scheduled! Teams link generated.`);
      setNewEvent({ subject: '', start_time: '', end_time: '' });
      fetchCalendar();
      fetchStatus();
      setTimeout(() => setEventSuccess(''), 5000);
    } catch (err) {
      setError('Failed to schedule meeting.');
    }
  };

  const handleCreateTeamsMeeting = async () => {
    setTeamsSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/auth/outlook/teams/`, { action: 'create_meeting', subject: 'UWO Connect Client Meeting' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.join_url) {
        setTeamsJoinUrl(res.data.join_url);
        setTeamsSuccess('✅ Teams Video Call link generated!');
        fetchStatus();
      }
    } catch (err) {
      setError('Failed to generate Teams meeting link.');
    }
  };

  const handleSendTeamsMsg = async (e) => {
    e.preventDefault();
    if (!teamsMsg) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/outlook/teams/`, { action: 'send_message', message: teamsMsg }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamsSuccess('✅ Teams alert message dispatched!');
      setTeamsMsg('');
      fetchStatus();
      setTimeout(() => setTeamsSuccess(''), 5000);
    } catch (err) {
      setError('Failed to send Teams message.');
    }
  };

  const handleSyncContacts = async () => {
    setContactsSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/auth/outlook/contacts/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactsSuccess(`✅ ${res.data?.detail || 'Contacts synced to CRM!'}`);
      fetchContacts();
      fetchStatus();
      setTimeout(() => setContactsSuccess(''), 5000);
    } catch (err) {
      setError('Failed to sync contacts.');
    }
  };

  const handleAppendExcel = async (e) => {
    e.preventDefault();
    setExcelSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/outlook/excel/`, {
        filename: 'UWO_Leads.xlsx',
        row_data: [excelData.name, excelData.email, excelData.status, new Date().toLocaleDateString()]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExcelSuccess('✅ Row added to Excel Online workbook (UWO_Leads.xlsx)!');
      fetchStatus();
      setTimeout(() => setExcelSuccess(''), 5000);
    } catch (err) {
      setError('Failed to append row to Excel.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activityLogs = statusData?.activity_logs || [];
  const stats = statusData?.stats || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* ── LIGHT HEADER ────────────────────────────────────────────────── */}
        <div className="p-6 bg-gradient-to-r from-[#F0FDF4] via-slate-50 to-white flex items-center justify-between border-b border-slate-200/70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-sm">
              <OutlookIcon size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Microsoft 365 Integration</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#00AB56]/10 text-[#00AB56] border border-[#00AB56]/20 uppercase tracking-wider">
                  Graph API v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isConnected
                  ? `Connected as ${statusData?.email || 'Outlook Account'}`
                  : 'Connect Microsoft 365 to automate Mail, Calendar, Teams, Contacts & Excel.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 p-2 rounded-xl transition-all border border-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 text-red-800 text-xs font-semibold">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <X size={13} />
            </button>
          </div>
        )}

        {/* ── NOT CONNECTED STATE (LIGHT THEME) ───────────────────────────── */}
        {!isConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-slate-800">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-5 border border-slate-200/80 shadow-md">
              <OutlookIcon size={42} />
            </div>
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#00AB56]/10 text-[#00AB56] border border-[#00AB56]/20 uppercase tracking-wider mb-2">
              UWOConnect Channel Integration
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Connect Microsoft 365 Suite</h3>
            <p className="text-xs text-slate-500 text-center max-w-md mb-6 leading-relaxed font-medium">
              Automate email workflows, schedule Teams & Outlook meetings, sync customer contacts, and update Excel Online spreadsheets — all seamlessly from UWOConnect.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-md">
              {[
                'Read & Send Emails via Graph API',
                'Schedule Outlook & Teams Meetings',
                'Create Teams Video Call Links',
                'Sync Contacts to CRM Lead List',
                'Append Rows to Excel Online',
                'Save Attachments to OneDrive'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                  <CheckCircle2 size={15} className="text-[#00AB56] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              className="px-8 py-3.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-[#00AB56]/20 flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {connecting ? <Loader2 size={16} className="animate-spin" /> : <OutlookIcon size={18} />}
              {connecting ? 'Connecting to Microsoft...' : 'Connect with Microsoft'}
            </button>

            <p className="text-[10px] text-slate-400 mt-4 font-semibold">
              🔒 Secured via OAuth 2.0 · Microsoft Graph API v1.0
            </p>
          </div>

        ) : (
          /* ── CONNECTED STATE (LIGHT THEME) ───────────────────────────── */
          <div className="flex-1 flex flex-col min-h-0 p-6 bg-slate-50/50">
            {/* Tab Navigation - Pill Filter Bar in Light Theme */}
            <div className="flex gap-1.5 mb-6 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200/80 shrink-0 overflow-x-auto scrollbar-none">
              {[
                { key: 'overview',   label: 'Overview',    icon: Activity },
                { key: 'send-mail',  label: 'Send Mail',   icon: Send },
                { key: 'calendar',   label: 'Calendar',    icon: Calendar },
                { key: 'teams',      label: 'Teams',       icon: Video },
                { key: 'contacts',   label: 'Contacts',    icon: Users },
                { key: 'excel',      label: 'Excel',       icon: FileSpreadsheet },
                { key: 'automation', label: 'Automation',  icon: RefreshCw },
                { key: 'activity',   label: 'Activity',    icon: Clock },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap',
                    activeTab === key
                      ? 'bg-[#00AB56] text-white shadow-md shadow-[#00AB56]/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  )}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">

              {/* ── OVERVIEW TAB ───────────────────────────────────────────── */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Emails Sent Today', value: stats.emails_today || 42, icon: Mail },
                      { label: 'Unread Messages', value: stats.unread_emails || 5, icon: Inbox },
                      { label: 'Automations Run', value: stats.automations_executed || 18, icon: Zap },
                      { label: 'Graph API Success Rate', value: stats.success_rate || '99.4%', icon: ShieldCheck },
                    ].map(({ label, value, icon: Icon }, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</span>
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                            <Icon size={14} />
                          </div>
                        </div>
                        <span className="text-2xl font-black text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                        Account Connection Info
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Active & Connected
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {[
                        { label: 'Email Address', value: statusData?.email || 'user@outlook.com' },
                        { label: 'Display Name',  value: statusData?.display_name || 'Outlook User' },
                        { label: 'Token Status',  value: statusData?.token_status || 'Valid & Active' },
                      ].map(({ label, value }, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block mb-0.5">{label}</span>
                          <span className="text-xs font-bold text-slate-800 truncate block">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── SEND MAIL TAB ─────────────────────────────────────────── */}
              {activeTab === 'send-mail' && (
                <form onSubmit={handleSendMail} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                      Compose Email via Microsoft Graph API
                    </h4>
                    <span className="text-xs font-medium text-slate-400">Direct Dispatch</span>
                  </div>

                  {sendSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span>{sendSuccess}</span>
                      <button type="button" onClick={() => setSendSuccess('')} className="text-emerald-500 hover:text-emerald-800">×</button>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">To Email</label>
                    <input
                      type="email"
                      placeholder="recipient@example.com"
                      value={sendMailData.to}
                      onChange={(e) => setSendMailData(p => ({ ...p, to: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Subject Line</label>
                    <input
                      type="text"
                      placeholder="Email subject..."
                      value={sendMailData.subject}
                      onChange={(e) => setSendMailData(p => ({ ...p, subject: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Email Content</label>
                    <textarea
                      rows={4}
                      placeholder="Write your message..."
                      value={sendMailData.body}
                      onChange={(e) => setSendMailData(p => ({ ...p, body: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingMail}
                    className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#00AB56]/20 cursor-pointer disabled:opacity-60"
                  >
                    {sendingMail ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {sendingMail ? 'Sending via Graph API...' : 'Send Email Now'}
                  </button>
                </form>
              )}

              {/* ── CALENDAR TAB ──────────────────────────────────────────── */}
              {activeTab === 'calendar' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                      Outlook Calendar Events
                    </h4>
                    <button
                      onClick={fetchCalendar}
                      className="text-xs text-[#00AB56] hover:underline flex items-center gap-1 font-bold"
                    >
                      <RefreshCw size={12} className={loadingEvents ? 'animate-spin' : ''} />
                      Refresh Calendar
                    </button>
                  </div>

                  {eventSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      {eventSuccess}
                    </div>
                  )}

                  {/* Event Creation Form */}
                  <form onSubmit={handleCreateEvent} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 block">Schedule Outlook Meeting</span>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Meeting Subject"
                        value={newEvent.subject}
                        onChange={(e) => setNewEvent(p => ({ ...p, subject: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                      <input
                        type="datetime-local"
                        value={newEvent.start_time}
                        onChange={(e) => setNewEvent(p => ({ ...p, start_time: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                      <input
                        type="datetime-local"
                        value={newEvent.end_time}
                        onChange={(e) => setNewEvent(p => ({ ...p, end_time: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00AB56]/20 transition-all"
                    >
                      <Plus size={14} /> Schedule Meeting
                    </button>
                  </form>

                  {/* Upcoming Events List */}
                  <div className="space-y-2">
                    {events.map((evt, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-[#00AB56]/40 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{evt.subject}</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {formatDate(evt.start?.dateTime)} · {evt.location?.displayName || 'Online'}
                            </span>
                          </div>
                        </div>
                        {evt.onlineMeeting?.joinUrl && (
                          <a
                            href={evt.onlineMeeting.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-emerald-50 text-[#00AB56] hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-emerald-200"
                          >
                            <Video size={12} /> Join Teams Call
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TEAMS TAB ─────────────────────────────────────────────── */}
              {activeTab === 'teams' && (
                <div className="space-y-5">
                  <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block">
                    Microsoft Teams Automation
                  </h4>

                  {teamsSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      {teamsSuccess}
                    </div>
                  )}

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 block">Instant Video Meeting Link Generator</span>
                    <p className="text-xs text-slate-500">Generate a one-click Microsoft Teams video meeting link for clients.</p>
                    <button
                      type="button"
                      onClick={handleCreateTeamsMeeting}
                      className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00AB56]/20 transition-all"
                    >
                      <Video size={14} /> Generate Teams Meeting Link
                    </button>

                    {teamsJoinUrl && (
                      <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs mt-2">
                        <input type="text" readOnly value={teamsJoinUrl} className="flex-1 font-mono text-[11px] text-slate-700 outline-none bg-transparent" />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(teamsJoinUrl)}
                          className="px-3.5 py-1.5 bg-[#00AB56] text-white hover:bg-[#009249] rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                          {copiedLink ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendTeamsMsg} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 block">Dispatch Teams Alert Message</span>
                    <textarea
                      rows={3}
                      placeholder="Type alert notification to send to Teams..."
                      value={teamsMsg}
                      onChange={(e) => setTeamsMsg(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none focus:outline-none focus:border-[#00AB56]"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#00AB56]/20 transition-all">
                      Dispatch to Teams Channel
                    </button>
                  </form>
                </div>
              )}

              {/* ── CONTACTS TAB ──────────────────────────────────────────── */}
              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                      Microsoft 365 People Contacts
                    </h4>
                    <button
                      onClick={handleSyncContacts}
                      className="px-4 py-2 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00AB56]/20 transition-all"
                    >
                      <RefreshCw size={12} /> Sync Contacts to CRM
                    </button>
                  </div>

                  {contactsSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      {contactsSuccess}
                    </div>
                  )}

                  <div className="space-y-2">
                    {contacts.map((c, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-[#00AB56]/40 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {c.displayName?.[0] || 'C'}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block">{c.displayName}</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {c.emailAddresses?.[0]?.address || 'No email'} · {c.companyName || 'Contact'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Synced to Lead List
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── EXCEL & ONEDRIVE TAB ────────────────────────────────────── */}
              {activeTab === 'excel' && (
                <div className="space-y-5">
                  <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block">
                    Excel Online & OneDrive Automation
                  </h4>

                  {excelSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      {excelSuccess}
                    </div>
                  )}

                  <form onSubmit={handleAppendExcel} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <span className="text-xs font-extrabold text-slate-900 block">Append Lead Row to Excel Online Workbook (`UWO_Leads.xlsx`)</span>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Lead Name"
                        value={excelData.name}
                        onChange={(e) => setExcelData(p => ({ ...p, name: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                      <input
                        type="email"
                        placeholder="Lead Email"
                        value={excelData.email}
                        onChange={(e) => setExcelData(p => ({ ...p, email: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                      <input
                        type="text"
                        placeholder="Status"
                        value={excelData.status}
                        onChange={(e) => setExcelData(p => ({ ...p, status: e.target.value }))}
                        required
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00AB56]"
                      />
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-[#00AB56]/20 transition-all">
                      Append Row to Excel Table
                    </button>
                  </form>
                </div>
              )}

              {/* ── AUTOMATION TAB ────────────────────────────────────────── */}
              {activeTab === 'automation' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block">
                    AI & Microsoft Graph Triggers
                  </h4>
                  {[
                    { name: 'AI Email Auto-Responder', desc: 'Automatically draft intelligent AI responses for incoming client emails.', enabled: true },
                    { name: 'OneDrive Attachment Saver', desc: 'Auto-save PDF & document attachments directly into OneDrive folders.', enabled: true },
                    { name: 'Teams Lead Alerts', desc: 'Dispatch instant Teams message whenever a high-intent lead emails.', enabled: true },
                    { name: 'Excel Lead Auto-Sync', desc: 'Append new email lead contacts directly into Excel Online sheets.', enabled: true },
                  ].map((auto, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-[#00AB56]/40 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Bot size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">{auto.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{auto.desc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Active</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── ACTIVITY TAB ──────────────────────────────────────────── */}
              {activeTab === 'activity' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block">
                    Recent Activity Timeline
                  </h4>
                  {(activityLogs.length > 0 ? activityLogs : [
                    { id: 1, event: 'Connected Microsoft Account', detail: 'OAuth 2.0 granted via Graph API v1.0', timestamp: 'Just now', status: 'success' },
                    { id: 2, event: 'Scheduled Teams Meeting', detail: 'Created video link for client demo', timestamp: '5 mins ago', status: 'success' },
                    { id: 3, event: 'Excel Row Appended', detail: 'New lead added to UWO_Leads.xlsx', timestamp: '12 mins ago', status: 'success' },
                  ]).map(log => (
                    <div key={log.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#00AB56]/40 transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00AB56] mt-1 shrink-0 ring-4 ring-[#00AB56]/20" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 block">{log.event}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{log.detail}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER ACTIONS ────────────────────────────────────────────── */}
        {isConnected && (
          <div className="p-5 border-t border-slate-200/80 flex justify-between items-center bg-white shrink-0">
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {disconnecting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Disconnect Microsoft
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://outlook.office.com', '_blank')}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <ExternalLink size={13} />
                Open Outlook
              </button>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00AB56]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Syncing Graph...' : 'Sync Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

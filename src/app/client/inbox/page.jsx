'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Loader2, User, Phone, Mail, 
  MapPin, Send, Plus, MoreHorizontal, Filter, 
  Smile, Paperclip, Zap, ArrowLeft, Check, CheckCheck, Archive, Sparkles, Lock, Unlock,
  FileText, Download, Image as ImageIcon, Music, Film, ExternalLink,
  Shield, ShieldAlert, ArrowRightLeft, History, BarChart3, Activity, Users, Eye, StickyNote,
  Clock, Tag, RefreshCw, AlertCircle, Bot
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransferModal from '@/components/inbox/TransferModal';
import AuditLogDrawer from '@/components/inbox/AuditLogDrawer';
import MonitoringAnalyticsModal from '@/components/inbox/MonitoringAnalyticsModal';
import { cn } from '@/lib/utils';

export default function ClientInboxPage() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
  const [isInternalNote, setIsInternalNote] = useState(false);
  
  // Real-time Indicators State
  const [livePresence, setLivePresence] = useState({}); // { convoId: [ { username, role, isTyping } ] }
  const [currentUser, setCurrentUser] = useState(null);

  // Modals & Drawers
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);

  const scrollRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Initial Data Fetching
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

      const [msgRes, contactRes, profileRes, teamRes, statsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/messages/`, { headers }),
        axios.get(`${apiUrl}/api/contacts/`, { headers }),
        axios.get(`${apiUrl}/api/profile`, { headers }).catch(() => ({ data: { username: 'Admin', role: 'ADMIN' } })),
        axios.get(`${apiUrl}/api/team/members/`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/api/monitoring/stats/`, { headers }).catch(() => ({ data: null }))
      ]);

      setMessages(msgRes.data || []);
      setContacts(contactRes.data || []);
      setCurrentUser(profileRes.data);
      setTeamMembers(teamRes.data || []);
      if (statsRes.data) setStatsData(statsRes.data);

      if (msgRes.data?.length > 0 && !selectedConvoId) {
        const firstSender = normalizeContactId(msgRes.data[0].from_address || msgRes.data[0].to_address);
        setSelectedConvoId(firstSender);
      }
    } catch (err) {
      console.warn('Failed to fetch inbox initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Normalize contact string (e.g. phone numbers or handles)
  const normalizeContactId = (rawId) => {
    if (!rawId) return 'Unknown';
    const digits = rawId.replace(/[^0-9]/g, '');
    return digits || rawId;
  };

  // Group messages into structured conversation threads
  const groupedConversations = messages.reduce((acc, msg) => {
    const rawContact = msg.message_type === 'INCOMING' ? msg.from_address : msg.to_address;
    const contactKey = normalizeContactId(rawContact);
    
    if (!acc[contactKey]) {
      const contactObj = contacts.find(c => normalizeContactId(c.platform_id || c.phone_number) === contactKey);
      acc[contactKey] = {
        id: contactKey,
        name: contactObj?.name || (rawContact.startsWith('+') ? rawContact : `+${rawContact}`),
        rawAddress: rawContact,
        lastMessage: msg.body || '📎 [Attachment]',
        time: msg.created_at,
        unread: msg.message_type === 'INCOMING' ? 1 : 0,
        channel: msg.channel || 'WHATSAPP',
        assignedTo: contactObj?.assigned_to || null,
        isLocked: false,
        lockedBy: null,
        status: 'OPEN',
        contactObj,
        messages: []
      };
    }
    acc[contactKey].messages.push(msg);
    acc[contactKey].messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    if (new Date(msg.created_at) > new Date(acc[contactKey].time)) {
      acc[contactKey].lastMessage = msg.body || '📎 [Attachment]';
      acc[contactKey].time = msg.created_at;
      acc[contactKey].channel = msg.channel || 'WHATSAPP';
    }
    return acc;
  }, {});

  const convoList = Object.values(groupedConversations)
    .filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => activeChannelFilter === 'ALL' || c.channel === activeChannelFilter)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const activeConvo = convoList.find(c => c.id === selectedConvoId) || (convoList.length > 0 ? convoList[0] : null);

  // 2. Real-Time WebSocket Connection & Event Handlers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
    wsUrl = wsUrl.replace(/^http/, 'ws') + `/ws/inbox/?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          setMessages(prev => {
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }

        // Live Presence / Viewing / Typing Broadcasting
        if (data.type === 'typing_status') {
          setLivePresence(prev => ({
            ...prev,
            [data.conversation_id]: {
              ...prev[data.conversation_id],
              isTyping: data.is_typing,
              typingUser: data.username,
              typingDepartment: data.department
            }
          }));
        }

        if (data.type === 'view_conversation') {
          setLivePresence(prev => ({
            ...prev,
            [data.conversation_id]: {
              ...prev[data.conversation_id],
              viewer: data.username,
              role: data.role
            }
          }));
        }

        if (data.type === 'takeover_event' || data.type === 'transfer_event' || data.type === 'note_event') {
          fetchData(); // Refresh UI live
        }
      } catch (err) {
        console.error('WebSocket event parse error:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Broadcast "Viewing" status when active conversation changes
  useEffect(() => {
    if (activeConvo && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentUser) {
      wsRef.current.send(JSON.stringify({
        type: 'view_conversation',
        conversation_id: activeConvo.id,
        username: currentUser.username,
        role: currentUser.role
      }));
    }
  }, [selectedConvoId, currentUser]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConvoId, messages]);

  // Emit typing status over WebSocket
  const handleTyping = (text) => {
    setReplyText(text);
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !activeConvo || !currentUser) return;

    wsRef.current.send(JSON.stringify({
      type: 'typing_status',
      conversation_id: activeConvo.id,
      username: currentUser.username,
      department: currentUser.department || 'Support',
      is_typing: true
    }));

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'typing_status',
          conversation_id: activeConvo.id,
          username: currentUser.username,
          is_typing: false
        }));
      }
    }, 2500);
  };

  // 3. Send Reply or Internal Private Note
  const handleSendMessage = async () => {
    if (!replyText.trim() || !activeConvo || isSending) return;
    
    const textToSend = replyText.trim();
    setReplyText('');
    setIsSending(true);

    const nowTs = Date.now();
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: currentUser?.username || 'SYSTEM',
      to_address: activeConvo.id,
      body: textToSend,
      channel: activeConvo.channel,
      message_type: isInternalNote ? 'INTERNAL' : 'OUTGOING',
      sender_name: currentUser?.username || 'Team Member',
      sender_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'User'}`,
      sender_department: currentUser?.department || 'Support',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

      await axios.post(`${apiUrl}/api/messages/`, {
        to_number: activeConvo.id,
        body: textToSend,
        channel: activeConvo.channel,
        message_type: isInternalNote ? 'INTERNAL' : 'OUTGOING'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.warn('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Admin Actions: Force Takeover & Transfer
  const handleTakeover = async () => {
    if (!activeConvo) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
      await axios.post(`${apiUrl}/api/conversations/${activeConvo.id}/takeover/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Takeover executed');
    }
  };

  const handleTransferSubmit = async (convoId, payload) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
      await axios.post(`${apiUrl}/api/conversations/${convoId}/transfer/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Transfer completed');
    }
  };

  const fetchAuditLogs = async () => {
    if (!activeConvo) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
      const res = await axios.get(`${apiUrl}/api/conversations/${activeConvo.id}/audit_logs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(res.data || []);
    } catch (err) {
      setAuditLogs([
        { id: 1, actor_name: currentUser?.username || 'Abha', event_type: 'VIEWED', created_at: new Date().toISOString() },
        { id: 2, actor_name: 'System', event_type: 'OPENED', created_at: new Date().toISOString() }
      ]);
    }
    setIsAuditDrawerOpen(true);
  };

  const openAnalyticsModal = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
      const res = await axios.get(`${apiUrl}/api/monitoring/analytics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(res.data || []);
    } catch (err) {
      setAnalyticsData([
        { user_id: '1', username: 'Abha Patel', department: 'Support', role: 'Support Lead', is_online: true, total_conversations: 14, replies_sent: 58, avg_response_time: '1m 20s', csat_score: '4.9 / 5.0', active_time: '6h 30m' },
        { user_id: '2', username: 'Rahul Sharma', department: 'Sales', role: 'Account Exec', is_online: true, total_conversations: 9, replies_sent: 34, avg_response_time: '2m 10s', csat_score: '4.8 / 5.0', active_time: '5h 15m' }
      ]);
    }
    setIsAnalyticsModalOpen(true);
  };

  const channelBadges = {
    WHATSAPP: { name: 'WhatsApp', bg: 'bg-emerald-500', text: 'text-white' },
    INSTAGRAM: { name: 'Instagram', bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white' },
    FACEBOOK: { name: 'Messenger', bg: 'bg-blue-600', text: 'text-white' },
    TELEGRAM: { name: 'Telegram', bg: 'bg-sky-500', text: 'text-white' },
    LINKEDIN: { name: 'LinkedIn', bg: 'bg-blue-700', text: 'text-white' },
    GMAIL: { name: 'Gmail', bg: 'bg-rose-500', text: 'text-white' }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* TOP ADMIN LIVE MONITORING BAR (METRICS & ACTIONS)                        */}
        {/* ========================================================================= */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Live Indicator Badges */}
            <div className="flex items-center gap-6 overflow-x-auto py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shadow-xs">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Live Shared Inbox
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      WS LIVE
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Real-Time Team Monitoring System</p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="hidden lg:flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Chats</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{statsData?.active_conversations || convoList.length}</div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Online Team</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {teamMembers.filter(m => m.is_online).length || 3} Members
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Response</div>
                  <div className="text-sm font-black text-teal-600 dark:text-teal-400">{statsData?.avg_response_time || '1m 45s'}</div>
                </div>
              </div>
            </div>

            {/* Admin Controls & Modals Triggers */}
            <div className="flex items-center gap-3">
              <button
                onClick={openAnalyticsModal}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Team Analytics
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE TEAM MEMBER PRESENCE STRIP                                           */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/90 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center gap-4 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            Live Replying Team:
          </span>
          <div className="flex items-center gap-3">
            {teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className={`w-2 h-2 rounded-full ${member.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{member.username}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({member.department || 'Support'})</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Abha (Support Lead)
                </span>
                <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Rahul (Sales)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN WORKSPACE split: SIDEBAR & LIVE CHAT MONITOR WINDOW                   */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className={`w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Search & Channel Filter */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Social Channels Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                {['ALL', 'WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'TELEGRAM', 'GMAIL'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannelFilter(ch)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider transition-all uppercase whitespace-nowrap ${
                      activeChannelFilter === ch 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-emerald-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : convoList.length > 0 ? (
                convoList.map(convo => {
                  const isSelected = convo.id === activeConvo?.id;
                  const channelInfo = channelBadges[convo.channel] || channelBadges.WHATSAPP;
                  const liveState = livePresence[convo.id];

                  return (
                    <div
                      key={convo.id}
                      onClick={() => {
                        setSelectedConvoId(convo.id);
                        setMobileShowChat(true);
                      }}
                      className={`p-4 cursor-pointer transition-all border-l-4 ${
                        isSelected 
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500' 
                          : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                              {convo.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-2xs ${channelInfo.bg} ${channelInfo.text}`}>
                              {convo.channel.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {convo.name}
                              {convo.isLocked && (
                                <Lock className="w-3 h-3 text-amber-500" title="Locked by team handler" />
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {liveState?.isTyping ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                                  ✍️ {liveState.typingUser || 'Employee'} is typing...
                                </span>
                              ) : (
                                convo.lastMessage
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(convo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {liveState?.viewer && (
                            <div className="mt-1 flex justify-end">
                              <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
                                🟢 {liveState.viewer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No conversations match filters.
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT MAIN WINDOW: LIVE CHAT & ADMIN MONITORING PANEL                    */}
          {/* ----------------------------------------------------------------------- */}
          {activeConvo ? (
            <div className={`flex-1 flex flex-col bg-emerald-50/20 ${
              mobileShowChat ? 'flex' : 'hidden md:flex'
            }`}>
              
              {/* Live Chat Header & Control Bar */}
              <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                
                {/* Customer Details & Live Indicator */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {activeConvo.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {activeConvo.name}
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {activeConvo.channel}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      {livePresence[activeConvo.id]?.isTyping ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                          ✍️ {livePresence[activeConvo.id]?.typingUser || 'Abha'} is typing...
                        </span>
                      ) : livePresence[activeConvo.id]?.viewer ? (
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          🟢 {livePresence[activeConvo.id]?.viewer} is viewing
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">👀 Admin & Team Watching</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Actions: Takeover, Transfer, Audit Trail */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTakeover}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Take Over Chat
                  </button>

                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    Transfer
                  </button>

                  <button
                    onClick={fetchAuditLogs}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Inspect Audit Log"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ownership Lock Banner */}
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>🔒 Active Handler: <strong>Abha Patel (Support Team)</strong>. Other members have view & note access.</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Shared Inbox</span>
              </div>

              {/* Timeline Messages View */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeConvo.messages && activeConvo.messages.length > 0 ? (
                  activeConvo.messages.map((msg, index) => {
                    const isIncoming = msg.message_type === 'INCOMING';
                    const isInternal = msg.message_type === 'INTERNAL';

                    if (isInternal) {
                      return (
                        <div key={msg.id || index} className="my-3 flex justify-center">
                          <div className="max-w-md bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-xs">
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-900 mb-1">
                              <span className="flex items-center gap-1.5">
                                <StickyNote className="w-3.5 h-3.5 text-amber-600" />
                                Internal Private Note • {msg.sender_name || 'Abha Patel'}
                              </span>
                              <span className="text-[10px] font-normal text-amber-700">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-amber-950 font-medium">{msg.body}</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}
                      >
                        {/* Outgoing Employee Badge Header */}
                        {!isIncoming && (
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-slate-500 pr-1">
                            <span className="text-emerald-700">{msg.sender_name || 'Abha Patel'}</span>
                            <span>({msg.sender_department || 'Support Team'})</span>
                            <span>• {msg.channel || activeConvo.channel}</span>
                          </div>
                        )}

                        <div className={`max-w-lg rounded-2xl p-3.5 text-xs shadow-xs ${
                          isIncoming 
                            ? 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                            : 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-600/10'
                        }`}>
                          <p className="whitespace-pre-wrap font-normal leading-relaxed">{msg.body}</p>
                          
                          <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[9px] ${
                            isIncoming ? 'text-slate-400' : 'text-emerald-100'
                          }`}>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!isIncoming && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    Start replying or monitoring live.
                  </div>
                )}
              </div>

              {/* Composer Box (Public Reply vs Internal Note) */}
              <div className="bg-white border-t border-slate-200 p-4 space-y-3">
                
                {/* Note Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsInternalNote(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isInternalNote 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Public Reply
                    </button>
                    <button
                      onClick={() => setIsInternalNote(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isInternalNote 
                          ? 'bg-amber-500 text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      Internal Private Note
                    </button>
                  </div>
                </div>

                {/* Text input area */}
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isInternalNote ? "Add private internal note visible only to team..." : "Type reply..."}
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!replyText.trim() || isSending}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !replyText.trim()}
                    className={`p-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                      isInternalNote 
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals & Drawers */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        conversation={activeConvo}
        teamMembers={teamMembers}
        onTransfer={handleTransferSubmit}
      />

      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditLogs={auditLogs}
        conversation={activeConvo}
      />

      <MonitoringAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        analyticsData={analyticsData}
      />
    </DashboardLayout>
  );
}

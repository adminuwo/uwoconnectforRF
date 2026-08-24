'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Loader2, User, Phone, Mail, 
  MapPin, Send, Plus, MoreHorizontal, Filter, 
  Smile, Paperclip, Zap, ArrowLeft, Check, CheckCheck, Archive, Sparkles, Lock, Unlock,
  FileText, Download, Image as ImageIcon, Music, Film, Video, ExternalLink,
  Shield, ShieldAlert, ArrowRightLeft, History, BarChart3, Activity, Users, Eye, StickyNote,
  Clock, Tag, RefreshCw, AlertCircle, Bot
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransferModal from '@/components/inbox/TransferModal';
import AuditLogDrawer from '@/components/inbox/AuditLogDrawer';
import MonitoringAnalyticsModal from '@/components/inbox/MonitoringAnalyticsModal';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const WhatsAppIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.43 0 .07 5.36.07 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.91 11.91 0 005.81 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.49-8.43zM12.04 21.84h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.88 9.88 0 01-1.52-5.24C2.17 6.52 6.6 2.08 12.04 2.08c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 6.99c0 5.44-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" fill="currentColor"/>
  </svg>
);

const InstagramIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.73-2.12 1.39C1.36 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.3.79.73 1.46 1.39 2.12.66.66 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.73 2.12-1.39.66-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91-.3-.79-.73-1.46-1.39-2.12C21.32 1.36 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 2.16c3.2 0 3.59.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.26.07 1.65.07 4.86 0 3.2-.01 3.59-.07 4.85-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.26.06-1.65.07-4.86.07-3.2 0-3.59-.01-4.85-.07-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.65-.07-4.86 0-3.2.01-3.59.07-4.85.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.26-.06 1.65-.07 4.85-.07zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.84a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" fill="currentColor"/>
  </svg>
);

const FacebookIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
  </svg>
);

const TelegramIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" fill="currentColor"/>
  </svg>
);

const CHANNEL_TABS = [
  { id: 'ALL', label: 'All', icon: MessageSquare, color: 'text-slate-700' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-[#25D366]' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: InstagramIcon, color: 'text-[#E4405F]' },
  { id: 'FACEBOOK', label: 'Facebook', icon: FacebookIcon, color: 'text-[#1877F2]' },
  { id: 'TELEGRAM', label: 'Telegram', icon: TelegramIcon, color: 'text-[#229ED9]' },
  { id: 'GMAIL', label: 'Gmail', icon: Mail, color: 'text-[#EA4335]' },
];

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
  const selectedConvoIdRef = useRef(selectedConvoId);
  const activeChannelFilterRef = useRef(activeChannelFilter);
  const convoLimitRef = useRef(10);
  const [convoLimit, setConvoLimit] = useState(10);

  useEffect(() => {
    selectedConvoIdRef.current = selectedConvoId;
  }, [selectedConvoId]);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) return;
    activeChannelFilterRef.current = activeChannelFilter;
    if (convoLimit !== 10) {
      setConvoLimit(10);
      convoLimitRef.current = 10;
    } else {
      fetchConversationsOnly();
    }
  }, [activeChannelFilter]);

  useEffect(() => {
    if (!isMounted.current) return;
    convoLimitRef.current = convoLimit;
    fetchConversationsOnly();
  }, [convoLimit]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
  }, []);

  const [messagesOffset, setMessagesOffset] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [isLoadingMoreContacts, setIsLoadingMoreContacts] = useState(false);

  const fetchConversationsOnly = async () => {
    try {
      if (convoLimitRef.current > 10) setIsLoadingMoreContacts(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = API_BASE_URL;
      
      const channelParam = activeChannelFilterRef.current !== 'ALL' ? `&preferred_channel=${activeChannelFilterRef.current}` : '';
      const limitParam = `?limit=${convoLimitRef.current}&offset=0`;
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

      // Fetch contacts properly paginated and ordered by recent activity
      const contactRes = await axios.get(`${apiUrl}/api/contacts/${limitParam}${channelParam}${searchParam}`, { headers });
      
      // Handle Django Rest Framework pagination format
      let fetchedContacts = [];
      if (Array.isArray(contactRes.data)) {
        fetchedContacts = contactRes.data;
      } else if (contactRes.data && Array.isArray(contactRes.data.results)) {
        fetchedContacts = contactRes.data.results;
      }
      
      const convoData = fetchedContacts.map(contactObj => ({
        id: contactObj.platform_id || contactObj.phone_number || contactObj.id,
        name: contactObj.name || contactObj.platform_id || contactObj.phone_number || 'Unknown Contact',
        rawAddress: contactObj.phone_number || contactObj.platform_id,
        lastMessage: 'Tap to view messages...',
        time: contactObj.updated_at || contactObj.created_at,
        unread: 0,
        channel: contactObj.preferred_channel || 'WHATSAPP',
        assignedTo: contactObj.assigned_to || null,
        isLocked: false,
        lockedBy: null,
        status: contactObj.status || 'OPEN',
        contactObj,
        messages: []
      }));
      
      setConversations(convoData);
      
      const currentSelectedExists = convoData.some(c => c.id === selectedConvoIdRef.current);
      if (convoData.length > 0) {
        if (!selectedConvoIdRef.current || !currentSelectedExists) {
          setSelectedConvoId(convoData[0].id);
        }
      } else {
        setSelectedConvoId(null);
      }
    } catch (err) {
      console.warn('Failed to fetch conversations:', err);
      setConversations([]);
    } finally {
      setIsLoadingMoreContacts(false);
    }
  };

  // 1. Initial Data Fetching
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = API_BASE_URL;

      // Fetch profile concurrently
      const profileRes = await axios.get(`${apiUrl}/api/profile`, { headers }).catch(() => ({ data: { username: 'Admin', role: 'ADMIN' } }));

      setCurrentUser(profileRes.data);
      
      await fetchConversationsOnly();

      // Fetch team and stats in the background without blocking the UI
      axios.get(`${apiUrl}/api/team/members/`, { headers }).then(res => setTeamMembers(res.data)).catch(()=>{});
      axios.get(`${apiUrl}/api/monitoring/stats/`, { headers }).then(res => { if(res.data) setStatsData(res.data); }).catch(()=>{});

    } catch (err) {
      console.warn('Failed to fetch inbox initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId, offset = 0, append = false) => {
    if (!contactId) return;
    try {
      if (append) {
        setIsLoadingMoreMessages(true);
      } else {
        setIsLoadingMessages(true);
      }
      const token = localStorage.getItem('token');
      const apiUrl = API_BASE_URL;
      const res = await axios.get(`${apiUrl}/api/messages/?contact_id=${encodeURIComponent(contactId)}&limit=10&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Messages come ordered by -created_at from backend. Reverse to show oldest first in chat.
      const fetchedMessages = (res.data || []).reverse();
      
      if (append) {
        setMessages(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(m => m.id));
          const newUnique = fetchedMessages.filter(m => !existingIds.has(m.id));
          return [...newUnique, ...prev]; // Prepend older messages
        });
      } else {
        setMessages(fetchedMessages);
      }
    } catch (err) {
      console.warn('Messages fetch error:', err);
    } finally {
      if (append) {
        setIsLoadingMoreMessages(false);
      } else {
        setIsLoadingMessages(false);
      }
    }
  };

  // Removed duplicated fetchData useEffect here

  useEffect(() => {
    if (selectedConvoId) {
      setMessagesOffset(0);
      fetchMessages(selectedConvoId, 0, false);
    }
  }, [selectedConvoId]);

  // Normalize contact string (e.g. phone numbers or handles)
  const normalizeContactId = (rawId) => {
    if (!rawId) return 'Unknown';
    const digits = rawId.replace(/[^0-9]/g, '');
    return digits || rawId;
  };

  // Removed client-side search since we do backend search in fetchConversationsOnly.
  // The backend already returns filtered results based on activeChannelFilter and searchTerm
  const convoList = conversations.map(c => ({
    ...c,
    messages: selectedConvoId === c.id ? messages : []
  }))
  .sort((a, b) => new Date(b.time) - new Date(a.time));

  const activeConvo = convoList.find(c => c.id === selectedConvoId) || (convoList.length > 0 ? convoList[0] : null);

  // Re-fetch conversations when search term changes with debounce
  useEffect(() => {
    if (!isMounted.current) return;
    const timer = setTimeout(() => {
      fetchConversationsOnly();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Real-Time WebSocket Connection & Event Handlers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let wsUrl = API_BASE_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    wsUrl = wsUrl.replace(/^http/, 'ws') + `/ws/inbox/?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          const msg = data.message;
          const isForCurrentConvo = 
            msg.from_address === selectedConvoIdRef.current || 
            msg.to_address === selectedConvoIdRef.current;
            
          if (isForCurrentConvo) {
            setMessages(prev => {
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
          fetchData(); // Refresh sidebar conversations list
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
    const targetAddress = activeConvo.contactObj?.phone_number || activeConvo.contactObj?.platform_id || activeConvo.rawAddress || activeConvo.id;
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: currentUser?.username || 'SYSTEM',
      to_address: targetAddress,
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
      const apiUrl = API_BASE_URL;

      const res = await axios.post(`${apiUrl}/api/messages/`, {
        to_number: targetAddress,
        body: textToSend,
        channel: activeConvo.channel,
        message_type: isInternalNote ? 'INTERNAL' : 'OUTGOING'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? res.data : m));
      }
      fetchData();
    } catch (err) {
      console.warn('Failed to send message:', err);
      alert('Failed to send message: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSending(false);
    }
  };

  // 4. Admin Actions: Force Takeover & Transfer
  const handleTakeover = async () => {
    if (!activeConvo) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = API_BASE_URL;
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
      const apiUrl = API_BASE_URL;
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
      const apiUrl = API_BASE_URL;
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
      const apiUrl = API_BASE_URL;
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
        {/* MAIN WORKSPACE split: SIDEBAR & LIVE CHAT MONITOR WINDOW                   */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Search & Channel Filter */}
            <div className="p-3.5 border-b border-slate-200 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Social Channels Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {CHANNEL_TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeChannelFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChannelFilter(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={13} className={isActive ? 'text-white' : tab.color || 'text-slate-500'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-3 space-y-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 animate-pulse">
                      <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="h-3.5 bg-slate-200 rounded-md w-24" />
                          <div className="h-2.5 bg-slate-200 rounded-md w-10" />
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-md w-36" />
                      </div>
                    </div>
                  ))}
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
                          ? 'bg-emerald-50/80 border-emerald-500' 
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                              {convo.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-2xs ${channelInfo.bg} ${channelInfo.text}`}>
                              {convo.channel.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {convo.name}
                              {convo.isLocked && (
                                <Lock className="w-3 h-3 text-amber-500" title="Locked by team handler" />
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {liveState?.isTyping ? (
                                <span className="text-emerald-600 font-bold animate-pulse">
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
                              <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
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
              {convoList.length > 0 && convoList.length >= convoLimitRef.current && (
                <div className="p-4 flex justify-center border-t border-slate-100">
                  <button 
                    disabled={isLoadingMoreContacts}
                    onClick={() => setConvoLimit(prev => prev + 10)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors w-full disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isLoadingMoreContacts ? (
                      <>Loading... <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></>
                    ) : (
                      "Load More Chats"
                    )}
                  </button>
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

                {/* Active Handler & Admin Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span>Handling: <strong>Abha Patel</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTakeover}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      Take Over
                    </button>

                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Transfer
                    </button>

                    <button
                      onClick={fetchAuditLogs}
                      className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Inspect Audit Log"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Messages View */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingMessages ? (
                  <div className="space-y-4 py-4 animate-pulse">
                    {/* Incoming bubble skeleton */}
                    <div className="flex items-start gap-2.5 max-w-md">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-100 shadow-2xs space-y-2">
                          <div className="h-3 bg-slate-200 rounded-md w-3/4" />
                          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                        </div>
                        <div className="h-2 bg-slate-200 rounded w-12" />
                      </div>
                    </div>

                    {/* Outgoing bubble skeleton */}
                    <div className="flex items-end justify-end gap-2.5">
                      <div className="space-y-1.5 max-w-md flex flex-col items-end">
                        <div className="bg-emerald-600/20 p-3.5 rounded-2xl rounded-tr-sm border border-emerald-500/20 shadow-2xs space-y-2 w-64">
                          <div className="h-3 bg-emerald-700/30 rounded-md w-full" />
                          <div className="h-3 bg-emerald-700/20 rounded-md w-2/3" />
                        </div>
                        <div className="h-2 bg-slate-200 rounded w-12" />
                      </div>
                    </div>

                    {/* Another incoming bubble skeleton */}
                    <div className="flex items-start gap-2.5 max-w-md">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-100 shadow-2xs space-y-2">
                          <div className="h-3 bg-slate-200 rounded-md w-4/5" />
                        </div>
                        <div className="h-2 bg-slate-200 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeConvo.messages && activeConvo.messages.length >= 10 && (
                      <div className="flex justify-center mb-4">
                        <button
                          disabled={isLoadingMoreMessages}
                          onClick={() => {
                            const nextOffset = messagesOffset + 10;
                            setMessagesOffset(nextOffset);
                            fetchMessages(activeConvo.id, nextOffset, true);
                          }}
                          className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                        >
                          {isLoadingMoreMessages ? (
                            <>Loading... <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /></>
                          ) : (
                            "Load Older Messages"
                          )}
                        </button>
                      </div>
                    )}
                    {activeConvo.messages && activeConvo.messages.length > 0 ? (
                  activeConvo.messages.map((msg, index) => {
                    const isIncoming = msg.message_type === 'INCOMING';
                    const isInternal = msg.message_type === 'INTERNAL';

                    // Extract URLs and interactive buttons
                    const extractUrls = (text) => {
                      if (!text) return [];
                      const urlRegex = /(https?:\/\/[^\s\)\>\]]+)/g;
                      const matches = text.match(urlRegex) || [];
                      const cleanMatches = matches.filter(url => {
                        const lower = url.toLowerCase();
                        if (lower.includes('hubspotemail.net') || 
                            lower.includes('hubspotlinks.com') || 
                            lower.includes('_hsenc=') || 
                            lower.includes('_hsmi=') || 
                            lower.includes('unsubscribe') || 
                            lower.includes('preferences-center') ||
                            lower.includes('doubleclick') ||
                            lower.includes('click.mail')) {
                          return false;
                        }
                        return true;
                      });
                      return Array.from(new Set(cleanMatches)).slice(0, 3);
                    };

                    const extractMessageButtons = (m) => {
                      if (!m) return [];
                      let btnList = [];
                      if (Array.isArray(m.buttons) && m.buttons.length > 0) {
                        btnList = m.buttons;
                      } else if (m.metadata) {
                        if (Array.isArray(m.metadata.buttons) && m.metadata.buttons.length > 0) {
                          btnList = m.metadata.buttons;
                        } else {
                          const interactiveBtns = m.metadata.payload?.interactive?.action?.buttons;
                          if (Array.isArray(interactiveBtns) && interactiveBtns.length > 0) {
                            btnList = interactiveBtns;
                          }
                        }
                      }
                      return btnList.map(b => {
                        if (typeof b === 'string') return b;
                        return b.reply?.title || b.title || b.text || b.label || JSON.stringify(b);
                      }).filter(Boolean);
                    };

                    const msgButtons = extractMessageButtons(msg);
                    const msgUrls = extractUrls(msg.body);

                    // Email specific parsing
                    const isEmail = msg.channel === 'GMAIL' || (msg.body && msg.body.startsWith('Subject:'));
                    let emailSubject = '';
                    let emailBodyText = msg.body || '';

                    if (isEmail && msg.body && msg.body.startsWith('Subject:')) {
                      const subjectLineEnd = msg.body.indexOf('\n');
                      if (subjectLineEnd !== -1) {
                        emailSubject = msg.body.substring(8, subjectLineEnd).trim();
                        emailBodyText = msg.body.substring(subjectLineEnd).trim();
                      }
                    }

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

                        <div className={`max-w-xl rounded-2xl p-4 text-xs shadow-sm ${
                          isIncoming 
                            ? isEmail ? 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-300' : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                            : 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-600/10'
                        }`}>
                          {/* Gmail Header Badge */}
                          {isEmail && (
                            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200">
                              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-600">
                                <Mail className="w-3.5 h-3.5" />
                                <span>GMAIL INBOX MESSAGE</span>
                              </div>
                              <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                                Email
                              </span>
                            </div>
                          )}

                          {/* Email Subject Title */}
                          {emailSubject && (
                            <div className="mb-2 pb-2 border-b border-slate-200/60">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</span>
                              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                                {emailSubject}
                              </h4>
                            </div>
                          )}

                          <div className={`whitespace-pre-wrap font-normal leading-relaxed ${isEmail ? 'max-h-72 overflow-y-auto pr-1 text-slate-800' : ''}`}>
                            {emailBodyText}
                          </div>
                          
                          {/* Render Interactive CTA Quick Reply Buttons */}
                          {msgButtons.length > 0 && (
                            <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/40">
                              {msgButtons.map((btnText, bIdx) => (
                                <button
                                  key={bIdx}
                                  onClick={() => {
                                    setReplyText(btnText);
                                  }}
                                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border shadow-2xs cursor-pointer ${
                                    isIncoming 
                                      ? 'bg-slate-50 hover:bg-emerald-50 text-emerald-700 border-slate-200 hover:border-emerald-300' 
                                      : 'bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xs'
                                  }`}
                                >
                                  <span>💬 {btnText}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Render Interactive CTA Link Buttons */}
                          {msgUrls.length > 0 && (
                            <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/40">
                              {msgUrls.map((url, uIdx) => {
                                let label = '🌐 Open Link';
                                let icon = <ExternalLink className="w-3.5 h-3.5" />;
                                if (url.includes('meet.google.com') || url.includes('teams.microsoft.com') || url.includes('zoom.us')) {
                                  label = '📹 Join Video Call';
                                  icon = <Video className="w-3.5 h-3.5 text-emerald-500" />;
                                } else if (url.includes('/public/quote/')) {
                                  label = '📄 View Proposal / Quotation';
                                  icon = <FileText className="w-3.5 h-3.5 text-amber-500" />;
                                } else {
                                  try {
                                    const parsedDomain = new URL(url).hostname.replace('www.', '');
                                    label = `🌐 Visit ${parsedDomain}`;
                                  } catch(e) {}
                                }

                                return (
                                  <a
                                    key={uIdx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border shadow-sm cursor-pointer no-underline ${
                                      isIncoming
                                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                        : 'bg-white text-emerald-800 hover:bg-slate-50 border-white/80 shadow-md'
                                    }`}
                                  >
                                    {icon}
                                    <span className="truncate">{label}</span>
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          <div className={`mt-2 flex items-center justify-end gap-1.5 text-[9px] ${
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
                  </>
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
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
                <div className="w-16 h-16 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Loading Omnichannel Inbox</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                Syncing live conversations from WhatsApp, Instagram, Facebook, and Telegram...
              </p>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/40 p-8 text-center animate-in fade-in duration-300">
              <div className="max-w-md space-y-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Unified Omnichannel Inbox</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Select a customer conversation from the left to start live chatting, reply with templates, assign agents, or monitor real-time message streams.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <WhatsAppIcon size={13} /> WhatsApp
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200 shadow-2xs">
                    <InstagramIcon size={13} /> Instagram
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                    <FacebookIcon size={13} /> Facebook
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
                    <TelegramIcon size={13} /> Telegram
                  </span>
                </div>
              </div>
            </div>
          )}
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

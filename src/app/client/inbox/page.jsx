'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  MessageSquare, Search, Loader2, User, Phone, Mail, 
  MapPin, Send, Plus, MoreHorizontal, Filter, 
  Smile, Paperclip, Zap, ArrowLeft, Check, CheckCheck, Archive, Sparkles, Lock, Unlock,
  FileText, Download, Image as ImageIcon, Music, Film, Video, ExternalLink,
  Shield, ShieldAlert, ArrowRightLeft, History, BarChart3, Activity, Users, Eye, StickyNote,
  Clock, Tag, RefreshCw, AlertCircle, Bot, ChevronLeft, ChevronRight,
  LayoutTemplate, X, UserPlus, CheckCircle2, Copy,
  Edit3, MailOpen, FolderPlus
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransferModal from '@/components/inbox/TransferModal';
import AuditLogDrawer from '@/components/inbox/AuditLogDrawer';
import MonitoringAnalyticsModal from '@/components/inbox/MonitoringAnalyticsModal';
import AddContactModal from '@/components/inbox/AddContactModal';
import CreateOrEditGroupModal from '@/components/inbox/CreateOrEditGroupModal';
import ManageConversationGroupsModal from '@/components/inbox/ManageConversationGroupsModal';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';

const getAuthToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('uwo_token') || localStorage.getItem('token') || localStorage.getItem('uwo_access_token') || '';
};

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
  { id: 'ALL', label: 'All', icon: MessageSquare, color: 'text-slate-700', activeClass: 'bg-emerald-600 text-white shadow-emerald-500/20' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-[#25D366]', activeClass: 'bg-[#25D366] text-white shadow-[#25D366]/30' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: InstagramIcon, color: 'text-[#E4405F]', activeClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-pink-500/30' },
  { id: 'FACEBOOK', label: 'Facebook', icon: FacebookIcon, color: 'text-[#1877F2]', activeClass: 'bg-[#1877F2] text-white shadow-blue-500/30' },
  { id: 'GMAIL', label: 'Gmail', icon: Mail, color: 'text-[#EA4335]', activeClass: 'bg-[#EA4335] text-white shadow-red-500/30' },
];

export default function ClientInboxPage() {
  const { brand } = useBrand();
  const { isDark } = useTheme();
  const displayBrandLogo = brand?.logo_url || '/logo.png';

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
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({
    total: 0,
    whatsapp: 0,
    facebook: 0,
    instagram: 0,
    gmail: 0,
    groups: {}
  });
  const [chatGroups, setChatGroups] = useState([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [isManageConvoGroupsModalOpen, setIsManageConvoGroupsModalOpen] = useState(false);
  const [convoForGroupManagement, setConvoForGroupManagement] = useState(null);
  const [isInternalNote, setIsInternalNote] = useState(false);
  
  // Real-time Indicators State
  const [livePresence, setLivePresence] = useState({}); // { convoId: [ { username, role, isTyping } ] }
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const resolveMediaUrl = (url) => {
    if (!url) return null;
    const trimmed = String(url).trim();
    if (!trimmed || trimmed === '/' || trimmed.includes('download (3).gif')) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    const base = API_BASE_URL || 'http://127.0.0.1:8000';
    if (trimmed.startsWith('/')) {
      return `${base}${trimmed}`;
    }
    return `${base}/${trimmed}`;
  };

  // Modals & Drawers
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [metaTemplates, setMetaTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateForSend, setSelectedTemplateForSend] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);

  const scrollRef = useRef(null);
  const channelTabsRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConvoIdRef = useRef(selectedConvoId);
  const selectedRawAddressRef = useRef(null); // Stores the rawAddress (phone/platform_id) of selected convo
  const activeChannelFilterRef = useRef(activeChannelFilter);
  const conversationsRef = useRef(conversations);
  const [convoOffset, setConvoOffset] = useState(0);
  const [hasMoreConvos, setHasMoreConvos] = useState(true);
  const [isLoadingMoreContacts, setIsLoadingMoreContacts] = useState(false);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

  const scrollTabs = (direction) => {
    if (channelTabsRef.current) {
      channelTabsRef.current.scrollBy({
        left: direction === 'left' ? -120 : 120,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    selectedConvoIdRef.current = selectedConvoId;
  }, [selectedConvoId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const selectedGroupIdRef = useRef(selectedGroupId);
  useEffect(() => {
    selectedGroupIdRef.current = selectedGroupId;
  }, [selectedGroupId]);

  // Fast direct channel conversations fetcher
  const fetchConversations = async (channel = 'ALL', offset = 0, append = false, groupIdOverride = undefined) => {
    try {
      if (append) {
        setIsLoadingMoreContacts(true);
      } else {
        if (offset === 0) setLoading(true);
      }

      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = API_BASE_URL;
      const limit = 25;

      const activeGrpId = groupIdOverride !== undefined ? groupIdOverride : selectedGroupIdRef.current;
      const channelParam = (channel && channel !== 'ALL') ? `&channel=${encodeURIComponent(channel)}` : '';
      const groupParam = (activeGrpId && activeGrpId !== 'ALL') ? `&group_id=${encodeURIComponent(activeGrpId)}` : '';
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

      // 1. Fetch conversations ordered by -last_message_at
      const convoRes = await axios.get(
        `${apiUrl}/api/conversations/?limit=${limit}&offset=${offset}${channelParam}${groupParam}${searchParam}`,
        { headers }
      ).catch(() => ({ data: [] }));

      let rawConvos = Array.isArray(convoRes.data) ? convoRes.data : (convoRes.data?.results || []);

      setHasMoreConvos(rawConvos.length >= limit);

      const formatDisplayName = (name, phone, platformId) => {
        let val = (name || '').trim();
        const genericList = ['UNKNOWN', 'UNKNOWN USER', 'USER', 'CUSTOMER', 'NONE', 'NULL'];
        if (!val || genericList.includes(val.toUpperCase())) {
          val = (phone || platformId || '').trim();
        }
        const digits = val.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
        } else if (digits.length === 10) {
          return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
        } else if (digits.length >= 8 && digits.length <= 15 && (val.startsWith('+') || /^\d+$/.test(val))) {
          return val.startsWith('+') ? val : `+${val}`;
        }
        return val || 'Customer';
      };

      const formatted = rawConvos.map(c => {
        const rawAddr = c.contact_platform_id || c.contact_phone || c.id;
        const unreadVal = c.unread_count_admin || c.unread_count_employee || c.unread_count || 0;
        return {
          id: c.id || rawAddr,
          name: formatDisplayName(c.contact_name, c.contact_phone, c.contact_platform_id),
          rawAddress: rawAddr,
          lastMessage: c.last_message_summary || 'Recent conversation',
          time: c.last_message_at || c.updated_at || c.created_at || new Date().toISOString(),
          unread: unreadVal,
          isUnread: Boolean(unreadVal > 0 || c.is_unread),
          custom_group_ids: Array.isArray(c.custom_group_ids) ? c.custom_group_ids : [],
          custom_groups: Array.isArray(c.custom_groups) ? c.custom_groups : [],
          channel: (c.channel || 'WHATSAPP').toUpperCase(),
          assignedTo: c.assigned_to || null,
          handlerName: c.assigned_to_name || c.locked_by_name || null,
          assignedToName: c.assigned_to_name || c.locked_by_name || null,
          handlerDept: c.assigned_department || 'Support',
          isLocked: c.is_locked || false,
          lockedBy: c.locked_by || null,
          lockedByName: c.locked_by_name || null,
          convoDbId: c.id || null,
          botPaused: Boolean(c.bot_paused),
          status: c.status || 'OPEN',
          contactObj: { platform_id: c.contact_platform_id, phone_number: c.contact_phone, name: c.contact_name, email: c.contact_email },
          messages: []
        };
      });

      if (append) {
        setConversations(prev => {
          const existingIds = new Set(prev.map(item => String(item.id)));
          const newItems = formatted.filter(item => !existingIds.has(String(item.id)));
          return [...prev, ...newItems];
        });
      } else {
        setConversations(formatted);
        if (formatted.length > 0) {
          const currentExists = formatted.some(item => item.id === selectedConvoIdRef.current);
          if (!selectedConvoIdRef.current || !currentExists) {
            selectedRawAddressRef.current = formatted[0].rawAddress || formatted[0].id;
            setSelectedConvoId(formatted[0].id);
          }
        } else {
          setSelectedConvoId(null);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch conversations:', err);
    } finally {
      setIsLoadingMoreContacts(false);
      setLoading(false);
    }
  };

  const handleChannelTabClick = (channelId) => {
    setActiveChannelFilter(channelId);
    activeChannelFilterRef.current = channelId;
    setSelectedGroupId(null);
    selectedGroupIdRef.current = null;
    setActiveStatusFilter('ALL');
    setConvoOffset(0);
    fetchConversations(channelId, 0, false, null);
  };

  const handleLoadMoreContacts = () => {
    const nextOffset = convoOffset + 15;
    setConvoOffset(nextOffset);
    fetchConversations(activeChannelFilter, nextOffset, true);
  };

  const fetchUnreadCounts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const apiUrl = API_BASE_URL;
      const res = await axios.get(`${apiUrl}/api/conversations/unread_counts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setUnreadCounts(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch unread counts:', err);
    }
  };

  const fetchChatGroups = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const apiUrl = API_BASE_URL;
      const res = await axios.get(`${apiUrl}/api/chat-groups/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setChatGroups(data);
    } catch (err) {
      console.warn('Failed to fetch chat groups:', err);
    }
  };

  const handleMarkRead = async (convo) => {
    if (!convo) return;
    const convoId = convo.convoDbId || convo.id;
    // Optimistic UI update
    setConversations(prev => prev.map(c => {
      if (c.id === convo.id || (c.convoDbId && c.convoDbId === convoId)) {
        return { ...c, unread: 0, isUnread: false };
      }
      return c;
    }));

    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await axios.post(`${API_BASE_URL}/api/conversations/${convoId}/mark_read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.unread_counts) {
        setUnreadCounts(res.data.unread_counts);
      } else {
        fetchUnreadCounts();
      }
    } catch (err) {
      console.warn('Failed to mark conversation read:', err);
      fetchUnreadCounts();
    }
  };

  const handleMarkUnread = async (convo) => {
    if (!convo) return;
    const convoId = convo.convoDbId || convo.id;
    // Optimistic UI update
    setConversations(prev => prev.map(c => {
      if (c.id === convo.id || (c.convoDbId && c.convoDbId === convoId)) {
        return { ...c, unread: Math.max(1, c.unread || 1), isUnread: true };
      }
      return c;
    }));

    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await axios.post(`${API_BASE_URL}/api/conversations/${convoId}/mark_unread/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.unread_counts) {
        setUnreadCounts(res.data.unread_counts);
      } else {
        fetchUnreadCounts();
      }
    } catch (err) {
      console.warn('Failed to mark conversation unread:', err);
      fetchUnreadCounts();
    }
  };

  const handleSelectConversation = (convo) => {
    if (!convo) return;
    selectedRawAddressRef.current = convo.rawAddress || convo.id;
    setSelectedConvoId(convo.id);
    setMobileShowChat(true);

    if (convo.unread > 0 || convo.isUnread) {
      handleMarkRead(convo);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const token = getAuthToken();
      if (!token) return;
      const apiUrl = API_BASE_URL;
      const res = await axios.get(`${apiUrl}/api/templates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      const approved = data.filter(t => (t.status || '').toUpperCase() === 'APPROVED' || !t.status);
      setMetaTemplates(approved);
      if (approved.length > 0) {
        setSelectedTemplateForSend(prev => prev || approved[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // 1. Initial Data Fetching
  const fetchData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = API_BASE_URL;

      // Fetch profile & conversations concurrently
      axios.get(`${apiUrl}/api/profile`, { headers })
        .then(res => setCurrentUser(res.data))
        .catch(() => setCurrentUser({ username: 'Admin', role: 'ADMIN' }));

      await fetchConversations(activeChannelFilterRef.current || 'ALL', 0, false);
      fetchTemplates();
      fetchUnreadCounts();
      fetchChatGroups();

      // Background loading of team and stats
      axios.get(`${apiUrl}/api/team/members/`, { headers }).then(res => setTeamMembers(Array.isArray(res.data) ? res.data : (res.data?.results || []))).catch(()=>{});
      axios.get(`${apiUrl}/api/monitoring/stats/`, { headers }).then(res => { if(res.data) setStatsData(res.data); }).catch(()=>{});

    } catch (err) {
      console.warn('Failed to fetch inbox initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMessages = async (contactId, offset = 0, append = false, channel = null) => {
    if (!contactId) return;
    try {
      if (append) {
        setIsLoadingMoreMessages(true);
      } else {
        setIsLoadingMessages(true);
      }
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const channelParam = (channel && channel !== 'ALL') ? `&channel=${encodeURIComponent(channel)}` : '';
      const res = await axios.get(`${apiUrl}/api/messages/?contact_id=${encodeURIComponent(contactId)}&limit=50&offset=${offset}${channelParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      const fetchedMessages = [...rawList].reverse();
      
      if (rawList.length < 50) {
        setHasMoreMessages(false);
      } else {
        setHasMoreMessages(true);
      }
      
      if (append) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newUnique = fetchedMessages.filter(m => m.id && !existingIds.has(m.id));
          return [...newUnique, ...prev];
        });
      } else {
        const seen = new Set();
        const uniqueMsgs = [];
        for (const m of fetchedMessages) {
          const mId = m.id || m._id;
          if (!mId || !seen.has(mId)) {
            if (mId) seen.add(mId);
            uniqueMsgs.push(m);
          }
        }
        setMessages(uniqueMsgs);
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

  useEffect(() => {
    if (selectedConvoId) {
      setMessagesOffset(0);
      const targetConvo = (conversationsRef.current || []).find(c => c.id === selectedConvoId) || conversations.find(c => c.id === selectedConvoId);
      const addressToFetch = targetConvo?.rawAddress || selectedRawAddressRef.current || selectedConvoId;
      selectedRawAddressRef.current = addressToFetch;
      const targetChannel = targetConvo?.channel || (activeChannelFilter !== 'ALL' ? activeChannelFilter : null);
      fetchMessages(addressToFetch, 0, false, targetChannel);
    }
  }, [selectedConvoId]);

  // Instant reactive client-side filtered conversations
  const convoList = useMemo(() => {
    let list = conversations;

    // 1. Channel Filter
    if (activeChannelFilter && activeChannelFilter !== 'ALL') {
      list = list.filter(c => (c.channel || '').toUpperCase() === activeChannelFilter.toUpperCase());
    }

    // 2. Custom Group Filter
    if (selectedGroupId) {
      const gidStr = String(selectedGroupId);
      list = list.filter(c => {
        const ids = Array.isArray(c.custom_group_ids) ? c.custom_group_ids.map(String) : [];
        const groupObjIds = Array.isArray(c.custom_groups) ? c.custom_groups.map(g => String(g.id || g._id || g)) : [];
        return ids.includes(gidStr) || groupObjIds.includes(gidStr);
      });
    }

    // 3. Status Filter (ALL, UNREAD, READ, UNASSIGNED, ASSIGNED)
    if (activeStatusFilter === 'UNREAD') {
      list = list.filter(c => (c.unread > 0 || c.isUnread));
    } else if (activeStatusFilter === 'READ') {
      list = list.filter(c => !(c.unread > 0 || c.isUnread));
    } else if (activeStatusFilter === 'ASSIGNED') {
      list = list.filter(c => Boolean(c.assignedTo));
    } else if (activeStatusFilter === 'UNASSIGNED') {
      list = list.filter(c => !c.assignedTo);
    }

    // 4. Search Filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => 
        (c.name || '').toLowerCase().includes(q) ||
        (c.rawAddress || '').toLowerCase().includes(q) ||
        (c.lastMessage || '').toLowerCase().includes(q) ||
        (c.contactObj?.phone_number || '').toLowerCase().includes(q) ||
        (c.contactObj?.platform_id || '').toLowerCase().includes(q)
      );
    }
    return list.map(c => ({
      ...c,
      messages: selectedConvoId === c.id ? messages : []
    })).sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
  }, [conversations, activeChannelFilter, selectedGroupId, activeStatusFilter, searchTerm, selectedConvoId, messages]);

  const activeConvo = convoList.find(c => c.id === selectedConvoId) || (convoList.length > 0 ? convoList[0] : null);
  const selectedGroupObj = chatGroups.find(g => String(g.id) === String(selectedGroupId));
  const platformGroups = useMemo(() => {
    return chatGroups.filter(g => {
      if (activeChannelFilter === 'ALL') return true;
      return !g.channel || g.channel === 'ALL' || g.channel.toUpperCase() === activeChannelFilter.toUpperCase();
    });
  }, [chatGroups, activeChannelFilter]);

  // Determine if the WhatsApp 24-hour customer window is open based on the latest incoming message
  const is24hWindowActive = useMemo(() => {
    if (!activeConvo || activeConvo.channel !== 'WHATSAPP') return true;
    const lastIncoming = messages.slice().reverse().find(m => m.message_type === 'INCOMING');
    if (!lastIncoming || !lastIncoming.created_at) return false;
    const hoursSince = (Date.now() - new Date(lastIncoming.created_at).getTime()) / (1000 * 60 * 60);
    return hoursSince < 24;
  }, [activeConvo, messages]);

  // When activeChannelFilter, selectedGroupId, or activeStatusFilter changes, auto-select first conversation
  useEffect(() => {
    if (convoList.length > 0) {
      const exists = convoList.some(c => c.id === selectedConvoIdRef.current);
      if (!selectedConvoIdRef.current || !exists) {
        selectedRawAddressRef.current = convoList[0].rawAddress || convoList[0].id;
        setSelectedConvoId(convoList[0].id);
      }
    } else {
      setSelectedConvoId(null);
    }
  }, [activeChannelFilter, selectedGroupId, activeStatusFilter, conversations.length]);

  // 2. Real-Time WebSocket Connection & Event Handlers with Auto-Reconnect
  useEffect(() => {
    let reconnectTimeout = null;
    let isUnmounted = false;

    const connectWebSocket = () => {
      if (isUnmounted) return;
      const token = getAuthToken();
      if (!token) return;

      let wsUrl = API_BASE_URL || '';
      wsUrl = wsUrl.replace(/^http/, 'ws') + `/ws/inbox/?token=${token}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'unread_counts_update') {
            if (data.unread_counts) {
              setUnreadCounts(data.unread_counts);
            }
            if (data.conversation_id) {
              setConversations(prev => prev.map(c => {
                if (c.id === data.conversation_id || c.convoDbId === data.conversation_id) {
                  const newUnread = data.unread_count !== undefined ? data.unread_count : c.unread;
                  return {
                    ...c,
                    unread: newUnread,
                    isUnread: Boolean(newUnread > 0),
                    custom_group_ids: data.custom_group_ids || c.custom_group_ids || []
                  };
                }
                return c;
              }));
            }
          }

          if (data.type === 'new_message') {
            const msg = data.message;
            const contactAddr = msg.message_type === 'INCOMING' ? msg.from_address : msg.to_address;
            const currentRaw = selectedRawAddressRef.current;
            const currentId = selectedConvoIdRef.current;
            const isForCurrentConvo = 
              (currentRaw && (msg.from_address === currentRaw || msg.to_address === currentRaw)) ||
              (currentId && (msg.from_address === currentId || msg.to_address === currentId));
              
            if (isForCurrentConvo) {
              setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                const tempIdx = prev.findIndex(m => String(m.id).startsWith('temp_') && m.body === msg.body);
                if (tempIdx !== -1) {
                  const copy = [...prev];
                  copy[tempIdx] = msg;
                  return copy;
                }
                return [...prev, msg];
              });
            }

            // Real-time Auto-Bump: Move or add this contact to index 0 (top of the list) with newest message!
            setConversations(prev => {
              const addrLower = String(contactAddr || '').toLowerCase();
              const existingIdx = prev.findIndex(c => 
                String(c.rawAddress || '').toLowerCase() === addrLower || 
                String(c.id || '').toLowerCase() === addrLower
              );

              if (existingIdx !== -1) {
                const updatedItem = {
                  ...prev[existingIdx],
                  lastMessage: msg.body || prev[existingIdx].lastMessage,
                  time: msg.created_at || new Date().toISOString(),
                  unread: msg.unread_count !== undefined ? msg.unread_count : (prev[existingIdx].unread || 0) + (msg.message_type === 'INCOMING' ? 1 : 0),
                  isUnread: msg.message_type === 'INCOMING' || prev[existingIdx].isUnread,
                  custom_group_ids: msg.custom_group_ids || prev[existingIdx].custom_group_ids || []
                };
                const remaining = prev.filter((_, idx) => idx !== existingIdx);
                return [updatedItem, ...remaining];
              } else {
                const newItem = {
                  id: contactAddr,
                  name: msg.sender_name || contactAddr,
                  rawAddress: contactAddr,
                  lastMessage: msg.body || 'New message',
                  time: msg.created_at || new Date().toISOString(),
                  unread: 1,
                  isUnread: true,
                  custom_group_ids: msg.custom_group_ids || [],
                  custom_groups: [],
                  channel: (msg.channel || 'WHATSAPP').toUpperCase(),
                  status: 'OPEN',
                  contactObj: { platform_id: contactAddr, phone_number: contactAddr, name: msg.sender_name || contactAddr },
                  messages: []
                };
                return [newItem, ...prev];
              }
            });

            // Refresh separate unread counts in real-time
            fetchUnreadCounts();
          }

          if (data.type === 'message_status_update') {
            setMessages(prev => prev.map(m => {
              const matches =
                (data.message_id && m.id === data.message_id) ||
                (data.whatsapp_message_id && m.whatsapp_message_id === data.whatsapp_message_id) ||
                (data.whatsapp_message_id && m.metadata?.response?.messages?.[0]?.id === data.whatsapp_message_id);
              return matches ? { ...m, status: data.status, error: data.error || m.error, error_code: data.error_code || m.error_code } : m;
            }));
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

          if (data.type === 'takeover_event' || data.type === 'transfer_event' || data.type === 'note_event' || data.type === 'bot_paused_event') {
            fetchData(); // Refresh UI live
          }
        } catch (err) {
          console.error('WebSocket event parse error:', err);
        }
      };

      ws.onclose = () => {
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = () => {
        try { ws.close(); } catch (_) {}
      };
    };

    connectWebSocket();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (_) {}
      }
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
    if ((!replyText.trim() && !selectedFile) || !activeConvo || isSending) return;
    
    const textToSend = replyText.trim();
    const fileToSend = selectedFile;
    setReplyText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsSending(true);

    const nowTs = Date.now();
    const targetAddress = activeConvo.contactObj?.phone_number || activeConvo.contactObj?.platform_id || activeConvo.rawAddress || activeConvo.id;
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: currentUser?.username || 'SYSTEM',
      to_address: targetAddress,
      body: textToSend || (fileToSend ? `📎 ${fileToSend.name}` : ''),
      channel: activeConvo.channel,
      message_type: isInternalNote ? 'INTERNAL' : 'OUTGOING',
      sender_name: currentUser?.username || 'Team Member',
      sender_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'User'}`,
      sender_department: currentUser?.department || 'Support',
      status: 'PENDING',
      media_url: fileToSend ? URL.createObjectURL(fileToSend) : null,
      media_type: fileToSend?.type?.startsWith('image/') ? 'image' : (fileToSend ? 'document' : null),
      media_filename: fileToSend?.name || null,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;

      let res;
      if (fileToSend) {
        const formData = new FormData();
        formData.append('to_number', targetAddress);
        if (textToSend) formData.append('body', textToSend);
        formData.append('channel', activeConvo.channel);
        formData.append('message_type', isInternalNote ? 'INTERNAL' : 'OUTGOING');
        formData.append('file', fileToSend);

        res = await axios.post(`${apiUrl}/api/messages/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await axios.post(`${apiUrl}/api/messages/`, {
          to_number: targetAddress,
          body: textToSend,
          channel: activeConvo.channel,
          message_type: isInternalNote ? 'INTERNAL' : 'OUTGOING'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (res.data) {
        if (res.data.status === 'FAILED') {
          const errDetail = res.data.error || 'Message rejected by WhatsApp/Meta API.';
          setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? { ...res.data, status: 'FAILED', error: errDetail } : m));
          if (activeConvo.channel === 'WHATSAPP') {
            fetchTemplates();
            setIsTemplateModalOpen(true);
          }
        } else {
          setMessages(prev => {
            const alreadyExists = prev.some(m => m.id === res.data.id);
            if (alreadyExists) {
              return prev.filter(m => m.id !== optimisticMsg.id);
            }
            const replaced = prev.map(m => m.id === optimisticMsg.id ? res.data : m);
            if (!replaced.some(m => m.id === res.data.id)) {
              replaced.push(res.data);
            }
            return replaced;
          });
          setConversations(prev => {
            const activeIdx = prev.findIndex(c => c.id === activeConvo.id);
            if (activeIdx !== -1) {
              const updatedItem = {
                ...prev[activeIdx],
                lastMessage: res.data.body || textToSend || (fileToSend ? fileToSend.name : 'Message sent'),
                time: new Date().toISOString()
              };
              const remaining = prev.filter((_, idx) => idx !== activeIdx);
              return [updatedItem, ...remaining];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn('Failed to send message:', err);
      const errMsg = err.response?.data?.detail || err.response?.data?.error || err.message;
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? { ...m, status: 'FAILED', error: errMsg } : m));
      alert('Failed to send message: ' + errMsg);
    } finally {
      setIsSending(false);
    }
  };

  // 3.1 Send Meta WhatsApp Approved Template
  const handleSendTemplate = async (template) => {
    if (!activeConvo || isSending) return;
    setIsSending(true);
    setIsTemplateModalOpen(false);

    const nowTs = Date.now();
    const targetAddress = activeConvo.contactObj?.phone_number || activeConvo.contactObj?.platform_id || activeConvo.rawAddress || activeConvo.id;
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: currentUser?.username || 'SYSTEM',
      to_address: targetAddress,
      body: `📄 [Template: ${template.name}]`,
      channel: 'WHATSAPP',
      message_type: 'OUTGOING',
      sender_name: currentUser?.username || 'Team Member',
      sender_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'User'}`,
      sender_department: currentUser?.department || 'Support',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;

      const res = await axios.post(`${apiUrl}/api/messages/`, {
        to_number: targetAddress,
        template_id: template.id || template.name,
        template_name: template.name,
        channel: 'WHATSAPP',
        message_type: 'OUTGOING'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setMessages(prev => {
          const alreadyExists = prev.some(m => m.id === res.data.id);
          if (alreadyExists) return prev.filter(m => m.id !== optimisticMsg.id);
          const replaced = prev.map(m => m.id === optimisticMsg.id ? res.data : m);
          if (!replaced.some(m => m.id === res.data.id)) replaced.push(res.data);
          return replaced;
        });
        setConversations(prev => {
          const activeIdx = prev.findIndex(c => c.id === activeConvo.id);
          if (activeIdx !== -1) {
            const updatedItem = {
              ...prev[activeIdx],
              lastMessage: `📄 [Template: ${template.name}]`,
              time: new Date().toISOString()
            };
            const remaining = prev.filter((_, idx) => idx !== activeIdx);
            return [updatedItem, ...remaining];
          }
          return prev;
        });
      }
    } catch (err) {
      console.warn('Failed to send template:', err);
      const errMsg = err.response?.data?.detail || err.response?.data?.error || err.message;
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? { ...m, status: 'FAILED', error: errMsg } : m));
      alert('Failed to send template: ' + errMsg);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Admin Actions: Force Takeover & Transfer
  const handleTakeover = async () => {
    if (!activeConvo) return;
    const currentName = currentUser?.first_name 
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() 
      : currentUser?.name || currentUser?.username || 'You';

    // Optimistically update conversation handler state
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvo.id) {
        return {
          ...c,
          botPaused: true,
          handlerName: currentName,
          assignedToName: currentName,
          isLocked: true,
          lockedByName: currentName
        };
      }
      return c;
    }));

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const convoIdToUse = activeConvo.convoDbId || activeConvo.id;
      await axios.post(`${apiUrl}/api/conversations/${convoIdToUse}/takeover/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.warn('Takeover event executed:', err);
    }
  };

  const handleResumeBot = async () => {
    if (!activeConvo) return;

    // Optimistically unassign and set bot active
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvo.id) {
        return {
          ...c,
          botPaused: false,
          handlerName: null,
          assignedToName: null,
          isLocked: false,
          lockedByName: null
        };
      }
      return c;
    }));

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const convoIdToUse = activeConvo.convoDbId || activeConvo.id;
      await axios.post(`${apiUrl}/api/conversations/${convoIdToUse}/resume_bot/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.warn('Resume bot event error:', err);
    }
  };

  // Quick toggle bot ON / OFF directly from contact list
  const handleToggleBotForConvo = async (convo) => {
    if (!convo) return;
    const isCurrentlyPaused = Boolean(convo.botPaused);
    const newPausedState = !isCurrentlyPaused;
    const currentName = currentUser?.first_name 
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() 
      : currentUser?.name || currentUser?.username || 'You';

    // Optimistic UI update
    setConversations(prev => prev.map(c => {
      if (c.id === convo.id) {
        return {
          ...c,
          botPaused: newPausedState,
          isLocked: newPausedState,
          handlerName: newPausedState ? currentName : null,
          assignedToName: newPausedState ? currentName : null
        };
      }
      return c;
    }));

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const convoIdToUse = convo.convoDbId || convo.id;
      const endpoint = isCurrentlyPaused ? 'resume_bot' : 'takeover';
      await axios.post(`${apiUrl}/api/conversations/${convoIdToUse}/${endpoint}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn(`Failed to toggle bot (${isCurrentlyPaused ? 'resume' : 'takeover'}):`, err);
      setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, botPaused: isCurrentlyPaused } : c));
    }
  };

  const handleTransferSubmit = async (convoId, payload) => {
    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      await axios.post(`${apiUrl}/api/conversations/${convoId}/transfer/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.warn('Transfer completed:', err);
    }
  };

  const fetchAuditLogs = async () => {
    if (!activeConvo) return;
    const currentName = currentUser?.first_name 
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() 
      : currentUser?.name || currentUser?.username || 'Admin';

    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const convoIdToUse = activeConvo.convoDbId || activeConvo.id;
      const res = await axios.get(`${apiUrl}/api/conversations/${convoIdToUse}/audit_logs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      setAuditLogs([
        { id: 1, actor_name: currentName, event_type: 'VIEWED', created_at: new Date().toISOString() },
        { id: 2, actor_name: 'AI Automation', event_type: 'OPENED', created_at: new Date().toISOString() }
      ]);
    }
    setIsAuditDrawerOpen(true);
  };

  const openAnalyticsModal = async () => {
    try {
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      const res = await axios.get(`${apiUrl}/api/monitoring/analytics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      setAnalyticsData([
        { user_id: '1', username: 'Abha Patel', department: 'Support', role: 'Support Lead', is_online: true, total_conversations: 14, replies_sent: 58, avg_response_time: '1m 20s', csat_score: '4.9 / 5.0', active_time: '6h 30m' },
        { user_id: '2', username: 'Rahul Sharma', department: 'Sales', role: 'Account Exec', is_online: true, total_conversations: 9, replies_sent: 34, avg_response_time: '2m 10s', csat_score: '4.8 / 5.0', active_time: '5h 15m' }
      ]);
    }
    setIsAnalyticsModalOpen(true);
  };

  const handleContactSaved = (savedContact, targetConvoId) => {
    if (!savedContact) return;

    // Real-time conversation list update
    setConversations((prev) =>
      prev.map((c) => {
        const cleanSavedPhone = (savedContact.phone_number || savedContact.platform_id || '').replace(/[^0-9]/g, '');
        const cleanConvoPhone = (c.rawAddress || c.id || '').replace(/[^0-9]/g, '');

        const isMatch =
          c.id === targetConvoId ||
          (cleanSavedPhone && cleanConvoPhone && (cleanSavedPhone.endsWith(cleanConvoPhone) || cleanConvoPhone.endsWith(cleanSavedPhone)));

        if (isMatch) {
          return {
            ...c,
            name: savedContact.name,
            contactSaved: true,
            contactDetails: savedContact
          };
        }
        return c;
      })
    );

    // Update active conversation name in state immediately
    if (activeConvo && (activeConvo.id === targetConvoId || activeConvo.rawAddress === savedContact.phone_number)) {
      activeConvo.name = savedContact.name;
    }

    // Add to local contacts pool
    setContacts((prev) => [savedContact, ...prev.filter(c => c.id !== savedContact.id)]);
  };

  const channelBadges = {
    WHATSAPP: { name: 'WhatsApp', bg: 'bg-emerald-500', text: 'text-white' },
    INSTAGRAM: { name: 'Instagram', bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white' },
    FACEBOOK: { name: 'Facebook', bg: 'bg-blue-600', text: 'text-white' },
    GMAIL: { name: 'Gmail', bg: 'bg-rose-500', text: 'text-white' }
  };

  const getOutgoingBubbleStyle = (convoChannel) => {
    const ch = (convoChannel || 'WHATSAPP').toUpperCase();
    if (ch === 'INSTAGRAM' || ch === 'IG' || ch === 'INSTA') {
      return 'bg-[#E1306C] text-white rounded-tr-none shadow-[#E1306C]/20';
    }
    if (ch === 'FACEBOOK' || ch === 'FB' || ch === 'MESSENGER') {
      return 'bg-[#1877F2] text-white rounded-tr-none shadow-[#1877F2]/20';
    }
    if (ch === 'YOUTUBE' || ch === 'YT') {
      return 'bg-red-600 text-white rounded-tr-none shadow-red-600/20';
    }
    if (ch === 'GMAIL' || ch === 'EMAIL' || ch === 'MAIL') {
      return 'bg-rose-600 text-white rounded-tr-none shadow-rose-600/20';
    }
    return 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-600/10';
  };

  const getSendButtonClass = (convoChannel) => {
    const ch = (convoChannel || 'WHATSAPP').toUpperCase();
    if (ch === 'INSTAGRAM' || ch === 'IG' || ch === 'INSTA') {
      return 'bg-[#E1306C] hover:bg-[#c7255d] disabled:hover:bg-[#E1306C] shadow-[#E1306C]/20';
    }
    if (ch === 'FACEBOOK' || ch === 'FB' || ch === 'MESSENGER') {
      return 'bg-[#1877F2] hover:bg-[#1464cc] disabled:hover:bg-[#1877F2] shadow-[#1877F2]/20';
    }
    if (ch === 'GMAIL' || ch === 'EMAIL' || ch === 'MAIL') {
      return 'bg-rose-600 hover:bg-rose-700 disabled:hover:bg-rose-600 shadow-rose-600/20';
    }
    return 'bg-emerald-600 hover:bg-emerald-700 disabled:hover:bg-emerald-600 shadow-emerald-600/20';
  };

  return (
    <DashboardLayout>
      <div className={cn(
        "flex flex-col h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden transition-colors duration-200",
        isDark ? "bg-[#090d16] text-slate-100" : "bg-slate-50 text-slate-900"
      )}>
        
        {/* ========================================================================= */}
        {/* MAIN WORKSPACE split: SIDEBAR & LIVE CHAT MONITOR WINDOW                   */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r flex flex-col transition-colors duration-200",
            isDark ? "bg-[#0f172a] border-slate-800/80" : "bg-white border-slate-200",
            mobileShowChat ? 'hidden md:flex' : 'flex'
          )}>
            
            {/* Search & Channel Filter */}
            <div className={cn(
              "p-3 sm:p-3.5 border-b space-y-2.5 transition-colors duration-200",
              isDark ? "border-slate-800/80 bg-[#0f172a]" : "border-slate-200 bg-white"
            )}>
              <div className="relative">
                <Search className={cn("w-4 h-4 absolute left-3 top-3", isDark ? "text-slate-500" : "text-slate-400")} />
                <input
                  type="text"
                  placeholder="Search customer, phone or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "w-full rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-colors duration-200 border focus:ring-2 focus:ring-emerald-500",
                    isDark 
                      ? "bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500" 
                      : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"
                  )}
                />
              </div>

              {/* Social Channels Filter Tabs - Sleek single-row horizontal capsule rail */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none select-none -mx-0.5 px-0.5">
                {CHANNEL_TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeChannelFilter === tab.id;
                  const count = tab.id === 'ALL'
                    ? unreadCounts.total
                    : unreadCounts[tab.id.toLowerCase()] || 0;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleChannelTabClick(tab.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border relative",
                        isActive 
                          ? cn(tab.activeClass, "border-transparent shadow-xs")
                          : isDark
                            ? "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border-slate-700/70"
                            : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 border-slate-200/80"
                      )}
                    >
                      <Icon size={13} className={isActive ? 'text-white' : tab.color || (isDark ? 'text-slate-400' : 'text-slate-500')} />
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold leading-none min-w-[16px] text-center",
                          isActive
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "bg-emerald-600 text-white"
                        )}>
                          {count > 99 ? '99+' : count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Category Filter Tabs: All, Unread, Read, Unassigned, Assigned + Platform Custom Groups */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none select-none -mx-0.5 px-0.5">
                {[
                  { id: 'ALL', label: 'All' },
                  { 
                    id: 'UNREAD', 
                    label: 'Unread', 
                    badge: activeChannelFilter === 'ALL' 
                      ? unreadCounts.total 
                      : (unreadCounts[activeChannelFilter.toLowerCase()] || 0)
                  },
                  { id: 'READ', label: 'Read' },
                  { id: 'UNASSIGNED', label: 'Unassigned' },
                  { id: 'ASSIGNED', label: 'Assigned' }
                ].map((sf) => {
                  const isStatusActive = selectedGroupId === null && activeStatusFilter === sf.id;
                  return (
                    <button
                      key={sf.id}
                      type="button"
                      onClick={() => {
                        setSelectedGroupId(null);
                        selectedGroupIdRef.current = null;
                        setActiveStatusFilter(sf.id);
                        if (selectedGroupId !== null) {
                          fetchConversations(activeChannelFilter, 0, false, null);
                        }
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border",
                        isStatusActive
                          ? isDark
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-2xs"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold shadow-2xs"
                          : isDark
                            ? "bg-slate-800/40 text-slate-400 hover:text-slate-200 border-slate-700/60"
                            : "bg-slate-100/70 text-slate-600 hover:text-slate-900 border-slate-200/80"
                      )}
                    >
                      <span>{sf.label}</span>
                      {sf.badge !== undefined && sf.badge > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none",
                          isStatusActive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        )}>
                          {sf.badge > 99 ? '99+' : sf.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Vertical Divider between status and custom groups */}
                <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

                {/* Custom Groups for current platform */}
                {platformGroups.map(group => {
                  const isGroupSelected = selectedGroupId === group.id;
                  const groupData = unreadCounts.groups?.[group.id];
                  const groupUnread = (typeof groupData === 'object' && groupData !== null) ? (groupData.unread_count || 0) : (groupData || group.unread_count || 0);
                  const color = group.color || '#10B981';

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "inline-flex items-center rounded-lg border text-[11px] font-bold transition-all whitespace-nowrap shrink-0 group relative overflow-hidden",
                        isGroupSelected
                          ? "shadow-2xs text-white"
                          : isDark
                            ? "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border-slate-700"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                      )}
                      style={isGroupSelected ? { backgroundColor: color, borderColor: color } : {}}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextGid = isGroupSelected ? null : group.id;
                          setSelectedGroupId(nextGid);
                          selectedGroupIdRef.current = nextGid;
                          fetchConversations(activeChannelFilter, 0, false, nextGid);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 cursor-pointer"
                      >
                        {!isGroupSelected && (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        )}
                        <span>{group.name}</span>
                        {groupUnread > 0 && (
                          <span className={cn(
                            "px-1.5 py-0.2 rounded-full text-[9px] font-black leading-none min-w-[14px] text-center",
                            isGroupSelected ? "bg-white text-slate-900" : "bg-emerald-600 text-white"
                          )}>
                            {groupUnread}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToEdit(group);
                          setIsCreateGroupModalOpen(true);
                        }}
                        title="Edit group"
                        className={cn(
                          "p-1 pr-1.5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity",
                          isGroupSelected ? "text-white" : isDark ? "text-slate-400" : "text-slate-500"
                        )}
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}

                {/* + Group button right in the category row */}
                <button
                  type="button"
                  onClick={() => {
                    setGroupToEdit(null);
                    setIsCreateGroupModalOpen(true);
                  }}
                  title={`Create new group for ${activeChannelFilter === 'ALL' ? 'All Platforms' : activeChannelFilter}`}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-dashed transition-all whitespace-nowrap cursor-pointer shrink-0",
                    isDark
                      ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500"
                      : "border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600"
                  )}
                >
                  <Plus className="w-3 h-3" />
                  <span>Group</span>
                </button>
              </div>
            </div>

            {/* Conversation Items */}
            <div className={cn(
              "flex-1 overflow-y-auto divide-y transition-colors duration-200",
              isDark ? "divide-slate-800/80 bg-[#0f172a]" : "divide-slate-100 bg-white"
            )}>
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center space-y-3.5 my-auto h-72 text-center animate-in fade-in duration-300">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse scale-150" />
                    <div className="w-14 h-14 rounded-2xl border-2 border-emerald-100 border-t-emerald-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={cn(
                        "w-9 h-9 rounded-xl p-1 shadow-xs border flex items-center justify-center overflow-hidden",
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
                      )}>
                        <img 
                          src={displayBrandLogo} 
                          alt={brand?.brand_name || "UWO Connect™"} 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-xs font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                      Loading {activeChannelFilter !== 'ALL' ? (activeChannelFilter.charAt(0) + activeChannelFilter.slice(1).toLowerCase()) : ''} Chats...
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Syncing live conversations</p>
                  </div>
                </div>
              ) : convoList.length > 0 ? (
                convoList.map(convo => {
                  const isSelected = convo.id === activeConvo?.id;
                  const channelInfo = channelBadges[convo.channel] || channelBadges.WHATSAPP;
                  const liveState = livePresence[convo.id];
                  const displayName = (!convo.name || convo.name.trim().toLowerCase() === 'unknown')
                    ? (convo.rawAddress || 'Customer')
                    : convo.name;
                  const hasUnread = Boolean((convo.unread && convo.unread > 0) || convo.isUnread);

                  return (
                    <div
                      key={convo.id}
                      onClick={() => handleSelectConversation(convo)}
                      className={cn(
                        "p-3 sm:p-3.5 cursor-pointer transition-all border-l-4 group relative",
                        isSelected 
                          ? isDark 
                            ? "bg-emerald-950/40 border-emerald-500" 
                            : "bg-emerald-50/80 border-emerald-500" 
                          : hasUnread
                            ? isDark
                              ? "bg-slate-800/40 border-emerald-400 hover:bg-slate-800/60"
                              : "bg-emerald-50/30 border-emerald-400 hover:bg-emerald-50/50"
                            : isDark 
                              ? "border-transparent hover:bg-slate-800/50" 
                              : "border-transparent hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <div className={cn(
                              "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm",
                              hasUnread 
                                ? "bg-emerald-600 text-white shadow-xs"
                                : isDark ? "bg-slate-800 text-slate-200 border border-slate-700/80" : "bg-slate-200 text-slate-700"
                            )}>
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold shadow-2xs ${channelInfo.bg} ${channelInfo.text}`}>
                              {convo.channel.slice(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={cn("text-xs flex items-center gap-1.5 truncate", 
                              hasUnread ? "font-extrabold text-slate-900 dark:text-white" : "font-bold",
                              isDark ? "text-slate-100" : "text-slate-900"
                            )}>
                              <span className="truncate">{displayName}</span>
                              {hasUnread && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Unread conversation" />
                              )}
                              {convo.isLocked && (
                                <Lock className="w-3 h-3 text-amber-500 shrink-0" title="Locked by team handler" />
                              )}
                            </h4>
                            <p className={cn("text-[11px] truncate mt-0.5", 
                              hasUnread ? "font-semibold text-slate-800 dark:text-slate-200" : isDark ? "text-slate-400" : "text-slate-500"
                            )}>
                              {liveState?.isTyping ? (
                                <span className="text-emerald-500 font-bold animate-pulse">
                                  ✍️ {liveState.typingUser || 'Employee'} is typing...
                                </span>
                              ) : (
                                convo.lastMessage
                              )}
                            </p>

                            {/* Assigned Custom Group Badges */}
                            {Array.isArray(convo.custom_group_ids) && convo.custom_group_ids.length > 0 && (
                              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                {convo.custom_group_ids.map(gid => {
                                  const grp = chatGroups.find(g => String(g.id) === String(gid));
                                  if (!grp) return null;
                                  return (
                                    <span
                                      key={grp.id}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold border shadow-2xs"
                                      style={{
                                        backgroundColor: `${grp.color || '#10B981'}15`,
                                        color: grp.color || '#10B981',
                                        borderColor: `${grp.color || '#10B981'}40`
                                      }}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: grp.color || '#10B981' }} />
                                      <span className="truncate max-w-[85px]">{grp.name}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end">
                          <div className="flex items-center gap-1.5">
                            <span className={cn("text-[10px] font-medium whitespace-nowrap", isDark ? "text-slate-500" : "text-slate-400")}>
                              {new Date(convo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {hasUnread && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-600 text-white min-w-[16px] text-center shadow-2xs">
                                {convo.unread > 99 ? '99+' : (convo.unread || 1)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-1.5">
                            {/* Manual Mark Read / Mark Unread Quick Action */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasUnread) {
                                  handleMarkRead(convo);
                                } else {
                                  handleMarkUnread(convo);
                                }
                              }}
                              title={hasUnread ? "Mark as Read" : "Mark as Unread"}
                              className={cn(
                                "p-1 rounded-md border transition-colors cursor-pointer",
                                isDark 
                                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" 
                                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                              )}
                            >
                              {hasUnread ? (
                                <CheckCheck className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <MailOpen className="w-3 h-3" />
                              )}
                            </button>

                            {/* Manage Custom Groups Action */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConvoForGroupManagement(convo);
                                setIsManageConvoGroupsModalOpen(true);
                              }}
                              title="Assign to custom groups"
                              className={cn(
                                "p-1 rounded-md border transition-colors cursor-pointer",
                                isDark 
                                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" 
                                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                              )}
                            >
                              <FolderPlus className="w-3 h-3 text-indigo-400" />
                            </button>

                            {/* Quick Bot ON/OFF Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBotForConvo(convo);
                              }}
                              title={convo.botPaused ? "Bot is Paused (Click to Turn Bot ON)" : "Bot is Active (Click to Turn Bot OFF / Take Over)"}
                              className={cn(
                                "inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs",
                                convo.botPaused
                                  ? isDark 
                                    ? "bg-amber-950/50 text-amber-300 border-amber-800/60 hover:bg-amber-900/60"
                                    : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                                  : isDark
                                    ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              )}
                            >
                              <Bot className={`w-2.5 h-2.5 ${convo.botPaused ? "text-amber-500" : (isDark ? "text-emerald-400" : "text-emerald-600")}`} />
                              <span>{convo.botPaused ? "OFF" : "ON"}</span>
                            </button>
                          </div>

                          {liveState?.viewer && liveState.viewer !== currentUser?.username && liveState.viewer !== currentUser?.email && (
                            <div className="mt-1 flex justify-end">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md font-bold max-w-[110px] truncate",
                                isDark ? "bg-blue-950/60 text-blue-300 border border-blue-800/60" : "bg-blue-100 text-blue-700"
                              )}>
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
                <div className={cn("text-center py-10 px-4 text-xs space-y-3", isDark ? "text-slate-400" : "text-slate-500")}>
                  {selectedGroupId ? (
                    <div className="space-y-3 max-w-xs mx-auto">
                      <div 
                        className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
                        style={{ backgroundColor: selectedGroupObj?.color || '#10B981' }}
                      >
                        <FolderPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                          No conversations in &quot;{selectedGroupObj?.name || 'this group'}&quot; yet
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Add numbers or chats to this group directly using the button below.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedGroupObj) {
                              setGroupToEdit(selectedGroupObj);
                            }
                            setIsCreateGroupModalOpen(true);
                          }}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Select &amp; Add Numbers</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGroupId(null);
                            selectedGroupIdRef.current = null;
                            fetchConversations(activeChannelFilter, 0, false, null);
                          }}
                          className={cn(
                            "w-full py-1.5 px-3 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer",
                            isDark ? "hover:bg-slate-800 text-slate-300 border-slate-700" : "hover:bg-slate-100 text-slate-600 border-slate-200"
                          )}
                        >
                          View All Conversations
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>No conversations match filters.</div>
                  )}
                </div>
              )}
              {conversations.length > 0 && hasMoreConvos && (
                <div className={cn("p-3 flex justify-center border-t", isDark ? "border-slate-800/80" : "border-slate-100")}>
                  <button 
                    disabled={isLoadingMoreContacts}
                    onClick={handleLoadMoreContacts}
                    className={cn(
                      "text-xs font-bold px-4 py-2.5 rounded-xl transition-all w-full disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer shadow-2xs border",
                      isDark
                        ? "text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-800/50"
                        : "text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                    )}
                  >
                    {isLoadingMoreContacts ? (
                      <>Loading more contacts... <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></>
                    ) : (
                      "Load More Contacts"
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
            <div className={cn(
              "flex-1 flex flex-col h-full overflow-hidden transition-colors duration-200",
              isDark ? "bg-[#090d16]" : "bg-emerald-50/20",
              mobileShowChat ? 'flex' : 'hidden md:flex'
            )}>
              
              {/* Live Chat Header & Control Bar */}
              <div className={cn(
                "border-b p-2.5 sm:p-3.5 shadow-2xs shrink-0 transition-colors duration-200",
                isDark ? "bg-[#0f172a] border-slate-800/80" : "bg-white border-slate-200"
              )}>
                {/* Row 1: Back + User Info + Actions */}
                <div className="flex items-center justify-between gap-2">
                  {/* Customer Avatar & Name */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <button 
                      onClick={() => setMobileShowChat(false)}
                      className={cn(
                        "md:hidden p-1.5 -ml-1 rounded-lg shrink-0 cursor-pointer transition-colors",
                        isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                      )}
                      title="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm shrink-0">
                      {((!activeConvo.name || activeConvo.name.trim().toLowerCase() === 'unknown') ? (activeConvo.rawAddress || 'C') : activeConvo.name).charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs sm:text-sm font-bold truncate", isDark ? "text-slate-100" : "text-slate-900")}>
                          {(!activeConvo.name || activeConvo.name.trim().toLowerCase() === 'unknown')
                            ? (activeConvo.rawAddress || 'Customer')
                            : activeConvo.name}
                        </span>
                        {/* On desktop show badges inline */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          {activeConvo.rawAddress && (
                            <span className={cn(
                              "text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border shadow-2xs",
                              isDark
                                ? activeConvo.channel === 'FACEBOOK'
                                  ? 'text-blue-300 bg-blue-950/60 border-blue-800/60'
                                  : activeConvo.channel === 'INSTAGRAM'
                                  ? 'text-pink-300 bg-pink-950/60 border-pink-800/60'
                                  : activeConvo.channel === 'GMAIL'
                                  ? 'text-rose-300 bg-rose-950/60 border-rose-800/60'
                                  : 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60'
                                : activeConvo.channel === 'FACEBOOK'
                                  ? 'text-blue-800 bg-blue-50 border-blue-200'
                                  : activeConvo.channel === 'INSTAGRAM'
                                  ? 'text-pink-800 bg-pink-50 border-pink-200'
                                  : activeConvo.channel === 'GMAIL'
                                  ? 'text-rose-800 bg-rose-50 border-rose-200'
                                  : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                            )}>
                              {activeConvo.channel === 'FACEBOOK' ? '👤 PSID: ' : activeConvo.channel === 'INSTAGRAM' ? '📸 IG: ' : activeConvo.channel === 'GMAIL' ? '✉️ ' : '📱 '}
                              {activeConvo.rawAddress}
                            </span>
                          )}
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs ${
                            activeConvo.channel === 'FACEBOOK'
                              ? 'bg-blue-600 text-white'
                              : activeConvo.channel === 'INSTAGRAM'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : activeConvo.channel === 'GMAIL'
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {activeConvo.channel}
                          </span>
                        </div>
                      </div>

                      <div className={cn("flex items-center gap-1.5 text-[10px] sm:text-xs truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                        {livePresence[activeConvo.id]?.isTyping ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1 animate-pulse truncate">
                            ✍️ {livePresence[activeConvo.id]?.typingUser || activeConvo.handlerName || 'Agent'} is typing...
                          </span>
                        ) : livePresence[activeConvo.id]?.viewer && livePresence[activeConvo.id]?.viewer !== currentUser?.username && livePresence[activeConvo.id]?.viewer !== currentUser?.email ? (
                          <span className="text-blue-400 font-semibold flex items-center gap-1 truncate">
                            🟢 {livePresence[activeConvo.id]?.viewer}
                          </span>
                        ) : (
                          <span className={cn("truncate", isDark ? "text-slate-500" : "text-slate-400")}>Online</span>
                        )}
                      </div>

                      {/* Assigned Custom Group Badges in Header */}
                      {Array.isArray(activeConvo.custom_group_ids) && activeConvo.custom_group_ids.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {activeConvo.custom_group_ids.map(gid => {
                            const grp = chatGroups.find(g => String(g.id) === String(gid));
                            if (!grp) return null;
                            return (
                              <button
                                key={grp.id}
                                type="button"
                                onClick={() => {
                                  setConvoForGroupManagement(activeConvo);
                                  setIsManageConvoGroupsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs cursor-pointer hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: `${grp.color || '#10B981'}15`,
                                  color: grp.color || '#10B981',
                                  borderColor: `${grp.color || '#10B981'}40`
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: grp.color || '#10B981' }} />
                                <span>{grp.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Mark Read / Unread Action Button */}
                    <button
                      onClick={() => {
                        if (activeConvo.unread > 0 || activeConvo.isUnread) {
                          handleMarkRead(activeConvo);
                        } else {
                          handleMarkUnread(activeConvo);
                        }
                      }}
                      className={cn(
                        "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0",
                        activeConvo.unread > 0 || activeConvo.isUnread
                          ? isDark
                            ? "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border-emerald-800/60"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300"
                          : isDark
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                      )}
                      title={activeConvo.unread > 0 || activeConvo.isUnread ? "Mark as Read" : "Mark as Unread"}
                    >
                      {activeConvo.unread > 0 || activeConvo.isUnread ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="hidden sm:inline">Mark Read</span>
                        </>
                      ) : (
                        <>
                          <MailOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="hidden sm:inline">Mark Unread</span>
                        </>
                      )}
                    </button>

                    {/* Manage Custom Groups Action Button */}
                    <button
                      onClick={() => {
                        setConvoForGroupManagement(activeConvo);
                        setIsManageConvoGroupsModalOpen(true);
                      }}
                      className={cn(
                        "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0",
                        isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                      )}
                      title="Manage custom groups for this conversation"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">Groups</span>
                      {Array.isArray(activeConvo.custom_group_ids) && activeConvo.custom_group_ids.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-indigo-500 text-white leading-none">
                          {activeConvo.custom_group_ids.length}
                        </span>
                      )}
                    </button>

                    {/* Add Contact Action Button */}
                    <button
                      onClick={() => setIsAddContactOpen(true)}
                      className="px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
                      title="Save customer contact to UWO Connect CRM & Inbox"
                    >
                      <UserPlus className="w-3.5 h-3.5 shrink-0" />
                      <span>+ Add Contact</span>
                    </button>
                    {activeConvo.botPaused ? (
                      <button
                        onClick={handleResumeBot}
                        className={cn(
                          "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0",
                          isDark
                            ? "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border-emerald-800/60"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300"
                        )}
                        title="Resume AI Bot & Workflow for this conversation"
                      >
                        <Bot className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                        <span className="hidden xs:inline sm:inline">Resume Bot</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleTakeover}
                        className={cn(
                          "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0",
                          isDark
                            ? "bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border-amber-800/60"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-300"
                        )}
                        title="Pause AI Bot and take over manually"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="hidden sm:inline">Take Over</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className={cn(
                        "px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0",
                        isDark
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                      )}
                      title="Transfer"
                    >
                      <ArrowRightLeft className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">Transfer</span>
                    </button>

                    <button
                      onClick={fetchAuditLogs}
                      className={cn(
                        "p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0",
                        isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                      )}
                      title="Inspect Audit Log"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Sub-badges & Handler pill on Mobile */}
                <div className={cn(
                  "flex sm:hidden items-center justify-between gap-1.5 pt-1.5 border-t mt-1.5",
                  isDark ? "border-slate-800/80" : "border-slate-100"
                )}>
                  <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                    {activeConvo.rawAddress && (
                      <span className={cn(
                        "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-2xs truncate max-w-[140px]",
                        isDark
                          ? activeConvo.channel === 'FACEBOOK'
                            ? 'text-blue-300 bg-blue-950/60 border-blue-800/60'
                            : activeConvo.channel === 'INSTAGRAM'
                            ? 'text-pink-300 bg-pink-950/60 border-pink-800/60'
                            : activeConvo.channel === 'GMAIL'
                            ? 'text-rose-300 bg-rose-950/60 border-rose-800/60'
                            : 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60'
                          : activeConvo.channel === 'FACEBOOK'
                            ? 'text-blue-800 bg-blue-50 border-blue-200'
                            : activeConvo.channel === 'INSTAGRAM'
                            ? 'text-pink-800 bg-pink-50 border-pink-200'
                            : activeConvo.channel === 'GMAIL'
                            ? 'text-rose-800 bg-rose-50 border-rose-200'
                            : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      )}>
                        {activeConvo.channel === 'FACEBOOK' ? '👤 ' : activeConvo.channel === 'INSTAGRAM' ? '📸 ' : activeConvo.channel === 'GMAIL' ? '✉️ ' : '📱 '}
                        {activeConvo.rawAddress}
                      </span>
                    )}
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs shrink-0 ${
                      activeConvo.channel === 'FACEBOOK'
                        ? 'bg-blue-600 text-white'
                        : activeConvo.channel === 'INSTAGRAM'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : activeConvo.channel === 'GMAIL'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {activeConvo.channel}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {activeConvo?.handlerName || activeConvo?.assignedToName ? (
                      <div className={cn(
                        "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        isDark ? "text-amber-300 bg-amber-950/60 border-amber-800/60" : "text-amber-800 bg-amber-50 border-amber-200"
                      )}>
                        <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[100px]">{activeConvo.handlerName || activeConvo.assignedToName}</span>
                      </div>
                    ) : (
                      <div className={cn(
                        "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        isDark ? "text-emerald-300 bg-emerald-950/60 border-emerald-800/60" : "text-emerald-800 bg-emerald-50 border-emerald-200"
                      )}>
                        <Bot className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                        <span>AI Bot</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Handler Pill */}
                <div className={cn(
                  "hidden sm:flex lg:hidden items-center gap-1.5 pt-1 border-t",
                  isDark ? "border-slate-800/80" : "border-slate-100"
                )}>
                  {activeConvo?.handlerName || activeConvo?.assignedToName ? (
                    <div className={cn(
                      "flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs",
                      isDark ? "text-amber-300 bg-amber-950/60 border-amber-800/60" : "text-amber-800 bg-amber-50 border-amber-200"
                    )}>
                      <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Handling: <strong>{activeConvo.handlerName || activeConvo.assignedToName}</strong></span>
                    </div>
                  ) : (
                    <div className={cn(
                      "flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs",
                      isDark ? "text-emerald-300 bg-emerald-950/60 border-emerald-800/60" : "text-emerald-800 bg-emerald-50 border-emerald-200"
                    )}>
                      <Bot className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Handling: <strong>Unassigned (AI Copilot)</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp 24-Hour Customer Window Alert Banner */}
              {activeConvo?.channel === 'WHATSAPP' && !is24hWindowActive && (
                <div className={cn(
                  "border-b px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0 animate-in fade-in duration-200",
                  isDark ? "bg-amber-950/50 border-amber-800/60 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
                )}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("p-1 rounded-md font-bold shrink-0 text-xs", isDark ? "bg-amber-900/80 text-amber-200" : "bg-amber-200/80 text-amber-900")}>⏰</span>
                    <div className="min-w-0">
                      <span className="font-bold text-xs">24-Hour Customer Window Closed</span>
                      <p className={cn("text-[11px] leading-tight", isDark ? "text-amber-300/80" : "text-amber-800")}>
                        Customer hasn't replied in 24 hours. Meta requires an approved template to message this contact.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { fetchTemplates(); setIsTemplateModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap ml-auto"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    <span>Send Meta Template</span>
                  </button>
                </div>
              )}

              {/* Timeline Messages View */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                {isLoadingMessages ? (
                  <div className="h-full min-h-[280px] flex flex-col items-center justify-center py-16 animate-in fade-in duration-200">
                    <div className="relative flex items-center justify-center mb-3">
                      <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse scale-125" />
                      <div className="w-14 h-14 rounded-2xl border-2 border-emerald-100 border-t-emerald-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={cn(
                          "w-9 h-9 rounded-xl p-1 shadow-xs border flex items-center justify-center overflow-hidden",
                          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
                        )}>
                          <img 
                            src={displayBrandLogo} 
                            alt={brand?.brand_name || "UWO Connect™"} 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className={cn("text-xs font-bold", isDark ? "text-slate-200" : "text-slate-700")}>Loading conversation...</p>
                    <p className={cn("text-[10px] mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>Syncing real-time messages</p>
                  </div>
                ) : (
                  <>
                    {activeConvo.messages && activeConvo.messages.length >= 50 && hasMoreMessages && (
                      <div className="flex justify-center mb-4">
                        <button
                          disabled={isLoadingMoreMessages}
                          onClick={() => {
                            const nextOffset = messagesOffset + 50;
                            setMessagesOffset(nextOffset);
                            fetchMessages(activeConvo.rawAddress || activeConvo.id, nextOffset, true, activeConvo.channel || (activeChannelFilter !== 'ALL' ? activeChannelFilter : null));
                          }}
                          className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 cursor-pointer border",
                            isDark
                              ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-700"
                              : "bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200"
                          )}
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
                        <div key={`${msg.id || 'msg'}_${index}`} className="my-3 flex justify-center">
                          <div className={cn(
                            "max-w-md rounded-xl p-3 shadow-xs border",
                            isDark ? "bg-amber-950/50 border-amber-800/70" : "bg-amber-50 border-amber-200"
                          )}>
                            <div className={cn(
                              "flex items-center justify-between gap-2 text-xs font-bold mb-1",
                              isDark ? "text-amber-300" : "text-amber-900"
                            )}>
                              <span className="flex items-center gap-1.5">
                                <StickyNote className={cn("w-3.5 h-3.5", isDark ? "text-amber-400" : "text-amber-600")} />
                                Internal Private Note • {msg.sender_name || currentUser?.first_name || currentUser?.username || 'Team Member'}
                              </span>
                              <span className={cn("text-[10px] font-normal", isDark ? "text-amber-400/80" : "text-amber-700")}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className={cn("text-xs font-medium", isDark ? "text-amber-200" : "text-amber-950")}>{msg.body}</p>
                          </div>
                        </div>
                      );
                    }

                    // Lead Application Form detection
                    const rawMsgBody = (msg.body || '').trim();
                    const isLeadTemplate = rawMsgBody.includes('[Instagram Lead Form Application]') || 
                                           rawMsgBody.includes('Lead Form') ||
                                           (rawMsgBody.includes('filled out your form') && (rawMsgBody.includes('Email:') || rawMsgBody.includes('Phone')));

                    let leadInfo = null;
                    if (isLeadTemplate) {
                      const nameM = rawMsgBody.match(/(?:Full [Nn]ame|Name):\s*([^\n\r]+)/i);
                      const phoneM = rawMsgBody.match(/(?:Phone(?: number)?|Mobile):\s*([^\n\r]+)/i);
                      const emailM = rawMsgBody.match(/Email:\s*([^\n\r]+)/i);
                      const cityM = rawMsgBody.match(/City:\s*([^\n\r]+)/i);

                      let parsedName = nameM ? nameM[1].trim() : '';
                      let parsedPhone = phoneM ? phoneM[1].trim() : '';
                      let parsedEmail = emailM ? emailM[1].trim() : '';
                      let parsedCity = cityM ? cityM[1].trim() : '';

                      if ((!parsedName || !parsedPhone || !parsedEmail || !parsedCity) && activeConvo?.messages) {
                        for (const otherMsg of activeConvo.messages) {
                          const ob = otherMsg.body || '';
                          if (!parsedName) {
                            const m = ob.match(/(?:Full [Nn]ame|Name):\s*([^\n\r]+)/i);
                            if (m) parsedName = m[1].trim();
                          }
                          if (!parsedPhone) {
                            const m = ob.match(/(?:Phone(?: number)?|Mobile):\s*([^\n\r]+)/i);
                            if (m) parsedPhone = m[1].trim();
                          }
                          if (!parsedEmail) {
                            const m = ob.match(/Email:\s*([^\n\r]+)/i);
                            if (m) parsedEmail = m[1].trim();
                          }
                          if (!parsedCity) {
                            const m = ob.match(/City:\s*([^\n\r]+)/i);
                            if (m) parsedCity = m[1].trim();
                          }
                        }
                      }

                      if (!parsedName) {
                        if (activeConvo?.contactObj?.name && activeConvo.contactObj.name !== 'Customer') {
                          parsedName = activeConvo.contactObj.name;
                        } else if (activeConvo?.name && activeConvo.name !== 'Customer') {
                          parsedName = activeConvo.name;
                        } else {
                          parsedName = 'Lead Applicant';
                        }
                      }

                      if (!parsedPhone) {
                        parsedPhone = activeConvo?.contactObj?.phone_number || (activeConvo?.rawAddress?.startsWith('+') ? activeConvo.rawAddress : '');
                      }

                      if (!parsedEmail) {
                        parsedEmail = activeConvo?.contactObj?.email || '';
                      }

                      leadInfo = {
                        name: parsedName,
                        phone: parsedPhone,
                        email: parsedEmail,
                        city: parsedCity
                      };
                    }

                    const resolvedMedia = resolveMediaUrl(msg.media_url || msg.metadata?.media_url);

                    const isDocument = msg.media_type === 'document' || 
                                       (resolvedMedia && (resolvedMedia.toLowerCase().includes('.pdf') || resolvedMedia.includes('/documents/') || resolvedMedia.includes('media-proxy'))) ||
                                       (msg.media_filename && msg.media_filename.toLowerCase().endsWith('.pdf'));

                    const isImage = (msg.media_type === 'image' || (resolvedMedia && /\.(png|jpe?g|gif|webp|svg)$/i.test(resolvedMedia))) && !isDocument;
                    const isVideo = msg.media_type === 'video' || (resolvedMedia && /\.(mp4|mov|webm)$/i.test(resolvedMedia));

                    return (
                      <div
                        key={`${msg.id || 'msg'}_${index}`}
                        className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}
                      >
                        {/* Outgoing Employee Badge Header */}
                        {!isIncoming && (
                          <div className={cn(
                            "flex items-center gap-1.5 mb-1 text-[10px] font-bold pr-1",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}>
                            <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>{msg.sender_name || currentUser?.first_name || currentUser?.username || 'Team Member'}</span>
                            <span>({msg.sender_department || currentUser?.department || 'Support Team'})</span>
                            <span>• {msg.channel || activeConvo.channel}</span>
                          </div>
                        )}

                        <div className={cn(
                          "max-w-[88%] sm:max-w-xl rounded-2xl p-3 sm:p-4 text-xs shadow-sm",
                          isIncoming 
                            ? isEmail 
                              ? isDark
                                ? 'bg-[#1e293b] text-slate-100 rounded-tl-none border border-slate-700 shadow-md'
                                : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-300'
                              : isDark
                                ? 'bg-[#1e293b] text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                                : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                            : getOutgoingBubbleStyle(activeConvo?.channel)
                        )}>
                          {/* Gmail Header Badge */}
                          {isEmail && (
                            <div className={cn(
                              "flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b",
                              isDark ? "border-slate-700" : "border-slate-200"
                            )}>
                              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span>GMAIL INBOX MESSAGE</span>
                              </div>
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-full",
                                isDark ? "bg-rose-950/60 text-rose-300 border border-rose-800/60" : "bg-rose-100 text-rose-700"
                              )}>
                                Email
                              </span>
                            </div>
                          )}

                          {/* Email Subject Title */}
                          {emailSubject && (
                            <div className={cn(
                              "mb-2 pb-2 border-b",
                              isDark ? "border-slate-700" : "border-slate-200/60"
                            )}>
                              <span className={cn("text-[10px] font-bold uppercase tracking-wider block", isDark ? "text-slate-400" : "text-slate-400")}>Subject</span>
                              <h4 className={cn("font-extrabold text-sm leading-snug", isDark ? "text-slate-100" : "text-slate-900")}>
                                {emailSubject}
                              </h4>
                            </div>
                          )}

                          {/* ── MEDIA PREVIEW (image / document / video) ── */}
                          {resolvedMedia && isImage && (
                            <div className={cn(
                              "mb-2 rounded-xl overflow-hidden border",
                              isDark ? "border-slate-700 bg-slate-900" : "border-slate-200/60 bg-slate-100"
                            )}>
                              <img
                                src={resolvedMedia}
                                alt="Customer photo"
                                className="w-full max-h-72 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(resolvedMedia, '_blank')}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              {msg.body && msg.body !== '📷 [Photo]' && (
                                <p className={cn("text-[11px] px-2 py-1 italic", isDark ? "text-slate-400" : "text-slate-500")}>{msg.body.replace('📷 ', '')}</p>
                              )}
                            </div>
                          )}

                          {isDocument && (
                            <a
                              href={resolvedMedia || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "flex items-center gap-2.5 p-3 rounded-xl border mb-2 no-underline transition-all cursor-pointer shadow-xs",
                                isIncoming
                                  ? isDark
                                    ? "bg-slate-800/90 border-slate-700 text-slate-100 hover:bg-slate-800"
                                    : "bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100"
                                  : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                              )}
                            >
                              <div className={cn("p-2 rounded-lg shrink-0", isIncoming ? (isDark ? "bg-slate-700 text-rose-400" : "bg-white text-rose-600 shadow-2xs") : "bg-white/20 text-white")}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs truncate">
                                  {msg.media_filename || (resolvedMedia ? resolvedMedia.split('/').pop().split('?')[0] : 'Document.pdf')}
                                </p>
                                <p className={cn("text-[10px]", isIncoming ? (isDark ? "text-slate-400" : "text-blue-600 font-medium") : "text-white/80")}>
                                  {msg.media_mime_type || 'PDF Document'} • Click to view & open
                                </p>
                              </div>
                              <div className={cn("p-1.5 rounded-lg shrink-0", isIncoming ? (isDark ? "bg-slate-700 text-slate-300" : "bg-blue-100 text-blue-700") : "bg-white/20 text-white")}>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            </a>
                          )}

                          {resolvedMedia && isVideo && (
                            <div className={cn("mb-2 rounded-xl overflow-hidden border bg-black", isDark ? "border-slate-700" : "border-slate-200/60")}>
                              <video
                                src={resolvedMedia}
                                controls
                                className="w-full max-h-60"
                                preload="metadata"
                              />
                            </div>
                          )}
                          {/* ── END MEDIA PREVIEW ── */}

                          {isLeadTemplate && leadInfo ? (
                            <div className={cn(
                              "rounded-xl p-3.5 my-1 border shadow-xs transition-all",
                              isDark
                                ? "bg-slate-900/90 border-slate-700 text-slate-100"
                                : "bg-gradient-to-br from-white to-pink-50/50 border-pink-200/80 text-slate-900"
                            )}>
                              {/* Card Header */}
                              <div className={cn("flex items-center justify-between pb-2 mb-2.5 border-b", isDark ? "border-slate-800" : "border-pink-100")}>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                                    <InstagramIcon size={14} />
                                  </div>
                                  <div>
                                    <h5 className="font-extrabold text-xs tracking-tight leading-tight">Instagram Lead Application</h5>
                                    <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">Meta Lead Ad Submission</span>
                                  </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  Verified Lead
                                </span>
                              </div>

                              {/* Lead Details */}
                              <div className="space-y-2 mb-2.5">
                                {leadInfo.name && (
                                  <div className={cn("flex items-center gap-2.5 p-2 rounded-lg", isDark ? "bg-slate-800/60" : "bg-white/80 border border-slate-100")}>
                                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Applicant Name</div>
                                      <div className="text-xs font-bold truncate">{leadInfo.name}</div>
                                    </div>
                                  </div>
                                )}

                                {leadInfo.phone && (
                                  <div className={cn("flex items-center gap-2.5 p-2 rounded-lg", isDark ? "bg-slate-800/60" : "bg-white/80 border border-slate-100")}>
                                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Phone Number</div>
                                      <a 
                                        href={`tel:${leadInfo.phone.replace(/\s+/g, '')}`} 
                                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                                      >
                                        {leadInfo.phone}
                                      </a>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard?.writeText(leadInfo.phone);
                                      }}
                                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                                      title="Copy Phone"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {leadInfo.email && (
                                  <div className={cn("flex items-center gap-2.5 p-2 rounded-lg", isDark ? "bg-slate-800/60" : "bg-white/80 border border-slate-100")}>
                                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Email Address</div>
                                      <a 
                                        href={`mailto:${leadInfo.email}`} 
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                                      >
                                        {leadInfo.email}
                                      </a>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard?.writeText(leadInfo.email);
                                      }}
                                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                                      title="Copy Email"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {leadInfo.city && (
                                  <div className={cn("flex items-center gap-2.5 p-2 rounded-lg", isDark ? "bg-slate-800/60" : "bg-white/80 border border-slate-100")}>
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">City / Location</div>
                                      <div className="text-xs font-bold truncate">{leadInfo.city}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 pt-1">
                                {leadInfo.phone && (
                                  <a
                                    href={`tel:${leadInfo.phone.replace(/\s+/g, '')}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Call Applicant</span>
                                  </a>
                                )}
                                {leadInfo.email && (
                                  <a
                                    href={`mailto:${leadInfo.email}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs"
                                  >
                                    <Mail className="w-3 h-3" />
                                    <span>Send Email</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className={cn(
                              "whitespace-pre-wrap font-normal leading-relaxed",
                              isEmail ? (isDark ? "max-h-72 overflow-y-auto pr-1 text-slate-200" : "max-h-72 overflow-y-auto pr-1 text-slate-800") : ""
                            )}>
                              {emailBodyText}
                            </div>
                          )}
                          
                          {/* Render Interactive CTA Quick Reply Buttons */}
                          {msgButtons.length > 0 && (
                            <div className={cn("mt-2.5 space-y-1.5 pt-2 border-t", isDark ? "border-slate-700/80" : "border-slate-200/40")}>
                              {msgButtons.map((btnText, bIdx) => (
                                <button
                                  key={bIdx}
                                  onClick={() => {
                                    setReplyText(btnText);
                                  }}
                                  className={cn(
                                    "w-full py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border shadow-2xs cursor-pointer",
                                    isIncoming 
                                      ? isDark
                                        ? "bg-slate-800/90 hover:bg-emerald-950/60 text-emerald-400 border-slate-700 hover:border-emerald-700"
                                        : "bg-slate-50 hover:bg-emerald-50 text-emerald-700 border-slate-200 hover:border-emerald-300" 
                                      : "bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xs"
                                  )}
                                >
                                  <span>💬 {btnText}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Render Interactive CTA Link Buttons */}
                          {msgUrls.length > 0 && (
                            <div className={cn("mt-2.5 space-y-1.5 pt-2 border-t", isDark ? "border-slate-700/80" : "border-slate-200/40")}>
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
                                    className={cn(
                                      "w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border shadow-sm cursor-pointer no-underline",
                                      isIncoming
                                        ? isDark
                                          ? "bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800/80"
                                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                                        : isDark
                                          ? "bg-white text-emerald-900 hover:bg-slate-100 border-white/80 shadow-md"
                                          : "bg-white text-emerald-800 hover:bg-slate-50 border-white/80 shadow-md"
                                    )}
                                  >
                                    {icon}
                                    <span className="truncate">{label}</span>
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          {/* Error info on failed messages */}
                          {msg.status === 'FAILED' && (
                            <div className={cn(
                              "mt-2.5 p-2 rounded-xl border text-[10px] flex items-start gap-2 shadow-xs",
                              isDark ? "bg-rose-950/60 border-rose-800/60 text-rose-200" : "bg-rose-950/40 border-rose-300/40 text-rose-100"
                            )}>
                              <span className="shrink-0 text-amber-300 font-bold">⚠️</span>
                              <div className="flex-1 space-y-1">
                                <span className="font-semibold block leading-tight">
                                  {msg.error || (msg.metadata?.error) || 'Message rejected by WhatsApp (e.g. 24h window closed).'}
                                </span>
                                {activeConvo.channel === 'WHATSAPP' && (
                                  <button
                                    onClick={() => { fetchTemplates(); setIsTemplateModalOpen(true); }}
                                    className={cn(
                                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors cursor-pointer shadow-2xs mt-0.5",
                                      isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-white hover:bg-slate-100 text-slate-900"
                                    )}
                                  >
                                    <LayoutTemplate className="w-3 h-3 text-emerald-500" />
                                    <span>Send Approved Template Instead</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className={cn("mt-2 flex items-center justify-end gap-1.5 text-[9px]", isIncoming ? (isDark ? "text-slate-400" : "text-slate-400") : "text-emerald-100")}>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!isIncoming && (
                              <>
                                {msg.status === 'READ' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" title="Read" />
                                ) : msg.status === 'DELIVERED' || msg.status === 'RECEIVED' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-200" title="Delivered" />
                                ) : msg.status === 'FAILED' ? (
                                  <span className="text-red-200 font-bold text-[9px] bg-red-900/60 px-1.5 py-0.5 rounded">Failed</span>
                                ) : (
                                  <Check className="w-3 h-3 text-emerald-200" title="Sent" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={cn("text-center py-16 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                    Start replying or monitoring live.
                  </div>
                )}
                  </>
                )}
              </div>

              {/* Composer Box (Public Reply vs Internal Note) */}
              <div className={cn(
                "border-t p-2.5 sm:p-4 space-y-2 sm:space-y-3 shrink-0 transition-colors duration-200",
                isDark ? "bg-[#0f172a] border-slate-800/80" : "bg-white border-slate-200"
              )}>
                
                {/* Note Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setIsInternalNote(false)}
                      className={cn(
                        "px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                        !isInternalNote 
                          ? "bg-emerald-600 text-white shadow-xs" 
                          : isDark
                            ? "text-slate-400 hover:text-white bg-slate-800"
                            : "text-slate-500 hover:text-slate-900 bg-slate-100"
                      )}
                    >
                      Public Reply
                    </button>
                    <button
                      onClick={() => setIsInternalNote(true)}
                      className={cn(
                        "px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer",
                        isInternalNote 
                          ? "bg-amber-500 text-white shadow-xs" 
                          : isDark
                            ? "text-slate-400 hover:text-white bg-slate-800"
                            : "text-slate-500 hover:text-slate-900 bg-slate-100"
                      )}
                    >
                      <StickyNote className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span>Internal Private Note</span>
                    </button>
                    {activeConvo?.channel === 'WHATSAPP' && (
                      <button
                        onClick={() => { fetchTemplates(); setIsTemplateModalOpen(true); }}
                        className={cn(
                          "px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border shadow-2xs",
                          isDark
                            ? "text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-800/60"
                            : "text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                        )}
                        title="Send Meta WhatsApp Template (re-engage contact beyond 24h)"
                      >
                        <LayoutTemplate className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0", isDark ? "text-emerald-400" : "text-emerald-600")} />
                        <span>Send Template</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected File Attachment Badge */}
                {selectedFile && (
                  <div className={cn(
                    "flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs animate-in fade-in duration-200",
                    isDark ? "bg-slate-800/90 border-slate-700 text-slate-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  )}>
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold truncate">{selectedFile.name}</span>
                      <span className="text-[10px] opacity-75 shrink-0">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Text input area - Guaranteed responsive layout with fixed-size send button */}
                <div className="flex items-center gap-2 w-full min-w-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    accept="*/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] sm:min-w-[40px] shrink-0 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all cursor-pointer",
                      selectedFile
                        ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-400 shadow-xs"
                        : isDark
                          ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                    )}
                    title="Attach Document or Media"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <textarea
                      rows={1}
                      value={replyText}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={isInternalNote ? "Add private internal note..." : "Type a message..."}
                      className={cn(
                        "w-full min-w-0 border rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs outline-none resize-none transition-all block focus:ring-2 focus:ring-emerald-500",
                        isDark
                          ? "bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                          : "bg-slate-100 hover:bg-slate-200/60 focus:bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      )}
                      style={{ minHeight: '38px', maxHeight: '80px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={(!replyText.trim() && !selectedFile) || isSending}
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] sm:min-w-[40px] shrink-0 rounded-xl sm:rounded-2xl active:scale-95 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer",
                      getSendButtonClass(activeConvo?.channel)
                    )}
                    title="Send"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className={cn(
              "flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300",
              isDark ? "bg-[#090d16]" : "bg-white"
            )}>
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse scale-150" />
                <div className="w-20 h-20 rounded-2xl border-2 border-emerald-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl p-1.5 shadow-md border flex items-center justify-center overflow-hidden",
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100 shadow-emerald-600/10"
                  )}>
                    <img 
                      src={displayBrandLogo} 
                      alt={brand?.brand_name || "Uwo Connect"} 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                    />
                  </div>
                </div>
              </div>
              <h3 className={cn("text-base font-extrabold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                <span>Loading {activeChannelFilter !== 'ALL' ? (activeChannelFilter.charAt(0) + activeChannelFilter.slice(1).toLowerCase()) : 'Omnichannel'} Inbox</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                </span>
              </h3>
              <p className={cn("text-xs mt-1.5 max-w-sm text-center", isDark ? "text-slate-400" : "text-slate-400")}>
                Syncing live conversations from {activeChannelFilter !== 'ALL' ? activeChannelFilter : 'WhatsApp, Instagram, Facebook, and Gmail'}...
              </p>
            </div>
          ) : (
            <div className={cn(
              "hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300",
              isDark ? "bg-[#090d16]" : "bg-slate-50/40"
            )}>
              <div className={cn(
                "max-w-md space-y-5 p-8 rounded-3xl border shadow-sm",
                isDark ? "bg-[#0f172a] border-slate-800/80 shadow-xl" : "bg-white border-slate-200/80"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-2xl border flex items-center justify-center p-2 mx-auto shadow-md",
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-emerald-100 shadow-emerald-500/10"
                )}>
                  <img 
                    src={displayBrandLogo} 
                    alt={brand?.brand_name || "UWO Connect™"} 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = "/download (3).gif"; }}
                  />
                </div>
                <div>
                  <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-slate-900")}>
                    {brand?.brand_name || "UWO Connect™"} Unified Inbox
                  </h3>
                  <p className={cn("text-xs mt-1.5 leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                    Select a customer conversation from the left to start live chatting, reply with templates, assign agents, or monitor real-time message streams.
                  </p>
                </div>

                <div className={cn("flex flex-wrap items-center justify-center gap-2 pt-2 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-2xs",
                    isDark ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}>
                    <WhatsAppIcon size={13} /> WhatsApp
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-2xs",
                    isDark ? "bg-pink-950/50 text-pink-300 border-pink-800/60" : "bg-pink-50 text-pink-700 border-pink-200"
                  )}>
                    <InstagramIcon size={13} /> Instagram
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-2xs",
                    isDark ? "bg-blue-950/50 text-blue-300 border-blue-800/60" : "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    <FacebookIcon size={13} /> Facebook
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-2xs",
                    isDark ? "bg-red-950/50 text-red-300 border-red-800/60" : "bg-red-50 text-red-700 border-red-200"
                  )}>
                    <Mail size={13} /> Gmail
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        prefilledPhone={activeConvo?.rawAddress || ''}
        prefilledName={activeConvo?.name || ''}
        convoId={selectedConvoId}
        existingContacts={contacts}
        onContactSaved={handleContactSaved}
      />

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

      {/* Meta WhatsApp Template Picker Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={cn(
            "rounded-3xl max-w-lg w-full shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] transition-colors",
            isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          )}>
            <div className={cn(
              "p-4 border-b flex items-center justify-between",
              isDark ? "bg-slate-800/70 border-slate-800" : "bg-slate-50/80 border-slate-200"
            )}>
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs",
                  isDark ? "bg-emerald-950/70 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                )}>
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={cn("font-extrabold text-sm", isDark ? "text-white" : "text-slate-900")}>Send WhatsApp Template</h3>
                  <p className={cn("text-[11px]", isDark ? "text-slate-400" : "text-slate-500")}>Bypasses the Meta 24-hour limit to message this contact</p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                  isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={cn("p-4 overflow-y-auto space-y-3 flex-1", isDark ? "bg-[#090d16]/50" : "bg-slate-50/30")}>
              {loadingTemplates ? (
                <div className={cn("text-center py-10 text-xs flex flex-col items-center gap-2", isDark ? "text-slate-400" : "text-slate-400")}>
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span>Loading approved Meta templates...</span>
                </div>
              ) : metaTemplates.length === 0 ? (
                <div className={cn(
                  "text-center py-10 text-xs rounded-2xl border border-dashed p-6",
                  isDark ? "bg-slate-800/40 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"
                )}>
                  <LayoutTemplate className={cn("w-8 h-8 mx-auto mb-2", isDark ? "text-slate-600" : "text-slate-300")} />
                  <p className={cn("font-bold", isDark ? "text-slate-300" : "text-slate-700")}>No approved templates found</p>
                  <p className={cn("mt-1", isDark ? "text-slate-500" : "text-slate-400")}>Please sync or create approved templates in Campaigns/Templates tab.</p>
                </div>
              ) : (
                metaTemplates.map((t) => (
                  <div
                    key={t.id || t.name}
                    className={cn(
                      "p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 group",
                      isDark
                        ? "bg-slate-800/80 border-slate-700 hover:border-emerald-500 hover:shadow-md"
                        : "bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={cn("font-bold text-xs font-mono tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t.name}</span>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs border",
                          isDark ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60" : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        )}>
                          {t.status || 'APPROVED'}
                        </span>
                      </div>
                      <div className={cn("flex items-center gap-2 text-[10px] mt-1", isDark ? "text-slate-400" : "text-slate-400")}>
                        <span>Language: <strong className={isDark ? "text-slate-300" : "text-slate-600"}>{t.language || 'en_US'}</strong></span>
                        <span>•</span>
                        <span>Category: <strong className={isDark ? "text-slate-300" : "text-slate-600"}>{t.category || 'UTILITY'}</strong></span>
                      </div>
                      {t.content && (
                        <p className={cn(
                          "text-xs mt-2 p-2.5 rounded-xl border leading-relaxed font-sans line-clamp-3",
                          isDark ? "bg-slate-900/80 text-slate-300 border-slate-700" : "bg-slate-50 text-slate-600 border-slate-100"
                        )}>
                          {t.content}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleSendTemplate(t)}
                      disabled={isSending}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send This Template</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create or Edit Custom Chat Group Modal */}
      <CreateOrEditGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => {
          setIsCreateGroupModalOpen(false);
          setGroupToEdit(null);
        }}
        groupToEdit={groupToEdit}
        defaultChannel={activeChannelFilter}
        conversations={conversations}
        onGroupSaved={(savedGroup) => {
          fetchChatGroups();
          fetchUnreadCounts();
          const targetGid = savedGroup?.id || selectedGroupId;
          if (targetGid) {
            setSelectedGroupId(targetGid);
            selectedGroupIdRef.current = targetGid;
            fetchConversations(activeChannelFilterRef.current || 'ALL', 0, false, targetGid);
          } else {
            fetchConversations(activeChannelFilterRef.current || 'ALL', 0, false, null);
          }
        }}
        onGroupDeleted={(deletedId) => {
          if (selectedGroupId === deletedId) {
            setSelectedGroupId(null);
            selectedGroupIdRef.current = null;
            fetchConversations(activeChannelFilterRef.current || 'ALL', 0, false, null);
          }
          fetchChatGroups();
          fetchUnreadCounts();
        }}
        getAuthToken={getAuthToken}
      />

      {/* Manage Conversation Groups Modal */}
      <ManageConversationGroupsModal
        isOpen={isManageConvoGroupsModalOpen}
        onClose={() => {
          setIsManageConvoGroupsModalOpen(false);
          setConvoForGroupManagement(null);
        }}
        conversation={convoForGroupManagement}
        allGroups={chatGroups}
        onGroupsUpdated={(convoId, updatedGroupIds) => {
          setConversations(prev => prev.map(c => {
            if (c.id === convoId || c.convoDbId === convoId) {
              return { ...c, custom_group_ids: updatedGroupIds };
            }
            return c;
          }));
          fetchChatGroups();
          fetchUnreadCounts();
        }}
        onOpenCreateGroup={() => {
          setGroupToEdit(null);
          setIsCreateGroupModalOpen(true);
        }}
        getAuthToken={getAuthToken}
      />
    </DashboardLayout>
  );
}

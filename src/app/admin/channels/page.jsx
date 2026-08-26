'use client';

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, CheckCircle2, Users, AlertCircle, Power, Radio,
  LayoutGrid, List, Clock, X, CalendarClock, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { CHANNEL_DEFINITIONS } from '@/config/channelsConfig';

// ═════════════════════════════════════════════════════════════════════════════════
// ── OFFICIAL AUTHENTIC BRAND VECTOR LOGOS ──
// ═════════════════════════════════════════════════════════════════════════════════

// 1. WhatsApp
const WhatsAppLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

// 2. Facebook
const FacebookLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
  </svg>
);

// 3. Instagram
const InstagramLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="igFinalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igFinalGrad2)"/>
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="31.5" cy="16.5" r="1.75" fill="white"/>
  </svg>
);

// 4. Gmail
const GmailLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4"/>
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853"/>
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335"/>
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F"/>
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04"/>
  </svg>
);

// 5. Outlook
const OutlookLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
    <path d="M28 14 L44 20 L44 28 L28 34 L28 14Z" fill="#106EBE" />
    <path d="M28 14 L44 20 L36 24 Z" fill="#28A8E8" />
  </svg>
);

// 6. OneDrive
const OneDriveLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M34.5 35H12C7.6 35 4 31.4 4 27C4 23 7 19.7 11 19.1C11.5 13.4 16.3 9 22 9C27.2 9 31.6 12.6 32.7 17.6C33.3 17.4 33.9 17.3 34.5 17.3C38.6 17.3 42 20.7 42 24.8C42 28.9 38.6 35 34.5 35Z" fill="#0078D4"/>
    <path d="M34.5 35H18C14.7 35 12 32.3 12 29C12 26 14.2 23.5 17.2 23.1C17.6 18.8 21.2 15.5 25.5 15.5C29.4 15.5 32.7 18.2 33.5 22C33.8 21.9 34.2 21.8 34.5 21.8C37.5 21.8 40 24.3 40 27.3C40 30.3 37.5 35 34.5 35Z" fill="#28A8E8"/>
  </svg>
);

// 7. Google Calendar
const GoogleCalendarLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="8" width="36" height="34" rx="4" fill="white" stroke="#4285F4" strokeWidth="3"/>
    <path d="M6 16H42V10C42 7.8 40.2 6 38 6H10C7.8 6 6 7.8 6 10V16Z" fill="#4285F4"/>
    <path d="M14 2V8" stroke="#EA4335" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 2V8" stroke="#34A853" strokeWidth="3" strokeLinecap="round"/>
    <rect x="13" y="22" width="6" height="5" rx="1" fill="#EA4335"/>
    <rect x="29" y="22" width="6" height="5" rx="1" fill="#FBBC04"/>
    <rect x="13" y="30" width="6" height="5" rx="1" fill="#34A853"/>
    <rect x="29" y="30" width="6" height="5" rx="1" fill="#4285F4"/>
  </svg>
);

// 8. Google Sheets
const GoogleSheetsLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M38 6H16C13.8 6 12 7.8 12 10V38C12 40.2 13.8 42 16 42H38C40.2 42 42 40.2 42 38V10C42 7.8 40.2 6 38 6Z" fill="#0F9D58"/>
    <path d="M20 14H34V18H20V14Z" fill="white"/>
    <path d="M20 22H26V26H20V22Z" fill="white"/>
    <path d="M28 22H34V26H28V22Z" fill="white"/>
    <path d="M20 30H26V34H20V30Z" fill="white"/>
    <path d="M28 30H34V34H28V30Z" fill="white"/>
  </svg>
);

// 9. Google Docs
const GoogleDocsLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M38 6H16C13.8 6 12 7.8 12 10V38C12 40.2 13.8 42 16 42H38C40.2 42 42 40.2 42 38V10C42 7.8 40.2 6 38 6Z" fill="#4285F4"/>
    <path d="M20 16H34V19H20V16Z" fill="white"/>
    <path d="M20 23H34V26H20V23Z" fill="white"/>
    <path d="M20 30H28V33H20V30Z" fill="white"/>
  </svg>
);

// 10. Google Slides
const GoogleSlidesLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M38 6H16C13.8 6 12 7.8 12 10V38C12 40.2 13.8 42 16 42H38C40.2 42 42 40.2 42 38V10C42 7.8 40.2 6 38 6Z" fill="#F4B400"/>
    <rect x="19" y="17" width="16" height="12" rx="2" fill="white"/>
  </svg>
);

// 11. Zoho CRM
const ZohoLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="4" y="4" width="18" height="18" rx="4" fill="#E62C2D"/>
    <rect x="26" y="4" width="18" height="18" rx="4" fill="#009345"/>
    <rect x="4" y="26" width="18" height="18" rx="4" fill="#0072BC"/>
    <rect x="26" y="26" width="18" height="18" rx="4" fill="#F47B20"/>
  </svg>
);

// 12. YouTube
const YouTubeLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="10" fill="#FF0000"/>
    <path d="M33.6 18.2C33.2 16.8 32 15.6 30.6 15.2C28 14.5 17.5 14.5 17.5 14.5C17.5 14.5 7 14.5 4.4 15.2C3 15.6 1.8 16.8 1.4 18.2C0.7 20.8 0.7 24 0.7 24C0.7 24 0.7 27.2 1.4 29.8C1.8 31.2 3 32.4 4.4 32.8C7 33.5 17.5 33.5 17.5 33.5C17.5 33.5 28 33.5 30.6 32.8C32 32.4 33.2 31.2 33.6 29.8C34.3 27.2 34.3 24 34.3 24C34.3 24 34.3 20.8 33.6 18.2ZM14.1 28V20L21.1 24L14.1 28Z" transform="translate(6.5, 0)" fill="white"/>
  </svg>
);

// 13. Google News
const GoogleNewsLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="8" width="32" height="32" rx="6" fill="#4285F4"/>
    <rect x="14" y="14" width="20" height="8" rx="2" fill="white"/>
    <path d="M14 26H34" stroke="#EA4335" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 32H26" stroke="#FBBC04" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Helper to render official authentic logo
const renderRealBrandLogo = (key, size = 28) => {
  switch (key) {
    case 'whatsapp': return <WhatsAppLogo size={size} />;
    case 'facebook': return <FacebookLogo size={size} />;
    case 'instagram': return <InstagramLogo size={size} />;
    case 'gmail': return <GmailLogo size={size} />;
    case 'outlook': return <OutlookLogo size={size} />;
    case 'onedrive': return <OneDriveLogo size={size} />;
    case 'google_calendar': return <GoogleCalendarLogo size={size} />;
    case 'google_sheets': return <GoogleSheetsLogo size={size} />;
    case 'google_docs': return <GoogleDocsLogo size={size} />;
    case 'google_slides': return <GoogleSlidesLogo size={size} />;
    case 'zoho': return <ZohoLogo size={size} />;
    case 'youtube': return <YouTubeLogo size={size} />;
    case 'google_news': return <GoogleNewsLogo size={size} />;
    default: return <Radio size={size} className="text-emerald-600" />;
  }
};

// Core Channels (Section 1)
const CORE_CHANNEL_KEYS = ['whatsapp', 'facebook', 'instagram'];

// Supported Connectors (Section 2)
const SUPPORTED_CONNECTOR_KEYS = [
  'gmail', 'outlook', 'onedrive', 'google_calendar', 
  'google_sheets', 'google_docs', 'google_slides', 
  'zoho', 'youtube', 'google_news'
];

const ALL_ALLOWED_KEYS = [...CORE_CHANNEL_KEYS, ...SUPPORTED_CONNECTOR_KEYS];

// Format date helper for scheduled badge
const formatScheduleDisplay = (dateString) => {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return null;
  }
};

export default function AdminChannelsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [togglingKey, setTogglingKey] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [toastMessage, setToastMessage] = useState(null);

  // Scheduling Modal State
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    item: null,
    date: '',
    time: '09:00',
    saving: false
  });

  // Load view mode preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_channels_view_mode');
      if (saved === 'cards' || saved === 'list') {
        setViewMode(saved);
      }
    } catch (e) {}
  }, []);

  const changeViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('admin_channels_view_mode', mode);
    } catch (e) {}
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Global Connectors from Backend
  const fetchItems = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/global/`, {
        headers
      });

      const serverConnectors = (res.data?.connectors || []).filter(c => ALL_ALLOWED_KEYS.includes(c.key));

      // Filter only allowed channel definitions
      const allowedDefs = CHANNEL_DEFINITIONS.filter(def => ALL_ALLOWED_KEYS.includes(def.key));

      const merged = allowedDefs.map(def => {
        const match = serverConnectors.find(c => c.key === def.key);
        return {
          ...def,
          is_active: match ? match.is_active : true,
          scheduled_live_at: match ? match.scheduled_live_at : null,
          clients_using_count: match ? (match.clients_using_count ?? 0) : 0,
          is_core_channel: CORE_CHANNEL_KEYS.includes(def.key)
        };
      });

      // Add any additional backend connectors if in allowed list
      serverConnectors.forEach(sc => {
        if (!merged.some(m => m.key === sc.key)) {
          merged.push({
            key: sc.key,
            name: sc.name,
            shortName: sc.short_name || sc.name,
            category: sc.category || 'MESSAGING',
            color: '#0284c7',
            is_active: sc.is_active,
            scheduled_live_at: sc.scheduled_live_at || null,
            clients_using_count: sc.clients_using_count ?? 0,
            is_core_channel: CORE_CHANNEL_KEYS.includes(sc.key)
          });
        }
      });

      setItems(merged);
    } catch (err) {
      console.warn('[AdminChannels] Error loading items, using fallback:', err);
      // Clean fallback with only allowed definitions
      setItems(
        CHANNEL_DEFINITIONS
          .filter(def => ALL_ALLOWED_KEYS.includes(def.key))
          .map(def => ({
            ...def,
            is_active: true,
            scheduled_live_at: null,
            clients_using_count: 0,
            is_core_channel: CORE_CHANNEL_KEYS.includes(def.key)
          }))
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Immediate Toggle Active/Deactive
  const handleToggle = async (item) => {
    const nextState = !item.is_active;
    setTogglingKey(item.key);

    // Optimistic UI update
    setItems(prev =>
      prev.map(i => (i.key === item.key ? { ...i, is_active: nextState, scheduled_live_at: nextState ? null : i.scheduled_live_at } : i))
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/global/${item.key}/`, {
        is_active: nextState
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(
        nextState 
          ? `🟢 ${item.name} activated` 
          : `⏸️ ${item.name} deactivated`,
        nextState ? 'success' : 'info'
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Revert optimistic update
      setItems(prev =>
        prev.map(i => (i.key === item.key ? { ...i, is_active: !nextState } : i))
      );
      showToast(err?.response?.data?.error || `Failed to update ${item.name}.`, 'error');
    } finally {
      setTogglingKey(null);
    }
  };

  // Open Schedule Modal
  const openScheduleModal = (item) => {
    let initialDate = '';
    let initialTime = '09:00';

    if (item.scheduled_live_at) {
      const d = new Date(item.scheduled_live_at);
      if (!isNaN(d.getTime())) {
        initialDate = d.toISOString().split('T')[0];
        initialTime = d.toTimeString().slice(0, 5);
      }
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      initialDate = tomorrow.toISOString().split('T')[0];
    }

    setScheduleModal({
      isOpen: true,
      item,
      date: initialDate,
      time: initialTime,
      saving: false
    });
  };

  // Quick Preset Selector
  const applyPreset = (preset) => {
    const now = new Date();
    if (preset === '1h') {
      now.setHours(now.getHours() + 1);
    } else if (preset === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      now.setHours(9, 0, 0, 0);
    } else if (preset === '3days') {
      now.setDate(now.getDate() + 3);
      now.setHours(9, 0, 0, 0);
    } else if (preset === 'monday') {
      const day = now.getDay();
      const diff = (8 - day) % 7 || 7;
      now.setDate(now.getDate() + diff);
      now.setHours(9, 0, 0, 0);
    }

    setScheduleModal(prev => ({
      ...prev,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    }));
  };

  // Save Schedule
  const handleSaveSchedule = async () => {
    const { item, date, time } = scheduleModal;
    if (!item || !date || !time) {
      showToast('Please select a valid date and time.', 'error');
      return;
    }

    const scheduledIso = new Date(`${date}T${time}:00`).toISOString();

    setScheduleModal(prev => ({ ...prev, saving: true }));

    // Optimistic update
    setItems(prev =>
      prev.map(i => (i.key === item.key ? { ...i, is_active: false, scheduled_live_at: scheduledIso } : i))
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/global/${item.key}/`, {
        scheduled_live_at: scheduledIso,
        is_active: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const displayDate = formatScheduleDisplay(scheduledIso);
      showToast(`⏰ ${item.name} scheduled to go live on ${displayDate}`);
      setScheduleModal({ isOpen: false, item: null, date: '', time: '09:00', saving: false });
    } catch (err) {
      console.error('Failed to schedule live activation:', err);
      showToast(err?.response?.data?.error || 'Failed to save schedule.', 'error');
      setScheduleModal(prev => ({ ...prev, saving: false }));
      fetchItems();
    }
  };

  // Cancel / Remove Schedule
  const handleRemoveSchedule = async () => {
    const { item } = scheduleModal;
    if (!item) return;

    setScheduleModal(prev => ({ ...prev, saving: true }));

    // Optimistic update
    setItems(prev =>
      prev.map(i => (i.key === item.key ? { ...i, scheduled_live_at: null } : i))
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/global/${item.key}/`, {
        scheduled_live_at: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(`Schedule removed for ${item.name}.`, 'info');
      setScheduleModal({ isOpen: false, item: null, date: '', time: '09:00', saving: false });
    } catch (err) {
      console.error('Failed to remove schedule:', err);
      showToast('Failed to remove schedule.', 'error');
      setScheduleModal(prev => ({ ...prev, saving: false }));
      fetchItems();
    }
  };

  const channelsList = items.filter(i => i.is_core_channel);
  const connectorsList = items.filter(i => !i.is_core_channel);

  // ── Render Card Item (Grid View) ──
  const renderCard = (item) => {
    const isToggling = togglingKey === item.key;
    const isActive = item.is_active;
    const isScheduled = Boolean(item.scheduled_live_at);
    const scheduleText = formatScheduleDisplay(item.scheduled_live_at);

    return (
      <div
        key={item.key}
        className={cn(
          "bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md relative group",
          isActive 
            ? "border-slate-200/90 hover:border-emerald-300" 
            : isScheduled
            ? "border-amber-300 bg-amber-50/30"
            : "border-slate-200/80 bg-slate-50/60"
        )}
      >
        {/* Top: Real Brand Logo & Channel Info */}
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100/80 shadow-2xs shrink-0">
              {renderRealBrandLogo(item.key, 32)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-base text-slate-900 leading-tight truncate">
                {item.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                <Users size={13} className="text-slate-400 shrink-0" />
                <span className="font-bold text-slate-800">
                  {item.clients_using_count}
                </span>
                <span>{item.clients_using_count === 1 ? 'client using' : 'clients using'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Scheduled Badge (if scheduled) */}
        {isScheduled && (
          <button
            onClick={() => openScheduleModal(item)}
            title="Click to edit schedule"
            className="w-full px-3.5 py-2 rounded-xl bg-amber-100/90 text-amber-950 border border-amber-300 text-xs font-bold flex items-center justify-between transition hover:bg-amber-100 shadow-2xs"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Clock size={13} className="text-amber-700 shrink-0" />
              <span>Goes live: <strong>{scheduleText}</strong></span>
            </span>
            <ChevronRight size={13} className="text-amber-700 shrink-0" />
          </button>
        )}

        {/* Bottom Row: Actions (Schedule Button + Active Toggle) */}
        <div className="flex items-center justify-between gap-2.5 pt-3.5 border-t border-slate-100">
          
          {/* Schedule Button */}
          <button
            onClick={() => openScheduleModal(item)}
            title="Schedule Go-Live Date & Time"
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer",
              isScheduled
                ? "bg-amber-50 text-amber-800 border-amber-200 shadow-2xs hover:bg-amber-100"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            )}
          >
            <CalendarClock size={13} className={isScheduled ? "text-amber-600" : "text-slate-500"} />
            <span>{isScheduled ? 'Scheduled' : 'Schedule'}</span>
          </button>

          {/* Active / Deactive Toggle Button */}
          <button
            onClick={() => handleToggle(item)}
            disabled={isToggling}
            title={isActive ? "Click to Deactivate" : "Click to Activate"}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 border cursor-pointer select-none shrink-0 shadow-2xs",
              isActive
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200",
              isToggling && "opacity-60 cursor-not-allowed"
            )}
          >
            {isToggling ? (
              <RefreshCw size={13} className="animate-spin text-slate-500" />
            ) : (
              <span className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              )} />
            )}
            <span>{isActive ? 'Active' : 'Deactive'}</span>
          </button>
        </div>
      </div>
    );
  };

  // ── Render List Item (Row View) ──
  const renderListItem = (item) => {
    const isToggling = togglingKey === item.key;
    const isActive = item.is_active;
    const isScheduled = Boolean(item.scheduled_live_at);
    const scheduleText = formatScheduleDisplay(item.scheduled_live_at);

    return (
      <div
        key={item.key}
        className={cn(
          "bg-white rounded-2xl px-6 py-4 border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 w-full",
          isActive 
            ? "border-slate-200/90" 
            : isScheduled
            ? "border-amber-300 bg-amber-50/20"
            : "border-slate-200 bg-slate-50/60"
        )}
      >
        {/* Left: Real Brand Logo & Details */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-2xs shrink-0">
            {renderRealBrandLogo(item.key, 28)}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 truncate">
              {item.name}
            </h3>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {item.category}
            </span>
          </div>
        </div>

        {/* Center: Live Client Usage */}
        <div className="flex items-center gap-2 text-xs text-slate-500 sm:w-44 shrink-0">
          <Users size={14} className="text-slate-400 shrink-0" />
          <span className="font-bold text-slate-800">
            {item.clients_using_count}
          </span>
          <span>{item.clients_using_count === 1 ? 'client using' : 'clients using'}</span>
        </div>

        {/* Right: Schedule & Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openScheduleModal(item)}
            title="Schedule Go-Live Date & Time"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer",
              isScheduled
                ? "bg-amber-50 text-amber-800 border-amber-200 shadow-2xs hover:bg-amber-100"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            )}
          >
            <CalendarClock size={13} className={isScheduled ? "text-amber-600" : "text-slate-500"} />
            <span>{isScheduled ? `Live: ${scheduleText}` : 'Schedule'}</span>
          </button>

          <button
            onClick={() => handleToggle(item)}
            disabled={isToggling}
            title={isActive ? "Click to Deactivate" : "Click to Activate"}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 border cursor-pointer select-none shrink-0 min-w-[100px] justify-center shadow-2xs",
              isActive
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200",
              isToggling && "opacity-60 cursor-not-allowed"
            )}
          >
            {isToggling ? (
              <RefreshCw size={13} className="animate-spin text-slate-500" />
            ) : (
              <span className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              )} />
            )}
            <span>{isActive ? 'Active' : 'Deactive'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full px-6 md:px-10 py-6 space-y-8 min-h-screen font-sans bg-transparent">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className={cn(
              "px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 backdrop-blur-md text-sm font-semibold",
              toastMessage.type === 'error' ? "bg-rose-900/95 text-white border-rose-700" :
              toastMessage.type === 'info' ? "bg-slate-900/95 text-white border-slate-700" :
              "bg-slate-900/95 text-white border-slate-700"
            )}>
              {toastMessage.type === 'error' ? <AlertCircle size={16} className="text-rose-400" /> :
               toastMessage.type === 'info' ? <Power size={16} className="text-amber-400" /> :
               <CheckCircle2 size={16} className="text-emerald-400" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {scheduleModal.isOpen && scheduleModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shrink-0">
                    {renderRealBrandLogo(scheduleModal.item.key, 32)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      Schedule Go-Live
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {scheduleModal.item.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setScheduleModal({ isOpen: false, item: null, date: '', time: '09:00', saving: false })}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-500 leading-relaxed">
                Set a specific date & time when this channel will automatically go live across all client workspaces.
              </p>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('1h')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-left cursor-pointer"
                  >
                    🕒 In 1 Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('tomorrow')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-left cursor-pointer"
                  >
                    🌅 Tomorrow 9:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('3days')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-left cursor-pointer"
                  >
                    📅 In 3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('monday')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-left cursor-pointer"
                  >
                    🗓️ Next Monday
                  </button>
                </div>
              </div>

              {/* Date & Time Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={scheduleModal.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setScheduleModal(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={scheduleModal.time}
                    onChange={(e) => setScheduleModal(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {scheduleModal.item.scheduled_live_at ? (
                  <button
                    type="button"
                    onClick={handleRemoveSchedule}
                    disabled={scheduleModal.saving}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                  >
                    Cancel Schedule
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModal({ isOpen: false, item: null, date: '', time: '09:00', saving: false })}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSchedule}
                    disabled={scheduleModal.saving || !scheduleModal.date || !scheduleModal.time}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {scheduleModal.saving && <RefreshCw size={13} className="animate-spin" />}
                    <span>Save Schedule</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Header with View Toggle (Cards / List) & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Channels & Connectors
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Master Governance
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Activate or deactivate channels and connectors, schedule go-live dates, and monitor live client usage.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Cards / List */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => changeViewMode('cards')}
                title="Cards View"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                  viewMode === 'cards'
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>

              <button
                onClick={() => changeViewMode('list')}
                title="List View"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                  viewMode === 'list'
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <List size={14} />
                <span>List</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchItems(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition border border-slate-200 shadow-xs cursor-pointer"
            >
              <RefreshCw size={13} className={cn(isRefreshing && "animate-spin text-emerald-600")} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-6 w-full">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse h-28" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10 w-full">
            
            {/* ── Section 1: Channels (WhatsApp, Facebook, Instagram) ── */}
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                    Channels
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {channelsList.length}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Core Meta Messaging Channels
                </span>
              </div>

              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {channelsList.map(renderCard)}
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  {channelsList.map(renderListItem)}
                </div>
              )}
            </div>

            {/* ── Section 2: Real Supported Connectors ── */}
            <div className="space-y-4 w-full pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                    Connectors & Productivity Suite
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {connectorsList.length}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Email, Storage, CRM & Media
                </span>
              </div>

              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {connectorsList.map(renderCard)}
                </div>
              ) : (
                <div className="space-y-2.5 w-full">
                  {connectorsList.map(renderListItem)}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

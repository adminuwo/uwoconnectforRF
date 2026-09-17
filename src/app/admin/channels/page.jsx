'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  RefreshCw, CheckCircle2, Users, AlertCircle, Power, Radio,
  LayoutGrid, List, Clock, X, CalendarClock, ChevronRight,
  Phone, Send, Megaphone, GitBranch, Zap, Brain, FileText,
  Calculator, Receipt, ShoppingBag, ShoppingCart, BarChart3,
  ShieldCheck, Search, Filter, Sparkles, SlidersHorizontal,
  ExternalLink, Layers, MessageSquare, Database
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { CHANNEL_DEFINITIONS } from '@/config/channelsConfig';

// ═════════════════════════════════════════════════════════════════════════════════
// ── OFFICIAL AUTHENTIC BRAND VECTOR LOGOS & FEATURE ICONS ──
// ═════════════════════════════════════════════════════════════════════════════════

// 1. WhatsApp
const WhatsAppLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z"
      fill="white"
    />
  </svg>
);

// 2. Facebook
const FacebookLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path
      d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z"
      fill="white"
    />
  </svg>
);

// 3. Instagram
const InstagramLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="igFinalGradAdmin" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igFinalGradAdmin)" />
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="31.5" cy="16.5" r="1.75" fill="white" />
  </svg>
);

// 4. Voice & Video Calling
const CallsLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0D9488" />
    <path d="M14 18C14 15.8 15.8 14 18 14H24C26.2 14 28 15.8 28 18V30C28 32.2 26.2 34 24 34H18C15.8 34 14 32.2 14 30V18Z" fill="white" />
    <path d="M28 20L35 16V32L28 28V20Z" fill="white" opacity="0.9" />
  </svg>
);

// 5. Google News Feed
const GoogleNewsLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#4285F4" />
    <rect x="12" y="12" width="24" height="24" rx="4" fill="white" />
    <path d="M16 16H32V20H16V16Z" fill="#EA4335" />
    <path d="M16 23H25V26H16V23Z" fill="#34A853" />
    <path d="M16 28H28V30H16V28Z" fill="#FBBC04" />
    <rect x="27" y="22" width="5" height="5" rx="1" fill="#4285F4" />
  </svg>
);

// 6. Telegram
const TelegramLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#229ED9" />
    <path d="M10 23.5L34 14L28.5 35L22 28.5L18 31.5L17.5 26.5L30 17L14.5 25.5L10 23.5Z" fill="white" />
  </svg>
);

// 7. Gmail
const GmailLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
    <path d="M12 36V19.5L6 15V33C6 34.6 7.3 36 9 36H12Z" fill="#4285F4" />
    <path d="M36 36V19.5L42 15V33C42 34.6 40.7 36 39 36H36Z" fill="#34A853" />
    <path d="M36 19.5V12L24 21L12 12V19.5L24 28.5L36 19.5Z" fill="#EA4335" />
    <path d="M12 12L6 15L12 19.5V12Z" fill="#C5221F" />
    <path d="M36 12L42 15L36 19.5V12Z" fill="#FBBC04" />
  </svg>
);

// 8. Outlook
const OutlookLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0078D4" />
    <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="3" fill="none" />
    <path d="M17 19H31V29H17V19Z" fill="white" opacity="0.3" />
    <path d="M17 19L24 24L31 19" stroke="white" strokeWidth="2.5" fill="none" />
  </svg>
);

// 9. OneDrive
const OneDriveLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0078D4" />
    <path
      d="M17.5 32C14.5 32 12 29.5 12 26.5C12 23.8 13.9 21.6 16.5 21.1C17.3 17.6 20.4 15 24 15C28.2 15 31.7 18.2 32 22.4C34.3 22.8 36 24.8 36 27.2C36 30 33.7 32 31 32H17.5Z"
      fill="white"
    />
  </svg>
);

// 10. Google Calendar
const GoogleCalendarLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#4285F4" />
    <rect x="12" y="14" width="24" height="22" rx="4" fill="white" />
    <path d="M12 14H36V20H12V14Z" fill="#EA4335" />
    <circle cx="18" cy="11" r="2" fill="white" />
    <circle cx="30" cy="11" r="2" fill="white" />
    <text x="24" y="31" fill="#4285F4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
  </svg>
);

// 11. Google Sheets
const GoogleSheetsLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0F9D58" />
    <rect x="13" y="11" width="22" height="26" rx="3" fill="white" />
    <path d="M17 17H31M17 23H31M17 29H31" stroke="#0F9D58" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 17V29" stroke="#0F9D58" strokeWidth="2" />
  </svg>
);

// 12. Google Docs
const GoogleDocsLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#4285F4" />
    <rect x="13" y="11" width="22" height="26" rx="3" fill="white" />
    <path d="M17 17H31M17 23H31M17 29H26" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 13. Google Slides
const GoogleSlidesLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#F4B400" />
    <rect x="13" y="12" width="22" height="24" rx="3" fill="white" />
    <rect x="17" y="16" width="14" height="10" rx="1" fill="#F4B400" />
    <path d="M17 29H31" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 14. Zoho CRM
const ZohoLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <rect x="10" y="10" width="13" height="13" rx="3" fill="#E62C2D"/>
    <rect x="25" y="10" width="13" height="13" rx="3" fill="#009345"/>
    <rect x="10" y="25" width="13" height="13" rx="3" fill="#0072BC"/>
    <rect x="25" y="25" width="13" height="13" rx="3" fill="#F47B20"/>
  </svg>
);

// 15. YouTube
const YouTubeLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L18.8 32.4V15.8L33.2 24.1Z" fill="white" />
  </svg>
);

// Feature Module Badges (12)
const FeatureBadge = ({ color, children, size = 44 }) => (
  <div
    style={{ width: size, height: size, backgroundColor: color }}
    className="rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
  >
    {children}
  </div>
);

// Helper to render official authentic logo or feature icon
const renderItemIcon = (key, size = 44) => {
  switch (key) {
    // Channels
    case 'whatsapp': return <WhatsAppLogo size={size} />;
    case 'facebook': return <FacebookLogo size={size} />;
    case 'instagram': return <InstagramLogo size={size} />;
    case 'calls': return <CallsLogo size={size} />;
    case 'google_news': return <GoogleNewsLogo size={size} />;
    case 'telegram': return <TelegramLogo size={size} />;

    // Connectors
    case 'gmail': return <GmailLogo size={size} />;
    case 'outlook': return <OutlookLogo size={size} />;
    case 'onedrive': return <OneDriveLogo size={size} />;
    case 'google_calendar': return <GoogleCalendarLogo size={size} />;
    case 'google_sheets': return <GoogleSheetsLogo size={size} />;
    case 'google_docs': return <GoogleDocsLogo size={size} />;
    case 'google_slides': return <GoogleSlidesLogo size={size} />;
    case 'zoho': return <ZohoLogo size={size} />;
    case 'youtube': return <YouTubeLogo size={size} />;

    // Core Features
    case 'broadcasts':
      return (
        <FeatureBadge color="#7C3AED" size={size}>
          <Megaphone size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'workflows':
      return (
        <FeatureBadge color="#4F46E5" size={size}>
          <GitBranch size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'automations':
      return (
        <FeatureBadge color="#059669" size={size}>
          <Zap size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'knowledge':
      return (
        <FeatureBadge color="#9333EA" size={size}>
          <Brain size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'crm':
      return (
        <FeatureBadge color="#2563EB" size={size}>
          <Users size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'proposals':
      return (
        <FeatureBadge color="#6366F1" size={size}>
          <FileText size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'quotations':
      return (
        <FeatureBadge color="#0284C7" size={size}>
          <Calculator size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'invoices':
      return (
        <FeatureBadge color="#10B981" size={size}>
          <Receipt size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'catalog':
      return (
        <FeatureBadge color="#F59E0B" size={size}>
          <ShoppingBag size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'orders':
      return (
        <FeatureBadge color="#EA580C" size={size}>
          <ShoppingCart size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'reports':
      return (
        <FeatureBadge color="#8B5CF6" size={size}>
          <BarChart3 size={22} className="text-white" />
        </FeatureBadge>
      );
    case 'team':
      return (
        <FeatureBadge color="#EC4899" size={size}>
          <ShieldCheck size={22} className="text-white" />
        </FeatureBadge>
      );
    default:
      return (
        <FeatureBadge color="#64748B" size={size}>
          <Layers size={22} className="text-white" />
        </FeatureBadge>
      );
  }
};

export default function AdminChannelsPage() {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({ channels: 6, connectors: 9, features: 12, total: 27, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [togglingKey, setTogglingKey] = useState(null);
  
  // Segmented Tabs: 'all' | 'channels' | 'connectors' | 'features'
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMING_SOON'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [toastMessage, setToastMessage] = useState(null);

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

  // Fetch Global Channels, Connectors, & Features from Backend
  const fetchItems = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_BASE_URL}/api/admin/channel-access/global/`, {
        headers
      });

      const serverItems = res.data?.items || res.data?.connectors || [];
      if (res.data?.counts) {
        setCounts(res.data.counts);
      }

      // Merge server items with CHANNEL_DEFINITIONS for rich colors, taglines, and descriptions
      const defMap = new Map();
      CHANNEL_DEFINITIONS.forEach(def => defMap.set(def.key, def));

      const merged = serverItems.map(si => {
        const def = defMap.get(si.key) || {};
        return {
          key: si.key,
          name: si.name || def.name || si.key,
          shortName: def.shortName || si.name || si.key,
          category: si.category || def.category || 'MESSAGING',
          item_type: (si.item_type || def.item_type || 'CHANNEL').toUpperCase(),
          description: def.description || `${si.name} integration and feature controls.`,
          tagline: def.tagline || (si.item_type === 'FEATURE' ? 'Core Platform Feature' : 'Integration & API'),
          color: def.color || '#0284c7',
          is_active: si.is_active,
          clients_using_count: si.clients_using_count ?? 0,
          is_core_channel: si.item_type === 'CHANNEL' && ['whatsapp', 'facebook', 'instagram'].includes(si.key)
        };
      });

      setItems(merged);
    } catch (err) {
      console.warn('[AdminChannels] Error loading items, using fallback:', err);
      // Fallback with all definitions
      setItems(
        CHANNEL_DEFINITIONS.map(def => {
          let item_type = 'CONNECTOR';
          if (['whatsapp', 'facebook', 'instagram', 'calls', 'google_news', 'telegram'].includes(def.key)) {
            item_type = 'CHANNEL';
          } else if (['broadcasts', 'workflows', 'automations', 'knowledge', 'crm', 'proposals', 'quotations', 'invoices', 'catalog', 'orders', 'reports', 'team'].includes(def.key)) {
            item_type = 'FEATURE';
          }
          return {
            ...def,
            item_type,
            is_active: true,
            clients_using_count: 0,
            is_core_channel: ['whatsapp', 'facebook', 'instagram'].includes(def.key)
          };
        })
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Direct Status Change (Active vs Coming Soon)
  const handleSetStatus = async (item, targetActive) => {
    if (item.is_active === targetActive) return;
    setTogglingKey(item.key);

    // Optimistic UI update
    setItems(prev =>
      prev.map(i => (i.key === item.key ? { ...i, is_active: targetActive } : i))
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/admin/channel-access/global/${item.key}/`, {
        is_active: targetActive,
        scheduled_live_at: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear cached client permissions
      try {
        localStorage.removeItem('cached_client_channels');
      } catch (e) {}

      showToast(
        targetActive 
          ? `🟢 ${item.name} activated across workspaces & mobile` 
          : `⏳ ${item.name} set to Coming Soon across workspaces & mobile`,
        targetActive ? 'success' : 'info'
      );
      
      // Dispatch events for all tabs, windows, and mobile polling
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('channelsUpdated', { detail: { key: item.key, is_active: targetActive } }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert optimistic update
      setItems(prev =>
        prev.map(i => (i.key === item.key ? { ...i, is_active: !targetActive } : i))
      );
      showToast(err?.response?.data?.error || `Failed to update ${item.name}.`, 'error');
    } finally {
      setTogglingKey(null);
    }
  };

  // Filter and Category segmentation
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchKey = item.key.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        if (!matchName && !matchKey && !matchCategory) return false;
      }

      // 2. Status Filter
      if (statusFilter === 'ACTIVE' && !item.is_active) return false;
      if (statusFilter === 'COMING_SOON' && item.is_active) return false;

      // 3. Tab Filter
      if (activeTab === 'channels' && item.item_type !== 'CHANNEL') return false;
      if (activeTab === 'connectors' && item.item_type !== 'CONNECTOR') return false;
      if (activeTab === 'features' && item.item_type !== 'FEATURE') return false;

      return true;
    });
  }, [items, searchQuery, statusFilter, activeTab]);

  // Breakdown lists for display
  const channelsList = useMemo(() => filteredItems.filter(i => i.item_type === 'CHANNEL'), [filteredItems]);
  const connectorsList = useMemo(() => filteredItems.filter(i => i.item_type === 'CONNECTOR'), [filteredItems]);
  const featuresList = useMemo(() => filteredItems.filter(i => i.item_type === 'FEATURE'), [filteredItems]);

  // Dynamic counts for tab badges
  const totalChannels = useMemo(() => items.filter(i => i.item_type === 'CHANNEL').length, [items]);
  const totalConnectors = useMemo(() => items.filter(i => i.item_type === 'CONNECTOR').length, [items]);
  const totalFeatures = useMemo(() => items.filter(i => i.item_type === 'FEATURE').length, [items]);
  const activeCount = useMemo(() => items.filter(i => i.is_active).length, [items]);
  const inactiveCount = useMemo(() => items.filter(i => !i.is_active).length, [items]);

  // ── Render Card Item (Grid View) ──
  const renderCard = (item) => {
    const isToggling = togglingKey === item.key;
    const isActive = item.is_active;

    const typeBadgeColor = 
      item.item_type === 'CHANNEL' 
        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
        : item.item_type === 'CONNECTOR' 
        ? "bg-blue-50 text-blue-700 border-blue-200/80" 
        : "bg-purple-50 text-purple-700 border-purple-200/80";

    return (
      <div
        key={item.key}
        className={cn(
          "bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md relative group",
          isActive 
            ? "border-slate-200/90 hover:border-emerald-300" 
            : "border-amber-200/90 bg-amber-50/15"
        )}
      >
        {/* Top: Brand/Feature Icon & Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              {renderItemIcon(item.key, 48)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={cn("text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider", typeBadgeColor)}>
                  {item.item_type}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight truncate" title={item.name}>
                {item.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Tagline / Description */}
        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
          {item.description || item.tagline}
        </p>

        {/* Live Client Usage & Coming Soon Banner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-slate-400 shrink-0" />
              <span className="font-bold text-slate-800">{item.clients_using_count}</span>
              <span>{item.clients_using_count === 1 ? 'client using' : 'clients using'}</span>
            </div>
            {!isActive && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Bottom Row: ONLY 2-Option Control: Active vs Coming Soon */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400">Status:</span>
          
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => handleSetStatus(item, true)}
              disabled={isToggling}
              title="Click to Activate across Web & Mobile"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-white animate-pulse" : "bg-slate-400"
              )} />
              <span>Active</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetStatus(item, false)}
              disabled={isToggling}
              title="Click to set to Coming Soon across Web & Mobile"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer select-none",
                !isActive
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
              )}
            >
              <Clock size={12} className={!isActive ? "text-white" : "text-slate-400"} />
              <span>Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render List Item (Row View) ──
  const renderListItem = (item) => {
    const isToggling = togglingKey === item.key;
    const isActive = item.is_active;

    const typeBadgeColor = 
      item.item_type === 'CHANNEL' 
        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
        : item.item_type === 'CONNECTOR' 
        ? "bg-blue-50 text-blue-700 border-blue-200/80" 
        : "bg-purple-50 text-purple-700 border-purple-200/80";

    return (
      <div
        key={item.key}
        className={cn(
          "bg-white rounded-2xl px-5 py-4 border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-slate-300 w-full",
          isActive 
            ? "border-slate-200/90" 
            : "border-amber-200 bg-amber-50/15"
        )}
      >
        {/* Left: Icon, Name & Details */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            {renderItemIcon(item.key, 44)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 truncate">
                {item.name}
              </h3>
              <span className={cn("text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider", typeBadgeColor)}>
                {item.item_type}
              </span>
              {!isActive && (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
              {item.description || item.tagline}
            </p>
          </div>
        </div>

        {/* Center: Live Client Usage */}
        <div className="flex items-center gap-2 text-xs text-slate-500 md:w-44 shrink-0">
          <Users size={14} className="text-slate-400 shrink-0" />
          <span className="font-bold text-slate-800">
            {item.clients_using_count}
          </span>
          <span>{item.clients_using_count === 1 ? 'client using' : 'clients using'}</span>
        </div>

        {/* Right: ONLY 2-Option Control: Active vs Coming Soon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => handleSetStatus(item, true)}
              disabled={isToggling}
              title="Click to Activate across Web & Mobile"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-white animate-pulse" : "bg-slate-400"
              )} />
              <span>Active</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetStatus(item, false)}
              disabled={isToggling}
              title="Click to set to Coming Soon across Web & Mobile"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer select-none",
                !isActive
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
              )}
            >
              <Clock size={12} className={!isActive ? "text-white" : "text-slate-400"} />
              <span>Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full px-4 sm:px-8 md:px-10 py-6 space-y-8 min-h-screen font-sans bg-transparent">
        
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

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Channels, Connectors & Features
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Global Platform Governance
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal max-w-3xl">
              Control the availability of Channels, External Connectors, and Core Platform Features. When an item is deactivated, it automatically switches to <strong>Coming Soon</strong> across all client web workspaces and mobile apps.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Cards / List */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => changeViewMode('cards')}
                title="Cards View"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                  viewMode === 'cards'
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => changeViewMode('list')}
                title="List View"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                  viewMode === 'list'
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <List size={14} />
                <span className="hidden sm:inline">List</span>
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

        {/* ── KPI Stat Overview Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('channels')}
            className={cn(
              "p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2",
              activeTab === 'channels' ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20" : "bg-white border-slate-200/80 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Channels</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                <MessageSquare size={16} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalChannels}</div>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                Meta, Calls, News, Telegram
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('connectors')}
            className={cn(
              "p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2",
              activeTab === 'connectors' ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-400/20" : "bg-white border-slate-200/80 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Connectors</span>
              <span className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center">
                <Layers size={16} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalConnectors}</div>
              <p className="text-[11px] font-semibold text-blue-700 mt-0.5">
                Google, Microsoft, Zoho, YouTube
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('features')}
            className={cn(
              "p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2",
              activeTab === 'features' ? "bg-purple-50/50 border-purple-300 ring-2 ring-purple-400/20" : "bg-white border-slate-200/80 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Features</span>
              <span className="w-8 h-8 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center">
                <Zap size={16} />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalFeatures}</div>
              <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
                CRM, Bots, Invoices, Team, AI
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status Summary</span>
              <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <SlidersHorizontal size={16} />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">{items.length}</span>
                <span className="text-xs font-bold text-slate-400">Total</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold mt-0.5">
                <span className="text-emerald-600">🟢 {activeCount} Active</span>
                <span className="text-slate-500">⏸️ {inactiveCount} Inactive</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Segmented Navigation Tabs & Search Toolbar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Segmented Categories Tabs: Channels, Connectors, Features */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap cursor-pointer",
                activeTab === 'all'
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>All Items</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 text-slate-700">
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap cursor-pointer",
                activeTab === 'channels'
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>💬 Channels</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                {totalChannels}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('connectors')}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap cursor-pointer",
                activeTab === 'connectors'
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>🔌 Connectors</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
                {totalConnectors}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap cursor-pointer",
                activeTab === 'features'
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>⚡ Features</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800">
                {totalFeatures}
              </span>
            </button>
          </div>

          {/* Search and Status Filters */}
          <div className="flex items-center gap-2.5 flex-1 md:justify-end">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">🟢 Active Only</option>
              <option value="COMING_SOON">⏳ Coming Soon Only</option>
            </select>
          </div>
        </div>

        {/* ── Main Content Area ── */}
        {loading ? (
          <div className="space-y-6 w-full">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse h-36" />
              ))}
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search size={22} />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">No items match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or resetting the status filter to view channels, connectors, and features.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setActiveTab('all'); }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12 w-full">
            
            {/* ── SECTION 1: CHANNELS ── */}
            {(activeTab === 'all' || activeTab === 'channels') && channelsList.length > 0 && (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                      Communication Channels
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {channelsList.length}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Meta Messaging, Audio/Video Calling, Telegram & News
                  </span>
                </div>

                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {channelsList.map(renderCard)}
                  </div>
                ) : (
                  <div className="space-y-2.5 w-full">
                    {channelsList.map(renderListItem)}
                  </div>
                )}
              </div>
            )}

            {/* ── SECTION 2: CONNECTORS ── */}
            {(activeTab === 'all' || activeTab === 'connectors') && connectorsList.length > 0 && (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
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
                    Google Workspace, Microsoft 365, Zoho CRM & YouTube
                  </span>
                </div>

                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                    {connectorsList.map(renderCard)}
                  </div>
                ) : (
                  <div className="space-y-2.5 w-full">
                    {connectorsList.map(renderListItem)}
                  </div>
                )}
              </div>
            )}

            {/* ── SECTION 3: FEATURES ── */}
            {(activeTab === 'all' || activeTab === 'features') && featuresList.length > 0 && (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                      Core Platform Features
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                      {featuresList.length}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    CRM, Automations, Proposals, Invoices, AI Knowledge & Team RBAC
                  </span>
                </div>

                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {featuresList.map(renderCard)}
                  </div>
                ) : (
                  <div className="space-y-2.5 w-full">
                    {featuresList.map(renderListItem)}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

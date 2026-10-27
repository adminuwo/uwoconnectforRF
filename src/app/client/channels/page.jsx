'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  Settings,
  RefreshCw,
  Plus,
  Sparkles,
  Lock,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  CreditCard,
  Zap,
  FileText,
  FileSpreadsheet,
  Award,
  ShoppingBag,
  Users,
  PhoneCall,
  MessageSquare,
  MapPin,
  Briefcase,
  Bot
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { CHANNEL_DEFINITIONS, getChannelAccessState } from '@/config/channelsConfig';
import ComingSoonChannelModal from '@/components/channels/ComingSoonChannelModal';
import ZohoConfigModal, { ZohoIcon } from '@/components/channels/ZohoConfigModal';
import RazorpayConfigModal from '@/components/channels/RazorpayConfigModal';
import WhatsAppConfigModal from '@/components/channels/WhatsAppConfigModal';
import FacebookConfigModal from '@/components/channels/FacebookConfigModal';
import InstagramConfigModal from '@/components/channels/InstagramConfigModal';
import OneDriveConfigModal, { OneDriveIcon } from '@/components/channels/OneDriveConfigModal';
import GoogleCalendarConfigModal, { GoogleCalendarIcon } from '@/components/channels/GoogleCalendarConfigModal';
import GoogleSheetsConfigModal, { GoogleSheetsIcon } from '@/components/channels/GoogleSheetsConfigModal';
import GoogleDocsConfigModal, { GoogleDocsIcon } from '@/components/channels/GoogleDocsConfigModal';
import GoogleSlidesConfigModal, { GoogleSlidesIcon } from '@/components/channels/GoogleSlidesConfigModal';
import GoogleDriveConfigModal, { GoogleDriveIcon } from '@/components/channels/GoogleDriveConfigModal';
import GoogleNewsConfigModal, { GoogleNewsIcon } from '@/components/channels/GoogleNewsConfigModal';
import OutlookConfigModal, { OutlookIcon } from '@/components/channels/OutlookConfigModal';
import YouTubeConfigModal, { YouTubeBrandIcon } from '@/components/channels/YouTubeConfigModal';
import GmailConfigModal from '@/components/channels/GmailConfigModal';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import { useTheme } from '@/context/ThemeContext';

// ═════════════════════════════════════════════════════════════════════════════════
// ── AUTHENTIC BRAND VECTOR ICONS ──
// ═════════════════════════════════════════════════════════════════════════════════

const WhatsAppBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white" />
  </svg>
);

const FacebookBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white" />
  </svg>
);

const InstagramBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="igClientGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igClientGrad)" />
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="31.5" cy="16.5" r="1.75" fill="white" />
  </svg>
);

const GmailBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4" />
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853" />
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335" />
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F" />
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04" />
  </svg>
);

const GoogleMapsBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 4C15.2 4 8 11.2 8 20C8 32 24 44 24 44C24 44 40 32 40 20C40 11.2 32.8 4 24 4Z" fill="#EA4335" />
    <circle cx="24" cy="20" r="8" fill="#FFFFFF" />
    <circle cx="24" cy="20" r="5" fill="#4285F4" />
  </svg>
);

export const RazorpayBrandIcon = ({ size = 28, isDark = undefined, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Razorpay"
  >
    {/* Razorpay Brand Icon: Official two-tone slash */}
    <path
      d="M22.436 0L10.526 7.773L9.352 12.049L15.977 7.752L11.65 24H16.041L22.436 0Z"
      fill={isDark === true ? "#60A5FA" : isDark === false ? "#0C2451" : undefined}
      className={isDark === undefined ? "fill-[#0C2451] dark:fill-[#60A5FA]" : undefined}
    />
    <path
      d="M14.26 10.098L3.389 17.166L1.564 24H10.572L14.26 10.098Z"
      fill={isDark === true ? "#38BDF8" : isDark === false ? "#0C83FE" : undefined}
      className={isDark === undefined ? "fill-[#0C83FE] dark:fill-[#38BDF8]" : undefined}
    />
  </svg>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className="p-1 text-slate-300 hover:text-slate-600 rounded transition-colors cursor-pointer shrink-0"
    >
      {copied ? <Check size={12} className="text-emerald-600 stroke-[2.5]" /> : <Copy size={12} />}
    </button>
  );
};

const ClientChannelsPage = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [client, setClient] = useState(null);
  const [activePlans, setActivePlans] = useState([]);
  const [razorpayConn, setRazorpayConn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Modals state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFacebookConfigModalOpen, setIsFacebookConfigModalOpen] = useState(false);
  const [isInstagramConfigModalOpen, setIsInstagramConfigModalOpen] = useState(false);
  const [isOneDriveConfigModalOpen, setIsOneDriveConfigModalOpen] = useState(false);
  const [isGoogleCalendarConfigModalOpen, setIsGoogleCalendarConfigModalOpen] = useState(false);
  const [isGoogleSheetsConfigModalOpen, setIsGoogleSheetsConfigModalOpen] = useState(false);
  const [isGoogleDocsConfigModalOpen, setIsGoogleDocsConfigModalOpen] = useState(false);
  const [isGoogleSlidesConfigModalOpen, setIsGoogleSlidesConfigModalOpen] = useState(false);
  const [isGoogleDriveConfigModalOpen, setIsGoogleDriveConfigModalOpen] = useState(false);
  const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);
  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);
  const [isYouTubeConfigModalOpen, setIsYouTubeConfigModalOpen] = useState(false);
  const [isOutlookConfigOpen, setIsOutlookConfigOpen] = useState(false);
  const [isGmailConfigModalOpen, setIsGmailConfigModalOpen] = useState(false);
  const [isRazorpayConfigModalOpen, setIsRazorpayConfigModalOpen] = useState(false);
  const [razorpayGatewayStatus, setRazorpayGatewayStatus] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [comingSoonModalChannel, setComingSoonModalChannel] = useState(null);

  const [fbLoading, setFbLoading] = useState(false);
  const [igLoading, setIgLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [waConnecting, setWaConnecting] = useState(false);
  const sessionInfoRef = React.useRef({ waba_id: null, phone_number_id: null });
  const popupRef = React.useRef(null);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOutlookConfigOpen(true);
    };
    window.addEventListener('open-email-modal', handleOpenModal);

    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('channel=outlook')) {
        setIsOutlookConfigOpen(true);
      } else if (search.includes('channel=gmail')) {
        setIsGmailConfigModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener('open-email-modal', handleOpenModal);
    };
  }, []);

  const fetchClient = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : null;
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch client profile, global connectors status, effective connectors & active plans concurrently
      const [profileRes, globalRes, connRes, plansRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }),
        axios.get(`${API_BASE_URL}/api/connectors/global-status/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }),
        axios.get(`${API_BASE_URL}/api/connectors/effective/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }),
        axios.get(`${API_BASE_URL}/api/plans/`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        })
      ]);

      // Check client Razorpay Gateway Status
      axios.get(`${API_BASE_URL}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      }).then(res => {
        if (res.data) setRazorpayGatewayStatus(res.data);
      }).catch(() => {});

      if (plansRes.status === 'fulfilled' && plansRes.value?.data) {
        const plansData = plansRes.value.data.results || (Array.isArray(plansRes.value.data) ? plansRes.value.data : []);
        setActivePlans(plansData.filter(p => p.status === 'ACTIVE' || p.is_active !== false));
      }

      let baseClient = {};
      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const pData = profileRes.value.data.client || profileRes.value.data;
        if (pData && typeof pData === 'object') {
          baseClient = { ...pData };
        }
      }

      let liveGlobalMap = {};
      if (globalRes.status === 'fulfilled' && globalRes.value?.data?.global_connectors) {
        liveGlobalMap = globalRes.value.data.global_connectors;
      } else if (profileRes.status === 'fulfilled' && profileRes.value?.data?.global_connectors) {
        liveGlobalMap = profileRes.value.data.global_connectors;
      }

      let effMap = {};
      if (connRes.status === 'fulfilled' && connRes.value?.data?.effective_connectors) {
        const eff = connRes.value.data.effective_connectors;
        Object.keys(eff).forEach(k => {
          effMap[k] = eff[k].effective_access;
          if (liveGlobalMap[k] === undefined && eff[k].global_active !== undefined) {
            liveGlobalMap[k] = eff[k].global_active;
          }
        });
      }

      setClient(prev => {
        const merged = {
          ...(prev || {}),
          ...baseClient,
          global_connectors: liveGlobalMap,
          effective_connectors: effMap
        };
        try {
          localStorage.setItem('cached_client_channels', JSON.stringify(merged));
        } catch (e) { }
        return merged;
      });

      if (isManualRefresh) {
        setToast({ msg: 'Channels updated', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.warn('Failed to fetch client profile', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper function to save WhatsApp credentials to the backend
  const saveWhatsAppCredentials = async (code, explicitWabaId, explicitPhoneId) => {
    const waba_id = explicitWabaId || sessionInfoRef.current?.waba_id;
    const phone_number_id = explicitPhoneId || sessionInfoRef.current?.phone_number_id;
    if (!code && !waba_id && !phone_number_id) return;
    setWaConnecting(true);
    setToast({ msg: 'Saving WhatsApp configuration & credentials...', type: 'success' });
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
      const redirect_uri = `${origin}/client/channels`;

      const res = await axios.post(`${API_BASE_URL}/api/auth/whatsapp/embedded-signup`, {
        code,
        waba_id,
        phone_number_id,
        redirect_uri: redirect_uri
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.whatsapp_config) {
        setClient(prev => ({
          ...(prev || {}),
          ...res.data.whatsapp_config,
          whatsapp_enabled: true
        }));
      }
      await fetchClient();
      setToast({ msg: '✅ WhatsApp Business connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error('[WhatsApp Embedded Signup Error]:', err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.details?.error?.message || 'Failed to complete WhatsApp connection';
      setToast({ msg: errMsg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setWaConnecting(false);
    }
  };

  // Helper function to save Facebook credentials to the backend via 1-Click Embedded Signup
  const saveFacebookCredentials = async (code) => {
    if (!code) return;
    setFbLoading(true);
    setToast({ msg: 'Connecting Facebook Page...', type: 'success' });
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : null;
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
      const redirect_uri = `${origin}/client/channels`;

      const res = await axios.post(`${API_BASE_URL}/api/auth/facebook/embedded-signup`, {
        code,
        redirect_uri
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.facebook_config) {
        setClient(prev => ({
          ...(prev || {}),
          facebook_config: res.data.facebook_config,
          facebook_enabled: true
        }));
      }
      await fetchClient();
      setToast({ msg: '✅ Facebook Page connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error('[Facebook Embedded Signup Error]:', err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.details?.error?.message || 'Failed to complete Facebook connection';
      setToast({ msg: errMsg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setFbLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    try {
      const cached = localStorage.getItem('cached_client_channels');
      if (cached) {
        setClient(JSON.parse(cached));
        setLoading(false);
      }
    } catch (e) { }

    fetchClient();

    // Real-time synchronization with Admin toggles
    const handleSync = () => {
      fetchClient();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('channelsUpdated', handleSync);

    // Periodic live sync every 25 seconds
    const interval = setInterval(() => {
      fetchClient();
    }, 25000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('channelsUpdated', handleSync);
      clearInterval(interval);
    };
  }, []);

  // Facebook JS SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1675703437621442',
        cookie: true,
        xfbml: true,
        version: 'v22.0'
      });
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    } else if (window.FB) {
      window.FB.init({
        appId: '1675703437621442',
        cookie: true,
        xfbml: true,
        version: 'v22.0'
      });
    }
  }, []);

  // OAuth & Meta Embedded Signup callback handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    // Gmail callback
    if (params.get('gmail_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Gmail connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('gmail_error')) {
      setToast({ msg: `Gmail connection failed: ${params.get('gmail_error')}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // OneDrive callback
    else if (params.get('onedrive_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ OneDrive connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('onedrive_error')) {
      setToast({ msg: `OneDrive connection failed: ${params.get('onedrive_error')}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Calendar callback
    else if (params.get('google_calendar_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Google Calendar connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('google_calendar_error')) {
      setToast({ msg: `Google Calendar connection failed: ${params.get('google_calendar_error')}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Sheets callback
    else if (params.get('google_sheets_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Google Sheets connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('google_sheets_error')) {
      setToast({ msg: `Google Sheets connection failed: ${params.get('google_sheets_error')}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Docs callback
    else if (params.get('gdocs_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Google Docs connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('gdocs_error')) {
      const err = params.get('gdocs_error');
      const msg = err === 'access_denied' ? 'Google Docs permission was cancelled.' : `Google Docs connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Slides callback
    else if (params.get('gslides_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Google Slides connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('gslides_error')) {
      const err = params.get('gslides_error');
      const msg = err === 'access_denied' ? 'Google Slides permission was cancelled.' : `Google Slides connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // YouTube callback
    else if (params.get('youtube_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ YouTube channel connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('youtube_error')) {
      const err = params.get('youtube_error');
      const msg = err === 'access_denied' ? 'YouTube permission was cancelled.' : `YouTube connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Drive callback
    else if (params.get('gdrive_connected') === 'true' || params.get('google_drive_connected') === 'true') {
      fetchClient();
      setToast({ msg: '✅ Google Drive connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('gdrive_error') || params.get('google_drive_error')) {
      const err = params.get('gdrive_error') || params.get('google_drive_error');
      const msg = err === 'access_denied' ? 'Google Drive permission was cancelled.' : `Google Drive connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Microsoft Outlook OAuth callback
    else if (params.get('outlook_connected') === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchClient();
      setToast({ msg: '✅ Microsoft Outlook connected successfully!', type: 'success' });
      setTimeout(() => setToast(null), 4000);
    } else if (params.get('outlook_error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const err = params.get('outlook_error');
      const msg = err === 'access_denied' ? 'Outlook permission was cancelled.' : `Outlook connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    }

    // ── Meta Embedded Signup / OAuth callback for WhatsApp & Instagram ──
    if (code) {
      let pendingChannel = null;
      try {
        pendingChannel = sessionStorage.getItem('pending_oauth_channel');
      } catch (e) { }

      if (state === 'whatsapp' || pendingChannel === 'whatsapp') {
        try { sessionStorage.removeItem('pending_oauth_channel'); } catch (e) { }

        // If loaded inside a popup window, relay the code to the parent dashboard immediately and close!
        if (typeof window !== 'undefined' && window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({
              type: 'UWO_WHATSAPP_CODE',
              code: code,
              state: 'whatsapp'
            }, '*');
          } catch (e) { }
          setTimeout(() => {
            window.close();
          }, 600);
          return;
        }

        saveWhatsAppCredentials(code);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (state === 'facebook' || pendingChannel === 'facebook') {
        try { sessionStorage.removeItem('pending_oauth_channel'); } catch (e) { }

        // If loaded inside a popup window, relay the code to the parent dashboard immediately and close!
        if (typeof window !== 'undefined' && window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({
              type: 'UWO_FACEBOOK_CODE',
              code: code,
              state: 'facebook'
            }, '*');
          } catch (e) { }
          setTimeout(() => {
            window.close();
          }, 600);
          return;
        }

        saveFacebookCredentials(code);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (state === 'instagram' || pendingChannel === 'instagram') {
        try { sessionStorage.removeItem('pending_oauth_channel'); } catch (e) { }
        setToast({ msg: 'Connecting Instagram...', type: 'success' });
        const connectInstagram = async () => {
          try {
            const token = typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : null;
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnectforrf-743928421487.asia-south1.run.app';
            await axios.post(`${API_BASE_URL}/api/auth/instagram/embedded-signup`,
              { code: code, redirect_uri: redirectUri },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchClient();
            setToast({ msg: 'Instagram connected successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
          } catch (err) {
            console.error("Error connecting Instagram", err);
            setToast({ msg: err.response?.data?.error || err.response?.data?.details?.error_message || 'Failed to connect Instagram', type: 'error' });
            setTimeout(() => setToast(null), 4000);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };
        connectInstagram();
      } else {
        // Fallback: If code is returned without state, process for WhatsApp Embedded Signup
        if (typeof window !== 'undefined' && window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({
              type: 'UWO_WHATSAPP_CODE',
              code: code,
              state: 'whatsapp'
            }, '*');
          } catch (e) { }
          setTimeout(() => {
            window.close();
          }, 600);
          return;
        }
        saveWhatsAppCredentials(code);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Listen for Meta Embedded Signup postMessage events from popup
    const handleMetaMessage = (event) => {
      // 1. WhatsApp connected notification from popup
      if (event.data?.type === 'UWO_WHATSAPP_CONNECTED') {
        fetchClient();
        setToast({ msg: '✅ WhatsApp Business connected successfully!', type: 'success' });
        setTimeout(() => setToast(null), 4000);
        return;
      }

      // 2. Authorization code relayed from redirect_uri popup
      if (event.data?.type === 'UWO_WHATSAPP_CODE' && event.data?.code) {
        saveWhatsAppCredentials(event.data.code);
        return;
      }

      // 2b. Facebook authorization code relayed from redirect_uri popup
      if (event.data?.type === 'UWO_FACEBOOK_CODE' && event.data?.code) {
        if (popupRef.current && !popupRef.current.closed) {
          try { popupRef.current.close(); } catch (e) { }
        }
        saveFacebookCredentials(event.data.code);
        return;
      }

      // 3. Session info & auto-finish from Meta Embedded Signup iframe/popup
      if (
        event.origin !== 'https://www.facebook.com' &&
        event.origin !== 'https://web.facebook.com' &&
        event.origin !== 'https://business.facebook.com'
      ) {
        return;
      }
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && (data.type === 'WA_EMBEDDED_SIGNUP' || data.event === 'FINISH' || data.event === 'FINISH_ALL')) {
          console.log('[Meta Embedded Signup Session Info]:', data);
          const phone_number_id = data?.data?.phone_number_id || data?.phone_number_id;
          const waba_id = data?.data?.waba_id || data?.waba_id;
          const directCode = data?.data?.code || data?.code;

          if (waba_id) sessionInfoRef.current.waba_id = waba_id;
          if (phone_number_id) sessionInfoRef.current.phone_number_id = phone_number_id;

          // Auto-close popup once user completes setup
          if (popupRef.current && !popupRef.current.closed) {
            try { popupRef.current.close(); } catch (e) { }
          }

          // Trigger saving WhatsApp credentials immediately to update dashboard!
          saveWhatsAppCredentials(directCode || null, waba_id, phone_number_id);
        }
      } catch (err) {
        // Non-JSON message from other extensions or iframes, ignore
      }
    };
    window.addEventListener('message', handleMetaMessage);

    return () => {
      window.removeEventListener('message', handleMetaMessage);
    };
  }, []);

  const handleWhatsAppSaved = (updatedClient) => {
    if (updatedClient) {
      setClient(prev => ({ ...(prev || {}), ...updatedClient }));
    }
    fetchClient();
    setToast({ msg: 'WhatsApp profile and configuration updated!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClientUpdate = (updatedClient, successMsg) => {
    const data = updatedClient?.client || updatedClient;
    if (data && typeof data === 'object' && (data.id || data._id || data.workspace_name)) {
      setClient(prev => ({ ...prev, ...data }));
    }
    fetchClient(true);
    if (successMsg) {
      setToast({ msg: successMsg, type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleZohoSaved = (updatedClient) => {
    setIsZohoConfigModalOpen(false);
    handleClientUpdate(updatedClient, 'Zoho configuration saved!');
  };

  const handleFacebookSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Facebook configured');
  const handleInstagramSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Instagram configured');
  const handleOneDriveSaved = (updatedClient) => handleClientUpdate(updatedClient, 'OneDrive configured');
  const handleGoogleCalendarSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Google Calendar configured');
  const handleGoogleSheetsSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Google Sheets configured');
  const handleGoogleDocsSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Google Docs configured');
  const handleGoogleSlidesSaved = (updatedClient) => handleClientUpdate(updatedClient, 'Google Slides configured');

  // Connection state checks
  const isWhatsAppConnected = Boolean(
    client?.whatsapp_enabled &&
    (client?.whatsapp_phone_number_id || client?.whatsapp_config?.phone_number_id) &&
    (client?.whatsapp_waba_id || client?.whatsapp_config?.waba_id)
  );
  const isFacebookConnected = Boolean((client?.facebook_config?.page_id || client?.facebook_config?.access_token) && client?.facebook_enabled !== false);
  const isInstagramConnected = Boolean(client?.instagram_enabled || client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id || client?.instagram_config?.access_token || client?.instagram_config?.username);
  const isGmailConnected = Boolean(client?.gmail_enabled || client?.gmail_config?.email_address || client?.gmail_config?.email || client?.gmail_config?.token || client?.gmail_config?.access_token);
  const isOutlookConnected = Boolean(client?.outlook_enabled || client?.outlook_config?.email_address || client?.outlook_config?.access_token);
  const isOneDriveConnected = Boolean(client?.onedrive_enabled || client?.onedrive_config?.access_token || client?.onedrive_config?.user_id || client?.onedrive_config?.account_name || client?.onedrive_config?.drive_id);
  const isGoogleCalendarConnected = Boolean(client?.google_calendar_enabled || client?.google_calendar_config?.calendar_id || client?.google_calendar_config?.primary_calendar_id || client?.google_calendar_config?.access_token || client?.google_calendar_config?.account_email);
  const isGoogleSheetsConnected = Boolean(client?.google_sheets_enabled || client?.google_sheets_config?.spreadsheet_id || client?.google_sheets_config?.access_token || client?.google_sheets_config?.account_email);
  const isGoogleDocsConnected = Boolean(client?.google_docs_enabled || client?.google_docs_config?.document_id || client?.google_docs_config?.default_doc_id || client?.google_docs_config?.access_token || client?.google_docs_config?.account_email);
  const isGoogleSlidesConnected = Boolean(client?.google_slides_enabled || client?.google_slides_config?.presentation_id || client?.google_slides_config?.default_presentation_id || client?.google_slides_config?.access_token || client?.google_slides_config?.account_email);
  const isGoogleDriveConnected = Boolean(client?.google_drive_enabled || client?.google_drive_config?.connected || client?.google_drive_config?.access_token);
  const isGoogleNewsConnected = Boolean(client?.google_news_enabled || client?.google_news_config?.topic || client?.google_news_config?.query);
  const isGoogleMapsConnected = Boolean(client?.google_maps_enabled || client?.google_maps_config?.api_key || client?.google_maps_config?.place_id);
  const isYouTubeConnected = Boolean(client?.youtube_enabled || client?.youtube_config?.channel_id || client?.youtube_config?.access_token || client?.youtube_config?.channel_title);
  const isZohoConnected = Boolean(client?.zoho_enabled || client?.zoho_config?.access_token || client?.zoho_config?.refresh_token);
  const isRazorpayConnected = Boolean(
    razorpayGatewayStatus?.connected ||
    razorpayGatewayStatus?.connection_status === 'CONNECTED' ||
    client?.razorpay_enabled ||
    client?.razorpay_config?.api_key ||
    client?.razorpay_config?.key_id
  );

  // Connect actions
  const handleConnectGmail = () => {
    setIsGmailConfigModalOpen(true);
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/auth/google-calendar/connect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setIsGoogleCalendarConfigModalOpen(true);
    }
  };

  const handleWhatsAppConnect = () => {
    if (typeof window === 'undefined') return;

    const appId = '1675703437621442';
    const configId = '2652244361881214';

    try {
      sessionStorage.setItem('pending_oauth_channel', 'whatsapp');
    } catch (e) { }

    setToast({ msg: 'Opening WhatsApp Business 1-Click Onboarding...', type: 'success' });

    const isHttps = window.location.protocol === 'https:';

    // Official Meta JavaScript SDK Embedded Signup flow (if running on HTTPS with FB SDK initialized)
    if (isHttps && window.FB) {
      try {
        window.FB.login(
          (response) => {
            if (response?.authResponse?.code) {
              console.log('[FB.login Code Captured]:', response.authResponse.code);
              saveWhatsAppCredentials(response.authResponse.code);
            } else {
              console.log('[FB.login response]:', response);
            }
          },
          {
            config_id: configId,
            response_type: 'code',
            override_default_response_type: true,
            extras: {
              version: 'v4',
              sessionInfoVersion: '3',
              featureType: 'whatsapp_business_app_onboarding'
            }
          }
        );
        return;
      } catch (err) {
        console.warn('[FB.login error, falling back to Meta-hosted onboarding]:', err);
      }
    }

    // Official Meta-Hosted WhatsApp Onboarding URL
    const extrasObj = {
      version: 'v4',
      sessionInfoVersion: '3',
      featureType: 'whatsapp_business_app_onboarding'
    };
    const extras = encodeURIComponent(JSON.stringify(extrasObj));

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
    const targetRedirectUri = `${origin}/client/channels`;
    const redirectUri = encodeURIComponent(targetRedirectUri);

    const onboardUrl = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=${appId}&config_id=${configId}&extras=${extras}&redirect_uri=${redirectUri}&state=whatsapp`;

    const width = 640;
    const height = 750;
    const left = Math.max(0, Math.round((window.innerWidth - width) / 2 + (window.screenX || window.screenLeft || 0)));
    const top = Math.max(0, Math.round((window.innerHeight - height) / 2 + (window.screenY || window.screenTop || 0)));

    const popup = window.open(
      onboardUrl,
      'WhatsAppOnboarding',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes,location=no`
    );
    popupRef.current = popup;

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = onboardUrl;
    }
  };

  const handleFacebookConnect = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
    const redirectUri = `${origin}/client/channels`;
    const appId = '1675703437621442';
    const scope = 'pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata';

    try {
      sessionStorage.setItem('pending_oauth_channel', 'facebook');
    } catch (e) { }

    const oauthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=facebook`;

    const width = 640;
    const height = 750;
    const left = Math.max(0, Math.round((window.innerWidth - width) / 2 + (window.screenX || window.screenLeft || 0)));
    const top = Math.max(0, Math.round((window.innerHeight - height) / 2 + (window.screenY || window.screenTop || 0)));

    const popup = window.open(
      oauthUrl,
      'FacebookLoginForBusiness',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes,location=no`
    );
    popupRef.current = popup;

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = oauthUrl;
    }
  };

  const handleInstagramConnect = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnectforrf-743928421487.asia-south1.run.app';
    const redirectUri = encodeURIComponent(`${origin}/client/channels`);
    const instagramOAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1761486008404014&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=instagram`;
    window.location.href = instagramOAuthUrl;
  };

  const openComingSoon = (channelDef) => {
    setComingSoonModalChannel(channelDef);
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="w-full pb-16 px-3 sm:px-6 lg:px-8 relative font-sans space-y-6 sm:space-y-10">

        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/50 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* ── Top Header Section ── */}
        <div className={cn(
          "py-3 sm:py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-colors",
          isDark ? "border-slate-800" : "border-slate-100"
        )}>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className={cn("text-lg sm:text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Channels & Integrations
              </h1>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0",
                isDark ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}>
                Official APIs
              </span>
            </div>
            <p className={cn("text-xs font-normal max-w-2xl", isDark ? "text-slate-400" : "text-slate-500")}>
              Connect official Meta messaging channels, automate inbound customer inquiries with AI, and manage team communication.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <div className={cn(
              "px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-slate-100/80 border-slate-200/80 text-slate-600"
            )}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={cn("font-semibold text-[11px]", isDark ? "text-slate-300" : "text-slate-600")}>
                <strong className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {[
                    isWhatsAppConnected,
                    isFacebookConnected,
                    isInstagramConnected
                  ].filter(Boolean).length}
                </strong> / 3 Channels Live
              </span>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer border",
                isDark ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" : "bg-slate-900 hover:bg-slate-800 text-white border-transparent"
              )}
              title="Open Connectors & Integrations Master Guide"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Guide</span>
            </button>

            <button
              onClick={() => fetchClient(true)}
              disabled={refreshing}
              className={cn(
                "p-2 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50 border",
                isDark
                  ? "text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700"
                  : "text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border-slate-200/80"
              )}
              title="Refresh Status"
            >
              <RefreshCw size={14} className={cn(refreshing && "animate-spin text-emerald-600")} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {(!isMounted || loading) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-50/80 rounded-3xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-300">

            {/* ================= 1. ACTIVE CORE MESSAGING CHANNELS ================= */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 shrink-0" />
                  <h2 className={cn("text-xs sm:text-sm font-extrabold uppercase tracking-wider", isDark ? "text-white" : "text-slate-800")}>
                    Communication Channels
                  </h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0",
                    isDark ? "bg-emerald-950/70 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}>
                    4 Channels
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Automated by UWO AI Agent & Bot Dispatcher
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* ── CARD 1: WHATSAPP BUSINESS ── */}
                {(() => {
                  const state = getChannelAccessState('whatsapp', client, activePlans);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const hasPhoneId = Boolean(client?.whatsapp_phone_number_id || client?.whatsapp_config?.phone_number_id);
                  const hasWaba = Boolean(client?.whatsapp_waba_id || client?.whatsapp_config?.waba_id);
                  const isConn = state.status === 'CONNECTED' && !isComingSoon && hasPhoneId && hasWaba;

                  return (
                    <div className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon
                        ? (isDark ? "border-amber-800/80 bg-amber-950/20" : "border-amber-200/80 bg-amber-50/15")
                        : (isDark ? "bg-[#0f172a] border-slate-800 hover:border-emerald-500/40 shadow-xl" : "bg-white border-slate-200/90 hover:border-emerald-300")
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <WhatsAppBrandIcon size={30} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                WhatsApp Business
                              </h3>
                              <span className={cn(
                                "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5",
                                isDark ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              )}>
                                Cloud API
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isComingSoon ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-amber-950/70 text-amber-300 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200"
                              )}>
                                <Sparkles size={10} /> Soon
                              </span>
                            ) : isConn ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-emerald-950/70 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-slate-800/80 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                          Official Meta Cloud API. Connect your business phone number to send broadcast campaigns, auto-reply bots & live inbox support.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className={cn(
                            "p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-xs space-y-1 mb-3 sm:mb-4",
                            isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-200" : "bg-amber-50/70 border-amber-200/60 text-amber-900"
                          )}>
                            <div className={cn("font-bold flex items-center gap-1.5 text-[11px]", isDark ? "text-amber-300" : "text-amber-950")}>
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className={cn("text-[10px] leading-relaxed font-medium", isDark ? "text-amber-300/80" : "text-amber-800")}>
                              {state.reason || 'This channel is deactivated by admin and will be enabled shortly.'}
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className={cn(
                            "space-y-2 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl text-xs mb-3 sm:mb-4 border transition-colors",
                            isDark ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-slate-50/80 border-slate-100 text-slate-700"
                          )}>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Number</span>
                              <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>{client?.phone_number || client?.whatsapp_config?.display_phone_number || 'Live Connected'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Phone ID</span>
                              <span className={cn("font-mono font-semibold flex items-center gap-1", isDark ? "text-slate-200" : "text-slate-700")}>
                                <span>{client?.whatsapp_phone_number_id || 'Configured'}</span>
                                {client?.whatsapp_phone_number_id && <CopyButton text={client.whatsapp_phone_number_id} />}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">WABA ID</span>
                              <span className={cn("font-mono font-semibold flex items-center gap-1", isDark ? "text-slate-200" : "text-slate-700")}>
                                <span>{client?.whatsapp_waba_id || 'Configured'}</span>
                                {client?.whatsapp_waba_id && <CopyButton text={client.whatsapp_waba_id} />}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Token</span>
                              <span className={cn(
                                "font-bold text-[10px] px-2 py-0.5 rounded-md border",
                                isDark ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              )}>
                                Permanent Token Active
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                              <span className={cn("font-bold flex items-center gap-1", isDark ? "text-emerald-400" : "text-emerald-600")}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Ready
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "space-y-1.5 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-[11px] font-medium border",
                            isDark ? "bg-slate-800/40 border-slate-700/80 text-slate-300" : "bg-emerald-50/40 border-emerald-100/60 text-slate-600"
                          )}>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                              <span>WhatsApp Cloud API Direct Credentials</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                              <span>Instant Phone Number Verification</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-1 sm:pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'WhatsApp Business', key: 'whatsapp' })}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm cursor-pointer",
                              isDark ? "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800" : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                            )}
                          >
                            <Clock size={13} className={isDark ? "text-amber-400" : "text-amber-700"} />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-sm",
                              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                            )}
                          >
                            <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                            <span>Configure WhatsApp</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleWhatsAppConnect}
                              disabled={waConnecting}
                              className="flex-1 py-2 sm:py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-60"
                            >
                              <WhatsAppBrandIcon size={16} />
                              <span>{waConnecting ? 'Connecting...' : 'Connect WhatsApp (1-Click)'}</span>
                            </button>
                            <button
                              onClick={() => setIsConfigModalOpen(true)}
                              title="Configure / Manual Credentials"
                              className={cn(
                                "py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer border",
                                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                              )}
                            >
                              <Settings size={14} />
                            </button>
                            <Link
                              href="/client/plans"
                              title={`Included in ${state.requiredPlanName}`}
                              className={cn(
                                "flex-1 py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border",
                                isDark ? "bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80"
                              )}
                            >
                              <Layers size={13} className="text-emerald-500 shrink-0" />
                              <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 2: FACEBOOK MESSENGER ── */}
                {(() => {
                  const state = getChannelAccessState('facebook', client, activePlans);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon
                        ? (isDark ? "border-amber-800/80 bg-amber-950/20" : "border-amber-200/80 bg-amber-50/15")
                        : (isDark ? "bg-[#0f172a] border-slate-800 hover:border-blue-400/50 shadow-xl" : "bg-white border-slate-200/90 hover:border-blue-300")
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <FacebookBrandIcon size={30} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                Facebook
                              </h3>
                              <span className={cn(
                                "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5",
                                isDark ? "bg-blue-950/70 text-blue-300 border-blue-800/60" : "bg-blue-50 text-blue-700 border-blue-200/60"
                              )}>
                                Page Messenger
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isComingSoon ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-amber-950/70 text-amber-300 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200"
                              )}>
                                <Sparkles size={10} /> Soon
                              </span>
                            ) : isConn ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-blue-950/70 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-slate-800/80 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                          Connect official Facebook Business Pages to automate Messenger interactions, capture inbound leads, and answer FAQs.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className={cn(
                            "p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-xs space-y-1 mb-3 sm:mb-4",
                            isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-200" : "bg-amber-50/70 border-amber-200/60 text-amber-900"
                          )}>
                            <div className={cn("font-bold flex items-center gap-1.5 text-[11px]", isDark ? "text-amber-300" : "text-amber-950")}>
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className={cn("text-[10px] leading-relaxed font-medium", isDark ? "text-amber-300/80" : "text-amber-800")}>
                              {state.reason || 'This channel is deactivated by admin and will be enabled shortly.'}
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className={cn(
                            "space-y-2 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl text-xs mb-3 sm:mb-4 border transition-colors",
                            isDark ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-slate-50/80 border-slate-100 text-slate-700"
                          )}>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Page Name</span>
                              <span className={cn("font-bold truncate max-w-[150px]", isDark ? "text-white" : "text-slate-800")}>{client?.facebook_config?.page_name || 'Facebook Page'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                              <span className="font-bold text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Sync
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "space-y-1.5 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-[11px] font-medium border",
                            isDark ? "bg-slate-800/40 border-slate-700/80 text-slate-300" : "bg-blue-50/40 border-blue-100/60 text-slate-600"
                          )}>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                              <span>Facebook Page Messenger Sync</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                              <span>Instant Lead Capture & FAQ Bot</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-1 sm:pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'Facebook Messenger', key: 'facebook' })}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm cursor-pointer",
                              isDark ? "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800" : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                            )}
                          >
                            <Clock size={13} className={isDark ? "text-amber-400" : "text-amber-700"} />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsFacebookConfigModalOpen(true)}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-sm",
                              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                            )}
                          >
                            <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                            <span>Configure Facebook</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleFacebookConnect}
                              disabled={fbLoading}
                              className="flex-1 py-2 sm:py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-60"
                            >
                              {fbLoading ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  <span>Connecting...</span>
                                </>
                              ) : (
                                <>
                                  <FacebookBrandIcon size={16} />
                                  <span>Connect Facebook</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setIsFacebookConfigModalOpen(true)}
                              title="Manual Settings"
                              className={cn(
                                "p-2 sm:p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center border shrink-0 cursor-pointer shadow-xs",
                                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                              )}
                            >
                              <Settings size={14} />
                            </button>
                            <Link
                              href="/client/plans"
                              title={`Included in ${state.requiredPlanName}`}
                              className={cn(
                                "py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border shrink-0",
                                isDark ? "bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border-blue-800/60" : "bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30"
                              )}
                            >
                              <Layers size={13} className="text-blue-400 shrink-0" />
                              <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 3: INSTAGRAM DIRECT ── */}
                {(() => {
                  const state = getChannelAccessState('instagram', client, activePlans);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon
                        ? (isDark ? "border-amber-800/80 bg-amber-950/20" : "border-amber-200/80 bg-amber-50/15")
                        : (isDark ? "bg-[#0f172a] border-slate-800 hover:border-pink-400/50 shadow-xl" : "bg-white border-slate-200/90 hover:border-pink-300")
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <InstagramBrandIcon size={30} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                Instagram Direct
                              </h3>
                              <span className={cn(
                                "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5",
                                isDark ? "bg-pink-950/70 text-pink-300 border-pink-800/60" : "bg-pink-50 text-pink-700 border-pink-200/60"
                              )}>
                                Business DMs
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isComingSoon ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-amber-950/70 text-amber-300 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200"
                              )}>
                                <Sparkles size={10} /> Soon
                              </span>
                            ) : isConn ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-pink-950/70 text-pink-300 border-pink-800" : "bg-pink-50 text-pink-700 border-pink-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-slate-800/80 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                          Automate Instagram Direct Messages, story replies, and comment triggers for active customer engagement.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className={cn(
                            "p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-xs space-y-1 mb-3 sm:mb-4",
                            isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-200" : "bg-amber-50/70 border-amber-200/60 text-amber-900"
                          )}>
                            <div className={cn("font-bold flex items-center gap-1.5 text-[11px]", isDark ? "text-amber-300" : "text-amber-950")}>
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className={cn("text-[10px] leading-relaxed font-medium", isDark ? "text-amber-300/80" : "text-amber-800")}>
                              {state.reason || 'This channel is deactivated by admin and will be enabled shortly.'}
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className={cn(
                            "space-y-2 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl text-xs mb-3 sm:mb-4 border transition-colors",
                            isDark ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-slate-50/80 border-slate-100 text-slate-700"
                          )}>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Account ID</span>
                              <span className={cn("font-mono font-semibold truncate max-w-[140px]", isDark ? "text-slate-200" : "text-slate-700")}>@{client?.instagram_config?.username || 'instagram_biz'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                              <span className="font-bold text-pink-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Auto DM Active
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "space-y-1.5 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-[11px] font-medium border",
                            isDark ? "bg-slate-800/40 border-slate-700/80 text-slate-300" : "bg-pink-50/40 border-pink-100/60 text-slate-600"
                          )}>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-pink-500 shrink-0" />
                              <span>Instagram Business OAuth Connect</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-pink-500 shrink-0" />
                              <span>Comment-to-DM Auto Automation</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-1 sm:pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'Instagram Direct', key: 'instagram' })}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm cursor-pointer",
                              isDark ? "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800" : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                            )}
                          >
                            <Clock size={13} className={isDark ? "text-amber-400" : "text-amber-700"} />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsInstagramConfigModalOpen(true)}
                              className={cn(
                                "flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-sm",
                                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                              )}
                            >
                              <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                              <span>Configure</span>
                            </button>
                            <button
                              onClick={handleInstagramConnect}
                              title="Re-authorize via Instagram"
                              className="py-2 sm:py-2.5 px-3 bg-gradient-to-r from-[#FF7A00] via-[#FF0069] to-[#D300C5] hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-pink-600/20"
                            >
                              <InstagramBrandIcon size={14} />
                              <span>Reconnect</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleInstagramConnect}
                              className="flex-1 py-2 sm:py-2.5 px-3 bg-gradient-to-r from-[#FF7A00] via-[#FF0069] to-[#D300C5] hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-pink-600/20"
                            >
                              <InstagramBrandIcon size={16} />
                              <span>Connect Instagram</span>
                            </button>
                            <button
                              onClick={() => setIsInstagramConfigModalOpen(true)}
                              title="Manual Configuration"
                              className={cn(
                                "p-2 sm:p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs",
                                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                              )}
                            >
                              <Settings size={14} />
                            </button>
                            <Link
                              href="/client/plans"
                              title={`Included in ${state.requiredPlanName}`}
                              className={cn(
                                "py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border",
                                isDark ? "bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 border-pink-800/60" : "bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200/80"
                              )}
                            >
                              <Layers size={13} className="text-pink-400 shrink-0" />
                              <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 4: YOUTUBE CHANNEL ── */}
                {(() => {
                  const state = getChannelAccessState('youtube', client, activePlans);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon
                        ? (isDark ? "border-amber-800/80 bg-amber-950/20" : "border-amber-200/80 bg-amber-50/15")
                        : (isDark ? "bg-[#0f172a] border-slate-800 hover:border-red-500/40 shadow-xl" : "bg-white border-slate-200/90 hover:border-red-300")
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <YouTubeBrandIcon size={30} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                YouTube Channel
                              </h3>
                              <span className={cn(
                                "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5",
                                isDark ? "bg-red-950/70 text-red-300 border-red-800/60" : "bg-red-50 text-red-700 border border-red-200/60"
                              )}>
                                Video & Live
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isComingSoon ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-amber-950/70 text-amber-300 border-amber-800" : "bg-amber-50 text-amber-700 border border-amber-200"
                              )}>
                                <Sparkles size={10} /> Soon
                              </span>
                            ) : isConn ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-emerald-950/70 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border whitespace-nowrap",
                                isDark ? "bg-slate-800/80 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-500 border border-slate-200"
                              )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                          Sync YouTube video comments, community audience questions, and automated replies.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className={cn(
                            "p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-xs space-y-1 mb-3 sm:mb-4",
                            isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-200" : "bg-amber-50/70 border border-amber-200/60 text-amber-900"
                          )}>
                            <div className={cn("font-bold flex items-center gap-1.5 text-[11px]", isDark ? "text-amber-300" : "text-amber-950")}>
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className={cn("text-[10px] leading-relaxed font-medium", isDark ? "text-amber-300/80" : "text-amber-800")}>
                              {state.reason || 'This channel is deactivated by admin and will be enabled shortly.'}
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className={cn(
                            "space-y-2 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl text-xs mb-3 sm:mb-4 border transition-colors",
                            isDark ? "bg-slate-800/60 border-slate-700/80 text-slate-200" : "bg-slate-50/80 border border-slate-100"
                          )}>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Channel Title</span>
                              <span className={cn("font-bold truncate max-w-[150px]", isDark ? "text-white" : "text-slate-800")}>{client?.youtube_config?.channel_title || 'YouTube Channel'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "space-y-1.5 py-2.5 sm:py-3 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-[11px] font-medium border",
                            isDark ? "bg-slate-800/40 border-slate-700/80 text-slate-300" : "bg-red-50/40 border border-red-100/60 text-slate-600"
                          )}>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-red-500 shrink-0" />
                              <span>YouTube OAuth Connect</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-red-500 shrink-0" />
                              <span>Comment & Live Chat Auto Moderation</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-1 sm:pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'YouTube Channel', key: 'youtube' })}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-sm cursor-pointer",
                              isDark ? "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800" : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                            )}
                          >
                            <Clock size={13} className={isDark ? "text-amber-400" : "text-amber-700"} />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsYouTubeConfigModalOpen(true)}
                            className={cn(
                              "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-sm",
                              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                            )}
                          >
                            <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                            <span>Configure YouTube</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsYouTubeConfigModalOpen(true)}
                              className="flex-1 py-2 sm:py-2.5 px-3 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
                            >
                              <YouTubeBrandIcon size={16} />
                              <span>Connect</span>
                            </button>
                            <Link
                              href="/client/plans"
                              title={`Included in ${state.requiredPlanName}`}
                              className={cn(
                                "flex-1 py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border",
                                isDark ? "bg-red-950/60 hover:bg-red-900/60 text-red-300 border-red-800/60" : "bg-red-50 hover:bg-red-100 text-red-800 border border-red-200/80"
                              )}
                            >
                              <Layers size={13} className="text-red-500 shrink-0" />
                              <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* ================= 2. CONNECTORS & BUSINESS INTEGRATIONS ================= */}
            {(() => {
              const allConnectorsList = [
                {
                  key: 'gmail',
                  name: 'Gmail Workspace',
                  desc: 'Sync customer emails, send automated notifications, and trigger AI auto-replies.',
                  icon: <GmailBrandIcon size={28} />,
                  isConnected: isGmailConnected,
                  connectedInfo: client?.gmail_config?.email_address || client?.gmail_config?.email || 'Connected Account',
                  onConnect: () => setIsGmailConfigModalOpen(true),
                  onConfigure: () => setIsGmailConfigModalOpen(true),
                  badge: 'Email Sync',
                  btnColor: 'bg-[#EA4335] hover:bg-[#d93025] text-white'
                },
                {
                  key: 'outlook',
                  name: 'Microsoft Outlook',
                  desc: 'Sync Office 365 Exchange email, calendar bookings, and corporate ticketing.',
                  icon: <OutlookIcon size={28} />,
                  isConnected: isOutlookConnected,
                  connectedInfo: client?.outlook_config?.email || 'Connected Account',
                  onConnect: () => setIsOutlookConfigOpen(true),
                  onConfigure: () => setIsOutlookConfigOpen(true),
                  badge: 'Exchange Mail',
                  btnColor: 'bg-[#0078D4] hover:bg-[#106EBE] text-white'
                },
                {
                  key: 'google_calendar',
                  name: 'Google Calendar',
                  desc: 'Auto-book customer consultations, team meetings, and appointment reminders.',
                  icon: <GoogleCalendarIcon size={28} />,
                  isConnected: isGoogleCalendarConnected,
                  connectedInfo: client?.google_calendar_config?.account_email || 'Calendar Connected',
                  onConnect: () => setIsGoogleCalendarConfigModalOpen(true),
                  onConfigure: () => setIsGoogleCalendarConfigModalOpen(true),
                  badge: 'Appointments',
                  btnColor: 'bg-[#4285F4] hover:bg-[#3367d6] text-white'
                },
                {
                  key: 'google_maps',
                  name: 'Google Maps',
                  desc: 'Google Maps location intelligence, business verification, and geo-routing.',
                  icon: <GoogleMapsBrandIcon size={28} />,
                  isConnected: isGoogleMapsConnected,
                  connectedInfo: client?.google_maps_config?.place_id || 'Maps Verification',
                  onConnect: () => setToast({ msg: 'Google Maps Location Intelligence is active', type: 'info' }),
                  onConfigure: () => setToast({ msg: 'Google Maps Location Intelligence is active', type: 'info' }),
                  badge: 'Location AI',
                  btnColor: 'bg-[#EA4335] hover:bg-[#d93025] text-white'
                },
                {
                  key: 'google_docs',
                  name: 'Google Docs',
                  desc: 'Auto-generate branded agreements, client proposals, and reports dynamically.',
                  icon: <GoogleDocsIcon size={28} />,
                  isConnected: isGoogleDocsConnected,
                  connectedInfo: client?.google_docs_config?.account_email || 'Docs Connected',
                  onConnect: () => setIsGoogleDocsConfigModalOpen(true),
                  onConfigure: () => setIsGoogleDocsConfigModalOpen(true),
                  badge: 'Documents',
                  btnColor: 'bg-[#4285F4] hover:bg-[#3367d6] text-white'
                },
                {
                  key: 'onedrive',
                  name: 'Microsoft OneDrive',
                  desc: 'Cloud storage integration to sync PDF invoices, proposals, and client documents.',
                  icon: <OneDriveIcon size={28} />,
                  isConnected: isOneDriveConnected,
                  connectedInfo: client?.onedrive_config?.account_name || 'Cloud Storage Active',
                  onConnect: () => setIsOneDriveConfigModalOpen(true),
                  onConfigure: () => setIsOneDriveConfigModalOpen(true),
                  badge: 'Cloud Files',
                  btnColor: 'bg-[#0078D4] hover:bg-[#106EBE] text-white'
                },
                {
                  key: 'google_sheets',
                  name: 'Google Sheets',
                  desc: 'Auto-export incoming chat leads, sales orders, and customer records directly to Sheets.',
                  icon: <GoogleSheetsIcon size={28} />,
                  isConnected: isGoogleSheetsConnected,
                  connectedInfo: client?.google_sheets_config?.account_email || 'Sheets Connected',
                  onConnect: () => setIsGoogleSheetsConfigModalOpen(true),
                  onConfigure: () => setIsGoogleSheetsConfigModalOpen(true),
                  badge: 'Spreadsheets',
                  btnColor: 'bg-[#0F9D58] hover:bg-[#0b8043] text-white'
                },
                {
                  key: 'google_slides',
                  name: 'Google Slides',
                  desc: 'Create customized client presentation decks and sales pitch slides dynamically.',
                  icon: <GoogleSlidesIcon size={28} />,
                  isConnected: isGoogleSlidesConnected,
                  connectedInfo: client?.google_slides_config?.account_email || 'Slides Connected',
                  onConnect: () => setIsGoogleSlidesConfigModalOpen(true),
                  onConfigure: () => setIsGoogleSlidesConfigModalOpen(true),
                  badge: 'Pitch Decks',
                  btnColor: 'bg-[#F4B400] hover:bg-[#e3a600] text-white'
                },
                {
                  key: 'google_drive',
                  name: 'Google Drive',
                  desc: 'Cloud file management to upload, organize, and browse documents, sheets, and slides.',
                  icon: <GoogleDriveIcon size={28} />,
                  isConnected: isGoogleDriveConnected,
                  connectedInfo: client?.google_drive_config?.account_email || (isGoogleDriveConnected ? 'Drive Connected' : 'Google Drive Storage'),
                  onConnect: () => setIsGoogleDriveConfigModalOpen(true),
                  onConfigure: () => setIsGoogleDriveConfigModalOpen(true),
                  badge: 'Cloud Files',
                  btnColor: 'bg-[#34A853] hover:bg-[#2d9247] text-white'
                },
                {
                  key: 'google_news',
                  name: 'Google News Feed',
                  desc: 'Track industry news, brand keywords, and real-time market trends automatically.',
                  icon: <GoogleNewsIcon size={28} />,
                  isConnected: isGoogleNewsConnected,
                  connectedInfo: client?.google_news_config?.query ? `Query: ${client.google_news_config.query}` : 'News Feed Active',
                  onConnect: () => setIsGoogleNewsConfigModalOpen(true),
                  onConfigure: () => setIsGoogleNewsConfigModalOpen(true),
                  badge: 'Market Alerts',
                  btnColor: 'bg-[#4285F4] hover:bg-[#3367d6] text-white'
                }
              ];

              const allFeaturesList = [
                {
                  key: 'team_dashboard',
                  name: 'Team Dashboard',
                  desc: 'Collaborative team workspace, role permissions, and agent activity tracking.',
                  icon: <Users size={28} className="text-emerald-600" />,
                  isConnected: true,
                  href: '/client/team',
                  badge: 'Workspace Module',
                  btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
                },
                {
                  key: 'quotation',
                  name: 'Quotation Engine',
                  desc: 'Create instant sales quotes, cost estimates, and client digital approval links.',
                  icon: <FileText size={28} className="text-amber-600" />,
                  isConnected: true,
                  href: '/client/quotations',
                  badge: 'Sales Module',
                  btnColor: 'bg-amber-600 hover:bg-amber-700 text-white'
                },
                {
                  key: 'invoice',
                  name: 'Invoice Generator',
                  desc: 'Automated GST tax invoice generation, payment tracking, and receipt PDFs.',
                  icon: <FileSpreadsheet size={28} className="text-blue-600" />,
                  isConnected: true,
                  href: '/client/invoices',
                  badge: 'Finance Module',
                  btnColor: 'bg-blue-600 hover:bg-blue-700 text-white'
                },
                {
                  key: 'proposal',
                  name: 'Proposal Builder',
                  desc: 'Design professional business proposals, pitch decks, and agreement templates.',
                  icon: <Award size={28} className="text-indigo-600" />,
                  isConnected: true,
                  href: '/client/proposals',
                  badge: 'Proposal Module',
                  btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white'
                },
                {
                  key: 'catalog',
                  name: 'E-Commerce Catalog',
                  desc: 'Product catalog management, inventory items, and chat shopping carts.',
                  icon: <ShoppingBag size={28} className="text-purple-600" />,
                  isConnected: true,
                  href: '/client/products',
                  badge: 'Product Module',
                  btnColor: 'bg-purple-600 hover:bg-purple-700 text-white'
                },
                {
                  key: 'razorpay',
                  name: 'Razorpay Gateway',
                  desc: 'Accept online payments directly via automated invoices and chat links.',
                  icon: <RazorpayBrandIcon size={28} isDark={isDark} />,
                  isConnected: isRazorpayConnected,
                  connectedInfo: client?.razorpay_config?.merchant_name || 'Gateway Active',
                  onConnect: () => setIsRazorpayConfigModalOpen(true),
                  onConfigure: () => setIsRazorpayConfigModalOpen(true),
                  badge: 'Payment Gateway',
                  btnColor: 'bg-[#02042B] hover:bg-[#1a1c3d] text-white'
                },
                {
                  key: 'zoho',
                  name: 'Zoho CRM Pipeline',
                  desc: 'Sync customer chats, lead deals, and contact records directly into Zoho CRM.',
                  icon: <ZohoIcon size={28} />,
                  isConnected: isZohoConnected,
                  connectedInfo: client?.zoho_config?.email || 'CRM Active',
                  onConnect: () => setIsZohoConfigModalOpen(true),
                  onConfigure: () => setIsZohoConfigModalOpen(true),
                  badge: 'CRM Integration',
                  btnColor: 'bg-[#E42528] hover:bg-[#c91e21] text-white'
                },
                {
                  key: 'autoreply',
                  name: 'AI Auto Reply Engine',
                  desc: 'Automate bot workflows, keyword triggers, and multi-step AI responder flows.',
                  icon: <Zap size={28} className="text-orange-600" />,
                  isConnected: true,
                  href: '/client/automations',
                  badge: 'Automation Bot',
                  btnColor: 'bg-orange-600 hover:bg-orange-700 text-white'
                },
                {
                  key: 'voice_video_call',
                  name: 'Voice & Video Calling',
                  desc: 'In-app WebRTC voice calls, video meetings, and agent consultation rooms.',
                  icon: <PhoneCall size={28} className="text-teal-600" />,
                  isConnected: true,
                  href: '/client/calls',
                  badge: 'Live Call Module',
                  btnColor: 'bg-teal-600 hover:bg-teal-700 text-white'
                }
              ];

              const activeConnectors = allConnectorsList.filter(item => getChannelAccessState(item.key, client, activePlans).status !== 'COMING_SOON');
              const comingSoonConnectors = allConnectorsList.filter(item => getChannelAccessState(item.key, client, activePlans).status === 'COMING_SOON');

              return (
                <>
                  {/* Category 2: Active Connectors (8) */}
                  {activeConnectors.length > 0 && (
                    <div className={cn("pt-6 sm:pt-8 border-t space-y-4 sm:space-y-6", isDark ? "border-slate-800" : "border-slate-200/80")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50 shrink-0" />
                          <h2 className={cn("text-xs sm:text-sm font-extrabold uppercase tracking-wider", isDark ? "text-slate-100" : "text-slate-800")}>
                            Connectors
                          </h2>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0", isDark ? "bg-blue-900/40 text-blue-400 border border-blue-800/60" : "bg-blue-50 text-blue-700 border border-blue-200")}>
                            {activeConnectors.length} Connectors
                          </span>
                        </div>
                        <span className={cn("text-xs font-medium hidden md:inline", isDark ? "text-slate-500" : "text-slate-400")}>
                          Productivity, Storage, Mail & Data Connectors
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {activeConnectors.map((item) => {
                          const state = getChannelAccessState(item.key, client, activePlans);
                          const isConn = item.isConnected;

                          return (
                            <div
                              key={item.key}
                              className={cn(
                                "rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative group border",
                                isDark
                                  ? "bg-[#0f172a] border-slate-800 hover:border-slate-700"
                                  : "bg-white border-slate-200/90 hover:border-slate-300"
                              )}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                                    <div className={cn(
                                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs shrink-0 border",
                                      isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
                                    )}>
                                      {item.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                        {item.name}
                                      </h3>
                                      <span className={cn(
                                        "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5",
                                        isDark ? "text-slate-300 bg-slate-800 border border-slate-700" : "text-slate-500 bg-slate-100"
                                      )}>
                                        {item.badge}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isConn ? (
                                      <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap",
                                        isDark ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      )}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Connected</span>
                                      </span>
                                    ) : (
                                      <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap",
                                        isDark ? "bg-slate-800/60 text-slate-400 border border-slate-700" : "bg-slate-50 text-slate-500 border border-slate-200"
                                      )}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full", isDark ? "bg-slate-600" : "bg-slate-300")} />
                                        <span>Offline</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                                  {item.desc}
                                </p>

                                {isConn && (
                                  <div className={cn(
                                    "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold truncate mb-3 sm:mb-4 border",
                                    isDark ? "bg-slate-800/60 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-100 text-slate-700"
                                  )}>
                                    <span className={isDark ? "text-slate-400 font-normal" : "text-slate-400 font-normal"}>Status: </span>
                                    <span>{item.connectedInfo}</span>
                                  </div>
                                )}
                              </div>

                              <div className="pt-1 sm:pt-2">
                                {isConn ? (
                                  <button
                                    onClick={item.onConfigure}
                                    className={cn(
                                      "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-xs",
                                      isDark
                                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                                    )}
                                  >
                                    <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                                    <span>Configure</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={item.onConnect}
                                      className={cn(
                                        "flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm",
                                        item.btnColor
                                      )}
                                    >
                                      <Plus size={14} />
                                      <span>Connect</span>
                                    </button>
                                    <Link
                                      href="/client/plans"
                                      title={`Included in ${state.requiredPlanName || 'Plan'}`}
                                      className={cn(
                                        "flex-1 py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border",
                                        isDark
                                          ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                                      )}
                                    >
                                      <Layers size={13} className={cn("shrink-0", isDark ? "text-slate-400" : "text-slate-600")} />
                                      <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category 3: Workspace Features & Modules (9) */}
                  <div className={cn("pt-6 sm:pt-8 border-t space-y-4 sm:space-y-6", isDark ? "border-slate-800" : "border-slate-200/80")}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50 shrink-0" />
                        <h2 className={cn("text-xs sm:text-sm font-extrabold uppercase tracking-wider", isDark ? "text-slate-100" : "text-slate-800")}>
                          Features & Modules
                        </h2>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0", isDark ? "bg-purple-900/40 text-purple-300 border border-purple-800/60" : "bg-purple-50 text-purple-700 border border-purple-200")}>
                          {allFeaturesList.length} Modules
                        </span>
                      </div>
                      <span className={cn("text-xs font-medium hidden md:inline", isDark ? "text-slate-500" : "text-slate-400")}>
                        Core Workspace Business Features & Automation Tools
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {allFeaturesList.map((item) => {
                        const state = getChannelAccessState(item.key, client, activePlans);
                        const isConn = item.isConnected;
                        const isComingSoon = state.status === 'COMING_SOON';

                        return (
                          <div
                            key={item.key}
                            className={cn(
                              "rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative group",
                              isDark
                                ? "bg-[#0f172a] border-slate-800 hover:border-slate-700"
                                : isComingSoon
                                  ? "border-amber-200/80 bg-amber-50/15"
                                  : "bg-white border-slate-200/90 hover:border-slate-300"
                            )}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                                  <div className={cn(
                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs shrink-0 border",
                                    isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
                                  )}>
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                      {item.name}
                                    </h3>
                                    <span className={cn(
                                      "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 border",
                                      isDark ? "text-purple-300 bg-purple-950/60 border-purple-800/50" : "text-purple-700 bg-purple-50 border-purple-100"
                                    )}>
                                      {item.badge}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {isComingSoon ? (
                                    <span className={cn(
                                      "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap",
                                      isDark ? "bg-amber-950/60 text-amber-400 border border-amber-800/60" : "bg-amber-50 text-amber-700 border border-amber-200"
                                    )}>
                                      <Clock size={10} className={isDark ? "text-amber-400" : "text-amber-600"} />
                                      <span>Soon</span>
                                    </span>
                                  ) : (
                                    <span className={cn(
                                      "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap",
                                      isDark ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    )}>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span>Active</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                                {item.desc}
                              </p>
                            </div>

                            <div className="pt-1 sm:pt-2">
                              {isComingSoon ? (
                                <button
                                  type="button"
                                  onClick={() => setComingSoonModalChannel(item.name)}
                                  className="w-full py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                                >
                                  <Clock size={13} className="text-amber-600" />
                                  <span>Coming Soon</span>
                                </button>
                              ) : item.href ? (
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "w-full py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm",
                                    item.btnColor
                                  )}
                                >
                                  <span>Open Module</span>
                                  <ChevronRight size={14} />
                                </Link>
                              ) : isConn ? (
                                <button
                                  onClick={item.onConfigure}
                                  className={cn(
                                    "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-xs",
                                    isDark
                                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                                  )}
                                >
                                  <Settings size={13} className={isDark ? "text-slate-400" : "text-slate-600"} />
                                  <span>Configure</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={item.onConnect}
                                    className={cn(
                                      "flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm",
                                      item.btnColor
                                    )}
                                  >
                                    <Plus size={14} />
                                    <span>Connect</span>
                                  </button>
                                  <Link
                                    href="/client/plans"
                                    title={`Included in ${state.requiredPlanName || 'Plan'}`}
                                    className={cn(
                                      "flex-1 py-2 sm:py-2.5 px-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs truncate border",
                                      isDark
                                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                                    )}
                                  >
                                    <Layers size={13} className={cn("shrink-0", isDark ? "text-slate-400" : "text-slate-600")} />
                                    <span className="truncate">{state.requiredPlanName || 'Plan'}</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 3: Dedicated Coming Soon Integrations */}
                  {comingSoonConnectors.length > 0 && (
                    <div className={cn("pt-6 sm:pt-8 border-t space-y-4 sm:space-y-6", isDark ? "border-slate-800" : "border-slate-200/80")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50 shrink-0" />
                          <h2 className={cn("text-xs sm:text-sm font-extrabold uppercase tracking-wider", isDark ? "text-slate-100" : "text-slate-800")}>
                            Coming Soon Integrations
                          </h2>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0", isDark ? "bg-amber-900/40 text-amber-300 border border-amber-800/60" : "bg-amber-50 text-amber-700 border border-amber-200")}>
                            {comingSoonConnectors.length} Scheduled
                          </span>
                        </div>
                        <span className={cn("text-xs font-medium hidden md:inline", isDark ? "text-slate-500" : "text-slate-400")}>
                          Scheduled to go live soon by platform administrator
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {comingSoonConnectors.map((item) => (
                          <div
                            key={item.key}
                            className={cn(
                              "rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative group border",
                              isDark
                                ? "bg-[#0f172a] border-amber-500/30 hover:border-amber-500/50"
                                : "bg-white border-amber-200/80 bg-amber-50/15 hover:border-amber-300"
                            )}
                          >
                            <div>
                              {/* Header */}
                              <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                                  <div className={cn(
                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs shrink-0 border",
                                    isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
                                  )}>
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className={cn("font-extrabold text-sm sm:text-base leading-tight break-words", isDark ? "text-white" : "text-slate-900")}>
                                      {item.name}
                                    </h3>
                                    <span className={cn(
                                      "inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5",
                                      isDark ? "text-slate-300 bg-slate-800 border border-slate-700" : "text-slate-500 bg-slate-100"
                                    )}>
                                      {item.badge}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <span className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap",
                                    isDark ? "bg-amber-950/60 text-amber-300 border border-amber-800/60" : "bg-amber-50 text-amber-700 border border-amber-200"
                                  )}>
                                    <Sparkles size={10} />
                                    <span>Soon</span>
                                  </span>
                                </div>
                              </div>

                              <p className={cn("text-xs leading-relaxed mb-3 sm:mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                                {item.desc}
                              </p>

                              {/* Coming soon notice */}
                              <div className={cn(
                                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium mb-3 sm:mb-4 flex items-center gap-1.5 border",
                                isDark
                                  ? "bg-amber-950/30 border-amber-800/50 text-amber-300"
                                  : "bg-amber-50/70 border-amber-200/60 text-amber-900"
                              )}>
                                <Clock size={12} className={isDark ? "text-amber-400 shrink-0" : "text-amber-600 shrink-0"} />
                                <span>Scheduled to go live soon by admin.</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-1 sm:pt-2">
                              <button
                                onClick={() => openComingSoon({ name: item.name, key: item.key })}
                                className={cn(
                                  "w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border shadow-xs",
                                  isDark
                                    ? "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800/70"
                                    : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                                )}
                              >
                                <Clock size={13} className={isDark ? "text-amber-400" : "text-amber-700"} />
                                <span>Coming Soon</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          </div>
        )}

        {/* Coming Soon Channel Modal */}
        <ComingSoonChannelModal
          isOpen={Boolean(comingSoonModalChannel)}
          onClose={() => setComingSoonModalChannel(null)}
          channel={comingSoonModalChannel}
        />

        {/* WhatsApp Configuration Modal */}
        {isConfigModalOpen && (
          <WhatsAppConfigModal
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            client={client}
            onLaunchEmbedded={handleWhatsAppConnect}
            onSaved={(updatedData) => {
              if (updatedData) {
                setClient(prev => ({ ...prev, ...updatedData }));
              }
              fetchClient();
            }}
          />
        )}

        {/* Facebook Configuration Modal */}
        {isFacebookConfigModalOpen && (
          <FacebookConfigModal
            isOpen={isFacebookConfigModalOpen}
            onClose={() => setIsFacebookConfigModalOpen(false)}
            client={client}
            onLaunchEmbedded={handleFacebookConnect}
            onSaved={handleFacebookSaved}
          />
        )}

        {/* Instagram Configuration Modal */}
        {isInstagramConfigModalOpen && (
          <InstagramConfigModal
            isOpen={isInstagramConfigModalOpen}
            onClose={() => setIsInstagramConfigModalOpen(false)}
            client={client}
            onSaved={handleInstagramSaved}
          />
        )}

        {/* OneDrive Configuration Modal */}
        {isOneDriveConfigModalOpen && (
          <OneDriveConfigModal
            isOpen={isOneDriveConfigModalOpen}
            onClose={() => setIsOneDriveConfigModalOpen(false)}
            client={client}
            onSaved={handleOneDriveSaved}
          />
        )}

        {/* Google Calendar Configuration Modal */}
        {isGoogleCalendarConfigModalOpen && (
          <GoogleCalendarConfigModal
            isOpen={isGoogleCalendarConfigModalOpen}
            onClose={() => setIsGoogleCalendarConfigModalOpen(false)}
            client={client}
            onSaved={handleGoogleCalendarSaved}
          />
        )}

        {/* Google Sheets Configuration Modal */}
        {isGoogleSheetsConfigModalOpen && (
          <GoogleSheetsConfigModal
            isOpen={isGoogleSheetsConfigModalOpen}
            onClose={() => setIsGoogleSheetsConfigModalOpen(false)}
            client={client}
            onSaved={handleGoogleSheetsSaved}
          />
        )}

        {/* Google Docs Configuration Modal */}
        {isGoogleDocsConfigModalOpen && (
          <GoogleDocsConfigModal
            isOpen={isGoogleDocsConfigModalOpen}
            onClose={() => setIsGoogleDocsConfigModalOpen(false)}
            client={client}
            onSaved={handleGoogleDocsSaved}
          />
        )}

        {/* Google Slides Configuration Modal */}
        {isGoogleSlidesConfigModalOpen && (
          <GoogleSlidesConfigModal
            isOpen={isGoogleSlidesConfigModalOpen}
            onClose={() => setIsGoogleSlidesConfigModalOpen(false)}
            client={client}
            onSaved={handleGoogleSlidesSaved}
          />
        )}

        {/* Google Drive Configuration Modal */}
        {isGoogleDriveConfigModalOpen && (
          <GoogleDriveConfigModal
            isOpen={isGoogleDriveConfigModalOpen}
            onClose={() => setIsGoogleDriveConfigModalOpen(false)}
            client={client}
            onSaved={() => fetchClient(true)}
          />
        )}

        {/* Google News Configuration Modal */}
        {isGoogleNewsConfigModalOpen && (
          <GoogleNewsConfigModal
            isOpen={isGoogleNewsConfigModalOpen}
            onClose={() => setIsGoogleNewsConfigModalOpen(false)}
            client={client}
            onSaved={() => fetchClient(true)}
          />
        )}

        {/* Razorpay Configuration Modal */}
        {isRazorpayConfigModalOpen && (
          <RazorpayConfigModal
            isOpen={isRazorpayConfigModalOpen}
            onClose={() => setIsRazorpayConfigModalOpen(false)}
            onSaved={() => {
              fetchClient(true);
              setToast({ msg: 'Razorpay configuration updated!', type: 'success' });
              setTimeout(() => setToast(null), 3000);
            }}
          />
        )}

        {/* Zoho Configuration Modal */}
        {isZohoConfigModalOpen && (
          <ZohoConfigModal
            isOpen={isZohoConfigModalOpen}
            onClose={() => setIsZohoConfigModalOpen(false)}
            client={client}
            onSaved={handleZohoSaved}
          />
        )}

        {/* YouTube Configuration Modal */}
        {isYouTubeConfigModalOpen && (
          <YouTubeConfigModal
            isOpen={isYouTubeConfigModalOpen}
            onClose={() => setIsYouTubeConfigModalOpen(false)}
            client={client}
            onSaved={(updatedClient) => handleClientUpdate(updatedClient, 'YouTube configuration updated!')}
          />
        )}

        {/* Microsoft Outlook Configuration Modal */}
        {isOutlookConfigOpen && (
          <OutlookConfigModal
            isOpen={isOutlookConfigOpen}
            onClose={() => {
              setIsOutlookConfigOpen(false);
              if (typeof window !== 'undefined' && window.location.search.includes('channel=')) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            client={client}
            onSaved={() => fetchClient(true)}
          />
        )}

        {/* Gmail Configuration Modal */}
        {isGmailConfigModalOpen && (
          <GmailConfigModal
            isOpen={isGmailConfigModalOpen}
            onClose={() => setIsGmailConfigModalOpen(false)}
            client={client}
            onSaved={() => fetchClient(true)}
          />
        )}

        {/* Interactive Connectors Learning Guide Modal */}
        {isGuideOpen && (
          <LearningCenterModal
            guideSlug="connectors"
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientChannelsPage;

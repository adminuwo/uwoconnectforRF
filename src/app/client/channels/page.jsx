'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  Settings,
  RefreshCw,
  Plus,
  Calendar,
  Sparkles,
  Trash2,
  Lock,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { CHANNEL_DEFINITIONS, getChannelAccessState } from '@/config/channelsConfig';
import ComingSoonChannelModal from '@/components/channels/ComingSoonChannelModal';
import ZohoConfigModal, { ZohoIcon } from '@/components/channels/ZohoConfigModal';
import WhatsAppConfigModal from '@/components/channels/WhatsAppConfigModal';
import FacebookConfigModal from '@/components/channels/FacebookConfigModal';
import InstagramConfigModal from '@/components/channels/InstagramConfigModal';
import OneDriveConfigModal, { OneDriveIcon } from '@/components/channels/OneDriveConfigModal';
import GoogleCalendarConfigModal, { GoogleCalendarIcon } from '@/components/channels/GoogleCalendarConfigModal';
import GoogleSheetsConfigModal, { GoogleSheetsIcon } from '@/components/channels/GoogleSheetsConfigModal';
import GoogleDocsConfigModal, { GoogleDocsIcon } from '@/components/channels/GoogleDocsConfigModal';
import GoogleSlidesConfigModal, { GoogleSlidesIcon } from '@/components/channels/GoogleSlidesConfigModal';
import GoogleNewsConfigModal, { GoogleNewsIcon } from '@/components/channels/GoogleNewsConfigModal';
import OutlookConfigModal, { OutlookIcon } from '@/components/channels/OutlookConfigModal';
import LearningCenterModal from '@/components/guides/LearningCenterModal';

// Authentic Brand Vector Icons
const WhatsAppBrandIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.43 0 .07 5.36.07 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.23-1.63a11.91 11.91 0 005.81 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.49-8.43zM12.04 21.84h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.88 9.88 0 01-1.52-5.24C2.17 6.52 6.6 2.08 12.04 2.08c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 6.99c0 5.44-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" fill="currentColor"/>
  </svg>
);

const FacebookBrandIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramBrandIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.73-2.12 1.39C1.36 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.3.79.73 1.46 1.39 2.12.66.66 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.73 2.12-1.39.66-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91-.3-.79-.73-1.46-1.39-2.12C21.32 1.36 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 2.16c3.2 0 3.59.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.26.07 1.65.07 4.86 0 3.2-.01 3.59-.07 4.85-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.26.06-1.65.07-4.86.07-3.2 0-3.59-.01-4.85-.07-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.65-.07-4.86 0-3.2.01-3.59.07-4.85.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.26-.06 1.65-.07 4.85-.07zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.84a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" fill="currentColor"/>
  </svg>
);

const TelegramBrandIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z"/>
  </svg>
);

const LinkedInBrandIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XTwitterBrandIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeBrandIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokBrandIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.86c0 1.57-.43 3.18-1.38 4.43-1.28 1.74-3.4 2.77-5.59 2.68-2.6-.07-4.99-1.66-5.96-4.04-.97-2.39-.42-5.26 1.37-7.05 1.52-1.55 3.79-2.28 5.96-1.84v4.18c-.89-.25-1.88-.17-2.69.25-.8.41-1.39 1.19-1.58 2.08-.2 1.01.12 2.1.84 2.81.71.72 1.77.99 2.75.7 1.03-.3 1.74-1.24 1.76-2.31V.02z"/>
  </svg>
);

const RazorpayLogo = () => (
  <svg width="22" height="22" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 56L28.5 16H44L36.5 40H50L22 56H16Z" fill="#3395FF"/>
    <path d="M36.5 40L44 16H58L50 40H36.5Z" fill="#072654"/>
  </svg>
);

const renderConnectorBrandIcon = (key, size = 20) => {
  switch (key) {
    case 'whatsapp':
      return <WhatsAppBrandIcon size={size} />;
    case 'facebook':
      return <FacebookBrandIcon size={size} />;
    case 'instagram':
      return <InstagramBrandIcon size={size} />;
    case 'telegram':
      return <TelegramBrandIcon size={size} />;
    case 'linkedin':
      return <LinkedInBrandIcon size={size} />;
    case 'twitter':
      return <XTwitterBrandIcon size={size} />;
    case 'youtube':
      return <YouTubeBrandIcon size={size} />;
    case 'tiktok':
      return <TikTokBrandIcon size={size} />;
    case 'outlook':
      return <OutlookIcon size={size} />;
    case 'onedrive':
      return <OneDriveIcon size={size} />;
    case 'google_calendar':
      return <GoogleCalendarIcon size={size} />;
    case 'google_sheets':
      return <GoogleSheetsIcon size={size} />;
    case 'google_docs':
      return <GoogleDocsIcon size={size} />;
    case 'google_slides':
      return <GoogleSlidesIcon size={size} />;
    case 'google_news':
      return <GoogleNewsIcon size={size} />;
    case 'zoho':
      return <ZohoIcon size={size} />;
    default:
      return <Globe size={size} />;
  }
};

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
  const [mounted, setMounted] = useState(false);
  const [client, setClient] = useState(null);
  const [razorpayConn, setRazorpayConn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const cached = localStorage.getItem('cached_client_channels');
      if (cached) {
        setClient(JSON.parse(cached));
        setLoading(false);
      }
      const cachedRzp = localStorage.getItem('cached_razorpay_status');
      if (cachedRzp) setRazorpayConn(JSON.parse(cachedRzp));
    } catch (e) {}
  }, []);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFacebookConfigModalOpen, setIsFacebookConfigModalOpen] = useState(false);
  const [isInstagramConfigModalOpen, setIsInstagramConfigModalOpen] = useState(false);
  const [isOneDriveConfigModalOpen, setIsOneDriveConfigModalOpen] = useState(false);
  const [isGoogleCalendarConfigModalOpen, setIsGoogleCalendarConfigModalOpen] = useState(false);
  const [isGoogleSheetsConfigModalOpen, setIsGoogleSheetsConfigModalOpen] = useState(false);
  const [isGoogleDocsConfigModalOpen, setIsGoogleDocsConfigModalOpen] = useState(false);
  const [isGoogleSlidesConfigModalOpen, setIsGoogleSlidesConfigModalOpen] = useState(false);
  const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);
  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);
  const [isYouTubeConfigModalOpen, setIsYouTubeConfigModalOpen] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const [fbLoading, setFbLoading] = useState(false);
  const [igLoading, setIgLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isOutlookConfigOpen, setIsOutlookConfigOpen] = useState(false);
  const [comingSoonModalChannel, setComingSoonModalChannel] = useState(null);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOutlookConfigOpen(true);
    };
    window.addEventListener('open-email-modal', handleOpenModal);

    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('channel=outlook') || search.includes('channel=gmail') || search.includes('channel=email')) {
        setIsOutlookConfigOpen(true);
      }
    }

    return () => {
      window.removeEventListener('open-email-modal', handleOpenModal);
    };
  }, []);

  const fetchClient = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 1 & 2. Fetch client channels info and Razorpay status concurrently
      const [profileRes, rzpRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }),
        axios.get(`${API_BASE_URL}/api/razorpay/status`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        })
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const clientData = profileRes.value.data.client || profileRes.value.data;
        if (clientData) {
          setClient(clientData);
          try {
            localStorage.setItem('cached_client_channels', JSON.stringify(clientData));
          } catch (e) {}
        }
      }

      if (rzpRes.status === 'fulfilled' && rzpRes.value?.data) {
        setRazorpayConn(rzpRes.value.data);
        try {
          localStorage.setItem('cached_razorpay_status', JSON.stringify(rzpRes.value.data));
        } catch (e) {}
      }

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

  // Load Meta / Facebook JS SDK after initial page paint to prevent blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.getElementById('facebook-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_META_APP_ID || '991147863536661',
            version: 'v20.0',
            cookie: true,
            xfbml: false,
          });
        }
      };
      document.body.appendChild(script);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchClient();

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    // Instagram Business OAuth callback
    if (code && state === 'instagram') {
      window.history.replaceState({}, document.title, window.location.pathname);
      (async () => {
        setIgLoading(true);
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_BASE_URL}/api/auth/instagram/oauth-callback`,
            {
              code,
              redirect_uri: `${window.location.origin}/client/channels`
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await fetchClient();
          setToast({ msg: '✅ Instagram account connected!', type: 'success' });
          setTimeout(() => setToast(null), 4000);
        } catch (err) {
          const msg = err?.response?.data?.error || 'Failed to connect Instagram.';
          setToast({ msg, type: 'error' });
          setTimeout(() => setToast(null), 5000);
        } finally {
          setIgLoading(false);
        }
      })();
    }
    // Gmail callback
    else if (params.get('gmail_connected') === 'true') {
      setToast({ msg: 'Gmail connected successfully!', type: 'success' });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('gmail_error')) {
      setToast({ msg: `Gmail connection failed: ${params.get('gmail_error')}`, type: 'error' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }    // OneDrive callback
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
    } else if (params.get('gmail_error')) {
      const err = params.get('gmail_error');
      const msg = err === 'access_denied' ? 'Google OAuth permission was cancelled.' : `Google connection failed: ${err}`;
      setToast({ msg, type: 'error' });
      setTimeout(() => setToast(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Google Calendar callback
    else if (params.get('google_calendar_connected') === 'true') {
      setToast({ msg: 'Google Calendar connected successfully!', type: 'success' });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('google_calendar_error')) {
      setToast({ msg: `Google Calendar connection failed: ${params.get('google_calendar_error')}`, type: 'error' });
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
    // Microsoft Outlook OAuth callback (backend redirects here after token exchange)
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

    if (params.get('channel') === 'outlook' || params.get('channel') === 'gmail' || params.get('channel') === 'email') {
      setIsOutlookConfigOpen(true);
    }


    if (code) {
      if (state === 'facebook') {
        setToast({ msg: 'Connecting Facebook...', type: 'success' });
        const connectFacebook = async () => {
          try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/auth/facebook/embedded-signup`,
              { code: code },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchClient();
            setToast({ msg: 'Facebook connected successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
          } catch (err) {
            console.error("Error connecting Facebook", err);
            setToast({ msg: err.response?.data?.error || 'Failed to connect Facebook', type: 'error' });
            setTimeout(() => setToast(null), 4000);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };
        connectFacebook();
      } else if (state === 'instagram') {
        setToast({ msg: 'Connecting Instagram...', type: 'success' });
        const connectInstagram = async () => {
          try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/auth/instagram/embedded-signup`,
              { code: code },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchClient();
            setToast({ msg: 'Instagram connected successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
          } catch (err) {
            console.error("Error connecting Instagram", err);
            setToast({ msg: err.response?.data?.error || 'Failed to connect Instagram', type: 'error' });
            setTimeout(() => setToast(null), 4000);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };
        connectInstagram();
      } else {
        // WhatsApp Embedded Signup callback (state === 'whatsapp' or default)
        setToast({ msg: 'Connecting WhatsApp Business...', type: 'success' });
        const connectWhatsApp = async () => {
          try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/auth/whatsapp/embedded-signup`,
              { code: code },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data?.whatsapp_config) {
              setClient(prev => ({
                ...prev,
                ...res.data.whatsapp_config,
                whatsapp_enabled: true
              }));
            }
            await fetchClient();
            setToast({ msg: '✅ WhatsApp Business connected successfully!', type: 'success' });
            console.error("Error connecting WhatsApp", err);
            setToast({ msg: err.response?.data?.error || 'Failed to connect WhatsApp', type: 'error' });
            setTimeout(() => setToast(null), 4000);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        };
        connectWhatsApp();
      }
    }

    // Listen for Meta Embedded Signup postMessage events from popup
    const handleMetaMessage = async (event) => {
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
          console.log('Received Meta WA_EMBEDDED_SIGNUP event:', data);
          const phone_number_id = data?.data?.phone_number_id || data?.phone_number_id;
          const waba_id = data?.data?.waba_id || data?.waba_id;
          
          if (waba_id || phone_number_id) {
            setToast({ msg: 'Saving WhatsApp configuration...', type: 'success' });
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/profile`, {
              whatsapp_waba_id: waba_id,
              whatsapp_phone_number_id: phone_number_id,
              whatsapp_enabled: true
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            await fetchClient();
            setToast({ msg: '✅ WhatsApp connected successfully!', type: 'success' });
            setTimeout(() => setToast(null), 4000);
          }
        }
      } catch (err) {
        console.error('Error handling Meta message event', err);
      }
    };
    window.addEventListener('message', handleMetaMessage);

    return () => {
      window.removeEventListener('message', handleMetaMessage);
    };
  }, []);

  const handleWhatsAppSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'WhatsApp configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleZohoSaved = (updatedClient) => {
    setClient(updatedClient);
    setIsZohoConfigModalOpen(false);
    setToast({ msg: 'Zoho configuration saved!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFacebookSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Facebook configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInstagramSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Instagram configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOneDriveSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'OneDrive configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleCalendarSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Google Calendar configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleSheetsSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Google Sheets configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleDocsSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Google Docs configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleSlidesSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Google Slides configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const isWhatsAppConnected = Boolean((client?.whatsapp_access_token && client?.whatsapp_phone_number_id) || client?.whatsapp_waba_id || client?.whatsapp_phone_number_id || client?.whatsapp_access_token);
  const isFacebookConnected = Boolean(client?.facebook_enabled || client?.facebook_config?.page_id || client?.facebook_config?.access_token || client?.facebook_config?.page_name);
  const isInstagramConnected = Boolean(client?.instagram_enabled || client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id || client?.instagram_config?.access_token || client?.instagram_config?.username);
  const isGmailConnected = Boolean(client?.gmail_enabled || client?.gmail_config?.email_address || client?.gmail_config?.email || client?.gmail_config?.token || client?.gmail_config?.access_token);
  const isOutlookConnected = Boolean(client?.outlook_enabled || client?.outlook_config?.email_address || client?.outlook_config?.access_token);
  const isOneDriveConnected = Boolean(client?.onedrive_enabled || client?.onedrive_config?.access_token || client?.onedrive_config?.user_id || client?.onedrive_config?.account_name || client?.onedrive_config?.drive_id);
  const isGoogleCalendarConnected = Boolean(client?.google_calendar_enabled || client?.google_calendar_config?.calendar_id || client?.google_calendar_config?.primary_calendar_id || client?.google_calendar_config?.access_token || client?.google_calendar_config?.account_email);
  const isGoogleSheetsConnected = Boolean(client?.google_sheets_enabled || client?.google_sheets_config?.spreadsheet_id || client?.google_sheets_config?.access_token || client?.google_sheets_config?.account_email);
  const isGoogleDocsConnected = Boolean(client?.google_docs_enabled || client?.google_docs_config?.document_id || client?.google_docs_config?.default_doc_id || client?.google_docs_config?.access_token || client?.google_docs_config?.account_email);
  const isGoogleSlidesConnected = Boolean(client?.google_slides_enabled || client?.google_slides_config?.presentation_id || client?.google_slides_config?.default_presentation_id || client?.google_slides_config?.access_token || client?.google_slides_config?.account_email);
  const isGoogleNewsConnected = Boolean(client?.google_news_enabled || client?.google_news_config?.topic || client?.google_news_config?.query);
  const isYouTubeConnected = Boolean(client?.youtube_enabled || client?.youtube_config?.channel_id || client?.youtube_config?.access_token || client?.youtube_config?.channel_title);
  const isZohoConnected = Boolean(client?.zoho_enabled || client?.zoho_config?.access_token || client?.zoho_config?.refresh_token);
  const isRazorpayConnected = Boolean(razorpayConn?.connected || razorpayConn?.connection_status === 'CONNECTED' || client?.razorpay_account_id || client?.razorpay_key_id);

  const connectedCount = [
    isWhatsAppConnected, isFacebookConnected, isInstagramConnected, isGmailConnected,
    isOutlookConnected, isOneDriveConnected, isGoogleCalendarConnected, isGoogleSheetsConnected,
    isGoogleDocsConnected, isGoogleSlidesConnected, isGoogleNewsConnected, isYouTubeConnected,
    isZohoConnected, isRazorpayConnected
  ].filter(Boolean).length;

  const [gmailDisconnecting, setGmailDisconnecting] = useState(false);

  const handleDisconnectGmail = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail?')) return;
    setGmailDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/auth/gmail/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClient(true);
      setToast({ msg: 'Gmail disconnected successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.warn("Error disconnecting Gmail", err);
      setToast({ msg: 'Failed to disconnect Gmail', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setGmailDisconnecting(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/auth/gmail/connect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.warn("Error connecting Gmail", err);
      setToast({ msg: 'Failed to initiate Gmail connect', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/auth/google-calendar/connect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.warn("Error connecting Google Calendar", err);
      setToast({ msg: 'Failed to initiate Google Calendar connect', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleWhatsAppConnect = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
    const redirectUri = encodeURIComponent(`${origin}/client/channels?state=whatsapp`);
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || '991147863536661';
    const url = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=${appId}&config_id=970003505994896&extras=%7B%22sessionInfoVersion%22%3A%223%22%2C%22version%22%3A%22v4%22%7D&redirect_uri=${redirectUri}`;

    const width = 600;
    const height = 750;
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;
    const popup = window.open(url, 'WhatsAppEmbeddedSignup', `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes`);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = url;
    }
  };

  const handleFacebookConnect = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uwoconnect.aisa24.com';
    const redirectUri = encodeURIComponent(`${origin}/client/channels?state=facebook`);
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || '991147863536661';
    const scope = encodeURIComponent('public_profile,email,pages_show_list,pages_read_engagement,pages_messaging');
    window.location.href = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=facebook`;
  };

  const handleInstagramConnect = () => {
    // Use Instagram Business Login OAuth flow
    const redirectUri = encodeURIComponent(`${window.location.origin}/client/channels`);
    const instagramOAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1704328300882543&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=instagram`;
    window.location.href = instagramOAuthUrl;
  };

  if (!mounted) {
    return (
      <DashboardLayout role="CLIENT">
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="CLIENT">
      <div className="w-full pb-16 px-4 sm:px-6 lg:px-8 relative font-sans">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/50 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* ── Top Header Section ── */}
        <div className="py-6 mb-8 border-b border-slate-100/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Channels & Integrations</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official APIs
              </span>
            </div>
            <p className="text-slate-500 text-xs font-normal max-w-2xl">
              Connect official Meta messaging channels, automate inbound customer inquiries with AI, and manage team communication.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 font-semibold text-[11px]">
                <strong className="text-slate-900 font-bold">
                  {[
                    getChannelAccessState('whatsapp', client).status === 'CONNECTED',
                    getChannelAccessState('facebook', client).status === 'CONNECTED',
                    getChannelAccessState('instagram', client).status === 'CONNECTED'
                  ].filter(Boolean).length}
                </strong> / 3 Connected
              </span>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
              title="Open Connectors & Integrations Master Guide"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Guide</span>
            </button>

            <button
              onClick={() => fetchClient(true)}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Refresh Status"
            >
              <RefreshCw size={14} className={cn(refreshing && "animate-spin text-emerald-600")} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-50/80 rounded-3xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-300">
            
            {/* ================= 1. ACTIVE CORE MESSAGING CHANNELS ================= */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                    Active Messaging Channels
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Automated by UWO AI Agent & Bot Dispatcher
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* ── CARD 1: WHATSAPP BUSINESS ── */}
                {(() => {
                  const state = getChannelAccessState('whatsapp', client);
                  const isRestricted = state.status === 'DISABLED_BY_ADMIN';
                  const isConn = state.status === 'CONNECTED';

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-lg relative overflow-hidden group",
                      isRestricted 
                        ? "border-slate-200 bg-slate-50/50 opacity-80" 
                        : "border-slate-200/90 hover:border-emerald-200 hover:bg-gradient-to-b hover:from-emerald-50/15 hover:to-white"
                    )}>
                      {/* Subtle Ambient Glow */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

                      <div className="relative z-10">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0",
                              isRestricted 
                                ? "bg-slate-200 text-slate-500" 
                                : "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-emerald-500/25"
                            )}>
                              <WhatsAppBrandIcon size={24} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                                WhatsApp Business
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mt-0.5">
                                Cloud API
                              </span>
                            </div>
                          </div>

                          <div>
                            {isRestricted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                                <Lock size={10} /> Disabled
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-2xs",
                                isConn ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", isConn ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                <span>{isConn ? 'Connected' : 'Offline'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Official Meta Cloud API for customer conversations, broadcast marketing campaigns, and 24/7 AI smart auto-replies.
                        </p>

                        {/* Card Content State */}
                        {isRestricted ? (
                          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-rose-900 text-[11px]">
                              <ShieldAlert size={13} className="text-rose-600 shrink-0" />
                              <span>Admin Access Disabled</span>
                            </div>
                            <p className="text-[10px] text-rose-700/90 leading-relaxed font-medium">
                              Channel permissions for WhatsApp have been restricted by the platform administrator.
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className="space-y-2 py-3 px-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Business</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{client?.business_name || 'Verified Account'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Phone</span>
                              <div className="flex items-center gap-1 font-bold text-slate-800">
                                <span>{client?.phone_number || 'N/A'}</span>
                                <CopyButton text={client?.phone_number} />
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">WABA ID</span>
                              <div className="flex items-center gap-1 font-bold text-slate-800">
                                <span className="truncate max-w-[110px]">{client?.whatsapp_waba_id || 'N/A'}</span>
                                <CopyButton text={client?.whatsapp_waba_id} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 py-3 px-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 mb-4 text-[11px] font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                              <span>Verified Cloud API (WABA)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                              <span>24/7 AI Smart Bot Auto-Replies</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                              <span>Broadcast Marketing Campaigns</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="relative z-10 pt-2">
                        {isRestricted ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                          >
                            <Lock size={12} />
                            <span>Restricted by Admin</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-2xs hover:shadow-xs"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure WhatsApp</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleWhatsAppConnect}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30"
                          >
                            <WhatsAppBrandIcon size={16} />
                            <span>Connect WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 2: FACEBOOK PAGE MESSENGER ── */}
                {(() => {
                  const state = getChannelAccessState('facebook', client);
                  const isRestricted = state.status === 'DISABLED_BY_ADMIN';
                  const isConn = state.status === 'CONNECTED';

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-lg relative overflow-hidden group",
                      isRestricted 
                        ? "border-slate-200 bg-slate-50/50 opacity-80" 
                        : "border-slate-200/90 hover:border-blue-200 hover:bg-gradient-to-b hover:from-blue-50/15 hover:to-white"
                    )}>
                      {/* Subtle Ambient Glow */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

                      <div className="relative z-10">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0",
                              isRestricted 
                                ? "bg-slate-200 text-slate-500" 
                                : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25"
                            )}>
                              <FacebookBrandIcon size={24} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                                Facebook
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 mt-0.5">
                                Page Messenger
                              </span>
                            </div>
                          </div>

                          <div>
                            {isRestricted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                                <Lock size={10} /> Disabled
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-2xs",
                                isConn ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", isConn ? "bg-blue-500 animate-pulse" : "bg-slate-300")} />
                                <span>{isConn ? 'Connected' : 'Offline'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Connect official Facebook Business Pages to automate Messenger interactions, capture inbound leads, and answer FAQs.
                        </p>

                        {/* Card Content State */}
                        {isRestricted ? (
                          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-rose-900 text-[11px]">
                              <ShieldAlert size={13} className="text-rose-600 shrink-0" />
                              <span>Admin Access Disabled</span>
                            </div>
                            <p className="text-[10px] text-rose-700/90 leading-relaxed font-medium">
                              Channel permissions for Facebook have been restricted by the platform administrator.
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className="space-y-2 py-3 px-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Page Name</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{client?.facebook_config?.page_name || 'Facebook Page'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Page ID</span>
                              <div className="flex items-center gap-1 font-bold text-slate-800">
                                <span className="truncate max-w-[110px]">{client?.facebook_config?.page_id || 'N/A'}</span>
                                <CopyButton text={client?.facebook_config?.page_id} />
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Webhook</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 py-3 px-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/60 mb-4 text-[11px] font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                              <span>Facebook Page Messenger Sync</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                              <span>Instant Lead Capture & FAQ Bot</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                              <span>Multi-Agent Shared Team Inbox</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="relative z-10 pt-2">
                        {isRestricted ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                          >
                            <Lock size={12} />
                            <span>Restricted by Admin</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsFacebookConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-2xs hover:shadow-xs"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure Facebook</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleFacebookConnect}
                            disabled={fbLoading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-50"
                          >
                            {fbLoading ? <Loader2 size={14} className="animate-spin" /> : <FacebookBrandIcon size={16} />}
                            <span>Connect Facebook</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 3: INSTAGRAM DIRECT ── */}
                {(() => {
                  const state = getChannelAccessState('instagram', client);
                  const isRestricted = state.status === 'DISABLED_BY_ADMIN';
                  const isConn = state.status === 'CONNECTED';

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-lg relative overflow-hidden group",
                      isRestricted 
                        ? "border-slate-200 bg-slate-50/50 opacity-80" 
                        : "border-slate-200/90 hover:border-pink-200 hover:bg-gradient-to-b hover:from-pink-50/15 hover:to-white"
                    )}>
                      {/* Subtle Ambient Glow */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-500/15 transition-all" />

                      <div className="relative z-10">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0",
                              isRestricted 
                                ? "bg-slate-200 text-slate-500" 
                                : "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-pink-500/25"
                            )}>
                              <InstagramBrandIcon size={24} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                                Instagram
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/60 mt-0.5">
                                Direct Message
                              </span>
                            </div>
                          </div>

                          <div>
                            {isRestricted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                                <Lock size={10} /> Disabled
                              </span>
                            ) : (
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-2xs",
                                isConn ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-slate-50 text-slate-500 border-slate-200"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", isConn ? "bg-pink-500 animate-pulse" : "bg-slate-300")} />
                                <span>{isConn ? 'Connected' : 'Offline'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Automate customer Direct Messages (DMs), story mentions, and comment-to-DM interactions into qualified sales leads.
                        </p>

                        {/* Card Content State */}
                        {isRestricted ? (
                          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-rose-900 text-[11px]">
                              <ShieldAlert size={13} className="text-rose-600 shrink-0" />
                              <span>Admin Access Disabled</span>
                            </div>
                            <p className="text-[10px] text-rose-700/90 leading-relaxed font-medium">
                              Channel permissions for Instagram have been restricted by the platform administrator.
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className="space-y-2 py-3 px-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Account</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{client?.instagram_config?.page_name || client?.instagram_config?.username || 'Instagram Account'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">IG Account ID</span>
                              <div className="flex items-center gap-1 font-bold text-slate-800">
                                <span className="truncate max-w-[110px]">{client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id || 'N/A'}</span>
                                <CopyButton text={client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id} />
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Webhook</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 py-3 px-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/60 mb-4 text-[11px] font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-pink-600 shrink-0" />
                              <span>Direct Message (DM) Automation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-pink-600 shrink-0" />
                              <span>Story Mention & Comment Replies</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-pink-600 shrink-0" />
                              <span>AI Sales Assistant & Product Bot</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="relative z-10 pt-2">
                        {isRestricted ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                          >
                            <Lock size={12} />
                            <span>Restricted by Admin</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsInstagramConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-2xs hover:shadow-xs"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure Instagram</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleInstagramConnect}
                            disabled={igLoading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-600/20 hover:shadow-lg hover:shadow-pink-600/30 disabled:opacity-50"
                          >
                            {igLoading ? <Loader2 size={14} className="animate-spin" /> : <InstagramBrandIcon size={16} />}
                            <span>Connect Instagram</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>




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
            onSaved={handleWhatsAppSaved}
          />
        )}

        {/* Facebook Configuration Modal */}
        {isFacebookConfigModalOpen && (
          <FacebookConfigModal
            isOpen={isFacebookConfigModalOpen}
            onClose={() => setIsFacebookConfigModalOpen(false)}
            client={client}
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

        {/* Google News Configuration Modal */}
        {isGoogleNewsConfigModalOpen && (
          <GoogleNewsConfigModal
            isOpen={isGoogleNewsConfigModalOpen}
            onClose={() => setIsGoogleNewsConfigModalOpen(false)}
            client={client}
            onSaved={() => fetchClient(true)}
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

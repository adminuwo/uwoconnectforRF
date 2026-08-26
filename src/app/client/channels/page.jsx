'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight
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
import YouTubeConfigModal, { YouTubeBrandIcon } from '@/components/channels/YouTubeConfigModal';
import LearningCenterModal from '@/components/guides/LearningCenterModal';

// ═════════════════════════════════════════════════════════════════════════════════
// ── AUTHENTIC BRAND VECTOR ICONS ──
// ═════════════════════════════════════════════════════════════════════════════════

const WhatsAppBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

const FacebookBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
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
    <rect width="48" height="48" rx="12" fill="url(#igClientGrad)"/>
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="31.5" cy="16.5" r="1.75" fill="white"/>
  </svg>
);

const GmailBrandIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4"/>
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853"/>
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335"/>
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F"/>
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04"/>
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
  const [client, setClient] = useState(null);
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
  const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);
  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);
  const [isYouTubeConfigModalOpen, setIsYouTubeConfigModalOpen] = useState(false);
  const [isOutlookConfigOpen, setIsOutlookConfigOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [comingSoonModalChannel, setComingSoonModalChannel] = useState(null);

  const [fbLoading, setFbLoading] = useState(false);
  const [igLoading, setIgLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

      // Fetch client profile, global connectors status, and effective connectors concurrently
      const [profileRes, globalRes, connRes] = await Promise.allSettled([
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
        })
      ]);

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
        } catch (e) {}
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

  useEffect(() => {
    setIsMounted(true);
    try {
      const cached = localStorage.getItem('cached_client_channels');
      if (cached) {
        setClient(JSON.parse(cached));
        setLoading(false);
      }
    } catch (e) {}

    fetchClient();
  }, []);

  // Facebook JS SDK
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.getElementById('facebook-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: '991147863536661',
            cookie: true,
            xfbml: true,
            version: 'v19.0'
          });
        }
      };
      document.body.appendChild(script);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // OAuth & Meta Embedded Signup callback handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
      } else if (state === 'whatsapp') {
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
            setTimeout(() => setToast(null), 4000);
          } catch (err) {
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

  // Connection state checks
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

  // Connect actions
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
      setIsOutlookConfigOpen(true);
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
      setIsGoogleCalendarConfigModalOpen(true);
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
    if (!window.FB) {
      setToast({ msg: 'Facebook SDK loading, opening configuration...', type: 'info' });
      setIsFacebookConfigModalOpen(true);
      return;
    }
    setFbLoading(true);
    window.FB.login(async (response) => {
      if (response.status !== 'connected') {
        setFbLoading(false);
        setIsFacebookConfigModalOpen(true);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          `${API_BASE_URL}/api/auth/facebook/embedded-signup`,
          { access_token: response.authResponse.accessToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClient(prev => ({ ...prev, ...res.data.facebook_config ? { facebook_config: res.data.facebook_config, facebook_enabled: true } : {} }));
        await fetchClient();
        setToast({ msg: '✅ Facebook Page connected!', type: 'success' });
        setTimeout(() => setToast(null), 4000);
      } catch (err) {
        setIsFacebookConfigModalOpen(true);
      } finally {
        setFbLoading(false);
      }
    }, {
      scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_messaging',
      return_scopes: true,
    });
  };

  const handleInstagramConnect = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/client/channels`);
    const instagramOAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1704328300882543&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=instagram`;
    window.location.href = instagramOAuthUrl;
  };

  const openComingSoon = (channelDef) => {
    setComingSoonModalChannel(channelDef);
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="w-full pb-16 px-4 sm:px-6 lg:px-8 relative font-sans space-y-10">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-semibold text-xs bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/50 animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* ── Top Header Section ── */}
        <div className="py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    isWhatsAppConnected,
                    isFacebookConnected,
                    isInstagramConnected
                  ].filter(Boolean).length}
                </strong> / 3 Channels Live
              </span>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                    Active Messaging Channels
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    3 Channels
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Automated by UWO AI Agent & Bot Dispatcher
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* ── CARD 1: WHATSAPP BUSINESS ── */}
                {(() => {
                  const state = getChannelAccessState('whatsapp', client);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon 
                        ? "border-amber-200/80 bg-amber-50/15" 
                        : "border-slate-200/90 hover:border-emerald-300"
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <WhatsAppBrandIcon size={34} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base">
                                WhatsApp Business
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mt-0.5">
                                Cloud API
                              </span>
                            </div>
                          </div>

                          <div>
                            {isComingSoon ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles size={11} /> Coming Soon
                              </span>
                            ) : isConn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Official Meta Cloud API for customer conversations, broadcast marketing campaigns, and 24/7 AI smart auto-replies.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-amber-950 text-[11px]">
                              <Clock size={13} className="text-amber-600 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                              This channel is being scheduled by the platform administrator and will go live shortly.
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
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'WhatsApp Business', key: 'whatsapp' })}
                            className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-amber-300 shadow-sm cursor-pointer"
                          >
                            <Clock size={13} className="text-amber-700" />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 shadow-sm"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure WhatsApp</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleWhatsAppConnect}
                            className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                          >
                            <WhatsAppBrandIcon size={16} />
                            <span>Connect WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── CARD 2: FACEBOOK MESSENGER ── */}
                {(() => {
                  const state = getChannelAccessState('facebook', client);
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon 
                        ? "border-amber-200/80 bg-amber-50/15" 
                        : "border-slate-200/90 hover:border-blue-300"
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <FacebookBrandIcon size={34} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base">
                                Facebook
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 mt-0.5">
                                Page Messenger
                              </span>
                            </div>
                          </div>

                          <div>
                            {isComingSoon ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles size={11} /> Coming Soon
                              </span>
                            ) : isConn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Connect official Facebook Business Pages to automate Messenger interactions, capture inbound leads, and answer FAQs.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-amber-950 text-[11px]">
                              <Clock size={13} className="text-amber-600 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                              This channel is currently deactivated by admin and will be enabled shortly.
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className="space-y-2 py-3 px-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Page Name</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{client?.facebook_config?.page_name || 'Facebook Page'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Sync
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
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'Facebook Messenger', key: 'facebook' })}
                            className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-amber-300 shadow-sm cursor-pointer"
                          >
                            <Clock size={13} className="text-amber-700" />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsFacebookConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 shadow-sm"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure Facebook</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleFacebookConnect}
                            disabled={fbLoading}
                            className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#1565d8] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-50"
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
                  const isComingSoon = state.status === 'COMING_SOON';
                  const isConn = state.status === 'CONNECTED' && !isComingSoon;

                  return (
                    <div className={cn(
                      "bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group",
                      isComingSoon 
                        ? "border-amber-200/80 bg-amber-50/15" 
                        : "border-slate-200/90 hover:border-pink-300"
                    )}>
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 drop-shadow-sm">
                              <InstagramBrandIcon size={34} />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base">
                                Instagram
                              </h3>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/60 mt-0.5">
                                Direct Message
                              </span>
                            </div>
                          </div>

                          <div>
                            {isComingSoon ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles size={11} /> Coming Soon
                              </span>
                            ) : isConn ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Automate customer Direct Messages (DMs), story mentions, and comment-to-DM interactions into qualified sales leads.
                        </p>

                        {/* Content Body */}
                        {isComingSoon ? (
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs space-y-1 mb-4">
                            <div className="font-bold flex items-center gap-1.5 text-amber-950 text-[11px]">
                              <Clock size={13} className="text-amber-600 shrink-0" />
                              <span>Launching Soon</span>
                            </div>
                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                              This channel is currently deactivated by admin and will be enabled shortly.
                            </p>
                          </div>
                        ) : isConn ? (
                          <div className="space-y-2 py-3 px-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Account</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{client?.instagram_config?.username || client?.instagram_config?.page_name || 'Instagram Account'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Status</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Sync
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
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isComingSoon ? (
                          <button
                            onClick={() => openComingSoon({ name: 'Instagram Direct', key: 'instagram' })}
                            className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-amber-300 shadow-sm cursor-pointer"
                          >
                            <Clock size={13} className="text-amber-700" />
                            <span>Coming Soon</span>
                          </button>
                        ) : isConn ? (
                          <button
                            onClick={() => setIsInstagramConfigModalOpen(true)}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 shadow-sm"
                          >
                            <Settings size={13} className="text-slate-600" />
                            <span>Configure Instagram</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleInstagramConnect}
                            disabled={igLoading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-600/20 disabled:opacity-50"
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

            {/* ================= 2. ACTIVE CONNECTORS & BUSINESS TOOLS ================= */}
            {(() => {
              const allConnectorsList = [
                {
                  key: 'gmail',
                  name: 'Gmail / Google Workspace',
                  desc: 'Sync customer emails, send automated replies, and route inbound support tickets.',
                  icon: <GmailBrandIcon size={28} />,
                  isConnected: isGmailConnected,
                  connectedInfo: client?.gmail_config?.email || client?.gmail_config?.email_address || 'Gmail Active',
                  onConnect: handleConnectGmail,
                  onConfigure: () => setIsOutlookConfigOpen(true),
                  badge: 'Google Mail',
                  btnColor: 'bg-[#EA4335] hover:bg-[#d9382b] text-white'
                },
                {
                  key: 'outlook',
                  name: 'Microsoft Outlook',
                  desc: 'Office 365 Exchange sync for corporate emails, calendar bookings, and ticketing.',
                  icon: <OutlookIcon size={28} />,
                  isConnected: isOutlookConnected,
                  connectedInfo: client?.outlook_config?.email || client?.outlook_config?.email_address || 'Outlook Active',
                  onConnect: () => setIsOutlookConfigOpen(true),
                  onConfigure: () => setIsOutlookConfigOpen(true),
                  badge: 'Office 365',
                  btnColor: 'bg-[#0078D4] hover:bg-[#006abc] text-white'
                },
                {
                  key: 'onedrive',
                  name: 'Microsoft OneDrive',
                  desc: 'Enterprise cloud document storage for automatic PDF quotation & invoice backups.',
                  icon: <OneDriveIcon size={28} />,
                  isConnected: isOneDriveConnected,
                  connectedInfo: client?.onedrive_config?.account_name || 'OneDrive Synced',
                  onConnect: () => setIsOneDriveConfigModalOpen(true),
                  onConfigure: () => setIsOneDriveConfigModalOpen(true),
                  badge: 'Cloud Docs',
                  btnColor: 'bg-[#0078D4] hover:bg-[#006abc] text-white'
                },
                {
                  key: 'google_calendar',
                  name: 'Google Calendar',
                  desc: 'Automated appointment scheduling, customer consultation bookings, and reminders.',
                  icon: <GoogleCalendarIcon size={28} />,
                  isConnected: isGoogleCalendarConnected,
                  connectedInfo: client?.google_calendar_config?.account_email || 'Calendar Synced',
                  onConnect: handleConnectGoogleCalendar,
                  onConfigure: () => setIsGoogleCalendarConfigModalOpen(true),
                  badge: 'Scheduling',
                  btnColor: 'bg-[#4285F4] hover:bg-[#3367d6] text-white'
                },
                {
                  key: 'google_sheets',
                  name: 'Google Sheets',
                  desc: 'Export live leads, chat logs, and order history directly into Google Spreadsheets.',
                  icon: <GoogleSheetsIcon size={28} />,
                  isConnected: isGoogleSheetsConnected,
                  connectedInfo: client?.google_sheets_config?.spreadsheet_id ? 'Spreadsheet Synced' : 'Sheets Connected',
                  onConnect: () => setIsGoogleSheetsConfigModalOpen(true),
                  onConfigure: () => setIsGoogleSheetsConfigModalOpen(true),
                  badge: 'Spreadsheets',
                  btnColor: 'bg-[#0F9D58] hover:bg-[#0b8043] text-white'
                },
                {
                  key: 'google_docs',
                  name: 'Google Docs',
                  desc: 'Dynamic template document generation for proposals, agreements, and invoices.',
                  icon: <GoogleDocsIcon size={28} />,
                  isConnected: isGoogleDocsConnected,
                  connectedInfo: client?.google_docs_config?.document_id ? 'Template Synced' : 'Docs Connected',
                  onConnect: () => setIsGoogleDocsConfigModalOpen(true),
                  onConfigure: () => setIsGoogleDocsConfigModalOpen(true),
                  badge: 'Documents',
                  btnColor: 'bg-[#4285F4] hover:bg-[#3367d6] text-white'
                },
                {
                  key: 'google_slides',
                  name: 'Google Slides',
                  desc: 'Automated presentation generation and sales deck pitch customization.',
                  icon: <GoogleSlidesIcon size={28} />,
                  isConnected: isGoogleSlidesConnected,
                  connectedInfo: client?.google_slides_config?.presentation_id ? 'Deck Synced' : 'Slides Connected',
                  onConnect: () => setIsGoogleSlidesConfigModalOpen(true),
                  onConfigure: () => setIsGoogleSlidesConfigModalOpen(true),
                  badge: 'Pitch Decks',
                  btnColor: 'bg-[#F4B400] hover:bg-[#e0a400] text-slate-900'
                },
                {
                  key: 'zoho',
                  name: 'Zoho CRM',
                  desc: 'Bidirectional sync for customer leads, deal pipelines, and contact management.',
                  icon: <ZohoIcon size={28} />,
                  isConnected: isZohoConnected,
                  connectedInfo: 'Synced with Zoho CRM',
                  onConnect: () => setIsZohoConfigModalOpen(true),
                  onConfigure: () => setIsZohoConfigModalOpen(true),
                  badge: 'CRM Pipeline',
                  btnColor: 'bg-[#E42528] hover:bg-[#c91d20] text-white'
                },
                {
                  key: 'youtube',
                  name: 'YouTube Channel',
                  desc: 'Sync video comments, live stream chat moderation, and automated community replies.',
                  icon: <YouTubeBrandIcon size={28} />,
                  isConnected: isYouTubeConnected,
                  connectedInfo: client?.youtube_config?.channel_title || 'Channel Connected',
                  onConnect: () => setIsYouTubeConfigModalOpen(true),
                  onConfigure: () => setIsYouTubeConfigModalOpen(true),
                  badge: 'Video & Live',
                  btnColor: 'bg-[#FF0000] hover:bg-[#cc0000] text-white'
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

              const activeConnectors = allConnectorsList.filter(item => getChannelAccessState(item.key, client).status !== 'COMING_SOON');
              const comingSoonConnectors = allConnectorsList.filter(item => getChannelAccessState(item.key, client).status === 'COMING_SOON');

              return (
                <>
                  {/* Category 2: Active Connectors */}
                  {activeConnectors.length > 0 && (
                    <div className="pt-8 border-t border-slate-200/80 space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
                          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                            Available Connectors & Business Tools
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                            {activeConnectors.length} Available
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                          Productivity, Storage, CRM & Media Integrations
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeConnectors.map((item) => {
                          const state = getChannelAccessState(item.key, client);
                          const isConn = item.isConnected;

                          return (
                            <div
                              key={item.key}
                              className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative group"
                            >
                              <div>
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3.5 mb-4">
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-xs shrink-0">
                                      {item.icon}
                                    </div>
                                    <div className="min-w-0">
                                      <h3 className="font-extrabold text-slate-900 text-base truncate">
                                        {item.name}
                                      </h3>
                                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md mt-0.5">
                                        {item.badge}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isConn ? (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Connected</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span>Offline</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                  {item.desc}
                                </p>

                                {isConn && (
                                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 truncate mb-4">
                                    <span className="text-slate-400 font-normal">Status: </span>
                                    <span>{item.connectedInfo}</span>
                                  </div>
                                )}
                              </div>

                              {/* Action Button */}
                              <div className="pt-2">
                                {isConn ? (
                                  <button
                                    onClick={item.onConfigure}
                                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 shadow-xs"
                                  >
                                    <Settings size={13} className="text-slate-600" />
                                    <span>Configure</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={item.onConnect}
                                    className={cn(
                                      "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm",
                                      item.btnColor
                                    )}
                                  >
                                    <Plus size={14} />
                                    <span>Connect</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category 3: Dedicated Coming Soon Integrations */}
                  {comingSoonConnectors.length > 0 && (
                    <div className="pt-8 border-t border-slate-200/80 space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
                          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                            Coming Soon Integrations
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                            {comingSoonConnectors.length} Scheduled
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                          Scheduled to go live soon by platform administrator
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {comingSoonConnectors.map((item) => (
                          <div
                            key={item.key}
                            className="bg-white rounded-3xl border border-amber-200/80 bg-amber-50/15 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md relative group"
                          >
                            <div>
                              {/* Header */}
                              <div className="flex items-start justify-between gap-3.5 mb-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-xs shrink-0">
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-extrabold text-slate-900 text-base truncate">
                                      {item.name}
                                    </h3>
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md mt-0.5">
                                      {item.badge}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Sparkles size={11} /> Coming Soon
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {item.desc}
                              </p>

                              {/* Coming soon notice */}
                              <div className="px-3.5 py-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-medium text-amber-900 mb-4 flex items-center gap-1.5">
                                <Clock size={13} className="text-amber-600 shrink-0" />
                                <span>Scheduled to go live soon by admin.</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                              <button
                                onClick={() => openComingSoon({ name: item.name, key: item.key })}
                                className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300 shadow-xs"
                              >
                                <Clock size={13} className="text-amber-700" />
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

        {/* YouTube Configuration Modal */}
        {isYouTubeConfigModalOpen && (
          <YouTubeConfigModal
            isOpen={isYouTubeConfigModalOpen}
            onClose={() => setIsYouTubeConfigModalOpen(false)}
            client={client}
            onSaved={(updatedClient) => {
              setClient(updatedClient);
              setToast({ msg: 'YouTube configuration saved!', type: 'success' });
              setTimeout(() => setToast(null), 3000);
            }}
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

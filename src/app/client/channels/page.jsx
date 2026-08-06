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
  Calendar
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import WhatsAppConfigModal from '@/components/channels/WhatsAppConfigModal';
import FacebookConfigModal from '@/components/channels/FacebookConfigModal';
import InstagramConfigModal from '@/components/channels/InstagramConfigModal';
import OneDriveConfigModal, { OneDriveIcon } from '@/components/channels/OneDriveConfigModal';
import GoogleCalendarConfigModal, { GoogleCalendarIcon } from '@/components/channels/GoogleCalendarConfigModal';
import GoogleSheetsConfigModal, { GoogleSheetsIcon } from '@/components/channels/GoogleSheetsConfigModal';
import GoogleDocsConfigModal, { GoogleDocsIcon } from '@/components/channels/GoogleDocsConfigModal';
import GoogleSlidesConfigModal, { GoogleSlidesIcon } from '@/components/channels/GoogleSlidesConfigModal';
import ZohoConfigModal, { ZohoIcon } from '@/components/channels/ZohoConfigModal';
import { Sparkles } from 'lucide-react';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import GoogleNewsConfigModal, { GoogleNewsIcon } from '@/components/channels/GoogleNewsConfigModal';

const FacebookIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GmailIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
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
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFacebookConfigModalOpen, setIsFacebookConfigModalOpen] = useState(false);
  const [isInstagramConfigModalOpen, setIsInstagramConfigModalOpen] = useState(false);
  const [isOneDriveConfigModalOpen, setIsOneDriveConfigModalOpen] = useState(false);
  const [isGoogleCalendarConfigModalOpen, setIsGoogleCalendarConfigModalOpen] = useState(false);
  const [isGoogleSheetsConfigModalOpen, setIsGoogleSheetsConfigModalOpen] = useState(false);
  const [isGoogleDocsConfigModalOpen, setIsGoogleDocsConfigModalOpen] = useState(false);
  const [isGoogleSlidesConfigModalOpen, setIsGoogleSlidesConfigModalOpen] = useState(false);
  const [isZohoConfigModalOpen, setIsZohoConfigModalOpen] = useState(false);
  const [isGoogleNewsConfigModalOpen, setIsGoogleNewsConfigModalOpen] = useState(false);
  const [isYouTubeConfigModalOpen, setIsYouTubeConfigModalOpen] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const [fbLoading, setFbLoading] = useState(false);
  const [igLoading, setIgLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const fetchClient = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const clientId = typeof user.client === 'object' ? (user.client?.id || user.client?._id) : user.client;
      if (!clientId) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/clients/${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data);
      if (isManualRefresh) {
        setToast({ msg: 'Channels updated', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.warn('Failed to fetch client', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load the Meta / Facebook JS SDK once on mount
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) return;
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = () => {
      window.FB && window.FB.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID || '991147863536661',
        version: 'v20.0',
        cookie: true,
        xfbml: false,
      });
    };
    document.body.appendChild(script);
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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
          await axios.post(
            `${apiUrl}/api/auth/instagram/oauth-callback`,
            {
              code,
              redirect_uri: `${window.location.origin}/client/channels`
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await fetchClient();
          setToast({ msg: 'Γ£à Instagram account connected!', type: 'success' });
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
} else if (params.get('gmail_error')) {
  setToast({ msg: `Gmail connection failed: ${params.get('gmail_error')}`, type: 'error' });
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
}    // OneDrive callback
else if (params.get('onedrive_connected') === 'true') {
  fetchClient();
  setToast({ msg: 'Γ£à OneDrive connected successfully!', type: 'success' });
  setTimeout(() => setToast(null), 4000);
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
} else if (params.get('onedrive_error')) {
  setToast({ msg: `OneDrive connection failed: ${params.get('onedrive_error')}`, type: 'error' });
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
// Google Calendar callback
else if (params.get('google_calendar_connected') === 'true') {
  fetchClient();
  setToast({ msg: 'Γ£à Google Calendar connected successfully!', type: 'success' });
  setTimeout(() => setToast(null), 4000);
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
} else if (params.get('google_calendar_error')) {
  setToast({ msg: `Google Calendar connection failed: ${params.get('google_calendar_error')}`, type: 'error' });
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
// Google Sheets callback
else if (params.get('google_sheets_connected') === 'true') {
  fetchClient();
  setToast({ msg: 'Γ£à Google Sheets connected successfully!', type: 'success' });
  setTimeout(() => setToast(null), 4000);
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
} else if (params.get('google_sheets_error')) {
  setToast({ msg: `Google Sheets connection failed: ${params.get('google_sheets_error')}`, type: 'error' });
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
// Google Docs callback
else if (params.get('gdocs_connected') === 'true') {
  fetchClient();
  setToast({ msg: 'Γ£à Google Docs connected successfully!', type: 'success' });
  setTimeout(() => setToast(null), 4000);
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
} else if (params.get('gdocs_error')) {
  const err = params.get('gdocs_error');
  const msg = err === 'access_denied' ? 'Google Docs permission was cancelled.' : `Google Docs connection failed: ${err}`;
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
// Google Slides callback
else if (params.get('gslides_connected') === 'true') {
  fetchClient();
  setToast({ msg: 'Γ£à Google Slides connected successfully!', type: 'success' });
  setTimeout(() => setToast(null), 4000);
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
} else if (params.get('gmail_error')) {
  const err = params.get('gmail_error');
  const msg = err === 'access_denied' ? 'Google OAuth permission was cancelled.' : `Google connection failed: ${err}`;
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
// Google Calendar callback
else if (params.get('google_calendar_connected') === 'true') {
  setToast({ msg: 'Google Calendar connected successfully!', type: 'success' });
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
} else if (params.get('google_calendar_error')) {
  setToast({ msg: `Google Calendar connection failed: ${params.get('google_calendar_error')}`, type: 'error' });
}
  }, []);

const handleWhatsAppSaved = (updatedClient) => {
  setClient(updatedClient);
  setToast({ msg: 'WhatsApp configured', type: 'success' });
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

const handleZohoSaved = (updatedClient) => {
  setClient(updatedClient);
  setToast({ msg: 'Zoho configured', type: 'success' });
  setTimeout(() => setToast(null), 3000);
};

const isWhatsAppConnected = Boolean(client?.whatsapp_access_token && client?.whatsapp_phone_number_id);
const isFacebookConnected = Boolean(client?.facebook_enabled && client?.facebook_config?.page_id);
const isInstagramConnected = Boolean(client?.instagram_enabled && (client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id || client?.instagram_config?.access_token));
const isGmailConnected = Boolean(client?.gmail_enabled && (client?.gmail_config?.email_address || client?.gmail_config?.email || client?.gmail_config?.token || client?.gmail_config?.access_token));
const isOneDriveConnected = Boolean(client?.onedrive_enabled);
const isGoogleCalendarConnected = Boolean(client?.google_calendar_enabled);
const isGoogleSheetsConnected = Boolean(client?.google_sheets_enabled);
const isGoogleDocsConnected = Boolean(client?.google_docs_enabled);
const isGoogleSlidesConnected = Boolean(client?.google_slides_enabled);
const isZohoConnected = Boolean(client?.zoho_enabled);
const isYouTubeConnected = Boolean(client?.youtube_enabled);

const connectedCount = [isWhatsAppConnected, isFacebookConnected, isInstagramConnected, isGmailConnected, isOneDriveConnected, isGoogleCalendarConnected, isGoogleSheetsConnected, isGoogleDocsConnected, isGoogleSlidesConnected, isZohoConnected, isYouTubeConnected].filter(Boolean).length;

const handleConnectGmail = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/gmail/connect`, {
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/google-calendar/connect`, {
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
  const redirectUri = encodeURIComponent(`${origin}/client/settings`);
  window.location.href = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=991147863536661&config_id=1048515390903125&extras=%7B%22version%22%3A%22v4%22%2C%22sessionInfoVersion%22%3A%223%22%2C%22featureType%22%3A%22whatsapp_business_app_onboarding%22%7D&redirect_uri=${redirectUri}`;
};

const handleFacebookConnect = () => {
  if (!window.FB) {
    setToast({ msg: 'Facebook SDK not loaded yet. Please try again.', type: 'error' });
    setTimeout(() => setToast(null), 4000);
    return;
  }
  setFbLoading(true);
  window.FB.login((response) => {
    (async () => {
      if (response.status !== 'connected') {
        setFbLoading(false);
        setToast({ msg: 'Facebook login was cancelled or failed.', type: 'error' });
        setTimeout(() => setToast(null), 4000);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
        const res = await axios.post(
          `${apiUrl}/api/auth/facebook/embedded-signup`,
          { access_token: response.authResponse.accessToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClient(prev => ({ ...prev, ...res.data.facebook_config ? { facebook_config: res.data.facebook_config, facebook_enabled: true } : {} }));
        await fetchClient();
        setToast({ msg: 'Γ£à Facebook Page connected!', type: 'success' });
        setTimeout(() => setToast(null), 4000);
      } catch (err) {
        const msg = err?.response?.data?.error || 'Failed to connect Facebook.';
        setToast({ msg, type: 'error' });
        setTimeout(() => setToast(null), 5000);
      } finally {
        setFbLoading(false);
      }
    })();
  }, {
    scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_messaging',
    return_scopes: true,
  });
};

const handleInstagramConnect = () => {
  // Use Instagram Business Login OAuth flow
  const redirectUri = encodeURIComponent(`${window.location.origin}/client/channels`);
  const instagramOAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1704328300882543&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=instagram`;
  window.location.href = instagramOAuthUrl;
};

return (
  <DashboardLayout role="CLIENT">
    <div className="max-w-5xl mx-auto pb-16 px-4 sm:px-6 relative font-['Times_New_Roman',_Georgia,_serif]">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg font-medium text-xs bg-slate-900 text-white animate-in fade-in duration-200">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Clean Header */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Channels</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-normal">Connect your social messaging accounts to automate replies.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            <strong className="text-slate-700">{connectedCount}</strong> of 9 connected
          </span>
          <button
            onClick={() => fetchClient(true)}
            disabled={refreshing}
            className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={cn(refreshing && "animate-spin text-emerald-600")} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 py-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-50/60 rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {/* --- WHATSAPP CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
                    <MessageCircle size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">WhatsApp</h3>
                    <p className="text-[11px] text-slate-400">Cloud API</p>
                  </div>
                </div>

                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    isWhatsAppConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isWhatsAppConnected ? "bg-emerald-500" : "bg-slate-300")} />
                    <span>{isWhatsAppConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Official WhatsApp Business Cloud API for automated messaging and customer support.
              </p>

              {/* Details */}
              {isWhatsAppConnected ? (
                <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Business Name</span>
                    <span className="font-medium text-slate-700 truncate">{client?.business_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Phone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 truncate">{client?.phone_number || 'N/A'}</span>
                      <CopyButton text={client?.phone_number} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">WABA ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 truncate">{client?.whatsapp_waba_id || 'N/A'}</span>
                      <CopyButton text={client?.whatsapp_waba_id} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No WhatsApp account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isWhatsAppConnected ? (
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={handleWhatsAppConnect}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>


          {/* --- FACEBOOK CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
                    <FacebookIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">Facebook</h3>
                    <p className="text-[11px] text-slate-400">Messenger</p>
                  </div>
                </div>

                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    isFacebookConnected ? "bg-blue-50 text-blue-700 border border-blue-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isFacebookConnected ? "bg-blue-500" : "bg-slate-300")} />
                    <span>{isFacebookConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Connect your Facebook Business Pages to automate Messenger customer interactions.
              </p>

              {/* Details */}
              {isFacebookConnected ? (
                <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Page Name</span>
                    <span className="font-medium text-slate-700 truncate">{client?.facebook_config?.page_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Page ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 truncate">{client?.facebook_config?.page_id || 'N/A'}</span>
                      <CopyButton text={client?.facebook_config?.page_id} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Facebook Page connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isFacebookConnected ? (
                <button
                  onClick={() => setIsFacebookConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={handleFacebookConnect}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>


          {/* --- INSTAGRAM CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100/80 shrink-0">
                    <InstagramIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">Instagram</h3>
                    <p className="text-[11px] text-slate-400">Direct Message</p>
                  </div>
                </div>

                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    isInstagramConnected ? "bg-pink-50 text-pink-700 border border-pink-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isInstagramConnected ? "bg-pink-500" : "bg-slate-300")} />
                    <span>{isInstagramConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Automate replies for Instagram DMs, story mentions, and customer comments.
              </p>

              {/* Details */}
              {isInstagramConnected ? (
                <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account Name</span>
                    <span className="font-medium text-slate-700 truncate">{client?.instagram_config?.page_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Instagram ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 truncate">{client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id || 'N/A'}</span>
                      <CopyButton text={client?.instagram_config?.instagram_business_id || client?.instagram_config?.instagram_business_account_id} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Instagram account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isInstagramConnected ? (
                <button
                  onClick={() => setIsInstagramConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={handleInstagramConnect}
                  className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>

          {/* --- GMAIL CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100/80 shrink-0">
                    <GmailIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">Gmail</h3>
                    <p className="text-[11px] text-slate-400">Email Sync</p>
                  </div>
                </div>

                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    isGmailConnected ? "bg-red-50 text-red-700 border border-red-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isGmailConnected ? "bg-red-500" : "bg-slate-300")} />
                    <span>{isGmailConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Connect your Google Workspace or Gmail account to send and receive emails.
              </p>

              {/* Details */}
              {isGmailConnected ? (
                <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email Address</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 truncate">{client?.gmail_config?.email_address || client?.gmail_config?.email || 'Connected'}</span>
                      <CopyButton text={client?.gmail_config?.email_address || client?.gmail_config?.email} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Gmail account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleConnectGmail}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                  isGmailConnected
                    ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                    : "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {isGmailConnected ? <RefreshCw size={14} className="text-slate-400" /> : <Plus size={14} />}
                <span>{isGmailConnected ? 'Reconnect' : 'Connect'}</span>
              </button>
            </div>
          </div>

          {/* --- ONEDRIVE CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center border border-[#0078D4]/20 shrink-0">
                    <OneDriveIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">OneDrive</h3>
                    <p className="text-[11px] text-slate-400">Document Backup</p>
                  </div>
                </div>

                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    isOneDriveConnected ? "bg-[#0078D4]/10 text-[#0078D4] border border-[#0078D4]/20" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isOneDriveConnected ? "bg-[#0078D4]" : "bg-slate-300")} />
                    <span>{isOneDriveConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                Automatically back up all documents received across channels to your Microsoft OneDrive.
              </p>

              {/* Details */}
              {isOneDriveConnected ? (
                <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                    <span className="font-medium text-slate-700 truncate">{client?.onedrive_config?.account_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Drive Name</span>
                    <span className="font-medium text-slate-700 truncate">{client?.onedrive_config?.drive_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Last Sync</span>
                    <span className="font-medium text-slate-700 truncate">
                      {client?.onedrive_config?.last_sync_time
                        ? new Date(client.onedrive_config.last_sync_time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No OneDrive account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isOneDriveConnected ? (
                <button
                  onClick={() => setIsOneDriveConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsOneDriveConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#0078D4] hover:bg-[#106EBE] text-white"
                >
                  <Plus size={14} />
                  <span>Connect OneDrive</span>
                </button>
              )}
            </div>
          </div>

          {/* --- GOOGLE CALENDAR CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
                    <GoogleCalendarIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">Google Calendar</h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Appointment & Event Sync</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                    isGoogleCalendarConnected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-slate-50 text-slate-500 border-slate-200/60"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isGoogleCalendarConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )} />
                    <span>{isGoogleCalendarConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
              </div>

              {/* Body Info */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Sync lead appointments, customer meeting requests from WhatsApp/CRM into Google Calendar.
              </p>

              {isGoogleCalendarConnected ? (
                <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_calendar_config?.account_email || 'Connected'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Timezone</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_calendar_config?.timezone || 'Asia/Kolkata'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Last Sync</span>
                    <span className="font-medium text-slate-700 truncate">
                      {client?.google_calendar_config?.last_sync_time
                        ? new Date(client.google_calendar_config.last_sync_time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Google Calendar account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isGoogleCalendarConnected ? (
                <button
                  onClick={() => setIsGoogleCalendarConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsGoogleCalendarConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Plus size={14} />
                  <span>Connect Google Calendar</span>
                </button>
              )}
            </div>
          </div>

          {/* --- GOOGLE SHEETS CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
                    <GoogleSheetsIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">Google Sheets</h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Real-time Lead Export</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                    isGoogleSheetsConnected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-slate-50 text-slate-500 border-slate-200/60"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isGoogleSheetsConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )} />
                    <span>{isGoogleSheetsConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
              </div>

              {/* Body Info */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Export incoming leads, WhatsApp messages, orders, and CRM contacts into live Google Spreadsheets.
              </p>

              {isGoogleSheetsConnected ? (
                <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_sheets_config?.account_email || 'Connected'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Spreadsheet</span>
                    <span className="font-medium text-emerald-700 truncate">{client?.google_sheets_config?.spreadsheet_name || 'UWOConnect Leads'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rows Exported</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_sheets_config?.rows_synced || 0} Rows</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Google Sheets account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isGoogleSheetsConnected ? (
                <button
                  onClick={() => setIsGoogleSheetsConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsGoogleSheetsConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#0F9D58] hover:bg-[#0B8043] text-white shadow-xs"
                >
                  <Plus size={14} />
                  <span>Connect Google Sheets</span>
                </button>
              )}
            </div>
          </div>

          {/* --- GOOGLE DOCS CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
                    <GoogleDocsIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">Google Docs</h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Automated Contracts & Briefs</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                    isGoogleDocsConnected
                      ? "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20"
                      : "bg-slate-50 text-slate-500 border-slate-200/60"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isGoogleDocsConnected ? "bg-[#4285F4] animate-pulse" : "bg-slate-400"
                    )} />
                    <span>{isGoogleDocsConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
              </div>

              {/* Body Info */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Auto-generate customer contracts, order receipts, proposals, and lead summary briefs in Google Docs.
              </p>

              {isGoogleDocsConnected ? (
                <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_docs_config?.account_email || 'Connected'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Default Document</span>
                    <span className="font-medium text-blue-700 truncate">{client?.google_docs_config?.default_doc_name || 'UWOConnect Documents'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Documents Created</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_docs_config?.docs_created_count || 0} Documents</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Google Docs account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isGoogleDocsConnected ? (
                <button
                  onClick={() => setIsGoogleDocsConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsGoogleDocsConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-xs"
                >
                  <Plus size={14} />
                  <span>Connect Google Docs</span>
                </button>
              )}
            </div>
          </div>

          {/* --- GOOGLE SLIDES CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 shrink-0">
                    <GoogleSlidesIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">Google Slides</h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Automated Pitch Decks & Slides</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                    isGoogleSlidesConnected
                      ? "bg-[#F4B400]/10 text-[#F4B400] border-[#F4B400]/20"
                      : "bg-slate-50 text-slate-500 border-slate-200/60"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isGoogleSlidesConnected ? "bg-[#F4B400] animate-pulse" : "bg-slate-400"
                    )} />
                    <span>{isGoogleSlidesConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
              </div>

              {/* Body Info */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Auto-generate sales pitch decks, product catalog showcases, and client presentation decks in Google Slides.
              </p>

              {isGoogleSlidesConnected ? (
                <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_slides_config?.account_email || 'Connected'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Default Presentation</span>
                    <span className="font-medium text-amber-700 truncate">{client?.google_slides_config?.default_presentation_name || 'UWOConnect Presentation'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Slide Decks Created</span>
                    <span className="font-medium text-slate-700 truncate">{client?.google_slides_config?.presentations_created_count || 0} Decks</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Google Slides account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isGoogleSlidesConnected ? (
                <button
                  onClick={() => setIsGoogleSlidesConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsGoogleSlidesConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#F4B400] hover:bg-[#E3A300] text-white shadow-xs"
                >
                  <Plus size={14} />
                  <span>Connect Google Slides</span>
                </button>
              )}
            </div>
          </div>

          {/* --- ZOHO CARD --- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
            <div>
              {/* Header */}
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100/80 shrink-0">
                    <ZohoIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">Zoho CRM</h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Sync CRM Leads & Data</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors",
                    isZohoConnected
                      ? "bg-[#E62C2D]/10 text-[#E62C2D] border-[#E62C2D]/20"
                      : "bg-slate-50 text-slate-500 border-slate-200/60"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isZohoConnected ? "bg-[#E62C2D] animate-pulse" : "bg-slate-400"
                    )} />
                    <span>{isZohoConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
              </div>

              {/* Body Info */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Auto-sync leads, manage customer relationships, and streamline ticket operations with Zoho CRM and Desk.
              </p>

              {isZohoConnected ? (
                <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Status</span>
                    <span className="font-medium text-emerald-600 truncate">Authenticated</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No Zoho account connected.</p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {isZohoConnected ? (
                <button
                  onClick={() => setIsZohoConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  <Settings size={14} className="text-slate-400" />
                  <span>Configure</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsZohoConfigModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#E62C2D] hover:bg-[#c92424] text-white shadow-xs"
                >
                  <Plus size={14} />
                  <span>Connect Zoho</span>
                </button>
              )}
            </div>

            {/* --- YOUTUBE CARD --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[380px]">
              <div>
                {/* Header */}
                <div className="flex flex-col gap-3.5 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FF0000] flex items-center justify-center border border-red-100/80 shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">YouTube</h3>
                      <p className="text-[11px] text-slate-400">Video & Channel Management</p>
                    </div>
                  </div>

                  <div>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                      isYouTubeConnected ? "bg-red-50 text-red-700 border border-red-200/50" : "bg-slate-100 text-slate-400"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", isYouTubeConnected ? "bg-red-500" : "bg-slate-300")} />
                      <span>{isYouTubeConnected ? 'Connected' : 'Not Connected'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Connect your YouTube channel to manage videos, schedule uploads, and sync content with your WhatsApp broadcast campaigns.
                </p>

                {/* Details */}
                {isYouTubeConnected ? (
                  <div className="space-y-4 py-4 border-t border-slate-100 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Channel</span>
                      <span className="font-medium text-slate-700 truncate">{client?.youtube_config?.channel_title || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email</span>
                      <span className="font-medium text-slate-700 truncate">{client?.youtube_config?.email || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Channel ID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700 truncate">{client?.youtube_config?.channel_id || 'N/A'}</span>
                        <CopyButton text={client?.youtube_config?.channel_id} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No YouTube channel connected.</p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isYouTubeConnected ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { window.location.href = '/client/youtube'; }}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-xs"
                    >
                      <Settings size={14} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={async () => {
                        setYoutubeLoading(true);
                        try {
                          const token = localStorage.getItem('token');
                          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/youtube/connect`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (res.data.url) window.location.href = res.data.url;
                        } catch (err) {
                          setToast({ msg: 'Failed to reconnect YouTube', type: 'error' });
                          setTimeout(() => setToast(null), 4000);
                        } finally { setYoutubeLoading(false); }
                      }}
                      disabled={youtubeLoading}
                      className="py-2.5 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 disabled:opacity-50"
                      title="Reconnect YouTube"
                    >
                      <RefreshCw size={14} className={cn("text-slate-400", youtubeLoading && "animate-spin")} />
                      <span>Reconnect</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      setYoutubeLoading(true);
                      try {
                        const token = localStorage.getItem('token');
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/youtube/connect`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.data.url) window.location.href = res.data.url;
                      } catch (err) {
                        setToast({ msg: 'Failed to connect YouTube', type: 'error' });
                        setTimeout(() => setToast(null), 4000);
                      } finally { setYoutubeLoading(false); }
                    }}
                    disabled={youtubeLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-[#FF0000] hover:bg-[#CC0000] text-white disabled:opacity-50"
                  >
                    {youtubeLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    <span>Connect YouTube</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* WhatsApp Configuration Modal */}
      <WhatsAppConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        client={client}
        onSaved={handleWhatsAppSaved}
      />

      {/* Facebook Configuration Modal */}
      <FacebookConfigModal
        isOpen={isFacebookConfigModalOpen}
        onClose={() => setIsFacebookConfigModalOpen(false)}
        client={client}
        onSaved={handleFacebookSaved}
      />

      {/* Instagram Configuration Modal */}
      <InstagramConfigModal
        isOpen={isInstagramConfigModalOpen}
        onClose={() => setIsInstagramConfigModalOpen(false)}
        client={client}
        onSaved={handleInstagramSaved}
      />

      {/* OneDrive Configuration Modal */}
      <OneDriveConfigModal
        isOpen={isOneDriveConfigModalOpen}
        onClose={() => setIsOneDriveConfigModalOpen(false)}
        client={client}
        onSaved={handleOneDriveSaved}
      />

      {/* Google Calendar Configuration Modal */}
      <GoogleCalendarConfigModal
        isOpen={isGoogleCalendarConfigModalOpen}
        onClose={() => setIsGoogleCalendarConfigModalOpen(false)}
        client={client}
        onSaved={handleGoogleCalendarSaved}
      />

      {/* Google Sheets Configuration Modal */}
      <GoogleSheetsConfigModal
        isOpen={isGoogleSheetsConfigModalOpen}
        onClose={() => setIsGoogleSheetsConfigModalOpen(false)}
        client={client}
        onSaved={handleGoogleSheetsSaved}
      />

      {/* Google Docs Configuration Modal */}
      <GoogleDocsConfigModal
        isOpen={isGoogleDocsConfigModalOpen}
        onClose={() => setIsGoogleDocsConfigModalOpen(false)}
        client={client}
        onSaved={handleGoogleDocsSaved}
      />

      {/* Google Slides Configuration Modal */}
      <GoogleSlidesConfigModal
        isOpen={isGoogleSlidesConfigModalOpen}
        onClose={() => setIsGoogleSlidesConfigModalOpen(false)}
        client={client}
        onSaved={handleGoogleSlidesSaved}
      />

      {/* Zoho Configuration Modal */}
      <ZohoConfigModal
        isOpen={isZohoConfigModalOpen}
        onClose={() => setIsZohoConfigModalOpen(false)}
        client={client}
        onSaved={handleZohoSaved}
      />
    </div>
  </DashboardLayout>

);
};

export default ClientChannelsPage;

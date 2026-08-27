'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Mail,
  Loader2,
  ArrowRight,
  HelpCircle,
  PhoneCall,
  Bot,
  Brain,
  ShoppingBag,
  FileCheck,
  Receipt,
  FileText,
  Users,
  Check,
  X,
  Link2,
  Share2,
  SlidersHorizontal,
  LayoutDashboard,
  Video,
  Eye,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

// ═════════════════════════════════════════════════════════════════════════════════
// ── BRAND LOGOS (same as Admin Plans page) ──
// ═════════════════════════════════════════════════════════════════════════════════

const WhatsAppLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

const FacebookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
  </svg>
);

const InstagramLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
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

const YouTubeLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z" fill="white"/>
  </svg>
);

const GmailLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4"/>
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853"/>
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335"/>
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F"/>
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04"/>
  </svg>
);

const OutlookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
    <path d="M28 14 L44 20 L44 28 L28 34 L28 14Z" fill="#106EBE" />
  </svg>
);

const OneDriveLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M34.5 35H12C7.6 35 4 31.4 4 27C4 23 7 19.7 11 19.1C11.5 13.4 16.3 9 22 9C27.2 9 31.6 12.6 32.7 17.6C33.3 17.4 33.9 17.3 34.5 17.3C38.6 17.3 42 20.7 42 24.8C42 28.9 38.6 35 34.5 35Z" fill="#0078D4"/>
    <path d="M34.5 35H18C14.7 35 12 32.3 12 29C12 26 14.2 23.5 17.2 23.1C17.6 18.8 21.2 15.5 25.5 15.5C29.4 15.5 32.7 18.2 33.5 22C33.8 21.9 34.2 21.8 34.5 21.8C37.5 21.8 40 24.3 40 27.3C40 30.3 37.5 35 34.5 35Z" fill="#28A8E8"/>
  </svg>
);

const GoogleMapsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M24 4C15.2 4 8 11.2 8 20C8 29.5 20.3 42.4 22.8 44.9C23.5 45.6 24.5 45.6 25.2 44.9C27.7 42.4 40 29.5 40 20C40 11.2 32.8 4 24 4Z" fill="#EA4335"/>
    <path d="M24 12C19.6 12 16 15.6 16 20C16 24.4 19.6 28 24 28C28.4 28 32 24.4 32 20C32 15.6 28.4 12 24 12Z" fill="#34A853"/>
    <circle cx="24" cy="20" r="5" fill="#4285F4"/>
  </svg>
);

const GoogleDocsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#4285F4" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#A1C2FA"/>
    <rect x="15" y="20" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="26" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="32" width="11" height="2.5" rx="1.25" fill="white" />
  </svg>
);

const GoogleSheetsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#0F9D58" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#87CEAC"/>
    <rect x="15" y="19" width="18" height="16" rx="1" fill="white"/>
    <line x1="15" y1="24.5" x2="33" y2="24.5" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="15" y1="30" x2="33" y2="30" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="24" y1="19" x2="24" y2="35" stroke="#0F9D58" strokeWidth="1.5"/>
  </svg>
);

const GoogleSlidesLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#F4B400" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#FFE082"/>
    <rect x="15" y="19" width="18" height="14" rx="1.5" fill="white" />
    <rect x="17.5" y="21.5" width="13" height="9" rx="1" fill="#F4B400" />
  </svg>
);

const GoogleNewsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="6" y="8" width="36" height="32" rx="6" fill="#4285F4" />
    <rect x="12" y="15" width="12" height="12" rx="2" fill="white" />
    <rect x="28" y="15" width="8" height="3" rx="1.5" fill="white" />
    <rect x="28" y="20" width="8" height="3" rx="1.5" fill="#EA4335" />
    <rect x="28" y="25" width="8" height="3" rx="1.5" fill="#34A853" />
    <rect x="12" y="31" width="24" height="3" rx="1.5" fill="#FBBC04" />
  </svg>
);

const ZohoLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect width="48" height="48" rx="12" fill="#E42528"/>
    <text x="24" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Z</text>
  </svg>
);

const GoogleCalendarLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="8" width="32" height="32" rx="4" fill="#4285F4" />
    <rect x="11" y="15" width="26" height="22" rx="2" fill="white"/>
    <rect x="14" y="19" width="5" height="4" rx="0.5" fill="#EA4335"/>
    <rect x="21.5" y="19" width="5" height="4" rx="0.5" fill="#34A853"/>
    <rect x="29" y="19" width="5" height="4" rx="0.5" fill="#FBBC04"/>
    <rect x="14" y="26" width="5" height="4" rx="0.5" fill="#4285F4"/>
    <rect x="21.5" y="26" width="5" height="4" rx="0.5" fill="#EA4335"/>
    <rect x="29" y="26" width="5" height="4" rx="0.5" fill="#34A853"/>
    <rect x="16" y="6" width="3" height="6" rx="1.5" fill="#4285F4"/>
    <rect x="29" y="6" width="3" height="6" rx="1.5" fill="#4285F4"/>
  </svg>
);

// ── KEY → FRIENDLY NAME MAP ──
const getKeyFriendlyName = (key) => {
  const map = {
    channel_whatsapp: 'WhatsApp Business',
    channel_instagram: 'Instagram Direct',
    channel_facebook: 'Facebook Messenger',
    channel_youtube: 'YouTube Community',
    connector_gmail: 'Gmail',
    connector_outlook: 'Microsoft Outlook',
    connector_google_maps: 'Google Maps',
    connector_google_docs: 'Google Docs',
    connector_onedrive: 'OneDrive',
    connector_google_sheets: 'Google Sheets',
    connector_google_slides: 'Google Slides',
    connector_google_news: 'Google News Feed',
    connector_zoho: 'Zoho CRM',
    connector_google_calendar: 'Google Calendar',
    feature_team_dashboard: 'Team Dashboard',
    feature_quotation: 'Quotation',
    feature_invoice: 'Invoice',
    feature_proposal: 'Proposal',
    feature_catalog: 'Product Catalog',
    feature_payment: 'Payment Gateway',
    feature_crm: 'CRM',
    feature_autoreply: 'Auto Reply Bot',
    feature_voice_video_call: 'Voice & Video Call',
  };
  if (map[key]) return map[key];
  // fallback: prettify key
  return key.replace(/^(channel_|connector_|feature_)/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// ── LOGO RESOLVER ──
const getFeatureBrandLogo = (key, size = 22) => {
  const k = key ? key.toLowerCase() : '';

  if (k.includes('whatsapp')) return <WhatsAppLogo size={size} />;
  if (k.includes('instagram')) return <InstagramLogo size={size} />;
  if (k.includes('facebook') || k.includes('messenger')) return <FacebookLogo size={size} />;
  if (k.includes('youtube')) return <YouTubeLogo size={size} />;
  if (k.includes('gmail')) return <GmailLogo size={size} />;
  if (k.includes('outlook')) return <OutlookLogo size={size} />;
  if (k.includes('map')) return <GoogleMapsLogo size={size} />;
  if (k.includes('doc')) return <GoogleDocsLogo size={size} />;
  if (k.includes('onedrive') || k.includes('one_drive')) return <OneDriveLogo size={size} />;
  if (k.includes('sheet')) return <GoogleSheetsLogo size={size} />;
  if (k.includes('slide')) return <GoogleSlidesLogo size={size} />;
  if (k.includes('news')) return <GoogleNewsLogo size={size} />;
  if (k.includes('zoho')) return <ZohoLogo size={size} />;
  if (k.includes('calendar')) return <GoogleCalendarLogo size={size} />;

  if (k.includes('team') || k.includes('dashboard')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <LayoutDashboard size={13} />
      </div>
    );
  }
  if (k.includes('quote') || k.includes('quotation')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <FileCheck size={13} />
      </div>
    );
  }
  if (k.includes('invoice')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Receipt size={13} />
      </div>
    );
  }
  if (k.includes('proposal')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <FileText size={13} />
      </div>
    );
  }
  if (k.includes('catalog') || k.includes('catelog')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <ShoppingBag size={13} />
      </div>
    );
  }
  if (k.includes('payment')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <CreditCard size={13} />
      </div>
    );
  }
  if (k.includes('crm')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Users size={13} />
      </div>
    );
  }
  if (k.includes('auto') || k.includes('reply')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Bot size={13} />
      </div>
    );
  }
  if (k.includes('voice') || k.includes('video') || k.includes('call')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Video size={13} />
      </div>
    );
  }

  return (
    <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-slate-600 to-slate-500 text-white flex items-center justify-center shadow-2xs shrink-0">
      <Zap size={13} />
    </div>
  );
};

export default function ClientPlansPage() {
  const [plans, setPlans] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeNotes, setUpgradeNotes] = useState('');
  const [submittingUpgrade, setSubmittingUpgrade] = useState(false);
  const [toast, setToast] = useState(null);
  // Plan Details modal
  const [planDetailPlan, setPlanDetailPlan] = useState(null);

  useEffect(() => {
    fetchPlansAndProfile();
  }, []);

  const fetchPlansAndProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('uwo_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const [plansRes, profileRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/plans/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const pData = profileRes.value.data.client || profileRes.value.data;
        setClient(pData);
      }

      if (plansRes.status === 'fulfilled' && plansRes.value?.data?.results) {
        const activeOnly = plansRes.value.data.results.filter(p => p.is_active !== false);
        setPlans(activeOnly);
      } else {
        setPlans([
          {
            id: 'plan-starter',
            name: 'Starter',
            description: 'Essential channels, workspace connectors & sales invoicing for small businesses.',
            price: 999,
            currency: 'INR',
            billing_cycle: 'Monthly',
            is_active: true,
            feature_keys: [
              'channel_whatsapp', 'channel_instagram',
              'connector_gmail', 'connector_google_docs',
              'feature_team_dashboard', 'feature_quotation', 'feature_invoice'
            ]
          },
          {
            id: 'plan-pro',
            name: 'Professional',
            description: 'Complete suite with full channels, cloud connectors, catalog, proposals & payment processing.',
            price: 2999,
            currency: 'INR',
            billing_cycle: 'Monthly',
            is_active: true,
            is_popular: true,
            feature_keys: [
              'channel_whatsapp', 'channel_instagram', 'channel_facebook', 'channel_youtube',
              'connector_gmail', 'connector_outlook', 'connector_google_maps', 'connector_google_docs', 'connector_onedrive', 'connector_google_sheets',
              'feature_team_dashboard', 'feature_quotation', 'feature_invoice', 'feature_proposal', 'feature_catalog', 'feature_payment', 'feature_crm', 'feature_autoreply'
            ]
          },
          {
            id: 'plan-enterprise',
            name: 'Enterprise',
            description: 'Unlimited access to all 4 communication channels, all 8 cloud connectors, and all 9 business modules.',
            price: 9999,
            currency: 'INR',
            billing_cycle: 'Monthly',
            is_active: true,
            feature_keys: [
              'channel_whatsapp', 'channel_instagram', 'channel_facebook', 'channel_youtube',
              'connector_gmail', 'connector_outlook', 'connector_google_maps', 'connector_google_docs', 'connector_onedrive', 'connector_google_sheets', 'connector_google_slides', 'connector_google_news',
              'feature_team_dashboard', 'feature_quotation', 'feature_invoice', 'feature_proposal', 'feature_catalog', 'feature_payment', 'feature_crm', 'feature_autoreply', 'feature_voice_video_call'
            ]
          }
        ]);
      }
    } catch (err) {
      console.warn('Error loading client plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpgradeModal = (plan) => {
    setSelectedPlanForUpgrade(plan);
    setUpgradeNotes('');
    setIsUpgradeModalOpen(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProcessPayment = async () => {
    if (!selectedPlanForUpgrade) return;
    setSubmittingUpgrade(true);
    
    try {
      const token = localStorage.getItem('uwo_token');
      const isLoaded = await loadRazorpayScript();
      
      if (!isLoaded) {
        setToast({ msg: "Razorpay SDK failed to load. Are you online?", type: "error" });
        setSubmittingUpgrade(false);
        return;
      }

      // 1. Create order on backend
      const orderRes = await axios.post(
        `${API_BASE_URL}/api/payments/create-order/`,
        {
          plan: selectedPlanForUpgrade.name,
          billing_cycle: (selectedPlanForUpgrade.billing_cycle || 'Monthly').toUpperCase()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpay_order_id, razorpay_key_id, amount, order_id } = orderRes.data;

      // If the plan is free and gets auto-activated, orderRes.data might just return success
      if (amount === 0) {
        setClient(prev => ({
          ...prev,
          plan: selectedPlanForUpgrade.name,
          plan_name: selectedPlanForUpgrade.name
        }));
        setIsUpgradeModalOpen(false);
        setToast({ msg: `Switched to ${selectedPlanForUpgrade.name} successfully!`, type: 'success' });
        setSubmittingUpgrade(false);
        return;
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: razorpay_key_id,
        amount: amount.toString(),
        currency: "INR",
        name: "UWOConnect",
        description: `Upgrade to ${selectedPlanForUpgrade.name}`,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/payments/verify-order/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order_id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setClient(prev => ({
                ...prev,
                plan: selectedPlanForUpgrade.name,
                plan_name: selectedPlanForUpgrade.name
              }));
              setIsUpgradeModalOpen(false);
              setToast({ msg: `Payment Successful! ${selectedPlanForUpgrade.name} is now active.`, type: 'success' });
            } else {
              setToast({ msg: "Payment verification failed.", type: "error" });
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            setToast({ msg: "Payment verification failed on server.", type: "error" });
          }
        },
        prefill: {
          name: client?.business_name || "",
          email: client?.email || "",
          contact: client?.phone_number || ""
        },
        theme: {
          color: "#4f46e5" // Indigo 600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        setToast({ msg: response.error.description || "Payment Failed", type: "error" });
      });

      rzp.open();
    } catch (err) {
      console.error('Plan upgrade error:', err);
      setToast({ msg: `Failed to initiate payment. Please try again.`, type: 'error' });
    } finally {
      setSubmittingUpgrade(false);
    }
  };

  const isCurrentPlan = (plan) => {
    if (!client) return false;
    const clientPlanId = client.assigned_plan || client.plan_id || client.plan?.id || '';
    const clientPlanName = (client.plan_name || client.plan || '').toLowerCase();
    const targetPlanName = (plan.name || '').toLowerCase();
    
    return clientPlanId === plan.id || clientPlanName.includes(targetPlanName) || targetPlanName.includes(clientPlanName);
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[350] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl font-semibold text-xs bg-emerald-900 text-white border border-emerald-700 animate-in fade-in slide-in-from-top-3 duration-200">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                SUBSCRIPTION PLANS
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                {plans.length} Active Plans
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              View official workspace subscription plans configured by your administrator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs">
              <Layers size={15} className="text-emerald-600" />
              <span className="text-slate-600 font-medium">
                Current Plan: <strong className="text-slate-900 font-bold">{client?.plan_name || client?.plan || 'Professional'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-slate-50/80 rounded-3xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          /* Plans Cards Grid - EXACT same layout as Admin */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const active = isCurrentPlan(plan);
              const keys = plan.feature_keys || plan.metadata?.feature_keys || [];
              const dynamicChannelCount = keys.filter(k => k.startsWith('channel_')).length;
              const dynamicConnectorCount = keys.filter(k => k.startsWith('connector_')).length;
              const dynamicFeatureCount = keys.filter(k => k.startsWith('feature_')).length;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "bg-white rounded-3xl border shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between relative group",
                    active
                      ? "border-[#059669] ring-2 ring-[#059669]/20"
                      : "border-slate-200/90"
                  )}
                >
                  <div>
                    {/* Top Header: Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          {plan.name.toUpperCase()}
                        </h3>
                        {plan.is_popular && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                            Popular
                          </span>
                        )}
                      </div>
                      {active ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={10} /> ACTIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[32px] line-clamp-2 mb-4 font-normal">
                      {plan.description}
                    </p>

                    {/* Mini Feature Logo Icons Preview */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                      {keys.slice(0, 8).map(fKey => (
                        <div key={fKey} title={fKey} className="hover:scale-110 transition-transform">
                          {getFeatureBrandLogo(fKey, 18)}
                        </div>
                      ))}
                      {keys.length > 8 && (
                        <span className="text-[10px] font-bold text-slate-500 ml-1">
                          +{keys.length - 8} more
                        </span>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="mb-5 pb-4 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">
                          {plan.currency === 'INR' ? '\u20B9' : '$'}{plan.price ? plan.price.toLocaleString() : '0'}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          / {plan.billing_cycle?.toLowerCase() || 'monthly'}
                        </span>
                      </div>
                    </div>

                    {/* Feature & Channel Metrics List */}
                    <div className="space-y-3 mb-6 text-xs text-slate-700 font-medium">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Zap size={14} className="text-emerald-600" /> Features
                        </span>
                        <span className="font-bold text-slate-900">{dynamicFeatureCount} Features</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Link2 size={14} className="text-teal-600" /> Channels
                        </span>
                        <span className="font-bold text-slate-900">{dynamicChannelCount} Channels</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Share2 size={14} className="text-blue-600" /> Connectors
                        </span>
                        <span className="font-bold text-slate-900">{dynamicConnectorCount} Connectors</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {/* View Details Button — always shown */}
                    <button
                      onClick={() => setPlanDetailPlan(plan)}
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Eye size={14} /> View Plan Details
                    </button>

                    {active ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-default shadow-2xs"
                      >
                        <CheckCircle2 size={14} /> Current Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenUpgradeModal(plan)}
                        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <SlidersHorizontal size={14} /> Select Plan / Upgrade
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PLAN DETAILS MODAL ── */}
        {planDetailPlan && (() => {
          const keys = planDetailPlan.feature_keys || planDetailPlan.metadata?.feature_keys || [];
          const channels   = keys.filter(k => k.startsWith('channel_'));
          const connectors = keys.filter(k => k.startsWith('connector_'));
          const features   = keys.filter(k => k.startsWith('feature_'));
          const isActive   = isCurrentPlan(planDetailPlan);

          const Section = ({ title, items, accentClass, badgeClass }) => (
            items.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${badgeClass}`}>
                    {title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{items.length} included</span>
                  <div className="flex-1 h-px bg-slate-100 ml-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(fKey => (
                    <div key={fKey} className={`flex items-center gap-3 p-3 rounded-xl border bg-white ${accentClass} transition-all`}>
                      <div className="shrink-0">{getFeatureBrandLogo(fKey, 26)}</div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{getKeyFriendlyName(fKey)}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{fKey}</p>
                      </div>
                      <CheckCircle2 size={14} className="ml-auto text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          );

          return (
            <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Eye size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          {planDetailPlan.name.toUpperCase()} — PLAN DETAILS
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={9} /> Your Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {planDetailPlan.currency === 'INR' ? '₹' : '$'}{planDetailPlan.price?.toLocaleString()} / {planDetailPlan.billing_cycle?.toLowerCase()} · {keys.length} total items
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPlanDetailPlan(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Description */}
                <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 shrink-0">
                  <p className="text-xs text-slate-600 leading-relaxed">{planDetailPlan.description}</p>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">

                  {/* Summary badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-bold">
                      <MessageSquare size={12} /> {channels.length} Channels
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-[11px] font-bold">
                      <Share2 size={12} /> {connectors.length} Connectors
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                      <Zap size={12} /> {features.length} Features
                    </span>
                  </div>

                  <Section
                    title="Channels"
                    items={channels}
                    accentClass="border-blue-100 hover:border-blue-200 hover:bg-blue-50/30"
                    badgeClass="bg-blue-50 text-blue-700 border-blue-200"
                  />
                  <Section
                    title="Connectors"
                    items={connectors}
                    accentClass="border-teal-100 hover:border-teal-200 hover:bg-teal-50/30"
                    badgeClass="bg-teal-50 text-teal-700 border-teal-200"
                  />
                  <Section
                    title="Features"
                    items={features}
                    accentClass="border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/30"
                    badgeClass="bg-emerald-50 text-emerald-700 border-emerald-200"
                  />

                  {keys.length === 0 && (
                    <div className="py-10 text-center text-slate-400 text-sm">
                      No features assigned to this plan yet.
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
                  <button
                    onClick={() => setPlanDetailPlan(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  {!isActive && (
                    <button
                      onClick={() => { setPlanDetailPlan(null); handleOpenUpgradeModal(planDetailPlan); }}
                      className="px-5 py-2 text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <ArrowRight size={14} /> Select This Plan
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

        {/* Upgrade Modal */}
        {isUpgradeModalOpen && selectedPlanForUpgrade && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <CreditCard size={18} className="text-indigo-600" />
                    Complete Payment
                  </h3>
                  <p className="text-xs text-slate-500">Secure checkout via Razorpay</p>
                </div>
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 text-xs space-y-2">
                  <div className="flex justify-between items-center text-indigo-900">
                    <span className="font-bold">Subscription Plan:</span>
                    <span>{selectedPlanForUpgrade.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-indigo-900">
                    <span className="font-bold">Billing Cycle:</span>
                    <span className="capitalize">{selectedPlanForUpgrade.billing_cycle?.toLowerCase() || 'Monthly'}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-indigo-200/60 flex justify-between items-center text-indigo-950 font-black text-base">
                    <span>Total Amount:</span>
                    <span>{selectedPlanForUpgrade.currency === 'INR' ? '\u20B9' : '$'}{selectedPlanForUpgrade.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={submittingUpgrade}
                  className="px-5 py-2 text-xs font-bold bg-[#02042B] hover:bg-[#1a1c3d] text-white rounded-xl shadow-sm flex items-center gap-2 transition-all"
                >
                  {submittingUpgrade ? (
                    <><Loader2 size={14} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Lock size={14} /> Pay {selectedPlanForUpgrade.currency === 'INR' ? '\u20B9' : '$'}{selectedPlanForUpgrade.price}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

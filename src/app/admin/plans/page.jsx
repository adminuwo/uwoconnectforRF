'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import {
  Layers,
  Plus,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronDown,
  Trash2,
  Loader2,
  Search,
  Zap,
  Users,
  Link2,
  Share2,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  Clock,
  Bot,
  Brain,
  Receipt,
  FileText,
  FileCheck,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Activity,
  Shield,
  MessageSquare,
  Mail,
  Target,
  Inbox,
  FolderSync,
  HelpCircle,
  Database,
  LayoutDashboard,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

// ═════════════════════════════════════════════════════════════════════════════════
// ── AUTHENTIC BRAND VECTOR LOGOS & EMBLEMS ──
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
      <linearGradient id="igFinalGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igFinalGrad)"/>
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

// ── LOGO RESOLVER FOR EVERY ENTITLEMENT ──
const getFeatureBrandLogo = (key, size = 22) => {
  const k = key ? key.toLowerCase() : '';

  // 1. Channels (WhatsApp, Instagram, Facebook, YouTube)
  if (k.includes('whatsapp')) return <WhatsAppLogo size={size} />;
  if (k.includes('instagram')) return <InstagramLogo size={size} />;
  if (k.includes('facebook') || k.includes('messenger')) return <FacebookLogo size={size} />;
  if (k.includes('youtube')) return <YouTubeLogo size={size} />;

  // 2. Connectors (Gmail, Outlook, Google Maps, Google Docs, OneDrive, Google Sheets, Google Slides, Google News Feed)
  if (k.includes('gmail')) return <GmailLogo size={size} />;
  if (k.includes('outlook')) return <OutlookLogo size={size} />;
  if (k.includes('map')) return <GoogleMapsLogo size={size} />;
  if (k.includes('doc')) return <GoogleDocsLogo size={size} />;
  if (k.includes('onedrive') || k.includes('one_drive')) return <OneDriveLogo size={size} />;
  if (k.includes('sheet')) return <GoogleSheetsLogo size={size} />;
  if (k.includes('slide')) return <GoogleSlidesLogo size={size} />;
  if (k.includes('news')) return <GoogleNewsLogo size={size} />;

  // 3. Features (Team Dashboard, Quotation, Invoice, Proposal, Catalog, Payment, CRM, Auto Reply, Voice / Video Call)
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

  // Fallback
  return (
    <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-slate-600 to-slate-500 text-white flex items-center justify-center shadow-2xs shrink-0">
      <Zap size={13} />
    </div>
  );
};

// ── EXACT SYSTEM ENTITLEMENTS (CHANNELS, CONNECTORS, FEATURES) ──
const DEFAULT_FEATURES = [
  // ── Channels (4) ──
  {
    id: 'f-wa',
    key: 'channel_whatsapp',
    name: 'WhatsApp',
    category: 'Channels',
    feature_type: 'Channel',
    description: 'Official WhatsApp Cloud API & automated conversations',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-ig',
    key: 'channel_instagram',
    name: 'Instagram',
    category: 'Channels',
    feature_type: 'Channel',
    description: 'Instagram Direct automation & real-time messaging',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-fb',
    key: 'channel_facebook',
    name: 'Facebook',
    category: 'Channels',
    feature_type: 'Channel',
    description: 'Facebook Messenger & page conversation sync',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-yt',
    key: 'channel_youtube',
    name: 'YouTube',
    category: 'Channels',
    feature_type: 'Channel',
    description: 'YouTube comments, audience replies & engagement',
    is_active: true,
    plan_count: 2
  },

  // ── Connectors (8) ──
  {
    id: 'f-gmail',
    key: 'connector_gmail',
    name: 'Gmail',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google Gmail workspace integration & email sync',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-outlook',
    key: 'connector_outlook',
    name: 'Microsoft Outlook',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Microsoft Outlook email & enterprise calendar connector',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-gmap',
    key: 'connector_google_maps',
    name: 'Google Maps',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google Maps location intelligence & business verification',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-gdoc',
    key: 'connector_google_docs',
    name: 'Google Docs',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google Docs templates & automated client documents',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-onedrive',
    key: 'connector_onedrive',
    name: 'OneDrive',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Microsoft OneDrive cloud storage & file synchronization',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-gsheet',
    key: 'connector_google_sheets',
    name: 'Google Sheets',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google Sheets automated spreadsheets & live data export',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-gslides',
    key: 'connector_google_slides',
    name: 'Google Slides',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google Slides presentations & pitch deck creator',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-gnews',
    key: 'connector_google_news',
    name: 'Google News Feed',
    category: 'Connectors',
    feature_type: 'Connector',
    description: 'Google News live feed monitoring & real-time alerts',
    is_active: true,
    plan_count: 1
  },

  // ── Features (9) ──
  {
    id: 'f-team-dash',
    key: 'feature_team_dashboard',
    name: 'Team Dashboard',
    category: 'Features',
    feature_type: 'Module',
    description: 'Collaborative team workspace & performance dashboard',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-quotes',
    key: 'feature_quotation',
    name: 'Quotation',
    category: 'Features',
    feature_type: 'Module',
    description: 'Instant sales quotations, estimates & digital approvals',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-invoice',
    key: 'feature_invoice',
    name: 'Invoice',
    category: 'Features',
    feature_type: 'Module',
    description: 'Automated GST & tax invoicing with payment receipts',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-proposals',
    key: 'feature_proposal',
    name: 'Proposal',
    category: 'Features',
    feature_type: 'Module',
    description: 'Multi-page branded client business proposals',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-catalog',
    key: 'feature_catalog',
    name: 'Catalog',
    category: 'Features',
    feature_type: 'Module',
    description: 'Products & services catalog with pricing & SKUs',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-payment',
    key: 'feature_payment',
    name: 'Payment',
    category: 'Features',
    feature_type: 'Module',
    description: 'Payment gateway integration, checkout links & transaction tracking',
    is_active: true,
    plan_count: 2
  },
  {
    id: 'f-crm',
    key: 'feature_crm',
    name: 'CRM',
    category: 'Features',
    feature_type: 'Module',
    description: 'Client directory, contact management & deal pipeline stages',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-autoreply',
    key: 'feature_autoreply',
    name: 'Auto Reply',
    category: 'Features',
    feature_type: 'Module',
    description: 'Automated 24/7 instant replies & trigger bot flows',
    is_active: true,
    plan_count: 3
  },
  {
    id: 'f-voice-video',
    key: 'feature_voice_video_call',
    name: 'Voice / Video Call',
    category: 'Features',
    feature_type: 'Module',
    description: 'Integrated voice calling & video meeting capabilities',
    is_active: true,
    plan_count: 2
  },
];

// ── DEFAULT BENCHMARK PLANS ──
const INITIAL_PLANS = [
  {
    id: 'plan-starter',
    name: 'Starter',
    badge: 'STARTER',
    status: 'ACTIVE',
    description: 'Essential channels, workspace connectors & sales invoicing for small businesses.',
    price: 999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: [
      'channel_whatsapp',
      'channel_instagram',
      'channel_facebook',
      'connector_gmail',
      'connector_google_docs',
      'connector_google_sheets',
      'feature_team_dashboard',
      'feature_quotation',
      'feature_invoice',
      'feature_crm',
      'feature_autoreply'
    ],
    channel_count: 3,
    connector_count: 3,
    client_count: 8,
    is_popular: false
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    badge: 'PROFESSIONAL',
    status: 'ACTIVE',
    description: 'Complete suite with full channels, cloud connectors, catalog, proposals & payment processing.',
    price: 2999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: [
      'channel_whatsapp',
      'channel_instagram',
      'channel_facebook',
      'channel_youtube',
      'connector_gmail',
      'connector_outlook',
      'connector_google_maps',
      'connector_google_docs',
      'connector_onedrive',
      'connector_google_sheets',
      'feature_team_dashboard',
      'feature_quotation',
      'feature_invoice',
      'feature_proposal',
      'feature_catalog',
      'feature_payment',
      'feature_crm',
      'feature_autoreply'
    ],
    channel_count: 4,
    connector_count: 6,
    client_count: 14,
    is_popular: true
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    badge: 'ENTERPRISE',
    status: 'ACTIVE',
    description: 'Unlimited access to all 4 communication channels, all 8 cloud connectors, and all 9 business modules.',
    price: 9999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: DEFAULT_FEATURES.map(f => f.key),
    channel_count: 4,
    connector_count: 8,
    client_count: 5,
    is_popular: false
  }
];

// ── SAMPLE CLIENT ASSIGNMENTS ──
const INITIAL_CLIENTS = [
  { id: 'c-1', business_name: 'Yugamc Business Hub', client_name: 'Yugam Admin', email: 'admin@yugamc.com', plan_id: 'plan-pro', plan_name: 'Professional', custom_added: ['feature_voice_video_call'], custom_removed: [], status: 'ACTIVE' },
  { id: 'c-2', business_name: 'Unified Web Options Pvt Ltd', client_name: 'Rahul Sharma', email: 'rahul@uwo.in', plan_id: 'plan-enterprise', plan_name: 'Enterprise', custom_added: [], custom_removed: [], status: 'ACTIVE' },
  { id: 'c-3', business_name: 'Apex Digital Workspace', client_name: 'Aman Verma', email: 'aman@apexdigital.com', plan_id: 'plan-starter', plan_name: 'Starter', custom_added: ['feature_payment'], custom_removed: [], status: 'ACTIVE' },
  { id: 'c-4', business_name: 'Matrix Cloud Solutions', client_name: 'Pooja Nair', email: 'pooja@matrixcloud.io', plan_id: 'plan-pro', plan_name: 'Professional', custom_added: [], custom_removed: [], status: 'ACTIVE' },
];

export default function AdminPlansPage() {
  // ── States ──
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'features' | 'assignments'
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filters
  const [featureSearch, setFeatureSearch] = useState('');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState('ALL');
  const [assignmentSearch, setAssignmentSearch] = useState('');

  // ── Centered Modal States ──
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);

  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [selectedClientForPlanChange, setSelectedClientForPlanChange] = useState(null);
  const [tempSelectedPlanId, setTempSelectedPlanId] = useState('');

  const [isManageClientFeaturesOpen, setIsManageClientFeaturesOpen] = useState(false);
  const [clientForFeatureManagement, setClientForFeatureManagement] = useState(null);

  // Active Category Filter inside Plan Modal
  const [modalActiveCategory, setModalActiveCategory] = useState('ALL');

  // ── Form States ──
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    billing_cycle: 'Monthly',
    currency: 'INR',
    status: 'ACTIVE',
    selected_feature_keys: []
  });

  const [featureForm, setFeatureForm] = useState({
    name: '',
    key: '',
    category: 'Channels',
    feature_type: 'Channel',
    description: '',
    is_active: true
  });

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Fetch Initial Data from Backend API ──
  useEffect(() => {
    fetchBackendData();
  }, []);

  const fetchBackendData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const [plansRes, featuresRes, clientsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/plans/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/features/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/admin/clients/overview/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (featuresRes.status === 'fulfilled' && featuresRes.value.data?.results?.length > 0) {
        setFeatures(featuresRes.value.data.results);
      }
      if (plansRes.status === 'fulfilled' && plansRes.value.data?.results?.length > 0) {
        const mappedPlans = plansRes.value.data.results.map(p => {
          const keys = p.feature_keys || p.metadata?.feature_keys || [];
          return {
            id: p.id,
            name: p.name,
            badge: p.name.toUpperCase(),
            status: p.is_active ? 'ACTIVE' : 'INACTIVE',
            description: p.description || 'Custom Enterprise Plan',
            price: p.price || 0,
            billing_cycle: p.billing_cycle || 'Monthly',
            currency: p.currency || 'INR',
            feature_keys: keys,
            channel_count: keys.filter(k => k.startsWith('channel_')).length,
            connector_count: keys.filter(k => k.startsWith('connector_')).length,
            client_count: p.client_count || 0,
            is_popular: p.is_popular || false
          };
        });
        setPlans(mappedPlans);
      }
      if (clientsRes.status === 'fulfilled' && (clientsRes.value.data?.clients || clientsRes.value.data?.results)) {
        const fetchedClients = clientsRes.value.data.clients || clientsRes.value.data.results;
        if (fetchedClients.length > 0) {
          setClients(fetchedClients.map(c => ({
            id: c.id,
            business_name: c.business_name || 'Client Workspace',
            client_name: c.client_name || c.name || c.email,
            email: c.email,
            plan_id: c.plan_id || 'plan-pro',
            plan_name: c.plan || 'Professional',
            custom_added: c.custom_added || [],
            custom_removed: c.custom_removed || [],
            status: c.status || 'ACTIVE'
          })));
        }
      }
    } catch (err) {
      console.warn('[Plans Page] Using local data pool:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Category Grouping & Lookup ──
  const CATEGORY_ORDER = ['Channels', 'Connectors', 'Features'];

  const featureCategoryMap = useMemo(() => {
    const map = new Map();
    features.forEach(f => map.set(f.key, f.category));
    return map;
  }, [features]);

  const categorizedFeatures = useMemo(() => {
    const map = {};
    features.forEach(f => {
      const cat = f.category || 'Features';
      if (!map[cat]) map[cat] = [];
      map[cat].push(f);
    });
    return map;
  }, [features]);

  const uniqueCategories = useMemo(() => {
    const cats = Object.keys(categorizedFeatures);
    return CATEGORY_ORDER.filter(c => cats.includes(c)).concat(cats.filter(c => !CATEGORY_ORDER.includes(c)));
  }, [categorizedFeatures]);

  // ── Summary Metrics ──
  const summaryMetrics = useMemo(() => {
    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.status === 'ACTIVE').length;
    const totalFeatures = features.length;
    const clientsAssigned = clients.length || plans.reduce((acc, p) => acc + (p.client_count || 0), 0);
    return { totalPlans, activePlans, totalFeatures, clientsAssigned };
  }, [plans, features, clients]);

  // ── Filtered Features ──
  const filteredFeaturesList = useMemo(() => {
    return features.filter(f => {
      const matchesSearch = !featureSearch || 
        f.name.toLowerCase().includes(featureSearch.toLowerCase()) || 
        f.key.toLowerCase().includes(featureSearch.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(featureSearch.toLowerCase()));
      const matchesCategory = featureCategoryFilter === 'ALL' || f.category === featureCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [features, featureSearch, featureCategoryFilter]);

  // ── Filtered Client Assignments ──
  const filteredClientsList = useMemo(() => {
    return clients.filter(c => {
      return !assignmentSearch ||
        c.business_name.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
        c.plan_name.toLowerCase().includes(assignmentSearch.toLowerCase());
    });
  }, [clients, assignmentSearch]);

  // ── Select All within a Category in Form ──
  const toggleSelectAllCategory = (cat) => {
    const catFeatKeys = (categorizedFeatures[cat] || []).map(f => f.key);
    const currentSelected = new Set(planForm.selected_feature_keys);
    const allSelected = catFeatKeys.every(k => currentSelected.has(k));

    if (allSelected) {
      catFeatKeys.forEach(k => currentSelected.delete(k));
    } else {
      catFeatKeys.forEach(k => currentSelected.add(k));
    }

    setPlanForm(prev => ({
      ...prev,
      selected_feature_keys: Array.from(currentSelected)
    }));
  };

  const toggleSingleFeatureInForm = (featKey) => {
    const currentSelected = new Set(planForm.selected_feature_keys);
    if (currentSelected.has(featKey)) {
      currentSelected.delete(featKey);
    } else {
      currentSelected.add(featKey);
    }
    setPlanForm(prev => ({
      ...prev,
      selected_feature_keys: Array.from(currentSelected)
    }));
  };

  // ── Open Create Plan Modal ──
  const handleOpenCreatePlan = () => {
    setModalActiveCategory('ALL');
    setPlanForm({
      name: '',
      description: '',
      price: '',
      billing_cycle: 'Monthly',
      currency: 'INR',
      status: 'ACTIVE',
      selected_feature_keys: DEFAULT_FEATURES.slice(0, 8).map(f => f.key)
    });
    setIsCreatePlanModalOpen(true);
  };

  // ── Open Edit / Manage Plan Modal ──
  const handleOpenManagePlan = (plan) => {
    setEditingPlan(plan);
    setModalActiveCategory('ALL');
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      billing_cycle: plan.billing_cycle || 'Monthly',
      currency: plan.currency || 'INR',
      status: plan.status || 'ACTIVE',
      selected_feature_keys: plan.feature_keys || []
    });
    setIsEditPlanModalOpen(true);
  };

  // ── Submit Create Plan ──
  const handleCreatePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showToast('Please enter a plan name', 'error');
      return;
    }

    const newPlanObj = {
      id: `plan-${Date.now()}`,
      name: planForm.name.trim(),
      badge: planForm.name.toUpperCase().trim(),
      status: planForm.status,
      description: planForm.description || 'Custom Enterprise Plan',
      price: Number(planForm.price) || 0,
      billing_cycle: planForm.billing_cycle,
      currency: planForm.currency,
      feature_keys: planForm.selected_feature_keys,
      channel_count: planForm.selected_feature_keys.filter(k => k.startsWith('channel_')).length,
      connector_count: planForm.selected_feature_keys.filter(k => k.startsWith('connector_')).length,
      client_count: 0,
      is_popular: false
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/plans/`, {
        name: newPlanObj.name,
        description: newPlanObj.description,
        price: newPlanObj.price,
        billing_cycle: newPlanObj.billing_cycle,
        currency: newPlanObj.currency,
        is_active: newPlanObj.status === 'ACTIVE',
        feature_keys: newPlanObj.feature_keys
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log('Saved to local pool:', err);
    }

    setPlans(prev => [newPlanObj, ...prev]);
    setIsCreatePlanModalOpen(false);
    showToast(`Plan "${newPlanObj.name}" created successfully!`);
  };

  // ── Submit Edit Plan ──
  const handleEditPlanSubmit = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updatedPlanObj = {
      ...editingPlan,
      name: planForm.name.trim(),
      badge: planForm.name.toUpperCase().trim(),
      status: planForm.status,
      description: planForm.description,
      price: Number(planForm.price) || 0,
      billing_cycle: planForm.billing_cycle,
      currency: planForm.currency,
      feature_keys: planForm.selected_feature_keys,
      channel_count: planForm.selected_feature_keys.filter(k => k.startsWith('channel_')).length,
      connector_count: planForm.selected_feature_keys.filter(k => k.startsWith('connector_')).length,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/plans/${editingPlan.id}/`, {
        name: updatedPlanObj.name,
        description: updatedPlanObj.description,
        price: updatedPlanObj.price,
        billing_cycle: updatedPlanObj.billing_cycle,
        currency: updatedPlanObj.currency,
        is_active: updatedPlanObj.status === 'ACTIVE',
        feature_keys: updatedPlanObj.feature_keys
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log('Updated in state pool:', err);
    }

    setPlans(prev => prev.map(p => p.id === editingPlan.id ? updatedPlanObj : p));
    setIsEditPlanModalOpen(false);
    setEditingPlan(null);
    showToast(`Plan "${updatedPlanObj.name}" updated successfully!`);
  };

  // ── Delete Plan ──
  const handleDeletePlan = async (planId, planName) => {
    if (!confirm(`Are you sure you want to delete "${planName}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/plans/${planId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log('Removed from local pool:', err);
    }

    setPlans(prev => prev.filter(p => p.id !== planId));
    setIsEditPlanModalOpen(false);
    showToast(`Plan "${planName}" deleted.`, 'error');
  };

  // ── Open Add Feature Modal ──
  const handleOpenAddFeature = () => {
    setFeatureForm({
      name: '',
      key: '',
      category: 'Channels',
      feature_type: 'Channel',
      description: '',
      is_active: true
    });
    setIsAddFeatureModalOpen(true);
  };

  // ── Submit Add Feature ──
  const handleAddFeatureSubmit = async (e) => {
    e.preventDefault();
    if (!featureForm.name.trim()) {
      showToast('Please enter feature name', 'error');
      return;
    }

    const generatedKey = featureForm.key.trim() || 
      featureForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

    const newFeatureObj = {
      id: `feat-${Date.now()}`,
      name: featureForm.name.trim(),
      key: generatedKey,
      category: featureForm.category,
      feature_type: featureForm.feature_type,
      description: featureForm.description || `${featureForm.name} functionality`,
      is_active: featureForm.is_active,
      plan_count: 0
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/features/`, {
        name: newFeatureObj.name,
        key: newFeatureObj.key,
        category: newFeatureObj.category,
        feature_type: newFeatureObj.feature_type,
        description: newFeatureObj.description,
        is_active: newFeatureObj.is_active
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log('Saved feature in local pool:', err);
    }

    setFeatures(prev => [newFeatureObj, ...prev]);
    setIsAddFeatureModalOpen(false);
    showToast(`Feature "${newFeatureObj.name}" added to catalog!`);
  };

  // ── Open Change Plan for Client ──
  const handleOpenChangeClientPlan = (client) => {
    setSelectedClientForPlanChange(client);
    setTempSelectedPlanId(client.plan_id || plans[0]?.id || '');
    setIsChangePlanModalOpen(true);
  };

  const handleSaveClientPlanChange = async () => {
    if (!selectedClientForPlanChange) return;
    const targetPlan = plans.find(p => p.id === tempSelectedPlanId);
    if (!targetPlan) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedClientForPlanChange.id}/action/`,
        { action: 'EDIT_PROFILE', plan: targetPlan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn('Persisted in local pool:', err);
    }

    setClients(prev => prev.map(c => {
      if (c.id === selectedClientForPlanChange.id) {
        return {
          ...c,
          plan_id: targetPlan.id,
          plan_name: targetPlan.name
        };
      }
      return c;
    }));

    setIsChangePlanModalOpen(false);
    showToast(`🎉 Assigned "${targetPlan.name}" plan to ${selectedClientForPlanChange.business_name}!`);
  };

  // ── Open Client Custom Feature Access Modal ──
  const handleOpenClientFeatureManagement = (client) => {
    setClientForFeatureManagement(client);
    setIsManageClientFeaturesOpen(true);
  };

  const toggleClientCustomFeature = (featKey, isCurrentlyActive) => {
    if (!clientForFeatureManagement) return;
    const clientPlan = plans.find(p => p.id === clientForFeatureManagement.plan_id);
    const isInBasePlan = clientPlan?.feature_keys?.includes(featKey);

    let updatedAdded = [...(clientForFeatureManagement.custom_added || [])];
    let updatedRemoved = [...(clientForFeatureManagement.custom_removed || [])];

    if (isInBasePlan) {
      if (isCurrentlyActive) {
        if (!updatedRemoved.includes(featKey)) updatedRemoved.push(featKey);
      } else {
        updatedRemoved = updatedRemoved.filter(k => k !== featKey);
      }
    } else {
      if (isCurrentlyActive) {
        updatedAdded = updatedAdded.filter(k => k !== featKey);
      } else {
        if (!updatedAdded.includes(featKey)) updatedAdded.push(featKey);
      }
    }

    const updatedClient = {
      ...clientForFeatureManagement,
      custom_added: updatedAdded,
      custom_removed: updatedRemoved
    };

    setClientForFeatureManagement(updatedClient);
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className={cn(
            "fixed top-6 right-6 z-[350] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl font-semibold text-xs border animate-in fade-in slide-in-from-top-3 duration-200",
            toastMessage.type === 'error' 
              ? "bg-rose-900 text-white border-rose-700" 
              : "bg-emerald-900 text-white border-emerald-700"
          )}>
            {toastMessage.type === 'error' ? (
              <AlertCircle size={16} className="text-rose-300 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* ── 1. Page Header & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                PLAN MANAGEMENT
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                {summaryMetrics.activePlans} Active Plans
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Loader2 size={11} className="animate-spin text-emerald-600" /> Syncing...
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              Create plans, manage features, and control client access.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={fetchBackendData}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Refresh plans & catalog"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
            </button>
            <button
              onClick={handleOpenCreatePlan}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus size={16} /> Create Plan
            </button>
          </div>
        </div>

        {/* ── 2. Summary Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL PLANS</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.totalPlans}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <Layers size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE PLANS</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{summaryMetrics.activePlans}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL FEATURES</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.totalFeatures}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
              <Zap size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CLIENTS ASSIGNED</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.clientsAssigned}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shrink-0">
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* ── 3. Plan Tabs Navigation ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setActiveTab('plans')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs",
              activeTab === 'plans'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Layers size={14} />
            <span>Plans</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'plans' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {plans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs",
              activeTab === 'features'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Zap size={14} />
            <span>Catalog</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'features' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {features.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs",
              activeTab === 'assignments'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Users size={14} />
            <span>Client Assignments</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'assignments' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {clients.length}
            </span>
          </button>
        </div>

        {/* ── 4. TAB 1: PLANS (3-Column Clean Card Layout) ── */}
        {activeTab === 'plans' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const keys = plan.feature_keys || [];
                const dynamicChannelCount = keys.filter(k => {
                  const cat = featureCategoryMap.get(k);
                  return cat === 'Channels' || (!cat && k.startsWith('channel_'));
                }).length;
                const dynamicConnectorCount = keys.filter(k => {
                  const cat = featureCategoryMap.get(k);
                  return cat === 'Connectors' || (!cat && k.startsWith('connector_'));
                }).length;
                const dynamicFeatureCount = keys.filter(k => {
                  const cat = featureCategoryMap.get(k);
                  return cat === 'Features' || (!cat && (k.startsWith('feature_') || (!k.startsWith('channel_') && !k.startsWith('connector_'))));
                }).length;
                const totalFeatCount = keys.length;
                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between relative group"
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
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider",
                          plan.status === 'ACTIVE' 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        )}>
                          {plan.status}
                        </span>
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
                            {plan.currency === 'INR' ? '₹' : '$'}{plan.price ? plan.price.toLocaleString() : '0'}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            / {plan.billing_cycle?.toLowerCase() || 'month'}
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
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Users size={14} className="text-slate-400" /> Assigned Clients
                          </span>
                          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 text-[11px]">
                            {plan.client_count || 0} Clients
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenManagePlan(plan)}
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <SlidersHorizontal size={14} /> Manage Plan
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 5. TAB 2: FEATURES CATALOG (Grouped by Category) ── */}
        {activeTab === 'features' && (
          <div>
            {/* Search & Add Feature Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
                <input
                  type="text"
                  placeholder="Search features, keys, modules..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={handleOpenAddFeature}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
            </div>

            {/* ── Grouped Sections ── */}
            <div className="space-y-6">
              {/* ── CHANNELS SECTION ── */}
              {(() => {
                const channelItems = filteredFeaturesList.filter(f => f.category === 'Channels');
                if (featureCategoryFilter !== 'ALL' && featureCategoryFilter !== 'Channels') return null;
                if (channelItems.length === 0 && featureSearch) return null;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                        <MessageSquare size={17} />
                      </div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Channels</h3>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                          {channelItems.length} Channels
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent ml-2" />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-blue-50/50 border-b border-blue-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                              <th className="py-3 px-6">Channel</th>
                              <th className="py-3 px-6">Type</th>
                              <th className="py-3 px-6">Used In Plans</th>
                              <th className="py-3 px-6">Status</th>
                              <th className="py-3 px-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {channelItems.map((f) => (
                              <tr key={f.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-3.5 px-6 font-bold text-slate-900">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                      {getFeatureBrandLogo(f.key, 20)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{f.name}</span>
                                      <span className="text-[10px] font-mono text-slate-400 font-normal">{f.key}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-blue-50 text-blue-700 border-blue-200">
                                    Channel
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-slate-600 font-medium">
                                  {f.plan_count || plans.filter(p => p.feature_keys?.includes(f.key)).length} Plans
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 border",
                                    f.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", f.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                                    {f.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <button
                                    onClick={() => showToast(`Channel "${f.name}" info loaded`)}
                                    className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {channelItems.length === 0 && (
                              <tr><td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">No channels found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── CONNECTORS SECTION ── */}
              {(() => {
                const connectorItems = filteredFeaturesList.filter(f => f.category === 'Connectors');
                if (featureCategoryFilter !== 'ALL' && featureCategoryFilter !== 'Connectors') return null;
                if (connectorItems.length === 0 && featureSearch) return null;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                        <Share2 size={17} />
                      </div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Connectors</h3>
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full border border-purple-200">
                          {connectorItems.length} Connectors
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent ml-2" />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-purple-50/50 border-b border-purple-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                              <th className="py-3 px-6">Connector</th>
                              <th className="py-3 px-6">Type</th>
                              <th className="py-3 px-6">Used In Plans</th>
                              <th className="py-3 px-6">Status</th>
                              <th className="py-3 px-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {connectorItems.map((f) => (
                              <tr key={f.id} className="hover:bg-purple-50/30 transition-colors">
                                <td className="py-3.5 px-6 font-bold text-slate-900">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                      {getFeatureBrandLogo(f.key, 20)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{f.name}</span>
                                      <span className="text-[10px] font-mono text-slate-400 font-normal">{f.key}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-purple-50 text-purple-700 border-purple-200">
                                    Connector
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-slate-600 font-medium">
                                  {f.plan_count || plans.filter(p => p.feature_keys?.includes(f.key)).length} Plans
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 border",
                                    f.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", f.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                                    {f.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <button
                                    onClick={() => showToast(`Connector "${f.name}" info loaded`)}
                                    className="px-3 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {connectorItems.length === 0 && (
                              <tr><td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">No connectors found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── FEATURES / MODULES SECTION ── */}
              {(() => {
                const featureItems = filteredFeaturesList.filter(f => f.category === 'Features');
                if (featureCategoryFilter !== 'ALL' && featureCategoryFilter !== 'Features') return null;
                if (featureItems.length === 0 && featureSearch) return null;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                        <Zap size={17} />
                      </div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Features</h3>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                          {featureItems.length} Modules
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent ml-2" />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-emerald-50/50 border-b border-emerald-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                              <th className="py-3 px-6">Feature</th>
                              <th className="py-3 px-6">Type</th>
                              <th className="py-3 px-6">Used In Plans</th>
                              <th className="py-3 px-6">Status</th>
                              <th className="py-3 px-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {featureItems.map((f) => (
                              <tr key={f.id} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="py-3.5 px-6 font-bold text-slate-900">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                      {getFeatureBrandLogo(f.key, 20)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{f.name}</span>
                                      <span className="text-[10px] font-mono text-slate-400 font-normal">{f.key}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-teal-50 text-teal-700 border-teal-200">
                                    Module
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-slate-600 font-medium">
                                  {f.plan_count || plans.filter(p => p.feature_keys?.includes(f.key)).length} Plans
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 border",
                                    f.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", f.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                                    {f.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <button
                                    onClick={() => showToast(`Feature "${f.name}" info loaded`)}
                                    className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {featureItems.length === 0 && (
                              <tr><td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">No features found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── 6. TAB 3: CLIENT ASSIGNMENTS ── */}
        {activeTab === 'assignments' && (
          <div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
                <input
                  type="text"
                  placeholder="Search client workspace, plan, email..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                      <th className="py-3.5 px-6">Client & Business</th>
                      <th className="py-3.5 px-6">Assigned Plan</th>
                      <th className="py-3.5 px-6">Plan Price</th>
                      <th className="py-3.5 px-6">Custom Overrides</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredClientsList.map((client) => {
                      const clientPlan = plans.find(p => p.id === client.plan_id) || plans[0];
                      const totalFeats = (clientPlan?.feature_keys?.length || 0) + (client.custom_added?.length || 0) - (client.custom_removed?.length || 0);

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <div className="flex flex-col">
                              <span>{client.business_name}</span>
                              <span className="text-[11px] text-slate-400 font-normal">{client.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                              {client.plan_name || clientPlan?.name || 'Starter'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-700">
                            ₹{clientPlan?.price ? clientPlan.price.toLocaleString() : '999'} / mo
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-700">{totalFeats} Total</span>
                              {client.custom_added?.length > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                  +{client.custom_added.length} Added
                                </span>
                              )}
                              {client.custom_removed?.length > 0 && (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                                  -{client.custom_removed.length} Revoked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenChangeClientPlan(client)}
                                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                Change Plan
                              </button>
                              <button
                                onClick={() => handleOpenClientFeatureManagement(client)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                Manage Features
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            7. CENTERED MODAL: CREATE / EDIT PLAN (With Authentic Logos!)
           ════════════════════════════════════════════════════════════════ */}
        {(isCreatePlanModalOpen || isEditPlanModalOpen) && (
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {isCreatePlanModalOpen ? 'CREATE NEW PLAN' : `EDIT PLAN: ${editingPlan?.name.toUpperCase()}`}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {isCreatePlanModalOpen ? 'Configure plan attributes & select included feature entitlements' : 'Modify plan pricing and toggle feature access'}
                  </p>
                </div>
                <button
                  onClick={() => { setIsCreatePlanModalOpen(false); setIsEditPlanModalOpen(false); }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={isCreatePlanModalOpen ? handleCreatePlanSubmit : handleEditPlanSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {/* 1. Plan Basic Info */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Professional, Growth, Agency Pro"
                        value={planForm.name}
                        onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Price (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="2999"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                          className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Short summary of target clients and tier scope"
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Billing Cycle</label>
                      <select
                        value={planForm.billing_cycle}
                        onChange={(e) => setPlanForm({ ...planForm, billing_cycle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Currency</label>
                      <select
                        value={planForm.currency}
                        onChange={(e) => setPlanForm({ ...planForm, currency: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                      <select
                        value={planForm.status}
                        onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="ACTIVE">Active ●</option>
                        <option value="INACTIVE">Inactive ○</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Feature Entitlements Section (With Logos!) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={14} className="text-emerald-600" /> FEATURE ENTITLEMENTS
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {planForm.selected_feature_keys.length} of {features.length} features enabled in this plan
                      </p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setModalActiveCategory('ALL')}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer",
                          modalActiveCategory === 'ALL' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        All
                      </button>
                      {uniqueCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setModalActiveCategory(cat)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer",
                            modalActiveCategory === cat ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature Category Blocks */}
                  <div className="space-y-4">
                    {uniqueCategories
                      .filter(cat => modalActiveCategory === 'ALL' || modalActiveCategory === cat)
                      .map((category) => {
                        const categoryFeatures = categorizedFeatures[category] || [];
                        const selectedCount = categoryFeatures.filter(f => planForm.selected_feature_keys.includes(f.key)).length;
                        const allCatSelected = categoryFeatures.length > 0 && selectedCount === categoryFeatures.length;

                        return (
                          <div
                            key={category}
                            className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                          >
                            {/* Category Header */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                  {category}
                                </span>
                                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                                  {selectedCount} / {categoryFeatures.length}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleSelectAllCategory(category)}
                                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                              >
                                {allCatSelected ? 'Deselect All' : 'Select All'}
                              </button>
                            </div>

                            {/* Feature Grid List with Logos */}
                            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                              {categoryFeatures.map((feat) => {
                                const isChecked = planForm.selected_feature_keys.includes(feat.key);
                                return (
                                  <div
                                    key={feat.key}
                                    onClick={() => toggleSingleFeatureInForm(feat.key)}
                                    className={cn(
                                      "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none group",
                                      isChecked 
                                        ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20 shadow-2xs" 
                                        : "bg-white border-slate-200/90 hover:bg-slate-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {/* Brand Logo / Icon */}
                                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform p-0.5">
                                        {getFeatureBrandLogo(feat.key, 22)}
                                      </div>

                                      <div className="min-w-0">
                                        <p className={cn("text-xs font-extrabold truncate leading-tight", isChecked ? "text-slate-900" : "text-slate-600")}>
                                          {feat.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{feat.description}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                      <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold">
                                        {feat.feature_type}
                                      </span>
                                      <div className={cn(
                                        "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                                        isChecked 
                                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                                          : "border-slate-300 bg-white"
                                      )}>
                                        {isChecked && <CheckCircle2 size={13} className="text-white" />}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0 bg-white pb-2">
                  {isEditPlanModalOpen && editingPlan ? (
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(editingPlan.id, editingPlan.name)}
                      className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete Plan
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => { setIsCreatePlanModalOpen(false); setIsEditPlanModalOpen(false); }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      {isCreatePlanModalOpen ? 'Create Plan' : 'Save Changes'}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            8. CENTERED MODAL: ADD FEATURE
           ════════════════════════════════════════════════════════════════ */}
        {isAddFeatureModalOpen && (
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">ADD FEATURE TO CATALOG</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Register a new modular entitlement into UWO Connect
                  </p>
                </div>
                <button
                  onClick={() => setIsAddFeatureModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddFeatureSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TikTok Live Chat, PDF Pro Invoice"
                    value={featureForm.name}
                    onChange={(e) => setFeatureForm({ ...featureForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Feature Key / Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated e.g. channel_tiktok"
                    value={featureForm.key}
                    onChange={(e) => setFeatureForm({ ...featureForm, key: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={featureForm.category}
                      onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Channels">Channels</option>
                      <option value="Connectors">Connectors</option>
                      <option value="Features">Features</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Type
                    </label>
                    <select
                      value={featureForm.feature_type}
                      onChange={(e) => setFeatureForm({ ...featureForm, feature_type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Channel">Channel</option>
                      <option value="Connector">Connector</option>
                      <option value="Module">Module</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Explain what this feature unlocks for the client..."
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddFeatureModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={15} /> Add Feature
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            9. CENTERED MODAL: CHANGE CLIENT PLAN
           ════════════════════════════════════════════════════════════════ */}
        {isChangePlanModalOpen && selectedClientForPlanChange && (
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">CHANGE CLIENT PLAN</h3>
                  <p className="text-xs text-slate-400">
                    Client: <strong className="text-slate-700">{selectedClientForPlanChange.business_name}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsChangePlanModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2.5 my-5">
                {plans.map((plan) => {
                  const isSelected = tempSelectedPlanId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      onClick={() => setTempSelectedPlanId(plan.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                        isSelected 
                          ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/10 shadow-xs" 
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          isSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                        )}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{plan.name}</p>
                          <p className="text-[11px] text-slate-500 font-normal">{plan.feature_keys?.length || 0} Features Included</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        ₹{plan.price.toLocaleString()} / mo
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsChangePlanModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClientPlanChange}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            10. CENTERED MODAL: CLIENT FEATURE MANAGEMENT (With Logos!)
           ════════════════════════════════════════════════════════════════ */}
        {isManageClientFeaturesOpen && clientForFeatureManagement && (
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
              
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">CLIENT FEATURE ACCESS</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {clientForFeatureManagement.business_name} (Plan: <strong>{clientForFeatureManagement.plan_name}</strong>)
                  </p>
                </div>
                <button
                  onClick={() => setIsManageClientFeaturesOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl text-xs text-emerald-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles size={15} className="text-emerald-600" /> Custom Feature Override Control
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Toggle individual features ON/OFF for this specific client workspace.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {features.map((feat) => {
                    const clientPlan = plans.find(p => p.id === clientForFeatureManagement.plan_id);
                    const isInBasePlan = clientPlan?.feature_keys?.includes(feat.key);
                    const isCustomAdded = clientForFeatureManagement.custom_added?.includes(feat.key);
                    const isCustomRemoved = clientForFeatureManagement.custom_removed?.includes(feat.key);
                    
                    const isEffectiveActive = (isInBasePlan && !isCustomRemoved) || isCustomAdded;

                    return (
                      <div
                        key={feat.key}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-0.5">
                            {getFeatureBrandLogo(feat.key, 22)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900">{feat.name}</p>
                              {isInBasePlan && (
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                                  Base Plan
                                </span>
                              )}
                              {isCustomAdded && (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                  Custom Granted
                                </span>
                              )}
                              {isCustomRemoved && (
                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded">
                                  Revoked
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{feat.category} • {feat.feature_type}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleClientCustomFeature(feat.key, isEffectiveActive)}
                          className={cn(
                            "w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer",
                            isEffectiveActive ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                          )}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-md transition-all" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end bg-white">
                <button
                  onClick={() => {
                    setIsManageClientFeaturesOpen(false);
                    showToast('Feature override permissions applied successfully!');
                  }}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

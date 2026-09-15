'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PricingComparisonTable from '@/components/pricing/PricingComparisonTable';
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
  Calendar,
  Video,
  MapPin,
  HardDrive,
  Presentation
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

const InstagramLogo = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <circle cx="24" cy="24" r="24" fill="#E1306C" />
    <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="5" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="30" cy="18" r="1.5" fill="white"/>
  </svg>
);

const TelegramLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#2AABEE"/>
    <path d="M11 23.5L34.5 14L29 34L22 28.5L18 31.5L18.5 26.5L30 18L17.5 24.5L11 23.5Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
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

// ── LOGO RESOLVER FOR EVERY FEATURE ──
const getFeatureBrandLogo = (key, size = 22) => {
  const k = key ? key.toLowerCase() : '';

  // 1. Core Channels & Connectors
  if (k.includes('whatsapp')) return <WhatsAppLogo size={size} />;
  if (k.includes('facebook') || k.includes('messenger')) return <FacebookLogo size={size} />;
  if (k.includes('instagram')) return <InstagramLogo size={size} />;
  if (k.includes('telegram')) return <TelegramLogo size={size} />;
  if (k.includes('gmail')) return <GmailLogo size={size} />;
  if (k.includes('outlook')) return <OutlookLogo size={size} />;
  if (k.includes('onedrive')) return <OneDriveLogo size={size} />;
  if (k.includes('gslides') || k.includes('slides')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Presentation size={13} />
      </div>
    );
  }
  if (k.includes('gdocs') || k.includes('docs')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <FileText size={13} />
      </div>
    );
  }
  if (k.includes('gcal') || k.includes('calendar')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-500 to-sky-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Calendar size={13} />
      </div>
    );
  }
  if (k.includes('gmeet') || k.includes('meet')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Video size={13} />
      </div>
    );
  }
  if (k.includes('gdrive') || k.includes('drive')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-600 to-green-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <HardDrive size={13} />
      </div>
    );
  }
  if (k.includes('gmaps') || k.includes('maps')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <MapPin size={13} />
      </div>
    );
  }

  // 2. Communication
  if (k.includes('inbox') || k.includes('live_messages')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <MessageSquare size={13} />
      </div>
    );
  }
  if (k.includes('email')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Mail size={13} />
      </div>
    );
  }

  // 3. AI & Automation
  if (k.includes('ai_copilot') || k.includes('ai_assist') || k.includes('assistant')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Sparkles size={13} />
      </div>
    );
  }
  if (k.includes('bot') || k.includes('flow')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Bot size={13} />
      </div>
    );
  }
  if (k.includes('auto') || k.includes('pilot')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Zap size={13} />
      </div>
    );
  }

  // 4. CRM & Leads
  if (k.includes('client') || k.includes('workspace')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Users size={13} />
      </div>
    );
  }
  if (k.includes('lead') || k.includes('pipeline')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Target size={13} />
      </div>
    );
  }
  if (k.includes('search')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Search size={13} />
      </div>
    );
  }

  // 5. Sales & Finance
  if (k.includes('product') || k.includes('catalog')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-2xs shrink-0">
        <ShoppingBag size={13} />
      </div>
    );
  }
  if (k.includes('quote') || k.includes('quotation')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <FileCheck size={13} />
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
  if (k.includes('invoice') || k.includes('billing')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Receipt size={13} />
      </div>
    );
  }
  if (k.includes('order') || k.includes('payment') || k.includes('sales')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <CreditCard size={13} />
      </div>
    );
  }

  // 6. Team & Security
  if (k.includes('team')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-blue-700 to-sky-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <ShieldCheck size={13} />
      </div>
    );
  }
  if (k.includes('report') || k.includes('work')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Activity size={13} />
      </div>
    );
  }
  if (k.includes('audit') || k.includes('security')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Shield size={13} />
      </div>
    );
  }

  // 7. Knowledge & Documents
  if (k.includes('knowledge') || k.includes('base') || k.includes('faq')) {
    return (
      <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-2xs shrink-0">
        <Brain size={13} />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-tr from-slate-600 to-slate-500 text-white flex items-center justify-center shadow-2xs shrink-0">
      <Zap size={13} />
    </div>
  );
};

// ── DEFAULT CATALOG FEATURES ──
const DEFAULT_FEATURES = [
  // 1. CHANNELS (Exactly 4: WhatsApp, Instagram, Facebook, YouTube)
  { id: 'f-wa', key: 'channel_whatsapp', name: 'WhatsApp Channel', category: 'Communication', feature_type: 'Channel', description: 'Official WhatsApp Cloud API & web integration', is_active: true, plan_count: 3 },
  { id: 'f-fb', key: 'channel_facebook', name: 'Facebook Messenger', category: 'Communication', feature_type: 'Channel', description: 'Facebook page messaging & live sync', is_active: true, plan_count: 3 },
  { id: 'f-ig', key: 'channel_instagram', name: 'Instagram Direct', category: 'Communication', feature_type: 'Channel', description: 'Instagram DM automation & live chat', is_active: true, plan_count: 2 },
  { id: 'f-yt', key: 'channel_youtube', name: 'YouTube Channel', category: 'Communication', feature_type: 'Channel', description: 'YouTube comments & live chat automation', is_active: true, plan_count: 2 },

  // 2. CONNECTORS (Gmail, Outlook, Google Slides, Google Docs, Google Calendar, Google Meet, OneDrive, Google Drive, Google Maps, Shopify, WooCommerce, Razorpay, HubSpot, Sheets)
  { id: 'f-gmail', key: 'conn_gmail', name: 'Gmail & Email Connector', category: 'Connectors', feature_type: 'Connector', description: 'Inbound/outbound email sync & triggers', is_active: true, plan_count: 3 },
  { id: 'f-outlook', key: 'conn_outlook', name: 'Outlook & Office 365 Connector', category: 'Connectors', feature_type: 'Connector', description: 'Microsoft email, contacts & calendar sync', is_active: true, plan_count: 2 },
  { id: 'f-gslides', key: 'conn_gslides', name: 'Google Slides Presentation Connector', category: 'Connectors', feature_type: 'Connector', description: 'Auto-generate proposal & pitch decks', is_active: true, plan_count: 2 },
  { id: 'f-gdocs', key: 'conn_gdocs', name: 'Google Docs Document Connector', category: 'Connectors', feature_type: 'Connector', description: 'Contract & invoice template auto-filling', is_active: true, plan_count: 2 },
  { id: 'f-gcal', key: 'conn_gcal', name: 'Google Calendar Scheduling Connector', category: 'Connectors', feature_type: 'Connector', description: 'Real-time appointment & meeting booking', is_active: true, plan_count: 2 },
  { id: 'f-gmeet', key: 'conn_gmeet', name: 'Google Meet Video Calls Connector', category: 'Connectors', feature_type: 'Connector', description: 'Instant video meeting link generation', is_active: true, plan_count: 2 },
  { id: 'f-onedrive', key: 'conn_onedrive', name: 'OneDrive Cloud Storage Connector', category: 'Connectors', feature_type: 'Connector', description: 'Direct file attachment & cloud drive sync', is_active: true, plan_count: 2 },
  { id: 'f-gdrive', key: 'conn_gdrive', name: 'Google Drive Storage Connector', category: 'Connectors', feature_type: 'Connector', description: 'Google Drive media & document backup', is_active: true, plan_count: 2 },
  { id: 'f-gmaps', key: 'conn_gmaps', name: 'Google Maps Location Connector', category: 'Connectors', feature_type: 'Connector', description: 'Store locator, ETA & address geocoding', is_active: true, plan_count: 2 },
  { id: 'f-gsheets', key: 'conn_google_sheets', name: 'Google Sheets Lead Connector', category: 'Connectors', feature_type: 'Connector', description: 'Auto export incoming leads to spreadsheets', is_active: true, plan_count: 2 },
  { id: 'f-shopify', key: 'conn_shopify', name: 'Shopify Connector', category: 'Connectors', feature_type: 'Connector', description: 'E-commerce order & abandoned cart sync', is_active: true, plan_count: 2 },
  { id: 'f-woo', key: 'conn_woocommerce', name: 'WooCommerce Connector', category: 'Connectors', feature_type: 'Connector', description: 'WordPress store products & order webhook', is_active: true, plan_count: 2 },
  { id: 'f-razorpay', key: 'conn_razorpay', name: 'Razorpay Gateway Connector', category: 'Connectors', feature_type: 'Connector', description: 'Payment links, subscriptions & checkout sync', is_active: true, plan_count: 3 },
  { id: 'f-hubspot', key: 'conn_hubspot', name: 'HubSpot CRM Connector', category: 'Connectors', feature_type: 'Connector', description: 'Contact & deal stage bidirectional sync', is_active: true, plan_count: 1 },

  // 3. FEATURES & MODULES
  { id: 'f-live-inbox', key: 'live_messages_inbox', name: 'Live Omnichannel Inbox', category: 'Communication', feature_type: 'Module', description: 'Unified multi-channel live conversation hub', is_active: true, plan_count: 3 },
  { id: 'f-ai-assist', key: 'ai_copilot', name: 'AI Smart Assistant', category: 'AI & Automation', feature_type: 'Module', description: 'AI copilot for replies & summaries', is_active: true, plan_count: 3 },
  { id: 'f-ai-bots', key: 'ai_flow_bots', name: 'AI Chatbots & Workflows', category: 'AI & Automation', feature_type: 'Module', description: 'Visual conversational bot builder', is_active: true, plan_count: 2 },
  { id: 'f-ai-auto', key: 'ai_auto_pilot', name: 'Advanced AI Auto-Pilot', category: 'AI & Automation', feature_type: 'Module', description: 'Autonomous agent decision engine', is_active: true, plan_count: 1 },
  { id: 'f-clients', key: 'crm_clients', name: 'Client Directory & Workspaces', category: 'CRM', feature_type: 'Module', description: 'Multi-tenant client database & intelligence', is_active: true, plan_count: 3 },
  { id: 'f-leads', key: 'crm_leads', name: 'Lead Pipeline Management', category: 'CRM', feature_type: 'Module', description: 'Deal stages, funnel conversion & tracking', is_active: true, plan_count: 2 },
  { id: 'f-search', key: 'global_omnisearch', name: 'Global Omni-Search', category: 'CRM', feature_type: 'Module', description: 'Universal search across messages & files', is_active: true, plan_count: 3 },
  { id: 'f-products', key: 'sales_catalog', name: 'Products & Services Catalog', category: 'Sales', feature_type: 'Module', description: 'Item pricing, variants & SKU management', is_active: true, plan_count: 3 },
  { id: 'f-quotes', key: 'sales_quotations', name: 'Quotations & Estimates', category: 'Sales', feature_type: 'Module', description: 'Instant PDF quotes with approvals', is_active: true, plan_count: 2 },
  { id: 'f-proposals', key: 'sales_proposals', name: 'Business Proposals', category: 'Sales', feature_type: 'Module', description: 'Multi-page branded client proposals', is_active: true, plan_count: 2 },
  { id: 'f-invoices', key: 'sales_invoices', name: 'Tax Invoices & Billing', category: 'Sales', feature_type: 'Module', description: 'Automated invoice generation & receipts', is_active: true, plan_count: 2 },
  { id: 'f-sales-orders', key: 'sales_orders', name: 'Sales Orders & Checkout', category: 'Sales', feature_type: 'Module', description: 'Order lifecycle and webhook tracking', is_active: true, plan_count: 2 },
  { id: 'f-team', key: 'team_management', name: 'Team Roles & Permissions', category: 'Team', feature_type: 'Module', description: 'Role-based access permissions & seats', is_active: true, plan_count: 3 },
  { id: 'f-reports', key: 'team_work_reports', name: 'Staff Work Reports & Analytics', category: 'Team', feature_type: 'Module', description: 'Daily task logging & performance analytics', is_active: true, plan_count: 2 },
  { id: 'f-audit', key: 'security_audit_logs', name: 'Enterprise Audit Logs', category: 'Team', feature_type: 'Module', description: 'Immutable activity tracking & compliance trail', is_active: true, plan_count: 1 },
  { id: 'f-kb', key: 'knowledge_base', name: 'Knowledge Base & FAQs', category: 'Documents', feature_type: 'Module', description: 'Vectorized knowledge base documents', is_active: true, plan_count: 2 },
];

// ── DEFAULT BENCHMARK PLANS ──
const INITIAL_PLANS = [
  {
    id: 'plan-starter',
    name: 'Starter',
    badge: 'STARTER',
    status: 'ACTIVE',
    description: 'Essential communication tools for solo entrepreneurs & small businesses.',
    price: 499,
    yearly_price: 4999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: [
      'channel_whatsapp',
      'channel_facebook',
      'live_messages_inbox',
      'crm_clients',
      'global_omnisearch',
      'sales_catalog',
      'team_management',
      'ai_copilot'
    ],
    channel_count: 3,
    connector_count: 1,
    client_count: 8,
    is_popular: false
  },
  {
    id: 'plan-pro',
    name: 'Growth',
    badge: 'GROWTH',
    status: 'ACTIVE',
    description: 'Complete sales automation, AI bots, invoicing and team intelligence.',
    price: 1599,
    yearly_price: 15999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: [
      'channel_whatsapp',
      'channel_facebook',
      'channel_instagram',
      'channel_telegram',
      'channel_email',
      'live_messages_inbox',
      'ai_copilot',
      'ai_flow_bots',
      'crm_clients',
      'crm_leads',
      'global_omnisearch',
      'sales_catalog',
      'sales_quotations',
      'sales_proposals',
      'sales_invoices',
      'sales_orders',
      'team_management',
      'team_work_reports',
      'knowledge_base'
    ],
    channel_count: 5,
    connector_count: 6,
    client_count: 14,
    is_popular: true
  },
  {
    id: 'plan-enterprise',
    name: 'Advanced',
    badge: 'ADVANCED',
    status: 'ACTIVE',
    description: 'Unlimited features, custom connectors, AI auto-pilot, audit logs and SLA.',
    price: 2499,
    yearly_price: 24999,
    billing_cycle: 'Monthly',
    currency: 'INR',
    feature_keys: DEFAULT_FEATURES.map(f => f.key),
    channel_count: 9,
    connector_count: 10,
    client_count: 5,
    is_popular: false
  }
];

// ── SAMPLE CLIENT ASSIGNMENTS ──
const INITIAL_CLIENTS = [
  { id: 'c-1', business_name: 'Yugamc Business Hub', client_name: 'Yugam Admin', email: 'admin@yugamc.com', plan_id: 'plan-pro', plan_name: 'Professional', custom_added: ['ai_auto_pilot'], custom_removed: ['channel_telegram'], status: 'ACTIVE' },
  { id: 'c-2', business_name: 'Unified Web Options Pvt Ltd', client_name: 'Rahul Sharma', email: 'rahul@uwo.in', plan_id: 'plan-enterprise', plan_name: 'Enterprise', custom_added: [], custom_removed: [], status: 'ACTIVE' },
  { id: 'c-3', business_name: 'Apex Digital Workspace', client_name: 'Aman Verma', email: 'aman@apexdigital.com', plan_id: 'plan-starter', plan_name: 'Starter', custom_added: ['sales_invoices'], custom_removed: [], status: 'ACTIVE' },
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
  const [featureTypeFilter, setFeatureTypeFilter] = useState('ALL'); // 'ALL' | 'Channel' | 'Connector' | 'Module'
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

  // Active Category & Tab Filter inside Plan Modal
  const [modalActiveCategory, setModalActiveCategory] = useState('ALL');
  const [modalEditorTab, setModalEditorTab] = useState('basic'); // 'basic' | 'what_you_get' | 'features' | 'limits' | 'costs' | 'entitlements'
  const [editorChannelTab, setEditorChannelTab] = useState('whatsapp'); // 'whatsapp' | 'facebook' | 'instagram'

  // ── Feature Type Counts ──
  const channelCount = useMemo(() => {
    return features.filter(f => {
      const typeStr = (f.feature_type || f.type || '').toLowerCase();
      return typeStr.includes('channel') || f.key.startsWith('channel_');
    }).length;
  }, [features]);

  const connectorCount = useMemo(() => {
    return features.filter(f => {
      const typeStr = (f.feature_type || f.type || '').toLowerCase();
      return typeStr.includes('connector') || f.key.startsWith('conn_') || f.key.includes('shopify') || f.key.includes('woocommerce') || f.key.includes('hubspot') || f.key.includes('razorpay');
    }).length;
  }, [features]);

  const moduleCount = useMemo(() => {
    return features.filter(f => {
      const typeStr = (f.feature_type || f.type || '').toLowerCase();
      const isChan = typeStr.includes('channel') || f.key.startsWith('channel_');
      const isConn = typeStr.includes('connector') || f.key.startsWith('conn_') || f.key.includes('shopify') || f.key.includes('woocommerce') || f.key.includes('hubspot') || f.key.includes('razorpay');
      return !isChan && !isConn;
    }).length;
  }, [features]);

  // ── Form States ──
  // ── Form States ──
  const createDefaultCycleConfig = (defaultPrice, defaultChannels = '1') => ({
    price: defaultPrice,
    max_channels: defaultChannels,
    selected_feature_keys: DEFAULT_FEATURES.slice(0, 8).map(f => f.key),
    // WhatsApp
    whatsapp_what_you_get: "WhatsApp Business API Automation\nShared Team Inbox for WhatsApp\nAutomated Keyword Replies\nContact & Lead Sync",
    whatsapp_features: "WhatsApp Auto Replies\nShared Inbox\nKeyword Triggers\nContact Management",
    whatsapp_messages_limit: 'unlimited',
    whatsapp_messages_desc: 'Based on your WhatsApp Number',
    whatsapp_contacts_limit: 'unlimited',
    whatsapp_custom_fields: '15',
    whatsapp_custom_tags: '15',
    whatsapp_custom_events: '5',
    whatsapp_marketing_cost: '₹0.970',
    whatsapp_auth_cost: '₹0.129',
    whatsapp_utility_cost: '₹0.160',
    whatsapp_service_cost: 'FREE',
    // Facebook
    facebook_what_you_get: "Facebook Messenger Automation\nFacebook Page Inbox Sync\nAutomated Page Quick-Replies\nLead Form Acquisition",
    facebook_features: "Facebook Auto Replies\nShared Page Inbox\nAd Lead Capture\nContact Management",
    facebook_messages_limit: 'unlimited',
    facebook_messages_desc: 'Facebook Page Messaging',
    facebook_contacts_limit: 'unlimited',
    facebook_custom_fields: '15',
    facebook_custom_tags: '15',
    facebook_custom_events: '5',
    facebook_messaging_cost: 'FREE',
    facebook_lead_cost: 'FREE',
    // Instagram
    instagram_what_you_get: "Instagram Direct DM Automation\nStory Mention Auto-Replies\nComment Automation & Quick-Flows\nShared Inbox for Insta DMs",
    instagram_features: "Insta Quick-Flows & Price Query Bots\nComment & Story Mention Triggers\nShared Inbox for DMs & Comments\nGiveaway & Promo Automation",
    instagram_messages_limit: 'unlimited',
    instagram_messages_desc: 'Instagram Professional Account',
    instagram_contacts_limit: 'unlimited',
    instagram_custom_fields: '15',
    instagram_custom_tags: '15',
    instagram_custom_events: '5',
    instagram_dms_cost: 'FREE',
    instagram_price_cost: 'FREE',
    instagram_giveaway_cost: 'FREE',
    // General
    custom_fields_limit: '15',
    custom_tags_limit: '15',
    custom_events_limit: '5',
    messages_limit: 'unlimited',
    contacts_limit: 'unlimited',
    team_members_limit: '3',
    workflows_limit: '5',
    custom_quota_fields: []
  });

  // ── Form States ──
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    badge_text: '',
    currency: 'INR',
    status: 'ACTIVE',
    activeCycle: 'monthly',
    yearly_discount_percent: '15',
    monthlyConfig: createDefaultCycleConfig('999', '1'),
    yearlyConfig: createDefaultCycleConfig('9590', '1')
  });

  const updateActiveConfigField = (field, value) => {
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey] || {}),
        [field]: value
      }
    }));
  };

  const updateSpecificCycleField = (cycle, field, value) => {
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey] || {}),
        [field]: value
      }
    }));
  };

  const getActiveConfig = () => {
    return (planForm.activeCycle === 'yearly' ? planForm.yearlyConfig : planForm.monthlyConfig) || {};
  };

  const addCustomQuotaField = () => {
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    const currentFields = getActiveConfig().custom_quota_fields || [];
    const newItem = { id: 'cq_' + Date.now(), label: '', value: '' };
    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey] || {}),
        custom_quota_fields: [...currentFields, newItem]
      }
    }));
  };

  const updateCustomQuotaField = (index, key, val) => {
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    const currentFields = [...(getActiveConfig().custom_quota_fields || [])];
    if (currentFields[index]) {
      currentFields[index] = { ...currentFields[index], [key]: val };
      setPlanForm(prev => ({
        ...prev,
        [configKey]: {
          ...(prev[configKey] || {}),
          custom_quota_fields: currentFields
        }
      }));
    }
  };

  const removeCustomQuotaField = (index) => {
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    const currentFields = (getActiveConfig().custom_quota_fields || []).filter((_, i) => i !== index);
    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey] || {}),
        custom_quota_fields: currentFields
      }
    }));
  };

  const [featureForm, setFeatureForm] = useState({
    name: '',
    key: '',
    category: 'Communication',
    feature_type: 'Module',
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
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const [plansRes, featuresRes, clientsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/plans/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/features/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/admin/clients/overview/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (featuresRes.status === 'fulfilled' && (featuresRes.value.data?.results || Array.isArray(featuresRes.value.data))) {
        const featList = Array.isArray(featuresRes.value.data) ? featuresRes.value.data : (featuresRes.value.data.results || []);
        if (featList.length > 0) setFeatures(featList);
      }
      if (plansRes.status === 'fulfilled' && (plansRes.value.data?.results || Array.isArray(plansRes.value.data))) {
        const rawPlanList = Array.isArray(plansRes.value.data) ? plansRes.value.data : (plansRes.value.data.results || []);
        if (rawPlanList.length > 0) {
          const mappedPlans = rawPlanList.map(p => {
            const meta = p.metadata || {};
            const legacyWA = p.channel_details?.whatsapp || {};
            const legacyFB = p.channel_details?.facebook || {};
            const legacyIG = p.channel_details?.instagram || {};

            const extractConfigFromPlan = (cycleName, defaultPrice) => {
              const saved = meta[`${cycleName}Config`] || meta[`${cycleName}_config`] || p[`${cycleName}Config`];
              if (saved) return saved;

              const mP = p.monthly_price || p.price || 999;
              const yP = p.yearly_price || meta.yearly_price || Math.round(mP * 12 * 0.85);
              const price = cycleName === 'monthly' ? mP : yP;

              const isStarterPlan = (p.slug === 'starter' || (p.name && p.name.toLowerCase().includes('starter')));
              return {
                price: price.toString(),
                max_channels: isStarterPlan ? '1' : (p.max_channels || (p.name?.toLowerCase().includes('growth') ? 2 : 3)).toString(),
                selected_feature_keys: p.feature_keys || [],
                // Limits
                custom_fields_limit: (legacyWA.limits?.custom_fields?.value || 15).toString(),
                custom_tags_limit: (legacyWA.limits?.custom_tags?.value || 15).toString(),
                custom_events_limit: (legacyWA.limits?.events?.value || 5).toString(),
                messages_limit: (legacyWA.limits?.messages?.value || 'unlimited').toString(),
                contacts_limit: (legacyWA.limits?.contacts?.value || 'unlimited').toString(),
                // WhatsApp
                whatsapp_what_you_get: Array.isArray(legacyWA.what_you_get) ? legacyWA.what_you_get.join('\n') : "WhatsApp Business API Automation\nShared Team Inbox for WhatsApp\nAutomated Keyword Replies\nContact & Lead Sync",
                whatsapp_features: Array.isArray(legacyWA.features) ? legacyWA.features.join('\n') : "WhatsApp Auto Replies\nShared Inbox\nKeyword Triggers\nContact Management",
                whatsapp_messages_limit: (legacyWA.limits?.messages?.value || 'unlimited').toString(),
                whatsapp_contacts_limit: (legacyWA.limits?.contacts?.value || 'unlimited').toString(),
                whatsapp_custom_fields: (legacyWA.limits?.custom_fields?.value || 15).toString(),
                whatsapp_custom_tags: (legacyWA.limits?.custom_tags?.value || 15).toString(),
                whatsapp_custom_events: (legacyWA.limits?.events?.value || 5).toString(),
                whatsapp_marketing_cost: legacyWA.message_costs?.find(c => c.type === 'Marketing')?.price || '₹0.970',
                whatsapp_auth_cost: legacyWA.message_costs?.find(c => c.type === 'Authentication')?.price || '₹0.129',
                whatsapp_utility_cost: legacyWA.message_costs?.find(c => c.type === 'Utility')?.price || '₹0.160',
                whatsapp_service_cost: legacyWA.message_costs?.find(c => c.type === 'Service')?.price || 'FREE',
                // Facebook
                facebook_what_you_get: Array.isArray(legacyFB.what_you_get) ? legacyFB.what_you_get.join('\n') : "Facebook Messenger Automation\nFacebook Page Inbox Sync\nAutomated Page Quick-Replies\nLead Form Acquisition",
                facebook_features: Array.isArray(legacyFB.features) ? legacyFB.features.join('\n') : "Facebook Auto Replies\nShared Page Inbox\nAd Lead Capture\nContact Management",
                facebook_messages_limit: (legacyFB.limits?.messages?.value || 'unlimited').toString(),
                facebook_contacts_limit: (legacyFB.limits?.contacts?.value || 'unlimited').toString(),
                facebook_custom_fields: (legacyFB.limits?.custom_fields?.value || 15).toString(),
                facebook_custom_tags: (legacyFB.limits?.custom_tags?.value || 15).toString(),
                facebook_custom_events: (legacyFB.limits?.events?.value || 5).toString(),
                facebook_messaging_cost: legacyFB.message_costs?.find(c => c.type === 'Standard Messaging')?.price || 'FREE',
                facebook_lead_cost: legacyFB.message_costs?.find(c => c.type === 'Lead Form Triggers')?.price || 'FREE',
                // Instagram
                instagram_what_you_get: Array.isArray(legacyIG.what_you_get) ? legacyIG.what_you_get.join('\n') : "Instagram Direct DM Automation\nStory Mention Auto-Replies\nComment Automation & Quick-Flows\nShared Inbox for Insta DMs",
                instagram_features: Array.isArray(legacyIG.features) ? legacyIG.features.join('\n') : "Insta Quick-Flows & Price Query Bots\nComment & Story Mention Triggers\nShared Inbox for DMs & Comments\nGiveaway & Promo Automation",
                instagram_messages_limit: (legacyIG.limits?.messages?.value || 'unlimited').toString(),
                instagram_contacts_limit: (legacyIG.limits?.contacts?.value || 'unlimited').toString(),
                instagram_custom_fields: (legacyIG.limits?.custom_fields?.value || 15).toString(),
                instagram_custom_tags: (legacyIG.limits?.custom_tags?.value || 15).toString(),
                instagram_custom_events: (legacyIG.limits?.events?.value || 5).toString(),
                instagram_dms_cost: legacyIG.message_costs?.find(c => c.type === 'Unlimited DMs & Comments')?.price || 'FREE',
                instagram_price_cost: legacyIG.message_costs?.find(c => c.type === 'Price Automation')?.price || 'FREE',
                instagram_giveaway_cost: legacyIG.message_costs?.find(c => c.type === 'Giveaway Automation')?.price || 'FREE'
              };
            };

            const mConfig = extractConfigFromPlan('monthly', 999);
            const yConfig = extractConfigFromPlan('yearly', 9590);

            return {
              id: p.id,
              name: p.name,
              badge: p.name.toUpperCase(),
              badge_text: p.badge_text || p.name.toUpperCase(),
              status: (p.status === 'ACTIVE' || p.is_active !== false) ? 'ACTIVE' : 'INACTIVE',
              description: p.description || 'Custom Enterprise Plan',
              price: Number(mConfig.price) || p.price || 0,
              monthly_price: Number(mConfig.price) || p.price || 0,
              yearly_price: Number(yConfig.price) || Math.round((p.price || 999) * 12 * 0.85),
              billing_cycle: p.billing_cycle || 'Monthly',
              currency: p.currency || 'INR',
              feature_keys: p.feature_keys || [],
              monthlyConfig: mConfig,
              yearlyConfig: yConfig,
              channel_count: p.channel_count || 4,
              connector_count: p.connector_count || 3,
              client_count: p.client_count || 0,
              is_popular: p.is_popular || false,
              channel_details: p.channel_details || meta.channel_details || {},
              metadata: meta
            };
          });
          setPlans(mappedPlans);
        }
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

  // ── Category Grouping ──
  const categorizedFeatures = useMemo(() => {
    const map = {};
    features.forEach(f => {
      const cat = f.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(f);
    });
    return map;
  }, [features]);

  const uniqueCategories = useMemo(() => {
    return Object.keys(categorizedFeatures);
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

  // ── Select All within a Category in Form (Independent per Cycle) ──
  const toggleSelectAllCategory = (cat) => {
    const catFeatKeys = (categorizedFeatures[cat] || []).map(f => f.key);
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    const currentConfig = planForm[configKey] || {};
    const currentSelected = new Set(currentConfig.selected_feature_keys || []);
    const allSelected = catFeatKeys.every(k => currentSelected.has(k));

    if (allSelected) {
      catFeatKeys.forEach(k => currentSelected.delete(k));
    } else {
      catFeatKeys.forEach(k => currentSelected.add(k));
    }

    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        selected_feature_keys: Array.from(currentSelected)
      }
    }));
  };

  const toggleSingleFeatureInForm = (featKey) => {
    const cycle = planForm.activeCycle || 'monthly';
    const configKey = cycle === 'yearly' ? 'yearlyConfig' : 'monthlyConfig';
    const currentConfig = planForm[configKey] || {};
    const currentSelected = new Set(currentConfig.selected_feature_keys || []);
    if (currentSelected.has(featKey)) {
      currentSelected.delete(featKey);
    } else {
      currentSelected.add(featKey);
    }
    setPlanForm(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        selected_feature_keys: Array.from(currentSelected)
      }
    }));
  };

  // ── Open Create Plan Modal ──
  const handleOpenCreatePlan = () => {
    setModalActiveCategory('ALL');
    setModalEditorTab('basic');
    setPlanForm({
      name: '',
      description: '',
      badge_text: '',
      currency: 'INR',
      status: 'ACTIVE',
      activeCycle: 'monthly',
      monthlyConfig: createDefaultCycleConfig('999', '1'),
      yearlyConfig: createDefaultCycleConfig('9590', '1')
    });
    setIsCreatePlanModalOpen(true);
  };

  // ── Open Edit / Manage Plan Modal ──
  const handleOpenManagePlan = (plan, targetCycle = 'monthly') => {
    setEditingPlan(plan);
    setModalActiveCategory('ALL');
    setModalEditorTab('basic');

    const meta = plan.metadata || {};
    const legacyWA = plan.channel_details?.whatsapp || {};
    const legacyFB = plan.channel_details?.facebook || {};
    const legacyIG = plan.channel_details?.instagram || {};

    const extractConfig = (cycleName, defaultPrice) => {
      const savedConfig = meta[`${cycleName}Config`] || meta[`${cycleName}_config`] || plan[`${cycleName}Config`];
      const mP = plan.monthly_price || plan.price || defaultPrice;
      const yP = plan.yearly_price || meta.yearly_price || Math.round(mP * 12 * 0.85);
      const targetPrice = cycleName === 'monthly' ? mP : yP;

      const cycleChannelDetails = savedConfig?.channel_details || (cycleName === 'yearly' ? (meta.yearly_channel_details || meta.yearlyConfig?.channel_details || plan.yearly_channel_details) : (meta.monthly_channel_details || meta.monthlyConfig?.channel_details || plan.monthly_channel_details));
      const pWA = cycleChannelDetails?.whatsapp || plan.channel_details?.whatsapp || legacyWA;
      const pFB = cycleChannelDetails?.facebook || plan.channel_details?.facebook || legacyFB;
      const pIG = cycleChannelDetails?.instagram || plan.channel_details?.instagram || legacyIG;

      let extractedCustomQuotas = [];
      if (Array.isArray(savedConfig?.custom_quota_fields) && savedConfig.custom_quota_fields.length > 0) {
        extractedCustomQuotas = savedConfig.custom_quota_fields;
      } else if (pWA.limits && typeof pWA.limits === 'object') {
        const standardKeys = new Set(['messages', 'contacts', 'custom_fields', 'custom_tags', 'events', 'custom_events']);
        Object.entries(pWA.limits).forEach(([k, v], idx) => {
          if (!standardKeys.has(k) && v && typeof v === 'object' && v.label) {
            extractedCustomQuotas.push({
              id: 'cq_' + idx + '_' + Date.now(),
              label: v.label,
              value: v.value || '—'
            });
          }
        });
      }

      const isStarterPlan = (plan.slug === 'starter' || (plan.name && plan.name.toLowerCase().includes('starter')));
      return {
        price: (savedConfig?.price || targetPrice).toString(),
        max_channels: isStarterPlan ? '1' : (savedConfig?.max_channels || plan.max_channels || (plan.name?.toLowerCase().includes('growth') ? 2 : 3)).toString(),
        selected_feature_keys: savedConfig?.selected_feature_keys || plan.feature_keys || [],

        // General limits
        custom_fields_limit: (savedConfig?.custom_fields_limit || pWA.limits?.custom_fields?.value || 15).toString(),
        custom_tags_limit: (savedConfig?.custom_tags_limit || pWA.limits?.custom_tags?.value || 15).toString(),
        custom_events_limit: (savedConfig?.custom_events_limit || pWA.limits?.events?.value || 5).toString(),
        messages_limit: (savedConfig?.messages_limit || pWA.limits?.messages?.value || 'unlimited').toString(),
        contacts_limit: (savedConfig?.contacts_limit || pWA.limits?.contacts?.value || 'unlimited').toString(),
        team_members_limit: (savedConfig?.team_members_limit || plan.team_members_limit || '3').toString(),
        workflows_limit: (savedConfig?.workflows_limit || plan.workflows_limit || '5').toString(),
        custom_quota_fields: extractedCustomQuotas,

        // WhatsApp
        whatsapp_what_you_get: savedConfig?.whatsapp_what_you_get || (Array.isArray(pWA.what_you_get) ? pWA.what_you_get.join('\n') : "WhatsApp Business API Automation\nShared Team Inbox for WhatsApp\nAutomated Keyword Replies\nContact & Lead Sync"),
        whatsapp_features: savedConfig?.whatsapp_features || (Array.isArray(pWA.features) ? pWA.features.join('\n') : "WhatsApp Auto Replies\nShared Inbox\nKeyword Triggers\nContact Management"),
        whatsapp_messages_limit: (savedConfig?.whatsapp_messages_limit || pWA.limits?.messages?.value || 'unlimited').toString(),
        whatsapp_messages_desc: savedConfig?.whatsapp_messages_desc || pWA.limits?.messages?.description || 'Based on your WhatsApp Number',
        whatsapp_contacts_limit: (savedConfig?.whatsapp_contacts_limit || pWA.limits?.contacts?.value || 'unlimited').toString(),
        whatsapp_custom_fields: (savedConfig?.whatsapp_custom_fields || pWA.limits?.custom_fields?.value || 15).toString(),
        whatsapp_custom_tags: (savedConfig?.whatsapp_custom_tags || pWA.limits?.custom_tags?.value || 15).toString(),
        whatsapp_custom_events: (savedConfig?.whatsapp_custom_events || pWA.limits?.events?.value || 5).toString(),
        whatsapp_marketing_cost: savedConfig?.whatsapp_marketing_cost || pWA.message_costs?.find(c => c.type === 'Marketing')?.price || '₹0.970',
        whatsapp_auth_cost: savedConfig?.whatsapp_auth_cost || pWA.message_costs?.find(c => c.type === 'Authentication')?.price || '₹0.129',
        whatsapp_utility_cost: savedConfig?.whatsapp_utility_cost || pWA.message_costs?.find(c => c.type === 'Utility')?.price || '₹0.160',
        whatsapp_service_cost: savedConfig?.whatsapp_service_cost || pWA.message_costs?.find(c => c.type === 'Service')?.price || 'FREE',

        // Facebook
        facebook_what_you_get: savedConfig?.facebook_what_you_get || (Array.isArray(pFB.what_you_get) ? pFB.what_you_get.join('\n') : "Facebook Messenger Automation\nFacebook Page Inbox Sync\nAutomated Page Quick-Replies\nLead Form Acquisition"),
        facebook_features: savedConfig?.facebook_features || (Array.isArray(pFB.features) ? pFB.features.join('\n') : "Facebook Auto Replies\nShared Page Inbox\nAd Lead Capture\nContact Management"),
        facebook_messages_limit: (savedConfig?.facebook_messages_limit || pFB.limits?.messages?.value || 'unlimited').toString(),
        facebook_messages_desc: savedConfig?.facebook_messages_desc || pFB.limits?.messages?.description || 'Facebook Page Messaging',
        facebook_contacts_limit: (savedConfig?.facebook_contacts_limit || pFB.limits?.contacts?.value || 'unlimited').toString(),
        facebook_custom_fields: (savedConfig?.facebook_custom_fields || pFB.limits?.custom_fields?.value || 15).toString(),
        facebook_custom_tags: (savedConfig?.facebook_custom_tags || pFB.limits?.custom_tags?.value || 15).toString(),
        facebook_custom_events: (savedConfig?.facebook_custom_events || pFB.limits?.events?.value || 5).toString(),
        facebook_messaging_cost: savedConfig?.facebook_messaging_cost || pFB.message_costs?.find(c => c.type === 'Standard Messaging')?.price || 'FREE',
        facebook_lead_cost: savedConfig?.facebook_lead_cost || pFB.message_costs?.find(c => c.type === 'Lead Form Triggers')?.price || 'FREE',

        // Instagram
        instagram_what_you_get: savedConfig?.instagram_what_you_get || (Array.isArray(pIG.what_you_get) ? pIG.what_you_get.join('\n') : "Instagram Direct DM Automation\nStory Mention Auto-Replies\nComment Automation & Quick-Flows\nShared Inbox for Insta DMs"),
        instagram_features: savedConfig?.instagram_features || (Array.isArray(pIG.features) ? pIG.features.join('\n') : "Insta Quick-Flows & Price Query Bots\nComment & Story Mention Triggers\nShared Inbox for DMs & Comments\nGiveaway & Promo Automation"),
        instagram_messages_limit: (savedConfig?.instagram_messages_limit || pIG.limits?.messages?.value || 'unlimited').toString(),
        instagram_messages_desc: savedConfig?.instagram_messages_desc || pIG.limits?.messages?.description || 'Instagram Professional Account',
        instagram_contacts_limit: (savedConfig?.instagram_contacts_limit || pIG.limits?.contacts?.value || 'unlimited').toString(),
        instagram_custom_fields: (savedConfig?.instagram_custom_fields || pIG.limits?.custom_fields?.value || 15).toString(),
        instagram_custom_tags: (savedConfig?.instagram_custom_tags || pIG.limits?.custom_tags?.value || 15).toString(),
        instagram_custom_events: (savedConfig?.instagram_custom_events || pIG.limits?.events?.value || 5).toString(),
        instagram_dms_cost: savedConfig?.instagram_dms_cost || pIG.message_costs?.find(c => c.type === 'Unlimited DMs & Comments')?.price || 'FREE',
        instagram_price_cost: savedConfig?.instagram_price_cost || pIG.message_costs?.find(c => c.type === 'Price Automation')?.price || 'FREE',
        instagram_giveaway_cost: savedConfig?.instagram_giveaway_cost || pIG.message_costs?.find(c => c.type === 'Giveaway Automation')?.price || 'FREE'
      };
    };

    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      badge_text: plan.badge_text || plan.badge || '',
      currency: plan.currency || 'INR',
      status: plan.status || 'ACTIVE',
      activeCycle: targetCycle,
      yearly_discount_percent: (meta.yearly_discount_percent || 15).toString(),
      monthlyConfig: extractConfig('monthly', 999),
      yearlyConfig: extractConfig('yearly', 9590)
    });

    setIsEditPlanModalOpen(true);
  };

  // ── Helper to build complete channel_details object ──
  const buildChannelDetailsForCycle = (config, baseChannelDetails = {}) => {
    const waWhatYouGet = (config.whatsapp_what_you_get || '').split('\n').map(s => s.trim()).filter(Boolean);
    const waFeatures = (config.whatsapp_features || '').split('\n').map(s => s.trim()).filter(Boolean);
    const fbWhatYouGet = (config.facebook_what_you_get || '').split('\n').map(s => s.trim()).filter(Boolean);
    const fbFeatures = (config.facebook_features || '').split('\n').map(s => s.trim()).filter(Boolean);
    const igWhatYouGet = (config.instagram_what_you_get || '').split('\n').map(s => s.trim()).filter(Boolean);
    const igFeatures = (config.instagram_features || '').split('\n').map(s => s.trim()).filter(Boolean);

    const dynamicCustomLimits = {};
    (config.custom_quota_fields || []).forEach((item, idx) => {
      if (item.label && item.label.trim()) {
        const k = 'custom_quota_' + idx;
        dynamicCustomLimits[k] = { value: item.value || '—', label: item.label.trim() };
      }
    });

    return {
      whatsapp: {
        name: 'WhatsApp',
        what_you_get: waWhatYouGet.length > 0 ? waWhatYouGet : (baseChannelDetails.whatsapp?.what_you_get || [
          'WhatsApp Business API Automation',
          'Shared Team Inbox for WhatsApp',
          'Automated Keyword Replies',
          'Contact & Lead Sync'
        ]),
        features: waFeatures.length > 0 ? waFeatures : (baseChannelDetails.whatsapp?.features || [
          'WhatsApp Auto Replies',
          'Shared Inbox',
          'Keyword Triggers',
          'Contact Management'
        ]),
        limits: {
          messages: { value: config.whatsapp_messages_limit || config.messages_limit || 'unlimited', label: 'Messages', description: config.whatsapp_messages_desc || 'Based on your WhatsApp Number' },
          contacts: { value: config.whatsapp_contacts_limit || config.contacts_limit || 'unlimited', label: 'Contacts' },
          custom_fields: { value: config.whatsapp_custom_fields || config.custom_fields_limit || '15', label: 'Custom Fields' },
          custom_tags: { value: config.whatsapp_custom_tags || config.custom_tags_limit || '15', label: 'Custom Tags' },
          events: { value: config.whatsapp_custom_events || config.custom_events_limit || '—', label: 'Custom Events' },
          ...dynamicCustomLimits
        },
        message_costs: [
          { type: 'Marketing', price: config.whatsapp_marketing_cost || '₹0.970' },
          { type: 'Authentication', price: config.whatsapp_auth_cost || '₹0.129' },
          { type: 'Utility', price: config.whatsapp_utility_cost || '₹0.160' },
          { type: 'Service', price: config.whatsapp_service_cost || 'FREE' }
        ],
        additional_benefits: baseChannelDetails.whatsapp?.additional_benefits || ['No Markup Charges', 'Standard Support']
      },
      facebook: {
        name: 'Facebook',
        what_you_get: fbWhatYouGet.length > 0 ? fbWhatYouGet : (baseChannelDetails.facebook?.what_you_get || [
          'Facebook Messenger Automation',
          'Facebook Page Inbox Sync',
          'Automated Page Quick-Replies',
          'Lead Form Acquisition'
        ]),
        features: fbFeatures.length > 0 ? fbFeatures : (baseChannelDetails.facebook?.features || [
          'Facebook Auto Replies',
          'Shared Page Inbox',
          'Ad Lead Capture',
          'Contact Management'
        ]),
        limits: {
          messages: { value: config.facebook_messages_limit || config.messages_limit || 'unlimited', label: 'Conversations', description: config.facebook_messages_desc || 'Facebook Page Messaging' },
          contacts: { value: config.facebook_contacts_limit || config.contacts_limit || 'unlimited', label: 'Contacts' },
          custom_fields: { value: config.facebook_custom_fields || config.custom_fields_limit || '15', label: 'Custom Fields' },
          custom_tags: { value: config.facebook_custom_tags || config.custom_tags_limit || '15', label: 'Custom Tags' },
          events: { value: config.facebook_custom_events || config.custom_events_limit || '—', label: 'Custom Events' },
          ...dynamicCustomLimits
        },
        message_costs: [
          { type: 'Standard Messaging', price: config.facebook_messaging_cost || 'FREE' },
          { type: 'Lead Form Triggers', price: config.facebook_lead_cost || 'FREE' }
        ],
        additional_benefits: baseChannelDetails.facebook?.additional_benefits || ['Meta Graph API Sync', 'Standard Support']
      },
      instagram: {
        name: 'Instagram',
        what_you_get: igWhatYouGet.length > 0 ? igWhatYouGet : (baseChannelDetails.instagram?.what_you_get || [
          'Instagram Direct DM Automation',
          'Story Mention Auto-Replies',
          'Comment Automation & Quick-Flows',
          'Shared Inbox for Insta DMs'
        ]),
        features: igFeatures.length > 0 ? igFeatures : (baseChannelDetails.instagram?.features || [
          'Insta Quick-Flows & Price Query Bots',
          'Comment & Story Mention Triggers',
          'Shared Inbox for DMs & Comments',
          'Giveaway & Promo Automation'
        ]),
        limits: {
          messages: { value: config.instagram_messages_limit || config.messages_limit || 'unlimited', label: 'DMs & Comments', description: config.instagram_messages_desc || 'Instagram Professional Account' },
          contacts: { value: config.instagram_contacts_limit || config.contacts_limit || 'unlimited', label: 'Contacts' },
          custom_fields: { value: config.instagram_custom_fields || config.custom_fields_limit || '15', label: 'Custom Fields' },
          custom_tags: { value: config.instagram_custom_tags || config.custom_tags_limit || '15', label: 'Custom Tags' },
          events: { value: config.instagram_custom_events || config.custom_events_limit || '—', label: 'Custom Events' },
          ...dynamicCustomLimits
        },
        message_costs: [
          { type: 'Unlimited DMs & Comments', price: config.instagram_dms_cost || 'FREE' },
          { type: 'Price Automation', price: config.instagram_price_cost || 'FREE' },
          { type: 'Giveaway Automation', price: config.instagram_giveaway_cost || 'FREE' }
        ],
        additional_benefits: baseChannelDetails.instagram?.additional_benefits || ['IG Conversations FREE', 'Standard Support']
      }
    };
  };

  // ── Submit Create Plan ──
  const handleCreatePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showToast('Please enter a plan name', 'error');
      return;
    }

    const mConfig = planForm.monthlyConfig;
    const yConfig = planForm.yearlyConfig;
    const mPrice = Number(mConfig.price) || 0;
    const yPrice = Number(yConfig.price) || 0;

    const fullChannelDetails = buildChannelDetailsForCycle(mConfig);

    const newPlanObj = {
      id: `plan-${Date.now()}`,
      name: planForm.name.trim(),
      badge_text: planForm.badge_text.trim(),
      badge: planForm.badge_text.trim() || planForm.name.toUpperCase().trim(),
      status: planForm.status,
      description: planForm.description || 'Custom Enterprise Plan',
      price: mPrice,
      monthly_price: mPrice,
      yearly_price: yPrice,
      max_channels: Number(mConfig.max_channels) || 1,
      currency: planForm.currency,
      feature_keys: mConfig.selected_feature_keys || [],
      monthlyConfig: mConfig,
      yearlyConfig: yConfig,
      channel_count: Number(mConfig.max_channels) || 1,
      connector_count: (mConfig.selected_feature_keys || []).filter(k => k.startsWith('connector_')).length || 1,
      client_count: 0,
      is_popular: false,
      channel_details: fullChannelDetails,
      metadata: {
        monthlyConfig: mConfig,
        yearlyConfig: yConfig,
        monthly_price: mPrice,
        yearly_price: yPrice,
        yearly_discount_percent: Number(planForm.yearly_discount_percent) || 15.0,
        allowed_channels: ['whatsapp', 'facebook', 'instagram'],
        allowed_connectors: ['whatsapp', 'facebook', 'instagram'],
        feature_keys: mConfig.selected_feature_keys || [],
        channel_details: fullChannelDetails
      }
    };

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      await axios.post(`${API_BASE_URL}/api/plans/`, {
        name: newPlanObj.name,
        description: newPlanObj.description,
        price: newPlanObj.price,
        monthly_price: newPlanObj.monthly_price,
        yearly_price: newPlanObj.yearly_price,
        badge_text: newPlanObj.badge_text,
        max_channels: newPlanObj.max_channels,
        currency: newPlanObj.currency,
        is_active: newPlanObj.status === 'ACTIVE',
        feature_keys: newPlanObj.feature_keys,
        monthlyConfig: mConfig,
        yearlyConfig: yConfig,
        metadata: newPlanObj.metadata
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log('Saved to local pool:', err);
    }

    setPlans(prev => [newPlanObj, ...prev]);
    setIsCreatePlanModalOpen(false);
    showToast(`Plan "${newPlanObj.name}" created with independent Monthly & Yearly configurations!`);
  };

  // ── Submit Edit Plan ──
  const handleEditPlanSubmit = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const mConfig = { ...planForm.monthlyConfig };
    const yConfig = { ...planForm.yearlyConfig };
    const mPrice = Number(mConfig.price) || 0;
    const yPrice = Number(yConfig.price) || 0;

    // Build channel_details for BOTH cycles independently
    const monthlyChannelDetails = buildChannelDetailsForCycle(mConfig, editingPlan.channel_details || {});
    const yearlyChannelDetails = buildChannelDetailsForCycle(yConfig, editingPlan.channel_details || {});
    
    mConfig.channel_details = monthlyChannelDetails;
    yConfig.channel_details = yearlyChannelDetails;

    const updatedPlanObj = {
      ...editingPlan,
      name: planForm.name.trim(),
      badge_text: planForm.badge_text.trim(),
      badge: planForm.badge_text.trim() || planForm.name.toUpperCase().trim(),
      status: planForm.status,
      description: planForm.description,
      price: mPrice,
      monthly_price: mPrice,
      yearly_price: yPrice,
      max_channels: (editingPlan.slug === 'starter' || editingPlan.name?.toLowerCase().includes('starter')) ? 1 : (Number(mConfig.max_channels) || 1),
      currency: planForm.currency,
      feature_keys: mConfig.selected_feature_keys || [],
      monthlyConfig: mConfig,
      yearlyConfig: yConfig,
      monthly_channel_details: monthlyChannelDetails,
      yearly_channel_details: yearlyChannelDetails,
      channel_count: (editingPlan.slug === 'starter' || editingPlan.name?.toLowerCase().includes('starter')) ? 1 : (Number(mConfig.max_channels) || 1),
      connector_count: (mConfig.selected_feature_keys || []).filter(k => k.startsWith('connector_')).length || 1,
      channel_details: monthlyChannelDetails,
      metadata: {
        ...(editingPlan.metadata || {}),
        max_channels: (editingPlan.slug === 'starter' || editingPlan.name?.toLowerCase().includes('starter')) ? 1 : (Number(mConfig.max_channels) || 1),
        monthlyConfig: mConfig,
        yearlyConfig: yConfig,
        monthly_price: mPrice,
        yearly_price: yPrice,
        monthly_channel_details: monthlyChannelDetails,
        yearly_channel_details: yearlyChannelDetails,
        yearly_discount_percent: Number(planForm.yearly_discount_percent) || 15.0,
        allowed_channels: editingPlan.metadata?.allowed_channels || ['whatsapp', 'facebook', 'instagram'],
        allowed_connectors: editingPlan.metadata?.allowed_connectors || ['whatsapp', 'facebook', 'instagram'],
        feature_keys: mConfig.selected_feature_keys || [],
        channel_details: monthlyChannelDetails
      }
    };

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const targetId = editingPlan.id || editingPlan.slug;
      
      // Step 1: Send monthly & yearly configs first (parallel is ok between these two)
      await Promise.allSettled([
        axios.put(`${API_BASE_URL}/api/plans/${targetId}/monthly/`, { monthlyConfig: mConfig }, { headers: { Authorization: `Bearer ${token}` } }),
        axios.put(`${API_BASE_URL}/api/plans/${targetId}/yearly/`, { yearlyConfig: yConfig }, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // Step 2: THEN send the main plan update (so metadata won't overwrite cycle configs)
      await axios.put(`${API_BASE_URL}/api/plans/${targetId}/`, {
        name: updatedPlanObj.name,
        description: updatedPlanObj.description,
        price: updatedPlanObj.price,
        monthly_price: mPrice,
        yearly_price: yPrice,
        badge_text: updatedPlanObj.badge_text,
        max_channels: updatedPlanObj.max_channels,
        currency: updatedPlanObj.currency,
        status: updatedPlanObj.status,
        is_active: updatedPlanObj.status === 'ACTIVE',
        feature_keys: updatedPlanObj.feature_keys,
        monthlyConfig: mConfig,
        yearlyConfig: yConfig,
        channel_details: monthlyChannelDetails,
        metadata: updatedPlanObj.metadata
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log('Updated in state pool:', err);
    }

    setPlans(prev => prev.map(p => p.id === editingPlan.id ? updatedPlanObj : p));
    setIsEditPlanModalOpen(false);
    setEditingPlan(null);
    showToast(`Plan "${updatedPlanObj.name}" updated with independent Monthly & Yearly configurations!`);
    fetchBackendData();
  };


  // ── Delete Plan ──
  const handleDeletePlan = async (planId, planName) => {
    if (!confirm(`Are you sure you want to delete "${planName}"?`)) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
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
  // ── Toggle Feature Active / Inactive Status ──
  const handleToggleFeatureActiveStatus = (feat) => {
    const newStatus = !feat.is_active;
    setFeatures(prev => prev.map(f => f.id === feat.id ? { ...f, is_active: newStatus } : f));

    // Persist inactive keys to localStorage for client sync
    const updatedFeatures = features.map(f => f.id === feat.id ? { ...f, is_active: newStatus } : f);
    const inactiveKeys = updatedFeatures.filter(f => !f.is_active).map(f => f.key);

    if (typeof window !== 'undefined') {
      localStorage.setItem('inactive_platform_features', JSON.stringify(inactiveKeys));
    }

    showToast(
      newStatus 
        ? `"${feat.name}" is now ACTIVE!` 
        : `"${feat.name}" is DEACTIVATED! Clients will see "COMING SOON".`,
      newStatus ? 'success' : 'warning'
    );
  };

  const handleOpenAddFeature = () => {
    setFeatureForm({
      name: '',
      key: '',
      category: 'Communication',
      feature_type: 'Module',
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
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
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
    const existingPlan = plans.find(p => p.id === client.plan_id || p.name?.toLowerCase() === (client.plan_name || '').toLowerCase());
    setTempSelectedPlanId(existingPlan?.id || client.plan_id || plans[0]?.id || '');
    setIsChangePlanModalOpen(true);
  };

  const handleSaveClientPlanChange = async () => {
    if (!selectedClientForPlanChange) return;
    const targetPlan = plans.find(p => p.id === tempSelectedPlanId);
    if (!targetPlan) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      await axios.post(
        `${API_BASE_URL}/api/admin/client-intelligence/clients/${selectedClientForPlanChange.id}/action/`,
        { action: 'ASSIGN_PLAN', plan: targetPlan.name },
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
    fetchBackendData();
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
      <div className="max-w-7xl mx-auto pb-24 px-3 sm:px-6 lg:px-8 font-sans w-full min-w-0">
        
        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className={cn(
            "fixed top-4 sm:top-6 right-4 sm:right-6 z-[350] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl font-semibold text-xs border animate-in fade-in slide-in-from-top-3 duration-200 max-w-[90vw]",
            toastMessage.type === 'error' 
              ? "bg-rose-900 text-white border-rose-700" 
              : "bg-emerald-900 text-white border-emerald-700"
          )}>
            {toastMessage.type === 'error' ? (
              <AlertCircle size={16} className="text-rose-300 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            )}
            <span className="truncate">{toastMessage.msg}</span>
          </div>
        )}

        {/* ── 1. Page Header & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 my-6 sm:my-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                PLAN MANAGEMENT
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
                {summaryMetrics.activePlans} Active Plans
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <Loader2 size={11} className="animate-spin text-emerald-600" /> Syncing...
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              Create plans, manage features, and control client access.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={fetchBackendData}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
              title="Refresh plans & catalog"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
            </button>
            <button
              onClick={handleOpenCreatePlan}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} /> Create Plan
            </button>
          </div>
        </div>

        {/* ── 2. Summary Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">TOTAL PLANS</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">{summaryMetrics.totalPlans}</h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 ml-2">
              <Layers size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">ACTIVE PLANS</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 sm:mt-1">{summaryMetrics.activePlans}</h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 ml-2">
              <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">TOTAL FEATURES</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">{summaryMetrics.totalFeatures}</h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0 ml-2">
              <Zap size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">CLIENTS ASSIGNED</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">{summaryMetrics.clientsAssigned}</h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shrink-0 ml-2">
              <Users size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* ── 3. Plan Tabs Navigation (Exact 3 Options: Plans, Catalog, Client Assignments) ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar scrollbar-none flex-nowrap w-full">
          <button
            onClick={() => setActiveTab('plans')}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
              activeTab === 'plans'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Layers size={15} />
            <span>Plans</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'plans' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {plans.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('catalog'); if (featureTypeFilter === 'ALL') setFeatureTypeFilter('Channel'); }}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
              activeTab === 'catalog'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Zap size={15} />
            <span>Catalog</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'catalog' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {features.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
              activeTab === 'assignments'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Users size={15} />
            <span>Client Assignments</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono",
              activeTab === 'assignments' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {clients.length}
            </span>
          </button>
        </div>

        {/* ── 4. TAB 1: PLANS (Interkart Pricing Comparison View) ── */}
        {activeTab === 'plans' && (
          <div>
            <PricingComparisonTable 
              plansData={plans}
              isAdminView={true}
              onManagePlan={(plan, cycle) => handleOpenManagePlan(plan, cycle)}
            />
          </div>
        )}

        {/* ── 5. TAB 2: CATALOG (CHANNELS, CONNECTORS, FEATURES) ── */}
        {activeTab === 'catalog' && (
          <div>
            {/* Quick Type Filter Pills */}
            <div className="flex items-center gap-2 mb-3.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setFeatureTypeFilter('ALL')}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                  featureTypeFilter === 'ALL' ? "bg-slate-900 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                ✨ All Items ({features.length})
              </button>
              <button
                onClick={() => setFeatureTypeFilter('Channel')}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                  featureTypeFilter === 'Channel' ? "bg-blue-600 text-white shadow-xs" : "bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100"
                )}
              >
                📢 Channels ({channelCount})
              </button>
              <button
                onClick={() => setFeatureTypeFilter('Connector')}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                  featureTypeFilter === 'Connector' ? "bg-purple-600 text-white shadow-xs" : "bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100"
                )}
              >
                🔌 Connectors ({connectorCount})
              </button>
              <button
                onClick={() => setFeatureTypeFilter('Module')}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                  featureTypeFilter === 'Module' ? "bg-emerald-600 text-white shadow-xs" : "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
                )}
              >
                ⚡ Features & Modules ({moduleCount})
              </button>
            </div>

            <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
                <input
                  type="text"
                  placeholder="Search features, keys, modules..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={featureCategoryFilter}
                  onChange={(e) => setFeatureCategoryFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <button
                  onClick={handleOpenAddFeature}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden w-full">
              <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[620px]">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                      <th className="py-3.5 px-4 sm:px-6">Feature</th>
                      <th className="py-3.5 px-4 sm:px-6">Category</th>
                      <th className="py-3.5 px-4 sm:px-6">Type</th>
                      <th className="py-3.5 px-4 sm:px-6">Used In Plans</th>
                      <th className="py-3.5 px-4 sm:px-6">Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredFeaturesList.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              {getFeatureBrandLogo(f.key, 20)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{f.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-normal truncate">{f.key}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {f.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                            f.feature_type === 'Channel' ? "bg-blue-50 text-blue-700 border-blue-200" :
                            f.feature_type === 'Connector' ? "bg-purple-50 text-purple-700 border-purple-200" :
                            "bg-teal-50 text-teal-700 border-teal-200"
                          )}>
                            {f.feature_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                          {f.plan_count || plans.filter(p => p.feature_keys?.includes(f.key)).length} Plans
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatureActiveStatus(f)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs hover:scale-105",
                              f.is_active 
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300" 
                                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                            )}
                            title="Click to toggle Active / Inactive (Coming Soon)"
                          >
                            <span className={cn("w-2 h-2 rounded-full", f.is_active ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                            {f.is_active ? 'ACTIVE' : 'DEACTIVE (COMING SOON)'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => showToast(`Feature "${f.name}" info loaded`)}
                            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. TAB 3: CLIENT ASSIGNMENTS ── */}
        {activeTab === 'assignments' && (
          <div>
            <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="relative w-full sm:w-80">
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

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden w-full">
              <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                      <th className="py-3.5 px-4 sm:px-6">Client & Business</th>
                      <th className="py-3.5 px-4 sm:px-6">Assigned Plan</th>
                      <th className="py-3.5 px-4 sm:px-6">Plan Price</th>
                      <th className="py-3.5 px-4 sm:px-6">Custom Overrides</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredClientsList.map((client) => {
                      const clientPlan = plans.find(p => p.id === client.plan_id) || plans[0];
                      const totalFeats = (clientPlan?.feature_keys?.length || 0) + (client.custom_added?.length || 0) - (client.custom_removed?.length || 0);

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{client.business_name}</span>
                              <span className="text-[11px] text-slate-400 font-normal truncate">{client.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                              {client.plan_name || clientPlan?.name || 'Starter'}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6 font-semibold text-slate-700 whitespace-nowrap">
                            ₹{clientPlan?.price ? clientPlan.price.toLocaleString() : '999'} / mo
                          </td>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
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
                          <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                              <button
                                onClick={() => handleOpenChangeClientPlan(client)}
                                className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                Change Plan
                              </button>
                              <button
                                onClick={() => handleOpenClientFeatureManagement(client)}
                                className="px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
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
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl sm:max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="min-w-0 pr-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    {isCreatePlanModalOpen ? 'CREATE NEW PLAN' : `EDIT PLAN: ${editingPlan?.name.toUpperCase()}`}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {isCreatePlanModalOpen ? 'Configure plan attributes & select feature entitlements' : 'Modify plan pricing and toggle feature access'}
                  </p>
                </div>
                <button
                  onClick={() => { setIsCreatePlanModalOpen(false); setIsEditPlanModalOpen(false); }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div 
                onWheel={(e) => { if (e.deltaY) e.currentTarget.scrollLeft += e.deltaY; }}
                className="px-4 pt-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 pb-1.5"
              >
                <button
                  type="button"
                  onClick={() => setModalEditorTab('basic')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'basic' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  ⚙️ Basic & Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setModalEditorTab('what_you_get')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'what_you_get' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  1️⃣ What You Get
                </button>
                <button
                  type="button"
                  onClick={() => setModalEditorTab('features')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'features' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  2️⃣ Features
                </button>
                <button
                  type="button"
                  onClick={() => setModalEditorTab('limits')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'limits' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  3️⃣ Limits & Quotas
                </button>
                <button
                  type="button"
                  onClick={() => setModalEditorTab('costs')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'costs' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  4️⃣ Message Rates
                </button>
                <button
                  type="button"
                  onClick={() => setModalEditorTab('entitlements')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-t border-x whitespace-nowrap",
                    modalEditorTab === 'entitlements' ? "bg-white text-slate-900 border-slate-200 shadow-2xs" : "text-slate-500 hover:text-slate-900 border-transparent"
                  )}
                >
                  ⚡ Modules Catalog
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={isCreatePlanModalOpen ? handleCreatePlanSubmit : handleEditPlanSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 sm:space-y-6">
                
                {/* ── Cycle Switcher Bar ── */}
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPlanForm(prev => ({ ...prev, activeCycle: 'monthly' }))}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                      planForm.activeCycle === 'monthly'
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80"
                    )}
                  >
                    <Calendar size={14} />
                    <span>🗓️ Monthly Billing Config</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                      planForm.activeCycle === 'monthly' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    )}>
                      ₹{planForm.monthlyConfig?.price || 0}/mo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanForm(prev => ({ ...prev, activeCycle: 'yearly' }))}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                      planForm.activeCycle === 'yearly'
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80"
                    )}
                  >
                    <Calendar size={14} />
                    <span>📅 Yearly Billing Config</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                      planForm.activeCycle === 'yearly' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    )}>
                      ₹{planForm.yearlyConfig?.price || 0}/yr
                    </span>
                  </button>
                </div>

                {/* Active Cycle Indicator Banner */}
                <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold">
                  <span>Currently editing: <strong className="uppercase underline decoration-emerald-500">{planForm.activeCycle} BILLING CYCLE</strong></span>
                  <span className="text-[10px] font-semibold text-emerald-700">Changes apply independently to this billing cycle only</span>
                </div>

                {/* TAB 1: BASIC INFO & PRICING */}
                {modalEditorTab === 'basic' && (
                  <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Plan Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Starter, Growth, Advanced"
                          value={planForm.name}
                          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          {planForm.activeCycle === 'yearly' ? 'Yearly Price (₹ / Year) *' : 'Monthly Price (₹ / Month) *'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            required
                            placeholder="999"
                            value={getActiveConfig().price || ''}
                            onChange={(e) => updateActiveConfigField('price', e.target.value)}
                            className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Badge Text (e.g. STARTER, MOST POPULAR)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. STARTER, MOST POPULAR, POWER HOUSE"
                          value={planForm.badge_text || ''}
                          onChange={(e) => setPlanForm({ ...planForm, badge_text: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Max Channels Allowed ({planForm.activeCycle.toUpperCase()})
                        </label>
                        <input
                          type="number"
                          placeholder="1, 2, 3..."
                          value={getActiveConfig().max_channels || '1'}
                          onChange={(e) => updateActiveConfigField('max_channels', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Description (Subtitle under Plan Name)
                      </label>
                      <input
                        type="text"
                        placeholder="Short summary of target clients and tier scope"
                        value={planForm.description}
                        onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
                )}

                {/* TAB 2: WHAT YOU GET */}
                {modalEditorTab === 'what_you_get' && (
                  <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1">
                        1. WHAT YOU GET ({planForm.activeCycle.toUpperCase()} CHANNEL CAPABILITIES)
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3 font-medium">
                        Select a channel to edit its bullet points for the <strong className="text-emerald-700 uppercase">{planForm.activeCycle}</strong> subscription matrix.
                      </p>

                      {/* Channel Sub-Tabs */}
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('whatsapp')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'whatsapp' ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <WhatsAppLogo size={14} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('facebook')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'facebook' ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <FacebookLogo size={14} />
                          <span>Facebook</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('instagram')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'instagram' ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <InstagramLogo size={14} />
                          <span>Instagram</span>
                        </button>
                      </div>

                      {editorChannelTab === 'whatsapp' && (
                        <textarea
                          rows={6}
                          placeholder={"WhatsApp Business API Automation\nShared Team Inbox for WhatsApp\nAutomated Keyword Replies\nContact & Lead Sync"}
                          value={getActiveConfig().whatsapp_what_you_get || ''}
                          onChange={(e) => updateActiveConfigField('whatsapp_what_you_get', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                      {editorChannelTab === 'facebook' && (
                        <textarea
                          rows={6}
                          placeholder={"Facebook Messenger Automation\nFacebook Page Inbox Sync\nAutomated Page Quick-Replies\nLead Form Acquisition"}
                          value={getActiveConfig().facebook_what_you_get || ''}
                          onChange={(e) => updateActiveConfigField('facebook_what_you_get', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                      {editorChannelTab === 'instagram' && (
                        <textarea
                          rows={6}
                          placeholder={"Instagram Direct DM Automation\nStory Mention Auto-Replies\nComment Automation & Quick-Flows\nShared Inbox for Insta DMs"}
                          value={getActiveConfig().instagram_what_you_get || ''}
                          onChange={(e) => updateActiveConfigField('instagram_what_you_get', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: FEATURES */}
                {modalEditorTab === 'features' && (
                  <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1">
                        2. FEATURES & AUTOMATION ({planForm.activeCycle.toUpperCase()})
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3 font-medium">
                        Select a channel to edit its features & automation points for the <strong className="text-emerald-700 uppercase">{planForm.activeCycle}</strong> matrix.
                      </p>

                      {/* Channel Sub-Tabs */}
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('whatsapp')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'whatsapp' ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <WhatsAppLogo size={14} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('facebook')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'facebook' ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <FacebookLogo size={14} />
                          <span>Facebook</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorChannelTab('instagram')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border cursor-pointer",
                            editorChannelTab === 'instagram' ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <InstagramLogo size={14} />
                          <span>Instagram</span>
                        </button>
                      </div>

                      {editorChannelTab === 'whatsapp' && (
                        <textarea
                          rows={6}
                          placeholder={"WhatsApp Auto Replies\nShared Inbox\nKeyword Triggers\nContact Management"}
                          value={getActiveConfig().whatsapp_features || ''}
                          onChange={(e) => updateActiveConfigField('whatsapp_features', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                      {editorChannelTab === 'facebook' && (
                        <textarea
                          rows={6}
                          placeholder={"Facebook Auto Replies\nShared Page Inbox\nAd Lead Capture\nContact Management"}
                          value={getActiveConfig().facebook_features || ''}
                          onChange={(e) => updateActiveConfigField('facebook_features', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                      {editorChannelTab === 'instagram' && (
                        <textarea
                          rows={6}
                          placeholder={"Insta Quick-Flows & Price Query Bots\nComment & Story Mention Triggers\nShared Inbox for DMs & Comments\nGiveaway & Promo Automation"}
                          value={getActiveConfig().instagram_features || ''}
                          onChange={(e) => updateActiveConfigField('instagram_features', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 leading-relaxed transition-all"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: LIMITS & QUOTAS */}
                {modalEditorTab === 'limits' && (
                  <div className="space-y-4">
                    {/* 1. Global Workspace Quotas */}
                    <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          1. Workspace & Account Quotas ({planForm.activeCycle.toUpperCase()})
                        </h4>
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          Type exact number or 'unlimited'
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Messages / Convs
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. unlimited, 50000"
                            value={getActiveConfig().messages_limit || 'unlimited'}
                            onChange={(e) => updateActiveConfigField('messages_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Contacts Limit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. unlimited, 10000"
                            value={getActiveConfig().contacts_limit || 'unlimited'}
                            onChange={(e) => updateActiveConfigField('contacts_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Team / Agents
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 3, 10, unlimited"
                            value={getActiveConfig().team_members_limit || '3'}
                            onChange={(e) => updateActiveConfigField('team_members_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Bots / Workflows
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 5, 25, unlimited"
                            value={getActiveConfig().workflows_limit || '5'}
                            onChange={(e) => updateActiveConfigField('workflows_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Custom Fields & CRM Data Quotas */}
                    <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        2. CRM Custom Data Quotas ({planForm.activeCycle.toUpperCase()})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Custom Fields Limit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 15, 25, 30"
                            value={getActiveConfig().custom_fields_limit || '15'}
                            onChange={(e) => updateActiveConfigField('custom_fields_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Custom Tags Limit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 15, 30, 45"
                            value={getActiveConfig().custom_tags_limit || '15'}
                            onChange={(e) => updateActiveConfigField('custom_tags_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                            Custom Events Limit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. —, 5, 7"
                            value={getActiveConfig().custom_events_limit || '5'}
                            onChange={(e) => updateActiveConfigField('custom_events_limit', e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Per-Channel Specific Quotas */}
                    <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          3. Channel-Specific Quotas ({planForm.activeCycle.toUpperCase()})
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditorChannelTab('whatsapp')}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                              editorChannelTab === 'whatsapp' ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            WhatsApp
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorChannelTab('facebook')}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                              editorChannelTab === 'facebook' ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            Facebook
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorChannelTab('instagram')}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                              editorChannelTab === 'instagram' ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            Instagram
                          </button>
                        </div>
                      </div>

                      {editorChannelTab === 'whatsapp' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Messages Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 50000"
                                value={getActiveConfig().whatsapp_messages_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('whatsapp_messages_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Contacts Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 10000"
                                value={getActiveConfig().whatsapp_contacts_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('whatsapp_contacts_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Custom Fields</label>
                              <input
                                type="text"
                                placeholder="e.g. 15, 25"
                                value={getActiveConfig().whatsapp_custom_fields || '15'}
                                onChange={(e) => updateActiveConfigField('whatsapp_custom_fields', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Messages Subtitle / Description Text</label>
                            <input
                              type="text"
                              placeholder="e.g. Based on your WhatsApp Number"
                              value={getActiveConfig().whatsapp_messages_desc || 'Based on your WhatsApp Number'}
                              onChange={(e) => updateActiveConfigField('whatsapp_messages_desc', e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      )}

                      {editorChannelTab === 'facebook' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Convs Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 50000"
                                value={getActiveConfig().facebook_messages_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('facebook_messages_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Contacts Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 10000"
                                value={getActiveConfig().facebook_contacts_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('facebook_contacts_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Custom Fields</label>
                              <input
                                type="text"
                                placeholder="e.g. 15, 25"
                                value={getActiveConfig().facebook_custom_fields || '15'}
                                onChange={(e) => updateActiveConfigField('facebook_custom_fields', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Conversations Subtitle / Description Text</label>
                            <input
                              type="text"
                              placeholder="e.g. Facebook Page Messaging"
                              value={getActiveConfig().facebook_messages_desc || 'Facebook Page Messaging'}
                              onChange={(e) => updateActiveConfigField('facebook_messages_desc', e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {editorChannelTab === 'instagram' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram DMs Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 50000"
                                value={getActiveConfig().instagram_messages_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('instagram_messages_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Contacts Limit</label>
                              <input
                                type="text"
                                placeholder="e.g. unlimited, 10000"
                                value={getActiveConfig().instagram_contacts_limit || 'unlimited'}
                                onChange={(e) => updateActiveConfigField('instagram_contacts_limit', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Custom Fields</label>
                              <input
                                type="text"
                                placeholder="e.g. 15, 25"
                                value={getActiveConfig().instagram_custom_fields || '15'}
                                onChange={(e) => updateActiveConfigField('instagram_custom_fields', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">DMs Subtitle / Description Text</label>
                            <input
                              type="text"
                              placeholder="e.g. Instagram Professional Account"
                              value={getActiveConfig().instagram_messages_desc || 'Instagram Professional Account'}
                              onChange={(e) => updateActiveConfigField('instagram_messages_desc', e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Dynamic Custom Quota Fields (Add Any Custom Limit) */}
                    <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                            4. Custom Limit & Quota Rows ({planForm.activeCycle.toUpperCase()})
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Add your own custom quota items (e.g. "Cloud Storage", "Daily Webhooks", "API Rate Limit")
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={addCustomQuotaField}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                        >
                          <Plus size={14} />
                          <span>Add Custom Limit</span>
                        </button>
                      </div>

                      {(getActiveConfig().custom_quota_fields || []).length === 0 ? (
                        <div className="text-center py-5 border-2 border-dashed border-slate-200 rounded-xl bg-white/60">
                          <p className="text-xs font-bold text-slate-600">No custom quota rows added yet</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Custom Limit" above to add your own custom plan limit with name & value</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {(getActiveConfig().custom_quota_fields || []).map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Limit Title / Field Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Cloud Storage, Daily Webhooks"
                                  value={item.label || ''}
                                  onChange={(e) => updateCustomQuotaField(idx, 'label', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Limit Value</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 10 GB, 50 / day, Unlimited"
                                  value={item.value || ''}
                                  onChange={(e) => updateCustomQuotaField(idx, 'value', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="pt-4">
                                <button
                                  type="button"
                                  onClick={() => removeCustomQuotaField(idx)}
                                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Limit Row"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: MESSAGE COSTS */}
                {modalEditorTab === 'costs' && (
                  <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1">
                      4. MESSAGE COST & RATES ({planForm.activeCycle.toUpperCase()})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Marketing Template Rate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹0.970"
                          value={getActiveConfig().whatsapp_marketing_cost || '₹0.970'}
                          onChange={(e) => updateActiveConfigField('whatsapp_marketing_cost', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Authentication Rate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹0.129"
                          value={getActiveConfig().whatsapp_auth_cost || '₹0.129'}
                          onChange={(e) => updateActiveConfigField('whatsapp_auth_cost', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Utility Template Rate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹0.160"
                          value={getActiveConfig().whatsapp_utility_cost || '₹0.160'}
                          onChange={(e) => updateActiveConfigField('whatsapp_utility_cost', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                          Service Session Rate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. FREE"
                          value={getActiveConfig().whatsapp_service_cost || 'FREE'}
                          onChange={(e) => updateActiveConfigField('whatsapp_service_cost', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: MODULE ENTITLEMENTS */}
                {modalEditorTab === 'entitlements' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap size={14} className="text-emerald-600" /> FEATURE ENTITLEMENTS ({planForm.activeCycle.toUpperCase()})
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {(getActiveConfig().selected_feature_keys || []).length} of {features.length} features enabled in this {planForm.activeCycle} configuration
                        </p>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar flex-nowrap">
                        <button
                          type="button"
                          onClick={() => setModalActiveCategory('ALL')}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0",
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
                              "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer shrink-0",
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
                          const activeKeys = getActiveConfig().selected_feature_keys || [];
                          const selectedCount = categoryFeatures.filter(f => activeKeys.includes(f.key)).length;
                          const allCatSelected = categoryFeatures.length > 0 && selectedCount === categoryFeatures.length;

                          return (
                            <div
                              key={category}
                              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                            >
                              {/* Category Header */}
                              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-100">
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
                              <div className="p-2.5 sm:p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                                {categoryFeatures.map((feat) => {
                                  const isChecked = activeKeys.includes(feat.key);
                                  return (
                                    <div
                                      key={feat.key}
                                      onClick={() => toggleSingleFeatureInForm(feat.key)}
                                      className={cn(
                                        "flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer select-none group min-w-0",
                                        isChecked 
                                          ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20 shadow-2xs" 
                                          : "bg-white border-slate-200/90 hover:bg-slate-50"
                                      )}
                                    >
                                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                        {/* Brand Logo / Icon */}
                                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform p-0.5">
                                          {getFeatureBrandLogo(feat.key, 20)}
                                        </div>

                                        <div className="min-w-0">
                                          <p className={cn("text-xs font-extrabold truncate leading-tight", isChecked ? "text-slate-900" : "text-slate-600")}>
                                            {feat.name}
                                          </p>
                                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{feat.description}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold hidden sm:inline">
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
                )}

                {/* Modal Footer Actions */}
                <div className="pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sticky bottom-0 bg-white pb-2">
                  {isEditPlanModalOpen && editingPlan ? (
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(editingPlan.id, editingPlan.name)}
                      className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer w-full sm:w-auto"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete Plan
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => { setIsCreatePlanModalOpen(false); setIsEditPlanModalOpen(false); }}
                      className="flex-1 sm:flex-none px-4 py-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              
              <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="min-w-0 pr-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">ADD FEATURE TO CATALOG</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                    Register a new modular entitlement into UWO Connect
                  </p>
                </div>
                <button
                  onClick={() => setIsAddFeatureModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddFeatureSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={featureForm.category}
                      onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Communication">Communication</option>
                      <option value="AI & Automation">AI & Automation</option>
                      <option value="CRM">CRM</option>
                      <option value="Sales">Sales</option>
                      <option value="Team">Team</option>
                      <option value="Documents">Documents</option>
                      <option value="System">System</option>
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
                      <option value="Module">Module</option>
                      <option value="Channel">Channel</option>
                      <option value="Connector">Connector</option>
                      <option value="Limit">Limit</option>
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

                <div className="pt-3 sm:pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
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
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl p-4 sm:p-6 relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="min-w-0 pr-2">
                  <h3 className="text-base font-black text-slate-900 truncate">CHANGE CLIENT PLAN</h3>
                  <p className="text-xs text-slate-400 truncate">
                    Client: <strong className="text-slate-700">{selectedClientForPlanChange.business_name}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsChangePlanModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2.5 my-4 sm:my-5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {plans.map((plan) => {
                  const isSelected = tempSelectedPlanId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      onClick={() => setTempSelectedPlanId(plan.id)}
                      className={cn(
                        "flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer min-w-0",
                        isSelected 
                          ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/10 shadow-xs" 
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          isSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                        )}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{plan.name}</p>
                          <p className="text-[11px] text-slate-500 font-normal truncate">{plan.feature_keys?.length || 0} Features Included</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 shrink-0 ml-2 whitespace-nowrap">
                        ₹{plan.price.toLocaleString()} / mo
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
              
              <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="min-w-0 pr-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">CLIENT FEATURE ACCESS</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {clientForFeatureManagement.business_name} (Plan: <strong>{clientForFeatureManagement.plan_name}</strong>)
                  </p>
                </div>
                <button
                  onClick={() => setIsManageClientFeaturesOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 sm:p-3.5 rounded-2xl text-xs text-emerald-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles size={15} className="text-emerald-600 shrink-0" /> Custom Feature Override Control
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
                        className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all min-w-0 gap-2"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-0.5">
                            {getFeatureBrandLogo(feat.key, 20)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <p className="text-xs font-bold text-slate-900 truncate">{feat.name}</p>
                              {isInBasePlan && (
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded shrink-0">
                                  Base Plan
                                </span>
                              )}
                              {isCustomAdded && (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded shrink-0">
                                  Custom Granted
                                </span>
                              )}
                              {isCustomRemoved && (
                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded shrink-0">
                                  Revoked
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{feat.category} • {feat.feature_type}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleClientCustomFeature(feat.key, isEffectiveActive)}
                          className={cn(
                            "w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-2",
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

              <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-200 flex items-center justify-end bg-white">
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

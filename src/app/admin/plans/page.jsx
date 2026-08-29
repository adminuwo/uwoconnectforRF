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
  Database
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

  // 1. Core Channels
  if (k.includes('whatsapp')) return <WhatsAppLogo size={size} />;
  if (k.includes('facebook') || k.includes('messenger')) return <FacebookLogo size={size} />;
  if (k.includes('instagram')) return <InstagramLogo size={size} />;
  if (k.includes('telegram')) return <TelegramLogo size={size} />;
  if (k.includes('gmail')) return <GmailLogo size={size} />;
  if (k.includes('outlook')) return <OutlookLogo size={size} />;
  if (k.includes('onedrive')) return <OneDriveLogo size={size} />;

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
  // Communication
  { id: 'f-wa', key: 'channel_whatsapp', name: 'WhatsApp Channel', category: 'Communication', feature_type: 'Channel', description: 'Official WhatsApp Cloud API & web integration', is_active: true, plan_count: 3 },
  { id: 'f-fb', key: 'channel_facebook', name: 'Facebook Messenger', category: 'Communication', feature_type: 'Channel', description: 'Facebook page messaging & live sync', is_active: true, plan_count: 3 },
  { id: 'f-ig', key: 'channel_instagram', name: 'Instagram Direct', category: 'Communication', feature_type: 'Channel', description: 'Instagram DM automation & live chat', is_active: true, plan_count: 2 },
  { id: 'f-tg', key: 'channel_telegram', name: 'Telegram Bot', category: 'Communication', feature_type: 'Channel', description: 'Telegram bot channel integration', is_active: true, plan_count: 2 },
  { id: 'f-live-inbox', key: 'live_messages_inbox', name: 'Live Omnichannel Inbox', category: 'Communication', feature_type: 'Module', description: 'Unified multi-channel live conversation hub', is_active: true, plan_count: 3 },
  { id: 'f-email', key: 'channel_email', name: 'Email Workflows', category: 'Communication', feature_type: 'Channel', description: 'Inbound/outbound email automation', is_active: true, plan_count: 2 },

  // AI & Automation
  { id: 'f-ai-assist', key: 'ai_copilot', name: 'AI Smart Assistant', category: 'AI & Automation', feature_type: 'Module', description: 'AI copilot for replies & summaries', is_active: true, plan_count: 3 },
  { id: 'f-ai-bots', key: 'ai_flow_bots', name: 'AI Chatbots & Workflows', category: 'AI & Automation', feature_type: 'Module', description: 'Visual conversational bot builder', is_active: true, plan_count: 2 },
  { id: 'f-ai-auto', key: 'ai_auto_pilot', name: 'Advanced AI Auto-Pilot', category: 'AI & Automation', feature_type: 'Module', description: 'Autonomous agent decision engine', is_active: true, plan_count: 1 },

  // CRM & Leads
  { id: 'f-clients', key: 'crm_clients', name: 'Client Directory & Workspaces', category: 'CRM', feature_type: 'Module', description: 'Multi-tenant client database & intelligence', is_active: true, plan_count: 3 },
  { id: 'f-leads', key: 'crm_leads', name: 'Lead Pipeline Management', category: 'CRM', feature_type: 'Module', description: 'Deal stages, funnel conversion & tracking', is_active: true, plan_count: 2 },
  { id: 'f-search', key: 'global_omnisearch', name: 'Global Omni-Search', category: 'CRM', feature_type: 'Module', description: 'Universal search across messages & files', is_active: true, plan_count: 3 },

  // Sales & Finance
  { id: 'f-products', key: 'sales_catalog', name: 'Products & Services Catalog', category: 'Sales', feature_type: 'Module', description: 'Item pricing, variants & SKU management', is_active: true, plan_count: 3 },
  { id: 'f-quotes', key: 'sales_quotations', name: 'Quotations & Estimates', category: 'Sales', feature_type: 'Module', description: 'Instant PDF quotes with approvals', is_active: true, plan_count: 2 },
  { id: 'f-proposals', key: 'sales_proposals', name: 'Business Proposals', category: 'Sales', feature_type: 'Module', description: 'Multi-page branded client proposals', is_active: true, plan_count: 2 },
  { id: 'f-invoices', key: 'sales_invoices', name: 'Tax Invoices & Billing', category: 'Sales', feature_type: 'Module', description: 'Automated invoice generation & receipts', is_active: true, plan_count: 2 },
  { id: 'f-sales-orders', key: 'sales_orders', name: 'Sales Orders & Checkout', category: 'Sales', feature_type: 'Module', description: 'Order lifecycle and webhook tracking', is_active: true, plan_count: 2 },

  // Team & Collaboration
  { id: 'f-team', key: 'team_management', name: 'Team Roles & Permissions', category: 'Team', feature_type: 'Module', description: 'Role-based access permissions & seats', is_active: true, plan_count: 3 },
  { id: 'f-reports', key: 'team_work_reports', name: 'Staff Work Reports & Analytics', category: 'Team', feature_type: 'Module', description: 'Daily task logging & performance analytics', is_active: true, plan_count: 2 },
  { id: 'f-audit', key: 'security_audit_logs', name: 'Enterprise Audit Logs', category: 'Team', feature_type: 'Module', description: 'Immutable activity tracking & compliance trail', is_active: true, plan_count: 1 },

  // Knowledge & Documents
  { id: 'f-kb', key: 'knowledge_base', name: 'Knowledge Base & FAQs', category: 'Documents', feature_type: 'Module', description: 'Vectorized knowledge base documents', is_active: true, plan_count: 2 },
  { id: 'f-onedrive', key: 'connector_onedrive', name: 'OneDrive & Cloud Sync', category: 'Documents', feature_type: 'Connector', description: 'Direct sync with cloud document drives', is_active: true, plan_count: 1 },
];

// ── DEFAULT BENCHMARK PLANS ──
const INITIAL_PLANS = [
  {
    id: 'plan-starter',
    name: 'Starter',
    badge: 'STARTER',
    status: 'ACTIVE',
    description: 'Essential communication tools for solo entrepreneurs & small businesses.',
    price: 999,
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
    name: 'Professional',
    badge: 'PROFESSIONAL',
    status: 'ACTIVE',
    description: 'Complete sales automation, AI bots, invoicing and team intelligence.',
    price: 2999,
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
    name: 'Enterprise',
    badge: 'ENTERPRISE',
    status: 'ACTIVE',
    description: 'Unlimited features, custom connectors, AI auto-pilot, audit logs and SLA.',
    price: 9999,
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
        const mappedPlans = plansRes.value.data.results.map(p => ({
          id: p.id,
          name: p.name,
          badge: p.name.toUpperCase(),
          status: p.is_active ? 'ACTIVE' : 'INACTIVE',
          description: p.description || 'Custom Enterprise Plan',
          price: p.price || 0,
          billing_cycle: p.billing_cycle || 'Monthly',
          currency: p.currency || 'INR',
          feature_keys: p.feature_keys || [],
          channel_count: p.channel_count || 4,
          connector_count: p.connector_count || 3,
          client_count: p.client_count || 0,
          is_popular: p.is_popular || false
        }));
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
    const mPrice = plan.monthly_price || plan.price || 999;
    const yPrice = plan.yearly_price || Math.round(mPrice * 12 * 0.8);
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      price: mPrice.toString(),
      yearly_price: yPrice.toString(),
      badge_text: plan.badge_text || plan.badge || '',
      max_channels: (plan.max_channels || (plan.name.toLowerCase().includes('starter') ? 1 : plan.name.toLowerCase().includes('growth') ? 2 : 3)).toString(),
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

    const mPrice = Number(planForm.price) || 0;
    const yPrice = Number(planForm.yearly_price) || Math.round(mPrice * 12 * 0.8);
    const mChannels = Number(planForm.max_channels) || 1;

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
      max_channels: mChannels,
      billing_cycle: planForm.billing_cycle,
      currency: planForm.currency,
      feature_keys: planForm.selected_feature_keys,
      channel_count: mChannels,
      connector_count: planForm.selected_feature_keys.filter(k => k.startsWith('connector_')).length || 1,
      client_count: 0,
      is_popular: false
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/plans/`, {
        name: newPlanObj.name,
        description: newPlanObj.description,
        price: newPlanObj.price,
        monthly_price: newPlanObj.monthly_price,
        yearly_price: newPlanObj.yearly_price,
        badge_text: newPlanObj.badge_text,
        max_channels: newPlanObj.max_channels,
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

    const mPrice = Number(planForm.price) || 0;
    const yPrice = Number(planForm.yearly_price) || Math.round(mPrice * 12 * 0.8);
    const mChannels = Number(planForm.max_channels) || 1;

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
      max_channels: mChannels,
      billing_cycle: planForm.billing_cycle,
      currency: planForm.currency,
      feature_keys: planForm.selected_feature_keys,
      channel_count: mChannels,
      connector_count: planForm.selected_feature_keys.filter(k => k.startsWith('connector_')).length || 1,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/plans/${editingPlan.id}/`, {
        name: updatedPlanObj.name,
        description: updatedPlanObj.description,
        price: updatedPlanObj.price,
        monthly_price: updatedPlanObj.monthly_price,
        yearly_price: updatedPlanObj.yearly_price,
        badge_text: updatedPlanObj.badge_text,
        max_channels: updatedPlanObj.max_channels,
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

        {/* ── 3. Plan Tabs Navigation (Smooth Horizontal Swipe on Mobile) ── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar scrollbar-none flex-nowrap w-full">
          <button
            onClick={() => setActiveTab('plans')}
            className={cn(
              "px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
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
              "px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
              activeTab === 'features'
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            )}
          >
            <Zap size={14} />
            <span>Features</span>
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
              "px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap",
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

        {/* ── 4. TAB 1: PLANS (Interkart Pricing Comparison View) ── */}
        {activeTab === 'plans' && (
          <div>
            <PricingComparisonTable 
              plansData={plans}
              isAdminView={true}
              onManagePlan={(plan) => handleOpenManagePlan(plan)}
            />
          </div>
        )}

        {/* ── 5. TAB 2: FEATURES CATALOG ── */}
        {activeTab === 'features' && (
          <div>
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
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 border",
                            f.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", f.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                            {f.is_active ? 'Active' : 'Inactive'}
                          </span>
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
            <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
              
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

              {/* Modal Body */}
              <form onSubmit={isCreatePlanModalOpen ? handleCreatePlanSubmit : handleEditPlanSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 sm:space-y-6">
                
                {/* 1. Plan Basic Info */}
                <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                        Monthly Price (₹/mo)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="999"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                          className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Yearly Price (₹/yr)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="9590"
                          value={planForm.yearly_price || ''}
                          onChange={(e) => setPlanForm({ ...planForm, yearly_price: e.target.value })}
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
                        Max Channels Allowed
                      </label>
                      <input
                        type="number"
                        placeholder="1, 2, 3..."
                        value={planForm.max_channels || ''}
                        onChange={(e) => setPlanForm({ ...planForm, max_channels: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all"
                      />
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={14} className="text-emerald-600" /> FEATURE ENTITLEMENTS
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {planForm.selected_feature_keys.length} of {features.length} features enabled in this plan
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
                        const selectedCount = categoryFeatures.filter(f => planForm.selected_feature_keys.includes(f.key)).length;
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
                                const isChecked = planForm.selected_feature_keys.includes(feat.key);
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

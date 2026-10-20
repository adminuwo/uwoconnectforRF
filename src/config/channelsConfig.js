/**
 * UWO CONNECT - Centralized Communication Channels Feature Flag & Access Architecture
 */

export const GLOBAL_ACTIVE_CHANNELS = ['whatsapp', 'facebook', 'instagram'];

export const GLOBAL_ALL_CHANNELS = [
  'whatsapp', 'facebook', 'instagram', 'calls', 'google_news', 'telegram',
  'gmail', 'outlook', 'onedrive', 'google_calendar', 'google_sheets',
  'google_docs', 'google_slides', 'zoho', 'youtube', 'razorpay',
  'broadcasts', 'workflows', 'automations', 'knowledge', 'crm',
  'proposals', 'quotations', 'invoices', 'catalog', 'orders', 'reports', 'team'
];

export const CHANNEL_DEFINITIONS = [
  // ================= CORE MESSAGING CHANNELS =================
  {
    key: 'whatsapp',
    name: 'WhatsApp Business',
    shortName: 'WhatsApp',
    category: 'MESSAGING',
    tagline: 'Official Cloud API',
    description: 'Official WhatsApp Business Cloud API for automated customer conversations, broadcasts, and support bots.',
    isCore: true,
    color: '#25D366',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    key: 'facebook',
    name: 'Facebook Messenger',
    shortName: 'Facebook',
    category: 'MESSAGING',
    tagline: 'Page Direct Messenger',
    description: 'Connect official Facebook Business Pages to automate visitor inquiries, auto-replies, and lead acquisition.',
    isCore: true,
    color: '#1877F2',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'instagram',
    name: 'Instagram Direct',
    shortName: 'Instagram',
    category: 'MESSAGING',
    tagline: 'Business DM Automation',
    description: 'Automate Instagram Direct Messages, story mentions, and comment-to-DM triggers for e-commerce and brand engagement.',
    isCore: true,
    color: '#E4405F',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200/80',
    iconColor: 'text-pink-600 bg-pink-50 border-pink-100',
  },

  // ================= ENTERPRISE PRODUCTIVITY & CONNECTORS =================
  {
    key: 'gmail',
    name: 'Gmail / Google Workspace',
    shortName: 'Gmail',
    category: 'EMAIL',
    tagline: 'Google Mail & Inbox Sync',
    description: 'Sync Gmail inbox, send auto-responses, trigger workflows on incoming customer emails.',
    isCore: false,
    color: '#EA4335',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    iconColor: 'text-red-600 bg-red-50 border-red-100',
  },
  {
    key: 'outlook',
    name: 'Microsoft Outlook',
    shortName: 'Outlook',
    category: 'PRODUCTIVITY',
    tagline: 'Office 365 Exchange',
    description: 'Corporate email synchronization, calendar booking, and automated email ticketing.',
    isCore: false,
    color: '#0078D4',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'onedrive',
    name: 'Microsoft OneDrive',
    shortName: 'OneDrive',
    category: 'STORAGE',
    tagline: 'Cloud Documents',
    description: 'Secure enterprise cloud storage for automated PDF invoice and receipt synchronization.',
    isCore: false,
    color: '#0078D4',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'google_calendar',
    name: 'Google Calendar',
    shortName: 'G-Calendar',
    category: 'PRODUCTIVITY',
    tagline: 'Appointment Scheduling',
    description: 'Auto-book customer consultations, team meetings, and appointment reminders.',
    isCore: false,
    color: '#4285F4',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    key: 'google_sheets',
    name: 'Google Sheets',
    shortName: 'G-Sheets',
    category: 'STORAGE',
    tagline: 'Live Spreadsheet Sync',
    description: 'Export incoming leads, order logs, and chat transcripts directly to Google Sheets.',
    isCore: false,
    color: '#0F9D58',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    key: 'google_docs',
    name: 'Google Docs',
    shortName: 'G-Docs',
    category: 'STORAGE',
    tagline: 'Document Generation',
    description: 'Auto-generate agreements, proposals, and customer reports in Google Docs.',
    isCore: false,
    color: '#4285F4',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'google_slides',
    name: 'Google Slides',
    shortName: 'G-Slides',
    category: 'PRODUCTIVITY',
    tagline: 'Pitch Deck Sync',
    description: 'Create customized client presentations and pitch decks dynamically.',
    isCore: false,
    color: '#F4B400',
    badgeBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    iconColor: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  },
  {
    key: 'zoho',
    name: 'Zoho CRM',
    shortName: 'Zoho CRM',
    category: 'CRM',
    tagline: 'CRM Lead Pipeline',
    description: 'Sync customer chats and orders into Zoho CRM module contacts and deals.',
    isCore: false,
    color: '#E42528',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    key: 'razorpay',
    name: 'Razorpay Gateway',
    shortName: 'Razorpay',
    category: 'FINANCE',
    tagline: 'Secure Online Payments',
    description: 'Accept payments directly via invoices and chat links using Razorpay integration.',
    isCore: false,
    color: '#02042B',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    key: 'youtube',
    name: 'YouTube Channel',
    shortName: 'YouTube',
    category: 'MEDIA',
    tagline: 'Community & Comments',
    description: 'Sync video comments, live stream chat moderation, and automated community replies.',
    isCore: false,
    color: '#FF0000',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    iconColor: 'text-red-600 bg-red-50 border-red-100',
  },
  {
    key: 'google_news',
    name: 'Google News Feed',
    shortName: 'G-News',
    category: 'MEDIA',
    tagline: 'News & Trends Alert',
    description: 'Monitor brand keywords, press releases, and market intelligence alerts.',
    isCore: false,
    color: '#4285F4',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'calls',
    name: 'Voice & Video Calls',
    shortName: 'Calls',
    category: 'CALLS',
    tagline: 'WebRTC In-App Calling',
    description: 'High definition audio and video calling directly from client chats and contact records.',
    isCore: false,
    color: '#059669',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    key: 'telegram',
    name: 'Telegram Messenger',
    shortName: 'Telegram',
    category: 'MESSAGING',
    tagline: 'Bot & Channel Integration',
    description: 'Connect Telegram bots for instant customer messaging, alert broadcasts, and support groups.',
    isCore: false,
    color: '#229ED9',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    key: 'google_maps',
    name: 'Google Maps',
    shortName: 'G-Maps',
    category: 'LOCATION',
    tagline: 'Location Intelligence',
    description: 'Google Maps location intelligence, business verification, and geo-location routing.',
    isCore: false,
    color: '#EA4335',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    iconColor: 'text-red-600 bg-red-50 border-red-100',
  },

  // ================= CORE PLATFORM FEATURES =================
  {
    key: 'broadcasts',
    name: 'Broadcast Campaigns',
    shortName: 'Broadcasts',
    category: 'MARKETING',
    tagline: 'Targeted Mass Messaging',
    description: 'Send targeted promotional campaigns, announcements, and newsletters across messaging channels.',
    isCore: false,
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    key: 'workflows',
    name: 'Automated Workflows',
    shortName: 'Workflows',
    category: 'AUTOMATION',
    tagline: 'Multi-step Automation',
    description: 'Build visual multi-step workflow automations, conditional logic, and webhooks.',
    isCore: false,
    color: '#3b82f6',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    key: 'automations',
    name: 'Auto-Replies & Triggers',
    shortName: 'Automations',
    category: 'AUTOMATION',
    tagline: 'Keyword & Event Triggers',
    description: 'Set up keyword triggers, out-of-office autoreplies, and interactive chat flows.',
    isCore: false,
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    key: 'knowledge',
    name: 'Knowledge Base & AI',
    shortName: 'Knowledge Base',
    category: 'AI',
    tagline: 'Vector Embeddings & RAG',
    description: 'Train AI on documents and company knowledge to empower automated intelligent support.',
    isCore: false,
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    key: 'crm',
    name: 'CRM & Leads Pipeline',
    shortName: 'CRM / Leads',
    category: 'SALES',
    tagline: 'Contact & Deal Stages',
    description: 'Manage customer profiles, lifecycle stages, deal pipelines, and custom fields.',
    isCore: false,
    color: '#6366f1',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    key: 'proposals',
    name: 'Proposals Management',
    shortName: 'Proposals',
    category: 'COMMERCE',
    tagline: 'Interactive Proposals',
    description: 'Create, send, and track digital business proposals with e-signature capabilities.',
    isCore: false,
    color: '#0284c7',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    key: 'quotations',
    name: 'Price Quotations',
    shortName: 'Quotations',
    category: 'COMMERCE',
    tagline: 'Instant Quotes & Estimates',
    description: 'Generate professional price estimates and convert them into accepted client deals.',
    isCore: false,
    color: '#06b6d4',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
  {
    key: 'invoices',
    name: 'GST Invoices & Billing',
    shortName: 'Invoices',
    category: 'COMMERCE',
    tagline: 'Tax Compliant Billing',
    description: 'Automated invoice generation with GST compliance, tax breakdowns, and receipts.',
    isCore: false,
    color: '#059669',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    key: 'catalog',
    name: 'Product Catalog',
    shortName: 'Catalog',
    category: 'COMMERCE',
    tagline: 'Products & Services',
    description: 'Showcase inventory, prices, variants, and product media in interactive chats.',
    isCore: false,
    color: '#f43f5e',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
  },
  {
    key: 'orders',
    name: 'Orders & Transactions',
    shortName: 'Orders',
    category: 'COMMERCE',
    tagline: 'Sales Order Processing',
    description: 'Track customer purchase orders, fulfillment status, and payment receipts.',
    isCore: false,
    color: '#f97316',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    key: 'reports',
    name: 'Analytics & Reports',
    shortName: 'Reports',
    category: 'REPORTING',
    tagline: 'Performance Intelligence',
    description: 'Deep conversation analytics, agent response times, and sales performance metrics.',
    isCore: false,
    color: '#4f46e5',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    key: 'team',
    name: 'Team Collaboration',
    shortName: 'Team',
    category: 'MANAGEMENT',
    tagline: 'Roles & RBAC Control',
    description: 'Manage team members, agent permissions, department assignments, and queues.',
    isCore: false,
    color: '#d946ef',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    iconColor: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100',
  }
];

/**
 * Map channel keys to system entitlement feature keys
 */
export const FEATURE_KEY_MAP = {
  'whatsapp': 'channel_whatsapp',
  'instagram': 'channel_instagram',
  'facebook': 'channel_facebook',
  'calls': 'feature_voice_video_call',
  'voice_video_call': 'feature_voice_video_call',
  'telegram': 'channel_telegram',
  'youtube': 'channel_youtube',
  'gmail': 'connector_gmail',
  'outlook': 'connector_outlook',
  'onedrive': 'connector_onedrive',
  'google_calendar': 'connector_google_calendar',
  'google_sheets': 'connector_google_sheets',
  'google_docs': 'connector_google_docs',
  'google_slides': 'connector_google_slides',
  'google_news': 'connector_google_news',
  'google_maps': 'connector_google_maps',
  'zoho': 'feature_crm',
  'razorpay': 'feature_payment',
  'team_dashboard': 'feature_team_dashboard',
  'team': 'feature_team_dashboard',
  'quotation': 'feature_quotation',
  'quotations': 'feature_quotation',
  'invoice': 'feature_invoice',
  'invoices': 'feature_invoice',
  'proposal': 'feature_proposal',
  'proposals': 'feature_proposal',
  'catalog': 'feature_catalog',
  'order': 'feature_order',
  'orders': 'feature_order',
  'payment': 'feature_payment',
  'crm': 'feature_crm',
  'autoreply': 'feature_autoreply',
  'automations': 'feature_autoreply',
  'workflow': 'feature_workflow',
  'workflows': 'feature_workflow',
  'broadcast': 'feature_broadcast',
  'broadcasts': 'feature_broadcast',
  'knowledge': 'feature_knowledge_base',
  'knowledge_base': 'feature_knowledge_base',
  'reports': 'feature_reports',
  'report': 'feature_reports',
};

// Canonical key mapping to unify all 27 database keys and their various aliases
export const CANONICAL_CHANNEL_KEY = {
  // Channels (6)
  'whatsapp': 'whatsapp',
  'facebook': 'facebook',
  'instagram': 'instagram',
  'calls': 'calls',
  'call': 'calls',
  'voice': 'calls',
  'voice_video_call': 'calls',
  'feature_voice_video_call': 'calls',
  'google_news': 'google_news',
  'connector_google_news': 'google_news',
  'telegram': 'telegram',
  'channel_telegram': 'telegram',

  // Connectors (9)
  'gmail': 'gmail',
  'connector_gmail': 'gmail',
  'outlook': 'outlook',
  'connector_outlook': 'outlook',
  'email': 'outlook',
  'onedrive': 'onedrive',
  'connector_onedrive': 'onedrive',
  'google_calendar': 'google_calendar',
  'connector_google_calendar': 'google_calendar',
  'google_sheets': 'google_sheets',
  'connector_google_sheets': 'google_sheets',
  'google_docs': 'google_docs',
  'connector_google_docs': 'google_docs',
  'google_slides': 'google_slides',
  'connector_google_slides': 'google_slides',
  'zoho': 'zoho',
  'zoho_crm': 'zoho',
  'connector_zoho': 'zoho',
  'youtube': 'youtube',
  'channel_youtube': 'youtube',

  // Features (12)
  'broadcasts': 'broadcasts',
  'broadcast': 'broadcasts',
  'feature_broadcast': 'broadcasts',
  'workflows': 'workflows',
  'workflow': 'workflows',
  'feature_workflow': 'workflows',
  'automations': 'automations',
  'automation': 'automations',
  'autoreply': 'automations',
  'feature_autoreply': 'automations',
  'knowledge': 'knowledge',
  'knowledge_base': 'knowledge',
  'feature_knowledge_base': 'knowledge',
  'crm': 'crm',
  'leads': 'crm',
  'feature_crm': 'crm',
  'proposals': 'proposals',
  'proposal': 'proposals',
  'feature_proposal': 'proposals',
  'quotations': 'quotations',
  'quotation': 'quotations',
  'quote': 'quotations',
  'feature_quotation': 'quotations',
  'invoices': 'invoices',
  'invoice': 'invoices',
  'feature_invoice': 'invoices',
  'catalog': 'catalog',
  'product': 'catalog',
  'products': 'catalog',
  'feature_catalog': 'catalog',
  'orders': 'orders',
  'order': 'orders',
  'feature_order': 'orders',
  'reports': 'reports',
  'report': 'reports',
  'feature_reports': 'reports',
  'team': 'team',
  'team_dashboard': 'team',
  'feature_team_dashboard': 'team',
  'payment': 'razorpay',
  'payments': 'razorpay',
  'razorpay': 'razorpay',
  'feature_payment': 'razorpay',
};

/**
 * Determines exact user-side channel state:
 * - 'COMING_SOON': Channel is locked by default until Admin grants access OR admin creates plan containing it
 * - 'CONNECTED': Channel is enabled and client has connected credentials
 * - 'NOT_CONNECTED': Channel is enabled and ready to connect (+ Connect Now)
 */
export function getChannelAccessState(channelKey, clientData, activePlans = []) {
  const key = String(channelKey || '').toLowerCase().trim();
  const cleanKey = key.replace(/^feature_/, '').replace(/^connector_/, '').replace(/^channel_/, '').replace(/\s+/g, '_');
  const canonicalKey = CANONICAL_CHANNEL_KEY[key] || CANONICAL_CHANNEL_KEY[cleanKey] || cleanKey;
  const featureKey = FEATURE_KEY_MAP[key] || FEATURE_KEY_MAP[cleanKey] || `connector_${cleanKey}`;

  // Google OAuth Reviewer / Verification account entitlement bypass (Phase 6):
  const isGoogleConnector = ['gmail', 'google_calendar', 'google_sheets', 'google_docs', 'google_slides', 'youtube'].includes(canonicalKey) || ['gmail', 'google_calendar', 'google_sheets', 'google_docs', 'google_slides', 'youtube'].includes(cleanKey);
  const isReviewerAccount = Boolean(
    clientData?.is_verification_account ||
    clientData?.settings?.is_verification_account ||
    (typeof window !== 'undefined' && (localStorage.getItem('is_google_reviewer') === 'true' || (localStorage.getItem('uwo_user_email') || '').includes('reviewer')))
  );

  // If this is a reviewer account and a Google connector, grant direct access without subscription paywall
  if (isReviewerAccount && isGoogleConnector) {
    const isConn = Boolean(
      (cleanKey === 'gmail' && (clientData?.gmail_enabled || clientData?.gmail_config?.email)) ||
      (cleanKey === 'google_calendar' && (clientData?.google_calendar_enabled || clientData?.google_calendar_config?.connected)) ||
      (cleanKey === 'google_sheets' && (clientData?.google_sheets_enabled || clientData?.google_sheets_config?.connected)) ||
      (cleanKey === 'google_docs' && (clientData?.google_docs_enabled || clientData?.google_docs_config?.connected)) ||
      (cleanKey === 'google_slides' && (clientData?.google_slides_enabled || clientData?.google_slides_config?.connected)) ||
      (cleanKey === 'youtube' && (clientData?.youtube_enabled || clientData?.youtube_config?.channel_id))
    );

    if (isConn) {
      return {
        status: 'CONNECTED',
        label: 'Connected',
        canConnect: false,
        canConfigure: true,
        isDisabled: false,
        isIncludedInPlan: true,
        requiredPlanName: 'Reviewer Test Plan',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    }
    return {
      status: 'NOT_CONNECTED',
      label: 'Available to Connect',
      canConnect: true,
      canConfigure: true,
      isDisabled: false,
      isIncludedInPlan: true,
      requiredPlanName: 'Reviewer Test Plan',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    };
  }

  // 0. Level 1: Global Admin Master Check (Channels, Connectors, & Features)
  const gConnectors = clientData?.global_connectors;
  const effConnectors = clientData?.effective_connectors;

  // Check all key variations against global_connectors
  const keysToCheck = [canonicalKey, key, cleanKey, featureKey];
  if (gConnectors) {
    for (const k of keysToCheck) {
      if (k && gConnectors[k] === false) {
        return {
          status: 'COMING_SOON',
          label: 'Coming Soon',
          reason: 'This feature or channel is deactivated by the administrator.',
          canConnect: false,
          canConfigure: false,
          isDisabled: true,
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      }
    }
  }

  // Check in effective_connectors
  for (const k of keysToCheck) {
    if (k && effConnectors && effConnectors[k]) {
      const effMatch = effConnectors[k];
      if (effMatch.global_active === false || effMatch.effective_status === 'COMING_SOON' || effMatch.is_coming_soon === true) {
        return {
          status: 'COMING_SOON',
          label: 'Coming Soon',
          reason: 'This feature or channel is deactivated by the administrator.',
          canConnect: false,
          canConfigure: false,
          isDisabled: true,
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      }
    }
  }

  // 1. Level 2: Admin Permission Check on Client
  const channelAccess = clientData?.channel_access || {};
  let isPermitted = true;

  if (channelAccess[key] !== undefined) {
    isPermitted = Boolean(channelAccess[key]);
  } else if (effConnectors && effConnectors[key] && effConnectors[key].client_enabled !== undefined) {
    isPermitted = Boolean(effConnectors[key].client_enabled);
  } else if (key === 'whatsapp') {
    // Legacy support for whatsapp permission check if not in effConnectors
    isPermitted = clientData?.whatsapp_enabled !== false;
  }

  if (!isPermitted) {
    return {
      status: 'COMING_SOON',
      label: 'Coming Soon',
      reason: 'This feature is coming soon for your workspace.',
      canConnect: false,
      canConfigure: false,
      isDisabled: true,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }

  // 2. Level 3: Admin Plans Check
  // If activePlans exist, check if ANY active admin plan contains this feature key or channel/connector
  let containingPlans = [];
  if (Array.isArray(activePlans) && activePlans.length > 0) {
    containingPlans = activePlans.filter(p => {
      if (!p || p.is_active === false || p.status === 'INACTIVE') return false;
      const keys = [
        ...(Array.isArray(p.feature_keys) ? p.feature_keys : []),
        ...(Array.isArray(p.metadata?.feature_keys) ? p.metadata.feature_keys : []),
        ...(Array.isArray(p.allowed_channels) ? p.allowed_channels : []),
        ...(Array.isArray(p.metadata?.allowed_channels) ? p.metadata.allowed_channels : []),
        ...(Array.isArray(p.allowed_connectors) ? p.allowed_connectors : []),
        ...(Array.isArray(p.metadata?.allowed_connectors) ? p.metadata.allowed_connectors : []),
        ...(Array.isArray(p.allowed_features) ? p.allowed_features : []),
        ...(Array.isArray(p.metadata?.allowed_features) ? p.metadata.allowed_features : [])
      ];
      return keys.includes(featureKey) || keys.includes(key);
    });

    // If active from admin side, but admin hasn't added this connector to ANY active plan yet -> Coming Soon
    if (containingPlans.length === 0) {
      return {
        status: 'COMING_SOON',
        label: 'Coming Soon',
        reason: 'Plan coming soon from Administrator for this connector.',
        canConnect: false,
        canConfigure: false,
        isDisabled: true,
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    }
  }

  // Check if included in Client's Current Plan
  let isIncludedInPlan = true;
  let requiredPlanName = containingPlans.length > 0 ? containingPlans[0].name : 'Professional Plan';

  if (clientData) {
    const clientPlanId = clientData.plan_id || clientData.plan?.id || '';
    const clientPlanName = (clientData.plan_name || clientData.plan || '').toLowerCase();
    const customAdded = clientData.custom_added || [];
    const customRemoved = clientData.custom_removed || [];

    if (customRemoved.includes(featureKey) || customRemoved.includes(key)) {
      isIncludedInPlan = false;
    } else if (customAdded.includes(featureKey) || customAdded.includes(key)) {
      isIncludedInPlan = true;
    } else if (clientPlanId && containingPlans.length > 0) {
      const match = containingPlans.find(p => {
        if (!p) return false;
        const isMatchId = p.id === clientPlanId || p.slug === clientPlanId;
        const isMatchName = (p.name || '').toLowerCase() === clientPlanName;
        return isMatchId || isMatchName;
      });
      if (!match) {
        // Client's current plan does not include this connector, but another plan does
        isIncludedInPlan = false;
      }
    }
  }

  // 3. Live Connection Check
  let isConnected = false;
  if (key === 'whatsapp') {
    const hasPhoneId = Boolean(clientData?.whatsapp_phone_number_id || clientData?.whatsapp_config?.phone_number_id);
    const hasWaba = Boolean(clientData?.whatsapp_waba_id || clientData?.whatsapp_config?.waba_id);
    isConnected = Boolean(clientData?.whatsapp_enabled && hasPhoneId && hasWaba);
  } else if (key === 'facebook') {
    isConnected = Boolean(
      clientData?.facebook_enabled ||
      clientData?.facebook_config?.page_id ||
      clientData?.facebook_config?.access_token ||
      clientData?.facebook_config?.page_name
    );
  } else if (key === 'instagram') {
    isConnected = Boolean(
      clientData?.instagram_enabled ||
      clientData?.instagram_config?.instagram_business_id ||
      clientData?.instagram_config?.instagram_business_account_id ||
      clientData?.instagram_config?.access_token ||
      clientData?.instagram_config?.username
    );
  } else if (key === 'gmail') {
    isConnected = Boolean(clientData?.gmail_enabled || clientData?.gmail_config?.email);
  } else if (key === 'outlook') {
    isConnected = Boolean(clientData?.outlook_enabled || clientData?.outlook_config?.email);
  } else if (key === 'onedrive') {
    isConnected = Boolean(clientData?.onedrive_enabled || clientData?.onedrive_config?.connected);
  } else if (key === 'google_calendar') {
    isConnected = Boolean(clientData?.google_calendar_enabled || clientData?.google_calendar_config?.connected);
  } else if (key === 'google_sheets') {
    isConnected = Boolean(clientData?.google_sheets_enabled || clientData?.google_sheets_config?.connected);
  } else if (key === 'google_docs') {
    isConnected = Boolean(clientData?.google_docs_enabled || clientData?.google_docs_config?.connected);
  } else if (key === 'google_slides') {
    isConnected = Boolean(clientData?.google_slides_enabled || clientData?.google_slides_config?.connected);
  } else if (key === 'zoho') {
    isConnected = Boolean(clientData?.zoho_enabled || clientData?.zoho_config?.connected);
  } else if (key === 'google_news') {
    isConnected = Boolean(clientData?.google_news_enabled || clientData?.google_news_config?.connected);
  } else if (key === 'youtube') {
    isConnected = Boolean(clientData?.youtube_enabled || clientData?.youtube_config?.channel_id);
  } else if (key === 'razorpay') {
    isConnected = Boolean(clientData?.razorpay_enabled || clientData?.razorpay_config?.api_key || clientData?.razorpay_config?.key_id);
  } else {
    isConnected = Boolean(clientData?.settings?.[`${key}_enabled`]);
  }

  if (isConnected) {
    return {
      status: 'CONNECTED',
      label: 'Connected',
      canConnect: false,
      canConfigure: true,
      isDisabled: false,
      isIncludedInPlan,
      requiredPlanName,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  return {
    status: 'NOT_CONNECTED',
    label: 'Available to Connect',
    canConnect: true,
    canConfigure: true,
    isDisabled: false,
    isIncludedInPlan,
    requiredPlanName,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  };
}


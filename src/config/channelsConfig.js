/**
 * UWO CONNECT - Centralized Communication Channels Feature Flag & Access Architecture
 */

export const GLOBAL_ACTIVE_CHANNELS = ['whatsapp', 'facebook', 'instagram'];

export const GLOBAL_ALL_CHANNELS = [
  'whatsapp', 'facebook', 'instagram', 'gmail', 'outlook', 'onedrive',
  'google_calendar', 'google_sheets', 'google_docs', 'google_slides',
  'zoho', 'youtube', 'google_news'
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
  }
];

/**
 * Determines exact user-side channel state:
 * - 'COMING_SOON': Channel is locked by default until Admin grants access for this workspace
 * - 'DISABLED_BY_ADMIN': Core channel was explicitly revoked by Admin
 * - 'CONNECTED': Channel is enabled and client has connected credentials
 * - 'NOT_CONNECTED': Channel is enabled and ready to connect (+ Connect Now)
 */
export function getChannelAccessState(channelKey, clientData) {
  const key = String(channelKey).toLowerCase().trim();

  // 0. Level 1: Global Admin Master Check
  const gConnectors = clientData?.global_connectors;
  const effConnectors = clientData?.effective_connectors;

  if (gConnectors && gConnectors[key] === false) {
    return {
      status: 'COMING_SOON',
      label: 'Coming Soon',
      reason: 'This integration is coming soon and will be activated shortly by the administrator.',
      canConnect: false,
      canConfigure: false,
      isDisabled: true,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }

  if (effConnectors && effConnectors[key] && effConnectors[key].global_active === false) {
    return {
      status: 'COMING_SOON',
      label: 'Coming Soon',
      reason: 'This integration is coming soon and will be activated shortly by the administrator.',
      canConnect: false,
      canConfigure: false,
      isDisabled: true,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }

  // 1. Level 2: Admin Permission Check on Client
  const channelAccess = clientData?.channel_access || {};
  let isPermitted = true;

  if (channelAccess[key] !== undefined) {
    isPermitted = Boolean(channelAccess[key]);
  } else if (effConnectors && effConnectors[key] && effConnectors[key].client_enabled !== undefined) {
    isPermitted = Boolean(effConnectors[key].client_enabled);
  } else if (key === 'whatsapp') {
    isPermitted = clientData?.whatsapp_enabled !== false;
  } else if (clientData && clientData[`${key}_enabled`] !== undefined) {
    isPermitted = Boolean(clientData[`${key}_enabled`]);
  }

  // If Admin has explicitly revoked permission for this workspace:
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

  // 2. Live Connection Check
  let isConnected = false;
  if (key === 'whatsapp') {
    isConnected = Boolean(
      (clientData?.whatsapp_access_token && clientData?.whatsapp_phone_number_id) ||
      clientData?.whatsapp_waba_id ||
      clientData?.whatsapp_phone_number_id ||
      clientData?.whatsapp_access_token
    );
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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  return {
    status: 'NOT_CONNECTED',
    label: 'Available to Connect',
    canConnect: true,
    canConfigure: true,
    isDisabled: false,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  };
}

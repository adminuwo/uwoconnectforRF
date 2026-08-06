/**
 * UwoConnect — Feature Detail Data Configuration
 * ================================================
 * Central data source for the FeatureDetailDrawer component.
 * Each entry describes a platform feature with its capabilities,
 * limitations, requirements, connectors, AI features, analytics,
 * best practices, common errors, and documentation links.
 *
 * To add a new feature, simply append an object to the array.
 */

import {
  Megaphone, ShoppingBag, Link2, GitBranch, Users,
  MessageSquare, Brain, Zap, Receipt, FileCheck,
  Settings, Sparkles, BarChart3, Globe, Mail,
  Shield, Webhook, Send, Database, FileText,
  Newspaper, Video, Bot, Layers, LifeBuoy,
} from 'lucide-react';

// ── Helper: YouTube icon (inline SVG component) ────────────────────────────
const YoutubeIcon = (props) => {
  const { size = 20, className } = props;
  return {
    type: 'svg',
    props: {
      xmlns: 'http://www.w3.org/2000/svg', width: size, height: size,
      viewBox: '0 0 24 24', fill: 'currentColor', className,
      children: {
        type: 'path',
        props: { d: 'M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107A30.213 30.213 0 0 0 0 12c0 1.944.15 3.89.49 5.837a3.003 3.003 0 0 0 2.11 2.107c1.86.51 9.388.51 9.388.51s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.107A30.213 30.213 0 0 0 24 12a30.213 30.213 0 0 0-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
      }
    }
  };
};

const featureData = [
  // ───────────────────────────────── BROADCASTS ─────────────────────────────
  {
    id: 'broadcasts',
    name: 'Broadcasts',
    icon: Megaphone,
    category: 'Marketing',
    status: 'active',
    path: '/client/campaigns',
    description: 'Send bulk WhatsApp marketing campaigns, promotional offers, and announcement broadcasts to segmented contact lists with rich media support.',
    overview: {
      what: 'Broadcasts let you send one-to-many WhatsApp messages to your entire contact database or filtered audience segments. Supports template messages with images, videos, documents, buttons, and dynamic variables.',
      why: 'Businesses use broadcasts for product launches, flash sales, appointment reminders, event invitations, and re-engagement campaigns. It is the most effective way to reach customers at scale on WhatsApp.',
      benefits: ['Reach thousands of contacts instantly', 'Rich media support (images, videos, PDFs)', 'Template-based messaging with variables', 'Audience segmentation & contact lists', 'Delivery tracking & read receipts', 'Campaign analytics & reporting'],
      aiCapabilitiesSummary: 'AI can auto-generate message copy, suggest optimal send times, detect spam, translate content, and personalize messages per recipient.',
    },
    features: [
      'WhatsApp Broadcast Campaigns', 'Scheduled Broadcasts', 'Instant Broadcasts',
      'Audience Segmentation', 'Contact Lists & Tags', 'Template Messages with Variables',
      'Rich Media — Images', 'Rich Media — Videos', 'Rich Media — Documents',
      'Interactive Buttons (Quick Reply / CTA)', 'Delivery Tracking & Status',
      'Read Receipts', 'Failed Message Retry', 'Campaign Analytics Dashboard',
      'AI Generated Message Suggestions', 'Save Campaign Drafts', 'Duplicate Campaign',
      'Export Reports (CSV / PDF)', 'Team Collaboration', 'Approval Workflow',
    ],
    limitations: [
      { title: 'Max Recipients', detail: 'Up to 10,000 recipients per campaign (depends on Meta tier)' },
      { title: 'Daily Sending Limit', detail: 'Governed by Meta Business messaging limits (1K / 10K / 100K tiers)' },
      { title: 'Meta 24hr Window', detail: 'Customer care messages must be within 24-hour reply window' },
      { title: 'Template Approval', detail: 'All broadcast templates must be approved by Meta before sending' },
      { title: 'File Size Limit', detail: 'Images: 5 MB, Videos: 16 MB, Documents: 100 MB' },
      { title: 'Max Buttons', detail: 'Up to 3 quick-reply or 2 CTA buttons per template' },
      { title: 'Rate Limits', detail: '80 messages per second for standard Business API accounts' },
      { title: 'No Personal WhatsApp', detail: 'Requires WhatsApp Business API — personal accounts not supported' },
    ],
    requirements: [
      'WhatsApp Business API Account', 'Meta Developer App Configured',
      'Verified Business Phone Number', 'Connected WhatsApp Connector',
      'At Least One Approved Template', 'Active UwoConnect Subscription',
    ],
    connectors: ['WhatsApp', 'Meta', 'Google Sheets', 'Webhook', 'CRM'],
    automations: [
      'Trigger → Send Broadcast', 'Google Sheets Update → Broadcast',
      'New Lead Captured → Welcome Broadcast', 'Workflow Completion → Broadcast',
      'Webhook Trigger → Broadcast', 'Scheduled Event → Broadcast',
    ],
    aiCapabilities: [
      'AI Message Copywriting', 'AI Translation (50+ languages)', 'AI Tone Improvement',
      'AI Personalization per Recipient', 'AI Audience Segmentation Suggestions',
      'AI Optimal Send Time', 'AI Spam Detection', 'AI Campaign Summary Generator',
      'AI Analytics Insights',
    ],
    analytics: {
      items: [
        { label: 'Campaigns Sent', value: '—' },
        { label: 'Delivery Rate', value: '—' },
        { label: 'Read Rate', value: '—' },
        { label: 'Reply Rate', value: '—' },
        { label: 'Conversions', value: '—' },
        { label: 'Failed Messages', value: '—' },
      ]
    },
    bestPractices: [
      'Always use Meta-approved templates', 'Keep messages under 1024 characters',
      'Segment your audience by interest or purchase history', 'Schedule broadcasts during business hours (9 AM – 6 PM)',
      'Avoid spamming — maintain healthy opt-in lists', 'Monitor delivery and read analytics after every campaign',
      'Use personalization variables ({name}, {order_id}) for higher engagement',
    ],
    commonErrors: [
      { error: 'Template Not Approved', fix: 'Submit template for Meta review — approval takes 1–24 hours' },
      { error: 'Connector Disconnected', fix: 'Reconnect WhatsApp in Channels → Settings' },
      { error: 'Daily Limit Exceeded', fix: 'Wait 24h or upgrade Meta messaging tier' },
      { error: 'Phone Not Verified', fix: 'Complete phone verification in Meta Business Suite' },
      { error: 'Permission Missing', fix: 'Ensure your Meta App has whatsapp_business_messaging permission' },
      { error: 'API Token Expired', fix: 'Regenerate permanent access token in Meta App dashboard' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── CATALOG ────────────────────────────────
  {
    id: 'catalog',
    name: 'Catalog Products',
    icon: ShoppingBag,
    category: 'E-Commerce',
    status: 'active',
    path: '/client/catalog',
    description: 'Create and manage product catalogs with pricing, images, and descriptions. Share products inside chat conversations and generate checkout links.',
    overview: {
      what: 'The Catalog module lets you build a digital product inventory with images, prices, descriptions, variants, and stock status. Products can be shared directly in WhatsApp/Instagram chats as interactive cards.',
      why: 'Businesses use catalogs to showcase products in real-time conversations, enabling instant product discovery and purchase intent without leaving the chat window.',
      benefits: ['In-chat product cards', 'Dynamic pricing & variants', 'Inventory tracking', 'Shareable checkout links', 'AI product descriptions', 'Integration with Orders'],
      aiCapabilitiesSummary: 'AI generates product descriptions, suggests pricing, and recommends related products based on customer behavior.',
    },
    features: [
      'Product Listing & Management', 'Product Images & Gallery', 'Dynamic Pricing',
      'Product Variants (Size, Color)', 'Stock / Inventory Tracking', 'Product Categories & Tags',
      'In-Chat Product Sharing', 'Checkout Link Generation', 'Product Search & Filters',
      'Bulk Import (CSV / Google Sheets)', 'Product Analytics', 'AI Product Descriptions',
      'Related Product Recommendations', 'QR Code for Products', 'Export Catalog (PDF)',
    ],
    limitations: [
      { title: 'Max Products', detail: 'Up to 5,000 products per catalog' },
      { title: 'Image Size', detail: 'Max 5 MB per product image, JPEG/PNG only' },
      { title: 'Variants Limit', detail: 'Up to 10 variants per product' },
      { title: 'Description Length', detail: 'Max 2,000 characters per product description' },
    ],
    requirements: [
      'Active UwoConnect Subscription', 'At Least One Connected Channel',
      'Product Images Ready', 'Pricing Information',
    ],
    connectors: ['WhatsApp', 'Instagram', 'Facebook', 'Google Sheets', 'Webhook'],
    automations: [
      'New Order → Update Stock', 'Low Stock → Alert Notification',
      'New Product Added → Share in Chat', 'Price Change → Notify Subscribed Customers',
    ],
    aiCapabilities: [
      'AI Product Description Generator', 'AI Pricing Suggestions',
      'AI Related Product Recommendations', 'AI Image Enhancement',
      'AI Category Auto-Tagging',
    ],
    analytics: {
      items: [
        { label: 'Total Products', value: '—' },
        { label: 'Products Shared', value: '—' },
        { label: 'Click-Through Rate', value: '—' },
        { label: 'Orders Generated', value: '—' },
      ]
    },
    bestPractices: [
      'Use high-quality product images (min 800x800px)',
      'Write compelling descriptions with key features first',
      'Keep pricing up to date', 'Tag products with relevant categories for easy search',
      'Regularly review analytics to identify top performers',
    ],
    commonErrors: [
      { error: 'Image Upload Failed', fix: 'Ensure image is under 5 MB and JPEG/PNG format' },
      { error: 'Product Not Visible', fix: 'Check product status is set to "Active"' },
      { error: 'CSV Import Error', fix: 'Verify CSV column headers match the template' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── CONNECTORS ─────────────────────────────
  {
    id: 'connectors',
    name: 'Connected Channels',
    icon: Link2,
    category: 'Integrations',
    status: 'active',
    path: '/client/channels',
    description: 'Connect and manage your WhatsApp Business API, Instagram Direct, Facebook Messenger, Telegram, and YouTube accounts for omnichannel communication.',
    overview: {
      what: 'The Channels module is your integration hub — connect all your customer communication platforms in one place. Messages from all channels flow into the unified inbox.',
      why: 'Customers reach out on different platforms. Connecting all channels ensures no message is missed and enables consistent AI-powered responses across every touchpoint.',
      benefits: ['Omnichannel inbox', 'Unified customer view', 'Cross-channel automation', 'Real-time message sync', 'Channel-specific AI configuration', 'Easy OAuth-based setup'],
      aiCapabilitiesSummary: 'AI responses are channel-aware — adapting tone, length, and format for each platform automatically.',
    },
    features: [
      'WhatsApp Business API', 'Instagram Direct Messages', 'Facebook Messenger',
      'Telegram Bot Integration', 'YouTube Comment Management',
      'OAuth-Based Easy Setup', 'Channel Status Monitoring', 'Multi-Account Support',
      'Channel-Specific AI Config', 'Webhook Integrations', 'Google Sheets Sync',
      'Real-Time Message Sync', 'Auto-Reconnection', 'Channel Analytics',
    ],
    limitations: [
      { title: 'WhatsApp Requires API', detail: 'Personal WhatsApp not supported — requires Business API' },
      { title: 'Instagram Business Only', detail: 'Requires Instagram Business/Creator account linked to Facebook Page' },
      { title: 'Telegram Bot Token', detail: 'Must create a bot via @BotFather on Telegram' },
      { title: 'YouTube OAuth Scopes', detail: 'Requires Google Cloud project with YouTube Data API v3 enabled' },
    ],
    requirements: [
      'Active UwoConnect Subscription',
      'Platform-Specific Business Accounts',
      'API Credentials / OAuth Tokens',
      'Verified Business Identity (for WhatsApp)',
    ],
    connectors: ['WhatsApp', 'Instagram', 'Facebook', 'Telegram', 'YouTube', 'Google Sheets', 'Webhook', 'Email'],
    automations: [
      'New Channel Connected → Welcome Flow', 'Channel Disconnected → Admin Alert',
      'New Message → Route to AI or Agent', 'Cross-Channel Lead Sync',
    ],
    aiCapabilities: [
      'Channel-Aware AI Responses', 'Auto Language Detection per Channel',
      'Platform-Specific Tone Adjustment', 'Smart Routing to Best Channel',
    ],
    analytics: {
      items: [
        { label: 'Connected Channels', value: '—' },
        { label: 'Messages Today', value: '—' },
        { label: 'Response Rate', value: '—' },
        { label: 'Uptime', value: '—' },
      ]
    },
    bestPractices: [
      'Connect all active business channels for full coverage',
      'Monitor channel health status regularly',
      'Use separate AI configs per channel for optimal responses',
      'Set up auto-reconnection alerts',
    ],
    commonErrors: [
      { error: 'OAuth Token Expired', fix: 'Re-authenticate in Channels → Reconnect' },
      { error: 'Webhook Not Receiving', fix: 'Verify webhook URL is publicly accessible and SSL-enabled' },
      { error: 'Instagram Not Linking', fix: 'Ensure Instagram is converted to Business account and linked to a Facebook Page' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── WORKFLOWS ──────────────────────────────
  {
    id: 'workflows',
    name: 'Workflows',
    icon: GitBranch,
    category: 'Automation',
    status: 'active',
    path: '/client/workflows',
    description: 'Build multi-step visual chatbot flows with conditional branching, delays, tags, webhooks, and AI-powered actions using a drag-and-drop editor.',
    overview: {
      what: 'The Visual Workflow Builder lets you design sophisticated multi-step automation sequences using drag-and-drop cards. Build lead qualification funnels, appointment booking flows, and complex customer journey automations.',
      why: 'Manual responses don\'t scale. Workflows automate repetitive interactions — collecting information, routing leads, scheduling appointments, and sending follow-ups — 24/7 without human intervention.',
      benefits: ['Drag-and-drop visual builder', 'Conditional branching logic', 'Delay / wait actions', 'AI-powered reply nodes', 'Webhook integration nodes', 'Tag and segment contacts automatically'],
      aiCapabilitiesSummary: 'AI nodes can generate dynamic replies, classify intent, extract entities, and make routing decisions within workflows.',
    },
    features: [
      'Drag-and-Drop Visual Editor', 'Send Message Nodes', 'Conditional Branching (If/Else)',
      'User Input Collection', 'Delay / Wait Timers', 'Tag & Segment Contacts',
      'Webhook Action Nodes', 'AI Reply Generation Nodes', 'Transfer to Human Agent',
      'Google Sheets Write Nodes', 'Multi-Channel Support', 'Flow Templates Library',
      'Version History', 'Test & Preview Mode', 'Analytics per Flow',
      'Trigger: Keyword Match', 'Trigger: New Contact', 'Trigger: Webhook',
      'Trigger: Scheduled', 'Export / Import Flows',
    ],
    limitations: [
      { title: 'Max Nodes per Flow', detail: 'Up to 100 nodes per workflow' },
      { title: 'Max Active Flows', detail: 'Up to 50 concurrent active workflows' },
      { title: 'Delay Limit', detail: 'Maximum 30-day delay between nodes' },
      { title: 'Webhook Timeout', detail: '10-second timeout for external webhook calls' },
    ],
    requirements: [
      'Active UwoConnect Subscription', 'At Least One Connected Channel',
      'Understanding of Basic Flow Logic',
    ],
    connectors: ['WhatsApp', 'Instagram', 'Telegram', 'Facebook', 'Google Sheets', 'Webhook', 'CRM'],
    automations: [
      'Keyword → Trigger Flow', 'New Contact → Onboarding Flow',
      'Scheduled Time → Follow-Up Flow', 'Webhook → Custom Automation',
      'Lead Score Change → Route Flow',
    ],
    aiCapabilities: [
      'AI Reply Nodes (GPT / Gemini)', 'AI Intent Classification',
      'AI Entity Extraction', 'AI Smart Routing',
      'AI Conversation Summary', 'AI Sentiment Analysis',
    ],
    analytics: {
      items: [
        { label: 'Active Flows', value: '—' },
        { label: 'Total Executions', value: '—' },
        { label: 'Completion Rate', value: '—' },
        { label: 'Avg. Duration', value: '—' },
      ]
    },
    bestPractices: [
      'Start with simple flows and add complexity gradually',
      'Always include a fallback path for unrecognized inputs',
      'Use delays wisely — too short may annoy, too long may lose interest',
      'Test flows thoroughly in preview mode before activating',
      'Monitor completion rates and optimize drop-off points',
    ],
    commonErrors: [
      { error: 'Flow Not Triggering', fix: 'Verify trigger keyword or webhook URL is correct' },
      { error: 'Infinite Loop Detected', fix: 'Check for circular node connections and add exit conditions' },
      { error: 'Webhook Timeout', fix: 'Ensure external API responds within 10 seconds' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── TEAM ────────────────────────────────────
  {
    id: 'team',
    name: 'Team Members',
    icon: Users,
    category: 'Management',
    status: 'active',
    path: '/client/team',
    description: 'Invite workspace agents, assign roles (Admin / Agent), configure granular feature permissions, and manage team access controls.',
    overview: {
      what: 'Team management lets you invite colleagues, assign them agent or admin roles, control which features they can access, and monitor their work activity.',
      why: 'Growing businesses need multiple agents handling chats. Team management ensures proper access control, workload distribution, and accountability.',
      benefits: ['Role-based access control', 'Granular feature permissions', 'Agent performance tracking', 'Secure multi-user workspace', 'Real-time team chat', 'Work reports per agent'],
      aiCapabilitiesSummary: 'AI suggests optimal agent assignment based on expertise, workload, and availability.',
    },
    features: [
      'Invite Team Members via Email', 'Admin & Agent Roles', 'Granular Feature Permissions',
      'Agent Online/Offline Status', 'Chat Assignment & Routing', 'Agent Performance Metrics',
      'Internal Team Chat Room', 'Work Reports per Agent', 'Activity Audit Logs',
      'Remove / Deactivate Members', 'Custom Role Creation', 'Two-Factor Authentication',
    ],
    limitations: [
      { title: 'Max Team Members', detail: 'Depends on subscription plan (Free: 2, Pro: 10, Enterprise: Unlimited)' },
      { title: 'Custom Roles', detail: 'Available on Pro plan and above' },
      { title: 'Audit Logs', detail: 'Retained for 90 days on Pro, 365 days on Enterprise' },
    ],
    requirements: [
      'Active UwoConnect Subscription', 'Admin Role to Invite Members',
      'Valid Email Addresses for Invitations',
    ],
    connectors: ['Email', 'Slack', 'Discord', 'Webhook'],
    automations: [
      'New Agent Added → Send Welcome Email', 'Agent Goes Offline → Reassign Chats',
      'High Workload → Auto-Balance Queue', 'Performance Report → Weekly Email',
    ],
    aiCapabilities: [
      'AI Agent Assignment', 'AI Workload Balancing',
      'AI Performance Insights', 'AI Expertise Matching',
    ],
    analytics: {
      items: [
        { label: 'Total Members', value: '—' },
        { label: 'Online Now', value: '—' },
        { label: 'Avg Response Time', value: '—' },
        { label: 'Chats Handled Today', value: '—' },
      ]
    },
    bestPractices: [
      'Use least-privilege principle — give only necessary permissions',
      'Regularly review and remove inactive members',
      'Enable two-factor authentication for admins',
      'Review work reports weekly to identify training needs',
    ],
    commonErrors: [
      { error: 'Invitation Email Not Received', fix: 'Check spam folder or verify email address' },
      { error: 'Permission Denied', fix: 'Contact workspace admin to adjust your role permissions' },
      { error: 'Max Members Reached', fix: 'Upgrade subscription plan for more team seats' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── INBOX ───────────────────────────────────
  {
    id: 'inbox',
    name: 'Unified Inbox',
    icon: MessageSquare,
    category: 'Communication',
    status: 'active',
    path: '/client/inbox',
    description: 'A single omnichannel chat workspace for human agents to manage conversations across WhatsApp, Instagram, Facebook, Telegram, and more.',
    overview: {
      what: 'The Unified Inbox consolidates all incoming messages from every connected channel into one dashboard. Agents can reply, transfer, tag, and manage conversations without switching platforms.',
      why: 'Managing messages across 5+ platforms is chaotic. The inbox brings everything together, enabling faster responses and consistent customer experience.',
      benefits: ['All channels in one view', 'AI-assisted replies', 'Agent assignment & routing', 'Contact profiles & history', 'Quick replies & templates', 'Real-time notifications'],
      aiCapabilitiesSummary: 'AI auto-suggests reply drafts, classifies message urgency, and provides context from knowledge base documents.',
    },
    features: [
      'Omnichannel Message Feed', 'Real-Time Chat Updates', 'AI Suggested Replies',
      'Contact Profile Sidebar', 'Conversation History', 'Agent Assignment & Transfer',
      'Quick Reply Templates', 'Media Sharing (Images, Docs)', 'Message Search',
      'Conversation Tags & Labels', 'Read / Unread Status', 'Typing Indicators',
      'Emoji & Reaction Support', 'Internal Notes', 'Bulk Actions',
      'Conversation Export', 'Notification Sounds', 'Mobile Responsive',
    ],
    limitations: [
      { title: 'Message History', detail: 'Last 1,000 messages per conversation loaded by default' },
      { title: 'File Upload Size', detail: 'Max 16 MB per attachment' },
      { title: 'Simultaneous Chats', detail: 'Agents recommended to handle max 10 concurrent chats' },
    ],
    requirements: [
      'At Least One Connected Channel', 'Active Subscription',
      'Team Members Invited (for multi-agent)',
    ],
    connectors: ['WhatsApp', 'Instagram', 'Facebook', 'Telegram', 'Email', 'Web Chat'],
    automations: [
      'New Message → AI Auto-Reply', 'Unanswered 5min → Escalate to Agent',
      'Keyword Detected → Trigger Workflow', 'Conversation Closed → Send Survey',
    ],
    aiCapabilities: [
      'AI Reply Suggestions', 'AI Message Summarization',
      'AI Urgency Classification', 'AI Language Detection',
      'AI Knowledge Base Search', 'AI Sentiment Analysis',
    ],
    analytics: {
      items: [
        { label: 'Open Conversations', value: '—' },
        { label: 'Avg Response Time', value: '—' },
        { label: 'Messages Today', value: '—' },
        { label: 'Customer Satisfaction', value: '—' },
      ]
    },
    bestPractices: [
      'Respond within 5 minutes for best customer satisfaction',
      'Use quick reply templates for common questions',
      'Tag conversations for easy future reference',
      'Close resolved conversations to keep inbox clean',
    ],
    commonErrors: [
      { error: 'Messages Not Loading', fix: 'Refresh page or check internet connection' },
      { error: 'Cannot Send Reply', fix: 'Verify channel connector is active' },
      { error: 'Notification Not Working', fix: 'Allow browser notifications in settings' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── KNOWLEDGE BASE ─────────────────────────
  {
    id: 'knowledge',
    name: 'AI Knowledge Base',
    icon: Brain,
    category: 'AI & Training',
    status: 'active',
    path: '/client/knowledge',
    description: 'Upload PDF documents, company guidelines, FAQs, and web links to train your custom RAG-powered AI assistant for accurate, contextual responses.',
    overview: {
      what: 'The Knowledge Base is where your AI learns about your business. Upload documents and the system creates vector embeddings that power context-aware AI responses using Retrieval-Augmented Generation (RAG).',
      why: 'Generic AI gives generic answers. Training the AI on your specific business documents ensures customers receive accurate, relevant, and trustworthy information.',
      benefits: ['RAG-powered accuracy', 'PDF / text document support', 'Automatic chunking & embedding', 'Real-time knowledge updates', 'Multi-document search', 'Relevance scoring'],
      aiCapabilitiesSummary: 'AI uses vector similarity search to find relevant document chunks and generates contextual answers grounded in your business documents.',
    },
    features: [
      'PDF Document Upload', 'Text / FAQ Upload', 'Automatic Chunking',
      'Vector Embedding Generation', 'Similarity-Based Search', 'Multi-Document Indexing',
      'Document Management Dashboard', 'Knowledge Update Without Retraining',
      'Relevance Score Thresholds', 'Source Citation in Replies', 'Bulk Upload',
      'Delete & Re-Index', 'Usage Analytics',
    ],
    limitations: [
      { title: 'Max File Size', detail: '25 MB per document' },
      { title: 'Supported Formats', detail: 'PDF, TXT, DOCX (more coming soon)' },
      { title: 'Max Documents', detail: 'Up to 100 documents per workspace' },
      { title: 'Embedding Latency', detail: 'Large documents may take 1–3 minutes to process' },
    ],
    requirements: [
      'Active UwoConnect Subscription', 'Documents in Supported Formats',
      'AI Configuration Enabled',
    ],
    connectors: ['Google Drive', 'OneDrive', 'Webhook'],
    automations: [
      'Document Uploaded → Auto-Index', 'New Query → RAG Search',
      'Low Relevance → Fallback to General AI',
    ],
    aiCapabilities: [
      'RAG (Retrieval-Augmented Generation)', 'Vector Similarity Search',
      'Automatic Document Chunking', 'Context-Aware Answer Generation',
      'Source Attribution', 'Multi-Document Cross-Reference',
    ],
    analytics: {
      items: [
        { label: 'Documents Indexed', value: '—' },
        { label: 'Chunks Created', value: '—' },
        { label: 'Queries Answered', value: '—' },
        { label: 'Avg Relevance Score', value: '—' },
      ]
    },
    bestPractices: [
      'Upload clear, well-structured documents', 'Include FAQs for common customer questions',
      'Regularly update documents when business info changes',
      'Review AI responses periodically for accuracy',
    ],
    commonErrors: [
      { error: 'Document Processing Failed', fix: 'Ensure file is under 25 MB and in supported format' },
      { error: 'AI Giving Irrelevant Answers', fix: 'Upload more specific documents or adjust relevance threshold' },
      { error: 'Embedding Timeout', fix: 'Try uploading smaller documents or splitting large files' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── AUTO REPLIES ────────────────────────────
  {
    id: 'automations',
    name: 'Auto Replies',
    icon: Zap,
    category: 'Automation',
    status: 'active',
    path: '/client/automations',
    description: 'Set up instant keyword-based automatic replies for common questions like business hours, pricing, location, and more.',
    overview: {
      what: 'Auto Replies allow you to define keyword triggers that automatically respond to customer messages without any manual intervention or complex workflow setup.',
      why: 'Customers repeatedly ask the same questions. Auto Replies provide instant, consistent answers 24/7 for common queries, reducing agent workload.',
      benefits: ['Instant responses', 'Keyword-based triggers', 'Multiple trigger words per reply', 'Rich media support', '24/7 availability', 'Easy setup — no coding required'],
      aiCapabilitiesSummary: 'Combine keyword triggers with AI fallback — if no keyword matches, AI generates a contextual response from the Knowledge Base.',
    },
    features: [
      'Keyword Trigger Rules', 'Multiple Keywords per Rule', 'Text Replies',
      'Image / Media Replies', 'Button Replies', 'Exact Match & Contains Mode',
      'Case-Insensitive Matching', 'Priority Ordering', 'AI Fallback',
      'Channel-Specific Rules', 'Rule Enable / Disable Toggle', 'Analytics per Rule',
    ],
    limitations: [
      { title: 'Max Rules', detail: 'Up to 200 auto-reply rules per workspace' },
      { title: 'Keyword Length', detail: 'Each keyword must be 1–100 characters' },
      { title: 'Reply Length', detail: 'Max 4096 characters per auto-reply message' },
    ],
    requirements: [
      'Active Subscription', 'At Least One Connected Channel',
    ],
    connectors: ['WhatsApp', 'Instagram', 'Telegram', 'Facebook', 'Web Chat'],
    automations: [
      'Keyword Match → Send Reply', 'No Match → AI Fallback', 'New Rule → Log Event',
    ],
    aiCapabilities: [
      'AI Fallback for Unmatched Keywords', 'AI Keyword Suggestions',
      'AI Reply Quality Check',
    ],
    analytics: {
      items: [
        { label: 'Active Rules', value: '—' },
        { label: 'Triggers Today', value: '—' },
        { label: 'Match Rate', value: '—' },
        { label: 'Fallback Rate', value: '—' },
      ]
    },
    bestPractices: [
      'Use common misspellings as additional keywords',
      'Keep replies concise and actionable',
      'Enable AI fallback for comprehensive coverage',
      'Review trigger analytics to find new keyword opportunities',
    ],
    commonErrors: [
      { error: 'Rule Not Triggering', fix: 'Check keyword matching mode (exact vs contains)' },
      { error: 'Conflicting Rules', fix: 'Review rule priority order — higher priority rules execute first' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── ORDERS ──────────────────────────────────
  {
    id: 'orders',
    name: 'Orders & Receipts',
    icon: Receipt,
    category: 'E-Commerce',
    status: 'active',
    path: '/client/orders',
    description: 'Track customer orders, payment status, invoice receipts, and fulfillment progress in real-time.',
    overview: {
      what: 'Orders management tracks every purchase made through your catalog or checkout links — from payment initiation to delivery confirmation.',
      why: 'Organized order tracking ensures no sale is missed, customers receive timely updates, and your business maintains accurate revenue records.',
      benefits: ['Real-time order tracking', 'Payment status monitoring', 'Invoice generation', 'Customer order history', 'Fulfillment workflows', 'Revenue analytics'],
      aiCapabilitiesSummary: 'AI predicts order fulfillment times, detects suspicious transactions, and auto-generates customer update messages.',
    },
    features: [
      'Order Dashboard', 'Payment Status Tracking', 'Invoice Generation',
      'Order Status Updates', 'Customer Notifications', 'Fulfillment Tracking',
      'Refund Management', 'Order History & Search', 'Export Orders (CSV)',
      'Revenue Reports', 'Multi-Currency Support',
    ],
    limitations: [
      { title: 'Payment Gateways', detail: 'Currently supports Razorpay — more integrations coming' },
      { title: 'Order Retention', detail: 'Orders retained for 2 years' },
    ],
    requirements: ['Active Subscription', 'Catalog with Products', 'Payment Gateway Connected'],
    connectors: ['Razorpay', 'Google Sheets', 'Webhook', 'WhatsApp'],
    automations: [
      'New Order → WhatsApp Confirmation', 'Payment Received → Generate Invoice',
      'Order Shipped → Send Tracking Info', 'Order Cancelled → Process Refund',
    ],
    aiCapabilities: [
      'AI Fulfillment Time Prediction', 'AI Fraud Detection', 'AI Customer Update Messages',
    ],
    analytics: {
      items: [
        { label: 'Total Orders', value: '—' },
        { label: 'Revenue', value: '—' },
        { label: 'Pending Orders', value: '—' },
        { label: 'Completion Rate', value: '—' },
      ]
    },
    bestPractices: [
      'Process orders within 24 hours', 'Send status updates at each fulfillment stage',
      'Handle refunds promptly to maintain trust', 'Review revenue reports weekly',
    ],
    commonErrors: [
      { error: 'Payment Not Captured', fix: 'Verify Razorpay API keys and webhook configuration' },
      { error: 'Invoice Generation Failed', fix: 'Check business profile details are complete' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── WORK REPORTS ────────────────────────────
  {
    id: 'reports',
    name: 'Work Reports',
    icon: FileCheck,
    category: 'Analytics',
    status: 'active',
    path: '/client/reports',
    description: 'Generate detailed analytics reports on team performance, chat response times, workflow execution logs, and overall workspace productivity.',
    overview: {
      what: 'Work Reports provide granular insights into how your team and automations are performing — response times, resolution rates, agent activity, and workflow execution stats.',
      why: 'Data-driven decisions improve customer service quality and operational efficiency. Reports help identify bottlenecks and training opportunities.',
      benefits: ['Agent performance metrics', 'Response time analytics', 'Workflow execution logs', 'Exportable reports', 'Scheduled report delivery', 'Custom date ranges'],
      aiCapabilitiesSummary: 'AI analyzes patterns in reports and suggests actionable improvements for team performance and automation efficiency.',
    },
    features: [
      'Agent Performance Dashboard', 'Response Time Analytics', 'Conversation Volume Charts',
      'Workflow Execution Logs', 'Custom Date Range Filters', 'Export Reports (CSV / PDF)',
      'Scheduled Report Emails', 'Team Comparison Views', 'Channel-Wise Breakdown',
      'Customer Satisfaction Scores', 'Resolution Rate Tracking',
    ],
    limitations: [
      { title: 'Data Retention', detail: 'Report data available for last 12 months' },
      { title: 'Scheduled Reports', detail: 'Max 5 scheduled reports on Pro plan' },
    ],
    requirements: ['Active Subscription', 'Team Members with Activity Data'],
    connectors: ['Email', 'Google Sheets', 'Webhook'],
    automations: [
      'Weekly → Email Report to Admin', 'Performance Drop → Alert Notification',
      'Monthly → Generate Summary PDF',
    ],
    aiCapabilities: [
      'AI Performance Insights', 'AI Bottleneck Detection', 'AI Improvement Suggestions',
    ],
    analytics: {
      items: [
        { label: 'Reports Generated', value: '—' },
        { label: 'Avg Response Time', value: '—' },
        { label: 'Resolution Rate', value: '—' },
        { label: 'CSAT Score', value: '—' },
      ]
    },
    bestPractices: [
      'Review reports weekly', 'Set up automated report delivery',
      'Compare agent performance to identify best practices',
      'Use date range filters for campaign-specific analysis',
    ],
    commonErrors: [
      { error: 'Report Empty', fix: 'Ensure date range has activity data' },
      { error: 'Export Failed', fix: 'Try a smaller date range or contact support' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── YOUTUBE ─────────────────────────────────
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Video,
    category: 'Social Media',
    status: 'active',
    path: '/client/youtube',
    description: 'Manage YouTube channel, upload videos, auto-reply to comments using RAG AI or custom keyword rules, and trigger WhatsApp broadcasts on new video uploads.',
    overview: {
      what: 'The YouTube module connects your channel for automated comment management, video analytics, AI-powered comment replies, custom keyword auto-replies, and cross-platform WhatsApp broadcast alerts.',
      why: 'YouTube creators and brands receive hundreds of comments daily. Automated AI replies and keyword rules ensure every viewer gets a response — converting engagement into leads.',
      benefits: ['Auto-reply AI bot for comments', 'Custom keyword reply rules', 'Video upload & management', 'WhatsApp broadcast on new uploads', 'Channel analytics', 'Comment moderation'],
      aiCapabilitiesSummary: 'RAG AI generates context-aware comment replies using your Knowledge Base documents. Custom keyword rules take priority over AI for predefined questions.',
    },
    features: [
      'YouTube Channel Connection (OAuth)', 'Video Upload & Management', 'Video Analytics Dashboard',
      'Comment Thread Viewer', 'AI Auto-Reply Bot (RAG)', 'Custom Keyword Auto-Reply Rules',
      'Manual AI Suggestion Mode', 'Bot Personality Tone (Concise / Friendly / Professional)',
      'WhatsApp Broadcast on New Upload', 'Channel Description Editor', 'Video Delete',
      'Comment Search', 'Reply Status Tracking',
    ],
    limitations: [
      { title: 'YouTube API Quota', detail: '10,000 units/day (standard Google Cloud project)' },
      { title: 'Upload Limit', detail: '128 GB or 12 hours per video (YouTube limit)' },
      { title: 'Reply Latency', detail: 'Bot checks for new comments every 15 seconds' },
      { title: 'Requires Channel', detail: 'Google account must have an active YouTube channel' },
    ],
    requirements: [
      'Google Account with YouTube Channel', 'Google Cloud Project with YouTube Data API v3',
      'OAuth Consent Screen Configured', 'Active UwoConnect Subscription',
    ],
    connectors: ['YouTube', 'WhatsApp', 'Google Sheets'],
    automations: [
      'New Comment → AI Auto-Reply', 'Keyword Match → Custom Reply',
      'New Video Upload → WhatsApp Broadcast', 'Low Engagement → Alert',
    ],
    aiCapabilities: [
      'RAG-Powered Comment Replies', 'Keyword Priority Matching',
      'Personality Tone Selection', 'AI Suggestion Mode (Manual)',
      'Context from Knowledge Base',
    ],
    analytics: {
      items: [
        { label: 'Subscribers', value: '—' },
        { label: 'Total Views', value: '—' },
        { label: 'Videos', value: '—' },
        { label: 'Comments Replied', value: '—' },
      ]
    },
    bestPractices: [
      'Set up keyword rules for frequently asked questions (price, location)',
      'Train AI with relevant Knowledge Base documents for better replies',
      'Enable WhatsApp broadcast to cross-promote new video uploads',
      'Review AI replies periodically for quality',
    ],
    commonErrors: [
      { error: 'YouTube Signup Required', fix: 'Create a YouTube channel on your Google account' },
      { error: 'Upload 400 Error', fix: 'Check video file format and size' },
      { error: 'API Quota Exceeded', fix: 'Wait until quota resets (daily) or request increase from Google' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── CRM ─────────────────────────────────────
  {
    id: 'crm',
    name: 'Leads & CRM',
    icon: Database,
    category: 'Sales',
    status: 'active',
    path: '/client/crm',
    description: 'Manage all customer contacts, view complete conversation histories, apply tags and lead scores, and track the full customer journey.',
    overview: {
      what: 'The CRM is your central customer database — every contact who interacts with your automation or agents is captured with full conversation history, profile data, tags, and lead scoring.',
      why: 'Understanding your customers is the foundation of effective marketing and sales. CRM gives you 360° visibility into every customer interaction.',
      benefits: ['Complete contact profiles', 'Full conversation history', 'Custom tags & segments', 'Lead scoring', 'Export contacts', 'Integration with broadcasts'],
      aiCapabilitiesSummary: 'AI auto-tags contacts, predicts lead quality scores, and suggests the best time to follow up.',
    },
    features: [
      'Contact Profiles & Details', 'Full Conversation History', 'Custom Tags & Labels',
      'Lead Scoring', 'Contact Search & Filters', 'Audience Segments',
      'Notes & Internal Comments', 'Contact Import (CSV)', 'Contact Export',
      'Merge Duplicate Contacts', 'Activity Timeline', 'Custom Fields',
      'Bulk Actions', 'Contact Blocking',
    ],
    limitations: [
      { title: 'Max Contacts', detail: 'Up to 50,000 contacts (depends on plan)' },
      { title: 'Custom Fields', detail: 'Up to 20 custom fields per workspace' },
      { title: 'Import Limit', detail: 'Max 10,000 contacts per CSV import' },
    ],
    requirements: ['Active Subscription', 'Connected Channels for Auto-Capture'],
    connectors: ['WhatsApp', 'Instagram', 'Facebook', 'Google Sheets', 'CSV', 'Webhook'],
    automations: [
      'New Contact → Tag & Score', 'Score Threshold → Assign to Agent',
      'Inactive 30 Days → Re-Engagement Campaign', 'Tag Added → Trigger Workflow',
    ],
    aiCapabilities: [
      'AI Auto-Tagging', 'AI Lead Scoring', 'AI Follow-Up Time Suggestions',
      'AI Duplicate Detection', 'AI Contact Enrichment',
    ],
    analytics: {
      items: [
        { label: 'Total Contacts', value: '—' },
        { label: 'New This Month', value: '—' },
        { label: 'Active Leads', value: '—' },
        { label: 'Conversion Rate', value: '—' },
      ]
    },
    bestPractices: [
      'Regularly clean and merge duplicate contacts',
      'Use tags consistently for effective segmentation',
      'Review and update lead scores monthly',
      'Export contacts before major data changes as backup',
    ],
    commonErrors: [
      { error: 'Import Failed', fix: 'Verify CSV format matches the template headers' },
      { error: 'Duplicate Contacts', fix: 'Use the merge duplicates feature in CRM settings' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── GOOGLE NEWS ─────────────────────────────
  {
    id: 'google-news',
    name: 'Google News',
    icon: Newspaper,
    category: 'Content',
    status: 'active',
    path: '/client/google-news',
    description: 'Generate AI news articles, monitor industry trends, and send real-time news alerts to customers via WhatsApp.',
    overview: {
      what: 'The Google News Hub brings real-time industry news into your dashboard, lets you generate AI-powered articles, and enables one-click WhatsApp news alerts to your contact lists.',
      why: 'Staying informed about industry trends and sharing relevant content with customers builds authority, trust, and engagement.',
      benefits: ['Real-time news feed', 'AI article generation', 'WhatsApp news alerts', 'Industry monitoring', 'Content curation', 'SEO-optimized content'],
      aiCapabilitiesSummary: 'AI generates original articles from trending news, optimizes for SEO, and personalizes news alerts per audience segment.',
    },
    features: [
      'Live Industry News Feed', 'AI Article Generation', 'WhatsApp News Alerts',
      'Topic Monitoring', 'News Bookmarking', 'Article Publishing',
      'SEO Optimization', 'Content Calendar', 'Social Media Sharing',
    ],
    limitations: [
      { title: 'News Sources', detail: 'Currently pulls from Google News RSS — limited to public sources' },
      { title: 'AI Article Length', detail: 'Max 2,000 words per generated article' },
      { title: 'Alert Frequency', detail: 'Max 10 news alerts per day to avoid spam' },
    ],
    requirements: ['Active Subscription', 'WhatsApp Connected (for alerts)', 'Topics Configured'],
    connectors: ['Google News', 'WhatsApp', 'Email', 'Webhook'],
    automations: [
      'Trending Topic → Auto-Generate Article', 'Breaking News → WhatsApp Alert',
      'Daily Digest → Email Summary',
    ],
    aiCapabilities: [
      'AI Article Writer', 'AI SEO Optimization', 'AI News Summarization',
      'AI Topic Classification', 'AI Alert Personalization',
    ],
    analytics: {
      items: [
        { label: 'Articles Generated', value: '—' },
        { label: 'Alerts Sent', value: '—' },
        { label: 'Engagement Rate', value: '—' },
        { label: 'Topics Monitored', value: '—' },
      ]
    },
    bestPractices: [
      'Configure topics relevant to your industry', 'Review AI-generated articles before publishing',
      'Limit alerts to truly newsworthy items', 'Use analytics to refine topic selection',
    ],
    commonErrors: [
      { error: 'No News Results', fix: 'Broaden your topic keywords or check internet connectivity' },
      { error: 'Alert Not Sent', fix: 'Verify WhatsApp connector is active' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── SETTINGS ───────────────────────────────
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    category: 'Configuration',
    status: 'active',
    path: '/client/settings',
    description: 'Configure workspace profile, API credentials, webhook integrations, AI model defaults, white-labeling, and billing subscription management.',
    overview: {
      what: 'Settings is your workspace configuration center — manage business profile, API keys, webhook URLs, AI preferences, billing, white-label branding, and security options.',
      why: 'Proper configuration ensures all features work correctly and your workspace reflects your brand identity.',
      benefits: ['Business profile management', 'API key management', 'Webhook configuration', 'AI model selection', 'White-label branding', 'Billing & subscription management'],
      aiCapabilitiesSummary: 'Configure AI model preferences (GPT / Gemini), response behavior, and context instructions from settings.',
    },
    features: [
      'Business Profile Editor', 'API Key Management', 'Webhook URL Configuration',
      'AI Model Selection (GPT / Gemini)', 'AI Context Instructions', 'White-Label Branding',
      'Custom Domain', 'Billing & Subscription', 'Payment History',
      'Two-Factor Authentication', 'Product Tour Reset', 'Account Deletion',
      'Google Sheets Integration', 'Password Change',
    ],
    limitations: [
      { title: 'White-Label', detail: 'Available on Enterprise plan only' },
      { title: 'Custom Domain', detail: 'Requires DNS configuration and SSL certificate' },
    ],
    requirements: ['Admin Role Required for Most Settings'],
    connectors: ['All Connected Channels'],
    automations: ['Settings Change → Audit Log', 'Plan Upgrade → Feature Unlock'],
    aiCapabilities: [
      'AI Model Selection', 'AI Context Customization', 'AI Behavior Configuration',
    ],
    analytics: {
      items: [
        { label: 'Current Plan', value: '—' },
        { label: 'API Calls Today', value: '—' },
        { label: 'Storage Used', value: '—' },
        { label: 'Team Seats', value: '—' },
      ]
    },
    bestPractices: [
      'Keep API keys secure and rotate regularly', 'Enable two-factor authentication',
      'Review billing and usage monthly', 'Test webhooks after configuration changes',
    ],
    commonErrors: [
      { error: 'Webhook Not Receiving', fix: 'Verify URL is publicly accessible with SSL' },
      { error: 'API Key Invalid', fix: 'Regenerate key and update all integrations' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },

  // ───────────────────────────────── SUPPORT ─────────────────────────────────
  {
    id: 'support',
    name: 'Help & Support',
    icon: LifeBuoy,
    category: 'Support',
    status: 'active',
    path: '/client/support',
    description: 'Submit support tickets, access platform guides, watch video tutorials, and contact technical support for assistance.',
    overview: {
      what: 'The Support Center provides comprehensive help resources — submit tickets, browse documentation, watch tutorials, and get direct assistance from our team.',
      why: 'Quick access to help resources reduces downtime and ensures you get the most out of every platform feature.',
      benefits: ['Ticket submission', 'Knowledge articles', 'Video tutorials', 'Direct support chat', 'FAQ database', 'Community forum'],
      aiCapabilitiesSummary: 'AI-powered support chatbot provides instant answers before routing to human support agents.',
    },
    features: [
      'Support Ticket System', 'Priority Levels', 'Ticket Status Tracking',
      'Knowledge Articles', 'Video Tutorials', 'FAQ Database',
      'Direct Chat Support', 'Email Support', 'Community Forum',
      'Platform Changelog', 'Feature Requests',
    ],
    limitations: [
      { title: 'Response Time', detail: 'Standard: 24h, Priority: 4h, Critical: 1h' },
      { title: 'Live Chat Hours', detail: 'Available 9 AM – 6 PM IST' },
    ],
    requirements: ['Active Account'],
    connectors: ['Email', 'WhatsApp', 'Web Chat'],
    automations: [
      'Ticket Created → Email Confirmation', 'Ticket Resolved → Satisfaction Survey',
      'SLA Breach → Escalation Alert',
    ],
    aiCapabilities: ['AI Chatbot Support', 'AI Ticket Classification', 'AI Solution Suggestions'],
    analytics: {
      items: [
        { label: 'Open Tickets', value: '—' },
        { label: 'Avg Resolution', value: '—' },
        { label: 'Satisfaction', value: '—' },
        { label: 'Articles Read', value: '—' },
      ]
    },
    bestPractices: [
      'Include screenshots and error messages when submitting tickets',
      'Check FAQ before creating a new ticket', 'Use appropriate priority levels',
    ],
    commonErrors: [
      { error: 'Ticket Not Submitted', fix: 'Ensure all required fields are filled' },
    ],
    documentation: {
      docs: '#', api: '#', video: '#', help: '#', support: '/client/support',
    },
  },
];

export default featureData;

/**
 * Helper to find a feature by its ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getFeatureById(id) {
  return featureData.find(f => f.id === id) || null;
}

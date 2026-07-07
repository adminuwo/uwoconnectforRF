/**
 * AisaConnect Product Tour Configuration
 * ----------------------------------------
 * Each step is a plain object. To add a new step, append an entry here.
 * 
 * Fields:
 *  id          — unique string identifier
 *  page        — Next.js pathname this step belongs to (null = any page)
 *  selector    — CSS selector or [data-tour="id"] string to target the element
 *  title       — Feature name shown in tooltip header
 *  description — Short description of the feature
 *  why         — Why this feature exists / value it provides
 *  tip         — Optional best-practice tip (set null to hide)
 *  placement   — 'top' | 'bottom' | 'left' | 'right' | 'auto'
 *  icon        — emoji or small SVG string for the badge icon
 */

const tourSteps = [
  {
    id: 'welcome',
    page: '/client',
    selector: '[data-tour="dashboard-welcome"]',
    title: '👋 Welcome to AisaConnect!',
    description: 'You are now inside your automation command center. This quick tour will walk you through every feature — it only takes 2 minutes.',
    why: 'Understanding the platform helps you automate faster and get results sooner.',
    tip: 'Use arrow keys or the buttons below to navigate. Press ESC anytime to exit.',
    placement: 'bottom',
    icon: '🚀',
  },
  {
    id: 'sidebar-nav',
    page: null,
    selector: '[data-tour="sidebar-nav"]',
    title: '🗂️ Main Navigation',
    description: 'The sidebar is your primary way to move between all sections of the platform — Dashboard, Channels, Workflows, CRM, and more.',
    why: 'Each section handles a different part of your automation stack. Use the sidebar to jump between them instantly.',
    tip: 'The active page is highlighted with a green accent bar on the left.',
    placement: 'right',
    icon: '🗂️',
  },
  {
    id: 'dashboard-stats',
    page: '/client',
    selector: '[data-tour="dashboard-stats"]',
    title: '📊 Live Stats Overview',
    description: 'Monitor your total conversations, automation runs, active users, and average response time — all in real time.',
    why: 'These KPIs give you an instant snapshot of your automation health without digging into reports.',
    tip: 'Green percentages indicate growth vs. the previous period.',
    placement: 'bottom',
    icon: '📊',
  },
  {
    id: 'dashboard-launch-btn',
    page: '/client',
    selector: '[data-tour="dashboard-launch-btn"]',
    title: '⚡ Launch New Flow',
    description: 'Click this button to immediately create a brand-new automation workflow. It takes you directly to the Workflow Builder.',
    why: 'Quick access to the builder means less time navigating and more time creating.',
    tip: 'You can also access Workflows from the sidebar for a full list of your existing flows.',
    placement: 'bottom',
    icon: '⚡',
  },
  {
    id: 'sidebar-channels',
    page: null,
    selector: '[data-tour="sidebar-channels"]',
    title: '🔗 Channels — Connect Meta Accounts',
    description: 'Use this section to securely connect your Meta accounts: Instagram, Facebook, and WhatsApp. Each connection requires your API credentials from Meta Business Suite.',
    why: 'Without a connected channel, no automation can send or receive messages. This is your first step after signup.',
    tip: 'Connect WhatsApp Business API first — it has the highest automation reach and the richest feature set.',
    placement: 'right',
    icon: '🔗',
  },
  {
    id: 'sidebar-automations',
    page: null,
    selector: '[data-tour="sidebar-automations"]',
    title: '⚡ Auto Replies',
    description: 'Create keyword-based automatic replies. When a contact sends a specific word or phrase, the system instantly responds with your pre-set message.',
    why: 'Auto replies handle common queries (price, hours, FAQs) 24/7 without any human intervention.',
    tip: 'Use wildcards like "order*" to match "order status", "order number", etc.',
    placement: 'right',
    icon: '⚡',
  },
  {
    id: 'sidebar-workflows',
    page: null,
    selector: '[data-tour="sidebar-workflows"]',
    title: '🔀 Workflows — Visual Automation Builder',
    description: 'Create multi-step automation workflows using a drag-and-drop canvas. Build conditional branches, AI responses, delays, and message sequences for Instagram, Facebook, and WhatsApp.',
    why: 'Workflows handle complex business logic that simple auto-replies cannot — like lead qualification, appointment booking, and order tracking.',
    tip: 'You can build one shared workflow that covers all platforms, or separate workflows per platform for fine-grained control.',
    placement: 'right',
    icon: '🔀',
  },
  {
    id: 'sidebar-crm',
    page: null,
    selector: '[data-tour="sidebar-crm"]',
    title: '👥 Leads (CRM)',
    description: 'View and manage all contacts who have interacted with your automation. See their conversation history, tags, and engagement stage.',
    why: 'Your CRM is the single source of truth for every lead captured through automation. Use it to follow up, segment, and convert.',
    tip: 'Use tags to segment leads (e.g., "hot-lead", "trial-user") and target them with broadcasts.',
    placement: 'right',
    icon: '👥',
  },
  {
    id: 'sidebar-inbox',
    page: null,
    selector: '[data-tour="sidebar-inbox"]',
    title: '💬 Messages (Inbox)',
    description: 'A unified inbox showing all incoming and outgoing conversations across WhatsApp, Instagram, and Facebook in one place.',
    why: 'Managing multi-platform conversations from a single inbox saves time and prevents missed messages.',
    tip: 'You can take over any automated conversation manually at any time from the inbox.',
    placement: 'right',
    icon: '💬',
  },
  {
    id: 'sidebar-campaigns',
    page: null,
    selector: '[data-tour="sidebar-campaigns"]',
    title: '📢 Broadcasts',
    description: 'Send bulk message campaigns to your contact list. Schedule them for a future time or send immediately to segmented groups.',
    why: 'Broadcasts are ideal for promotions, product launches, announcements, and re-engagement campaigns.',
    tip: 'Always use approved WhatsApp Message Templates for broadcast campaigns to avoid account restrictions.',
    placement: 'right',
    icon: '📢',
  },
  {
    id: 'sidebar-knowledge',
    page: null,
    selector: '[data-tour="sidebar-knowledge"]',
    title: '🧠 Knowledge Base',
    description: 'Upload documents, FAQs, and product information that your AI assistant uses to answer customer queries intelligently.',
    why: 'The Knowledge Base powers your AI with accurate, business-specific answers — making it far more useful than a generic chatbot.',
    tip: 'Keep your knowledge base updated. Adding new products, policies, or FAQs immediately improves AI response quality.',
    placement: 'right',
    icon: '🧠',
  },
  {
    id: 'sidebar-settings',
    page: null,
    selector: '[data-tour="sidebar-settings"]',
    title: '⚙️ Settings',
    description: 'Manage your account profile, WhatsApp API credentials, organization details, security options, and billing information.',
    why: 'Settings is where you configure the foundation of your platform — correct credentials here ensure everything works correctly.',
    tip: null,
    placement: 'right',
    icon: '⚙️',
  },
  {
    id: 'platform-assistant',
    page: null,
    selector: '[data-tour="platform-assistant"]',
    title: '✨ AI Platform Assistant',
    description: 'This is your always-available AI helper. Ask it anything about the platform — how to build a workflow, why a message failed, or how to set up an integration.',
    why: 'Instead of browsing documentation, just ask. The assistant is trained on the platform and gives instant, contextual answers.',
    tip: 'Try asking: "How do I create a WhatsApp automation for order confirmations?"',
    placement: 'top',
    icon: '✨',
  },
  {
    id: 'sidebar-logout',
    page: null,
    selector: '[data-tour="sidebar-logout"]',
    title: '🔐 Secure Logout',
    description: 'Clicking Logout clears your session and returns you to the login page. All active automations continue running in the background.',
    why: 'Your automations run on our servers, not your browser — so logging out never interrupts your workflows.',
    tip: null,
    placement: 'right',
    icon: '🔐',
  },
];

export default tourSteps;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Check, Minus, Info, Sparkles, ShieldCheck, Zap, Layers, HelpCircle, ChevronRight, Lock, Flame, Star, AlertCircle, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { useEntitlement } from '@/context/EntitlementContext';

// ── AUTHENTIC BRAND VECTOR LOGOS ──
const WhatsAppLogo = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.2 22.2C20.4 22 20.6 21.7 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

const FacebookLogo = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
  </svg>
);

const InstagramLogo = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <defs>
      <linearGradient id="igGradPricingTable" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igGradPricingTable)"/>
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="31.5" cy="16.5" r="1.75" fill="white"/>
  </svg>
);

// Fallback Master Plans with Channel Details
const SEEDED_FALLBACK_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for small teams starting automation on 1 chosen channel',
    monthly_price: 499,
    yearly_price: 999,
    yearly_discount_percent: 83.0,
    currency: '₹',
    tax_info: '(+taxes)',
    max_channels: 1,
    allowed_channels: ['whatsapp', 'facebook', 'instagram'],
    badge_text: '',
    is_recommended: false,
    cta_text: 'Start Free Trial',
    channel_details: {
      whatsapp: {
        name: 'WhatsApp',
        what_you_get: [
          'WhatsApp Business API Automation',
          'Shared Team Inbox for WhatsApp',
          'Automated Keyword Replies',
          'Contact & Lead Sync'
        ],
        features: [
          'WhatsApp Auto Replies',
          'Shared Inbox',
          'Keyword Triggers',
          'Contact Management'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Messages', description: 'Based on your WhatsApp Number' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 15, label: 'Custom Fields' },
          custom_tags: { value: 15, label: 'Custom Tags' },
          events: { value: '—', label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Marketing', price: '₹0.970' },
          { type: 'Authentication', price: '₹0.129' },
          { type: 'Utility', price: '₹0.160' },
          { type: 'Service', price: 'FREE' }
        ],
        additional_benefits: ['No Markup Charges', 'Standard Support']
      },
      facebook: {
        name: 'Facebook',
        what_you_get: [
          'Facebook Messenger Automation',
          'Facebook Page Inbox Sync',
          'Automated Page Quick-Replies',
          'Lead Form Acquisition'
        ],
        features: [
          'Facebook Auto Replies',
          'Shared Page Inbox',
          'Ad Lead Capture',
          'Contact Management'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Conversations', description: 'Facebook Page Messaging' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 15, label: 'Custom Fields' },
          custom_tags: { value: 15, label: 'Custom Tags' },
          events: { value: '—', label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Standard Messaging', price: 'FREE' },
          { type: 'Lead Form Triggers', price: 'FREE' }
        ],
        additional_benefits: ['Meta Graph API Sync', 'Standard Support']
      },
      instagram: {
        name: 'Instagram',
        what_you_get: [
          'Instagram Direct DM Automation',
          'Story Mention Auto-Replies',
          'Comment Automation & Quick-Flows',
          'Shared Inbox for Insta DMs'
        ],
        features: [
          'Insta Quick-Flows & Price Query Bots',
          'Comment & Story Mention Triggers',
          'Shared Inbox for DMs & Comments',
          'Giveaway & Promo Automation'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'DMs & Comments', description: 'Instagram Professional Account' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 15, label: 'Custom Fields' },
          custom_tags: { value: 15, label: 'Custom Tags' },
          events: { value: '—', label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Unlimited DMs & Comments', price: 'FREE' },
          { type: 'Price Automation', price: 'FREE' },
          { type: 'Giveaway Automation', price: 'FREE' }
        ],
        additional_benefits: ['IG Conversations FREE', 'Standard Support']
      }
    }
  },
  {
    id: 'growth',
    name: 'Growth',
    slug: 'growth',
    description: 'Empower growing brands with 2 simultaneous channels & catalog sales',
    monthly_price: 1599,
    yearly_price: 2799,
    yearly_discount_percent: 85.0,
    currency: '₹',
    tax_info: '(+taxes)',
    max_channels: 2,
    allowed_channels: ['whatsapp', 'facebook', 'instagram'],
    badge_text: 'Most Popular',
    is_recommended: true,
    cta_text: 'Start Free Trial',
    channel_details: {
      whatsapp: {
        name: 'WhatsApp',
        what_you_get: [
          'WhatsApp Business Automation & Broadcasts',
          'FAQ Automations & Decision-Tree Chatbots',
          'Catalog Sync & Product Collections',
          'Native Payments via UPI'
        ],
        features: [
          'FAQ Automations & Linear Bots',
          'Broadcast Campaigns & Catalogs',
          'Native UPI Payment Collection',
          'Public REST APIs & Webhooks'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Messages', description: 'Based on your WhatsApp Number' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 25, label: 'Custom Fields' },
          custom_tags: { value: 30, label: 'Custom Tags' },
          events: { value: 5, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Marketing', price: '₹0.958' },
          { type: 'Authentication', price: '₹0.128' },
          { type: 'Utility', price: '₹0.150' },
          { type: 'Service', price: 'FREE' }
        ],
        additional_benefits: ['No Markup Charges', 'Higher Rate Limits', 'Priority Support']
      },
      facebook: {
        name: 'Facebook',
        what_you_get: [
          'Facebook Multi-Page Messenger Sync',
          'Advanced Page Broadcasts',
          'Automated Lead Nurturing',
          'Custom Webhook Integrations'
        ],
        features: [
          'Multi-Page Messenger Bots',
          'Lead Form Auto-Followups',
          'Broadcast Campaigns',
          'Public APIs & CRM Sync'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Conversations', description: 'Facebook Page Messaging' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 25, label: 'Custom Fields' },
          custom_tags: { value: 30, label: 'Custom Tags' },
          events: { value: 5, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Standard Messaging', price: 'FREE' },
          { type: 'Lead Form Triggers', price: 'FREE' }
        ],
        additional_benefits: ['No Markup Charges', 'Higher Rate Limits', 'Priority Support']
      },
      instagram: {
        name: 'Instagram',
        what_you_get: [
          'Instagram Advanced DM Flow Automation',
          'Product Catalog Display in DMs',
          'Story & Reels Mention Triggers',
          'Native Payment Links in DMs'
        ],
        features: [
          'Instagram Decision Tree Bots',
          'Comment & Mention Auto-Replies',
          'Product Catalogs in DMs',
          'Public APIs'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'DMs & Comments', description: 'Instagram Professional Account' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 25, label: 'Custom Fields' },
          custom_tags: { value: 30, label: 'Custom Tags' },
          events: { value: 5, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Unlimited DMs & Comments', price: 'FREE' },
          { type: 'Price Automation', price: 'FREE' },
          { type: 'Giveaway Automation', price: 'FREE' }
        ],
        additional_benefits: ['IG Conversations FREE', 'Higher Rate Limits', 'Priority Support']
      }
    }
  },
  {
    id: 'advanced',
    name: 'Advanced',
    slug: 'advanced',
    description: 'Full power automation across all 3 channels with webhooks & AI agents',
    monthly_price: 2499,
    yearly_price: 25489,
    yearly_discount_percent: 15.0,
    currency: '₹',
    tax_info: '(+taxes)',
    max_channels: 3,
    allowed_channels: ['whatsapp', 'facebook', 'instagram'],
    badge_text: 'Power House',
    is_recommended: false,
    cta_text: 'Start Free Trial',
    channel_details: {
      whatsapp: {
        name: 'WhatsApp',
        what_you_get: [
          'Enterprise Branching Chatbots & Dynamic Logic',
          'Autonomous AI Copilot & Sales Agents',
          'Chat Auto-Assignment & Round-Robin Routing',
          'Real-Time Webhooks & Dedicated Manager'
        ],
        features: [
          'Branching Chatbot & Conditions',
          'Chat Auto-Assignment & Webhooks',
          'Autonomous AI Agents & Copilot',
          'Multi-Team & Org Management'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Messages', description: 'Based on your WhatsApp Number' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 30, label: 'Custom Fields' },
          custom_tags: { value: 45, label: 'Custom Tags' },
          events: { value: 7, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Marketing', price: '₹0.949' },
          { type: 'Authentication', price: '₹0.127' },
          { type: 'Utility', price: '₹0.140' },
          { type: 'Service', price: 'FREE' }
        ],
        additional_benefits: [
          'No Markup Charges',
          'Dedicated Account Manager',
          'Higher Rate Limits',
          'Better Campaign Speeds',
          'Personalized Support'
        ]
      },
      facebook: {
        name: 'Facebook',
        what_you_get: [
          'AI-Powered Facebook Messenger Copilot',
          'Branching Conversational Flow Builder',
          'Round-Robin Agent Routing',
          'Real-Time Webhook Event Streaming'
        ],
        features: [
          'Branching Messenger Flows',
          'AI Copilot & Lead Scoring',
          'Chat Auto-Assignment',
          'Real-Time Webhooks'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'Conversations', description: 'Facebook Page Messaging' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 30, label: 'Custom Fields' },
          custom_tags: { value: 45, label: 'Custom Tags' },
          events: { value: 7, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Standard Messaging', price: 'FREE' },
          { type: 'Lead Form Triggers', price: 'FREE' }
        ],
        additional_benefits: [
          'No Markup Charges',
          'Dedicated Account Manager',
          'Higher Rate Limits',
          'Personalized Support'
        ]
      },
      instagram: {
        name: 'Instagram',
        what_you_get: [
          'Autonomous AI Copilot for Insta DMs',
          'Branching DM Sales Funnels',
          'Live API Call Triggers in DMs',
          'Real-Time Webhook Event Sync'
        ],
        features: [
          'Branching Insta DM Chatbots',
          'AI Copilot & Auto-Assignment',
          'Real-Time Webhooks & APIs',
          'Org & Multi-Agent Routing'
        ],
        limits: {
          messages: { value: 'unlimited', label: 'DMs & Comments', description: 'Instagram Professional Account' },
          contacts: { value: 'unlimited', label: 'Contacts' },
          custom_fields: { value: 30, label: 'Custom Fields' },
          custom_tags: { value: 45, label: 'Custom Tags' },
          events: { value: 7, label: 'Custom Events' }
        },
        message_costs: [
          { type: 'Unlimited DMs & Comments', price: 'FREE' },
          { type: 'Price Automation', price: 'FREE' },
          { type: 'Giveaway Automation', price: 'FREE' }
        ],
        additional_benefits: [
          'IG Conversations FREE',
          'Dedicated Account Manager',
          'Higher Rate Limits',
          'Personalized Support'
        ]
      }
    }
  }
];

export default function PricingComparisonTable({ plansData, onSelectPlan, isAdminView = false, onManagePlan }) {
  const router = useRouter();
  const { subscribePlan, entitlements, openUpgradeModal } = useEntitlement();
  const [billingPeriod, setBillingPeriod] = useState('YEARLY'); // MONTHLY | YEARLY
  const [plans, setPlans] = useState(SEEDED_FALLBACK_PLANS);

  // Per-plan selected channels array:
  // selectedChannels = { starter: ['whatsapp'], growth: ['whatsapp'], advanced: ['whatsapp', 'facebook', 'instagram'] }
  const [selectedChannels, setSelectedChannels] = useState({
    starter: ['whatsapp'],
    growth: ['whatsapp'],
    advanced: ['whatsapp', 'facebook', 'instagram']
  });

  // Active view tab per plan column:
  // activeViewChannel = { starter: 'whatsapp', growth: 'whatsapp', advanced: 'whatsapp' }
  const [activeViewChannel, setActiveViewChannel] = useState({
    starter: 'whatsapp',
    growth: 'whatsapp',
    advanced: 'whatsapp'
  });

  const [capacityNotice, setCapacityNotice] = useState(null);

  useEffect(() => {
    async function loadPublicPlans() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/plans/public/`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map(p => {
            const meta = p.metadata || {};
            const monthlyPrice = meta.monthly_price || parseFloat(p.price) || 999;
            const yearlyPrice = meta.yearly_price || Math.round(monthlyPrice * 12 * 0.8 * 100) / 100 || 9590.40;
            const maxChannels = meta.max_channels || (p.name.toLowerCase().includes('starter') ? 1 : (p.name.toLowerCase().includes('growth') ? 2 : 3));

            const slug = p.slug || p.name.toLowerCase();
            const fallbackObj = SEEDED_FALLBACK_PLANS.find(f => f.slug === slug) || SEEDED_FALLBACK_PLANS[0];

            return {
              ...p,
              id: p.id || slug,
              name: p.name,
              slug: slug,
              description: p.description || meta.description || fallbackObj.description,
              monthly_price: monthlyPrice,
              yearly_price: yearlyPrice,
              yearly_discount_percent: meta.yearly_discount_percent || 20.0,
              currency: p.currency || '₹',
              tax_info: meta.tax_info || '(+taxes)',
              max_channels: maxChannels,
              allowed_channels: meta.allowed_channels || ['whatsapp', 'facebook', 'instagram'],
              badge_text: p.badge_text || meta.badge_text || (p.name.toLowerCase().includes('growth') ? 'Most Popular' : ''),
              is_recommended: p.is_default || meta.is_recommended || p.name.toLowerCase().includes('growth'),
              cta_text: meta.cta_text || 'Start Free Trial',
              channel_details: meta.channel_details || fallbackObj.channel_details
            };
          });
          // Filter down to exactly 3 distinct canonical plans: Starter, Growth/Pro, Enterprise
          const unique3 = [];
          const seenCategories = new Set();
          normalized.forEach(p => {
            const lowName = (p.name || '').toLowerCase();
            let catKey = 'starter';
            if (lowName.includes('growth') || lowName.includes('pro')) catKey = 'growth';
            else if (lowName.includes('enterprise') || lowName.includes('advanced') || lowName.includes('full')) catKey = 'enterprise';
            
            if (!seenCategories.has(catKey) && unique3.length < 3) {
              seenCategories.add(catKey);
              unique3.push(p);
            }
          });

          setPlans(unique3.length === 3 ? unique3 : normalized.slice(0, 3));
        }
      } catch (err) {
        console.warn("Using fallback pricing plans:", err);
      }
    }
    loadPublicPlans();
  }, []);

  // Handle clicking a channel pill for a specific plan column
  const handleToggleChannelPill = (plan, channelKey) => {
    const planSlug = plan.slug;
    const maxAllowed = plan.max_channels;
    const currentSelected = selectedChannels[planSlug] || ['whatsapp'];
    const isAlreadySelected = currentSelected.includes(channelKey);

    if (maxAllowed === 1) {
      // Starter plan: Single channel selection (1/1)
      setSelectedChannels(prev => ({ ...prev, [planSlug]: [channelKey] }));
      setActiveViewChannel(prev => ({ ...prev, [planSlug]: channelKey }));
    } else if (maxAllowed === 2) {
      // Growth plan: Multi-select up to 2 active channels (0/2, 1/2, 2/2)
      if (isAlreadySelected) {
        // Toggling an already selected channel deselects it if more than 1 channel is selected
        if (currentSelected.length > 1) {
          const updated = currentSelected.filter(c => c !== channelKey);
          setSelectedChannels(prev => ({ ...prev, [planSlug]: updated }));
          if (activeViewChannel[planSlug] === channelKey && updated.length > 0) {
            setActiveViewChannel(prev => ({ ...prev, [planSlug]: updated[0] }));
          }
        } else {
          // If only 1 channel is selected, keep view on it
          setActiveViewChannel(prev => ({ ...prev, [planSlug]: channelKey }));
        }
      } else {
        if (currentSelected.length < 2) {
          // Add channel (e.g. 1/2 -> 2/2)
          const updated = [...currentSelected, channelKey];
          setSelectedChannels(prev => ({ ...prev, [planSlug]: updated }));
          setActiveViewChannel(prev => ({ ...prev, [planSlug]: channelKey }));
        } else {
          // If 2 channels are already selected (2/2), swap out the first channel cleanly with the new channel!
          const updated = [currentSelected[1], channelKey];
          setSelectedChannels(prev => ({ ...prev, [planSlug]: updated }));
          setActiveViewChannel(prev => ({ ...prev, [planSlug]: channelKey }));
        }
      }
    } else {
      // Advanced plan: All 3 channels included (3/3)
      if (!isAlreadySelected) {
        setSelectedChannels(prev => ({ ...prev, [planSlug]: [...currentSelected, channelKey] }));
      }
      setActiveViewChannel(prev => ({ ...prev, [planSlug]: channelKey }));
    }
  };

  const handleSubscribeClick = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
      return;
    }

    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : null;
    if (token) {
      router.push('/client/plans');
    } else {
      router.push('/auth/login');
    }
  };

  const renderChannelLogo = (chKey) => {
    if (chKey === 'whatsapp') return <WhatsAppLogo size={15} />;
    if (chKey === 'facebook') return <FacebookLogo size={15} />;
    if (chKey === 'instagram') return <InstagramLogo size={15} />;
    return null;
  };

  const renderChannelName = (chKey) => {
    if (chKey === 'whatsapp') return 'WhatsApp';
    if (chKey === 'facebook') return 'Facebook';
    if (chKey === 'instagram') return 'Instagram';
    return chKey;
  };

  return (
    <div className="w-full space-y-10 pb-16 text-slate-900 bg-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* CAPACITY WARNING TOAST */}
      {capacityNotice && (
        <div className="fixed bottom-6 right-6 z-[350] max-w-md bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-700 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <AlertCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold leading-snug">{capacityNotice}</p>
            <div className="mt-2.5 flex items-center gap-3">
              <button
                onClick={() => { setCapacityNotice(null); openUpgradeModal('advanced'); }}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-lg transition-all"
              >
                Upgrade to Advanced
              </button>
              <button
                onClick={() => setCapacityNotice(null)}
                className="text-[11px] font-bold text-slate-300 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UWO CONNECT HERO HEADER (PURE WHITE + GREEN) */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold tracking-wide">
          <Sparkles size={14} className="text-emerald-600" />
          <span>OFFICIAL WORKSPACE SUBSCRIPTION PLANS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find the right plan for your business needs
        </h2>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
          Scale customer support, marketing broadcasts, and AI sales agents across WhatsApp, Facebook, and Instagram.
        </p>

        {/* MONTHLY | YEARLY BILLING TOGGLE (UWO GREEN HIGHLIGHT) */}
        <div className="inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner mt-2">
          <button
            onClick={() => setBillingPeriod('MONTHLY')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer",
              billingPeriod === 'MONTHLY'
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Monthly Billing
          </button>

          <button
            onClick={() => setBillingPeriod('YEARLY')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer",
              billingPeriod === 'YEARLY'
                ? "bg-[#059669] text-white shadow-md shadow-emerald-700/20"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <span>Yearly Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-950 uppercase tracking-wider flex items-center gap-1">
              <Flame size={10} className="fill-emerald-950" /> SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* PRICING COMPARISON TABLE CONTAINER */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[880px] border-collapse text-left">

          {/* TABLE HEADER: PLAN CARDS & CHANNEL SELECTORS */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="p-6 w-1/4 align-top border-r border-slate-200">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                    COMPARISON MATRIX
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Compare All Plans
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Select a channel pill inside any plan column below to inspect channel-specific features, quotas & message rates.
                  </p>
                </div>
              </th>

              {plans.map((plan) => {
                const planSlug = plan.slug;
                const isCurrent = entitlements?.plan?.slug === planSlug;
                const isGrowth = plan.name.toLowerCase().includes('growth');
                
                const displayPrice = billingPeriod === 'YEARLY'
                  ? plan.yearly_price
                  : plan.monthly_price;
                const periodLabel = billingPeriod === 'YEARLY' ? '/yr' : '/mo';

                const curSelected = selectedChannels[planSlug] || ['whatsapp'];
                const curViewTab = activeViewChannel[planSlug] || 'whatsapp';

                return (
                  <th
                    key={plan.id}
                    className={cn(
                      "p-6 w-1/4 align-top relative border-r last:border-r-0 border-slate-200 transition-colors",
                      isGrowth && "bg-emerald-50/40"
                    )}
                  >
                    {/* Badge Header */}
                    {plan.badge_text && (
                      <div className="absolute top-3 right-4 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {plan.badge_text}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Plan Title & Price */}
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                          {plan.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 min-h-[32px] font-medium leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {plan.currency || '₹'}{displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">{periodLabel}</span>
                          <span className="text-[10px] text-slate-400 font-medium ml-0.5">{plan.tax_info}</span>
                        </div>

                        {billingPeriod === 'YEARLY' && (
                          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                            Billed Yearly (≈ ₹{Math.round(plan.yearly_price / 12).toLocaleString('en-IN')}/mo)
                          </div>
                        )}
                      </div>

                      {/* Subscribe CTA Button */}
                      {isAdminView && (
                        <button
                          type="button"
                          onClick={() => onManagePlan && onManagePlan(plan)}
                          className="w-full mb-2.5 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <SlidersHorizontal size={14} />
                          <span>Manage & Edit Plan</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleSubscribeClick(plan)}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                          isGrowth
                            ? "bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-700/20"
                            : (planSlug === 'advanced'
                              ? "bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/20"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20")
                        )}
                      >
                        <span>{isCurrent ? "Current Active Plan" : plan.cta_text}</span>
                        <ChevronRight size={15} />
                      </button>

                      {/* ════════════════════════════════════════════════════════════ */}
                      {/* PER-PLAN CHANNEL SELECTOR AREA (DRILL-DOWN CONTROLLER) */}
                      {/* ════════════════════════════════════════════════════════════ */}
                      <div className="pt-3 border-t border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-700">
                            {plan.max_channels === 1 && "Choose any 1 channel"}
                            {plan.max_channels === 2 && "Choose any 2 channels"}
                            {plan.max_channels >= 3 && "All 3 channels included"}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {curSelected.length}/{plan.max_channels}
                          </span>
                        </div>

                        {/* Channel Buttons Grid */}
                        <div className="grid grid-cols-1 gap-2">
                          {['whatsapp', 'facebook', 'instagram'].map((chKey) => {
                            const isSelected = curSelected.includes(chKey);
                            const isViewTabActive = curViewTab === chKey;

                            return (
                              <div
                                key={chKey}
                                onClick={() => handleToggleChannelPill(plan, chKey)}
                                className={cn(
                                  "w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer bg-white border",
                                  isSelected
                                    ? "border-2 border-[#059669] text-slate-900 shadow-2xs"
                                    : (isViewTabActive
                                      ? "border border-emerald-400 bg-emerald-50/30 text-slate-900"
                                      : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40")
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  {renderChannelLogo(chKey)}
                                  <span className="text-slate-900">{renderChannelName(chKey)}</span>
                                </div>

                                {isSelected ? (
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center font-black text-xs shrink-0">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-400 font-medium hover:text-emerald-700">Select</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>

            {/* SECTION HEADER: SELECTED CHANNEL DRILL-DOWN */}
            <tr className="bg-slate-100 border-y border-slate-200">
              <td colSpan={4} className="py-2.5 px-6 font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <Layers size={14} className="text-emerald-700" />
                <span>Selected Channel Details & Entitlements</span>
              </td>
            </tr>

            {/* ACTIVE CHANNEL DISPLAY HEADER ROW */}
            <tr className="border-b border-slate-200 bg-emerald-50/30">
              <td className="p-4 font-bold text-xs text-slate-700">
                ACTIVE DRILL-DOWN VIEW
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const isSelectedInPlan = (selectedChannels[planSlug] || ['whatsapp']).includes(viewCh);

                return (
                  <td key={plan.id} className="p-4 align-middle border-r last:border-r-0 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {renderChannelLogo(viewCh)}
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                          {renderChannelName(viewCh)}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                        isSelectedInPlan ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      )}>
                        {isSelectedInPlan ? "Active Channel" : "Previewing"}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 1. WHAT YOU GET SECTION */}
            <tr className="border-b border-slate-200">
              <td className="p-5 align-top font-bold text-xs text-slate-900 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">1. WHAT YOU GET</p>
                  <p className="text-[11px] text-slate-500 font-normal">Core channel capabilities & features</p>
                </div>
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const chDetails = plan.channel_details?.[viewCh] || {};
                const whatYouGet = chDetails.what_you_get || [];

                return (
                  <td key={plan.id} className="p-5 align-top border-r last:border-r-0 border-slate-200">
                    <ul className="space-y-2 text-xs text-slate-700">
                      {whatYouGet.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={15} className="text-emerald-600 shrink-0 font-extrabold mt-0.5" />
                          <span className="font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* 2. FEATURES SECTION */}
            <tr className="border-b border-slate-200">
              <td className="p-5 align-top font-bold text-xs text-slate-900 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">2. FEATURES</p>
                  <p className="text-[11px] text-slate-500 font-normal">Automation, inbox & triggers</p>
                </div>
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const chDetails = plan.channel_details?.[viewCh] || {};
                const featuresList = chDetails.features || [];

                return (
                  <td key={plan.id} className="p-5 align-top border-r last:border-r-0 border-slate-200">
                    <ul className="space-y-2 text-xs text-slate-700">
                      {featuresList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={15} className="text-emerald-600 shrink-0 font-extrabold mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* 3. LIMITS SECTION */}
            <tr className="border-b border-slate-200">
              <td className="p-5 align-top font-bold text-xs text-slate-900 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">3. LIMITS & QUOTAS</p>
                  <p className="text-[11px] text-slate-500 font-normal">Messages, contacts & fields</p>
                </div>
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const chDetails = plan.channel_details?.[viewCh] || {};
                const limitsObj = chDetails.limits || {};

                return (
                  <td key={plan.id} className="p-5 align-top border-r last:border-r-0 border-slate-200">
                    <div className="space-y-2.5 text-xs">
                      {Object.entries(limitsObj).map(([k, lim]) => {
                        const val = lim.value || 'unlimited';
                        const isUnl = String(val).toLowerCase() === 'unlimited';
                        return (
                          <div key={k} className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Check size={14} className="text-emerald-600 shrink-0" />
                              <span>{isUnl ? `Unlimited ${lim.label || k}` : `${val} ${lim.label || k}`}</span>
                            </div>
                            {lim.description && (
                              <p className="text-[10px] text-slate-400 font-medium ml-5">{lim.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 4. MESSAGE COST SECTION */}
            <tr className="border-b border-slate-200">
              <td className="p-5 align-top font-bold text-xs text-slate-900 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">4. MESSAGE COST</p>
                  <p className="text-[11px] text-slate-500 font-normal">Rates per template / message type</p>
                </div>
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const chDetails = plan.channel_details?.[viewCh] || {};
                const costs = chDetails.message_costs || [];

                return (
                  <td key={plan.id} className="p-5 align-top border-r last:border-r-0 border-slate-200">
                    <div className="space-y-1.5 text-xs">
                      {costs.map((c, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-b-0">
                          <span className="text-slate-600 font-medium">{c.type}:</span>
                          <span className={cn(
                            "font-black",
                            c.price === 'FREE' ? "text-emerald-700" : "text-slate-900"
                          )}>
                            {c.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 5. ADDITIONAL BENEFITS */}
            <tr className="border-b border-slate-200">
              <td className="p-5 align-top font-bold text-xs text-slate-900 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">5. ADDITIONAL BENEFITS</p>
                  <p className="text-[11px] text-slate-500 font-normal">Markup & support guarantees</p>
                </div>
              </td>
              {plans.map((plan) => {
                const planSlug = plan.slug;
                const viewCh = activeViewChannel[planSlug] || 'whatsapp';
                const chDetails = plan.channel_details?.[viewCh] || {};
                const benefits = chDetails.additional_benefits || [];

                return (
                  <td key={plan.id} className="p-5 align-top border-r last:border-r-0 border-slate-200">
                    <ul className="space-y-2 text-xs text-slate-700">
                      {benefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-semibold">
                          <Check size={14} className="text-emerald-600 shrink-0 font-extrabold" />
                          <span>{typeof b === 'string' ? b : b.title}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}

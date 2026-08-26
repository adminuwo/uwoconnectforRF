'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Sparkles,
  Users,
  Database,
  Workflow,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Layers,
  Cpu
} from 'lucide-react';

export default function KinsoFeatureShowcase({ isDark }) {
  const features = [
    {
      id: 'inbox',
      badge: '01. Centralized Hub',
      title: 'Unified Inbox',
      description:
        'Manage every customer conversation from every platform inside one inbox. Stop switching between WhatsApp, Instagram, Email, and social apps.',
      points: [
        'Single pane of glass for all customer messages',
        'Automatic platform detection and unified history',
        'Smart cross-channel search and quick filters',
      ],
      icon: Inbox,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      mockContent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#00AB56]">WhatsApp + Gmail + Instagram</span>
              <span className="text-gray-400">Live Thread</span>
            </div>
            <p className="text-xs text-gray-300">
              "Customer initiated chat on IG, sent invoice on WhatsApp, and approved via Email—all in one timeline."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-assistant',
      badge: '02. Contextual AI',
      title: 'AI Reply Assistant',
      description:
        'Generate smart replies based on customer history and business knowledge. Empower agents to respond 10x faster with human-in-the-loop oversight.',
      points: [
        'Instant answers trained on company docs & FAQs',
        'Multi-lingual real-time translation',
        'Tone adjustment & sentiment-aware responses',
      ],
      icon: Sparkles,
      gradient: 'from-[#00AB56]/20 to-emerald-500/20',
      mockContent: (
        <div className="p-4 rounded-2xl bg-[#00AB56]/10 border border-[#00AB56]/30 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00AB56]" />
            <span className="text-xs font-bold text-[#00AB56]">AI Draft (99% Accuracy)</span>
          </div>
          <p className="text-xs italic text-gray-700 dark:text-gray-300">
            "We have verified your account tier and activated your priority API keys."
          </p>
        </div>
      ),
    },
    {
      id: 'team-workspace',
      badge: '03. Collaboration',
      title: 'Team Workspace',
      description:
        'Assign conversations, mention teammates, write internal notes, set department routing rules, and enforce precise role permissions.',
      points: [
        'Private internal notes & @teammate mentions',
        'Automatic round-robin & skill-based routing',
        'Granular role-based permissions (RBAC)',
      ],
      icon: Users,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      mockContent: (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-500">Department Routing: Support ➔ Engineering</span>
            <span className="text-gray-400">Marcus @ Lead</span>
          </div>
          <p className="text-xs text-gray-300">
            "Internal Note: Assigned to Tier-3 engineer for custom REST API endpoint setup."
          </p>
        </div>
      ),
    },
    {
      id: 'crm',
      badge: '04. Single Customer View',
      title: 'CRM Integration',
      description:
        'Every conversation automatically becomes a customer profile. Gain a complete interaction timeline, lead management, and historical context.',
      points: [
        'Automatic contact creation & deal tagging',
        'Complete interaction timeline across all channels',
        'Bi-directional sync with HubSpot, Salesforce & Zoho',
      ],
      icon: Database,
      gradient: 'from-purple-500/20 to-pink-500/20',
      mockContent: (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Customer Profile: Acme Systems</span>
            <span>LTV: $120,000</span>
          </div>
          <p className="text-xs text-gray-300">
            14 WhatsApp chats, 8 Emails, 2 Telegram support calls automatically synchronized.
          </p>
        </div>
      ),
    },
    {
      id: 'automation',
      badge: '05. Autonomous Workflows',
      title: 'Workflow Automation',
      description:
        'Automate replies, lead routing, tagging, instant notifications, escalations, and scheduled follow-ups without code.',
      points: [
        'Visual drag-and-drop workflow builder',
        'Custom webhook & API event triggers',
        'Automatic SLA breach escalation alerts',
      ],
      icon: Workflow,
      gradient: 'from-amber-500/20 to-orange-500/20',
      mockContent: (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
            <Zap className="w-4 h-4" /> Trigger: High Priority Lead Message
          </div>
          <p className="text-xs text-gray-300">
            ➔ Auto-tag 'VIP' ➔ Assign Sales Manager ➔ Notify Slack Channel
          </p>
        </div>
      ),
    },
    {
      id: 'analytics',
      badge: '06. Real-Time Insights',
      title: 'Analytics Dashboard',
      description:
        'Monitor response time, agent productivity, customer satisfaction (CSAT), platform performance, and conversation trends in real-time.',
      points: [
        'Live CSAT and NPS tracking',
        'Agent response time & resolution metrics',
        'Channel volume and peak demand forecasting',
      ],
      icon: BarChart3,
      gradient: 'from-sky-500/20 to-blue-500/20',
      mockContent: (
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-[10px] text-gray-400">Avg Response Time</span>
              <span className="block font-bold text-sky-400 text-sm">42 Seconds</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-[10px] text-gray-400">Resolution Rate</span>
              <span className="block font-bold text-[#00AB56] text-sm">99.2%</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const connectors = [
    { name: 'WhatsApp', category: 'Messaging', icon: '💬' },
    { name: 'Facebook', category: 'Social', icon: '🌐' },
    { name: 'Instagram', category: 'Social', icon: '📸' },
    { name: 'Messenger', category: 'Messaging', icon: '⚡' },
    { name: 'Telegram', category: 'Messaging', icon: '✈️' },
    { name: 'LinkedIn', category: 'Social', icon: '💼' },
    { name: 'X (Twitter)', category: 'Social', icon: '𝕏' },
    { name: 'YouTube', category: 'Video', icon: '▶️' },
    { name: 'TikTok', category: 'Video', icon: '🎵' },
    { name: 'Gmail', category: 'Email', icon: '✉️' },
    { name: 'Google Sheets', category: 'Data', icon: '📊' },
    { name: 'Google Docs', category: 'Docs', icon: '📝' },
    { name: 'Google Drive', category: 'Storage', icon: '📁' },
    { name: 'OneDrive', category: 'Storage', icon: '☁️' },
    { name: 'Microsoft Teams', category: 'Team', icon: '👥' },
    { name: 'Slack', category: 'Team', icon: '💬' },
    { name: 'HubSpot', category: 'CRM', icon: '🟧' },
    { name: 'Zoho CRM', category: 'CRM', icon: '🟥' },
    { name: 'Salesforce', category: 'CRM', icon: '☁️' },
    { name: 'Webhook', category: 'API', icon: '🔗' },
    { name: 'REST API', category: 'API', icon: '💻' },
    { name: 'Azure', category: 'Cloud', icon: '🔷' },
    { name: 'Google Workspace', category: 'Suite', icon: '🟨' },
    { name: 'Microsoft 365', category: 'Suite', icon: '🟦' },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 sm:space-y-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
            Core Platform Capabilities
          </span>
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Everything you need to scale customer conversations.
          </h2>
          <p className={`text-sm sm:text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Designed for high-growth enterprises and support teams requiring speed, intelligence, and reliability.
          </p>
        </div>

        {/* Alternating Feature Showcase List */}
        <div className="space-y-16 sm:space-y-24">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isEven = idx % 2 === 0;
            return (
              <div
                key={feat.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center"
              >
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}
                >
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56]">
                    {feat.badge}
                  </span>
                  <h3 className={`text-xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feat.title}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feat.description}
                  </p>

                  <ul className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                    {feat.points.map((pt) => (
                      <li key={pt} className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#00AB56] shrink-0 mt-0.5 sm:mt-0" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Feature Graphic Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}
                >
                  <div
                    className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      isDark ? 'bg-[#0E131F] border-white/10' : 'bg-white border-gray-200 shadow-sm sm:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 sm:mb-6`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AB56]" />
                    </div>

                    {feat.mockContent}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Section 5 — Connectors Grid */}
        <div id="connectors" className="pt-12 sm:pt-16 space-y-8 sm:space-y-12 border-t border-gray-200 dark:border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
              Seamless Ecosystem
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connect Every Platform & Tool You Rely On.
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Pre-built 1-click connectors for messaging, CRMs, cloud storage, and APIs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {connectors.map((conn) => (
              <motion.div
                key={conn.name}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 sm:space-y-2 ${
                  isDark
                    ? 'bg-white/[0.02] border-white/5 hover:border-[#00AB56]/40 hover:bg-white/[0.05]'
                    : 'bg-white border-gray-200 hover:border-[#00AB56]/40 shadow-2xs hover:shadow-md'
                }`}
              >
                <span className="text-xl sm:text-2xl">{conn.icon}</span>
                <span className={`text-xs font-bold truncate max-w-full ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {conn.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{conn.category}</span>
              </motion.div>
            ))}

            {/* Coming Soon Card */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center space-y-1 ${
                isDark ? 'border-white/15 bg-white/[0.01]' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <span className="text-lg sm:text-xl">✨</span>
              <span className="text-xs font-bold text-[#00AB56]">More Coming Soon</span>
              <span className="text-[10px] text-gray-400">Custom Webhooks Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  Filter,
  Search,
  Zap,
  Globe,
  Layers
} from 'lucide-react';

export default function KinsoProductShowcase({ isDark }) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [mobilePane, setMobilePane] = useState('chat'); // 'chat' | 'list'
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, author: 'Alex (Lead Agent)', text: 'Customer requested enterprise custom SLA contract review.', time: '10m ago' },
    { id: 2, author: 'System AI', text: 'Auto-scraped HubSpot CRM: Lifetime Value $48,000.', time: '15m ago' }
  ]);

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes([
      ...notes,
      { id: Date.now(), author: 'You (Manager)', text: noteInput, time: 'Just now' }
    ]);
    setNoteInput('');
  };

  const conversations = [
    {
      id: 1,
      name: 'Elena Rostova',
      time: '10:42 AM',
      channel: 'WhatsApp Business • Priority VIP',
      preview: 'Can we set up automated lead routing to Salesforce?',
      active: true,
      badgeColor: 'text-[#00AB56]',
      avatarBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      id: 2,
      name: 'Marcus Thorne',
      time: '10:15 AM',
      channel: 'LinkedIn Sales Navigator',
      preview: 'Received custom quote. Looking forward to demo.',
      active: false,
      badgeColor: 'text-blue-500',
      avatarBg: 'bg-blue-500/10 text-blue-600'
    },
    {
      id: 3,
      name: 'Acme Dev Team',
      time: '09:30 AM',
      channel: 'Telegram Channel',
      preview: 'Webhook trigger test completed successfully.',
      active: false,
      badgeColor: 'text-amber-500',
      avatarBg: 'bg-emerald-500/10 text-[#00AB56]'
    }
  ];

  return (
    <section id="product" className="py-12 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20 inline-block">
            Production-Grade Dashboard
          </span>
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built for enterprise speed, AI automation, & complete control.
          </h2>
          <p className={`text-xs sm:text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore the real UWO Connect workspace interface designed to handle millions of customer interactions with zero lag.
          </p>
        </div>

        {/* Large Rounded Dashboard Preview Card */}
        <div
          className={`rounded-2xl sm:rounded-3xl border shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 relative overflow-hidden text-left transition-all duration-300 ${
            isDark ? 'bg-[#0A0E17] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-6 mb-3 sm:mb-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#00AB56] flex items-center justify-center text-white font-bold shrink-0">
                <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base md:text-lg font-bold truncate">UWO Connect — Command Center</h3>
                <span className="text-[10px] sm:text-xs text-gray-400 block truncate">Live Production Workspace • 24 Connected Channels</span>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-nowrap -mx-1 px-1 sm:mx-0 sm:px-0">
              {[
                { id: 'inbox', label: 'Unified Inbox' },
                { id: 'ai', label: 'AI Assistant' },
                { id: 'crm', label: 'CRM Sync' },
                { id: 'notes', label: 'Team Notes' },
                { id: 'status', label: 'Channels' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#00AB56] text-white shadow-md shadow-[#00AB56]/20'
                      : isDark
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile View Switcher (Visible only on screens < lg) */}
          <div className="flex lg:hidden items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-3 text-xs font-semibold">
            <button
              onClick={() => setMobilePane('chat')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                mobilePane === 'chat'
                  ? 'bg-white dark:bg-white/10 text-[#00AB56] font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Active Chat (Elena)</span>
            </button>
            <button
              onClick={() => setMobilePane('list')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                mobilePane === 'list'
                  ? 'bg-white dark:bg-white/10 text-[#00AB56] font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Channels List (24)</span>
            </button>
          </div>

          {/* Main App Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-h-[420px]">
            {/* Left Column: Conversation Sidebar (4 Cols on desktop, toggleable on mobile) */}
            <div
              className={`lg:col-span-4 rounded-xl sm:rounded-2xl border p-3 sm:p-4 flex-col justify-between ${
                mobilePane === 'list' ? 'flex' : 'hidden lg:flex'
              } ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/70 border-gray-200'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                    Conversations (24 Active)
                  </span>
                  <Filter className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                </div>

                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages, CRM tags..."
                    readOnly
                    className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setMobilePane('chat')}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                        conv.active
                          ? 'bg-[#00AB56]/10 border-[#00AB56]/30'
                          : isDark
                          ? 'border-transparent hover:bg-white/5'
                          : 'border-transparent hover:bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate">{conv.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{conv.time}</span>
                      </div>
                      <span className={`text-[10px] font-semibold block truncate ${conv.badgeColor}`}>
                        {conv.channel}
                      </span>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {conv.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Platforms Bar */}
              <div className="pt-3 border-t border-gray-200 dark:border-white/10 mt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Connected Platforms Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00AB56] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold truncate">24 Integrations Live</span>
                  <span className="text-[10px] text-gray-400 ml-auto shrink-0">99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Main Detail Pane (8 Cols on desktop, full width on mobile chat mode) */}
            <div
              className={`lg:col-span-8 rounded-xl sm:rounded-2xl border p-3 sm:p-5 lg:p-6 flex-col justify-between overflow-hidden ${
                mobilePane === 'chat' ? 'flex' : 'hidden lg:flex'
              } ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/70 border-gray-200'}`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      ER
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00AB56] border-2 border-white dark:border-[#0E131F] rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm truncate">Elena Rostova</h4>
                      <span className="text-[9px] font-bold text-[#00AB56] bg-[#00AB56]/10 px-1.5 py-0.5 rounded uppercase">VIP</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 block truncate">
                      VP of Operations @ Acme • WhatsApp Business
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00AB56]/10 text-[#00AB56] border border-[#00AB56]/20 whitespace-nowrap flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00AB56] animate-pulse" />
                    Automation: Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    Tech Lead Assigned
                  </span>
                </div>
              </div>

              {/* Dynamic Center Panel Based on Active Tab */}
              <div className="py-3 sm:py-5 space-y-3 sm:space-y-4">
                {activeTab === 'inbox' && (
                  <div className="space-y-3">
                    <div className="flex flex-col items-start gap-1">
                      <div className="max-w-[92%] sm:max-w-md p-3.5 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-white/10 text-xs text-gray-800 dark:text-gray-200 leading-relaxed break-words shadow-2xs">
                        Hi team! We want to integrate our WhatsApp, Gmail, and HubSpot pipelines into UWO Connect. Can we schedule an onboarding walkthrough?
                      </div>
                      <span className="text-[10px] text-gray-400 pl-1">10:42 AM • WhatsApp</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="max-w-[92%] sm:max-w-md p-3.5 rounded-2xl rounded-tr-sm bg-[#00AB56] text-white text-xs space-y-1.5 leading-relaxed break-words shadow-sm">
                        <div className="flex items-center gap-1.5 text-[10px] text-white/90 font-bold">
                          <Sparkles className="w-3 h-3 shrink-0" /> AI Reply Generated & Approved
                        </div>
                        <p>
                          Hi Elena! Absolutely. I have routed your ticket to our Lead Onboarding Engineer and attached our 1-click connector guide.
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 pr-1">10:42 AM • Instant AI (0.8s)</span>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#00AB56]/10 border border-[#00AB56]/20 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#00AB56] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-[#00AB56]">AI Reply Suggestions</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-500">Context: Knowledge Base + CRM</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      Based on Elena's history as VP of Operations, AI recommends offering the Enterprise Onboarding SLA Package.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button className="px-3.5 py-1.5 rounded-xl bg-[#00AB56] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer">
                        <Send className="w-3 h-3" /> Auto-Insert Response
                      </button>
                      <button className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-semibold cursor-pointer">
                        Regenerate
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'crm' && (
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                      CRM Timeline & Customer Details
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">Total Conversations</span>
                        <span className="text-xs sm:text-sm md:text-base font-bold text-[#00AB56]">142 Messages</span>
                      </div>
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">HubSpot Sync</span>
                        <span className="text-xs sm:text-sm md:text-base font-bold text-blue-500">Deal: $48k LTV</span>
                      </div>
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">Sentiment Score</span>
                        <span className="text-xs sm:text-sm md:text-base font-bold text-emerald-500">Positive (98%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                      Internal Team Notes & @Mentions
                    </h5>
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div key={note.id} className={`p-2.5 rounded-xl border text-xs ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span className="text-[#00AB56] text-[11px]">{note.author}</span>
                            <span className="text-[10px] text-gray-400">{note.time}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add note or mention @teammate..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addNote()}
                        className={`w-full flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={addNote}
                        className="px-3.5 py-2 rounded-xl bg-[#00AB56] text-white text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'status' && (
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                      Automation Status & Active Connectors
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-[#00AB56] shrink-0" />
                          <span className="font-bold text-xs">AI Auto-Reply Rule</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">Triggers when customer mentions 'Enterprise', 'API', or 'Billing'.</p>
                      </div>
                      <div className={`p-2.5 sm:p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-bold text-xs">Omnichannel Webhook API</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">Live webhook endpoint listening to 24 connected platforms.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Input Action Bar */}
              <div className="pt-2.5 sm:pt-4 border-t border-gray-200 dark:border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or press '/' for AI..."
                  readOnly
                  className={`w-full flex-1 px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
                      : 'bg-gray-50/70 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
                <button className="px-4 py-2.5 rounded-xl bg-[#00AB56] hover:bg-[#008947] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer transition-all">
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

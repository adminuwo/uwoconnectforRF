'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Bot,
  Tag,
  Share2,
  Shield,
  Activity,
  FileText,
  User,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Zap,
  Globe
} from 'lucide-react';

export default function KinsoProductShowcase({ isDark }) {
  const [activeTab, setActiveTab] = useState('inbox');
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

  return (
    <section id="product" className="py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20">
            Production-Grade Dashboard
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built for enterprise speed, AI automation, & complete control.
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore the real UWO Connect workspace interface designed to handle millions of customer interactions with zero lag.
          </p>
        </div>

        {/* Large Rounded Dashboard Preview Wrapper */}
        <div
          className={`rounded-3xl border shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-all duration-300 ${
            isDark ? 'bg-[#0A0E17] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white font-bold">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">UWO Connect — Command Center</h3>
                <span className="text-xs text-gray-400">Live Production Workspace • 24 Connected Channels</span>
              </div>
            </div>

            {/* Interactive View Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'inbox', label: 'Unified Inbox' },
                { id: 'ai', label: 'AI Reply Assistant' },
                { id: 'crm', label: 'CRM Timeline' },
                { id: 'notes', label: 'Team Notes & Comments' },
                { id: 'status', label: 'Automation & Channels' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/20'
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

          {/* Main App Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Left Column: Conversation Sidebar (4 Cols) */}
            <div
              className={`lg:col-span-4 rounded-2xl border p-4 flex flex-col justify-between ${
                isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/70 border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Conversations (24 Active)
                  </span>
                  <Filter className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>

                <div className="relative mb-4">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages, CRM tags..."
                    readOnly
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Elena Rostova</span>
                      <span className="text-[10px] text-gray-400">10:42 AM</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      WhatsApp Business • Priority VIP
                    </span>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      Can we set up automated lead routing to Salesforce?
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Marcus Thorne</span>
                      <span className="text-[10px] text-gray-400">10:15 AM</span>
                    </div>
                    <span className="text-[10px] text-gray-400">LinkedIn Sales Navigator</span>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      Received custom quote. Looking forward to demo.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Acme Dev Team</span>
                      <span className="text-[10px] text-gray-400">09:30 AM</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Telegram Channel</span>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      Webhook trigger test completed successfully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Platforms Bar */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Connected Platforms Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <span className="text-xs font-semibold">24 Integrations Live</span>
                  <span className="text-[10px] text-gray-400 ml-auto">99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Main Detail Pane (8 Cols) */}
            <div
              className={`lg:col-span-8 rounded-2xl border p-6 flex flex-col justify-between ${
                isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/70 border-gray-200'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm">
                    ER
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Elena Rostova</h4>
                    <span className="text-xs text-gray-400">VP of Operations @ Acme Systems • elena@acme.io</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                    Automation Status: Active
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Assigned: Tech Lead
                  </span>
                </div>
              </div>

              {/* Dynamic Center Panel Based on Active Tab */}
              <div className="py-6 space-y-4">
                {activeTab === 'inbox' && (
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-md p-3.5 rounded-2xl bg-gray-200 dark:bg-white/10 text-xs text-gray-800 dark:text-gray-200">
                        Hi team! We want to integrate our WhatsApp, Gmail, and HubSpot pipelines into UWO Connect. Can we schedule a onboarding walkthrough?
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-md p-3.5 rounded-2xl bg-[#16A34A] text-white text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-bold">
                          <Sparkles className="w-3 h-3" /> AI Reply Generated & Approved
                        </div>
                        <p>
                          Hi Elena! Absolutely. I have routed your ticket to our Lead Onboarding Engineer and attached our 1-click connector guide.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="p-4 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-[#16A34A]" />
                        <span className="text-sm font-bold text-[#16A34A]">AI Reply Suggestions</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">Context: Knowledge Base + CRM</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Based on Elena's history as VP of Operations, AI recommends offering the Enterprise Onboarding SLA Package.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-semibold flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Auto-Insert Response
                      </button>
                      <button className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-semibold">
                        Regenerate Variant
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'crm' && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      CRM Timeline & Customer Details
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">Total Conversations</span>
                        <span className="text-base font-bold text-[#16A34A]">142 Messages</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">HubSpot Sync</span>
                        <span className="text-base font-bold text-blue-500">Deal: $48k LTV</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className="text-[10px] text-gray-400 block">Sentiment Score</span>
                        <span className="text-base font-bold text-emerald-500">Positive (98%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Internal Team Notes & @Mentions
                    </h5>
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div key={note.id} className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-[#16A34A]">{note.author}</span>
                            <span className="text-[10px] text-gray-400">{note.time}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{note.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add an internal note or mention @teammate..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addNote()}
                        className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={addNote}
                        className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-semibold"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'status' && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Automation Status & Active Connectors
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-[#16A34A]" />
                          <span className="font-bold text-xs">AI Auto-Reply Rule</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Triggers when customer mentions 'Enterprise', 'API', or 'Billing'.</p>
                      </div>
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-xs">Omnichannel Webhook API</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Live webhook endpoint listening to 24 connected platforms.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Input Action Bar */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a reply or command (press '/' for AI suggestions)..."
                  readOnly
                  className={`flex-1 px-4 py-2.5 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                <button className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-semibold flex items-center gap-2 shadow-md">
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

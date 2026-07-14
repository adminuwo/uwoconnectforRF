'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, MessageSquare, GitBranch, Users, Settings, 
  Bot, Sparkles, Smartphone, CheckCircle, ArrowUpRight, Activity,
  Database, Send, MapPin, User, FileText, Plus, HelpCircle, Copy, Check
} from 'lucide-react';

export default function DashboardPreview() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Live Inbox", icon: MessageSquare, badge: "3" },
    { name: "Flow Builder", icon: GitBranch },
    { name: "CRM Contacts", icon: Users },
    { name: "AI Assistant", icon: Bot },
    { name: "Settings", icon: Settings },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#0B0D11] border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#16A085]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0F6B52]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-20 relative z-10 px-6">
        <span className="text-[10px] font-black text-[#20C997] uppercase tracking-[0.3em] block mb-3">Unified Interface</span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white bg-clip-text bg-gradient-to-b from-white to-slate-400">
          A Workspace Built for Speed
        </h2>
        <p className="text-[#8E99A8] text-lg font-medium">
          Say goodbye to tab-switching. Click the sidebar tabs below to preview each workspace module.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-[600px] md:h-[720px] flex justify-center perspective-1000">
        {/* Glow directly behind the dashboard */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#16A085]/10 rounded-full blur-[180px] pointer-events-none" />
        
        {/* Main Dashboard Card */}
        <div
          className="w-full max-w-6xl h-full glass-card rounded-t-[32px] md:rounded-[32px] p-4 md:p-6 relative z-10 overflow-hidden"
        >
          {/* App Window Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] text-[#8E99A8] font-bold tracking-wider">
              workspace.uwoconnect.local
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>

          <div className="flex gap-6 h-[calc(100%-60px)]">
            {/* Sidebar Mockup */}
            <div className="hidden md:flex w-60 flex-col gap-1 border-r border-white/5 pr-4 py-2 select-none">
              {sidebarItems.map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <div 
                    key={item.name} 
                    onClick={() => setActiveTab(item.name)}
                    className={`h-11 rounded-xl flex items-center px-4 gap-3 transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#0F6B52]/20 to-[#16A085]/10 border border-[#0F6B52]/50 text-white font-bold' 
                        : 'text-[#8E99A8] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <IconComponent size={16} className={isActive ? 'text-[#20C997]' : ''} strokeWidth={2} />
                    <span className="text-xs uppercase tracking-wider">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#20C997] text-[#0B0D11] text-[9px] font-black px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
              
              {/* User Identity at bottom */}
              <div className="mt-auto bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#16A085] flex items-center justify-center font-bold text-white text-xs">
                  D
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Devansh Sharma</h4>
                  <p className="text-[8px] font-bold text-[#8E99A8] uppercase tracking-widest">Client Account</p>
                </div>
              </div>
            </div>

            {/* Content Switcher Container */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
                <div
                  key={activeTab}
                  className="flex-1 h-full overflow-y-auto pr-1 flex flex-col gap-6"
                >
                  {/* VIEW 1: OVERVIEW */}
                  {activeTab === "Overview" && (
                    <>
                      {/* Grid of Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-28 bg-[#171B22]/90 border border-white/5 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#16A085]/30 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[9px] font-black text-[#8E99A8] uppercase tracking-widest mb-1">WhatsApp Cloud API</p>
                              <h4 className="text-base font-extrabold text-white">WABA Active</h4>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <Smartphone size={14} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                              <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-wider">Connected • +91 98765 XXXXX</span>
                          </div>
                        </div>

                        <div className="h-28 bg-[#171B22]/90 border border-white/5 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#16A085]/30 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[9px] font-black text-[#8E99A8] uppercase tracking-widest mb-1">RAG Knowledge Engine</p>
                              <h4 className="text-base font-extrabold text-white">AI Trained</h4>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-[#20C997]/10 border border-[#20C997]/20 flex items-center justify-center text-[#20C997]">
                              <Bot size={14} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#8E99A8]">
                            <span>4 SOURCE FILES UPLOADED</span>
                            <span className="text-[#20C997] font-black bg-[#20C997]/10 px-2 py-0.5 rounded-md">98% ACCURACY</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent conversations table */}
                      <div className="flex-1 bg-[#171B22]/60 border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[300px]">
                        <div>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <Activity size={12} className="text-[#20C997]" />
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Webhook Inbox Logs</h4>
                            </div>
                            <span className="text-[9px] font-black bg-[#20C997]/10 text-[#20C997] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Operational</span>
                          </div>

                          <div className="space-y-3">
                            {[
                              { name: "Devansh Sharma", msg: "When will my order ship?", time: "2m ago", stage: "New Lead", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                              { name: "Sarah Jenkins", msg: "Interested in the enterprise plan", time: "15m ago", stage: "Negotiation", color: "bg-emerald-500/10 text-blue-400 border-blue-500/20" },
                              { name: "Marcus Chen", msg: "Support: WhatsApp API integration help", time: "1h ago", stage: "Follow Up", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                            ].map(chat => (
                              <div 
                                key={chat.name} 
                                onClick={() => setActiveTab("Live Inbox")}
                                className="h-14 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl w-full flex items-center px-4 gap-4 cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#16A085]/20 flex items-center justify-center text-xs font-bold text-[#20C997]">
                                  {chat.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between mb-0.5">
                                    <span className="text-[11px] font-extrabold text-white">{chat.name}</span>
                                    <span className="text-[8px] font-bold text-[#8E99A8]">{chat.time}</span>
                                  </div>
                                  <p className="text-[10px] text-[#8E99A8] truncate italic">"{chat.msg}"</p>
                                </div>
                                <div className={`hidden sm:inline-block px-2.5 py-0.5 border rounded-full text-[8px] font-bold uppercase tracking-wider ${chat.color}`}>
                                  {chat.stage}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center pt-3 border-t border-white/5 mt-4">
                          <div 
                            onClick={() => setActiveTab("Live Inbox")}
                            className="text-[10px] font-bold text-[#20C997] flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors uppercase tracking-wider"
                          >
                            Open Complete Command Inbox <ArrowUpRight size={12} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* VIEW 2: LIVE INBOX */}
                  {activeTab === "Live Inbox" && (
                    <div className="flex-1 h-full flex bg-[#171B22]/50 border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                      {/* Sub Column: Chat Thread Selector */}
                      <div className="w-48 border-r border-white/5 flex flex-col shrink-0">
                        <div className="p-3 border-b border-white/5 bg-white/5">
                          <p className="text-[8px] font-black text-[#8E99A8] uppercase tracking-widest">Conversations</p>
                        </div>
                        <div className="flex-1 space-y-1 p-2">
                          {[
                            { name: "Devansh Sharma", msg: "When will my order ship?", active: true },
                            { name: "Sarah Jenkins", msg: "Interested in the enterprise..." },
                            { name: "Marcus Chen", msg: "Support: WhatsApp API..." }
                          ].map(t => (
                            <div key={t.name} className={`p-2.5 rounded-xl cursor-pointer transition-colors ${t.active ? 'bg-[#0F6B52]/20 border border-[#0F6B52]/40 text-white font-bold' : 'text-[#8E99A8] hover:bg-white/5'}`}>
                              <h5 className="text-[10px] truncate">{t.name}</h5>
                              <p className="text-[8px] opacity-75 truncate">{t.msg}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub Column: Messaging Window */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Chat Header */}
                        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#16A085] flex items-center justify-center font-bold text-white text-[10px]">D</div>
                            <span className="text-[10px] font-bold text-white">Devansh Sharma</span>
                          </div>
                          <span className="text-[8px] font-bold text-[#20C997] uppercase bg-[#20C997]/10 px-2 py-0.5 rounded-md">AI Active</span>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto text-[10px] flex flex-col justify-end">
                          <div className="bg-white/5 border border-white/5 text-[#8E99A8] p-3 rounded-2xl rounded-bl-none max-w-[80%] self-start leading-relaxed">
                            When will my order ship? My tracking ID is #MC-9204.
                          </div>
                          <div className="bg-[#16A085]/20 border border-[#16A085]/30 text-white p-3 rounded-2xl rounded-br-none max-w-[80%] self-end leading-relaxed">
                            <div className="flex items-center gap-1 mb-1 font-bold text-[#20C997]">
                              <Sparkles size={8} /> AI Auto-Assistant
                            </div>
                            According to your account status, order #MC-9204 was shipped via DHL and is currently in transit, expected to arrive by Friday, July 4th.
                          </div>
                        </div>

                        {/* Chat Input placeholder */}
                        <div className="p-3 border-t border-white/5 bg-white/5 flex gap-2">
                          <input type="text" disabled placeholder="Type a message (mock preview)..." className="flex-1 bg-[#111318] border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none" />
                          <button disabled className="p-2.5 bg-[#16A085]/20 rounded-xl text-[#20C997]"><Send size={10} /></button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: FLOW BUILDER */}
                  {activeTab === "Flow Builder" && (
                    <div className="flex-1 h-full bg-[#171B22]/50 border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                      {/* Grid background representation */}
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                          <h4 className="text-xs font-bold text-white">Visual Workflow Editor</h4>
                          <span className="text-[9px] font-bold text-[#8E99A8] uppercase tracking-wider">Drag & drop automation graph</span>
                        </div>
                        <button disabled className="px-3.5 py-1.5 bg-[#16A085]/20 border border-[#16A085]/40 text-[9px] font-bold text-white rounded-lg flex items-center gap-1.5"><Plus size={10} /> Add Node</button>
                      </div>

                      {/* Mock Graph Flow */}
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10 py-6">
                        {/* Node 1 */}
                        <div className="w-32 bg-[#111318]/90 border border-[#20C997]/30 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-lg relative group">
                          <div className="absolute -top-1.5 bg-[#20C997] text-[#0B0D11] text-[7px] font-black px-2 py-0.5 rounded-full uppercase">Trigger</div>
                          <Smartphone size={16} className="text-[#20C997] mb-2" />
                          <span className="text-[8px] font-bold text-white">Keyword: "support"</span>
                        </div>

                        <div className="w-6 h-[2px] bg-gradient-to-r from-[#20C997] to-amber-500" />

                        {/* Node 2 */}
                        <div className="w-32 bg-[#111318]/90 border border-amber-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-lg relative">
                          <div className="absolute -top-1.5 bg-amber-500 text-[#0B0D11] text-[7px] font-black px-2 py-0.5 rounded-full uppercase">Condition</div>
                          <GitBranch size={16} className="text-amber-500 mb-2" />
                          <span className="text-[8px] font-bold text-white">IF TAG = VIP</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {/* Branch True */}
                          <div className="flex items-center gap-2">
                            <span className="text-[7px] text-[#20C997] font-bold uppercase">True</span>
                            <div className="w-28 bg-[#111318]/90 border border-emerald-500/20 rounded-xl p-2 flex items-center gap-2">
                              <Sparkles size={10} className="text-emerald-400" />
                              <span className="text-[8px] font-bold text-white">Assign to AI VIP Bot</span>
                            </div>
                          </div>
                          
                          {/* Branch False */}
                          <div className="flex items-center gap-2">
                            <span className="text-[7px] text-rose-400 font-bold uppercase">False</span>
                            <div className="w-28 bg-[#111318]/90 border border-rose-500/20 rounded-xl p-2 flex items-center gap-2">
                              <MessageSquare size={10} className="text-rose-400" />
                              <span className="text-[8px] font-bold text-white">Send standard menu</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: CRM CONTACTS */}
                  {activeTab === "CRM Contacts" && (
                    <div className="flex-1 h-full bg-[#171B22]/50 border border-white/5 rounded-2xl p-5 flex flex-col min-h-[400px]">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-xs font-bold text-white">CRM Lead Profiles</h4>
                          <span className="text-[9px] font-bold text-[#8E99A8] uppercase tracking-wider">Dynamic CRM customer database</span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-[10px] text-[#8E99A8]">
                          <thead>
                            <tr className="border-b border-white/5 pb-2 text-[8px] uppercase tracking-widest font-black">
                              <th className="py-2">Contact Name</th>
                              <th className="py-2">Phone Number</th>
                              <th className="py-2">Pipeline Stage</th>
                              <th className="py-2">Activity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {[
                              { name: "Devansh Sharma", phone: "+91 98765 43210", stage: "New Lead", color: "text-emerald-400", time: "2m ago" },
                              { name: "Sarah Jenkins", phone: "+1 (555) 019-2834", stage: "Negotiation", color: "text-blue-400", time: "15m ago" },
                              { name: "Marcus Chen", phone: "+44 20 7946 0958", stage: "Follow Up", color: "text-amber-400", time: "1h ago" },
                              { name: "Elena Rostova", phone: "+7 903 123 4567", stage: "Customer Won", color: "text-emerald-400", time: "1d ago" }
                            ].map(row => (
                              <tr key={row.name} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 font-bold text-white">{row.name}</td>
                                <td className="py-3 font-mono">{row.phone}</td>
                                <td className={`py-3 font-bold ${row.color}`}>{row.stage}</td>
                                <td className="py-3 font-bold text-[#8E99A8]">{row.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* VIEW 5: AI ASSISTANT */}
                  {activeTab === "AI Assistant" && (
                    <div className="flex-1 h-full flex flex-col md:flex-row gap-6 min-h-[400px]">
                      {/* Sub-Column 1: Source Files */}
                      <div className="flex-1 bg-[#171B22]/50 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                            <FileText size={14} className="text-[#20C997]" />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Source Knowledge Documents</h4>
                          </div>
                          <div className="space-y-2">
                            {[
                              { name: "faq_support_guide.pdf", size: "142 KB" },
                              { name: "pricing_enterprise_details.md", size: "38 KB" },
                              { name: "shipping_policy_info.txt", size: "12 KB" }
                            ].map(file => (
                              <div key={file.name} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl text-[9px]">
                                <span className="font-bold text-white">{file.name}</span>
                                <span className="text-[#8E99A8]">{file.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button disabled className="w-full mt-4 py-3 bg-[#16A085]/20 border border-[#16A085]/40 text-[9px] font-bold uppercase tracking-widest text-[#20C997] rounded-xl flex items-center justify-center gap-1.5"><Plus size={10} /> Upload New Source</button>
                      </div>

                      {/* Sub-Column 2: AI Playground Simulator */}
                      <div className="flex-1 bg-[#171B22]/50 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                            <Bot size={14} className="text-[#20C997]" />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI RAG Sandbox Test</h4>
                          </div>
                          <div className="space-y-3 text-[9px]">
                            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[#8E99A8]">
                              <p className="font-bold text-[#8E99A8] uppercase text-[7px] mb-1">User Query</p>
                              "What is your enterprise pricing model?"
                            </div>
                            <div className="p-3 bg-[#20C997]/10 border border-[#20C997]/20 rounded-xl text-white">
                              <p className="font-bold text-[#20C997] uppercase text-[7px] mb-1">Semantic RAG Answer</p>
                              "According to `pricing_enterprise_details.md`, enterprise plans start at $499/mo and include custom WhatsApp routing pipelines."
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold text-[#8E99A8] text-center italic mt-4">Simulating prompt RAG query</span>
                      </div>
                    </div>
                  )}

                  {/* VIEW 6: SETTINGS */}
                  {activeTab === "Settings" && (
                    <div className="flex-1 h-full bg-[#171B22]/50 border border-white/5 rounded-2xl p-5 flex flex-col min-h-[400px]">
                      <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                        <div>
                          <h4 className="text-xs font-bold text-white">Workspace Configuration</h4>
                          <span className="text-[9px] font-bold text-[#8E99A8] uppercase tracking-wider">Manage API links and variables</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Setting Item 1 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-3">
                          <div>
                            <span className="text-[8px] font-black text-[#8E99A8] uppercase tracking-widest block mb-0.5">WABA Endpoint Webhook URL</span>
                            <span className="text-[10px] text-white font-mono">https://api.uwoconnect.app/v1/webhook</span>
                          </div>
                          <button 
                            onClick={handleCopy} 
                            className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] text-white font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto hover:bg-white/10 transition-colors"
                          >
                            {copied ? <Check size={10} className="text-[#20C997]" /> : <Copy size={10} />}
                            {copied ? "Copied" : "Copy Webhook"}
                          </button>
                        </div>

                        {/* Setting Item 2 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-3">
                          <div>
                            <span className="text-[8px] font-black text-[#8E99A8] uppercase tracking-widest block mb-0.5">OpenAI GPT-4o Model Integration</span>
                            <span className="text-[10px] text-white font-semibold flex items-center gap-1.5"><CheckCircle size={10} className="text-[#20C997]" /> Connected using system api credentials</span>
                          </div>
                          <span className="text-[9px] font-bold text-[#20C997] uppercase bg-[#20C997]/10 px-2 py-1 rounded-lg self-start sm:self-auto">Status: OK</span>
                        </div>

                        {/* Setting Item 3 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-3">
                          <div>
                            <span className="text-[8px] font-black text-[#8E99A8] uppercase tracking-widest block mb-0.5">Google Cloud Storage Media Bucket</span>
                            <span className="text-[10px] text-white font-mono">gs://uwoconnect-media-bucket-prod</span>
                          </div>
                          <span className="text-[9px] font-bold text-[#20C997] uppercase bg-[#20C997]/10 px-2 py-1 rounded-lg self-start sm:self-auto">Storage: GCS</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




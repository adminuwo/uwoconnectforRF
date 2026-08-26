'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, MessageCircle, Star, Sparkles, Key, CheckCircle2, Edit3, X, Save, Zap, ArrowRight } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const FacebookIcon = ({ size = 15, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 15, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ClientAutomationsPage = () => {
  const [automations, setAutomations] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('WHATSAPP');
  const [savingKey, setSavingKey] = useState(null);
  const [toast, setToast] = useState(null);

  // Simple Greeting State
  const [greetingData, setGreetingData] = useState({ enabled: false, message: '' });
  
  // Simple AI State
  const [aiData, setAIData] = useState({ enabled: false, context: '' });

  // New Keyword Reply Modal State
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState({ name: '', keywords: '', response: '' });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const autoRes = await axios.get(`${API_BASE_URL}/api/automations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const automationsData = Array.isArray(autoRes.data) ? autoRes.data : (autoRes.data?.results || []);
      setAutomations(automationsData);

      const profileRes = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(profileRes.data.client);
      setAIData({
        enabled: profileRes.data.client.ai_enabled || false,
        context: profileRes.data.client.ai_context || ''
      });
    } catch (err) {
      console.error('Failed to fetch automations data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const welcomeAutomation = automations.find(a => a.trigger_type === 'START_CHAT' && a.channels.includes(selectedChannel));
    if (welcomeAutomation) {
      setGreetingData({ enabled: welcomeAutomation.enabled, message: welcomeAutomation.response });
    } else {
      setGreetingData({ enabled: false, message: '' });
    }
  }, [selectedChannel, automations]);

  // Save Welcome Greeting
  const handleSaveGreeting = async (newEnabledState = null) => {
    setSavingKey('greeting');
    try {
      const token = localStorage.getItem('token');
      const enabled = newEnabledState !== null ? newEnabledState : greetingData.enabled;
      
      const welcomeAutomation = automations.find(a => a.trigger_type === 'START_CHAT' && a.channels.includes(selectedChannel));

      if (welcomeAutomation) {
        await axios.patch(`${API_BASE_URL}/api/automations/${welcomeAutomation.id}/`, {
          enabled: enabled,
          response: greetingData.message
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/automations/`, {
          name: `Welcome Greeting (${selectedChannel})`,
          trigger_type: 'START_CHAT',
          response: greetingData.message,
          enabled: enabled,
          channels: [selectedChannel]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchData();
      showToast(`Welcome message saved for ${selectedChannel.toLowerCase()}!`);
    } catch (err) {
      showToast('Failed to save welcome message');
    } finally {
      setSavingKey(null);
    }
  };

  // Save AI Assistant
  const handleSaveAI = async (newEnabledState = null) => {
    setSavingKey('ai');
    try {
      const token = localStorage.getItem('token');
      const enabled = newEnabledState !== null ? newEnabledState : aiData.enabled;
      await axios.patch(`${API_BASE_URL}/api/profile`, {
        ai_enabled: enabled,
        ai_context: aiData.context
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAIData(prev => ({ ...prev, enabled }));
      showToast('AI settings saved!');
    } catch (err) {
      showToast('Failed to save AI settings');
    } finally {
      setSavingKey(null);
    }
  };

  // Create Keyword Reply
  const handleCreateKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.keywords || !newKeyword.response) return;
    setSavingKey('create_kw');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/automations/`, {
        name: newKeyword.keywords.split(',')[0].trim(),
        trigger_type: 'KEYWORD',
        keywords: newKeyword.keywords.split(',').map(k => k.trim()),
        response: newKeyword.response,
        enabled: true,
        channels: [selectedChannel]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewKeyword({ name: '', keywords: '', response: '' });
      setIsKeywordModalOpen(false);
      fetchData();
      showToast('Keyword reply created!');
    } catch (err) {
      showToast('Failed to create keyword reply');
    } finally {
      setSavingKey(null);
    }
  };

  // Toggle Keyword Reply
  const handleToggleKeyword = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/automations/${id}/`, {
        enabled: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutomations(automations.map(a => a.id === id ? { ...a, enabled: !currentStatus } : a));
      showToast(!currentStatus ? 'Keyword reply enabled' : 'Keyword reply paused');
    } catch (err) {
      showToast('Failed to update keyword reply');
    }
  };

  // Delete Keyword Reply
  const handleDeleteKeyword = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/automations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutomations(automations.filter(a => a.id !== id));
      showToast('Keyword reply deleted');
    } catch (err) {
      showToast('Failed to delete keyword reply');
    }
  };

  const channelKeywords = automations.filter(auto => {
    const chs = auto.channels || [];
    return auto.trigger_type === 'KEYWORD' && (chs.length === 0 || chs.includes(selectedChannel));
  });

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-5xl mx-auto pb-20 px-3 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Notification Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl font-medium text-xs bg-slate-900 text-white animate-in fade-in duration-200 border border-slate-800">
            <CheckCircle2 size={16} className="text-[#00AB56]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="py-3 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8 border-b border-slate-200/80">
          <div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 leading-tight break-words">
              <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-[#00AB56] shrink-0" />
              <span>Auto Replies & AI Automations</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium leading-relaxed">Configure instant responses, keyword triggers, and AI assistants for your channels.</p>
          </div>

          {/* Channel Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 bg-slate-100 p-1 sm:p-1.5 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
            <button
              onClick={() => setSelectedChannel('WHATSAPP')}
              className={cn(
                "flex-1 sm:flex-initial py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2",
                selectedChannel === 'WHATSAPP' ? "bg-white text-[#00AB56] shadow-sm border border-emerald-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <MessageCircle size={15} className={selectedChannel === 'WHATSAPP' ? 'text-[#00AB56]' : ''} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setSelectedChannel('FACEBOOK')}
              className={cn(
                "flex-1 sm:flex-initial py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2",
                selectedChannel === 'FACEBOOK' ? "bg-white text-[#2563EB] shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <FacebookIcon size={15} className={selectedChannel === 'FACEBOOK' ? 'text-[#2563EB]' : ''} />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setSelectedChannel('INSTAGRAM')}
              className={cn(
                "flex-1 sm:flex-initial py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2",
                selectedChannel === 'INSTAGRAM' ? "bg-white text-pink-600 shadow-sm border border-pink-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <InstagramIcon size={15} className={selectedChannel === 'INSTAGRAM' ? 'text-pink-600' : ''} />
              <span>Instagram</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-[#00AB56] mx-auto" size={32} />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">

            {/* --- CARD 1: WELCOME MESSAGE (GREETING) --- */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-xs shrink-0">
                    <Star size={20} fill="currentColor" className="opacity-90" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Welcome Greeting</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Send an automated instant greeting whenever a customer messages you for the first time.</p>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <div className="flex items-center gap-3 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200/80 self-start sm:self-auto shrink-0">
                  <span className={cn("text-xs font-bold", greetingData.enabled ? "text-[#00AB56]" : "text-slate-400")}>
                    {greetingData.enabled ? 'Active' : 'Disabled'}
                  </span>
                  <button 
                    onClick={() => handleSaveGreeting(!greetingData.enabled)}
                    className={cn(
                      "w-11 sm:w-12 h-6 sm:h-6.5 rounded-full p-1 transition-colors cursor-pointer relative",
                      greetingData.enabled ? "bg-[#00AB56]" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-4 sm:w-4.5 h-4 sm:h-4.5 bg-white rounded-full transition-transform shadow-sm",
                      greetingData.enabled ? "translate-x-5 sm:translate-x-5.5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={greetingData.message}
                    onChange={(e) => setGreetingData({ ...greetingData, message: e.target.value })}
                    placeholder="e.g. Hi there! Welcome to UWO Connect. How can our team assist you today?"
                    rows={4}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs text-slate-800 outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/15 transition-all resize-none font-medium leading-relaxed"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold">
                    {greetingData.message.length} chars
                  </span>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveGreeting(null)}
                    disabled={savingKey === 'greeting'}
                    className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 bg-[#00AB56] hover:bg-[#008947] text-white rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00AB56]/20 disabled:opacity-50"
                  >
                    {savingKey === 'greeting' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Save Welcome Reply</span>
                  </button>
                </div>
              </div>
            </div>


            {/* --- CARD 2: KEYWORD REPLIES --- */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-[#00AB56] flex items-center justify-center border border-emerald-200/60 shadow-xs shrink-0">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">Keyword Auto Replies</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Trigger customized responses when customers send specific keywords (e.g. "Price", "Support", "Offer").</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsKeywordModalOpen(true)}
                  className="py-2 sm:py-2.5 px-4 sm:px-5 bg-[#00AB56] hover:bg-[#008947] text-white rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00AB56]/20 shrink-0 w-full sm:w-auto"
                >
                  <Plus size={16} />
                  <span>Add Keyword Reply</span>
                </button>
              </div>

              {/* Keyword List */}
              {channelKeywords.length === 0 ? (
                <div className="p-6 sm:p-10 text-center bg-slate-50/60 rounded-xl sm:rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No keyword auto-replies configured for this channel yet. Click <strong className="text-[#00AB56]">+ Add Keyword Reply</strong> to get started.
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {channelKeywords.map((auto) => (
                    <div 
                      key={auto.id}
                      className="p-3.5 sm:p-5 bg-slate-50/70 hover:bg-white rounded-xl sm:rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all shadow-2xs hover:shadow-sm"
                    >
                      <div className="space-y-2 max-w-2xl min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">Triggers:</span>
                          {auto.keywords.map((kw, idx) => (
                            <span key={idx} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00AB56]/10 text-[#00AB56] border border-[#00AB56]/20 rounded-lg text-xs font-bold">
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-700 font-medium bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/60 italic break-words">
                          "{auto.response}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleKeyword(auto.id, auto.enabled)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                            auto.enabled ? "bg-emerald-50 text-[#00AB56] border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", auto.enabled ? "bg-[#00AB56] animate-pulse" : "bg-slate-400")} />
                          {auto.enabled ? 'Active' : 'Paused'}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteKeyword(auto.id)}
                          className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* --- CARD 3: AI SMART ASSISTANT --- */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200/60 shadow-xs shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">AI Smart Assistant</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Empower AI to answer complex customer queries automatically using your business knowledge.</p>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <div className="flex items-center gap-3 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200/80 self-start sm:self-auto shrink-0">
                  <span className={cn("text-xs font-bold", aiData.enabled ? "text-[#2563EB]" : "text-slate-400")}>
                    {aiData.enabled ? 'Active' : 'Disabled'}
                  </span>
                  <button 
                    onClick={() => handleSaveAI(!aiData.enabled)}
                    className={cn(
                      "w-11 sm:w-12 h-6 sm:h-6.5 rounded-full p-1 transition-colors cursor-pointer relative",
                      aiData.enabled ? "bg-[#2563EB]" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-4 sm:w-4.5 h-4 sm:h-4.5 bg-white rounded-full transition-transform shadow-sm",
                      aiData.enabled ? "translate-x-5 sm:translate-x-5.5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Context Box */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={aiData.context}
                    onChange={(e) => setAIData({ ...aiData, context: e.target.value })}
                    placeholder="Describe your business services, opening hours, pricing, refund policies, or product FAQs so AI answers customer queries with high precision..."
                    rows={4}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs text-slate-800 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all resize-none font-medium leading-relaxed"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold">
                    {aiData.context.length} chars
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveAI(null)}
                    disabled={savingKey === 'ai'}
                    className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#2563EB]/20 disabled:opacity-50"
                  >
                    {savingKey === 'ai' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Save AI Assistant</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Modal: Add New Keyword Reply */}
        {isKeywordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setIsKeywordModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200/90 z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Key size={18} className="text-[#00AB56]" />
                  Add Keyword Reply
                </h2>
                <button onClick={() => setIsKeywordModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateKeyword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">When Customer Sends Keywords (comma separated):</label>
                  <input
                    required
                    value={newKeyword.keywords}
                    onChange={(e) => setNewKeyword({ ...newKeyword, keywords: e.target.value })}
                    placeholder="e.g. price, cost, rate, plans"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/15 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Automatic Reply Message:</label>
                  <textarea
                    required
                    value={newKeyword.response}
                    onChange={(e) => setNewKeyword({ ...newKeyword, response: e.target.value })}
                    placeholder="e.g. Our basic plan starts at $50/mo. Visit our website for details."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#00AB56] focus:ring-2 focus:ring-[#00AB56]/15 text-slate-900 font-medium resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsKeywordModalOpen(false)}
                    className="px-5 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingKey === 'create_kw'}
                    className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#008947] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#00AB56]/20"
                  >
                    {savingKey === 'create_kw' && <Loader2 size={14} className="animate-spin" />}
                    <span>Save Reply</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ClientAutomationsPage;

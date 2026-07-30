'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, MessageCircle, Star, Sparkles, Key, CheckCircle2, Edit3, X, Save } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

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
      
      const autoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/automations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutomations(autoRes.data);

      const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(profileRes.data.client);
      setGreetingData({
        enabled: profileRes.data.client.greeting_enabled || false,
        message: profileRes.data.client.greeting_message || ''
      });
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

  // Save Welcome Greeting
  const handleSaveGreeting = async (newEnabledState = null) => {
    setSavingKey('greeting');
    try {
      const token = localStorage.getItem('token');
      const enabled = newEnabledState !== null ? newEnabledState : greetingData.enabled;
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
        greeting_enabled: enabled,
        greeting_message: greetingData.message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGreetingData(prev => ({ ...prev, enabled }));
      showToast('Welcome message saved!');
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/automations/`, {
        name: newKeyword.name || newKeyword.keywords,
        trigger_type: 'KEYWORD',
        keywords: newKeyword.keywords.split(',').map(k => k.trim()).filter(Boolean),
        response: newKeyword.response,
        channels: [selectedChannel],
        enabled: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsKeywordModalOpen(false);
      setNewKeyword({ name: '', keywords: '', response: '' });
      showToast('New keyword reply added!');
      fetchData();
    } catch (err) {
      showToast('Failed to add keyword reply');
    } finally {
      setSavingKey(null);
    }
  };

  // Toggle Keyword Reply
  const handleToggleKeyword = async (id, currentEnabled) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/automations/${id}/`, {
        enabled: !currentEnabled
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast(currentEnabled ? 'Rule paused' : 'Rule enabled');
    } catch (err) {
      console.error('Failed to toggle keyword rule');
    }
  };

  // Delete Keyword Reply
  const handleDeleteKeyword = async (id) => {
    if (!confirm('Are you sure you want to delete this reply rule?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/automations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showToast('Rule deleted');
    } catch (err) {
      console.error('Failed to delete rule');
    }
  };

  const channelKeywords = automations.filter(auto => {
    const chs = auto.channels || [];
    return chs.length === 0 || chs.includes(selectedChannel);
  });

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-4xl mx-auto pb-16 px-4 sm:px-6">
        
        {/* Notification Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg font-medium text-xs bg-slate-900 text-white animate-in fade-in duration-200">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Clean Header */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auto Replies</h1>
            <p className="text-slate-500 text-xs mt-0.5">Simple automatic responses for your customer messages.</p>
          </div>

          {/* Channel Selector Tabs */}
          <div className="flex gap-1.5 bg-slate-100/70 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSelectedChannel('WHATSAPP')}
              className={cn(
                "py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                selectedChannel === 'WHATSAPP' ? "bg-white text-emerald-700 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <MessageCircle size={14} className={selectedChannel === 'WHATSAPP' ? 'text-emerald-600' : ''} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setSelectedChannel('FACEBOOK')}
              className={cn(
                "py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                selectedChannel === 'FACEBOOK' ? "bg-white text-blue-700 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <FacebookIcon size={14} className={selectedChannel === 'FACEBOOK' ? 'text-blue-600' : ''} />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setSelectedChannel('INSTAGRAM')}
              className={cn(
                "py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                selectedChannel === 'INSTAGRAM' ? "bg-white text-pink-700 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <InstagramIcon size={14} className={selectedChannel === 'INSTAGRAM' ? 'text-pink-600' : ''} />
              <span>Instagram</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="animate-spin text-emerald-600 mx-auto" size={28} />
          </div>
        ) : (
          <div className="space-y-6">

            {/* --- CARD 1: WELCOME MESSAGE (GREETING) --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Star size={18} fill="currentColor" className="opacity-80" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Welcome Greeting</h3>
                    <p className="text-[11px] text-slate-400">Automatic reply when a customer first messages you.</p>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {greetingData.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button 
                    onClick={() => handleSaveGreeting(!greetingData.enabled)}
                    className={cn(
                      "w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer",
                      greetingData.enabled ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 bg-white rounded-full transition-transform shadow-xs",
                      greetingData.enabled ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-3">
                <textarea
                  value={greetingData.message}
                  onChange={(e) => setGreetingData({ ...greetingData, message: e.target.value })}
                  placeholder="e.g. Hi! Welcome to our store. How can we help you today?"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:border-emerald-500 transition-colors resize-none"
                />
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveGreeting(null)}
                    disabled={savingKey === 'greeting'}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingKey === 'greeting' ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>Save Welcome Reply</span>
                  </button>
                </div>
              </div>
            </div>


            {/* --- CARD 2: KEYWORD REPLIES --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Key size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Keyword Auto Replies</h3>
                    <p className="text-[11px] text-slate-400">Reply automatically when specific words (e.g. "Price", "Hours") are sent.</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsKeywordModalOpen(true)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Keyword Reply</span>
                </button>
              </div>

              {/* Keyword List */}
              {channelKeywords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No keyword replies set yet. Click <strong>+ Add Keyword Reply</strong> above to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {channelKeywords.map((auto) => (
                    <div 
                      key={auto.id}
                      className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-900">Keywords:</span>
                          {auto.keywords.map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white text-emerald-700 border border-emerald-200/60 rounded text-[11px] font-medium">
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 italic">"{auto.response}"</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Toggle */}
                        <button
                          onClick={() => handleToggleKeyword(auto.id, auto.enabled)}
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer",
                            auto.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                          )}
                        >
                          {auto.enabled ? 'Active' : 'Paused'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteKeyword(auto.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* --- CARD 3: AI SMART ASSISTANT --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">AI Smart Assistant</h3>
                    <p className="text-[11px] text-slate-400">Let AI answer customer questions based on your business info.</p>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {aiData.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button 
                    onClick={() => handleSaveAI(!aiData.enabled)}
                    className={cn(
                      "w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer",
                      aiData.enabled ? "bg-purple-600" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 bg-white rounded-full transition-transform shadow-xs",
                      aiData.enabled ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Context Box */}
              <div className="space-y-3">
                <textarea
                  value={aiData.context}
                  onChange={(e) => setAIData({ ...aiData, context: e.target.value })}
                  placeholder="Describe your business, products, services, timings, or prices so AI can answer customer queries accurately..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:border-purple-500 transition-colors resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveAI(null)}
                    disabled={savingKey === 'ai'}
                    className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingKey === 'ai' ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
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
            <div onClick={() => setIsKeywordModalOpen(false)} className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" />
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">Add Keyword Reply</h2>
                <button onClick={() => setIsKeywordModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateKeyword} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">When customer sends (Keywords, comma separated):</label>
                  <input
                    required
                    value={newKeyword.keywords}
                    onChange={(e) => setNewKeyword({ ...newKeyword, keywords: e.target.value })}
                    placeholder="e.g. price, cost, rate"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Automatic Reply Message:</label>
                  <textarea
                    required
                    value={newKeyword.response}
                    onChange={(e) => setNewKeyword({ ...newKeyword, response: e.target.value })}
                    placeholder="e.g. Our basic plan starts at $50/mo. Visit our website for details."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsKeywordModalOpen(false)}
                    className="px-4 py-2 text-slate-500 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingKey === 'create_kw'}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {savingKey === 'create_kw' && <Loader2 size={13} className="animate-spin" />}
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

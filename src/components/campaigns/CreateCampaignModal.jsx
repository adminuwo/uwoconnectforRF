'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Megaphone, Loader2, Sparkles, Check, ChevronRight, ChevronLeft,
  Users, Send, Bot, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const STAGES = [
  { id: 'ALL', label: 'All Contacts' },
  { id: 'NEW', label: 'New Lead' },
  { id: 'FOLLOWUP', label: 'Follow Up' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'WON', label: 'Closed Won' },
  { id: 'LOST', label: 'Closed Lost' }
];

const PLATFORMS = [
  { id: 'WHATSAPP', name: 'WhatsApp', color: 'text-[#00AB56]' },
  { id: 'INSTAGRAM', name: 'Instagram Direct', color: 'text-pink-500' },
  { id: 'FACEBOOK', name: 'Facebook Messenger', color: 'text-blue-600' },
  { id: 'GMAIL', name: 'Email (Gmail & Outlook)', color: 'text-red-500' },
  { id: 'SMS', name: 'SMS Gateway', color: 'text-blue-500' },
  { id: 'TELEGRAM', name: 'Telegram Bot', color: 'text-sky-500' },
  { id: 'LINKEDIN', name: 'LinkedIn InMail', color: 'text-indigo-600' },
];

export default function CreateCampaignModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('ALL');
  const [composeMode, setComposeMode] = useState('TEMPLATE'); // 'TEMPLATE' or 'CUSTOM'
  const [templateId, setTemplateId] = useState('');
  const [messageBody, setMessageBody] = useState('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWOConnect today!');
  const [templates, setTemplates] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['WHATSAPP']);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      setStep(1);
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/templates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data || []);
      if (res.data && res.data.length > 0) {
        setTemplateId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/campaigns/ai_generate/`, {
        prompt: messageBody || name || "Create a high converting promotion message",
        action_type: 'improve',
        tone: "professional"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.result) {
        setMessageBody(res.data.result);
      }
    } catch (err) {
      // Graceful fallback if Django server reloads during API call
      const clean = (messageBody || "We have an exclusive offer for you on UWOConnect today!")
        .replace(/Hello {{first_name}},?/gi, '')
        .trim();
      setMessageBody(`Hello {{first_name}},\n\n${clean}\n\nReply YES to claim your instant offer today!`);
    } finally {
      setAiLoading(false);
    }
  };

  const togglePlatform = (pId) => {
    if (selectedPlatforms.includes(pId)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(id => id !== pId));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, pId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name,
        message_body: composeMode === 'CUSTOM' ? messageBody : '',
        template: composeMode === 'TEMPLATE' ? templateId : null,
        platforms: selectedPlatforms,
        audience_filter: audienceFilter,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/campaigns/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onCreated();
      onClose();
      setName('');
    } catch (err) {
      console.error("Failed to create campaign", err);
      alert(err.response?.data?.error || "Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col border border-slate-200/80">
        
        {/* Simple Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00AB56] flex items-center justify-center font-bold">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">New Broadcast Campaign</h2>
              <p className="text-xs text-slate-400 font-medium">Step {step} of 3</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-white">

          {/* STEP 1: Details & Audience */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Festival Special Offer 2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00AB56] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Audience</label>
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  {STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Message Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setComposeMode('TEMPLATE')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    composeMode === 'TEMPLATE' ? 'bg-emerald-50 border-[#00AB56] text-[#00AB56]' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Approved Meta Template
                </button>
                <button
                  type="button"
                  onClick={() => setComposeMode('CUSTOM')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    composeMode === 'CUSTOM' ? 'bg-emerald-50 border-[#00AB56] text-[#00AB56]' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Custom / AI Message
                </button>
              </div>

              {composeMode === 'TEMPLATE' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Template</label>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.language})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">Message Text</label>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAIGenerate}
                      className="px-2.5 py-1 bg-emerald-50 text-[#00AB56] hover:bg-emerald-100 rounded-lg text-[10px] font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer"
                    >
                      {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      AI Improve
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00AB56] focus:bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Channels & Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Communication Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(p => {
                    const isSel = selectedPlatforms.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSel ? 'bg-emerald-50 border-[#00AB56] text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className={`text-xs ${p.color}`}>{p.name}</span>
                        {isSel && <Check size={14} className="text-[#00AB56]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-medium text-slate-600">
                <p>Campaign: <strong className="text-slate-900">{name || 'Untitled'}</strong></p>
                <p>Audience: <strong className="text-slate-900">{audienceFilter}</strong></p>
                <p>Channels: <strong className="text-[#00AB56]">{selectedPlatforms.join(', ')}</strong></p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!name && step === 1}
              onClick={() => setStep(prev => Math.min(3, prev + 1))}
              className="px-5 py-2 bg-[#00AB56] hover:bg-[#009249] disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-[#00AB56] hover:bg-[#009249] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send Broadcast
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

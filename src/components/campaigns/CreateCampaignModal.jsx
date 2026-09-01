'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Megaphone, Loader2, Sparkles, Check, ChevronRight, ChevronLeft,
  Users, Send, Bot, CheckCircle2, Calendar, Wallet, Lock, AlertCircle, Plus
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import AddMoneyModal from '@/components/billing/AddMoneyModal';

const STAGES = [
  { id: 'ALL', label: 'All Contacts' },
  { id: 'NEW', label: 'New Lead' },
  { id: 'FOLLOWUP', label: 'Follow Up' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'WON', label: 'Closed Won' },
  { id: 'LOST', label: 'Closed Lost' },
  { id: 'SPECIFIC', label: 'Select Specific Contacts' }
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
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Scheduling State
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Follow-up State
  const [isFollowUpEnabled, setIsFollowUpEnabled] = useState(false);
  const [followupDelayHours, setFollowupDelayHours] = useState('24');
  const [followupTemplateId, setFollowupTemplateId] = useState('');

  // Entitlement & Billing Validation State
  const [entitlementData, setEntitlementData] = useState(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchContacts();
      setStep(1);
      // Reset form
      setName('');
      setAudienceFilter('ALL');
      setComposeMode('TEMPLATE');
      setMessageBody('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWOConnect today!');
      setSelectedPlatforms(['WHATSAPP']);
      setSelectedContacts([]);
      setIsScheduled(false);
      setScheduleDate('');
      setScheduleTime('');
      setIsFollowUpEnabled(false);
      setFollowupDelayHours('24');
      setFollowupTemplateId('');
      fetchBroadcastValidation();
    }
  }, [isOpen]);

  const fetchBroadcastValidation = async () => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/broadcasts/entitlement/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntitlementData(res.data);
    } catch (err) {
      console.error("Failed to fetch broadcast entitlement", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/contacts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/templates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setTemplates(data);
      if (data && data.length > 0) {
        setTemplateId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/campaigns/ai_generate/`, {
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
    if (e && e.preventDefault) e.preventDefault();
    if (!name) return;

    setLoading(true);
    let consumeRes = null;
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');

      // 1. Consume Entitlement or Reserve Wallet Fund
      const broadcast_id = `brd_${Date.now()}`;
      const idempotency_key = `key_${broadcast_id}_${name.replace(/\s+/g, '_')}`;

      const cRes = await axios.post(`${API_BASE_URL}/api/broadcasts/consume/`, {
        broadcast_id,
        idempotency_key
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      consumeRes = cRes.data;

      // 2. Submit Campaign Execution
      let scheduled_at = null;
      if (isScheduled && scheduleDate && scheduleTime) {
        const dt = new Date(`${scheduleDate}T${scheduleTime}:00`);
        scheduled_at = dt.toISOString();
      }

      const payload = {
        name,
        message_body: composeMode === 'CUSTOM' ? messageBody : '',
        template: composeMode === 'TEMPLATE' ? templateId : null,
        platforms: selectedPlatforms,
        audience_filter: audienceFilter,
        tags: audienceFilter === 'SPECIFIC' ? selectedContacts : [],
        scheduled_at,
        followup_delay_hours: isFollowUpEnabled ? followupDelayHours : null,
        followup_template_id: isFollowUpEnabled ? followupTemplateId : null,
        broadcast_usage_id: consumeRes?.broadcast_usage_id
      };

      await axios.post(`${API_BASE_URL}/api/campaigns/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onCreated();
      onClose();
      setName('');
    } catch (err) {
      console.error("Failed to create campaign", err);
      if (consumeRes && consumeRes.broadcast_usage_id) {
        try {
          const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
          await axios.post(`${API_BASE_URL}/api/broadcasts/refund/`, {
            broadcast_usage_id: consumeRes.broadcast_usage_id,
            reason: 'Campaign launch creation failed'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (rErr) {
          console.error("Failed to auto-refund broadcast usage", rErr);
        }
      }
      alert(err.response?.data?.error || "Failed to launch broadcast.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#00AB56] flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Create New Broadcast</h3>
              <p className="text-xs text-slate-500">Step {step} of 3 — {step === 1 ? 'Target & Setup' : step === 2 ? 'Message Content' : 'Schedule & Confirm'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: TARGET & SETUP */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Festival Special Offer 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Audience Stage</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAudienceFilter(s.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                        audienceFilter === s.id
                          ? 'border-[#00AB56] bg-emerald-50/80 text-[#00AB56] shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => {
                    const isSel = selectedPlatforms.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSel ? 'border-[#00AB56] bg-emerald-50/40 text-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSel ? p.color : ''}`}>{p.name}</span>
                        {isSel && <Check size={14} className="text-[#00AB56]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MESSAGE CONTENT */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setComposeMode('TEMPLATE')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    composeMode === 'TEMPLATE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Meta Template
                </button>
                <button
                  type="button"
                  onClick={() => setComposeMode('CUSTOM')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    composeMode === 'CUSTOM' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Custom Compose / AI
                </button>
              </div>

              {composeMode === 'TEMPLATE' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Approved Template</label>
                  {templates.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                      No approved Meta templates found. Please sync templates or switch to Custom Compose.
                    </div>
                  ) : (
                    <select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-900 bg-white"
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.category || 'MARKETING'})</option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Message</label>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAIGenerate}
                      className="text-xs font-extrabold text-[#00AB56] hover:text-[#008f47] flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 cursor-pointer"
                    >
                      {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      <span>Enhance with AI</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800 leading-relaxed"
                    placeholder="Compose your broadcast message..."
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCHEDULE & CONFIRM */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Schedule Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Schedule for Later</label>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Send at a specific date & time</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isScheduled} onChange={() => setIsScheduled(!isScheduled)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {isScheduled && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation Summary & Broadcast Billing Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 font-medium text-slate-700">
                <div className="flex items-center justify-between font-bold border-b border-slate-200/80 pb-2">
                  <span>Campaign Summary:</span>
                  <span className="text-slate-900 font-extrabold">{name || 'Untitled'}</span>
                </div>
                <p>Audience Stage: <strong className="text-slate-900">{audienceFilter}</strong></p>
                <p>Target Channels: <strong className="text-[#00AB56]">{selectedPlatforms.join(', ')}</strong></p>

                {/* Pre-Send Billing Breakdown Box */}
                {entitlementData && (
                  <div className="pt-3 border-t border-slate-200">
                    {entitlementData.remaining_quantity > 0 ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-extrabold block">Covered by Subscription Plan</span>
                            <span className="text-[11px] text-emerald-700">
                              {entitlementData.remaining_quantity} included broadcast{entitlementData.remaining_quantity > 1 ? 's' : ''} remaining — <strong>₹0.00 wallet charge</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : entitlementData.can_broadcast ? (
                      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Wallet size={18} className="text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-extrabold block">Billed via Prepaid Usage Wallet</span>
                            <span className="text-[11px] text-indigo-700">
                              Included broadcasts exhausted (0 remaining). <strong>₹{entitlementData.broadcast_rate_inr.toFixed(2)}</strong> will be deducted from your wallet (Balance: ₹{entitlementData.wallet_balance_inr.toFixed(2)}).
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Lock size={18} className="text-rose-600 shrink-0" />
                          <div>
                            <span className="font-extrabold text-rose-900 block">Broadcast Locked — Insufficient Funds</span>
                            <span className="text-[11px] text-rose-700">
                              Included broadcasts exhausted (0 remaining). Wallet balance (₹{entitlementData.wallet_balance_inr.toFixed(2)}) is insufficient for an additional broadcast (₹{entitlementData.broadcast_rate_inr.toFixed(2)} required).
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddMoneyOpen(true)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Money
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
              disabled={loading || (entitlementData && !entitlementData.can_broadcast)}
              className="px-6 py-2 bg-[#00AB56] hover:bg-[#009249] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : (isScheduled ? <Calendar size={14} /> : <Send size={14} />)}
              {isScheduled ? 'Schedule Broadcast' : 'Send Broadcast'}
            </button>
          )}
        </div>

      </div>

      {/* Add Money Modal */}
      {isAddMoneyOpen && (
        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={() => setIsAddMoneyOpen(false)}
          onSuccess={() => {
            fetchBroadcastValidation();
          }}
        />
      )}
    </div>
  );
}

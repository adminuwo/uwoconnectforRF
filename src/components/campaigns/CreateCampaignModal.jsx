'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Megaphone, Loader2, Sparkles, Check, ChevronRight, ChevronLeft,
  Users, Send, CheckCircle2, Calendar, Wallet, Lock, AlertCircle, Plus,
  Search, CheckSquare, Square, Clock, MessageSquare, Phone, UserCheck, Eye
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

const VARIABLE_TAGS = [
  { tag: '{{first_name}}', label: 'First Name' },
  { tag: '{{name}}', label: 'Full Name' },
  { tag: '{{phone}}', label: 'Phone' },
  { tag: '{{company}}', label: 'Company' }
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
  const [messageBody, setMessageBody] = useState('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWOConnect today! Reply YES to claim now.');
  const [templates, setTemplates] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['WHATSAPP']);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');

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

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchContacts();
      setStep(1);
      setName('');
      setAudienceFilter('ALL');
      setComposeMode('TEMPLATE');
      setMessageBody('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWOConnect today! Reply YES to claim now.');
      setSelectedPlatforms(['WHATSAPP']);
      setSelectedContacts([]);
      setContactSearch('');
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
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setContacts(data);
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
        setTemplateId(String(data[0].id));
        setFollowupTemplateId(String(data[0].id));
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

  const insertVariable = (variableText) => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newText = messageBody.substring(0, start) + variableText + messageBody.substring(end);
      setMessageBody(newText);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + variableText.length;
        el.focus();
      }, 0);
    } else {
      setMessageBody(prev => `${prev} ${variableText}`);
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

  // Contacts handling for SPECIFIC mode
  const filteredContacts = contacts.filter(c => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    const cName = (c.name || '').toLowerCase();
    const cPhone = (c.phone_number || '').toLowerCase();
    return cName.includes(q) || cPhone.includes(q);
  });

  const toggleContactSelection = (contactId) => {
    const cid = String(contactId);
    if (selectedContacts.includes(cid)) {
      setSelectedContacts(selectedContacts.filter(id => id !== cid));
    } else {
      setSelectedContacts([...selectedContacts, cid]);
    }
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredContacts.map(c => String(c.id || c._id));
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedContacts.includes(id));

    if (isAllSelected) {
      setSelectedContacts(selectedContacts.filter(id => !allFilteredIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedContacts, ...allFilteredIds]));
      setSelectedContacts(combined);
    }
  };

  const selectedTemplate = templates.find(t => String(t.id) === String(templateId));
  const getTemplateBodyText = (tmpl) => {
    if (!tmpl) return '';
    const comps = Array.isArray(tmpl.components) ? tmpl.components : [];
    const body = comps.find(c => c.type === 'BODY');
    return body?.text || tmpl.name;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name) return;

    if (audienceFilter === 'SPECIFIC' && selectedContacts.length === 0) {
      alert("Please select at least one contact to receive this broadcast.");
      return;
    }

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
        channel: selectedPlatforms[0] || 'WHATSAPP',
        message_body: composeMode === 'CUSTOM' ? messageBody : '',
        template: composeMode === 'TEMPLATE' ? templateId : null,
        platforms: selectedPlatforms,
        audience_filter: audienceFilter,
        tags: audienceFilter === 'SPECIFIC' ? selectedContacts : [],
        scheduled_at,
        followup_delay_hours: isFollowUpEnabled ? parseInt(followupDelayHours, 10) : null,
        followup_template_id: isFollowUpEnabled ? followupTemplateId : null,
        broadcast_usage_id: consumeRes?.broadcast_usage_id
      };

      await axios.post(`${API_BASE_URL}/api/campaigns/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (onCreated) onCreated();
      onClose();
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
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to launch broadcast.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#00AB56] flex items-center justify-center shadow-xs">
              <Megaphone size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Create New Broadcast</h3>
              <p className="text-xs text-slate-500 font-medium">
                Step {step} of 3 — {step === 1 ? 'Target & Setup' : step === 2 ? 'Message Content' : 'Schedule & Confirm'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div 
            className="bg-[#00AB56] h-full transition-all duration-300 rounded-r-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: TARGET & SETUP */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festival Special Offer 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-semibold text-slate-900 shadow-xs"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Audience Stage
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Total Contacts: {contacts.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAudienceFilter(s.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        audienceFilter === s.id
                          ? 'border-[#00AB56] bg-emerald-50/80 text-[#00AB56] shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block truncate">{s.label}</span>
                      {s.id === 'SPECIFIC' && selectedContacts.length > 0 && (
                        <span className="text-[10px] text-emerald-600 block mt-0.5 font-extrabold">
                          ✓ {selectedContacts.length} selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECIFIC CONTACTS SELECTOR */}
              {audienceFilter === 'SPECIFIC' && (
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-emerald-200/80 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-[#00AB56]" />
                      <span className="text-xs font-extrabold text-slate-900">
                        Select Recipients ({selectedContacts.length} of {contacts.length} chosen)
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer self-start sm:self-auto bg-emerald-100/60 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {filteredContacts.length > 0 && filteredContacts.every(c => selectedContacts.includes(String(c.id || c._id)))
                        ? 'Deselect All Filtered'
                        : `Select All Filtered (${filteredContacts.length})`}
                    </button>
                  </div>

                  {/* Search Contact Box */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search contacts by name or phone..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Contact Checkbox List */}
                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs font-medium">
                        {contacts.length === 0 ? "No contacts found in CRM. Please import contacts first." : "No contacts match your search query."}
                      </div>
                    ) : (
                      filteredContacts.map((contact) => {
                        const cId = String(contact.id || contact._id);
                        const isChecked = selectedContacts.includes(cId);
                        return (
                          <div
                            key={cId}
                            onClick={() => toggleContactSelection(cId)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-white border-[#00AB56] shadow-xs'
                                : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {(contact.name || 'C')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {contact.name || 'Unnamed Contact'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono block truncate">
                                  {contact.phone_number || contact.email || 'No Phone'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {contact.stage && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                  {contact.stage}
                                </span>
                              )}
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-[#00AB56] text-white' : 'border border-slate-300'
                              }`}>
                                {isChecked && <Check size={13} strokeWidth={3} />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Channels
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => {
                    const isSel = selectedPlatforms.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSel ? 'border-[#00AB56] bg-emerald-50/40 text-slate-900 shadow-xs' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setComposeMode('TEMPLATE')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    composeMode === 'TEMPLATE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Meta Template ({templates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setComposeMode('CUSTOM')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    composeMode === 'CUSTOM' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Custom Compose / AI
                </button>
              </div>

              {composeMode === 'TEMPLATE' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Approved Meta Template
                  </label>
                  {templates.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                      No approved Meta templates found. Please click "Sync" on the campaigns page or use Custom Compose.
                    </div>
                  ) : (
                    <>
                      <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-900 bg-white shadow-xs"
                      >
                        {templates.map(t => (
                          <option key={t.id} value={String(t.id)}>
                            {t.name} — {t.category || 'MARKETING'} ({t.language || 'en'})
                          </option>
                        ))}
                      </select>

                      {/* Live Template Card Preview */}
                      {selectedTemplate && (
                        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                              <Eye size={13} /> Template Body Preview
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-emerald-700 border border-emerald-200 uppercase">
                                {selectedTemplate.category || 'MARKETING'}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 uppercase">
                                {selectedTemplate.language || 'en'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                            {getTemplateBodyText(selectedTemplate)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Broadcast Message Text
                    </label>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAIGenerate}
                      className="text-xs font-extrabold text-[#00AB56] hover:text-[#008f47] flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 cursor-pointer transition-all shadow-xs"
                    >
                      {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      <span>Enhance with AI</span>
                    </button>
                  </div>

                  {/* Variable insertion buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Insert:</span>
                    {VARIABLE_TAGS.map(v => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => insertVariable(v.tag)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        title={`Click to insert ${v.tag}`}
                      >
                        + {v.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={5}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800 leading-relaxed shadow-xs"
                    placeholder="Compose your broadcast message..."
                  />

                  {/* WhatsApp Chat Preview Bubble */}
                  <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      WhatsApp Message Preview
                    </span>
                    <div className="flex justify-end">
                      <div className="bg-[#E7FFDB] text-slate-900 border border-emerald-200/60 p-3 rounded-2xl rounded-tr-xs max-w-sm text-xs shadow-xs font-normal leading-relaxed whitespace-pre-line">
                        {messageBody.replace("{{first_name}}", "Rahul").replace("{{name}}", "Rahul Sharma").replace("{{company}}", "UWOConnect")}
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-slate-400">
                          <span>12:00 PM</span>
                          <span className="text-emerald-600 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCHEDULE & CONFIRM */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Schedule Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900">Schedule for Later</label>
                    <p className="text-[11px] text-slate-500 font-medium">Send automatically at a scheduled date and time</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isScheduled} 
                      onChange={() => setIsScheduled(!isScheduled)} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AB56]"></div>
                  </label>
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Automated Follow-Up (Smart Drip) Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>⚡ Smart Follow-Up Automation</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black uppercase">Drip</span>
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium">Send follow-up template if contact doesn't reply within chosen delay</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isFollowUpEnabled} 
                      onChange={() => setIsFollowUpEnabled(!isFollowUpEnabled)} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AB56]"></div>
                  </label>
                </div>

                {isFollowUpEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Delay Hours</label>
                      <select
                        value={followupDelayHours}
                        onChange={(e) => setFollowupDelayHours(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-800"
                      >
                        <option value="6">After 6 Hours</option>
                        <option value="12">After 12 Hours</option>
                        <option value="24">After 24 Hours (1 Day)</option>
                        <option value="48">After 48 Hours (2 Days)</option>
                        <option value="72">After 72 Hours (3 Days)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Follow-Up Template</label>
                      <select
                        value={followupTemplateId}
                        onChange={(e) => setFollowupTemplateId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-800"
                      >
                        {templates.map(t => (
                          <option key={t.id} value={String(t.id)}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Summary & Billing Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 font-medium text-slate-700">
                <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-2">
                  <span>Campaign Summary:</span>
                  <span className="text-slate-900 font-extrabold">{name || 'Untitled'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Target Stage: <strong className="text-slate-900">{audienceFilter}</strong></div>
                  <div>Estimated Recipients: <strong className="text-emerald-700">
                    {audienceFilter === 'SPECIFIC' ? selectedContacts.length : (audienceFilter === 'ALL' ? contacts.length : 'Filtered by Stage')}
                  </strong></div>
                  <div>Target Channels: <strong className="text-[#00AB56]">{selectedPlatforms.join(', ')}</strong></div>
                  <div>Message Type: <strong className="text-slate-900">{composeMode === 'TEMPLATE' ? 'Meta Template' : 'Custom / AI'}</strong></div>
                </div>

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
                              Included broadcasts exhausted. Wallet balance (₹{entitlementData.wallet_balance_inr.toFixed(2)}) is insufficient for an additional broadcast (₹{entitlementData.broadcast_rate_inr.toFixed(2)} required).
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
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!name.trim() || (step === 1 && audienceFilter === 'SPECIFIC' && selectedContacts.length === 0)}
              onClick={() => setStep(prev => Math.min(3, prev + 1))}
              className="px-5 py-2.5 bg-[#00AB56] hover:bg-[#009249] disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (entitlementData && !entitlementData.can_broadcast)}
              className="px-6 py-2.5 bg-[#00AB56] hover:bg-[#009249] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
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

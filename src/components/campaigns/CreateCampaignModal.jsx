'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Megaphone, Loader2, Sparkles, Check, ChevronRight, ChevronLeft,
  Users, Send, CheckCircle2, Calendar, Wallet, Lock, AlertCircle, Plus,
  Search, CheckSquare, Square, Clock, MessageSquare, Phone, UserCheck, Eye,
  FileSpreadsheet, Upload, Trash2, Info, ShieldAlert
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
  { id: 'WHATSAPP', name: 'WhatsApp (Meta Cloud API)', color: 'text-[#00AB56]' },
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
  const [messageBody, setMessageBody] = useState('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWO Connect today! Reply YES to claim now.');
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

  // Recipient Source & Excel Import State
  const [recipientMode, setRecipientMode] = useState('CONTACTS'); // 'CONTACTS' or 'EXCEL'
  const [excelFile, setExcelFile] = useState(null);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [excelError, setExcelError] = useState('');
  const [excelPreviewRows, setExcelPreviewRows] = useState([]);
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [importedRecipients, setImportedRecipients] = useState([]);
  const fileInputRef = useRef(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchContacts();
      setStep(1);
      setName('');
      setAudienceFilter('ALL');
      setRecipientMode('CONTACTS');
      setExcelFile(null);
      setIsParsingExcel(false);
      setExcelError('');
      setExcelPreviewRows([]);
      setIsExcelPreviewOpen(false);
      setImportedRecipients([]);
      setComposeMode('TEMPLATE');
      setMessageBody('Hello {{first_name}},\n\nWe have an exclusive offer for you on UWO Connect today! Reply YES to claim now.');
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
      const clean = (messageBody || "We have an exclusive offer for you on UWO Connect today!")
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

  // ---------------------------------------------------------------------------
  // EXCEL CONTACT IMPORT FOR WHATSAPP BROADCAST
  // ---------------------------------------------------------------------------
  const handleExcelFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
      setExcelError('Please select a valid Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    setExcelFile(selectedFile);
    setExcelError('');
    setIsParsingExcel(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');

      const res = await axios.post(`${API_BASE_URL}/api/campaigns/parse_excel/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data && Array.isArray(res.data.recipients)) {
        processParsedList(res.data.recipients, res.data.sample_invalid || []);
      } else {
        await parseCSVText(selectedFile);
      }
    } catch (err) {
      console.warn("Backend excel parse fallback to client parser:", err);
      await parseCSVText(selectedFile);
    } finally {
      setIsParsingExcel(false);
    }
  };

  const parseCSVText = async (file) => {
    try {
      const text = await file.text();
      const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        setExcelError('File is empty or contains only header row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('number') || h.includes('contact'));
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
      const tagsIdx = headers.findIndex(h => h.includes('tag'));

      const rawRecipients = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^["']|["']$/g, ''));
        const rawPhone = phoneIdx !== -1 ? cols[phoneIdx] : (cols[1] || cols[0]);
        const rawName = nameIdx !== -1 ? cols[nameIdx] : cols[0];
        const rawEmail = emailIdx !== -1 ? cols[emailIdx] : '';
        const rawTags = tagsIdx !== -1 ? cols[tagsIdx] : '';

        rawRecipients.push({
          name: rawName,
          phone: rawPhone,
          email: rawEmail,
          tags: rawTags
        });
      }

      processParsedList(rawRecipients, []);
    } catch (e) {
      setExcelError('Failed to parse CSV file. Please upload a valid .csv or .xlsx file.');
    }
  };

  const processParsedList = (rawList, rawInvalidList = []) => {
    const seenNumbers = new Set();
    const rows = [];

    rawList.forEach((r, idx) => {
      const rawPhone = String(r.phone || r.phone_number || r.raw_phone || '').trim();
      const rawName = String(r.name || '').trim();
      const digits = rawPhone.replace(/\D/g, '');

      let status = 'VALID';
      let reason = 'Ready to import';

      if (!digits || digits.length < 10) {
        status = 'INVALID';
        reason = 'Missing or invalid phone number';
      } else if (seenNumbers.has(digits)) {
        status = 'DUPLICATE';
        reason = 'Duplicate number detected';
      } else {
        seenNumbers.add(digits);
      }

      // Requirement 7: Match existing CRM contact by phone digits
      let finalName = rawName;
      const crmMatch = contacts.find(c => {
        const cP = (c.phone_number || c.platform_id || '').replace(/\D/g, '');
        return cP && cP.length >= 7 && (cP.endsWith(digits) || digits.endsWith(cP));
      });

      if (crmMatch && crmMatch.name) {
        finalName = crmMatch.name;
      }

      if (!finalName) {
        finalName = `Contact #${digits.slice(-4)}`;
      }

      let formattedPhone = rawPhone;
      if (digits.length === 10) {
        formattedPhone = `+91 ${digits}`;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${digits}`;
      }

      rows.push({
        id: `r_${idx}_${Date.now()}`,
        name: finalName,
        phone: formattedPhone,
        cleanPhone: digits,
        email: r.email || '',
        tags: r.tags || '',
        status,
        reason
      });
    });

    rawInvalidList.forEach((inv, idx) => {
      rows.push({
        id: `inv_${idx}_${Date.now()}`,
        name: 'Invalid Row',
        phone: inv.raw_phone || 'Missing',
        cleanPhone: '',
        status: 'INVALID',
        reason: inv.reason || 'Invalid phone number'
      });
    });

    setExcelPreviewRows(rows);
    setIsExcelPreviewOpen(true);
  };

  const removePreviewRow = (rowId) => {
    setExcelPreviewRows(prev => prev.filter(r => r.id !== rowId));
  };

  const confirmExcelImport = () => {
    const validRows = excelPreviewRows
      .filter(r => r.status === 'VALID')
      .map(r => ({
        name: r.name,
        phone: r.cleanPhone.length === 10 ? `91${r.cleanPhone}` : r.cleanPhone,
        displayPhone: r.phone,
        email: r.email,
        tags: r.tags
      }));

    if (validRows.length === 0) {
      alert("No valid recipients found to import.");
      return;
    }

    setImportedRecipients(validRows);
    setIsExcelPreviewOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a campaign name.");
      return;
    }

    if (recipientMode === 'CONTACTS' && audienceFilter === 'SPECIFIC' && selectedContacts.length === 0) {
      alert("Please select at least one contact to receive this broadcast.");
      return;
    }

    if (recipientMode === 'EXCEL' && importedRecipients.length === 0) {
      alert("Please upload and import valid recipients from Excel file first.");
      return;
    }

    if (composeMode === 'TEMPLATE' && !templateId) {
      alert("Please select an approved Meta template, or switch to Custom Compose.");
      return;
    }

    if (composeMode === 'CUSTOM' && !messageBody.trim()) {
      alert("Please enter message content for your broadcast.");
      return;
    }

    setLoading(true);
    let consumeRes = null;
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');

      // 1. Consume Entitlement or Reserve Wallet Fund
      const broadcast_id = `brd_${Date.now()}`;
      const idempotency_key = `key_${broadcast_id}_${name.trim().replace(/\s+/g, '_')}`;

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
        name: name.trim(),
        channel: selectedPlatforms[0] || 'WHATSAPP',
        message_body: composeMode === 'CUSTOM' ? messageBody.trim() : '',
        template: composeMode === 'TEMPLATE' && templateId ? templateId : null,
        platforms: selectedPlatforms,
        audience_filter: recipientMode === 'EXCEL' ? 'SPECIFIC' : audienceFilter,
        tags: recipientMode === 'EXCEL' ? [] : (audienceFilter === 'SPECIFIC' ? selectedContacts : []),
        imported_recipients: recipientMode === 'EXCEL' ? importedRecipients : [],
        scheduled_at,
        followup_delay_hours: isFollowUpEnabled ? parseInt(followupDelayHours, 10) : null,
        followup_template_id: isFollowUpEnabled && followupTemplateId ? followupTemplateId : null,
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

              {/* Recipient Source & Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Add Recipients
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {recipientMode === 'CONTACTS' ? `CRM Contacts: ${contacts.length}` : `Imported: ${importedRecipients.length}`}
                  </span>
                </div>
                
                {/* Recipient Source Selector */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setRecipientMode('CONTACTS')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      recipientMode === 'CONTACTS'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Users size={15} className={recipientMode === 'CONTACTS' ? 'text-emerald-600' : ''} />
                    <span>Select from existing contacts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientMode('EXCEL')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      recipientMode === 'EXCEL'
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet size={15} className={recipientMode === 'EXCEL' ? 'text-emerald-600' : ''} />
                    <span>Import from Excel</span>
                    {importedRecipients.length > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full ml-1 font-bold">
                        {importedRecipients.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════ */}
              {/* MODE 1: SELECT FROM EXISTING CONTACTS                      */}
              {/* ════════════════════════════════════════════════════════════ */}
              {recipientMode === 'CONTACTS' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Target Audience Stage
                    </label>
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
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* MODE 2: IMPORT FROM EXCEL                                   */}
              {/* ════════════════════════════════════════════════════════════ */}
              {recipientMode === 'EXCEL' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {excelError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-start gap-2">
                      <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>{excelError}</span>
                    </div>
                  )}

                  {/* Excel Upload Zone if no confirmed recipients */}
                  {importedRecipients.length === 0 && !isExcelPreviewOpen && (
                    <div className="p-6 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-3xl bg-slate-50/70 hover:bg-emerald-50/30 text-center transition-all">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx,.xls,.csv"
                        onChange={handleExcelFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                        <Upload size={22} />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 mb-1">
                        Upload Excel or CSV File
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3 max-w-xs mx-auto leading-relaxed">
                        Upload a file (.xlsx, .xls, .csv). Required column: <strong>Phone Number</strong>. Optional: Name, Email, Tags.
                      </p>
                      
                      <button
                        type="button"
                        disabled={isParsingExcel}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isParsingExcel ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Parsing File...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Select Excel File</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* IMPORT PREVIEW TABLE                                         */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  {isExcelPreviewOpen && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet size={18} className="text-emerald-600" />
                          <div>
                            <h4 className="text-xs font-black text-slate-900">Import Contacts Preview</h4>
                            <p className="text-[10px] text-slate-500">{excelPreviewRows.length} contacts found in file</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExcelPreviewOpen(false);
                            setExcelFile(null);
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                        >
                          Change File
                        </button>
                      </div>

                      {/* Stat Badges */}
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Found</span>
                          <span className="text-sm font-black text-slate-900">{excelPreviewRows.length}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                          <span className="text-[9px] text-emerald-700 font-extrabold block uppercase">✓ Valid</span>
                          <span className="text-sm font-black text-emerald-700">
                            {excelPreviewRows.filter(r => r.status === 'VALID').length}
                          </span>
                        </div>
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center">
                          <span className="text-[9px] text-amber-700 font-extrabold block uppercase">⚠ Dupes / Invalid</span>
                          <span className="text-sm font-black text-amber-700">
                            {excelPreviewRows.filter(r => r.status !== 'VALID').length}
                          </span>
                        </div>
                      </div>

                      {/* Preview Rows Table */}
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar border border-slate-200 rounded-xl bg-white">
                        <div className="grid grid-cols-12 px-3 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200 sticky top-0 z-10">
                          <span className="col-span-4">Name</span>
                          <span className="col-span-4">Phone Number</span>
                          <span className="col-span-3">Status</span>
                          <span className="col-span-1 text-center">Action</span>
                        </div>
                        {excelPreviewRows.map((r) => (
                          <div key={r.id} className="grid grid-cols-12 px-3 py-2 items-center border-b border-slate-100 text-xs text-slate-800">
                            <span className="col-span-4 font-bold truncate pr-1">{r.name}</span>
                            <span className="col-span-4 font-mono text-slate-600 truncate pr-1">{r.phone}</span>
                            <span className="col-span-3 pr-1">
                              {r.status === 'VALID' && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                                  ✓ Valid
                                </span>
                              )}
                              {r.status === 'DUPLICATE' && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 inline-block" title={r.reason}>
                                  ⚠ Duplicate
                                </span>
                              )}
                              {r.status === 'INVALID' && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 inline-block" title={r.reason}>
                                  ❌ Invalid
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePreviewRow(r.id)}
                              className="col-span-1 p-1 text-slate-400 hover:text-rose-600 rounded flex justify-center cursor-pointer"
                              title="Remove row"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsExcelPreviewOpen(false);
                            setExcelFile(null);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={confirmExcelImport}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check size={14} />
                          <span>Import Recipients ({excelPreviewRows.filter(r => r.status === 'VALID').length})</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* BROADCAST RECIPIENT LIST (AFTER IMPORT)                      */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  {importedRecipients.length > 0 && !isExcelPreviewOpen && (
                    <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="text-emerald-700" size={18} />
                          <div>
                            <h4 className="text-xs font-black text-slate-900">
                              Recipients ({importedRecipients.length} contacts)
                            </h4>
                            <p className="text-[10px] text-emerald-800 font-medium">
                              Ready for this WhatsApp broadcast only
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImportedRecipients([]);
                            setIsExcelPreviewOpen(false);
                            setExcelFile(null);
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
                        >
                          Clear / Re-import
                        </button>
                      </div>

                      <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar bg-white p-2 rounded-xl border border-emerald-200/60 divide-y divide-slate-100">
                        {importedRecipients.slice(0, 30).map((r, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 px-2 text-xs">
                            <span className="font-bold text-slate-800 truncate pr-2">{r.name}</span>
                            <span className="font-mono text-slate-500 text-[11px] shrink-0">{r.displayPhone || r.phone}</span>
                          </div>
                        ))}
                        {importedRecipients.length > 30 && (
                          <div className="text-[10px] font-bold text-slate-400 text-center pt-2 italic">
                            + {importedRecipients.length - 30} more contacts imported
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* IMPORTANT WHATSAPP NOTICE                                    */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 font-medium leading-relaxed flex items-start gap-2">
                    <Info size={15} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Numbers imported here are used for sending through UWO Connect. They are not automatically saved to the recipient’s phone or WhatsApp contact list.
                    </span>
                  </div>

                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Broadcast Channel
                </label>
                <div className="p-3.5 rounded-2xl border border-[#00AB56] bg-emerald-50/50 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00AB56]/15 flex items-center justify-center text-[#00AB56] font-black text-sm">
                      WA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">WhatsApp Cloud API</span>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Meta Policy: Outbound marketing broadcasts are delivered exclusively via WhatsApp
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-[#00AB56] text-[11px] font-extrabold">
                    <Check size={13} strokeWidth={3} />
                    <span>Official</span>
                  </div>
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
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Meta WhatsApp Outbound Policy:</span>
                      Custom text messages only deliver to contacts who interacted in the last 24 hours. For cold leads or recipients outside the 24h window, Meta requires using an <strong>Approved Meta Template</strong>.
                    </div>
                  </div>

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
                        {messageBody.replace("{{first_name}}", "Rahul").replace("{{name}}", "Rahul Sharma").replace("{{company}}", "UWO Connect")}
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

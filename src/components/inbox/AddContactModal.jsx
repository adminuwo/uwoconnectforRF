'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, UserPlus, FileSpreadsheet, Check, AlertCircle, 
  Loader2, Phone, Mail, Building, Tag, FileText, 
  Upload, Info, CheckCircle2, ShieldAlert, Users, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function AddContactModal({
  isOpen,
  onClose,
  prefilledPhone = '',
  prefilledName = '',
  convoId = null,
  existingContacts = [],
  onContactSaved
}) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'excel'

  // Manual Form State
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    company: '',
    tags: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');

  // Excel Import State
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importPreview, setImportPreview] = useState(null); // { total: 0, valid: [], invalid: [] }
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importSummary, setImportSummary] = useState(null);
  const [excelError, setExcelError] = useState('');
  const fileInputRef = useRef(null);

  // Initialize prefilled values when modal opens
  useEffect(() => {
    if (isOpen) {
      // Clean phone number (strip whitespace or non-digit chars if any)
      const cleanPhone = prefilledPhone || '';
      const initialName = prefilledName && prefilledName !== prefilledPhone ? prefilledName : '';

      setFormData({
        name: initialName,
        phone_number: cleanPhone,
        email: '',
        company: '',
        tags: 'WhatsApp Lead',
        notes: convoId ? `Added from Inbox Conversation #${convoId}` : ''
      });

      setManualError('');
      setManualSuccess('');
      setFile(null);
      setImportPreview(null);
      setImportSummary(null);
      setExcelError('');
      setActiveTab('manual');
    }
  }, [isOpen, prefilledPhone, prefilledName, convoId]);

  if (!isOpen) return null;

  const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  // Check if phone number already exists in DB or pre-loaded contacts
  const checkPhoneDuplicate = (phone) => {
    if (!phone) return false;
    const cleanP = phone.replace(/[^0-9]/g, '');
    if (!cleanP) return false;

    return existingContacts.some(c => {
      const cP = (c.phone_number || c.phone || c.rawAddress || '').replace(/[^0-9]/g, '');
      return cP && cP.length >= 7 && (cP.endsWith(cleanP) || cleanP.endsWith(cP));
    });
  };

  // ---------------------------------------------------------------------------
  // OPTION 1: MANUALLY SAVE CONTACT
  // ---------------------------------------------------------------------------
  const handleManualSave = async (e) => {
    e.preventDefault();
    setManualError('');
    setManualSuccess('');

    if (!formData.name.trim()) {
      setManualError('Full Name is required.');
      return;
    }
    if (!formData.phone_number.trim()) {
      setManualError('Phone Number is required.');
      return;
    }

    // Duplicate check
    if (checkPhoneDuplicate(formData.phone_number)) {
      setManualError(`A contact with phone number (${formData.phone_number}) already exists in UWO Connect. Duplicate contact creation was prevented.`);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        platform_id: formData.phone_number.trim(),
        email: formData.email.trim() || undefined,
        company: formData.company.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        notes: formData.notes.trim() || undefined,
        preferred_channel: 'WHATSAPP'
      };

      const res = await axios.post(`${API_BASE_URL}/api/contacts/`, payload, {
        headers: getAuthHeader()
      });

      const savedContact = res.data || payload;
      setManualSuccess(`✓ Contact "${savedContact.name}" saved successfully and linked to Inbox!`);

      if (onContactSaved) {
        onContactSaved(savedContact, convoId);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to save contact:', err);
      const msg = err.response?.data?.message || err.response?.data?.phone_number?.[0] || 'Failed to save contact. Please check details.';
      setManualError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // OPTION 2: IMPORT CONTACTS FROM EXCEL / CSV
  // ---------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith('.csv') && !name.endsWith('.xlsx') && !name.endsWith('.xls')) {
      setExcelError('Please select a valid Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    setFile(selectedFile);
    setExcelError('');
    setImportSummary(null);
    parseUploadedFile(selectedFile);
  };

  const parseUploadedFile = async (uploadedFile) => {
    setIsParsing(true);
    setImportPreview(null);
    setExcelError('');

    try {
      const text = await uploadedFile.text();
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);

      if (lines.length <= 1) {
        setExcelError('File is empty or contains only header row.');
        setIsParsing(false);
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('number'));
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
      const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('org') || h.includes('business'));
      const tagsIdx = headers.findIndex(h => h.includes('tag'));
      const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('remark'));

      const validRows = [];
      const invalidRows = [];
      const seenPhonesInFile = new Set();

      for (let i = 1; i < lines.length; i++) {
        // Handle CSV comma quotes
        const rawRow = lines[i];
        const cols = rawRow.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^["']|["']$/g, ''));
        
        const rawPhone = phoneIdx !== -1 ? cols[phoneIdx] : (cols[1] || cols[0]);
        const rawName = nameIdx !== -1 ? cols[nameIdx] : cols[0];
        const rawEmail = emailIdx !== -1 ? cols[emailIdx] : '';
        const rawCompany = companyIdx !== -1 ? cols[companyIdx] : '';
        const rawTags = tagsIdx !== -1 ? cols[tagsIdx] : '';
        const rawNotes = notesIdx !== -1 ? cols[notesIdx] : '';

        const cleanPhone = (rawPhone || '').replace(/[^0-9+]/g, '');

        if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 7) {
          invalidRows.push({
            row: i + 1,
            name: rawName || 'Unknown',
            phone: rawPhone || 'Missing',
            reason: 'Missing or invalid phone number'
          });
          continue;
        }

        const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
        if (seenPhonesInFile.has(phoneDigits)) {
          invalidRows.push({
            row: i + 1,
            name: rawName || 'Duplicate',
            phone: cleanPhone,
            reason: 'Duplicate number inside Excel file'
          });
          continue;
        }

        if (checkPhoneDuplicate(cleanPhone)) {
          invalidRows.push({
            row: i + 1,
            name: rawName || 'Existing Contact',
            phone: cleanPhone,
            reason: 'Already exists in UWO Connect'
          });
          continue;
        }

        seenPhonesInFile.add(phoneDigits);
        validRows.push({
          row: i + 1,
          name: rawName || `Contact ${cleanPhone}`,
          phone_number: cleanPhone,
          email: rawEmail,
          company: rawCompany,
          tags: rawTags ? rawTags.split(';').join(', ') : '',
          notes: rawNotes
        });
      }

      setImportPreview({
        total: lines.length - 1,
        valid: validRows,
        invalid: invalidRows
      });
    } catch (err) {
      console.error('File parse error:', err);
      setExcelError('Failed to parse file. Please ensure it is a valid CSV or Excel export file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleBulkImport = async () => {
    if (!importPreview || importPreview.valid.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);
    setExcelError('');

    const totalValid = importPreview.valid.length;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < totalValid; i++) {
      const c = importPreview.valid[i];
      try {
        await axios.post(`${API_BASE_URL}/api/contacts/`, {
          name: c.name,
          phone_number: c.phone_number,
          platform_id: c.phone_number,
          email: c.email || undefined,
          company: c.company || undefined,
          tags: c.tags ? c.tags.split(',').map(t => t.trim()).filter(Boolean) : ['Excel Import'],
          notes: c.notes || undefined,
          preferred_channel: 'WHATSAPP'
        }, { headers: getAuthHeader() });

        successCount++;
      } catch (err) {
        failCount++;
      }
      setImportProgress(Math.round(((i + 1) / totalValid) * 100));
    }

    setImportSummary({
      total: importPreview.total,
      successCount,
      failCount: failCount + importPreview.invalid.length,
      invalidCount: importPreview.invalid.length
    });

    setIsImporting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={cn(
        "rounded-3xl shadow-2xl border w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200",
        isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      )}>
        
        {/* Modal Header */}
        <div className={cn(
          "px-6 py-4 border-b flex items-center justify-between shrink-0 transition-colors",
          isDark ? "border-slate-800 bg-slate-800/60" : "border-slate-100 bg-slate-50/70"
        )}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className={cn("text-base font-black", isDark ? "text-white" : "text-slate-900")}>Add Contact</h3>
              <p className={cn("text-[11px] font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Save customer details to UWO Connect CRM &amp; Inbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-xl transition-all cursor-pointer",
              isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 shrink-0">
          <div className={cn(
            "flex items-center gap-2 p-1 rounded-2xl border transition-colors",
            isDark ? "bg-slate-800/80 border-slate-700/80" : "bg-slate-100/80 border-slate-200/60"
          )}>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'manual'
                  ? isDark 
                    ? "bg-slate-900 text-emerald-400 shadow-xs border border-slate-700 font-extrabold"
                    : "bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              )}
            >
              <UserPlus size={15} className={activeTab === 'manual' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : ''} />
              <span>Manually Add Contact</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'excel'
                  ? isDark
                    ? "bg-slate-900 text-emerald-400 shadow-xs border border-slate-700 font-extrabold"
                    : "bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              )}
            >
              <FileSpreadsheet size={15} className={activeTab === 'excel' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : ''} />
              <span>Import from Excel</span>
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: MANUALLY ADD CONTACT                                     */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSave} className="space-y-4">
              
              {manualError && (
                <div className={cn(
                  "p-3.5 border rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-2xs",
                  isDark ? "bg-rose-950/50 border-rose-800/60 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"
                )}>
                  <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{manualError}</span>
                </div>
              )}

              {manualSuccess && (
                <div className={cn(
                  "p-3.5 border rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs",
                  isDark ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                )}>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{manualSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className={cn("block text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn(
                        "w-full pl-3.5 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all border",
                        isDark 
                          ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1 sm:col-span-2">
                  <label className={cn("block text-xs font-bold flex items-center justify-between", isDark ? "text-slate-300" : "text-slate-700")}>
                    <span>Phone Number <span className="text-rose-500">*</span></span>
                    {prefilledPhone && (
                      <span className={cn(
                        "text-[10px] font-extrabold px-2 py-0.5 rounded border",
                        isDark ? "text-emerald-300 bg-emerald-950/60 border-emerald-800/60" : "text-emerald-700 bg-emerald-50 border-emerald-200"
                      )}>
                        Pre-filled from WhatsApp
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Phone className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} size={14} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98200XXXXX"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className={cn(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all font-mono border",
                        isDark 
                          ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className={cn("block text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>Email Address</label>
                  <div className="relative">
                    <Mail className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} size={14} />
                    <input
                      type="email"
                      placeholder="e.g. rohan@acme.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all border",
                        isDark 
                          ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1">
                  <label className={cn("block text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>Company</label>
                  <div className="relative">
                    <Building className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Acme Innovations"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={cn(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all border",
                        isDark 
                          ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1 sm:col-span-2">
                  <label className={cn("block text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>Tags (comma separated)</label>
                  <div className="relative">
                    <Tag className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Growth Plan, Lead, High Priority"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className={cn(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all border",
                        isDark 
                          ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className={cn("block text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Add optional internal notes about this contact..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={cn(
                      "w-full p-3 rounded-xl text-xs font-medium outline-none transition-all border",
                      isDark 
                        ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-900 focus:border-emerald-500" 
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500"
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={cn("pt-3 flex items-center justify-end gap-3 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                    isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Saving Contact...</span>
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      <span>Save Contact</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: IMPORT CONTACTS FROM EXCEL                              */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              
              {excelError && (
                <div className={cn(
                  "p-3.5 border rounded-2xl text-xs font-semibold flex items-start gap-2.5",
                  isDark ? "bg-rose-950/50 border-rose-800/60 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"
                )}>
                  <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{excelError}</span>
                </div>
              )}

              {/* File Upload Zone */}
              {!importPreview && !importSummary && (
                <div className={cn(
                  "p-8 border-2 border-dashed rounded-3xl text-center transition-all",
                  isDark 
                    ? "border-slate-700 hover:border-emerald-500 bg-slate-800/40 hover:bg-emerald-950/20" 
                    : "border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30"
                )}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className={cn(
                    "w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-xs",
                    isDark ? "bg-slate-800 border-slate-700 text-emerald-400" : "bg-white border-slate-200 text-emerald-600"
                  )}>
                    <Upload size={24} />
                  </div>
                  <h4 className={cn("text-sm font-extrabold mb-1", isDark ? "text-white" : "text-slate-800")}>
                    Upload Excel or CSV File
                  </h4>
                  <p className={cn("text-xs mb-4 max-w-sm mx-auto leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                    Upload an Excel (.xlsx, .xls) or CSV file containing your contact list. Required column: <strong>Phone Number</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Select Excel / CSV File</span>
                  </button>

                  <div className={cn("mt-4 pt-4 border-t text-[10px] font-mono", isDark ? "border-slate-800 text-slate-500" : "border-slate-200/60 text-slate-400")}>
                    Supported columns: Name, Phone Number *, Email, Company, Tags, Notes
                  </div>
                </div>
              )}

              {/* File Parsing Loading */}
              {isParsing && (
                <div className="py-12 text-center space-y-3">
                  <Loader2 size={32} className="animate-spin text-emerald-500 mx-auto" />
                  <p className={cn("text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>Validating &amp; Parsing Excel file...</p>
                </div>
              )}

              {/* Import Preview Card */}
              {importPreview && !importSummary && (
                <div className="space-y-4">
                  <div className={cn(
                    "p-5 rounded-2xl border space-y-3",
                    isDark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"
                  )}>
                    <div className="flex items-center justify-between">
                      <h4 className={cn("text-sm font-black flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                        <FileSpreadsheet size={16} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                        <span>Import Contacts Preview</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setImportPreview(null);
                          setFile(null);
                        }}
                        className={cn("text-[11px] font-bold hover:underline", isDark ? "text-slate-400" : "text-slate-500")}
                      >
                        Change File
                      </button>
                    </div>

                    {/* Preview Stats Badge Strip */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className={cn(
                        "p-3 rounded-xl border text-center",
                        isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                      )}>
                        <span className={cn("text-[10px] font-bold block uppercase", isDark ? "text-slate-400" : "text-slate-400")}>Total Found</span>
                        <span className={cn("text-base font-black", isDark ? "text-white" : "text-slate-900")}>{importPreview.total}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl border text-center",
                        isDark ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      )}>
                        <span className="text-[10px] font-extrabold block uppercase">✓ Ready</span>
                        <span className="text-base font-black">{importPreview.valid.length}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl border text-center",
                        isDark ? "bg-amber-950/50 border-amber-800/60 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700"
                      )}>
                        <span className="text-[10px] font-extrabold block uppercase">⚠ Invalid / Dupes</span>
                        <span className="text-base font-black">{importPreview.invalid.length}</span>
                      </div>
                    </div>

                    {/* Invalid / Flagged Rows Notice */}
                    {importPreview.invalid.length > 0 && (
                      <div className={cn(
                        "mt-3 p-3 rounded-xl border text-xs space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar",
                        isDark ? "bg-amber-950/40 border-amber-800/60" : "bg-amber-50/80 border-amber-200"
                      )}>
                        <div className={cn("font-bold flex items-center gap-1.5", isDark ? "text-amber-300" : "text-amber-900")}>
                          <AlertCircle size={14} className={isDark ? "text-amber-400" : "text-amber-600"} />
                          <span>Flagged Rows ({importPreview.invalid.length} skipped):</span>
                        </div>
                        {importPreview.invalid.slice(0, 5).map((inv, idx) => (
                          <div key={idx} className={cn(
                            "text-[11px] flex justify-between gap-2 border-b pb-1",
                            isDark ? "text-amber-200/90 border-amber-800/50" : "text-amber-800 border-amber-200/50"
                          )}>
                            <span>Row {inv.row}: {inv.name} ({inv.phone})</span>
                            <span className="font-semibold italic">{inv.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar during Import */}
                  {isImporting && (
                    <div className="space-y-2 py-2">
                      <div className={cn("flex justify-between text-xs font-bold", isDark ? "text-slate-300" : "text-slate-700")}>
                        <span>Importing contacts into UWO Connect...</span>
                        <span className="text-emerald-500">{importProgress}%</span>
                      </div>
                      <div className={cn("h-2.5 w-full rounded-full overflow-hidden border", isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200")}>
                        <div 
                          className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={cn("pt-2 flex items-center justify-end gap-3 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
                    <button
                      type="button"
                      disabled={isImporting}
                      onClick={onClose}
                      className={cn(
                        "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                        isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isImporting || importPreview.valid.length === 0}
                      onClick={handleBulkImport}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Importing ({importProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          <span>Import {importPreview.valid.length} Contacts</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Final Import Completion Summary */}
              {importSummary && (
                <div className={cn(
                  "p-6 rounded-2xl border text-center space-y-4 animate-in fade-in",
                  isDark ? "bg-emerald-950/40 border-emerald-800/60" : "bg-emerald-50 border-emerald-200"
                )}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className={cn("text-base font-black", isDark ? "text-white" : "text-slate-900")}>
                      Import Completed Successfully!
                    </h4>
                    <p className={cn("text-xs mt-1", isDark ? "text-slate-300" : "text-slate-600")}>
                      {importSummary.successCount} valid contacts have been imported and saved to UWO Connect.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs font-bold">
                    <span className={isDark ? "text-emerald-300" : "text-emerald-800"}>✓ {importSummary.successCount} Imported</span>
                    {importSummary.invalidCount > 0 && (
                      <span className={isDark ? "text-amber-300" : "text-amber-800"}>⚠ {importSummary.invalidCount} Skipped</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* IMPORTANT WHATSAPP NOTICE DISCLAIMER                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className={cn("px-6 py-3 border-t shrink-0", isDark ? "bg-slate-800/70 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200/80 text-slate-500")}>
          <div className="flex items-start gap-2 text-[11px] font-medium leading-tight">
            <Info size={14} className={cn("shrink-0 mt-0.5", isDark ? "text-slate-400" : "text-slate-400")} />
            <span>
              Saving a contact here stores it in UWO Connect. It does NOT automatically save the number to the customer's phone or WhatsApp contacts.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

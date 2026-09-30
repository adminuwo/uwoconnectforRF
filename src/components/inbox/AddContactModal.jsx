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

export default function AddContactModal({
  isOpen,
  onClose,
  prefilledPhone = '',
  prefilledName = '',
  convoId = null,
  existingContacts = [],
  onContactSaved
}) {
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
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Add Contact</h3>
              <p className="text-[11px] text-slate-500 font-medium">Save customer details to UWO Connect CRM &amp; Inbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 shrink-0">
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'manual'
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <UserPlus size={15} className={activeTab === 'manual' ? 'text-emerald-600' : ''} />
              <span>Manually Add Contact</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeTab === 'excel'
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <FileSpreadsheet size={15} className={activeTab === 'excel' ? 'text-emerald-600' : ''} />
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
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-start gap-2.5 shadow-2xs">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{manualError}</span>
                </div>
              )}

              {manualSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{manualSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-3.5 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Phone Number <span className="text-rose-500">*</span></span>
                    {prefilledPhone && (
                      <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Pre-filled from WhatsApp
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98200XXXXX"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="email"
                      placeholder="e.g. rohan@acme.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Acme Innovations"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">Tags (comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Growth Plan, Lead, High Priority"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Add optional internal notes about this contact..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
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
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-start gap-2.5">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{excelError}</span>
                </div>
              )}

              {/* File Upload Zone */}
              {!importPreview && !importSummary && (
                <div className="p-8 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-3xl bg-slate-50/60 hover:bg-emerald-50/30 text-center transition-all">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Upload size={24} />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-1">
                    Upload Excel or CSV File
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto leading-relaxed">
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

                  <div className="mt-4 pt-4 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
                    Supported columns: Name, Phone Number *, Email, Company, Tags, Notes
                  </div>
                </div>
              )}

              {/* File Parsing Loading */}
              {isParsing && (
                <div className="py-12 text-center space-y-3">
                  <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Validating &amp; Parsing Excel file...</p>
                </div>
              )}

              {/* Import Preview Card */}
              {importPreview && !importSummary && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-emerald-600" />
                        <span>Import Contacts Preview</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setImportPreview(null);
                          setFile(null);
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:underline"
                      >
                        Change File
                      </button>
                    </div>

                    {/* Preview Stats Badge Strip */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Found</span>
                        <span className="text-base font-black text-slate-900">{importPreview.total}</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                        <span className="text-[10px] text-emerald-700 font-extrabold block uppercase">✓ Ready</span>
                        <span className="text-base font-black text-emerald-700">{importPreview.valid.length}</span>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                        <span className="text-[10px] text-amber-700 font-extrabold block uppercase">⚠ Invalid / Dupes</span>
                        <span className="text-base font-black text-amber-700">{importPreview.invalid.length}</span>
                      </div>
                    </div>

                    {/* Invalid / Flagged Rows Notice */}
                    {importPreview.invalid.length > 0 && (
                      <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-amber-600 shrink-0" />
                          <span>Flagged Rows ({importPreview.invalid.length} skipped):</span>
                        </div>
                        {importPreview.invalid.slice(0, 5).map((inv, idx) => (
                          <div key={idx} className="text-[11px] text-amber-800 flex justify-between gap-2 border-b border-amber-200/50 pb-1">
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
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Importing contacts into UWO Connect...</span>
                        <span className="text-emerald-700">{importProgress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isImporting}
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
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
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Import Completed Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {importSummary.successCount} valid contacts have been imported and saved to UWO Connect.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs font-bold">
                    <span className="text-emerald-800">✓ {importSummary.successCount} Imported</span>
                    {importSummary.invalidCount > 0 && (
                      <span className="text-amber-800">⚠ {importSummary.invalidCount} Skipped</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm"
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
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 shrink-0">
          <div className="flex items-start gap-2 text-[11px] text-slate-500 font-medium leading-tight">
            <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              Saving a contact here stores it in UWO Connect. It does NOT automatically save the number to the customer's phone or WhatsApp contacts.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

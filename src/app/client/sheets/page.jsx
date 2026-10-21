'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Search, Plus, Sparkles, ExternalLink, RefreshCw, 
  Trash2, Eye, Clock, AlertCircle, CheckCircle2, 
  X, Loader2, ArrowRight, Table, ChevronRight, Link2, PlusCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleAICommanderModal from '@/components/dashboard/GoogleAICommanderModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function GoogleSheetsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  
  // Modals & Drawers
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [activeTabName, setActiveTabName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAppendRowOpen, setIsAppendRowOpen] = useState(false);
  const [isAICommanderOpen, setIsAICommanderOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  // New Spreadsheet Form
  const [newTitle, setNewTitle] = useState('');
  const [newHeaders, setNewHeaders] = useState('Name, Email, Phone, Status, Value');
  const [creating, setCreating] = useState(false);

  // Append Row Form
  const [rowValues, setRowValues] = useState('');
  const [appendingRow, setAppendingRow] = useState(false);

  // AI Builder States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatusAndSheets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-sheets/status/`, { headers: getHeaders() });
      if (res.data?.connected) {
        setIsConnected(true);
        setAccountEmail(res.data.email || 'Connected');
        fetchSheetsList();
      } else {
        setIsConnected(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load Google Sheets status:', err);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const fetchSheetsList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-sheets/list`, { headers: getHeaders() });
      setSpreadsheets(res.data?.spreadsheets || []);
    } catch (err) {
      console.error('Failed to fetch spreadsheets list:', err);
      showToast('Could not load Google Sheets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndSheets();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE_URL}/api/google-sheets/sync/`, {}, { headers: getHeaders() });
      await fetchSheetsList();
      showToast('Spreadsheets synced with Google Drive');
    } catch (err) {
      showToast('Sync failed. Please check connection.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-sheets/connect/`, { headers: getHeaders() });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
      }
    } catch (err) {
      showToast('Failed to start Google Sheets connection', 'error');
    }
  };

  const handleCreateSheet = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const headersList = newHeaders
        ? newHeaders.split(',').map(h => h.trim()).filter(Boolean)
        : [];

      const res = await axios.post(
        `${API_BASE_URL}/api/google-sheets/create-sheet`,
        { 
          title: newTitle.trim(),
          headers: headersList
        },
        { headers: getHeaders() }
      );
      if (res.data?.spreadsheet_id) {
        showToast('Spreadsheet created in Google Sheets!');
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewHeaders('Name, Email, Phone, Status, Value');
        fetchSheetsList();
      } else {
        showToast(res.data?.error || 'Failed to create spreadsheet', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error creating spreadsheet', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenSheet = async (sheet) => {
    setSelectedSheet(sheet);
    setSheetLoading(true);
    try {
      const id = sheet.id || sheet.spreadsheet_id;
      const res = await axios.get(
        `${API_BASE_URL}/api/google-sheets/detail?spreadsheet_id=${id}`,
        { headers: getHeaders() }
      );
      setSheetData(res.data?.spreadsheet || null);
      if (res.data?.spreadsheet?.sheets?.length > 0) {
        setActiveTabName(res.data.spreadsheet.sheets[0].title);
      }
    } catch (err) {
      console.error('Failed to load spreadsheet detail:', err);
      showToast('Could not load spreadsheet data from Google Sheets', 'error');
    } finally {
      setSheetLoading(false);
    }
  };

  const handleAppendRow = async (e) => {
    e.preventDefault();
    if (!selectedSheet || !rowValues.trim()) return;
    setAppendingRow(true);
    try {
      const id = selectedSheet.id || selectedSheet.spreadsheet_id;
      const values = rowValues.split(',').map(v => v.trim());

      const res = await axios.post(
        `${API_BASE_URL}/api/google-sheets/append-row/`,
        {
          spreadsheet_id: id,
          range: activeTabName ? `'${activeTabName}'!A1` : 'Sheet1!A1',
          values: values,
        },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('Row added to Google Sheet!');
        setIsAppendRowOpen(false);
        setRowValues('');
        handleOpenSheet(selectedSheet);
      } else {
        showToast(res.data?.error || 'Failed to append row', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error appending row', 'error');
    } finally {
      setAppendingRow(false);
    }
  };

  const handleDeleteSheet = async (item) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/google-sheets/delete`,
        { spreadsheet_id: item.id || item.spreadsheet_id },
        { headers: getHeaders() }
      );
      showToast('Spreadsheet moved to trash in Google Drive');
      setDeleteConfirmItem(null);
      if (selectedSheet?.id === item.id) {
        setSelectedSheet(null);
      }
      fetchSheetsList();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to delete spreadsheet', 'error');
    }
  };

  const handleAIGenerateSheet = async () => {
    if (!aiPrompt.trim() || aiGenerating) return;
    setAiGenerating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-sheets/ai-generate`,
        { prompt: aiPrompt.trim() },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('AI Spreadsheet generated in Google Sheets!');
        setIsAIModalOpen(false);
        setAiPrompt('');
        fetchSheetsList();
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        }
      } else {
        showToast(res.data?.error || 'AI generation failed', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to generate spreadsheet', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const filtered = spreadsheets.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (s.title || s.name || '').toLowerCase().includes(q);
  });

  const currentTab = sheetData?.sheets?.find(s => s.title === activeTabName) || sheetData?.sheets?.[0];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div className={cn(
            "fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200",
            toast.type === 'error' 
              ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800" 
              : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
          )}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Google Sheets
                </h1>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {accountEmail}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live spreadsheet synchronization, tabular data browser, and AI sheet generation
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAICommanderOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles size={14} />
              <span>Workspace AI</span>
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>AI Sheet Builder</span>
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Sync with Google"
                >
                  <RefreshCw size={15} className={cn(syncing && "animate-spin text-emerald-600")} />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={15} />
                  <span>New Spreadsheet</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disconnected State Hero */}
        {!isConnected && !loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
              <FileSpreadsheet size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Connect your Google Sheets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Sync CRM leads, orders, transactions, and performance metrics automatically into Google Sheets, preview live cells, and generate formula-powered spreadsheets with AI.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 size={16} />
                <span>Connect Google Sheets Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Connected Workspace */}
        {isConnected && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spreadsheets..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center text-xs text-slate-500">
                <span>{filtered.length} spreadsheet{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Spreadsheets Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading Google spreadsheets...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mx-auto flex items-center justify-center">
                  <FileSpreadsheet size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No spreadsheets found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create a new spreadsheet or use the AI Sheet Builder to auto-generate formatted tracking sheets.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles size={13} />
                    <span>Create with AI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const id = item.id || item.spreadsheet_id;
                  const title = item.title || item.name || 'Untitled Spreadsheet';
                  const mod = item.modified_time ? new Date(item.modified_time).toLocaleDateString() : 'Recently';

                  return (
                    <div
                      key={id}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 p-5 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div className="space-y-3">
                        {/* Table mockup preview */}
                        <div 
                          onClick={() => handleOpenSheet(item)}
                          className="h-28 rounded-xl bg-emerald-50/40 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 p-2.5 flex flex-col justify-between cursor-pointer group-hover:scale-[1.01] transition-transform"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Table size={11} /> Sheets Table
                            </span>
                            <Eye size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          </div>

                          {/* Mini grid rows */}
                          <div className="grid grid-cols-3 gap-1 py-1">
                            <div className="h-2 rounded bg-emerald-200/60 dark:bg-emerald-900/60" />
                            <div className="h-2 rounded bg-emerald-200/60 dark:bg-emerald-900/60" />
                            <div className="h-2 rounded bg-emerald-200/60 dark:bg-emerald-900/60" />
                            <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Google Sheets</span>
                            <span>{mod}</span>
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <h3 
                            onClick={() => handleOpenSheet(item)}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer line-clamp-1 transition-colors"
                          >
                            {title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <Clock size={12} />
                            <span>Modified {mod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenSheet(item)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                          >
                            View Data
                          </button>
                        </div>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Spreadsheet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Spreadsheet Data Grid View Modal */}
        {selectedSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileSpreadsheet size={18} className="text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {selectedSheet.title || selectedSheet.name || 'Spreadsheet View'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAppendRowOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle size={13} />
                    <span>Append Row</span>
                  </button>
                  {selectedSheet.url && (
                    <a
                      href={selectedSheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink size={13} />
                      <span>Google Sheets</span>
                    </a>
                  )}
                  <button onClick={() => setSelectedSheet(null)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Sheet Tab Switcher */}
              {sheetData?.sheets && sheetData.sheets.length > 1 && (
                <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-x-auto">
                  {sheetData.sheets.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => setActiveTabName(s.title)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                        activeTabName === s.title
                          ? "bg-emerald-600 text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Modal Body / Table Data */}
              <div className="p-4 overflow-auto flex-1">
                {sheetLoading ? (
                  <div className="py-24 text-center">
                    <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Loading cell rows from Google Sheets API...</p>
                  </div>
                ) : !currentTab || !currentTab.data || currentTab.data.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-400">
                    No cell data in this sheet tab. Click &quot;Append Row&quot; to add rows.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
                      <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                          {currentTab.data[0].map((header, colIdx) => (
                            <th key={colIdx} className="py-2.5 px-3 font-semibold">
                              {header || `Col ${colIdx + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentTab.data.slice(1).map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-2 px-3 text-center text-[10px] text-slate-400 font-mono">
                              {rowIdx + 1}
                            </td>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 truncate max-w-xs">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Append Row Modal */}
        {isAppendRowOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <PlusCircle size={16} className="text-emerald-600" />
                  Append Row to Sheet
                </h3>
                <button onClick={() => setIsAppendRowOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAppendRow} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Comma-separated Values *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rowValues}
                    onChange={(e) => setRowValues(e.target.value)}
                    placeholder="e.g. John Doe, john@example.com, +1234567890, Qualified, $4500"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Values will be mapped column-by-column into the next empty row.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAppendRowOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={appendingRow}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {appendingRow ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Append Row</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Spreadsheet Builder Modal */}
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI Spreadsheet Builder
                  </h3>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Describe the spreadsheet structure you need. AI will design optimal column headers, data types, and initial sample records, then create it directly in Google Sheets.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prompt / Requirement *
                  </label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Create a monthly sales pipeline tracker with columns for Lead Name, Company, Deal Size, Probability, Stage, Close Date, and Expected Revenue with 5 sample rows"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsAIModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIGenerateSheet}
                    disabled={!aiPrompt.trim() || aiGenerating}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {aiGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Generate in Google Sheets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Blank Spreadsheet Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Plus size={16} className="text-emerald-600" />
                  Create Google Spreadsheet
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSheet} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Spreadsheet Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Q4 Financial Tracker"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Column Headers (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newHeaders}
                    onChange={(e) => setNewHeaders(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Create Spreadsheet</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Spreadsheet?</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  &quot;{deleteConfirmItem.title || deleteConfirmItem.name}&quot; will be moved to trash in your connected Google Drive.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSheet(deleteConfirmItem)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Commander Modal */}
        <GoogleAICommanderModal
          isOpen={isAICommanderOpen}
          onClose={() => setIsAICommanderOpen(false)}
          onActionCompleted={() => fetchSheetsList()}
        />
      </div>
    </DashboardLayout>
  );
}

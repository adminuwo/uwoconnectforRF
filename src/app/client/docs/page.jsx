'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Sparkles, ExternalLink, RefreshCw, 
  Trash2, Eye, Clock, AlertCircle, CheckCircle2, 
  X, Loader2, ArrowRight, FilePlus, ChevronRight, Link2, BookOpen
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleAICommanderModal from '@/components/dashboard/GoogleAICommanderModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

const DOC_TEMPLATES = [
  { id: 'proposal', name: '💼 Business Proposal', desc: 'Formal client service quote and scope proposal' },
  { id: 'meeting_minutes', name: '📝 Meeting Minutes', desc: 'Executive summary, action items, and next steps' },
  { id: 'contract', name: '📜 Client Agreement', desc: 'Terms of service, milestone deliverables, and warranties' },
  { id: 'project_report', name: '📊 Project Report', desc: 'Performance milestones, metrics, and risk assessment' },
  { id: 'product_spec', name: '🚀 Product Requirements (PRD)', desc: 'Feature breakdown, target users, and user stories' },
];

export default function GoogleDocsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  
  // Modals & Drawers
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAICommanderOpen, setIsAICommanderOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

  // AI Builder States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDocType, setAiDocType] = useState('proposal');
  const [aiGenerating, setAiGenerating] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatusAndDocs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-docs/status/`, { headers: getHeaders() });
      if (res.data?.connected) {
        setIsConnected(true);
        setAccountEmail(res.data.email || 'Connected');
        fetchDocsList();
      } else {
        setIsConnected(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load Google Docs status:', err);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const fetchDocsList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-docs/list`, { headers: getHeaders() });
      setDocs(res.data?.docs || []);
    } catch (err) {
      console.error('Failed to fetch documents list:', err);
      showToast('Could not load Google Docs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndDocs();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE_URL}/api/google-docs/sync/`, {}, { headers: getHeaders() });
      await fetchDocsList();
      showToast('Documents synced with Google Drive');
    } catch (err) {
      showToast('Sync failed. Please check connection.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-docs/connect/`, { headers: getHeaders() });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
      }
    } catch (err) {
      showToast('Failed to start Google Docs connection', 'error');
    }
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-docs/create-doc/`,
        { 
          title: newTitle.trim(),
          content: newContent.trim()
        },
        { headers: getHeaders() }
      );
      if (res.data?.doc_id) {
        showToast('Document created in Google Docs!');
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewContent('');
        fetchDocsList();
      } else {
        showToast(res.data?.error || 'Failed to create document', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error creating document', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDoc = async (doc) => {
    setSelectedDoc(doc);
    setDocLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/google-docs/detail?doc_id=${doc.id || doc.doc_id}`,
        { headers: getHeaders() }
      );
      setDocContent(res.data?.content || '');
    } catch (err) {
      console.error('Failed to load document content:', err);
      setDocContent('Document content could not be read via Google API.');
    } finally {
      setDocLoading(false);
    }
  };

  const handleDeleteDoc = async (item) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/google-docs/delete`,
        { doc_id: item.id || item.doc_id },
        { headers: getHeaders() }
      );
      showToast('Document moved to trash in Google Drive');
      setDeleteConfirmItem(null);
      if (selectedDoc?.id === item.id) {
        setSelectedDoc(null);
      }
      fetchDocsList();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to delete document', 'error');
    }
  };

  const handleAIGenerateDoc = async () => {
    if (!aiPrompt.trim() || aiGenerating) return;
    setAiGenerating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-docs/ai-generate`,
        {
          prompt: aiPrompt.trim(),
          doc_type: aiDocType,
        },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('AI Document created in Google Docs!');
        setIsAIModalOpen(false);
        setAiPrompt('');
        fetchDocsList();
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        }
      } else {
        showToast(res.data?.error || 'AI generation failed', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to generate document', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const filtered = docs.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (d.title || d.name || '').toLowerCase().includes(q);
  });

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
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Google Docs
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
                Create contracts, client proposals, agreements, and AI-drafted reports
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
                  className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  <Sparkles size={13} className="text-blue-600" />
                  <span>AI Doc Builder</span>
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Sync with Google"
                >
                  <RefreshCw size={15} className={cn(syncing && "animate-spin text-blue-600")} />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={15} />
                  <span>New Document</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disconnected State Hero */}
        {!isConnected && !loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-inner">
              <FileText size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Connect your Google Docs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Auto-generate client agreements, proposals, and project documentation directly into your Google account, and manage your documents with native previews and AI drafting.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 size={16} />
                <span>Connect Google Docs Account</span>
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
                  placeholder="Search documents..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center text-xs text-slate-500">
                <span>{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading Google documents...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 mx-auto flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No documents found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create a new document or use the AI Doc Builder to auto-draft proposals, agreements, or reports.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles size={13} />
                    <span>Create with AI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const id = item.id || item.doc_id;
                  const title = item.title || item.name || 'Untitled Document';
                  const mod = item.modified_time ? new Date(item.modified_time).toLocaleDateString() : 'Recently';

                  return (
                    <div
                      key={id}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 p-5 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div className="space-y-3">
                        {/* Doc preview mockup */}
                        <div 
                          onClick={() => handleOpenDoc(item)}
                          className="h-28 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-3 flex flex-col justify-between cursor-pointer group-hover:scale-[1.01] transition-transform"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <FileText size={11} /> Document
                            </span>
                            <Eye size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="space-y-1 py-1">
                            <div className="h-1.5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-1.5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Google Docs</span>
                            <span>{mod}</span>
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <h3 
                            onClick={() => handleOpenDoc(item)}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1 transition-colors"
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
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenDoc(item)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                          >
                            Read
                          </button>
                        </div>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Document"
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

        {/* Document Content Preview Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText size={18} className="text-blue-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {selectedDoc.title || selectedDoc.name || 'Document Content'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedDoc.url && (
                    <a
                      href={selectedDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <ExternalLink size={13} />
                      <span>Edit in Google Docs</span>
                    </a>
                  )}
                  <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {docLoading ? (
                  <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-blue-600 mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Loading document content from Google API...</p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-h-[300px]">
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {docContent || '(Empty document)'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Document Builder Modal */}
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI Document Builder
                  </h3>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a document template and describe your needs. AI will draft executive-ready documents and publish directly to Google Docs.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Document Type
                    </label>
                    <select
                      value={aiDocType}
                      onChange={(e) => setAiDocType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {DOC_TEMPLATES.map(tpl => (
                        <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Prompt / Requirements *
                    </label>
                    <textarea
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Draft a 3-month WhatsApp CRM onboarding proposal for Acme Retail detailing deliverables, weekly milestones, $5,000 budget, and SLA guarantee"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsAIModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIGenerateDoc}
                    disabled={!aiPrompt.trim() || aiGenerating}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {aiGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Generate in Google Docs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Document Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Plus size={16} className="text-blue-600" />
                  Create Google Document
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateDoc} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Services Agreement"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Content (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Type initial document paragraphs..."
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
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Create Document</span>
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Google Document?</h3>
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
                  onClick={() => handleDeleteDoc(deleteConfirmItem)}
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
          onActionCompleted={() => fetchDocsList()}
        />
      </div>
    </DashboardLayout>
  );
}

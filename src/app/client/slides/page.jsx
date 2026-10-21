'use client';

import React, { useState, useEffect } from 'react';
import { 
  Presentation, Search, Plus, Sparkles, ExternalLink, RefreshCw, 
  Trash2, Eye, LayoutTemplate, Clock, AlertCircle, CheckCircle2, 
  X, Loader2, ArrowRight, Layers, FilePlus, ChevronRight, SlidersHorizontal, Link2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleAICommanderModal from '@/components/dashboard/GoogleAICommanderModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function GoogleSlidesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  
  // Modals & Drawers
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [presentationDetails, setPresentationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [isAICommanderOpen, setIsAICommanderOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  // New Presentation Form
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Add Slide Form
  const [slideTitle, setSlideTitle] = useState('');
  const [slideBullets, setSlideBullets] = useState('');
  const [addingSlide, setAddingSlide] = useState(false);

  // AI Builder States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSlideCount, setAiSlideCount] = useState(6);
  const [aiGenerating, setAiGenerating] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatusAndPresentations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-slides/status/`, { headers: getHeaders() });
      if (res.data?.connected) {
        setIsConnected(true);
        setAccountEmail(res.data.email || 'Connected');
        fetchPresentationsList();
      } else {
        setIsConnected(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load Google Slides status:', err);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const fetchPresentationsList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-slides/list`, { headers: getHeaders() });
      setPresentations(res.data?.presentations || []);
    } catch (err) {
      console.error('Failed to fetch presentations list:', err);
      showToast('Could not load presentations from Google', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndPresentations();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE_URL}/api/google-slides/sync/`, {}, { headers: getHeaders() });
      await fetchPresentationsList();
      showToast('Presentations synced with Google Drive');
    } catch (err) {
      showToast('Sync failed. Please check connection.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-slides/connect/`, { headers: getHeaders() });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
      }
    } catch (err) {
      showToast('Failed to start Google Slides connection', 'error');
    }
  };

  const handleCreatePresentation = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-slides/create-presentation/`,
        { title: newTitle.trim() },
        { headers: getHeaders() }
      );
      if (res.data?.presentation_id) {
        showToast('Presentation created in Google Slides!');
        setIsCreateModalOpen(false);
        setNewTitle('');
        fetchPresentationsList();
      } else {
        showToast(res.data?.error || 'Failed to create presentation', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error creating presentation', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDetails = async (presentation) => {
    setSelectedPresentation(presentation);
    setDetailsLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/google-slides/detail?presentation_id=${presentation.id || presentation.presentation_id}`,
        { headers: getHeaders() }
      );
      setPresentationDetails(res.data?.presentation || presentation);
    } catch (err) {
      console.error('Failed to load presentation detail:', err);
      setPresentationDetails(presentation);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!selectedPresentation) return;
    setAddingSlide(true);
    try {
      const bullets = slideBullets
        ? slideBullets.split('\n').map(b => b.trim()).filter(Boolean)
        : [];

      const res = await axios.post(
        `${API_BASE_URL}/api/google-slides/add-slide`,
        {
          presentation_id: selectedPresentation.id || selectedPresentation.presentation_id,
          title: slideTitle.trim() || 'New Slide',
          bullet_points: bullets,
        },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('Slide added to Google presentation!');
        setIsAddSlideModalOpen(false);
        setSlideTitle('');
        setSlideBullets('');
        handleOpenDetails(selectedPresentation);
      } else {
        showToast(res.data?.error || 'Failed to add slide', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error adding slide', 'error');
    } finally {
      setAddingSlide(false);
    }
  };

  const handleDeletePresentation = async (item) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/google-slides/delete`,
        { presentation_id: item.id || item.presentation_id },
        { headers: getHeaders() }
      );
      showToast('Presentation moved to trash in Google Drive');
      setDeleteConfirmItem(null);
      if (selectedPresentation?.id === item.id) {
        setSelectedPresentation(null);
      }
      fetchPresentationsList();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to delete presentation', 'error');
    }
  };

  const handleAIGenerateDeck = async () => {
    if (!aiPrompt.trim() || aiGenerating) return;
    setAiGenerating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-slides/ai-generate`,
        {
          prompt: aiPrompt.trim(),
          num_slides: aiSlideCount,
        },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('AI Pitch Deck generated in Google Slides!');
        setIsAIModalOpen(false);
        setAiPrompt('');
        fetchPresentationsList();
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        }
      } else {
        showToast(res.data?.error || 'AI generation failed', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to generate presentation', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const filtered = presentations.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (p.title || p.name || '').toLowerCase().includes(q);
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
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Presentation size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Google Slides
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
                Browse Google presentations, add slide layouts, and generate AI pitch decks
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
                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-amber-200 dark:border-amber-800"
                >
                  <Sparkles size={13} className="text-amber-600" />
                  <span>AI Deck Builder</span>
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Sync with Google"
                >
                  <RefreshCw size={15} className={cn(syncing && "animate-spin text-amber-600")} />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={15} />
                  <span>New Presentation</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disconnected State Hero */}
        {!isConnected && !loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <Presentation size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Connect your Google Slides
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Sync pitch decks and sales presentations from your connected Google account, preview slides natively, and leverage AI to build complete multi-slide presentation decks.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 size={16} />
                <span>Connect Google Slides Account</span>
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
                  placeholder="Search presentations..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center text-xs text-slate-500">
                <span>{filtered.length} presentation{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Presentations Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="animate-spin text-amber-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading Google presentations...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 mx-auto flex items-center justify-center">
                  <Presentation size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No presentations found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create a new presentation or use the AI Deck Builder to auto-generate a complete presentation.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles size={13} />
                    <span>Create with AI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const id = item.id || item.presentation_id;
                  const title = item.title || item.name || 'Untitled Presentation';
                  const mod = item.modified_time ? new Date(item.modified_time).toLocaleDateString() : 'Recently';

                  return (
                    <div
                      key={id}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 p-5 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div className="space-y-3">
                        {/* Slide card preview mockup */}
                        <div 
                          onClick={() => handleOpenDetails(item)}
                          className="h-32 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/60 border border-amber-100 dark:border-slate-700 p-3 flex flex-col justify-between cursor-pointer group-hover:scale-[1.01] transition-transform"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <LayoutTemplate size={11} /> Slide Deck
                            </span>
                            <Eye size={14} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-center py-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-2">
                              {title}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Google Slides</span>
                            {item.slide_count && <span>{item.slide_count} slides</span>}
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <h3 
                            onClick={() => handleOpenDetails(item)}
                            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
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
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenDetails(item)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                          >
                            Preview
                          </button>
                        </div>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Presentation"
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

        {/* Presentation Detail / Preview Modal */}
        {selectedPresentation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Presentation size={18} className="text-amber-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {selectedPresentation.title || selectedPresentation.name || 'Presentation Preview'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddSlideModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Plus size={13} />
                    <span>Add Slide</span>
                  </button>
                  {selectedPresentation.url && (
                    <a
                      href={selectedPresentation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink size={13} />
                      <span>Google Slides</span>
                    </a>
                  )}
                  <button onClick={() => setSelectedPresentation(null)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {detailsLoading ? (
                  <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-amber-600 mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Loading slide elements...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Total Slides: {presentationDetails?.slides?.length || selectedPresentation.slide_count || 1}</span>
                      <span>ID: {selectedPresentation.id || selectedPresentation.presentation_id}</span>
                    </div>

                    {/* Slides List */}
                    <div className="space-y-3">
                      {(presentationDetails?.slides || [{ title: selectedPresentation.title, content: ['Cover slide created via Google Slides API'] }]).map((slide, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              Slide {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {slide.title || `Slide ${idx + 1}`}
                            </span>
                          </div>
                          {slide.content && slide.content.length > 0 && (
                            <ul className="pl-4 list-disc text-xs text-slate-600 dark:text-slate-300 space-y-1">
                              {slide.content.map((point, pIdx) => (
                                <li key={pIdx}>{point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Slide Modal */}
        {isAddSlideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <LayoutTemplate size={16} className="text-amber-600" />
                  Add Slide to Presentation
                </h3>
                <button onClick={() => setIsAddSlideModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSlide} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slide Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="e.g. Market Opportunity & Growth"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bullet Points (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={slideBullets}
                    onChange={(e) => setSlideBullets(e.target.value)}
                    placeholder="Point 1: $12B total addressable market&#10;Point 2: 45% annual growth rate&#10;Point 3: Low acquisition costs"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddSlideModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingSlide}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {addingSlide ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Add to Slide Deck</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Presentation Builder Modal */}
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI Presentation Deck Builder
                  </h3>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Describe what presentation you want. AI will generate the outline, titles, bullet points, and create a real presentation in your Google account.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Prompt / Topic *
                    </label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Create a 6-slide investor pitch deck for UWO Connect WhatsApp automation CRM platform highlighting features, pricing, and traction"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Slide Count
                    </label>
                    <select
                      value={aiSlideCount}
                      onChange={(e) => setAiSlideCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value={4}>4 Slides (Executive Summary)</option>
                      <option value={6}>6 Slides (Standard Pitch Deck)</option>
                      <option value={8}>8 Slides (Detailed Product Deck)</option>
                      <option value={10}>10 Slides (Comprehensive Business Plan)</option>
                    </select>
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
                    onClick={handleAIGenerateDeck}
                    disabled={!aiPrompt.trim() || aiGenerating}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {aiGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Generate Presentation in Google Slides</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Blank Presentation Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Plus size={16} className="text-amber-600" />
                  Create Presentation
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePresentation} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Presentation Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Q4 Business Review"
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
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Create Presentation</span>
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Presentation?</h3>
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
                  onClick={() => handleDeletePresentation(deleteConfirmItem)}
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
          onActionCompleted={() => fetchPresentationsList()}
        />
      </div>
    </DashboardLayout>
  );
}

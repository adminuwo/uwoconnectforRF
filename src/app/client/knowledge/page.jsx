'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Upload, FileText, Trash2, Loader2, Database, CheckCircle2, X, 
  Sparkles, Search, Filter, Cpu, BookOpen, Bot, ShieldCheck, AlertCircle, RefreshCw, Eye,
  Globe, Link2, AlignLeft, ExternalLink, Layers, Settings2, Send, ChevronDown, ChevronUp
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';

const KnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeSource, setActiveSource] = useState('FILE'); // 'FILE' | 'URL' | 'TEXT'
  const [file, setFile] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contentSnippet, setContentSnippet] = useState('');
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [recrawlingId, setRecrawlingId] = useState(null);
  const [maxPages, setMaxPages] = useState(25);
  const [maxDepth, setMaxDepth] = useState(3);
  const [showAdvancedCrawl, setShowAdvancedCrawl] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const fileInputRef = useRef(null);

  const API = API_BASE_URL;

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API}/api/knowledge/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const docs = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setDocuments(docs);
    } catch (err) {
      console.warn('Knowledge base fetch info:', err?.response?.data || err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchDocuments(); 
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem('uwo_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      if (activeSource === 'URL') {
        if (!websiteUrl.trim()) return;
        await axios.post(`${API}/api/knowledge/`, {
          website_url: websiteUrl.trim(),
          title: title.trim() || websiteUrl.trim(),
          doc_type: 'URL',
          max_pages: maxPages,
          max_depth: maxDepth
        }, { headers });
        setWebsiteUrl('');
      } else if (activeSource === 'TEXT') {
        if (!contentSnippet.trim()) return;
        await axios.post(`${API}/api/knowledge/`, {
          text: contentSnippet.trim(),
          title: title.trim() || 'Knowledge Note',
          doc_type: 'TEXT'
        }, { headers });
        setContentSnippet('');
      } else {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        if (title.trim()) formData.append('title', title.trim());

        await axios.post(`${API}/api/knowledge/`, formData, {
          headers: { 
            ...headers, 
            'Content-Type': 'multipart/form-data' 
          }
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

      setTitle('');
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to process knowledge source');
    } finally {
      setUploading(false);
    }
  };

  const handleRecrawl = async (id) => {
    setRecrawlingId(id);
    try {
      const token = localStorage.getItem('uwo_token');
      await axios.post(`${API}/api/knowledge/${id}/recrawl/`, {
        max_pages: maxPages,
        max_depth: maxDepth
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      await fetchDocuments();
      alert('Website re-crawl and staged indexing completed successfully!');
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to re-crawl website');
    } finally {
      setRecrawlingId(null);
    }
  };

  const handleTestQuery = async (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setQueryLoading(true);
    setQueryResult(null);
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.post(`${API}/api/knowledge/query/`, {
        query: queryText.trim(),
        top_k: 4
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setQueryResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to query RAG pipeline');
    } finally {
      setQueryLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document? The AI assistant will no longer have access to this information.')) return;
    try {
      const token = localStorage.getItem('uwo_token');
      setDocuments(prev => prev.filter(d => String(d.id) !== String(id)));
      await axios.delete(`${API}/api/knowledge/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (err) {
      console.error('Delete knowledge doc error:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to delete document');
      fetchDocuments();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const safeDocuments = Array.isArray(documents) ? documents : [];

  const filteredDocuments = safeDocuments.filter(doc => {
    const matchesSearch = (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.text_preview || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || (doc.file_type || '').toUpperCase() === filterType.toUpperCase();
    return matchesSearch && matchesType;
  });

  const totalChunks = safeDocuments.reduce((acc, curr) => acc + (curr.chunks || 0), 0);
  const activeCount = safeDocuments.filter(d => d.fully_embedded).length;

  return (
    <DashboardLayout>
      <div className="w-full max-w-full space-y-6 pb-12 font-sans px-2 sm:px-4">
        
        {/* Clean Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Knowledge Base
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Upload business PDFs, manuals & FAQs to train your custom AI assistant.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {safeDocuments.length} Trained Files ({totalChunks} Chunks)
            </span>
          </div>
        </div>

        {/* Knowledge Ingestion Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
          
          {/* Mode Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" /> Train AI Knowledge Base
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Feed business knowledge, catalogs, and policies into your AI Assistant</p>
            </div>

            <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveSource('FILE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'FILE'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload size={14} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveSource('URL')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'URL'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe size={14} /> Fetch from Website
              </button>
              <button
                type="button"
                onClick={() => setActiveSource('TEXT')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSource === 'TEXT'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlignLeft size={14} /> Direct FAQ / Text
              </button>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            {/* Title / Topic Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                {activeSource === 'URL' ? 'Website / Page Title' : activeSource === 'TEXT' ? 'Topic / Note Title' : 'Document Name / Subject'} 
                <span className="text-slate-400 font-normal"> (Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={
                  activeSource === 'URL'
                    ? "e.g. Official Pricing & Service Plans"
                    : activeSource === 'TEXT'
                    ? "e.g. Return Policy & Cancellation Terms"
                    : "e.g. Return Policy 2024, Service Pricing Guide"
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-xs font-medium text-slate-900"
              />
            </div>

            {/* Mode 1: File Drag & Drop */}
            {activeSource === 'FILE' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-50/80 scale-[0.99]'
                    : file
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                />

                {file ? (
                  <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-2xl border border-emerald-200 max-w-md mx-auto shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                      <p className="text-[11px] font-semibold text-slate-400">{formatSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setFile(null); 
                        if (fileInputRef.current) fileInputRef.current.value = ''; 
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Upload size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Click to browse file or drag & drop</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Supported: PDF, TXT, DOCX (Max 15MB)</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Website URL Scraper */}
            {activeSource === 'URL' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Public Website URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourcompany.com or https://docs.yourcompany.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-xs font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Advanced Crawl Settings Toggle */}
                <div className="border border-slate-200/80 rounded-2xl p-3 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedCrawl(!showAdvancedCrawl)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Settings2 size={14} className="text-blue-500" /> Advanced Crawler Configuration
                    </span>
                    {showAdvancedCrawl ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showAdvancedCrawl && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                          Max Pages to Crawl: <span className="text-blue-600 font-extrabold">{maxPages}</span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={maxPages}
                          onChange={e => setMaxPages(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400">Deep crawling parses internal links & sitemaps</span>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                          Max Crawl Depth: <span className="text-blue-600 font-extrabold">{maxDepth}</span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={maxDepth}
                          onChange={e => setMaxDepth(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400">Link depth levels from root URL</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
                  <Globe size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 space-y-1">
                    <p className="font-bold">Multi-Page Recursive Crawler with Structured Extraction</p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Crawls internal pages, parses <code className="bg-blue-100/70 px-1 py-0.5 rounded font-mono">sitemap.xml</code>, respects <code className="bg-blue-100/70 px-1 py-0.5 rounded font-mono">robots.txt</code>, extracts markdown tables, lists, and FAQs, defended by SSRF security filters.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Direct FAQ / Text Input */}
            {activeSource === 'TEXT' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Text / FAQ Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={contentSnippet}
                    onChange={e => setContentSnippet(e.target.value)}
                    placeholder="Q: What is your return policy?&#10;A: Customers can return items within 7 days in original packaging...&#10;&#10;Q: What are your support hours?&#10;A: Monday to Saturday from 9 AM to 7 PM IST."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all text-xs font-medium text-slate-900 leading-relaxed resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                uploading || 
                (activeSource === 'FILE' && !file) || 
                (activeSource === 'URL' && !websiteUrl.trim()) || 
                (activeSource === 'TEXT' && !contentSnippet.trim())
              }
              className={`w-full py-3.5 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                activeSource === 'URL'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : activeSource === 'TEXT'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> {activeSource === 'URL' ? 'Scraping & Indexing Web Content...' : 'Processing & Vectorizing Content...'}</>
              ) : activeSource === 'URL' ? (
                <><Globe size={16} /> Fetch from Website & Train AI</>
              ) : activeSource === 'TEXT' ? (
                <><AlignLeft size={16} /> Index Text & Train AI</>
              ) : (
                <><Upload size={16} /> Upload & Train AI Assistant</>
              )}
            </button>
          </form>
        </div>

        {/* Documents Directory & Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
          
          {/* Filter Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Knowledge Documents ({filteredDocuments.length})</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Active files feeding context to your AI agents</p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="PDF">PDF</option>
                <option value="TXT">TXT</option>
                <option value="DOCX">DOCX</option>
                <option value="URL">Website URLs</option>
              </select>
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="animate-spin text-emerald-600" size={28} />
              <p className="text-xs font-semibold text-slate-500">Loading Knowledge Documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Database size={40} className="text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No documents found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? 'No documents match your search filter.' : 'Upload a document or website URL above to begin training your AI model.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                      (doc.file_type || '').toLowerCase() === 'url'
                        ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white'
                        : (doc.file_type || '').toLowerCase() === 'txt'
                        ? 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white'
                    }`}>
                      {(doc.file_type || '').toLowerCase() === 'url' ? (
                        <Globe size={20} />
                      ) : (doc.file_type || '').toLowerCase() === 'txt' ? (
                        <AlignLeft size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{doc.title || 'Untitled Document'}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                          {doc.file_type || 'TXT'}
                        </span>
                        {doc.source_url && (
                          <a
                            href={doc.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                            title={doc.source_url}
                          >
                            <ExternalLink size={11} /> Source
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                        {doc.crawl_metadata?.crawled_count ? (
                          <>
                            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md text-[10px]">
                              Crawled {doc.crawl_metadata.crawled_count} Pages
                            </span>
                            <span>•</span>
                          </>
                        ) : (
                          <>
                            <span>{formatSize(doc.file_size)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="text-emerald-700 font-bold">{doc.chunks || 0} Vector Chunks</span>
                        <span>•</span>
                        <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {doc.fully_embedded ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase">
                        <CheckCircle2 size={13} /> AI Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase">
                        <Loader2 size={13} className="animate-spin" /> Processing
                      </span>
                    )}

                    {doc.file_type === 'URL' && (
                      <button
                        type="button"
                        disabled={recrawlingId === doc.id}
                        onClick={() => handleRecrawl(doc.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Re-crawl and update website data"
                      >
                        <RefreshCw size={16} className={recrawlingId === doc.id ? 'animate-spin text-blue-600' : ''} />
                      </button>
                    )}

                    {doc.text_preview && (
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewDoc(doc)}
                        className="p-2 text-slate-400 hover:text-emerald-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Preview extracted text"
                      >
                        <Eye size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Interactive RAG Retrieval & Citation Tester */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Interactive RAG Retrieval & Citation Tester</h3>
                <p className="text-xs text-slate-400">Test how your indexed website and documents answer real user queries</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" /> Hybrid Reciprocal Rank Fusion Active
            </div>
          </div>

          <form onSubmit={handleTestQuery} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                placeholder="Ask any question to test AI knowledge retrieval (e.g. 'What are the pricing tiers and support levels?')"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={queryLoading || !queryText.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {queryLoading ? (
                <><Loader2 size={15} className="animate-spin" /> Querying...</>
              ) : (
                <><Send size={15} /> Test Retrieval</>
              )}
            </button>
          </form>

          {/* Query Result Preview */}
          {queryResult && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                    <Bot size={15} /> Synthesized AI Answer
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-700/60 px-2 py-0.5 rounded-md">
                    Retrieved {queryResult.total_chunks_found || 0} Knowledge Chunks
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {queryResult.answer}
                </p>
              </div>

              {queryResult.retrieved_chunks && queryResult.retrieved_chunks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Retrieved Evidence Chunks ({queryResult.retrieved_chunks.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {queryResult.retrieved_chunks.map((chk, idx) => (
                      <div key={idx} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-indigo-300 text-[11px] truncate">
                            {chk.doc_title || 'Document Chunk'}
                          </span>
                          <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold shrink-0">
                            Score: {chk.score || 0}
                          </span>
                        </div>
                        {chk.heading_path && (
                          <p className="text-[10px] text-slate-400 truncate font-semibold">
                            Section: {chk.heading_path}
                          </p>
                        )}
                        {chk.source_url && (
                          <a
                            href={chk.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 truncate"
                          >
                            <ExternalLink size={10} /> {chk.source_url}
                          </a>
                        )}
                        <p className="text-[11px] text-slate-300 line-clamp-3 bg-slate-900/50 p-2 rounded-lg font-mono">
                          {chk.text || chk.chunk_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text Preview Modal */}
        {selectedPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-emerald-600" size={18} />
                  <h3 className="font-extrabold text-slate-900 text-sm">{selectedPreviewDoc.title}</h3>
                </div>
                <button onClick={() => setSelectedPreviewDoc(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Crawler Diagnostics if URL Document */}
              {selectedPreviewDoc.crawl_metadata && (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Globe size={14} className="text-blue-600" /> Website Crawl Diagnostics
                    </span>
                    <span className="text-[10px] font-bold text-blue-700">
                      Duration: {selectedPreviewDoc.crawl_metadata.duration_seconds || 0}s
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Discovered</p>
                      <p className="text-xs font-black text-slate-800">{selectedPreviewDoc.crawl_metadata.discovered_count || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Fetched</p>
                      <p className="text-xs font-black text-emerald-700">{selectedPreviewDoc.crawl_metadata.fetched_count || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Skipped</p>
                      <p className="text-xs font-black text-slate-500">{selectedPreviewDoc.crawl_metadata.skipped_count || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Chunks</p>
                      <p className="text-xs font-black text-indigo-600">{selectedPreviewDoc.crawl_metadata.chunks_created || selectedPreviewDoc.chunks || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {selectedPreviewDoc.text_preview || 'No text extracted.'}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;

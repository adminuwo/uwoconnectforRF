'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Upload, FileText, Trash2, Loader2, Database, CheckCircle2, X, 
  Sparkles, Search, Filter, Cpu, BookOpen, Bot, ShieldCheck, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';

const KnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
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
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    try {
      const token = localStorage.getItem('uwo_token');
      await axios.post(`${API}/api/knowledge/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
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

        {/* Upload Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload size={18} className="text-emerald-600" /> Upload & Train Document
            </h2>
            <span className="text-xs text-slate-400 font-medium">Supported: PDF, TXT, DOCX (Max 5MB)</span>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Document Name / Subject <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Return Policy 2024, Service Pricing Guide"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-xs font-medium text-slate-900"
              />
            </div>

            {/* Drag & Drop Zone */}
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
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Upload product catalogs, support guides, or company SOPs</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> Processing & Extracting Text...</>
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
                {searchQuery ? 'No documents match your search filter.' : 'Upload a document above to begin training your AI model.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{doc.title || 'Untitled Document'}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                          {doc.file_type || 'TXT'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                        <span>{formatSize(doc.file_size)}</span>
                        <span>•</span>
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

        {/* Text Preview Modal */}
        {selectedPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-emerald-600" size={18} />
                  <h3 className="font-extrabold text-slate-900 text-sm">{selectedPreviewDoc.title}</h3>
                </div>
                <button onClick={() => setSelectedPreviewDoc(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

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

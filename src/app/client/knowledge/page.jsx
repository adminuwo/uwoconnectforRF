'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Trash2, Loader2, FileText, File, 
  CheckCircle, AlertCircle, Brain, X, Eye,
  ChevronRight, BookOpen, Zap
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
const API = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api`;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const FILE_ICONS = {
  pdf: { bg: 'bg-red-50', text: 'text-red-500', label: 'PDF' },
  docx: { bg: 'bg-blue-50', text: 'text-blue-500', label: 'DOCX' },
  txt: { bg: 'bg-slate-50', text: 'text-slate-500', label: 'TXT' },
};

export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [togglingAI, setTogglingAI] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const token = () => localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, profileRes] = await Promise.all([
        axios.get(`${API}/knowledge/`, { headers: { Authorization: `Bearer ${token()}` } }),
        axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      setDocs(docsRes.data);
      setAiEnabled(profileRes.data.client?.ai_enabled || false);
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      showToast('Only PDF, DOCX, and TXT files allowed', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large. Max 5MB allowed.', 'error');
      return;
    }
    setSelectedFile(file);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle || selectedFile.name);

      const res = await axios.post(`${API}/knowledge/`, formData, {
        headers: {
          Authorization: `Bearer ${token()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast(res.data.message || 'Document uploaded successfully!');
      setSelectedFile(null);
      setUploadTitle('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/knowledge/${id}/`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      showToast('Document deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleToggleAI = async () => {
    try {
      setTogglingAI(true);
      await axios.patch(`${API}/profile`, { ai_enabled: !aiEnabled }, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setAiEnabled(!aiEnabled);
      showToast(`AI Assistant ${!aiEnabled ? 'enabled' : 'disabled'}`);
    } catch {
      showToast('Failed to update AI setting', 'error');
    } finally {
      setTogglingAI(false);
    }
  };

  const fileIcon = (type) => FILE_ICONS[type] || FILE_ICONS.txt;

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-5xl mx-auto pb-20 px-8">

        {/* Toast */}
        
          {toast && (
            <div
              className={cn(
                'fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm',
                toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              )}
            >
              {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {toast.msg}
            </div>
          )}
        

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Brain className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
            </div>
            <p className="text-slate-500 font-medium italic ml-1">
              Upload your business documents — AI will answer customers based only on these files.
            </p>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap size={16} className={aiEnabled ? 'text-purple-600' : 'text-slate-300'} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Reply</span>
            </div>
            <button
              onClick={handleToggleAI}
              disabled={togglingAI}
              className={cn(
                'w-12 h-6 rounded-full p-1 transition-all relative',
                aiEnabled ? 'bg-purple-600' : 'bg-slate-200'
              )}
            >
              <div className={cn(
                'w-4 h-4 bg-white rounded-full transition-all transform shadow-sm',
                aiEnabled ? 'translate-x-6' : 'translate-x-0'
              )} />
            </button>
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-widest',
              aiEnabled ? 'text-purple-600' : 'text-slate-300'
            )}>
              {aiEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* How it works banner */}
        <div className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 border border-purple-100 rounded-[28px] p-6 flex items-start gap-4">
          <BookOpen size={20} className="text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-1">How It Works</p>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              <span className="font-bold">1.</span> Upload PDF/DOCX/TXT files with your business info (product catalog, FAQ, pricing, policies).&nbsp;
              <span className="font-bold">2.</span> Documents are <span className="font-bold text-purple-700">chunked &amp; embedded</span> using OpenAI for intelligent search.&nbsp;
              <span className="font-bold">3.</span> When a customer messages on WhatsApp, AI finds the most relevant chunks and replies <span className="font-bold text-purple-700">only from your documents</span>.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            <Upload size={16} className="text-slate-400" /> Upload New Document
          </h2>

          {!selectedFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-[24px] p-12 text-center cursor-pointer transition-all',
                dragOver
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
              )}
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">Drag & drop your file here</p>
              <p className="text-xs text-slate-400 font-medium">or click to browse</p>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-4">PDF · DOCX · TXT · Max 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div
              className="space-y-4"
            >
              {/* File preview card */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black', fileIcon(selectedFile.name.split('.').pop()).bg, fileIcon(selectedFile.name.split('.').pop()).text)}>
                  {fileIcon(selectedFile.name.split('.').pop()).label}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{formatBytes(selectedFile.size)}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Title input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                  Document Title
                </label>
                <input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Product Catalog 2024"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 transition-all font-semibold text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-6 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Embedding Document...</>
                  ) : (
                    <><Upload size={16} /> Upload &amp; Embed</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <File size={16} className="text-slate-400" />
              Uploaded Documents
              <span className="ml-2 px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                {docs.length}
              </span>
            </h2>
            {docs.length > 0 && (
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                Combined context for AI
              </p>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-purple-500" size={28} />
            </div>
          ) : docs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">No documents yet</p>
              <p className="text-xs text-slate-300 font-medium mt-1">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {docs.map((doc, i) => {
                const icon = fileIcon(doc.file_type);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* File type badge */}
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0', icon.bg, icon.text)}>
                      {icon.label}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{doc.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-medium">{formatBytes(doc.file_size)}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-[11px] text-slate-400 font-medium">{formatDate(doc.created_at)}</span>
                        {doc.chunks > 0 && (
                          <>
                            <span className="text-slate-200">·</span>
                            <span className="text-[11px] text-slate-400 font-medium">{doc.chunks} chunks</span>
                          </>
                        )}
                        {doc.fully_embedded ? (
                          <>
                            <span className="text-slate-200">·</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                              <CheckCircle size={10} /> Embedded
                            </span>
                          </>
                        ) : doc.has_text ? (
                          <>
                            <span className="text-slate-200">·</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                              <AlertCircle size={10} /> Partial
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.has_text && (
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                          title="Preview extracted text"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <div
              className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-[40px] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-10 py-7 border-b border-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">{previewDoc.title}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Extracted Text Preview</p>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-300 hover:text-slate-900 transition-colors">
                  <X size={22} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-10 py-6">
                <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {previewDoc.text_preview}
                </p>
                {previewDoc.text_preview?.endsWith('...') && (
                  <p className="text-xs text-slate-300 font-bold mt-4 uppercase tracking-widest text-center italic">
                    — Preview truncated — Full document is loaded for AI —
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      
    </DashboardLayout>
  );
}


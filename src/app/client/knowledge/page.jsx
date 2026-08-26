'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Trash2, Loader2, Database, CheckCircle2, X } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

const KnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/knowledge/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Failed to fetch knowledge base documents', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/knowledge/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? The AI will no longer use its knowledge.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/knowledge/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch { alert('Failed to delete document'); }
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

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">Upload documents to train your AI assistant.</p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Document Title <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Pricing Guide 2024"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all text-sm"
              />
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-emerald-400 bg-emerald-50'
                  : file
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[280px]">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Click to browse or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-0.5">PDF, TXT, DOCX • Max 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={16} /> Upload & Train AI</>
              )}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Your Documents</h2>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              {documents.length} {documents.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin text-emerald-500 mx-auto" />
            </div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center">
              <Database size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">No documents yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload a file above to start training your AI.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <FileText size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.file_type?.toUpperCase()}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] text-slate-400">{formatSize(doc.file_size)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] text-emerald-600 font-medium">{doc.chunks} chunks</span>
                    </div>
                  </div>

                  {/* Status + Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.fully_embedded ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg border border-emerald-100">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-lg border border-amber-100">
                        <Loader2 size={12} className="animate-spin" /> Processing
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;

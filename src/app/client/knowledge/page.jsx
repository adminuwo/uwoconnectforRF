'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Trash2, Loader2, Database, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const KnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/knowledge/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch knowledge base documents');
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
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/knowledge/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      setTitle('');
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document? The AI will no longer use its knowledge.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/knowledge/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Knowledge Base</h1>
            <p className="text-slate-500 font-medium">Upload documents (PDF, TXT) to teach your AI assistant about your business.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Database size={100} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Upload Document</h2>
              <form onSubmit={handleUpload} className="space-y-6 relative">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Document Title (Optional)</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Pricing Guide 2024" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-brand-500 transition-all font-semibold text-sm" 
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">File (PDF, TXT, DOCX)</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-400 hover:bg-brand-50/50 transition-colors group cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf,.txt,.docx"
                      onChange={e => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      {file ? (
                        <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-900 mb-1">Click to browse or drag file</p>
                          <p className="text-xs text-slate-500">Max 5MB per file</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : 'Upload & Train AI'}
                </button>
              </form>

              <div className="mt-6 bg-amber-50 rounded-2xl p-4 flex gap-3 items-start border border-amber-100">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  The AI uses these documents to generate accurate answers. Ensure the content is up to date and remove outdated documents.
                </p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Your Knowledge Base</h2>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-slate-200">
                  {documents.length} Docs
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-brand-600 mx-auto" /></div>
              ) : documents.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Database size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No documents yet</h3>
                  <p className="text-sm text-slate-500">Upload a file on the left to start training your AI.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex gap-4 items-start sm:items-center">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1">{doc.title}</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doc.file_type.toUpperCase()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-slate-500 font-medium">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-brand-600 font-medium">{doc.chunks} chunks indexed</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:ml-auto">
                        {doc.fully_embedded ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg border border-emerald-100 whitespace-nowrap">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-lg border border-amber-100 whitespace-nowrap">
                            Processing
                          </span>
                        )}
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete document"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;

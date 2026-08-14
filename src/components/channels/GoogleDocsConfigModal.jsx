'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Mail, Globe, AlertCircle, Check, Loader2, Settings as SettingsIcon, Database, FilePlus, Sparkles
} from 'lucide-react';
import axios from 'axios';

export const GoogleDocsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#4285F4"/>
    <path d="M14 2V8H20L14 2Z" fill="#A1C2FA"/>
    <path d="M8 12H16V13.5H8V12Z" fill="#FFFFFF"/>
    <path d="M8 15H16V16.5H8V15Z" fill="#FFFFFF"/>
    <path d="M8 18H13V19.5H8V18Z" fill="#FFFFFF"/>
  </svg>
);

export default function GoogleDocsConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, DOCS, SETTINGS
  const [docsInfo, setDocsInfo] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Manual Create Doc Form
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
  });
  const [creatingDoc, setCreatingDoc] = useState(false);

  const isConnected = Boolean(client?.google_docs_enabled);
  const config = client?.google_docs_config || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchDocsInfo();
    } else {
      setLoading(false);
    }
  }, [isOpen, isConnected]);

  const fetchDocsInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-docs/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocsInfo(res.data);
      setRecentDocs(res.data.recent_docs || []);
    } catch (err) {
      setError('Failed to fetch Google Docs status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-docs/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      setError('Failed to initiate Google Docs connection.');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-docs/sync/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDocsInfo();
      setToast('Google Docs synced successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateDocSubmit = async (e) => {
    e.preventDefault();
    if (!newDoc.title.trim()) return;
    setCreatingDoc(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-docs/create-doc/`, newDoc, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentDocs(res.data.recent_docs || []);
      setNewDoc({ title: '', content: '' });
      setShowCreateDoc(false);
      setToast('Google Document created successfully!');
      setTimeout(() => setToast(null), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create Google Document.');
    } finally {
      setCreatingDoc(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Docs?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-docs/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect Google Docs.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                <GoogleDocsIcon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Google Docs
                  {isConnected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automate document generation, contracts, customer receipts, and briefs in Google Docs.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} />
              {toast}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {!isConnected ? (
            /* Unconnected Onboarding State */
            <div className="my-auto py-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                <GoogleDocsIcon size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Connect Google Docs</h3>
              <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                Connect your Google Account to auto-generate customer contracts, order invoices, and lead summaries directly into Google Docs.
              </p>
              
              <div className="w-full max-w-sm space-y-2 mb-8 text-left text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span>Instant document generation via OAuth 2.0</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span>Auto-creates &quot;UWOConnect Documents&quot; in Google Drive</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span>Share live document links with clients & leads</span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="py-3 px-6 bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {connecting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>{connecting ? 'Connecting...' : 'Connect with Google Docs'}</span>
              </button>
            </div>
          ) : (
            /* Connected Configuration Tabs */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tab Nav */}
              <div className="flex border-b border-slate-100 mb-6 gap-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                    activeTab === 'OVERVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Globe size={15} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('DOCS')}
                  className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                    activeTab === 'DOCS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FileText size={15} /> Generated Docs ({recentDocs.length})
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                    activeTab === 'SETTINGS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <SettingsIcon size={15} /> Generation Rules
                </button>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-6 overflow-y-auto pr-1">
                  {/* Account Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Google Account</span>
                      <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{config.account_email || docsInfo?.account_email || 'Connected'}</p>
                    </div>
                    <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                      <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Default Document</span>
                      <p className="text-xs font-semibold text-blue-700 mt-1 truncate">{config.default_doc_name || 'UWOConnect Documents'}</p>
                    </div>
                    <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Documents</span>
                      <p className="text-xs font-semibold text-slate-800 mt-1">{config.docs_created_count || recentDocs.length || 0} Generated</p>
                    </div>
                  </div>

                  {/* Create New Document Form Card */}
                  <div className="p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-blue-600" />
                          Generate New Google Document
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Create a contract, lead summary, or customer proposal directly in Google Drive.</p>
                      </div>
                      <button
                        onClick={() => setShowCreateDoc(!showCreateDoc)}
                        className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <FilePlus size={14} />
                        <span>{showCreateDoc ? 'Cancel' : 'Create Doc'}</span>
                      </button>
                    </div>

                    {showCreateDoc && (
                      <form onSubmit={handleCreateDocSubmit} className="mt-4 space-y-3 pt-3 border-t border-blue-100/80 animate-in fade-in">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title *</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g., Quotation - Acme Corp"
                            value={newDoc.title}
                            onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Initial Text / Brief</label>
                          <textarea 
                            rows={3}
                            placeholder="Type document content, terms, or lead details..."
                            value={newDoc.content}
                            onChange={(e) => setNewDoc({...newDoc, content: e.target.value})}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={creatingDoc}
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {creatingDoc ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            <span>{creatingDoc ? 'Creating...' : 'Save & Open in Google Docs'}</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* GENERATED DOCS TAB */}
              {activeTab === 'DOCS' && (
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Recent Documents Generated</span>
                    <button
                      onClick={fetchDocsInfo}
                      disabled={loading}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                  </div>

                  <div className="flex-1 border border-slate-200/80 rounded-xl overflow-hidden overflow-y-auto">
                    {recentDocs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No documents created yet. Use the Overview tab to generate your first document.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            <th className="p-3">Document Title</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentDocs.map((doc, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                              <td className="p-3 font-medium text-slate-800 flex items-center gap-2">
                                <FileText size={15} className="text-blue-500 shrink-0" />
                                <span className="truncate max-w-[240px]">{doc.title}</span>
                              </td>
                              <td className="p-3 text-slate-500 text-[11px]">
                                {doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just Now'}
                              </td>
                              <td className="p-3 text-right">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg text-[11px] transition-colors"
                                >
                                  Open Doc <ExternalLink size={12} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS / GENERATION RULES TAB */}
              {activeTab === 'SETTINGS' && (
                <div className="space-y-4 overflow-y-auto pr-1">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900">Automatic Document Generation Rules</h4>
                    
                    <div className="flex items-center justify-between py-2 border-b border-slate-200/60">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Auto-Create Lead Briefs</p>
                        <p className="text-[11px] text-slate-400">Generate a Google Doc summary whenever a high-intent WhatsApp lead arrives.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-200/60">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Auto-Generate Order Receipts</p>
                        <p className="text-[11px] text-slate-400">Create order receipt docs when customers place orders on WhatsApp/Commerce.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Include Timestamp Headers</p>
                        <p className="text-[11px] text-slate-400">Append formatted date & timestamp headers to every auto-generated document.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer disabled:opacity-50"
                >
                  {disconnecting ? 'Disconnecting...' : 'Disconnect Google Docs'}
                </button>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-full md:w-64 bg-slate-50/80 p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connection Status</span>
            <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              {isConnected && (
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Account: <span className="font-medium text-slate-700">{config.account_email || 'Connected'}</span>
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">How It Works</span>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Connect your Google Account securely via OAuth2.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Auto-generate contracts, customer receipts & lead briefs.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Access and edit documents live in Google Docs anytime.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
            <span>256-bit OAuth2 Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

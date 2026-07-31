'use client';

import React, { useState, useEffect } from 'react';
import { 
  Presentation, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Mail, Globe, AlertCircle, Check, Loader2, Settings as SettingsIcon, Database, Layout, Sparkles
} from 'lucide-react';
import axios from 'axios';

export const GoogleSlidesIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="#F4B400"/>
    <path d="M6 7H18V17H6V7Z" fill="#FFFFFF"/>
    <path d="M8 9H16V15H8V9Z" fill="#F4B400"/>
  </svg>
);

export default function GoogleSlidesConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, PRESENTATIONS, SETTINGS
  const [slidesInfo, setSlidesInfo] = useState(null);
  const [recentPresentations, setRecentPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Manual Create Presentation Form
  const [showCreatePresentation, setShowCreatePresentation] = useState(false);
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    topic: '',
  });
  const [creatingPresentation, setCreatingPresentation] = useState(false);

  const isConnected = Boolean(client?.google_slides_enabled);
  const config = client?.google_slides_config || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchSlidesInfo();
    } else {
      setLoading(false);
    }
  }, [isOpen, isConnected]);

  const fetchSlidesInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-slides/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlidesInfo(res.data);
      setRecentPresentations(res.data.recent_presentations || []);
    } catch (err) {
      setError('Failed to fetch Google Slides status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-slides/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      setError('Failed to initiate Google Slides connection.');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-slides/sync/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSlidesInfo();
      setToast('Google Slides synced successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreatePresentationSubmit = async (e) => {
    e.preventDefault();
    if (!newPresentation.title.trim()) return;
    setCreatingPresentation(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-slides/create-presentation/`, newPresentation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentPresentations(res.data.recent_presentations || []);
      setNewPresentation({ title: '', topic: '' });
      setShowCreatePresentation(false);
      setToast('Google Presentation created successfully!');
      setTimeout(() => setToast(null), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create Google Presentation.');
    } finally {
      setCreatingPresentation(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Slides?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-slides/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect Google Slides.');
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
              <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-100 flex items-center justify-center shrink-0 shadow-xs">
                <GoogleSlidesIcon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Google Slides
                  {isConnected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automate pitch decks, product catalog showcases, and client presentation decks in Google Slides.
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
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
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
              <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
                <GoogleSlidesIcon size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Connect Google Slides</h3>
              <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                Connect your Google Account to auto-generate sales pitch decks, product showcase slides, and presentation decks directly into Google Slides.
              </p>
              
              <div className="w-full max-w-sm space-y-2 mb-8 text-left text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Instant slide presentation creation via OAuth 2.0</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Auto-creates &quot;UWOConnect Presentation&quot; in Google Drive</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Share live presentation links with prospects & leads</span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="py-3 px-6 bg-[#F4B400] hover:bg-[#E3A300] text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {connecting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>{connecting ? 'Connecting...' : 'Connect with Google Slides'}</span>
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
                    activeTab === 'OVERVIEW' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Globe size={15} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('PRESENTATIONS')}
                  className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                    activeTab === 'PRESENTATIONS' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Presentation size={15} /> Slide Decks ({recentPresentations.length})
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
                    activeTab === 'SETTINGS' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <SettingsIcon size={15} /> Deck Rules
                </button>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-6 overflow-y-auto pr-1">
                  {/* Account Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Google Account</span>
                      <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{config.account_email || slidesInfo?.account_email || 'Connected'}</p>
                    </div>
                    <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Default Deck</span>
                      <p className="text-xs font-semibold text-amber-800 mt-1 truncate">{config.default_presentation_name || 'UWOConnect Presentation'}</p>
                    </div>
                    <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Slide Decks</span>
                      <p className="text-xs font-semibold text-slate-800 mt-1">{config.presentations_created_count || recentPresentations.length || 0} Created</p>
                    </div>
                  </div>

                  {/* Create New Presentation Form Card */}
                  <div className="p-5 bg-gradient-to-r from-amber-50/70 to-orange-50/40 border border-amber-100 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-600" />
                          Generate New Presentation Deck
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Create a pitch deck, product catalog presentation, or sales report in Google Slides.</p>
                      </div>
                      <button
                        onClick={() => setShowCreatePresentation(!showCreatePresentation)}
                        className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Layout size={14} />
                        <span>{showCreatePresentation ? 'Cancel' : 'Create Deck'}</span>
                      </button>
                    </div>

                    {showCreatePresentation && (
                      <form onSubmit={handleCreatePresentationSubmit} className="mt-4 space-y-3 pt-3 border-t border-amber-100/80 animate-in fade-in">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Presentation Title *</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g., Q3 Sales & Product Pitch Deck"
                            value={newPresentation.title}
                            onChange={(e) => setNewPresentation({...newPresentation, title: e.target.value})}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Topic / Section Subtitle</label>
                          <input 
                            type="text"
                            placeholder="e.g., Enterprise Client Overview & Pricing"
                            value={newPresentation.topic}
                            onChange={(e) => setNewPresentation({...newPresentation, topic: e.target.value})}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={creatingPresentation}
                            className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {creatingPresentation ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            <span>{creatingPresentation ? 'Creating...' : 'Save & Open in Google Slides'}</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* GENERATED PRESENTATIONS TAB */}
              {activeTab === 'PRESENTATIONS' && (
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium font-sans">Recent Slide Decks Generated</span>
                    <button
                      onClick={fetchSlidesInfo}
                      disabled={loading}
                      className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                  </div>

                  <div className="flex-1 border border-slate-200/80 rounded-xl overflow-hidden overflow-y-auto">
                    {recentPresentations.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 font-sans">
                        No presentations created yet. Use the Overview tab to generate your first slide deck.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            <th className="p-3">Presentation Title</th>
                            <th className="p-3">Topic / Section</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentPresentations.map((deck, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                              <td className="p-3 font-medium text-slate-800 flex items-center gap-2">
                                <Presentation size={15} className="text-amber-500 shrink-0" />
                                <span className="truncate max-w-[200px]">{deck.title}</span>
                              </td>
                              <td className="p-3 text-slate-500 truncate max-w-[150px]">{deck.topic || 'General'}</td>
                              <td className="p-3 text-slate-500 text-[11px]">
                                {deck.created_at ? new Date(deck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just Now'}
                              </td>
                              <td className="p-3 text-right">
                                <a
                                  href={deck.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium rounded-lg text-[11px] transition-colors"
                                >
                                  Open Deck <ExternalLink size={12} />
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

              {/* SETTINGS / DECK RULES TAB */}
              {activeTab === 'SETTINGS' && (
                <div className="space-y-4 overflow-y-auto pr-1 font-sans">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900">Automatic Slide Presentation Rules</h4>
                    
                    <div className="flex items-center justify-between py-2 border-b border-slate-200/60">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Auto-Generate Pitch Decks</p>
                        <p className="text-[11px] text-slate-400">Create a Google Slides pitch deck whenever a high-value enterprise lead arrives.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-200/60">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Auto-Generate Product Catalog Showcases</p>
                        <p className="text-[11px] text-slate-400">Generate product catalog slide decks when customers request product presentations.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Include Company Title Slide</p>
                        <p className="text-[11px] text-slate-400">Automatically include business name title slide on every generated presentation.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer disabled:opacity-50"
                >
                  {disconnecting ? 'Disconnecting...' : 'Disconnect Google Slides'}
                </button>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-full md:w-64 bg-slate-50/80 p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between text-xs font-sans">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connection Status</span>
            <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
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
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Connect your Google Account securely via OAuth2.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Auto-generate pitch decks, catalog slides & sales reports.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">Access and edit presentations live in Google Slides anytime.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck size={14} className="text-amber-500 shrink-0" />
            <span>256-bit OAuth2 Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

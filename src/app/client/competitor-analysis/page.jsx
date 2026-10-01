'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  Target, Shield, TrendingUp, Zap, AlertTriangle, CheckCircle2, Copy, 
  ExternalLink, RefreshCw, Trash2, Plus, Search, Building2, Clock, 
  ArrowUpRight, Sparkles, Printer, Eye, MessageSquare, Layers,
  ChevronRight, AlertCircle, BarChart3, Bot, Compass, Flame, Check, X
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';

export default function CompetitorAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({ total_competitors: 0, avg_advantage_score: 0, total_gaps: 0, high_advantage_count: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reanalyzingId, setReanalyzingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Modals & Active Views
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'swot' | 'pricing' | 'playbook' | 'summary'
  const [copiedHook, setCopiedHook] = useState(false);
  const [currentBusinessName, setCurrentBusinessName] = useState('Your Business');
  const [currentBusinessDesc, setCurrentBusinessDesc] = useState('');

  // AI Auto-Discovery State
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [analyzingSuggestion, setAnalyzingSuggestion] = useState(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    competitor_name: '',
    competitor_website: '',
    industry: '',
    client_business_description: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM'

  const API = API_BASE_URL;

  const getToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('uwo_token') || localStorage.getItem('token') || '';
  };

  // Fetch list and stats
  const fetchData = async () => {
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [listRes, statsRes] = await Promise.allSettled([
        axios.get(`${API}/api/competitor-analysis/`, { headers }),
        axios.get(`${API}/api/competitor-analysis/stats/`, { headers })
      ]);

      if (listRes.status === 'fulfilled') {
        const data = Array.isArray(listRes.value.data) ? listRes.value.data : (listRes.value.data?.results || []);
        setAnalyses(data);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching competitor analysis data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI-Detected Competitor Suggestions
  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/api/competitor-analysis/discover/`, { headers });
      if (res.data?.client_business_name) {
        setCurrentBusinessName(res.data.client_business_name);
      }
      if (res.data?.suggestions && Array.isArray(res.data.suggestions)) {
        setSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching competitor suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 1-Click Quick Analyze Handler
  const handleQuickAnalyze = async (suggestion) => {
    setAnalyzingSuggestion(suggestion.competitor_name);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = {
        competitor_name: suggestion.competitor_name,
        competitor_website: suggestion.competitor_website || '',
        industry: suggestion.category || '',
        client_business_description: currentBusinessDesc,
        notes: `AI-detected market competitor. ${suggestion.why_rival || ''}`
      };

      const res = await axios.post(`${API}/api/competitor-analysis/`, payload, { headers });
      setAnalyses(prev => [res.data, ...prev]);
      setSuggestions(prev => prev.filter(s => s.competitor_name !== suggestion.competitor_name));
      if (res.data.status === 'COMPLETED') {
        setActiveAnalysis(res.data);
        setActiveTab('audit');
      }
      fetchData();
    } catch (err) {
      console.error('Quick analyze failed:', err);
    } finally {
      setAnalyzingSuggestion(null);
    }
  };

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      let bName = 'Your Business';
      if (u?.client?.business_name) bName = u.client.business_name;
      else if (u?.business_name) bName = u.business_name;
      else if (u?.client_name) bName = u.client_name;
      setCurrentBusinessName(bName);

      const desc = u?.client?.ai_context || 
                   u?.ai_context || 
                   u?.client?.settings?.whatsapp_business_profile?.description || 
                   u?.settings?.whatsapp_business_profile?.description || '';
      if (desc) {
        setCurrentBusinessDesc(desc);
        setFormData(prev => ({
          ...prev,
          client_business_description: prev.client_business_description || desc
        }));
      }
    } catch (e) {}
    fetchData();
    fetchSuggestions();
  }, []);

  // Handle Form Submit
  const handleCreateAnalysis = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.competitor_name.trim()) {
      setFormError('Competitor name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        competitor_name: formData.competitor_name.trim(),
        competitor_website: formData.competitor_website.trim(),
        industry: formData.industry.trim(),
        client_business_description: (formData.client_business_description || currentBusinessDesc).trim(),
        notes: formData.notes.trim()
      };

      const res = await axios.post(`${API}/api/competitor-analysis/`, payload, { headers });
      
      // Prepend created analysis
      setAnalyses(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({ competitor_name: '', competitor_website: '', industry: '', client_business_description: '', notes: '' });
      
      // Auto open detailed battle-card
      if (res.data.status === 'COMPLETED') {
        setActiveAnalysis(res.data);
        setActiveTab('playbook');
      }

      // Refresh stats
      fetchData();
    } catch (err) {
      console.error('Analysis submission failed:', err);
      const errMsg = err?.response?.data?.competitor_name?.[0] || 
                     err?.response?.data?.error || 
                     'Failed to analyze competitor. Please check details and try again.';
      setFormError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Re-run AI analysis
  const handleReanalyze = async (id, e) => {
    e?.stopPropagation();
    setReanalyzingId(id);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API}/api/competitor-analysis/${id}/reanalyze/`, {}, { headers });
      setAnalyses(prev => prev.map(item => item.id === id ? res.data : item));
      if (activeAnalysis?.id === id) {
        setActiveAnalysis(res.data);
      }
      fetchData();
    } catch (err) {
      console.error('Re-analysis failed:', err);
    } finally {
      setReanalyzingId(null);
    }
  };

  // Delete analysis
  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(`${API}/api/competitor-analysis/${id}/`, { headers });
      setAnalyses(prev => prev.filter(item => item.id !== id));
      if (activeAnalysis?.id === id) {
        setActiveAnalysis(null);
      }
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Copy Hook Script
  const handleCopyHook = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  // Filtered List
  const filteredAnalyses = useMemo(() => {
    return analyses.filter(item => {
      const matchesSearch = !searchQuery || 
        item.competitor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.competitor_website?.toLowerCase().includes(searchQuery.toLowerCase());

      const score = item.advantage_score || 0;
      const matchesScore = 
        scoreFilter === 'ALL' ? true :
        scoreFilter === 'HIGH' ? score >= 75 :
        scoreFilter === 'MEDIUM' ? (score >= 50 && score < 75) : true;

      return matchesSearch && matchesScore;
    });
  }, [analyses, searchQuery, scoreFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* Top Header & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1 uppercase tracking-wider">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Market Intelligence & Edge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Competitor Analysis & Battle-Cards
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Benchmark rival businesses directly against {currentBusinessName || 'your business'}, uncover their response friction points, and deploy high-converting playbooks to win their customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh analyses"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Analyze Competitor</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Competitors Tracked</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total_competitors || analyses.length}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Active intelligence records</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Avg Competitive Edge</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.avg_advantage_score || 78}%</h3>
              <p className="text-xs text-slate-500 mt-0.5">Speed & value margin</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Discovered Blindspots</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.total_gaps || (analyses.length * 3)}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automation & response gaps</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Playbooks Ready</p>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {analyses.filter(a => a.status === 'COMPLETED').length}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">1-click WhatsApp strategies</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* AI MARKET RADAR: AUTO-DETECTED COMPETITORS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {!dismissedSuggestions && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-purple-500/10 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI Market Radar: Detected Rivals for {currentBusinessName}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Auto-Discovered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    AI identified these rivals in your niche. Tap <span className="font-semibold text-emerald-600 dark:text-emerald-400">1-Click Battle-Card</span> to analyze without typing anything.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchSuggestions}
                  disabled={loadingSuggestions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
                  title="Re-scan rivals"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSuggestions ? 'animate-spin text-emerald-500' : ''}`} />
                  <span>{loadingSuggestions ? 'Scanning...' : 'Re-scan'}</span>
                </button>
                <button
                  onClick={() => setDismissedSuggestions(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg text-xs"
                  title="Hide suggestions"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loadingSuggestions && suggestions.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-800/60 rounded-xl h-36 border border-slate-200/60 dark:border-slate-700/40 p-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-3" />
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {suggestions.map((item, idx) => {
                  const isAnalyzing = analyzingSuggestion === item.competitor_name;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm flex flex-col justify-between space-y-3 transition-all group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate">
                            {item.category || 'Direct Rival'}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            item.threat_level === 'High'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {item.threat_level || 'Active'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.competitor_name}
                        </h4>

                        {item.why_rival && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {item.why_rival}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleQuickAnalyze(item)}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 disabled:opacity-60 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>1-Click Battle-Card</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl text-center text-xs text-slate-500">
                Click &ldquo;Re-scan&rdquo; to detect competitors operating in your niche.
              </div>
            )}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search competitor, niche, or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Advantage:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setScoreFilter('ALL')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${scoreFilter === 'ALL' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setScoreFilter('HIGH')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${scoreFilter === 'HIGH' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'}`}
              >
                High (75%+)
              </button>
              <button
                onClick={() => setScoreFilter('MEDIUM')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${scoreFilter === 'MEDIUM' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'}`}
              >
                Moderate (50-74%)
              </button>
            </div>
          </div>
        </div>

        {/* Competitor Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-64 border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Competitor Analyses Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Add your first competitor to benchmark head-to-head against {currentBusinessName || 'your business'}, uncover their customer friction points, and get actionable sales playbooks.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Analyze Your First Competitor</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map(analysis => {
              const intel = analysis.analysis_data || {};
              const summary = intel.competitor_summary || {};
              const audit = intel.automation_audit || {};
              const playbook = intel.uwoconnect_playbook || {};
              const score = analysis.advantage_score || 75;
              const isProcessing = analysis.status === 'PROCESSING' || reanalyzingId === analysis.id;

              return (
                <div
                  key={analysis.id}
                  onClick={() => {
                    setActiveAnalysis(analysis);
                    setActiveTab('audit');
                  }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Top Header Strip */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {analysis.industry || 'General'}
                          </span>
                          {analysis.status === 'FAILED' && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-500">
                              Failed
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {analysis.competitor_name}
                        </h3>

                        {analysis.competitor_website && (
                          <a
                            href={analysis.competitor_website.startsWith('http') ? analysis.competitor_website : `https://${analysis.competitor_website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-500 mt-0.5 transition-colors"
                          >
                            <span>{analysis.competitor_website.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Advantage Score Badge */}
                      <div className="flex flex-col items-end">
                        <div className={`px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-sm ${
                          score >= 75 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{score}% Edge</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Competitive Edge</span>
                      </div>
                    </div>

                    {/* Summary Tagline */}
                    {summary.tagline && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3 line-clamp-1 border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                        &ldquo;{summary.tagline}&rdquo;
                      </p>
                    )}

                    {/* Quick Audit Metrics Chips */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-slate-400 block text-[10px] font-semibold uppercase">Response Speed</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate block mt-0.5">
                          {audit.lead_response_speed || 'Manual (~4h)'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-slate-400 block text-[10px] font-semibold uppercase">WhatsApp Presence</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate block mt-0.5">
                          {audit.whatsapp_presence || 'Personal / Basic'}
                        </span>
                      </div>
                    </div>

                    {/* Top Critical Gap */}
                    {audit.critical_gaps && audit.critical_gaps.length > 0 && (
                      <div className="mt-3 text-xs bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-300">
                        <span className="font-semibold flex items-center gap-1 text-[11px] mb-0.5">
                          <Flame className="w-3 h-3 text-red-500" />
                          Exploitable Gap:
                        </span>
                        <p className="line-clamp-2 text-slate-600 dark:text-slate-300 text-[11px]">
                          {audit.critical_gaps[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'Recently'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleReanalyze(analysis.id, e)}
                        disabled={isProcessing}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Re-run AI Analysis"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-emerald-500' : ''}`} />
                      </button>

                      {deleteConfirmId === analysis.id ? (
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleDelete(analysis.id, e)}
                            className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-0.5 text-slate-400 hover:text-slate-600 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(analysis.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400 ml-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Battle-Card</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* NEW COMPETITOR ANALYSIS MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analyze New Competitor</h2>
                    <p className="text-xs text-slate-500">Extract intelligence, SWOT, and conversion playbooks</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAnalysis} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Client Business Context Banner */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Benchmarking Head-to-Head For</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{currentBusinessName}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">Your Business</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Competitor Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Health Clinic / UrbanFit Studio / QuickLoan Ltd"
                    value={formData.competitor_name}
                    onChange={(e) => setFormData({ ...formData, competitor_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Website or Social Profile URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://apexhealth.com or instagram.com/apexhealth"
                    value={formData.competitor_website}
                    onChange={(e) => setFormData({ ...formData, competitor_website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">If provided, our AI agent scans their website copy for pricing & value claims.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Industry / Vertical
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dental Care, Real Estate, E-Commerce, Financial Services"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    What Your Business Does (AI Context)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what your business does or specific offerings to compare..."
                    value={formData.client_business_description || currentBusinessDesc}
                    onChange={(e) => setFormData({ ...formData, client_business_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Auto-detected from your business profile & AI context. Customize to benchmark specific products.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Specific Observations or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. They take hours to reply on WhatsApp, have higher pricing, but strong Instagram reels."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Auditing Competitor...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Full AI Intelligence</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DETAILED BATTLE-CARD & PLAYBOOK MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full my-auto overflow-hidden max-h-[92vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {activeAnalysis.industry || 'Competitor'}
                    </span>
                    <span className="text-xs text-slate-400">vs <span className="font-semibold text-slate-700 dark:text-slate-300">{activeAnalysis.client_business_name || currentBusinessName || 'Your Business'}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {activeAnalysis.competitor_name}
                    </h2>
                    {activeAnalysis.competitor_website && (
                      <a
                        href={activeAnalysis.competitor_website.startsWith('http') ? activeAnalysis.competitor_website : `https://${activeAnalysis.competitor_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Open Competitor Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveAnalysis(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto shrink-0">
                {[
                  { id: 'audit', label: 'Automation & Speed Audit', icon: Zap },
                  { id: 'swot', label: 'SWOT Matrix', icon: Shield },
                  { id: 'pricing', label: 'Pricing & Battle-Card', icon: BarChart3 },
                  { id: 'playbook', label: 'Winning Playbook', icon: Sparkles, highlight: true },
                  { id: 'summary', label: 'Profile & Brand Overview', icon: Building2 }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                        isActive 
                          ? tab.highlight 
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5' 
                            : 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                          : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 1: AUTOMATION & SPEED AUDIT */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    {/* Top Benchmark Meter */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                          <Zap className="w-4 h-4" />
                          <span>Competitive Advantage Benchmark</span>
                        </span>
                        <h3 className="text-xl font-bold">
                          {activeAnalysis.analysis_data?.advantage_headline || `${activeAnalysis.client_business_name || currentBusinessName || 'You'} Hold a ${activeAnalysis.advantage_score || 75}% Competitive Advantage`}
                        </h3>
                        <p className="text-xs text-slate-300 max-w-lg">
                          {activeAnalysis.analysis_data?.advantage_summary || `While ${activeAnalysis.competitor_name} struggles with manual responses and customer friction, ${activeAnalysis.client_business_name || currentBusinessName || 'your business'} delivers instant engagement and superior value.`}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center bg-slate-800 shadow-inner">
                          <span className="text-3xl font-extrabold text-emerald-400">{activeAnalysis.advantage_score || 75}%</span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2 font-medium">Competitive Edge Score</span>
                      </div>
                    </div>

                    {/* Channel & Audit Cards */}
                    {activeAnalysis.analysis_data?.automation_audit && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct / WhatsApp Presence</span>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>{activeAnalysis.analysis_data.automation_audit.whatsapp_presence}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {activeAnalysis.analysis_data.automation_audit.whatsapp_takeaway || 'Engage clients directly with automated responses and 24/7 verified channel support.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Response Speed</span>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span>{activeAnalysis.analysis_data.automation_audit.lead_response_speed}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {activeAnalysis.analysis_data.automation_audit.speed_takeaway || `Competitor response latency vs your instant sub-5 second lead engagement.`}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking & Sales Friction</span>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" />
                            <span>{activeAnalysis.analysis_data.automation_audit.booking_friction} Friction</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {activeAnalysis.analysis_data.automation_audit.friction_takeaway || 'Eliminate back-and-forth scheduling with direct consultation booking and checkout links.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">After-Hours Inquiries</span>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Bot className="w-4 h-4 text-purple-500" />
                            <span>{activeAnalysis.analysis_data.automation_audit.after_hours_coverage}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {activeAnalysis.analysis_data.automation_audit.coverage_takeaway || `Capture high-intent leads that search evenings and weekends while ${activeAnalysis.competitor_name} staff is offline.`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Critical Gaps Section */}
                    {activeAnalysis.analysis_data?.automation_audit?.critical_gaps && (
                      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Identified Competitor Blindspots & Gaps to Exploit</span>
                        </div>
                        <div className="space-y-2">
                          {activeAnalysis.analysis_data.automation_audit.critical_gaps.map((gap, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{gap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 2: SWOT MATRIX */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeTab === 'swot' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Strengths (Where {activeAnalysis.competitor_name} Dominates)</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {(activeAnalysis.analysis_data?.swot?.strengths || ['Established brand name', 'Solid offline presence']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Weaknesses (Where {activeAnalysis.competitor_name} Is Vulnerable)</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {(activeAnalysis.analysis_data?.swot?.weaknesses || ['Slow digital follow-up', 'High manual overhead']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                        <Compass className="w-4 h-4" />
                        <span>Opportunities (Market Openings for {activeAnalysis.client_business_name || currentBusinessName})</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {(activeAnalysis.analysis_data?.swot?.opportunities || ['Offer instant quotes & discovery', 'Provide 24/7 self-service']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Threats (From {activeAnalysis.competitor_name} to Anticipate)</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {(activeAnalysis.analysis_data?.swot?.threats || ['Price cutting wars', 'Aggressive local marketing']).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 3: PRICING & BATTLE-CARD */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeTab === 'pricing' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Market Positioning</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                          {activeAnalysis.analysis_data?.pricing_offers?.positioning || 'Mid-Market'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pricing Model</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                          {activeAnalysis.analysis_data?.pricing_offers?.pricing_model || 'Standard Quotes'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Primary Target</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block truncate">
                          {activeAnalysis.analysis_data?.competitor_summary?.target_audience || 'Local Customers'}
                        </span>
                      </div>
                    </div>

                    {/* Exploit Gap Highlight */}
                    {activeAnalysis.analysis_data?.pricing_offers?.gap_to_exploit && (
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1.5">
                          <Flame className="w-4 h-4" />
                          <span>The Pricing & Value Proposition Gap to Exploit</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                          {activeAnalysis.analysis_data.pricing_offers.gap_to_exploit}
                        </p>
                      </div>
                    )}

                    {/* Known Key Offers */}
                    {activeAnalysis.analysis_data?.pricing_offers?.key_offers && (
                      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Detected Competitor Packages & Offers
                        </span>
                        <div className="space-y-1.5">
                          {activeAnalysis.analysis_data.pricing_offers.key_offers.map((offer, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{offer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 4: UWO WINNING PLAYBOOK */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeTab === 'playbook' && (
                  <div className="space-y-6">
                    {/* Playbook Header */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {activeAnalysis.analysis_data?.winning_playbook?.title || activeAnalysis.analysis_data?.uwoconnect_playbook?.title || `${activeAnalysis.client_business_name || currentBusinessName} Victory Playbook`}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Deploy these high-impact strategies to directly convert prospects considering {activeAnalysis.competitor_name}.
                        </p>
                      </div>
                    </div>

                    {/* Quick Wins */}
                    {(activeAnalysis.analysis_data?.winning_playbook?.quick_wins || activeAnalysis.analysis_data?.uwoconnect_playbook?.quick_wins) && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                          3 Immediate Execution Steps
                        </span>
                        <div className="grid grid-cols-1 gap-3">
                          {(activeAnalysis.analysis_data.winning_playbook?.quick_wins || activeAnalysis.analysis_data.uwoconnect_playbook?.quick_wins).map((win, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-start gap-3">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                #{idx + 1}
                              </span>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{win}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Flow */}
                    {(activeAnalysis.analysis_data?.winning_playbook?.recommended_flow || activeAnalysis.analysis_data?.uwoconnect_playbook?.recommended_flow) && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                          Recommended Flow Architecture
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          {activeAnalysis.analysis_data.winning_playbook?.recommended_flow || activeAnalysis.analysis_data.uwoconnect_playbook?.recommended_flow}
                        </p>
                        
                        <div className="pt-2 flex items-center gap-3">
                          <Link
                            href="/client/workflows"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Create This in Workflows</span>
                          </Link>

                          <Link
                            href="/client/campaigns"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Launch Broadcast Campaign</span>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Ready Hook Script */}
                    {(activeAnalysis.analysis_data?.winning_playbook?.hook_script || activeAnalysis.analysis_data?.uwoconnect_playbook?.hook_script) && (
                      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Copy className="w-3.5 h-3.5" />
                            <span>Ready-to-Use High-Converting Opener / Hook</span>
                          </span>

                          <button
                            onClick={() => handleCopyHook(activeAnalysis.analysis_data.winning_playbook?.hook_script || activeAnalysis.analysis_data.uwoconnect_playbook?.hook_script)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          >
                            {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedHook ? 'Copied!' : 'Copy Script'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                          &ldquo;{activeAnalysis.analysis_data.winning_playbook?.hook_script || activeAnalysis.analysis_data.uwoconnect_playbook?.hook_script}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TAB 5: PROFILE & BRAND OVERVIEW */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Core Offering</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                          {activeAnalysis.analysis_data?.competitor_summary?.core_offering || 'Standard services'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Operational Scale</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                          {activeAnalysis.analysis_data?.competitor_summary?.estimated_scale || 'Local / Regional'}
                        </p>
                      </div>
                    </div>

                    {activeAnalysis.notes && (
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Your Custom Notes</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">
                          {activeAnalysis.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400">
                  Analysis powered by UwoConnect AI Intelligence Engine
                </span>

                <button
                  onClick={() => setActiveAnalysis(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Close Battle-Card
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

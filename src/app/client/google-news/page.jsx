'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Search, Globe, Sparkles, ExternalLink, RefreshCw, 
  Loader2, Copy, Check, MessageSquare, Send, Tag, Settings, SlidersHorizontal, BookOpen, Layers
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleNewsConfigModal, { GoogleNewsIcon } from '@/components/channels/GoogleNewsConfigModal';
import { API_BASE_URL } from '@/config/apiConfig';

const CATEGORIES = [
  { id: '', name: '🔥 Top Stories' },
  { id: 'TECHNOLOGY', name: '💻 Technology' },
  { id: 'BUSINESS', name: '📈 Business' },
  { id: 'WORLD', name: '🌍 World' },
  { id: 'ENTERTAINMENT', name: '🎬 Entertainment' },
  { id: 'SPORTS', name: '⚽ Sports' },
  { id: 'SCIENCE', name: '🚀 Science' },
  { id: 'HEALTH', name: '🏥 Health' },
];

export default function GoogleNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('TECHNOLOGY');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // AI Summary Drawer states
  const [aiOutput, setAiOutput] = useState('');
  const [aiAction, setAiAction] = useState('SUMMARIZE'); // SUMMARIZE, BROADCAST, SOCIAL
  const [generatingAI, setGeneratingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Settings modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [clientConfig, setClientConfig] = useState(null);
  const [toast, setToast] = useState(null);

  const apiUrl = API_BASE_URL;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNews = async (overrideCategory = activeCategory, overrideQuery = searchQuery) => {
    setLoading(true);
    const token = localStorage.getItem('uwo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      let endpoint = `${apiUrl}/api/google-news/feed?`;
      if (overrideQuery.trim()) {
        endpoint += `query=${encodeURIComponent(overrideQuery.trim())}`;
      } else if (overrideCategory) {
        endpoint += `category=${overrideCategory}`;
      }

      const res = await axios.get(endpoint, { headers });
      if (res.data && res.data.articles) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error('Error fetching Google News feed:', err);
      showToast('Failed to load Google News feed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${apiUrl}/api/google-news/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setClientConfig(res.data);
        if (res.data.default_topic) {
          setActiveCategory(res.data.default_topic);
          fetchNews(res.data.default_topic, '');
          return;
        }
      }
    } catch (err) {
      console.warn('Could not load news settings:', err);
    }
    fetchNews(activeCategory, '');
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    fetchNews(catId, '');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveCategory('');
    fetchNews('', searchQuery);
  };

  const handleGenerateAI = async (article, actionType = 'SUMMARIZE') => {
    setSelectedArticle(article);
    setAiAction(actionType);
    setGeneratingAI(true);
    setAiOutput('');

    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.post(
        `${apiUrl}/api/google-news/summarize`,
        {
          title: article.title,
          snippet: article.snippet,
          source: article.source,
          link: article.link,
          action: actionType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.ai_output) {
        setAiOutput(res.data.ai_output);
      }
    } catch (err) {
      console.error('Error generating AI output:', err);
      showToast('Failed to generate AI summary.', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const [sendingNewsAlert, setSendingNewsAlert] = useState({});
  const [sendChannels, setSendChannels] = useState({ WHATSAPP: true, FACEBOOK: true, INSTAGRAM: true });

  const toggleChannel = (ch) => setSendChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  const selectedChannelsList = Object.keys(sendChannels).filter(k => sendChannels[k]);

  const handleSendNewsAlert = async (article, customText = '') => {
    const channels = Object.keys(sendChannels).filter(k => sendChannels[k]);
    if (channels.length === 0) {
      showToast('Please select at least one channel to broadcast to.', 'error');
      return;
    }
    setSendingNewsAlert(prev => ({ ...prev, [article.link]: true }));
    const token = localStorage.getItem('uwo_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${apiUrl}/api/google-news/send-alert`,
        {
          title: article.title,
          snippet: article.snippet,
          link: article.link,
          source: article.source,
          custom_text: customText,
          send_channels: channels
        },
        { headers }
      );
      if (res.data && !res.data.error) {
        const { whatsapp_count = 0, facebook_count = 0, instagram_count = 0, sent_count = 0, fb_error, ig_error } = res.data;
        const parts = [];
        if (whatsapp_count > 0) parts.push(`📱 WhatsApp: ${whatsapp_count}`);
        if (facebook_count > 0) parts.push(`💙 Facebook: ${facebook_count}`);
        if (instagram_count > 0) parts.push(`📸 Instagram: ${instagram_count}`);
        const detail = parts.length > 0 ? parts.join(', ') : `${sent_count} recipients`;
        showToast(`✅ Broadcasted! ${detail}`);
        // Show per-channel errors if any
        if (fb_error && facebook_count === 0) {
          setTimeout(() => showToast(`💙 FB: ${fb_error}`, 'error'), 1200);
        }
        if (ig_error && instagram_count === 0) {
          setTimeout(() => showToast(`📸 IG: ${ig_error}`, 'error'), 2400);
        }
      } else {
        showToast(res.data.error || 'Failed to send news alert.', 'error');
      }
    } catch (err) {
      console.error('Error sending news text alert:', err);
      showToast('Error sending news alert.', 'error');
    } finally {
      setSendingNewsAlert(prev => ({ ...prev, [article.link]: false }));
    }
  };

  const handleCopyAI = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 pb-16 space-y-4 sm:space-y-6 animate-fadeIn w-full max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl border ${
            toast.type === 'error' ? 'bg-rose-500 text-white border-rose-600' : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* 1. Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shrink-0">
                <GoogleNewsIcon size={24} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight flex flex-wrap items-center gap-2">
                  Google News Hub
                  <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-emerald-400/30 shrink-0">
                    LIVE RSS
                  </span>
                </h1>
                <p className="text-xs text-blue-100/90 font-medium leading-relaxed">
                  Real-time trend monitoring, keyword search & AI content summaries
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 z-10 w-full sm:w-auto">
            <button
              onClick={() => fetchNews(activeCategory, searchQuery)}
              className="flex-1 sm:flex-initial justify-center px-3 sm:px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Feed</span>
            </button>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Settings size={13} />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* 2. Controls & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 sm:top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or topic on Google News..."
              className="w-full pl-9 sm:pl-10 pr-20 sm:pr-24 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 sm:right-1.5 sm:top-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  activeCategory === cat.id && !searchQuery
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Main Articles Grid & AI Panel Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left / Main Articles List (8 cols) */}
          <div className={selectedArticle ? 'lg:col-span-7 space-y-3 sm:space-y-4' : 'lg:col-span-12 space-y-3 sm:space-y-4'}>
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${activeCategory || 'TOP'} Stories`} ({articles.length})
              </span>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl sm:rounded-2xl border border-slate-200/80">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-500">Fetching Google News XML Feed...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 space-y-2">
                <Newspaper size={36} className="text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No news articles found for this topic.</p>
                <p className="text-[11px] text-slate-400">Try searching for a different keyword or selecting another topic tab.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {articles.map((article, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-2.5 sm:space-y-3 ${
                      selectedArticle?.link === article.link 
                        ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-extrabold border border-blue-100 truncate max-w-[120px] sm:max-w-[140px] shrink-0">
                          {article.source}
                        </span>
                        <span className="shrink-0">{article.pub_date ? new Date(article.pub_date).toLocaleDateString() : 'Recent'}</span>
                      </div>

                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs sm:text-sm font-black text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 block leading-snug break-words"
                      >
                        {article.title}
                      </a>

                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed break-words">
                        {article.snippet}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        Read Original <ExternalLink size={10} />
                      </a>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleGenerateAI(article, 'SUMMARIZE')}
                          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={11} />
                          AI Summary
                        </button>
                        <button
                          onClick={() => handleGenerateAI(article, 'BROADCAST')}
                          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={11} />
                          Broadcast
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right / AI Drawer Drawer (5 cols) */}
          {selectedArticle && (
            <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg space-y-3 sm:space-y-4 h-fit sticky top-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-600" size={18} />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">AI News Assistant</span>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] font-extrabold text-blue-600 uppercase block">{selectedArticle.source}</span>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{selectedArticle.title}</h4>
              </div>

              {/* Mode Select Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'SUMMARIZE', label: 'Summary' },
                  { id: 'BROADCAST', label: 'WhatsApp' },
                  { id: 'SOCIAL', label: 'Social Post' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleGenerateAI(selectedArticle, tab.id)}
                    className={`py-1.5 text-[10px] font-extrabold rounded-lg transition-all ${
                      aiAction === tab.id
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Output Content Box */}
              <div className="space-y-2">
                {generatingAI ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="text-xs font-bold text-slate-500">Generating AI Content...</span>
                  </div>
                ) : (
                  <>
                    <textarea
                      readOnly
                      rows={10}
                      value={aiOutput}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none leading-relaxed font-mono"
                    />

                    <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                      {/* Channel selector pills */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase">Send to:</span>
                        {[
                          { id: 'WHATSAPP', label: '📱 WA', color: 'emerald' },
                          { id: 'FACEBOOK', label: '💙 FB', color: 'blue' },
                          { id: 'INSTAGRAM', label: '📸 IG', color: 'pink' },
                        ].map(({ id, label, color }) => (
                          <button
                            key={id}
                            onClick={() => toggleChannel(id)}
                            className={`px-2 py-1 rounded-lg text-[9px] font-extrabold border transition-all ${
                              sendChannels[id]
                                ? color === 'emerald' ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                  : color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-300'
                                  : 'bg-pink-100 text-pink-700 border-pink-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyAI}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>

                        <button
                          disabled={sendingNewsAlert[selectedArticle.link]}
                          onClick={() => handleSendNewsAlert(selectedArticle, aiOutput)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {sendingNewsAlert[selectedArticle.link] ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <>
                              <Send size={14} />
                              <span>Broadcast</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        <GoogleNewsConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSaved={() => fetchSettings()}
        />
      </div>
    </DashboardLayout>
  );
}

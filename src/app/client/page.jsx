'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Zap, TrendingUp, ArrowUpRight, Loader2, GitBranch, ShieldCheck, 
  Target, Activity, ChevronRight, Smartphone, FileText, BarChart3, Users, Clock, Plus,
  Share2, FolderKanban, Package, FileCode, Calendar, Filter,
  Newspaper, Send, ExternalLink, Sparkles, Check
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FeatureDetailDrawer from '@/components/dashboard/FeatureDetailDrawer';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import { cn } from '@/lib/utils';

const ClientOverview = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [contacts, setContacts] = useState([]);

  // Time Range Filter State
  const [selectedPeriod, setSelectedPeriod] = useState('30d'); // '7d' | '30d' | '90d' | '1y' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timeFilterPresets = {
    '7d': {
      title: 'Last 7 Days Growth',
      labels: ['Day 1', 'Day 3', 'Day 5', 'Today'],
      path: 'M 0 140 Q 120 90, 250 40 T 500 15',
      fill: 'M 0 140 Q 120 90, 250 40 T 500 15 L 500 170 L 0 170 Z',
      endpoint: { x: 500, y: 15 }
    },
    '30d': {
      title: 'Last 30 Days Growth',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4 (Today)'],
      path: 'M 0 130 Q 120 40, 250 90 T 500 20',
      fill: 'M 0 130 Q 120 40, 250 90 T 500 20 L 500 170 L 0 170 Z',
      endpoint: { x: 500, y: 20 }
    },
    '90d': {
      title: 'Last 90 Days Growth',
      labels: ['Month 1', 'Month 2', 'Month 3 (Today)'],
      path: 'M 0 150 Q 150 110, 300 50 T 500 30',
      fill: 'M 0 150 Q 150 110, 300 50 T 500 30 L 500 170 L 0 170 Z',
      endpoint: { x: 500, y: 30 }
    },
    '1y': {
      title: 'Last 12 Months Growth',
      labels: ['Q1', 'Q2', 'Q3', 'Q4 (Today)'],
      path: 'M 0 160 Q 140 120, 280 60 T 500 10',
      fill: 'M 0 160 Q 140 120, 280 60 T 500 10 L 500 170 L 0 170 Z',
      endpoint: { x: 500, y: 10 }
    },
    'custom': {
      title: customStartDate && customEndDate ? `Custom Range: ${customStartDate} to ${customEndDate}` : 'Custom Date Filter',
      labels: [customStartDate || 'Start Date', 'Mid-Period', customEndDate || 'End Date'],
      path: 'M 0 120 Q 130 50, 270 80 T 500 25',
      fill: 'M 0 120 Q 130 50, 270 80 T 500 25 L 500 170 L 0 170 Z',
      endpoint: { x: 500, y: 25 }
    }
  };

  const currentChartConfig = timeFilterPresets[selectedPeriod] || timeFilterPresets['30d'];

  const [resourceCounts, setResourceCounts] = useState({
    connectors: 5,
    projects: 8,
    teamMembers: 4,
    pdfs: 12,
    products: 24
  });
  const [statsData, setStatsData] = useState({
    totalConversations: 0,
    automationRuns: 0,
    activeUsers: 0,
    avgResponse: '14s'
  });
  const [ytData, setYtData] = useState(null);
  const [dashboardNews, setDashboardNews] = useState([]);
  const [sendingNewsAlert, setSendingNewsAlert] = useState({});
  const [toast, setToast] = useState(null);
  const [activeFeatureDrawer, setActiveFeatureDrawer] = useState(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState(null);
  const router = useRouter();

  // Map route paths to feature IDs for the drawer
  const pathToFeatureId = {
    '/client/channels': 'connectors',
    '/client/workflows': 'workflows',
    '/client/team': 'team',
    '/client/knowledge': 'knowledge',
    '/client/catalog': 'catalog',
    '/client/campaigns': 'broadcasts',
    '/client/inbox': 'inbox',
    '/client/youtube': 'youtube',
    '/client/crm': 'crm',
    '/client/automations': 'automations',
    '/client/orders': 'orders',
    '/client/reports': 'reports',
    '/client/google-news': 'google-news',
    '/client/settings': 'settings',
    '/client/support': 'support',
  };

  const handleCardClick = (path) => {
    const featureId = pathToFeatureId[path];
    if (featureId) {
      setActiveFeatureDrawer(featureId);
    } else {
      router.push(path);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSendNewsAlert = async (article) => {
    setSendingNewsAlert(prev => ({ ...prev, [article.link]: true }));
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/google-news/send-alert`,
        {
          title: article.title,
          snippet: article.snippet,
          link: article.link,
          source: article.source
        },
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast(`📱 News text alert sent to ${res.data.sent_count} contacts!`);
      } else {
        showToast(res.data.error || 'Failed to send news text alert.', 'error');
      }
    } catch (err) {
      console.error('Error sending news text alert:', err);
      showToast('Error sending news text alert.', 'error');
    } finally {
      setSendingNewsAlert(prev => ({ ...prev, [article.link]: false }));
    }
  };

  useEffect(() => {
    // Load user name from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        let name = parsed.name || parsed.first_name || parsed.username || parsed.email || 'Abha';
        if (name.includes('@')) {
          name = name.split('@')[0];
          name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        setUserName(name);
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/client/stats`,
          { headers }
        );
        if (res.data) {
          setStatsData(res.data);
          if (res.data.resourceCounts) {
            setResourceCounts(prev => ({ ...prev, ...res.data.resourceCounts }));
          }
        }
      } catch (err) {
        console.warn("Dashboard stats notice:", err.message);
      }

      try {
        const ytRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/analytics`,
          { headers }
        );
        if (ytRes.data && !ytRes.data.error) {
          setYtData(ytRes.data);
        }
      } catch (err) {
        console.warn("YouTube analytics notice:", err.message);
      }

      try {
        const contactsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/contacts/`,
          { headers }
        );
        setContacts(contactsRes.data || []);
      } catch (err) {
        console.warn("Contacts fetch notice:", err.message);
      }

      try {
        const newsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/google-news/feed?query=technology`,
          { headers }
        );
        if (newsRes.data && newsRes.data.articles) {
          setDashboardNews(newsRes.data.articles.slice(0, 4));
        }
      } catch (err) {
        console.warn("News feed notice:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const primaryMetrics = [
    {
      title: 'Connected Connectors',
      count: `${resourceCounts.connectors} Connectors`,
      subtitle: 'WhatsApp, IG, Telegram & Email',
      icon: Share2,
      path: '/client/channels',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Projects & Workflows',
      count: `${resourceCounts.projects} Active Flows`,
      subtitle: 'Automated routing & AI replies',
      icon: GitBranch,
      path: '/client/workflows',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Team Members',
      count: `${resourceCounts.teamMembers} Members`,
      subtitle: 'Active agents & supervisors',
      icon: Users,
      path: '/client/team',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  const secondaryMetrics = [
    {
      title: 'Knowledge Base PDFs',
      count: `${resourceCounts.pdfs} PDFs Uploaded`,
      subtitle: 'Trained documents & system KB',
      icon: FileText,
      path: '/client/knowledge',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      title: 'Catalog Products',
      count: `${resourceCounts.products} Products`,
      subtitle: 'E-commerce items & pricing inventory',
      icon: Package,
      path: '/client/catalog',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="CLIENT">
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="CLIENT">
      <div style={{ fontFamily: '"Times New Roman", Times, serif' }} className="max-w-7xl mx-auto pb-20 px-2 sm:px-4 md:px-0">
        
        {/* Welcome Section */}
        <div data-tour="dashboard-welcome" className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome, <span className="italic font-bold text-emerald-800">{userName}</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-xs sm:text-sm">Your automation command center is running smoothly.</p>
          </div>
          <button 
            data-tour="dashboard-launch-btn"
            onClick={() => router.push('/client/workflows')}
            className="mt-4 sm:mt-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <GitBranch size={16} /> Launch Workflow Builder
          </button>
        </div>

        {/* Option 2: 2-Row Compact Grid */}
        <div data-tour="dashboard-stats" className="space-y-4 mb-10">
          {/* Row 1: 3 Main Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {primaryMetrics.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.title}
                  onClick={() => handleCardClick(res.path)}
                  className="p-6 rounded-3xl glass-panel border border-white/80 hover-lift cursor-pointer flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border font-bold shadow-sm", res.color)}>
                      <Icon size={22} />
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                      {res.title}
                    </h4>
                    <span className="text-base font-black text-emerald-700 block">
                      {res.count}
                    </span>
                    <p className="text-xs text-slate-400 italic mt-1">
                      {res.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: 2 Secondary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {secondaryMetrics.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.title}
                  onClick={() => handleCardClick(res.path)}
                  className="p-6 rounded-3xl glass-panel border border-white/80 hover-lift cursor-pointer flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border font-bold shadow-sm", res.color)}>
                      <Icon size={22} />
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                      {res.title}
                    </h4>
                    <span className="text-base font-black text-emerald-700 block">
                      {res.count}
                    </span>
                    <p className="text-xs text-slate-400 italic mt-1">
                      {res.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* YouTube Channel Stats Widget */}
        {ytData && (
          <div className="mb-10 p-6 rounded-3xl glass-panel border border-red-100 bg-red-50/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {ytData.channel_thumbnail ? (
                  <img 
                    src={ytData.channel_thumbnail} 
                    alt={ytData.channel_name} 
                    className="w-16 h-16 rounded-full border-2 border-red-500 shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-500">
                    <span className="text-red-600 font-black text-xl">YT</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    {ytData.channel_name || 'YouTube Channel'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Linked YouTube Content & Analytics</p>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 bg-white/60 p-4 rounded-2xl border border-red-100/50 backdrop-blur-sm">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Subscribers</span>
                  <span className="text-lg font-black text-red-600">{ytData.subscribers?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Views</span>
                  <span className="text-lg font-black text-slate-800">{ytData.total_views?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Videos</span>
                  <span className="text-lg font-black text-slate-800">{ytData.video_count?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button 
                  onClick={() => handleCardClick('/client/youtube')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
                >
                  Manage Videos & Comments
                </button>
              </div>
            </div>

            {/* Latest Video Feature Row */}
            {ytData.latest_video && (
              <div className="mt-6 pt-6 border-t border-red-100/50 flex flex-col sm:flex-row items-center gap-4">
                {ytData.latest_video.thumbnail && (
                  <img 
                    src={ytData.latest_video.thumbnail} 
                    alt={ytData.latest_video.title} 
                    className="w-28 h-16 rounded-xl object-cover shadow-sm border border-slate-100"
                  />
                )}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Latest Upload</span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{ytData.latest_video.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">Published on {new Date(ytData.latest_video.published_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <a 
                    href={`https://www.youtube.com/watch?v=${ytData.latest_video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                  >
                    Watch Video <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Connected Channels & Industry News Widget */}
        <div className="mb-10 p-6 rounded-3xl glass-panel border border-blue-100 bg-blue-50/10 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
                <Newspaper size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  Live Connected Channels & Industry News
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-full">LIVE FEED</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time breaking updates matching your connected channels & topics</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/client/google-news')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              Open Full News Hub <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-600'}`}>
              {toast.msg}
            </div>
          )}

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {dashboardNews.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs font-medium">
                Loading live news updates...
              </div>
            ) : (
              dashboardNews.map((article, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-extrabold truncate max-w-[120px]">
                        {article.source}
                      </span>
                      <span>{article.pub_date ? new Date(article.pub_date).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-800 hover:text-blue-600 line-clamp-2 block leading-snug"
                    >
                      {article.title}
                    </a>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                    >
                      Read <ExternalLink size={10} />
                    </a>
                    <button
                      disabled={sendingNewsAlert[article.link]}
                      onClick={() => handleSendNewsAlert(article)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Send WhatsApp text alert to lead contacts"
                    >
                      {sendingNewsAlert[article.link] ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        <>
                          <Send size={11} />
                          <span>Send Text Alert</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Main Activity / Interactive Line Graph */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-12">
            <div className="glass-panel premium-shadow p-4 sm:p-8 relative overflow-hidden space-y-6">
              
              {/* Header & Time Filter Tabs */}
              <div className="flex flex-col space-y-4 border-b border-slate-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-600" />
                      Automation Performance
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mt-1 italic">
                      {currentChartConfig.title}
                    </p>
                  </div>

                  {/* Time Presets Switcher */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
                    {[
                      { id: '7d', label: '7 Days' },
                      { id: '30d', label: '30 Days' },
                      { id: '90d', label: '90 Days' },
                      { id: '1y', label: '1 Year' },
                      { id: 'custom', label: 'Custom' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedPeriod(tab.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
                          selectedPeriod === tab.id
                            ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range Picker Input (when 'custom' tab is selected) */}
                {selectedPeriod === 'custom' && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <Calendar size={15} />
                      <span>Select Date Range:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-400">to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Minimal Clean Line Chart */}
              <div className="h-56 relative w-full pt-2">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="cleanLineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00AB56" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00AB56" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#F8FAFC" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="170" x2="500" y2="170" stroke="#E2E8F0" strokeWidth="1" />

                  {/* Soft Light Gradient Area Fill */}
                  <path
                    d={currentChartConfig.fill}
                    fill="url(#cleanLineGrad)"
                    className="transition-all duration-500"
                  />

                  {/* Thin Crisp Line */}
                  <path
                    d={currentChartConfig.path}
                    fill="none"
                    stroke="#00AB56"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Single End Active Endpoint Dot */}
                  <circle cx={currentChartConfig.endpoint.x} cy={currentChartConfig.endpoint.y} r="4" fill="#00AB56" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Dynamic Date Labels */}
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mt-3 px-1">
                  {currentChartConfig.labels.map((lbl, idx) => (
                    <span key={idx}>{lbl}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Status Section */}
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-[32px] p-6 sm:p-8 text-slate-800 premium-shadow relative overflow-hidden border border-emerald-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-900">
                <Activity size={20} className="text-emerald-600" /> System Live
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">WhatsApp API</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100/50 text-[#047857] rounded-lg">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">RAG Knowledge</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100/50 text-[#047857] rounded-lg">TRAINED</span>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-sm font-bold text-slate-700">Facebook Messenger</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">LINK NEEDED</span>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-emerald-50 hover:bg-emerald-100/80 text-[#047857] transition-all rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-100">
                System Health Details
              </button>
            </div>
          </div>
        </div>

        {/* Feature Detail Drawer */}
        <FeatureDetailDrawer
          featureId={activeFeatureDrawer}
          isOpen={!!activeFeatureDrawer}
          onClose={() => setActiveFeatureDrawer(null)}
          onOpenGuide={(slug) => setActiveGuideSlug(slug)}
        />

        {/* Interactive Learning Guide Modal */}
        <LearningCenterModal
          guideSlug={activeGuideSlug}
          isOpen={!!activeGuideSlug}
          onClose={() => setActiveGuideSlug(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientOverview;

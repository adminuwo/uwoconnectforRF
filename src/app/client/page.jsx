'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Zap, TrendingUp, ArrowUpRight, Loader2, GitBranch, ShieldCheck, 
  Target, Activity, ChevronRight, Smartphone, FileText, BarChart3, Users, Clock, Plus,
  Share2, FolderKanban, Package, FileCode, Calendar, Filter,
  Newspaper, Send, ExternalLink, Sparkles, Check, Phone, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FeatureDetailDrawer from '@/components/dashboard/FeatureDetailDrawer';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import { useEntitlement } from '@/context/EntitlementContext';
import { useTheme } from '@/context/ThemeContext';
import AgencyAdminDashboard from './agency/page';

const ClientOverview = () => {
  const router = useRouter();
  const { entitlements } = useEntitlement();
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userState, setUserState] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [viewMode, setViewMode] = useState('agency'); // 'agency' | 'workspace'

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        // If Super Admin visits /client without impersonating, redirect to /admin
        if (u.role === 'ADMIN' && !localStorage.getItem('impersonation_session')) {
          router.push('/admin');
          return;
        }
        setUserName(u.name || u.first_name || u.username || u.business_name || 'User');
      } catch (e) {}
    }
  }, [router]);

  useEffect(() => {
    const handleUserUpdate = (e) => {
      const u = e?.detail || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {});
      if (u) {
        setUserState(u);
        const name = u.name || (u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.username || u.business_name || 'User'));
        if (name) setUserName(name);
      }
    };
    window.addEventListener('user_profile_updated', handleUserUpdate);
    window.addEventListener('profileUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('user_profile_updated', handleUserUpdate);
      window.removeEventListener('profileUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

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
    connectors: 0,
    projects: 0,
    teamMembers: 0,
    pdfs: 0,
    products: 0
  });
  const [statsData, setStatsData] = useState({
    totalConversations: 0,
    automationRuns: 0,
    activeUsers: 0,
    avgResponse: '14s'
  });
  const [ytData, setYtData] = useState(null);
  const [dashboardNews, setDashboardNews] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [sendingNewsAlert, setSendingNewsAlert] = useState({});
  const [toast, setToast] = useState(null);
  const [activeFeatureDrawer, setActiveFeatureDrawer] = useState(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState(null);

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
    const token = localStorage.getItem('uwo_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-news/send-alert`,
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
        let name = parsed.name || parsed.first_name || parsed.username || parsed.email || 'User';
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
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [statsRes, ytRes, contactsRes, newsRes, projectsRes, upcomingRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/client/stats`, { headers, timeout: 7000 }),
          axios.get(`${API_BASE_URL}/api/youtube/analytics`, { headers, timeout: 7000 }),
          axios.get(`${API_BASE_URL}/api/contacts/?limit=1`, { headers, timeout: 7000 }),
          axios.get(`${API_BASE_URL}/api/google-news/feed?query=technology`, { headers, timeout: 7000 }),
          axios.get(`${API_BASE_URL}/api/team/projects/`, { headers, timeout: 7000 }),
          axios.get(`${API_BASE_URL}/api/contacts/upcoming_followups/`, { headers, timeout: 7000 }),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStatsData(statsRes.value.data);
          if (statsRes.value.data.resourceCounts) {
            let resCounts = { ...statsRes.value.data.resourceCounts };
            if (!resCounts.connectors || resCounts.connectors === 0) {
              try {
                const cached = JSON.parse(localStorage.getItem('cached_client_channels') || '{}');
                const uClient = JSON.parse(localStorage.getItem('user') || '{}')?.client || {};
                const src = Object.keys(cached).length > 0 ? cached : uClient;
                let cCount = 0;
                if (src.whatsapp_enabled || src.phone_number || src.whatsapp_access_token || src.whatsapp_config) cCount++;
                if (src.facebook_enabled || src.facebook_config) cCount++;
                if (src.instagram_enabled || src.instagram_config) cCount++;
                if (src.gmail_enabled || src.gmail_config) cCount++;
                if (src.outlook_enabled || src.outlook_config) cCount++;
                if (src.youtube_enabled || src.youtube_config) cCount++;
                if (src.google_news_enabled || src.google_news_config) cCount++;
                if (src.google_calendar_enabled || src.google_calendar_config) cCount++;
                if (src.google_sheets_enabled || src.google_sheets_config) cCount++;
                if (src.google_docs_enabled || src.google_slides_enabled || src.google_docs_config) cCount++;
                if (src.onedrive_enabled || src.onedrive_config) cCount++;
                if (src.zoho_enabled || src.zoho_config) cCount++;
                if (cCount > 0) resCounts.connectors = cCount;
              } catch (e) {}
            }
            setResourceCounts(prev => ({ ...prev, ...resCounts }));
          }
        }

        if (ytRes.status === 'fulfilled' && ytRes.value?.data && !ytRes.value.data.error) {
          setYtData(ytRes.value.data);
        }

        if (contactsRes.status === 'fulfilled' && contactsRes.value?.data) {
          setContacts(contactsRes.value.data || []);
        }

        if (newsRes.status === 'fulfilled' && newsRes.value?.data?.articles) {
          setDashboardNews(newsRes.value.data.articles.slice(0, 4));
        }

        if (projectsRes.status === 'fulfilled' && projectsRes.value?.data) {
          const rawProjs = Array.isArray(projectsRes.value.data) ? projectsRes.value.data : (projectsRes.value.data.results || []);
          setAssignedProjects(rawProjs);
        }

        if (upcomingRes.status === 'fulfilled' && Array.isArray(upcomingRes.value?.data)) {
          setUpcomingFollowUps(upcomingRes.value.data);
        }
      } catch (err) {
        console.warn("Dashboard fetch notice:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    window.addEventListener('channelsUpdated', fetchDashboardData);
    return () => {
      window.removeEventListener('channelsUpdated', fetchDashboardData);
    };
  }, []);

  const primaryMetrics = [
    {
      title: 'Connected Connectors',
      count: `${resourceCounts.connectors} Connectors`,
      subtitle: 'WhatsApp, IG, Facebook & Email',
      icon: Share2,
      path: '/client/channels',
      color: isDark ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/70' : 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Projects & Workflows',
      count: `${resourceCounts.projects} Active Flows`,
      subtitle: 'Automated routing & AI replies',
      icon: GitBranch,
      path: '/client/workflows',
      color: isDark ? 'bg-blue-950/70 text-blue-400 border-blue-800/70' : 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Team Members',
      count: `${resourceCounts.teamMembers} Members`,
      subtitle: 'Active agents & supervisors',
      icon: Users,
      path: '/client/team',
      color: isDark ? 'bg-purple-950/70 text-purple-400 border-purple-800/70' : 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  const secondaryMetrics = [
    {
      title: 'Knowledge Base PDFs',
      count: `${resourceCounts.pdfs} PDFs Uploaded`,
      subtitle: 'Trained documents & system KB',
      icon: FileText,
      path: '/client/knowledge',
      color: isDark ? 'bg-teal-950/70 text-teal-400 border-teal-800/70' : 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      title: 'Catalog Products',
      count: `${resourceCounts.products} Products`,
      subtitle: 'E-commerce items & pricing inventory',
      icon: Package,
      path: '/client/catalog',
      color: isDark ? 'bg-amber-950/70 text-amber-400 border-amber-800/70' : 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  if (!mounted || loading) {
    return (
      <DashboardLayout role="CLIENT">
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  const userObj = userState || (mounted && typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {});
  const activePlanName = entitlements?.plan?.name || userObj?.client?.plan || userObj?.plan || '';
  const isAgencyUser = Boolean(
    activePlanName.toUpperCase() === 'AGENCY' ||
    userObj?.plan?.toUpperCase() === 'AGENCY' ||
    userObj?.client?.plan?.toUpperCase() === 'AGENCY' ||
    userObj?.is_agency ||
    userObj?.client?.is_agency ||
    userObj?.client?.white_label_domain
  );

  return (
    <DashboardLayout role="CLIENT">
      {isAgencyUser && (
        <div className={cn(
          "w-full max-w-full px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between border-b pb-3 mb-2 font-sans transition-colors",
          isDark ? "border-slate-800" : "border-slate-200/80"
        )}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('agency')}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                viewMode === 'agency'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black"
                  : isDark
                    ? "bg-slate-800 text-slate-300 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
              )}
            >
              <ShieldCheck size={14} />
              <span>Agency Reseller Command Center</span>
            </button>

            <button
              onClick={() => setViewMode('workspace')}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                viewMode === 'workspace'
                  ? (isDark ? "bg-white text-slate-900 shadow-sm font-black" : "bg-slate-900 text-white shadow-sm font-black")
                  : isDark
                    ? "bg-slate-800 text-slate-300 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
              )}
            >
              <Zap size={14} />
              <span>My Agency Personal Tools</span>
            </button>
          </div>
        </div>
      )}

      {isAgencyUser && viewMode === 'agency' ? (
        <AgencyAdminDashboard />
      ) : (
        <div className="w-full max-w-full p-4 sm:p-6 lg:p-8 pb-20 font-sans">
          
          {/* Welcome Section */}
          <div data-tour="dashboard-welcome" className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b transition-colors",
            isDark ? "border-slate-800" : "border-slate-100"
          )}>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border",
                  isDark
                    ? "bg-emerald-950/70 border-emerald-800/70 text-emerald-300"
                    : "bg-emerald-50 border-emerald-200/60 text-emerald-800"
                )}>
                  🏢 {userObj?.client?.business_name || 'My Workspace'}
                </span>
                {activePlanName && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-300"
                      : "bg-slate-100 border-transparent text-slate-700"
                  )}>
                    {activePlanName} Plan
                  </span>
                )}
              </div>
              <h1 className={cn("text-2xl sm:text-3xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-slate-900")}>
                Welcome, <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>{userName}</span>
              </h1>
              <p className={cn("font-medium text-xs sm:text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Your multi-channel communication & automation command center.</p>
            </div>
            <button 
              data-tour="dashboard-launch-btn"
              onClick={() => router.push('/client/workflows')}
              className="mt-4 sm:mt-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
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
                  className={cn(
                    "p-6 rounded-3xl cursor-pointer flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden shadow-sm hover:shadow-md",
                    isDark
                      ? "bg-[#0f172a] hover:bg-[#1e293b] border border-slate-800 hover:border-emerald-500/40 shadow-xl"
                      : "glass-panel border border-white/80 hover-lift"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border font-bold shadow-sm transition-transform group-hover:scale-105", res.color)}>
                      <Icon size={22} />
                    </div>
                    <ChevronRight size={18} className={cn("transition-all group-hover:translate-x-1", isDark ? "text-slate-500 group-hover:text-emerald-400" : "text-slate-300 group-hover:text-slate-900")} />
                  </div>

                  <div>
                    <h4 className={cn("text-sm font-bold transition-colors mb-1", isDark ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-700")}>
                      {res.title}
                    </h4>
                    <span className={cn("text-base font-black block", isDark ? "text-emerald-400" : "text-emerald-700")}>
                      {res.count}
                    </span>
                    <p className={cn("text-xs italic mt-1", isDark ? "text-slate-400" : "text-slate-400")}>
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
                  className={cn(
                    "p-6 rounded-3xl cursor-pointer flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden shadow-sm hover:shadow-md",
                    isDark
                      ? "bg-[#0f172a] hover:bg-[#1e293b] border border-slate-800 hover:border-emerald-500/40 shadow-xl"
                      : "glass-panel border border-white/80 hover-lift"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border font-bold shadow-sm transition-transform group-hover:scale-105", res.color)}>
                      <Icon size={22} />
                    </div>
                    <ChevronRight size={18} className={cn("transition-all group-hover:translate-x-1", isDark ? "text-slate-500 group-hover:text-emerald-400" : "text-slate-300 group-hover:text-slate-900")} />
                  </div>

                  <div>
                    <h4 className={cn("text-sm font-bold transition-colors mb-1", isDark ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-700")}>
                      {res.title}
                    </h4>
                    <span className={cn("text-base font-black block", isDark ? "text-emerald-400" : "text-emerald-700")}>
                      {res.count}
                    </span>
                    <p className={cn("text-xs italic mt-1", isDark ? "text-slate-400" : "text-slate-400")}>
                      {res.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Assigned Projects & Milestones Widget ── */}
        <div className={cn(
          "mb-10 p-6 rounded-3xl shadow-sm relative overflow-hidden border transition-colors",
          isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200/90"
        )}>
          <div className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b mb-5",
            isDark ? "border-slate-800" : "border-slate-100"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center border font-bold",
                isDark ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                <FolderKanban size={20} />
              </div>
              <div>
                <h3 className={cn("text-base font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                  My Assigned Projects & Milestones
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded-full border",
                    isDark ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}>
                    {assignedProjects.length} Active
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Live tracking of your assigned projects, milestone progress, and deliverables.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/client/reports')}
                className={cn(
                  "px-3.5 py-2 font-bold rounded-xl text-xs transition-all border cursor-pointer flex items-center gap-1.5",
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                <FileText size={13} /> Submit Report
              </button>
              <button
                onClick={() => router.push('/client/team')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                View All Projects <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {assignedProjects.length === 0 ? (
            <div className={cn(
              "text-center py-8 rounded-2xl border border-dashed text-xs",
              isDark ? "bg-slate-800/40 border-slate-800 text-slate-400" : "bg-slate-50/50 border-slate-200 text-slate-400"
            )}>
              <p className={cn("font-semibold", isDark ? "text-slate-300" : "text-slate-600")}>No assigned projects yet.</p>
              <p className={cn("text-[11px] mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>When the admin assigns you to a workspace project, it will appear here with live milestones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedProjects.map((p) => {
                const milestones = p.milestones || [];
                const completedMilestones = milestones.filter(m => m.completed || m.status === 'COMPLETED').length;
                const totalMilestones = milestones.length;
                const progressPercent = totalMilestones > 0 
                  ? Math.round((completedMilestones / totalMilestones) * 100) 
                  : (p.progress_percentage || 0);

                return (
                  <div
                    key={p.id || p._id}
                    onClick={() => router.push('/client/team')}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-3",
                      isDark
                        ? "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-emerald-500/40"
                        : "bg-slate-50/60 hover:bg-slate-50 border-slate-200/80 hover:border-emerald-300"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          p.status === 'COMPLETED' ? (isDark ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-emerald-100 text-emerald-800") :
                          p.status === 'IN_PROGRESS' ? (isDark ? "bg-blue-950 text-blue-300 border border-blue-800" : "bg-blue-100 text-blue-800") :
                          (isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700")
                        )}>
                          {p.status?.replace('_', ' ') || 'PLANNING'}
                        </span>
                        {p.deadline && (
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10} /> {p.deadline.split('T')[0]}
                          </span>
                        )}
                      </div>

                      <h4 className={cn("font-bold text-sm mt-2 transition-colors line-clamp-1", isDark ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-700")}>
                        {p.name}
                      </h4>
                      {p.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className={cn("flex justify-between text-[11px] font-bold", isDark ? "text-slate-300" : "text-slate-700")}>
                        <span className="text-slate-400 font-semibold">{completedMilestones} / {totalMilestones} Milestones</span>
                        <span className={isDark ? "text-emerald-400 font-black" : "text-emerald-600 font-black"}>{progressPercent}%</span>
                      </div>
                      <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-200/80")}>
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* YouTube Channel Stats Widget */}
        {ytData && (
          <div className={cn(
            "mb-10 p-6 rounded-3xl shadow-sm relative overflow-hidden border transition-colors",
            isDark ? "bg-[#0f172a] border-slate-800" : "glass-panel border-red-100 bg-red-50/10"
          )}>
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
                  <h3 className={cn("text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    {ytData.channel_name || 'YouTube Channel'}
                  </h3>
                  <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Linked YouTube Content & Analytics</p>
                </div>
              </div>

              {/* Stat Counters */}
              <div className={cn(
                "grid grid-cols-3 gap-4 md:gap-8 p-4 rounded-2xl border backdrop-blur-sm",
                isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/60 border-red-100/50"
              )}>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Subscribers</span>
                  <span className="text-lg font-black text-red-600">{ytData.subscribers?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Views</span>
                  <span className={cn("text-lg font-black", isDark ? "text-slate-100" : "text-slate-800")}>{ytData.total_views?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Videos</span>
                  <span className={cn("text-lg font-black", isDark ? "text-slate-100" : "text-slate-800")}>{ytData.video_count?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto">
                <button 
                  onClick={() => handleCardClick('/client/youtube')}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md text-center cursor-pointer"
                >
                  Manage Videos & Comments
                </button>
              </div>
            </div>

            {/* Latest Video Feature Row */}
            {ytData.latest_video && (
              <div className={cn(
                "mt-6 pt-6 border-t flex flex-col sm:flex-row items-center gap-4",
                isDark ? "border-slate-800" : "border-red-100/50"
              )}>
                {ytData.latest_video.thumbnail && (
                  <img 
                    src={ytData.latest_video.thumbnail} 
                    alt={ytData.latest_video.title} 
                    className="w-28 h-16 rounded-xl object-cover shadow-sm border border-slate-100"
                  />
                )}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Latest Upload</span>
                  <h4 className={cn("text-sm font-bold line-clamp-1", isDark ? "text-white" : "text-slate-900")}>{ytData.latest_video.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">Published on {new Date(ytData.latest_video.published_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <a 
                    href={`https://www.youtube.com/watch?v=${ytData.latest_video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-xl text-xs transition-all border",
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    )}
                  >
                    Watch Video <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Connected Channels & Industry News Widget */}
        <div className={cn(
          "mb-10 p-6 rounded-3xl shadow-sm relative overflow-hidden space-y-4 border transition-colors",
          isDark ? "bg-[#0f172a] border-slate-800" : "glass-panel border-blue-100 bg-blue-50/10"
        )}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
                <Newspaper size={24} />
              </div>
              <div>
                <h3 className={cn("text-base font-black flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                  Live Connected Channels & Industry News
                  <span className={cn("px-2 py-0.5 text-[10px] font-extrabold rounded-full", isDark ? "bg-blue-950 text-blue-300 border border-blue-800" : "bg-blue-100 text-blue-700")}>LIVE FEED</span>
                </h3>
                <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Real-time breaking updates matching your connected channels & topics</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/client/google-news')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
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
                <div key={idx} className={cn(
                  "p-4 rounded-2xl border shadow-xs flex flex-col justify-between space-y-3 transition-all",
                  isDark
                    ? "bg-slate-800/70 border-slate-700 hover:border-blue-400"
                    : "bg-white border-slate-200/80 hover:border-blue-300"
                )}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className={cn("px-2 py-0.5 rounded-md font-extrabold truncate max-w-[120px]", isDark ? "bg-blue-950/80 text-blue-300 border border-blue-800" : "bg-blue-50 text-blue-700")}>
                        {article.source}
                      </span>
                      <span>{article.pub_date ? new Date(article.pub_date).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className={cn("text-xs font-bold line-clamp-2 block leading-snug", isDark ? "text-slate-100 hover:text-blue-400" : "text-slate-800 hover:text-blue-600")}
                    >
                      {article.title}
                    </a>
                    <p className={cn("text-[11px] line-clamp-2 leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                      {article.snippet}
                    </p>
                  </div>

                  <div className={cn("pt-2 border-t flex items-center justify-between", isDark ? "border-slate-700/80" : "border-slate-100")}>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-300 flex items-center gap-0.5"
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
            <div className={cn(
              "p-4 sm:p-8 relative overflow-hidden space-y-6 rounded-3xl border shadow-sm transition-colors",
              isDark ? "bg-[#0f172a] border-slate-800" : "glass-panel premium-shadow"
            )}>
              
              {/* Header & Time Filter Tabs */}
              <div className={cn("flex flex-col space-y-4 border-b pb-6", isDark ? "border-slate-800" : "border-slate-100")}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={cn("text-xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <TrendingUp size={20} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                      Automation Performance
                    </h3>
                    <p className={cn("text-xs font-semibold uppercase tracking-widest mt-1 italic", isDark ? "text-emerald-400" : "text-emerald-700")}>
                      {currentChartConfig.title}
                    </p>
                  </div>

                  {/* Time Presets Switcher */}
                  <div className={cn("flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border", isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100/70 border-slate-200/60")}>
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
                            ? (isDark ? "bg-slate-700 text-emerald-400 shadow-sm border border-slate-600" : "bg-white text-emerald-700 shadow-sm border border-slate-200/80")
                            : (isDark ? "text-slate-400 hover:text-white hover:bg-slate-700/50" : "text-slate-500 hover:text-slate-900 hover:bg-white/50")
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range Picker Input (when 'custom' tab is selected) */}
                {selectedPeriod === 'custom' && (
                  <div className={cn("flex flex-wrap items-center gap-3 pt-2 p-3 rounded-2xl border", isDark ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300" : "bg-emerald-50/50 border-emerald-100 text-emerald-800")}>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Calendar size={15} />
                      <span>Select Date Range:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-xl border font-medium focus:outline-none focus:border-emerald-500 w-full xs:w-auto",
                          isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      />
                      <span className="text-xs font-bold text-slate-400">to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-xl border font-medium focus:outline-none focus:border-emerald-500 w-full xs:w-auto",
                          isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
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
                  <line x1="0" y1="20" x2="500" y2="20" stroke={isDark ? "#1e293b" : "#F8FAFC"} strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke={isDark ? "#1e293b" : "#F1F5F9"} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke={isDark ? "#1e293b" : "#F1F5F9"} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="170" x2="500" y2="170" stroke={isDark ? "#334155" : "#E2E8F0"} strokeWidth="1" />

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
                  <circle cx={currentChartConfig.endpoint.x} cy={currentChartConfig.endpoint.y} r="4" fill="#00AB56" stroke={isDark ? "#0f172a" : "#FFFFFF"} strokeWidth="2" />
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
            {/* Upcoming CRM Follow-Ups & Tasks Widget */}
            <div className={cn(
              "rounded-[32px] p-6 sm:p-8 relative overflow-hidden border shadow-sm transition-colors",
              isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 premium-shadow"
            )}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-bold",
                    isDark ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60" : "bg-emerald-50 text-emerald-600"
                  )}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-900")}>CRM Follow-Ups</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Scheduled lead actions</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/client/crm')}
                  className={cn("text-xs font-bold flex items-center gap-1 transition-colors", isDark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700")}
                >
                  <span>Pipeline</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {upcomingFollowUps.length === 0 ? (
                <div className={cn(
                  "p-4 rounded-2xl border border-dashed text-center",
                  isDark ? "bg-slate-800/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                )}>
                  <p className="text-xs font-semibold">No follow-ups due this week</p>
                  <button
                    onClick={() => router.push('/client/crm')}
                    className="mt-2 text-xs font-bold text-emerald-500 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open CRM to schedule</span> &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingFollowUps.slice(0, 4).map((fu) => {
                    const isOverdue = new Date(fu.scheduled_at) < new Date();
                    return (
                      <div
                        key={fu.id}
                        onClick={() => router.push('/client/crm')}
                        className={cn(
                          "p-3 rounded-2xl border cursor-pointer hover:shadow-sm transition-all",
                          isOverdue
                            ? (isDark ? "bg-rose-950/40 border-rose-800/60 hover:bg-rose-950/60" : "bg-rose-50/70 border-rose-200 hover:bg-rose-50")
                            : (isDark ? "bg-slate-800/70 border-slate-700 hover:bg-slate-800" : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/70")
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={cn("font-bold text-xs truncate", isDark ? "text-white" : "text-slate-900")}>
                                {fu.contact_name}
                              </span>
                              {isOverdue && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-rose-500 text-white rounded">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className={cn("text-[11px] truncate mt-0.5 font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                              {fu.title}
                            </p>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border",
                            isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                          )}>
                            {fu.follow_up_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium">
                          <Calendar size={11} />
                          <span>{new Date(fu.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingFollowUps.length > 4 && (
                    <button
                      onClick={() => router.push('/client/crm')}
                      className="w-full text-center text-xs font-bold text-emerald-500 hover:text-emerald-400 py-1"
                    >
                      View all {upcomingFollowUps.length} follow-ups &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* System Live Card */}
            <div className={cn(
              "rounded-[32px] p-6 sm:p-8 relative overflow-hidden border transition-colors",
              isDark
                ? "bg-gradient-to-br from-emerald-950/40 via-[#0f172a] to-[#0f172a] border-emerald-900/60 text-slate-100"
                : "bg-gradient-to-br from-[#f0fdf4] to-white border-emerald-100 text-slate-800 premium-shadow"
            )}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className={cn("text-lg font-bold mb-6 flex items-center gap-3", isDark ? "text-white" : "text-slate-900")}>
                <Activity size={20} className={isDark ? "text-emerald-400" : "text-emerald-600"} /> System Live
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-slate-700")}>WhatsApp API</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg",
                    isDark ? "bg-emerald-950 border border-emerald-800 text-emerald-300" : "bg-emerald-100/50 text-[#047857]"
                  )}>OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-slate-700")}>RAG Knowledge</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg",
                    isDark ? "bg-emerald-950 border border-emerald-800 text-emerald-300" : "bg-emerald-100/50 text-[#047857]"
                  )}>TRAINED</span>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className={cn("text-sm font-bold", isDark ? "text-slate-400" : "text-slate-700")}>Facebook Messenger</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg",
                    isDark ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-slate-100 text-slate-500"
                  )}>LINK NEEDED</span>
                </div>
              </div>
              <button className={cn(
                "w-full mt-8 py-4 transition-all rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border cursor-pointer",
                isDark
                  ? "bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60"
                  : "bg-emerald-50 hover:bg-emerald-100/80 text-[#047857] border-emerald-100"
              )}>
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
      )}
    </DashboardLayout>
  );
};

export default ClientOverview;

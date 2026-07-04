'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Zap, TrendingUp, ArrowUpRight, Loader2, GitBranch, ShieldCheck, 
  Target, Activity, ChevronRight, Smartphone, FileText, BarChart3, Users, Clock, Plus
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
const ClientOverview = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { name: 'Total Conversations', value: '2,845', icon: MessageSquare, trend: '+12.5%', trendUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Automation Runs', value: '14,208', icon: Zap, trend: '+8.2%', trendUp: true, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Active Users', value: '892', icon: Users, trend: '-2.4%', trendUp: false, color: 'text-teal-600', bg: 'bg-teal-50' },
    { name: 'Avg. Response', value: '14s', icon: Clock, trend: 'Fastest', trendUp: true, color: 'text-emerald-700', bg: 'bg-emerald-100/50' },
  ];

  const quickActions = [
    { name: 'Build Workflow', icon: GitBranch, path: '/client/workflows', color: 'bg-emerald-600' },
    { name: 'Add Auto Reply', icon: Zap, path: '/client/automations', color: 'bg-green-600' },
    { name: 'Trained Knowledge', icon: FileText, path: '/client/settings', color: 'bg-teal-600' },
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
      <div className="max-w-7xl mx-auto pb-20 px-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome, Devansh</h1>
            <p className="text-slate-500 font-medium italic">Your automation command center is running smoothly.</p>
          </div>
          <div className="mt-8 md:mt-0 flex items-center gap-4">
            <button 
              onClick={() => router.push('/client/workflows')}
              className="btn-vibrant flex items-center gap-3"
            >
              <Plus size={18} />
              Launch New Flow
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div 
              key={stat.name}
              className="glass-panel p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 shadow-lg", stat.bg, stat.color, stat.bg.replace('bg-', 'shadow-').replace('50', '200/50'))}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <span className={cn("text-[10px] font-black tracking-tight", stat.trendUp ? "text-emerald-500" : "text-rose-500")}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Activity / Graph Area */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-panel premium-shadow p-10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Automation Performance</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Last 30 Days Growth</p>
                </div>
                <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                  Monthly Report <ArrowUpRight size={14} />
                </button>
              </div>
              
              {/* Mock Graph Visualization */}
              <div className="h-64 flex items-end gap-2 px-2">
                {[40, 60, 45, 90, 65, 80, 50, 85, 100, 75, 95, 110].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div
                      animate={{ height: `${h}%` }}
                      className={cn("w-full rounded-t-xl transition-all group-hover:bg-[#059669]", i === 11 ? "bg-[#059669]" : "bg-slate-100")} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map(action => (
                <button 
                  key={action.name}
                  onClick={() => router.push(action.path)}
                  className="glass-panel p-6 flex flex-col items-center text-center premium-shadow-hover group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/10 transition-transform", action.color)}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar / Live Feed Area */}
          <div className="space-y-10">
            {/* Status Section */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-[48px] p-10 text-slate-800 premium-shadow relative overflow-hidden border border-emerald-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-slate-900">
                <Activity size={20} className="text-emerald-600" /> System Live
              </h3>
              <div className="space-y-8">
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
              <button className="w-full mt-10 py-4 bg-emerald-50 hover:bg-emerald-100/80 text-[#047857] transition-all rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-100">
                System Health Details
              </button>
            </div>

            {/* Recent Conversation Activity */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic opacity-60">Live Conversations</p>
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 glass-panel hover-lift group cursor-pointer border border-white/60">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">+91 98765 43210</p>
                    <p className="text-[10px] text-slate-400 truncate italic">Query about Gas Booking...</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-900 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ClientOverview;



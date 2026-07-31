'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Users, FileText, TrendingUp, BarChart3 } from 'lucide-react';

export default function TeamAnalyticsView({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics.completion_rate || 100}%</p>
          <p className="text-xs text-slate-500 font-medium">{analytics.completed_tasks || 0} of {analytics.total_tasks || 0} tasks completed</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Work</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics.in_progress_tasks || 0}</p>
          <p className="text-xs text-slate-500 font-medium">Tasks currently in execution</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Blocked & Pending</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics.blocked_tasks || 0}</p>
          <p className="text-xs text-slate-500 font-medium">Requires immediate resolution</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{analytics.total_reports || 0}</p>
          <p className="text-xs text-slate-500 font-medium">Submitted progress logs</p>
        </div>
      </div>

      {/* Progress Ring & Breakdown Card */}
      <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Enterprise Execution Health</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time aggregate productivity metric calculated across all active departments, team members, and milestone deliverables.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Tasks Completed</span>
              <span className="font-bold text-emerald-600">{analytics.completed_tasks || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Under Review / Approval</span>
              <span className="font-bold text-amber-600">{analytics.under_review_tasks || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Blocked Items</span>
              <span className="font-bold text-rose-600">{analytics.blocked_tasks || 0}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Distribution */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Overall Completion Progress</span>
            <span className="text-indigo-600 text-sm">{analytics.completion_rate || 100}%</span>
          </div>
          
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${analytics.completion_rate || 100}%` }}
            />
            <div
              className="bg-indigo-500 h-full transition-all duration-500"
              style={{ width: `${100 - (analytics.completion_rate || 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> In Progress</span>
          </div>
        </div>
      </div>

    </div>
  );
}

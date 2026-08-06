'use client';

import React from 'react';
import { X, BarChart3, Users, MessageSquare, Clock, CheckCircle2, Star, ArrowRightLeft, ShieldCheck, Activity } from 'lucide-react';

export default function MonitoringAnalyticsModal({ isOpen, onClose, analyticsData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <BarChart3 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Team Conversation Performance Analytics</h3>
              <p className="text-emerald-100 text-xs mt-0.5">Real-time team response times, resolution rates & CSAT tracking</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Total Team Chats</div>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1">
                {analyticsData?.reduce((acc, curr) => acc + (curr.total_conversations || 0), 0) || 24}
              </div>
            </div>
            <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-xl border border-teal-100 dark:border-teal-900/50">
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-300">Replies Sent Today</div>
              <div className="text-2xl font-black text-teal-900 dark:text-teal-100 mt-1">
                {analyticsData?.reduce((acc, curr) => acc + (curr.replies_sent || 0), 0) || 142}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Avg Team Response</div>
              <div className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-1">1m 45s</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">Team Avg CSAT</div>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                4.9 / 5.0
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Chats</th>
                  <th className="py-3 px-4 text-center">Replies</th>
                  <th className="py-3 px-4 text-center">Avg Response</th>
                  <th className="py-3 px-4 text-center">CSAT</th>
                  <th className="py-3 px-4 text-right">Active Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {analyticsData && analyticsData.length > 0 ? (
                  analyticsData.map((item) => (
                    <tr key={item.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`} 
                          alt={item.username}
                          className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100" 
                        />
                        <div>
                          <div>{item.username}</div>
                          <div className="text-[10px] font-normal text-slate-400">{item.role}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {item.department || 'General'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.is_online ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {item.is_online ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {item.total_conversations}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {item.replies_sent}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.avg_response_time}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-500">
                        {item.csat_score}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">
                        {item.active_time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No employee performance metrics available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle, Building2, User } from 'lucide-react';

export default function TaskListTable({ tasks = [], onSelectTask }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Task Name</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Progress</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Due Date</th>
              <th className="px-4 py-3.5">Est. Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {tasks.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs truncate">
                  {t.title}
                </td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {t.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge(t.priority)}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-4 py-4 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${t.progress_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{t.progress_percentage || 0}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {t.department || 'General'}
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {t.due_date || 'N/A'}
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {t.estimated_hours || 0} hrs
                </td>
              </tr>
            ))}

            {tasks.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  No tasks found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

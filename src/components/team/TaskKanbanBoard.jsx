'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Calendar, CheckSquare, ShieldAlert } from 'lucide-react';

const COLUMNS = [
  { key: 'NOT_STARTED', title: 'Not Started', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'IN_PROGRESS', title: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'UNDER_REVIEW', title: 'Under Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'WAITING_APPROVAL', title: 'Waiting Approval', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'BLOCKED', title: 'Blocked', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'COMPLETED', title: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function TaskKanbanBoard({ tasks = [], onSelectTask }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'HIGH': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'MEDIUM': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter(t => (t.status || 'NOT_STARTED') === col.key);
        return (
          <div key={col.key} className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/60 min-w-[240px] flex flex-col h-full min-h-[500px]">
            
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${col.color}`}>
                {col.title}
              </span>
              <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {columnTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-slate-800 text-xs leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {t.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Progress</span>
                      <span>{t.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${t.progress_percentage || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {t.department || 'General'}
                    </span>
                    {t.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {t.due_date}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="h-24 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-medium">
                  No Tasks
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}

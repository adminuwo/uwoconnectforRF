'use client';

import React from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, Loader2, User, Mail, Building2, Shield, Hash, FileText } from 'lucide-react';
import WorkReportModal from '@/components/team/WorkReportModal';

export default function MemberDetailDrawer({ member, tasks = [], onClose }) {
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  if (!member) return null;

  // Filter tasks for this member
  const memberTasks = tasks.filter(t => {
    const assigneeName = t.assigned_to_name || t.assignee_name || '';
    const assigneeId = t.assigned_to || t.assignee;
    return (
      (assigneeName && assigneeName === member.username) ||
      (assigneeId && String(assigneeId) === String(member.id))
    );
  });

  const completedTasks = memberTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE');
  const inProgressTasks = memberTasks.filter(t => t.status === 'IN_PROGRESS');
  const pendingTasks = memberTasks.filter(t => t.status === 'TODO' || t.status === 'PENDING' || t.status === 'OPEN');
  const overdueTasks = memberTasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date() && t.status !== 'COMPLETED' && t.status !== 'DONE';
  });

  const totalTasks = memberTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const getPriorityColor = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'HIGH': case 'URGENT': return 'bg-red-50 text-red-600 border-red-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LOW': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusConfig = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'COMPLETED': case 'DONE':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={10} /> };
      case 'IN_PROGRESS':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Loader2 size={10} /> };
      case 'TODO': case 'PENDING': case 'OPEN':
        return { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={10} /> };
      default:
        return { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <Clock size={10} /> };
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-200">
                {member.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{member.username}</h2>
                <p className="text-xs text-slate-500">{member.designation || member.enterprise_role || 'Team Member'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${member.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-semibold text-slate-400">
                    {member.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Member Info */}
          <div className="px-6 py-4 space-y-3 border-b border-slate-100">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail size={12} className="text-slate-400" />
                <span className="truncate font-medium">{member.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 size={12} className="text-slate-400" />
                <span className="font-medium">{member.department || 'General'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Shield size={12} className="text-slate-400" />
                <span className="font-semibold text-emerald-600">{member.enterprise_role || member.role}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Hash size={12} className="text-slate-400" />
                <span className="font-mono font-medium">{member.employee_id || 'N/A'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              <span>Submit Daily Work Report</span>
            </button>
          </div>

          {/* Task Summary Stats */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Task Overview</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-xl font-black text-slate-900">{totalTasks}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Total</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                <p className="text-xl font-black text-emerald-700">{completedTasks.length}</p>
                <p className="text-[10px] font-semibold text-emerald-500 mt-0.5">Done</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                <p className="text-xl font-black text-blue-700">{inProgressTasks.length}</p>
                <p className="text-[10px] font-semibold text-blue-500 mt-0.5">In Progress</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                <p className="text-xl font-black text-amber-700">{pendingTasks.length}</p>
                <p className="text-[10px] font-semibold text-amber-500 mt-0.5">Pending</p>
              </div>
            </div>

            {/* Progress Bar */}
            {totalTasks > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Completion Rate</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}

            {overdueTasks.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <AlertTriangle size={12} />
                <span className="text-[10px] font-bold">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Task Lists */}
          <div className="px-6 py-4 space-y-4">
            {/* In Progress Tasks */}
            {inProgressTasks.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Loader2 size={11} /> In Progress ({inProgressTasks.length})
                </h4>
                <div className="space-y-1.5">
                  {inProgressTasks.map(t => {
                    const sc = getStatusConfig(t.status);
                    return (
                      <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{t.title}</p>
                          {t.due_date && (
                            <p className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(t.due_date).toLocaleDateString()}</p>
                          )}
                        </div>
                        {t.priority && (
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock size={11} /> Pending ({pendingTasks.length})
                </h4>
                <div className="space-y-1.5">
                  {pendingTasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 bg-amber-50/30 rounded-xl border border-amber-100/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{t.title}</p>
                        {t.due_date && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(t.due_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      {t.priority && (
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getPriorityColor(t.priority)}`}>
                          {t.priority}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={11} /> Completed ({completedTasks.length})
                </h4>
                <div className="space-y-1.5">
                  {completedTasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-500 truncate line-through">{t.title}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium shrink-0">
                        {t.completed_at ? new Date(t.completed_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No tasks */}
            {totalTasks === 0 && (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm font-medium">No tasks assigned</p>
                <p className="text-xs mt-0.5">Create a task and assign it to this member.</p>
              </div>
            )}

            {/* Assigned Channels */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Assigned Channels</h4>
              <div className="flex flex-wrap gap-1.5">
                {(member.assigned_social_channels || []).length > 0 ? (
                  member.assigned_social_channels.map((ch, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                      {ch}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No channels assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WorkReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => { setIsReportModalOpen(false); }}
      />
    </>
  );
}

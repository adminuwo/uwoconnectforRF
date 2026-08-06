'use client';

import React from 'react';
import { X, History, User, Lock, ArrowRightLeft, MessageSquare, StickyNote, ShieldAlert, CheckCircle2, Eye, Clock } from 'lucide-react';

export default function AuditLogDrawer({ isOpen, onClose, auditLogs, conversation }) {
  if (!isOpen) return null;

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'TAKEOVER':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'TRANSFERRED':
        return <ArrowRightLeft className="w-4 h-4 text-amber-500" />;
      case 'NOTE_ADDED':
        return <StickyNote className="w-4 h-4 text-emerald-500" />;
      case 'LOCKED':
      case 'UNLOCKED':
        return <Lock className="w-4 h-4 text-indigo-500" />;
      case 'VIEWED':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'REPLIED':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Conversation Audit Log</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete event timeline for #{conversation?.id || 'Chat'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {auditLogs && auditLogs.length > 0 ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {auditLogs.map((log, idx) => (
                <div key={log.id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                    {getEventIcon(log.event_type)}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3 h-3 text-emerald-500" />
                        {log.actor_name || log.actor_username || 'System'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>

                    <div className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      Event: <span className="text-emerald-600 dark:text-emerald-400">{log.event_type}</span>
                    </div>

                    {log.details && (
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {Object.entries(log.details).map(([k, v]) => (
                          <div key={k} className="flex items-start justify-between gap-2">
                            <span className="capitalize text-[11px] font-medium text-slate-400">{k.replace('_', ' ')}:</span>
                            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-right">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No audit logs recorded for this conversation yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

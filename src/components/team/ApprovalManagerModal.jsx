'use client';

import React, { useState } from 'react';
import { X, CheckCircle, RotateCcw, ShieldCheck, User, Calendar, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function ApprovalManagerModal({ approval, isOpen, onClose, onSuccess }) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !approval) return null;

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/approvals/`,
        {
          approval_id: approval.id,
          action: actionType,
          feedback
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to process approval action:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Work Approval Review</h3>
              <p className="text-xs text-slate-400">Review task submission and approve or request revisions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Task Title</span>
            <h4 className="font-bold text-slate-800 text-sm">{approval.task_title || 'Task Submission'}</h4>
            <div className="flex justify-between text-slate-500 text-xs pt-2 border-t border-slate-200/60">
              <span>Submitted by: <strong>{approval.employee_name}</strong></span>
              <span>{new Date(approval.submitted_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Employee Submission Notes</label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 leading-relaxed text-xs">
              {approval.submission_notes || 'No submission notes provided.'}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Manager Feedback / Revision Notes</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide comments or list required changes if requesting revisions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
            />
          </div>

          <div className="pt-4 flex justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleAction('REQUEST_CHANGES')}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={15} /> Request Changes
            </button>
            <button
              type="button"
              onClick={() => handleAction('APPROVE')}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-200"
            >
              <CheckCircle size={15} /> Approve & Close Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

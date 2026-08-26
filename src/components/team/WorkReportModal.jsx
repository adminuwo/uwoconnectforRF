'use client';

import React, { useState } from 'react';
import { X, FileText, AlertTriangle, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function WorkReportModal({ isOpen, onClose, onSuccess, initialDate }) {
  const [reportDate, setReportDate] = useState(() => initialDate || new Date().toISOString().split('T')[0]);
  const [todaysWork, setTodaysWork] = useState('');
  const [completedWork, setCompletedWork] = useState('');
  const [remainingWork, setRemainingWork] = useState('');
  const [blockers, setBlockers] = useState('');
  const [needHelp, setNeedHelp] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(8.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialDate) {
      setReportDate(initialDate);
    }
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todaysWork.trim()) {
      setError("Today's work summary is required");
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/team/reports/`,
        {
          report_date: reportDate,
          todays_work: todaysWork.trim(),
          completed_work: completedWork.trim(),
          remaining_work: remainingWork.trim(),
          blockers: blockers.trim(),
          need_help: needHelp,
          hours_worked: parseFloat(hoursWorked) || 8.0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
      setTodaysWork('');
      setCompletedWork('');
      setRemainingWork('');
      setBlockers('');
      setNeedHelp(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit work report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Submit Daily Work Report</h3>
              <p className="text-xs text-slate-400">Share today's progress, hours worked, and blockers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Report Date *</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Today's Accomplishments & Work *</label>
            <textarea
              rows={3}
              value={todaysWork}
              onChange={(e) => setTodaysWork(e.target.value)}
              placeholder="What core deliverables and tasks did you focus on today?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Completed Items</label>
              <textarea
                rows={2}
                value={completedWork}
                onChange={(e) => setCompletedWork(e.target.value)}
                placeholder="Finished features or closed tickets..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Remaining Work</label>
              <textarea
                rows={2}
                value={remainingWork}
                onChange={(e) => setRemainingWork(e.target.value)}
                placeholder="In progress items for tomorrow..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1.5 text-rose-600">
              <AlertTriangle size={14} /> Problems Faced & Blockers
            </label>
            <textarea
              rows={2}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Any technical issues, missing specs, or dependencies holding you up?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="needHelp"
                checked={needHelp}
                onChange={(e) => setNeedHelp(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <label htmlFor="needHelp" className="font-semibold text-slate-700 cursor-pointer">
                Requires Manager / Technical Lead Help?
              </label>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" />
              <input
                type="number"
                step="0.5"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center font-bold text-slate-800"
              />
              <span className="text-slate-500 font-medium">hrs</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

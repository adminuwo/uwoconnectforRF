'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Send, MessageSquare, Paperclip, Clock, Calendar, AlertCircle, Copy, ShieldAlert, Check } from 'lucide-react';
import axios from 'axios';

export default function TaskDetailDrawer({ task, isOpen, onClose, onUpdate }) {
  const [newComment, setNewComment] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [showApprovalInput, setShowApprovalInput] = useState(false);

  if (!isOpen || !task) return null;

  const handleToggleChecklist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/tasks/${task.id}/toggle_checklist/`,
        { item_id: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      console.error('Failed to toggle checklist:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/tasks/${task.id}/add_comment/`,
        { text: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      // Refetch task updates
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/tasks/${task.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setIsSubmittingApproval(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/team/tasks/${task.id}/submit_for_approval/`,
        { notes: approvalNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data.task);
      setShowApprovalInput(false);
    } catch (err) {
      console.error('Failed to submit approval:', err);
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
              {task.status?.replace('_', ' ')}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Title & Description */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{task.title}</h2>
            <p className="text-slate-600 leading-relaxed text-xs">{task.description || 'No detailed description provided.'}</p>
          </div>

          {/* Progress Bar Component */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Progress Percentage</span>
              <span className="text-indigo-600">{task.progress_percentage || 0}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${task.progress_percentage || 0}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center justify-between">
              <span>Checklist & Subtasks</span>
              <span className="text-[11px] font-normal text-slate-400">
                {(task.checklist || []).filter(i => i.completed).length} of {(task.checklist || []).length} done
              </span>
            </h4>
            <div className="space-y-2">
              {(task.checklist || []).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    item.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-300 shrink-0" />
                  )}
                  <span className="text-xs">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Approval Section */}
          <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30">
            {task.status === 'WAITING_APPROVAL' ? (
              <div className="flex items-center gap-2 text-amber-700 font-medium text-xs">
                <ShieldAlert size={16} />
                <span>Task submitted for manager review. Pending final approval.</span>
              </div>
            ) : showApprovalInput ? (
              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Submission notes or completion summary..."
                  className="w-full p-2.5 rounded-xl border border-amber-200 bg-white focus:outline-none text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowApprovalInput(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitForApproval}
                    disabled={isSubmittingApproval}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-xs"
                  >
                    Confirm Submission
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowApprovalInput(true)}
                className="w-full py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <CheckCircle2 size={15} />
                <span>Submit Work for Approval</span>
              </button>
            )}
          </div>

          {/* Discussion Thread */}
          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-indigo-500" />
              <span>Task Discussion ({task.comments?.length || 0})</span>
            </h4>

            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {(task.comments || []).map((c) => (
                <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-xs">{c.author_name || 'Team Member'}</span>
                    <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 text-xs">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type a comment or mention @colleague..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center shrink-0 shadow-xs"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

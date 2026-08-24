'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Calendar, Clock, AlertCircle, Building2, User } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'UNDER_REVIEW', 'WAITING_APPROVAL', 'BLOCKED', 'COMPLETED'];
const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'Support', 'Design', 'HR', 'Finance', 'General'];

export default function TaskModal({ isOpen, onClose, onSuccess, members = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('NOT_STARTED');
  const [department, setDepartment] = useState('Engineering');
  const [assignedTo, setAssignedTo] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(4.0);
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, title: 'Milestone 1: Scope & Requirements Review', completed: false },
    { id: 2, title: 'Milestone 2: Core Development & Implementation', completed: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([
      ...checklistItems,
      { id: Date.now(), title: newChecklistText.trim(), completed: false }
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter(i => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/team/tasks/`,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          department,
          assigned_to: assignedTo,
          due_date: dueDate || null,
          estimated_hours: parseFloat(estimatedHours) || 0,
          checklist: checklistItems
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Create New Task</h3>
              <p className="text-xs text-slate-400">Assign work items, checklists, priorities, and deadlines</p>
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
            <label className="block text-slate-600 font-medium mb-1.5">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth login integration & security audit"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of requirements, expectations, and acceptance criteria..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1">
                <AlertCircle size={13} className="text-slate-400" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1">
                <Building2 size={13} className="text-slate-400" /> Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1">
                <Clock size={13} className="text-slate-400" /> Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1.5 flex items-center gap-1">
              <User size={13} className="text-slate-400" /> Assign To (Multiple)
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 border border-slate-200 rounded-xl max-h-28 overflow-y-auto">
              {members.map(m => {
                const isSelected = assignedTo.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) setAssignedTo(assignedTo.filter(id => id !== m.id));
                      else setAssignedTo([...assignedTo, m.id]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {m.username} ({m.department || 'Team'})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtask Checklist / Milestones */}
          <div>
            <label className="block text-slate-600 font-medium mb-2 flex items-center gap-1.5">
              <span>Task Milestones & Checkpoints</span>
            </label>
            <div className="space-y-2 mb-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-medium text-slate-700">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add milestone checkpoint (e.g. Milestone 3: QA & Testing)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklistItem(); } }}
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 text-xs shrink-0"
              >
                <Plus size={14} /> Add Milestone
              </button>
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
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

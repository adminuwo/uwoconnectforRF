'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Layers, Calendar, AlertCircle, Plus, Trash2, User, DollarSign, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const PROJECT_TYPES = ['Web Application', 'Mobile App', 'Marketing Campaign', 'CRM Integration', 'Infrastructure', 'Custom SaaS'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'Support', 'Design', 'HR', 'General'];

export default function ProjectModal({ isOpen, onClose, onSuccess, members = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Web Application');
  const [clientName, setClientName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PLANNING');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(40);
  const [budget, setBudget] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Milestones List
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Phase 1: Architecture & UI Mockups', status: 'IN_PROGRESS', assigned_to: [], due_date: '' },
    { id: 2, title: 'Phase 2: Core Development & APIs', status: 'NOT_STARTED', assigned_to: [], due_date: '' }
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones([
      ...milestones,
      {
        id: Date.now(),
        title: newMilestoneText.trim(),
        status: 'NOT_STARTED',
        assigned_to: [],
        due_date: deadline || ''
      }
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      await axios.post(
        `${API_BASE_URL}/api/team/projects/`,
        {
          name: name.trim(),
          description: description.trim(),
          project_type: projectType,
          client_name: clientName.trim(),
          department,
          priority,
          status,
          start_date: startDate || null,
          deadline: deadline || null,
          estimated_hours: parseFloat(estimatedHours) || 0,
          budget: parseFloat(budget) || 0,
          tags: tagsArray,
          members: selectedMembers,
          milestones
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onSuccess) onSuccess();
      onClose();
      // Reset
      setName('');
      setDescription('');
      setMilestones([]);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.response?.data?.error || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Create Enterprise Project</h3>
              <p className="text-xs text-slate-400">Set objectives, milestones, team members & timeline</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Enterprise WhatsApp & Instagram CRM Automation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-medium"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail project goals, deliverables, and architecture overview..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Project Type & Client Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
              >
                {PROJECT_TYPES.map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Name (Optional)</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Department, Priority & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Hours */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" /> Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock size={12} className="text-slate-400" /> Est. Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Team Members Assignment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User size={12} className="text-slate-400" /> Team Members
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 border border-slate-200 rounded-xl max-h-24 overflow-y-auto bg-slate-50/50">
              {members.map(m => {
                const isSelected = selectedMembers.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) setSelectedMembers(selectedMembers.filter(id => id !== m.id));
                      else setSelectedMembers([...selectedMembers, m.id]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {m.username} ({m.department || 'Team'})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Milestones */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Milestones & Phases</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                placeholder="Add milestone e.g. Phase 1: Database & Auth Setup..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMilestone(); } }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                    <span className="font-semibold">{m.title}</span>
                    <button type="button" onClick={() => handleRemoveMilestone(m.id)} className="text-slate-400 hover:text-red-500 p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md shadow-emerald-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

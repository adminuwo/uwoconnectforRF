'use client';

import React, { useState } from 'react';
import { 
  X, CheckCircle2, Circle, Clock, Calendar, AlertTriangle, 
  FolderPlus, User, Tag, Shield, Loader2, Flag, Target, TrendingUp, CheckSquare, Plus, UserPlus
} from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL } from '@/config/apiConfig';

export default function ProjectDetailDrawer({ project, isOpen, onClose, onUpdate, availableMembers = [] }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState('');
  const [isUpdatingMembers, setIsUpdatingMembers] = useState(false);

  if (!isOpen || !project) return null;

  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter(m => m.completed || m.status === 'COMPLETED').length;
  const totalMilestones = milestones.length;

  const calculatedProgress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : (project.progress_percentage || 0);

  // Risk Level calculation
  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && calculatedProgress < 100;
  const riskLevel = isOverdue ? 'High Risk' : (calculatedProgress < 50 ? 'Medium Risk' : 'Low Risk');
  const riskColor = isOverdue ? 'bg-rose-50 text-rose-700 border-rose-200' : (calculatedProgress < 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200');

  const cleanId = typeof project.id === 'object' ? (project.id.$oid || project.id.toString()) : (project.id || project._id);

  const handleToggleMilestone = async (index) => {
    const updatedMilestones = milestones.map((m, idx) => {
      if (idx === index) {
        const isDone = !m.completed && m.status !== 'COMPLETED';
        return {
          ...m,
          completed: isDone,
          status: isDone ? 'COMPLETED' : 'IN_PROGRESS'
        };
      }
      return m;
    });

    const newCompleted = updatedMilestones.filter(m => m.completed || m.status === 'COMPLETED').length;
    const newProgress = updatedMilestones.length > 0 ? Math.round((newCompleted / updatedMilestones.length) * 100) : 0;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${API_BASE_URL}/api/team/projects/${cleanId}/`,
        {
          milestones: updatedMilestones,
          progress_percentage: newProgress,
          status: newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const projectMembers = project.members_details || (Array.isArray(project.members) ? project.members : []);
  const currentMemberIds = projectMembers.map(m => typeof m === 'object' ? String(m.id) : String(m));

  // Add Member
  const handleAddMember = async () => {
    if (!selectedMemberToAdd) return;
    try {
      setIsUpdatingMembers(true);
      const token = localStorage.getItem('token');
      const updatedIds = [...currentMemberIds, selectedMemberToAdd];

      const res = await axios.patch(
        `${API_BASE_URL}/api/team/projects/${cleanId}/`,
        { members: updatedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedMemberToAdd('');
      setShowAddMember(false);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member to project');
    } finally {
      setIsUpdatingMembers(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (memberId) => {
    try {
      setIsUpdatingMembers(true);
      const token = localStorage.getItem('token');
      const updatedIds = currentMemberIds.filter(id => String(id) !== String(memberId));

      const res = await axios.patch(
        `${API_BASE_URL}/api/team/projects/${cleanId}/`,
        { members: updatedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member');
    } finally {
      setIsUpdatingMembers(false);
    }
  };

  const unassignedMembers = availableMembers.filter(m => !currentMemberIds.includes(String(m.id)));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-250 font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-emerald-200">
              <FolderPlus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${riskColor}`}>
                  {riskLevel}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {project.department || 'General'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug mt-0.5">{project.name}</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">

          {/* Description */}
          {project.description && (
            <p className="text-slate-600 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* VISUAL PROGRESS BAR CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-5 rounded-2xl text-white shadow-lg space-y-3 border border-emerald-800/30">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Target size={15} /> Overall Project Progress
              </span>
              <span className="text-emerald-400 text-xl font-black">{calculatedProgress}%</span>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${calculatedProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium pt-1">
              <span>{completedMilestones} / {totalMilestones} Milestones Completed</span>
              <span>Deadline: {project.deadline || 'Flexible'}</span>
            </div>
          </div>

          {/* Assigned Team Members Info (With Direct Add & Remove) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Assigned Team Members ({projectMembers.length})
              </span>
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
              >
                <UserPlus size={12} />
                <span>{showAddMember ? 'Cancel' : '+ Add Member'}</span>
              </button>
            </div>

            {/* Inline Add Member Picker */}
            {showAddMember && (
              <div className="mb-3 p-3 bg-white border border-emerald-200 rounded-xl space-y-2 animate-in fade-in">
                <label className="block text-[11px] font-bold text-slate-700">Select Member from Workspace:</label>
                {unassignedMembers.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">All workspace members are already assigned.</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMemberToAdd}
                      onChange={(e) => setSelectedMemberToAdd(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                    >
                      <option value="">-- Choose Member --</option>
                      {unassignedMembers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.username || m.name} ({m.department || 'Team'})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddMember}
                      disabled={!selectedMemberToAdd || isUpdatingMembers}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {isUpdatingMembers ? <Loader2 size={12} className="animate-spin" /> : 'Assign'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {projectMembers.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                No team members assigned yet. Click "+ Add Member" above to assign contributors.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {projectMembers.map((m, i) => {
                  const memberId = typeof m === 'object' ? m.id : m;
                  const memberName = typeof m === 'object' ? (m.name || m.username) : `Member #${memberId}`;

                  return (
                    <div key={memberId || i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs group">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center uppercase">
                        {memberName.charAt(0)}
                      </div>
                      <span>{memberName}</span>
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        disabled={isUpdatingMembers}
                        className="text-slate-300 hover:text-rose-600 p-0.5 hover:bg-rose-50 rounded transition-colors cursor-pointer ml-1"
                        title={`Remove ${memberName} from project`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Milestones Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Flag size={15} className="text-emerald-600" /> Project Milestones ({totalMilestones})
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Click to toggle completion
              </span>
            </div>

            {milestones.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                No milestones added to this project yet.
              </div>
            ) : (
              <div className="space-y-2">
                {milestones.map((m, idx) => {
                  const isDone = m.completed || m.status === 'COMPLETED';
                  return (
                    <button
                      key={m.id || idx}
                      onClick={() => handleToggleMilestone(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-slate-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {m.title}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

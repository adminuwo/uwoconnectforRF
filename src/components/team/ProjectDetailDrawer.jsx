'use client';

import React, { useState } from 'react';
import { 
  X, CheckCircle2, Circle, Clock, Calendar, AlertTriangle, 
  FolderPlus, User, Tag, Shield, Loader2, Flag, Target, TrendingUp, CheckSquare
} from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

export default function ProjectDetailDrawer({ project, isOpen, onClose, onUpdate }) {
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
      const cleanId = typeof project.id === 'object' ? (project.id.$oid || project.id.toString()) : (project.id || project._id);
      
      const res = await axios.patch(
        `${API}/api/team/projects/${cleanId}/`,
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

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
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
              <span>Target: {project.deadline || 'No deadline'}</span>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
              <span className="font-bold text-slate-800 uppercase">{project.priority || 'MEDIUM'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Hours</span>
              <span className="font-bold text-slate-800">{project.estimated_hours || 40} hrs</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <span className="font-bold text-emerald-600 uppercase">{project.status?.replace('_', ' ') || 'PLANNING'}</span>
            </div>
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

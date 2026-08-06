'use client';

import React, { useState } from 'react';
import { X, ArrowRightLeft, User, Building2, FileText, Send, CheckCircle2, Shield } from 'lucide-react';

export default function TransferModal({ isOpen, onClose, conversation, teamMembers, onTransfer }) {
  const [targetType, setTargetType] = useState('EMPLOYEE'); // 'EMPLOYEE' or 'DEPARTMENT'
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Sales');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !conversation) return null;

  const departments = ['Support', 'Sales', 'Technical', 'Billing', 'VIP Concierge', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (targetType === 'EMPLOYEE' && !selectedUser) return;
    setIsSubmitting(true);

    const payload = {
      target_user_id: targetType === 'EMPLOYEE' ? selectedUser : null,
      target_department: targetType === 'EMPLOYEE' 
        ? (teamMembers.find(m => m.id === selectedUser)?.department || 'Support')
        : selectedDepartment,
      reason: reason || 'Conversation transferred for specialized assistance'
    };

    await onTransfer(conversation.id, payload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ArrowRightLeft className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Transfer Conversation</h3>
              <p className="text-emerald-100 text-xs mt-0.5">Reassign chat ownership & preserve audit history</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setTargetType('EMPLOYEE')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                targetType === 'EMPLOYEE'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              Team Member
            </button>
            <button
              type="button"
              onClick={() => setTargetType('DEPARTMENT')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                targetType === 'DEPARTMENT'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Department Queue
            </button>
          </div>

          {/* Employee Selection */}
          {targetType === 'EMPLOYEE' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Team Member
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select an employee...</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username} ({member.department || 'Support'}) - {member.is_online ? '🟢 Online' : '⚪ Offline'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Department Queue
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept} Queue
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Transfer Reason / Handover Note
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer requested custom pricing quote. Handing over to Sales team."
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (targetType === 'EMPLOYEE' && !selectedUser)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {isSubmitting ? (
                <span>Transferring...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Confirm Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

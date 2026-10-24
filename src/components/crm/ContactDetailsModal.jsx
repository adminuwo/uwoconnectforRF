import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Tag, User, Phone, Mail, FileText, Save, Loader2, MessageSquare, 
  ShoppingBag, Calendar, Clock, CheckCircle2, AlertCircle, Plus, Check, Ban 
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const FOLLOW_UP_TYPES = [
  { id: 'CALL', label: 'Phone Call', icon: Phone, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'MEETING', label: 'Meeting', icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'EMAIL', label: 'Email', icon: Mail, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

export default function ContactDetailsModal({ contact, isOpen, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    notes: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);

  // Follow-Up States
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [updatingFuId, setUpdatingFuId] = useState(null);
  const [newFollowUp, setNewFollowUp] = useState({
    follow_up_type: 'CALL',
    title: '',
    scheduled_at: '',
    note: ''
  });

  const getAuthHeader = () => {
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('uwo_token') || localStorage.getItem('token')) 
      : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (contact && isOpen) {
      setFormData({
        name: contact.name !== 'Unknown' ? contact.name : '',
        phone_number: contact.phone_number || '',
        email: contact.email || '',
        notes: contact.notes || '',
        tags: contact.tags || []
      });
      setNewTag('');
      setShowAddForm(false);
      
      // Pre-fill scheduled_at with tomorrow at 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const tzOffset = tomorrow.getTimezoneOffset() * 60000;
      const localISOTime = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);
      
      setNewFollowUp({
        follow_up_type: 'CALL',
        title: '',
        scheduled_at: localISOTime,
        note: ''
      });

      // Fetch follow-ups for this contact
      fetchFollowUps(contact.id);
    }
  }, [contact, isOpen]);

  const fetchFollowUps = async (contactId) => {
    if (!contactId) return;
    setLoadingFollowUps(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contacts/${contactId}/follow_ups/`, {
        headers: getAuthHeader()
      });
      setFollowUps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load follow-ups:", err);
    } finally {
      setLoadingFollowUps(false);
    }
  };

  if (!isOpen || !contact) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/contacts/${contact.id}/`, formData, {
        headers: getAuthHeader()
      });
      if (onUpdated) onUpdated(res.data);
      onClose();
    } catch (err) {
      alert('Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    if (!newFollowUp.scheduled_at) {
      alert('Please select a date and time for the follow-up.');
      return;
    }
    setScheduling(true);
    try {
      const payload = {
        follow_up_type: newFollowUp.follow_up_type,
        title: newFollowUp.title.trim() || `${newFollowUp.follow_up_type} with ${formData.name || contact.phone_number || 'Lead'}`,
        scheduled_at: new Date(newFollowUp.scheduled_at).toISOString(),
        note: newFollowUp.note.trim()
      };

      const res = await axios.post(`${API_BASE_URL}/api/contacts/${contact.id}/follow_ups/create/`, payload, {
        headers: getAuthHeader()
      });

      setFollowUps(prev => [res.data, ...prev]);
      setShowAddForm(false);
      setNewFollowUp(prev => ({ ...prev, title: '', note: '' }));
      
      // Auto-notify parent so lead card reflects new stage/followup
      if (onUpdated && (contact.stage === 'NEW' || contact.stage === 'QUALIFIED')) {
        onUpdated({ ...contact, stage: 'FOLLOWUP', next_followup_at: res.data.scheduled_at });
      }
    } catch (err) {
      console.error("Failed to schedule follow-up:", err);
      alert('Failed to schedule follow-up. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdateFollowUpStatus = async (fuId, newStatus) => {
    setUpdatingFuId(fuId);
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/contacts/${contact.id}/follow_ups/${fuId}/update/`, {
        status: newStatus
      }, {
        headers: getAuthHeader()
      });

      setFollowUps(prev => prev.map(f => f.id === fuId ? res.data : f));
    } catch (err) {
      console.error("Failed to update follow-up status:", err);
      alert('Failed to update status.');
    } finally {
      setUpdatingFuId(null);
    }
  };

  const isOverdue = (scheduledAt, status) => {
    if (status !== 'PENDING') return false;
    return new Date(scheduledAt) < new Date();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Lead Details</h2>
              <p className="text-sm text-slate-500 font-medium">Platform ID: {contact.platform_id || 'Direct'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Enter name"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.phone_number}
                  onChange={e => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* CRM Follow-Ups & Tasks Section */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={15} className="text-emerald-600" /> CRM Follow-Ups & Reminders
              </label>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {showAddForm ? <X size={13} /> : <Plus size={13} />}
                {showAddForm ? 'Cancel' : 'Schedule Follow-Up'}
              </button>
            </div>

            {/* Schedule Follow-Up Form */}
            {showAddForm && (
              <form onSubmit={handleScheduleFollowUp} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 space-y-4">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={14} className="text-emerald-600" /> Schedule New Follow-Up
                </div>

                {/* Type Selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Action Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FOLLOW_UP_TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = newFollowUp.follow_up_type === t.id;
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setNewFollowUp({ ...newFollowUp, follow_up_type: t.id })}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon size={14} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Title / Objective</label>
                    <input
                      type="text"
                      value={newFollowUp.title}
                      onChange={e => setNewFollowUp({ ...newFollowUp, title: e.target.value })}
                      placeholder="e.g. Call regarding quotation"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newFollowUp.scheduled_at}
                      onChange={e => setNewFollowUp({ ...newFollowUp, scheduled_at: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Note (Optional)</label>
                  <input
                    type="text"
                    value={newFollowUp.note}
                    onChange={e => setNewFollowUp({ ...newFollowUp, note: e.target.value })}
                    placeholder="Specific talking points or reminders..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {scheduling ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Follow-Ups List */}
            {loadingFollowUps ? (
              <div className="py-6 flex items-center justify-center text-slate-400 text-xs">
                <Loader2 size={16} className="animate-spin mr-2" /> Loading follow-ups...
              </div>
            ) : followUps.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs font-semibold text-slate-500">No follow-ups scheduled yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Schedule Follow-Up&quot; above to set reminders, calls, or meetings.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {followUps.map((fu) => {
                  const overdue = isOverdue(fu.scheduled_at, fu.status);
                  const typeDef = FOLLOW_UP_TYPES.find(t => t.id === fu.follow_up_type) || FOLLOW_UP_TYPES[0];
                  const Icon = typeDef.icon;
                  const isPending = fu.status === 'PENDING';
                  const isDone = fu.status === 'DONE';

                  return (
                    <div 
                      key={fu.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        overdue 
                          ? 'bg-rose-50/70 border-rose-200' 
                          : isDone 
                            ? 'bg-slate-50 border-slate-200 opacity-80' 
                            : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${typeDef.color}`}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {fu.title}
                              </h5>
                              {overdue && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-rose-500 text-white rounded-md flex items-center gap-1">
                                  <AlertCircle size={10} /> Overdue
                                </span>
                              )}
                              {isDone && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md flex items-center gap-1">
                                  <Check size={10} /> Completed
                                </span>
                              )}
                              {fu.status === 'CANCELLED' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <Calendar size={12} className="text-slate-400" />
                              <span>{new Date(fu.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            {fu.note && (
                              <p className="text-[11px] text-slate-600 mt-1 italic bg-white/60 px-2 py-1 rounded-lg border border-slate-100">
                                {fu.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons for Pending */}
                        {isPending && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={updatingFuId === fu.id}
                              onClick={() => handleUpdateFollowUpStatus(fu.id, 'DONE')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                              title="Mark Follow-up as Completed"
                            >
                              {updatingFuId === fu.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                              Done
                            </button>
                            <button
                              type="button"
                              disabled={updatingFuId === fu.id}
                              onClick={() => handleUpdateFollowUpStatus(fu.id, 'CANCELLED')}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Cancel Follow-up"
                            >
                              <Ban size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="pt-6 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
              <Tag size={14} /> Segments & Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-emerald-500 hover:text-emerald-800">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input 
                type="text" 
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Type tag and press enter"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
              <button type="submit" disabled={!newTag.trim()} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                Add Tag
              </button>
            </form>
          </div>

          {/* Products Shared Section */}
          <div className="pt-6 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 flex items-center gap-2">
              <ShoppingBag size={14} className="text-emerald-600" /> Products Shared with Lead
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    📦
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">AI Automation Book</h5>
                    <p className="text-[10px] text-slate-400">Shared via WhatsApp Workflow • Aug 3, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">$23.00</span>
                  <div className="flex items-center gap-2 mt-0.5 justify-end">
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Link Clicked: Yes</span>
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Status: Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="pt-6 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
              <FileText size={14} /> Internal Notes
            </label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 transition-colors h-28 resize-none"
              placeholder="Add notes about this lead... (Only visible to your team)"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <button onClick={() => window.location.href = '/client/inbox'} className="text-sm font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-2 transition-colors">
            <MessageSquare size={16} /> Open Chat
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

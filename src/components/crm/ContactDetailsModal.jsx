import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Tag, User, Phone, Mail, FileText, Save, Loader2, MessageSquare, 
  ShoppingBag, Calendar, Clock, CheckCircle2, AlertCircle, Plus, Check, Ban 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const FOLLOW_UP_TYPES = [
  { id: 'CALL', label: 'Phone Call', icon: Phone, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'MEETING', label: 'Meeting', icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'EMAIL', label: 'Email', icon: Mail, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

export default function ContactDetailsModal({ contact, isOpen, onClose, onUpdated }) {
  const { isDark } = useTheme();
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose}></div>
      <div className={cn(
        "relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border transition-colors",
        isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      )}>
        {/* Header */}
        <div className={cn(
          "p-6 border-b flex items-center justify-between transition-colors",
          isDark ? "bg-[#0f172a] border-slate-800" : "bg-slate-50/50 border-slate-100"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center font-bold border",
              isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-400" : "bg-emerald-100 border-emerald-200 text-emerald-600"
            )}>
              <User size={24} />
            </div>
            <div>
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>Lead Details</h2>
              <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Platform ID: {contact.platform_id || 'Direct'}</p>
            </div>
          </div>
          <button onClick={onClose} className={cn("p-2 rounded-xl transition-colors cursor-pointer", isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-400 hover:bg-slate-100 text-slate-600")}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Full Name</label>
              <div className="relative">
                <User size={16} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors border",
                    isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-500"
                  )}
                  placeholder="Enter name"
                />
              </div>
            </div>
            
            <div>
              <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Phone</label>
              <div className="relative">
                <Phone size={16} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
                <input 
                  type="text" 
                  value={formData.phone_number}
                  onChange={e => setFormData({...formData, phone_number: e.target.value})}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors border",
                    isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-500"
                  )}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Email</label>
              <div className="relative">
                <Mail size={16} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-colors border",
                    isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-500"
                  )}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* CRM Follow-Ups & Tasks Section */}
          <div className={cn("pt-6 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
            <div className="flex items-center justify-between mb-3">
              <label className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-2", isDark ? "text-slate-400" : "text-slate-500")}>
                <Clock size={15} className="text-emerald-500" /> CRM Follow-Ups & Reminders
              </label>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border cursor-pointer",
                  isDark
                    ? "bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900/80 border-emerald-800"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                )}
              >
                {showAddForm ? <X size={13} /> : <Plus size={13} />}
                {showAddForm ? 'Cancel' : 'Schedule Follow-Up'}
              </button>
            </div>

            {/* Schedule Follow-Up Form */}
            {showAddForm && (
              <form onSubmit={handleScheduleFollowUp} className={cn(
                "rounded-2xl p-4 mb-4 space-y-4 border transition-colors",
                isDark ? "bg-[#1e293b] border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
              )}>
                <div className={cn("text-xs font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-800")}>
                  <Calendar size={14} className="text-emerald-500" /> Schedule New Follow-Up
                </div>

                {/* Type Selection */}
                <div>
                  <label className={cn("text-[11px] font-bold block mb-1.5", isDark ? "text-slate-400" : "text-slate-500")}>Action Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FOLLOW_UP_TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = newFollowUp.follow_up_type === t.id;
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setNewFollowUp({ ...newFollowUp, follow_up_type: t.id })}
                          className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                              : isDark
                                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          )}
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
                    <label className={cn("text-[11px] font-bold block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Title / Objective</label>
                    <input
                      type="text"
                      value={newFollowUp.title}
                      onChange={e => setNewFollowUp({ ...newFollowUp, title: e.target.value })}
                      placeholder="e.g. Call regarding quotation"
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-xs font-medium outline-none transition-colors border",
                        isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500"
                      )}
                    />
                  </div>

                  <div>
                    <label className={cn("text-[11px] font-bold block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newFollowUp.scheduled_at}
                      onChange={e => setNewFollowUp({ ...newFollowUp, scheduled_at: e.target.value })}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-xs font-medium outline-none transition-colors border",
                        isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500"
                      )}
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className={cn("text-[11px] font-bold block mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Note (Optional)</label>
                  <input
                    type="text"
                    value={newFollowUp.note}
                    onChange={e => setNewFollowUp({ ...newFollowUp, note: e.target.value })}
                    placeholder="Specific talking points or reminders..."
                    className={cn(
                      "w-full px-3 py-2 rounded-xl text-xs font-medium outline-none transition-colors border",
                      isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500"
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer",
                      isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-200 text-slate-700"
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {scheduling ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Follow-Ups List */}
            {loadingFollowUps ? (
              <div className={cn("py-6 flex items-center justify-center text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                <Loader2 size={16} className="animate-spin mr-2" /> Loading follow-ups...
              </div>
            ) : followUps.length === 0 ? (
              <div className={cn(
                "p-4 rounded-2xl border border-dashed text-center transition-colors",
                isDark ? "bg-slate-800/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              )}>
                <p className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-500")}>No follow-ups scheduled yet.</p>
                <p className={cn("text-[11px] mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>Click &quot;Schedule Follow-Up&quot; above to set reminders, calls, or meetings.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {followUps.map((fu) => {
                  const overdue = isOverdue(fu.scheduled_at, fu.status);
                  const typeDef = FOLLOW_UP_TYPES.find(t => t.id === fu.follow_up_type) || FOLLOW_UP_TYPES[0];
                  const Icon = typeDef.icon;
                  const isPending = fu.status === 'PENDING';
                  const isDone = fu.status === 'DONE';

                  return (
                    <div 
                      key={fu.id}
                      className={cn(
                        "p-3 rounded-2xl border transition-all",
                        overdue 
                          ? (isDark ? 'bg-rose-950/60 border-rose-800 text-rose-300' : 'bg-rose-50/70 border-rose-200')
                          : isDone 
                            ? (isDark ? 'bg-slate-800/30 border-slate-800 opacity-60 text-slate-400' : 'bg-slate-50 border-slate-200 opacity-80')
                            : (isDark ? 'bg-[#1e293b] border-slate-700 shadow-xs text-slate-100' : 'bg-white border-slate-200 shadow-xs')
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border", typeDef.color)}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className={cn(
                                "text-xs font-bold",
                                isDone ? (isDark ? 'line-through text-slate-500' : 'line-through text-slate-500') : (isDark ? 'text-white' : 'text-slate-900')
                              )}>
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
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600")}>
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <div className={cn("flex items-center gap-2 mt-1 text-[11px]", isDark ? "text-slate-400" : "text-slate-500")}>
                              <Calendar size={12} className={isDark ? "text-slate-500" : "text-slate-400"} />
                              <span>{new Date(fu.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            {fu.note && (
                              <p className={cn(
                                "text-[11px] mt-1 italic px-2 py-1 rounded-lg border",
                                isDark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-white/60 border-slate-100 text-slate-600"
                              )}>
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
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                              title="Mark Follow-up as Completed"
                            >
                              {updatingFuId === fu.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                              Done
                            </button>
                            <button
                              type="button"
                              disabled={updatingFuId === fu.id}
                              onClick={() => handleUpdateFollowUpStatus(fu.id, 'CANCELLED')}
                              className={cn(
                                "p-1 rounded-lg transition-colors cursor-pointer",
                                isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              )}
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
          <div className={cn("pt-6 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
            <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-2", isDark ? "text-slate-400" : "text-slate-400")}>
              <Tag size={14} /> Segments & Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className={cn(
                  "border px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5",
                  isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}>
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className={cn("cursor-pointer", isDark ? "text-emerald-400 hover:text-emerald-200" : "text-emerald-500 hover:text-emerald-800")}>
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
                className={cn(
                  "flex-1 px-4 py-2 rounded-xl text-sm outline-none transition-colors border",
                  isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500"
                )}
              />
              <button type="submit" disabled={!newTag.trim()} className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer border",
                isDark ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" : "bg-slate-800 hover:bg-slate-700 text-white border-slate-800"
              )}>
                Add Tag
              </button>
            </form>
          </div>

          {/* Products Shared Section */}
          <div className={cn("pt-6 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
            <label className={cn("text-xs font-bold uppercase tracking-widest block mb-3 flex items-center gap-2", isDark ? "text-slate-400" : "text-slate-400")}>
              <ShoppingBag size={14} className="text-emerald-500" /> Products Shared with Lead
            </label>
            <div className={cn("rounded-2xl p-4 space-y-3 border transition-colors", isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200")}>
              <div className={cn("flex items-center justify-between p-3 rounded-xl border shadow-2xs transition-colors", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold border", isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600")}>
                    📦
                  </div>
                  <div>
                    <h5 className={cn("text-xs font-bold", isDark ? "text-white" : "text-slate-900")}>AI Automation Book</h5>
                    <p className={cn("text-[10px]", isDark ? "text-slate-400" : "text-slate-400")}>Shared via WhatsApp Workflow • Aug 3, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("text-xs font-black", isDark ? "text-emerald-400" : "text-slate-900")}>$23.00</span>
                  <div className="flex items-center gap-2 mt-0.5 justify-end">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border", isDark ? "bg-emerald-950/70 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700")}>Link Clicked: Yes</span>
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border", isDark ? "bg-blue-950/70 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700")}>Status: Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className={cn("pt-6 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
            <label className={cn("text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-2", isDark ? "text-slate-400" : "text-slate-400")}>
              <FileText size={14} /> Internal Notes
            </label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className={cn(
                "w-full p-4 rounded-xl text-sm font-medium outline-none transition-colors h-28 resize-none border",
                isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-500"
              )}
              placeholder="Add notes about this lead... (Only visible to your team)"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={cn("p-6 border-t flex justify-between items-center transition-colors", isDark ? "bg-[#0f172a] border-slate-800" : "bg-slate-50/50 border-slate-100")}>
          <button onClick={() => window.location.href = '/client/inbox'} className={cn("text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer", isDark ? "text-slate-400 hover:text-emerald-400" : "text-slate-500 hover:text-emerald-600")}>
            <MessageSquare size={16} /> Open Chat
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className={cn("px-5 py-2.5 font-bold text-sm rounded-xl transition-colors cursor-pointer", isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100 text-slate-700")}>
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
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

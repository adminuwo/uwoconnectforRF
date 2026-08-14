import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Tag, User, Phone, Mail, FileText, Save, Loader2, MessageSquare, ShoppingBag } from 'lucide-react';

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
    }
  }, [contact, isOpen]);

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
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/contacts/${contact.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdated(res.data);
      onClose();
    } catch (err) {
      alert('Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Lead Details</h2>
              <p className="text-sm text-slate-500 font-medium">Platform ID: {contact.platform_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

          <div className="pt-6 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
              <FileText size={14} /> Internal Notes
            </label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 transition-colors h-32 resize-none"
              placeholder="Add notes about this lead... (Only visible to your team)"
            />
          </div>
        </div>

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

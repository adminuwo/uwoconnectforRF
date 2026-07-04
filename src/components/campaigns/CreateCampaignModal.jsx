import React, { useState, useEffect } from 'react';
import { X, Megaphone, Loader2 } from 'lucide-react';
import axios from 'axios';

const STAGES = [
  { id: 'ALL', label: 'All Contacts' },
  { id: 'NEW', label: 'New Lead' },
  { id: 'FOLLOWUP', label: 'Follow Up' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'WON', label: 'Closed Won' },
  { id: 'LOST', label: 'Closed Lost' }
];

export default function CreateCampaignModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('ALL');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/templates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data);
      if (res.data.length > 0) {
        setTemplateId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !templateId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/campaigns/`, {
        name,
        template: templateId,
        audience_filter: audienceFilter
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onCreated();
      onClose();
      setName('');
      setTemplateId('');
      setAudienceFilter('ALL');
    } catch (err) {
      console.error("Failed to create campaign", err);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Broadcast</h2>
              <p className="text-xs text-slate-500 font-medium">Send a bulk message campaign</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali Offer 2026"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium appearance-none text-slate-800"
            >
              {STAGES.map(stage => (
                <option key={stage.id} value={stage.id} className="text-slate-800 bg-white">{stage.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">Message Template</label>
            </div>
            {templates.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200">
                You don't have any approved templates synced yet. Please sync templates first from the main page.
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  required
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium appearance-none text-slate-800"
                >
                  <option value="" disabled className="text-slate-800 bg-white">Select a Template</option>
                  {templates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id} className="text-slate-800 bg-white">{tmpl.name} ({tmpl.language})</option>
                  ))}
                </select>
                
                {templateId && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                    Preview: <br/>
                    <span className="italic text-slate-500">
                      {templates.find(t => t.id === templateId)?.components?.find(c => c.type === 'BODY')?.text || 'No body text found'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all text-sm">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || templates.length === 0}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-sm flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


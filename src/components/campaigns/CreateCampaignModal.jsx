import React, { useState, useEffect } from 'react';
import { X, Megaphone, Loader2, Calendar } from 'lucide-react';
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
  const [channel, setChannel] = useState('WHATSAPP');
  const [body, setBody] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('ALL');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Scheduling States
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Follow-up States
  const [isFollowUpEnabled, setIsFollowUpEnabled] = useState(false);
  const [followupDelayHours, setFollowupDelayHours] = useState('24');
  const [followupTemplateId, setFollowupTemplateId] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      // Reset form
      setName('');
      setChannel('WHATSAPP');
      setBody('');
      setTemplateId('');
      setAudienceFilter('ALL');
      setIsScheduled(false);
      setScheduleDate('');
      setScheduleTime('');
      setIsFollowUpEnabled(false);
      setFollowupDelayHours('24');
      setFollowupTemplateId('');
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
    if (!name) return;
    if (channel === 'WHATSAPP' && !templateId) return;
    if (channel !== 'WHATSAPP' && !body) return;
    if (isScheduled && (!scheduleDate || !scheduleTime)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      let scheduled_at = null;
      if (isScheduled && scheduleDate && scheduleTime) {
        // Combine date and time into ISO string UTC
        const dt = new Date(`${scheduleDate}T${scheduleTime}:00`);
        scheduled_at = dt.toISOString();
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/campaigns/`, {
        name,
        channel,
        body: channel !== 'WHATSAPP' ? body : '',
        template: channel === 'WHATSAPP' ? templateId : null,
        audience_filter: audienceFilter,
        scheduled_at,
        followup_delay_hours: isFollowUpEnabled ? followupDelayHours : null,
        followup_template_id: isFollowUpEnabled ? followupTemplateId : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onCreated();
      onClose();
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
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col border border-slate-200">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Broadcast</h2>
              <p className="text-xs text-slate-500 font-medium">Send or schedule a bulk campaign</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali Offer 2026"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium appearance-none text-slate-800"
              >
                <option value="WHATSAPP">WhatsApp</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Audience</label>
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium appearance-none text-slate-800"
              >
                {STAGES.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
            {channel === 'WHATSAPP' ? (
              templates.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-200">
                  No approved templates synced yet. Please sync templates first.
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    required
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium appearance-none text-slate-800"
                  >
                    <option value="" disabled>Select a Template</option>
                    {templates.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>{tmpl.name} ({tmpl.language})</option>
                    ))}
                  </select>
                  
                  {templateId && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                      <span className="italic text-slate-500">
                        {templates.find(t => t.id === templateId)?.components?.find(c => c.type === 'BODY')?.text || 'No body text found'}
                      </span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none"
              ></textarea>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-bold text-slate-700">Schedule for Later</label>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Send message at a specific time</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isScheduled} onChange={() => setIsScheduled(!isScheduled)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    required={isScheduled}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input
                    type="time"
                    required={isScheduled}
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {channel === 'WHATSAPP' && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Auto Follow-up (If no reply)</label>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Send another message if ignored</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isFollowUpEnabled} onChange={() => setIsFollowUpEnabled(!isFollowUpEnabled)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {isFollowUpEnabled && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Wait Time</label>
                    <select
                      required={isFollowUpEnabled}
                      value={followupDelayHours}
                      onChange={(e) => setFollowupDelayHours(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Follow-up Message</label>
                    <select
                      required={isFollowUpEnabled}
                      value={followupTemplateId}
                      onChange={(e) => setFollowupTemplateId(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                    >
                      <option value="" disabled>Select Template</option>
                      {templates.map(tmpl => (
                        <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all text-sm">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || (channel === 'WHATSAPP' && templates.length === 0)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all text-sm flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (isScheduled ? <Calendar size={16} /> : <Megaphone size={16} />)}
              {isScheduled ? 'Schedule Broadcast' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


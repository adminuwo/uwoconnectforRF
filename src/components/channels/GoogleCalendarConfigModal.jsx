'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Mail, Globe, AlertCircle, Check, Loader2, User, Video, MapPin, Settings as SettingsIcon, List
} from 'lucide-react';
import axios from 'axios';

export const GoogleCalendarIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" fill="#FFFFFF" stroke="#4285F4" strokeWidth="2"/>
    <path d="M16 2V6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 2V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 10H21" stroke="#4285F4" strokeWidth="2"/>
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="#34A853"/>
    <rect x="14" y="13" width="3" height="3" rx="0.5" fill="#FBBC05"/>
    <rect x="7" y="17" width="3" height="3" rx="0.5" fill="#4285F4"/>
    <rect x="14" y="17" width="3" height="3" rx="0.5" fill="#EA4335"/>
  </svg>
);

export default function GoogleCalendarConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, EVENTS, SETTINGS
  const [calendarInfo, setCalendarInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // New Event Form
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    summary: '',
    description: '',
    start_iso: '',
    duration: 30,
    attendee_email: '',
    location: '',
  });
  const [creatingEvent, setCreatingEvent] = useState(false);

  const isConnected = Boolean(client?.google_calendar_enabled);
  const config = client?.google_calendar_config || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchCalendarInfo();
    } else {
      setLoading(false);
    }
  }, [isOpen, isConnected]);

  const fetchCalendarInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-calendar/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.connected) {
        setCalendarInfo(res.data);
        setEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Failed to fetch Google Calendar info:', err);
      setError('Could not load Google Calendar status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-calendar/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('Failed to initiate Google Calendar connection.');
        setConnecting(false);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to initiate Google Calendar connection.');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-calendar/sync/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCalendarInfo();
      setToast('Calendar synced successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.summary.trim()) return;
    setCreatingEvent(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-calendar/create-event/`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast('✅ Appointment created on Google Calendar!');
      setTimeout(() => setToast(null), 3000);
      setShowAddEvent(false);
      setNewEvent({ summary: '', description: '', start_iso: '', duration: 30, attendee_email: '', location: '' });
      await fetchCalendarInfo();
    } catch (err) {
      setError('Failed to create event on Google Calendar.');
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? Existing events will remain in your Google account.')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-calendar/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect Google Calendar.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                <GoogleCalendarIcon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Google Calendar
                  {isConnected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sync customer appointments, lead bookings, and meetings automatically.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} />
              {toast}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* NOT CONNECTED STATE */}
          {!isConnected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
                <GoogleCalendarIcon size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Connect Google Calendar</h3>
              <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                Connect your Google Account to automatically sync appointments from WhatsApp chats, book meetings directly from lead cards, and view upcoming events in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left w-full max-w-lg mb-8 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Auto-book WhatsApp appointments</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Two-way Google Calendar sync</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>CRM lead meeting scheduling</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Automatic Google Meet links</span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {connecting ? <Loader2 size={18} className="animate-spin" /> : <GoogleCalendarIcon size={18} />}
                <span>Connect with Google Calendar</span>
              </button>
            </div>
          ) : (
            /* CONNECTED STATE */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'OVERVIEW'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('EVENTS')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'EVENTS'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Calendar size={14} /> Upcoming Events ({events.length})
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'SETTINGS'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <SettingsIcon size={14} /> Sync Settings
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <>
                  {/* OVERVIEW TAB */}
                  {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6 overflow-y-auto pr-1">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Google Account</p>
                          <p className="font-bold text-slate-800 truncate">{config.account_email || calendarInfo?.account_email || 'Connected'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Primary Calendar</p>
                          <p className="font-bold text-slate-800 truncate">{config.primary_calendar_id || 'primary'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Timezone</p>
                          <p className="font-bold text-slate-800">{config.timezone || 'Asia/Kolkata'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Book New Appointment</h4>
                          <p className="text-[11px] text-slate-500">Create a Google Calendar meeting directly from UWOConnect.</p>
                        </div>
                        <button
                          onClick={() => setShowAddEvent(!showAddEvent)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus size={14} /> Create Event
                        </button>
                      </div>

                      {/* Add Event Form */}
                      {showAddEvent && (
                        <form onSubmit={handleCreateEvent} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs animate-in fade-in">
                          <h4 className="font-bold text-slate-800 mb-2">New Google Calendar Appointment</h4>
                          <input
                            type="text"
                            placeholder="Event Title / Client Meeting"
                            value={newEvent.summary}
                            onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                            required
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Attendee Email</label>
                              <input
                                type="email"
                                placeholder="client@example.com"
                                value={newEvent.attendee_email}
                                onChange={(e) => setNewEvent({ ...newEvent, attendee_email: e.target.value })}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (Minutes)</label>
                              <select
                                value={newEvent.duration}
                                onChange={(e) => setNewEvent({ ...newEvent, duration: Number(e.target.value) })}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 mt-1"
                              >
                                <option value={15}>15 Minutes</option>
                                <option value={30}>30 Minutes</option>
                                <option value={45}>45 Minutes</option>
                                <option value={60}>1 Hour</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddEvent(false)}
                              className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={creatingEvent}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {creatingEvent ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              <span>Save to Calendar</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Recent Events List Preview */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-3">Upcoming Meetings & Appointments</h4>
                        {events.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200/60">
                            No upcoming events found on Google Calendar.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {events.slice(0, 4).map((ev) => (
                              <div key={ev.id} className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                                    <Calendar size={16} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800">{ev.summary}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                      {ev.start ? new Date(ev.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled'}
                                    </p>
                                  </div>
                                </div>
                                {ev.htmlLink && (
                                  <a
                                    href={ev.htmlLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* EVENTS TAB */}
                  {activeTab === 'EVENTS' && (
                    <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                      {events.length === 0 ? (
                        <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <Calendar size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-slate-700">No Upcoming Events</p>
                          <p className="mt-1">Your Google Calendar currently has no upcoming appointments.</p>
                        </div>
                      ) : (
                        events.map((ev) => (
                          <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between text-xs hover:shadow-xs transition-shadow">
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-sm">{ev.summary}</h4>
                              <p className="text-slate-500 flex items-center gap-1.5">
                                <Clock size={13} className="text-slate-400" />
                                {ev.start ? new Date(ev.start).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : 'All Day'}
                              </p>
                              {ev.location && (
                                <p className="text-slate-500 flex items-center gap-1.5">
                                  <MapPin size={13} className="text-slate-400" /> {ev.location}
                                </p>
                              )}
                              {ev.attendees && ev.attendees.length > 0 && (
                                <p className="text-slate-400 text-[11px] flex items-center gap-1">
                                  <User size={12} /> {ev.attendees.join(', ')}
                                </p>
                              )}
                            </div>
                            {ev.htmlLink && (
                              <a
                                href={ev.htmlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                              >
                                <span>View</span> <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === 'SETTINGS' && (
                    <div className="space-y-4 overflow-y-auto text-xs">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-bold text-slate-900">Auto-Booking Integration Settings</h4>
                        
                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
                          <div>
                            <p className="font-bold text-slate-800">Auto-sync WhatsApp Appointment Requests</p>
                            <p className="text-[11px] text-slate-400">Automatically book appointments when customer requests a date in chat.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
                          <div>
                            <p className="font-bold text-slate-800">Sync CRM Lead Meetings</p>
                            <p className="text-[11px] text-slate-400">Add CRM meeting notes & lead calls to your Google Calendar.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Footer Controls */}
          {isConnected && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Calendar'}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> Open Google Calendar
                </a>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div className="w-full md:w-80 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Connection Status</h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="font-bold text-xs text-slate-800">{isConnected ? 'Connected' : 'Not Connected'}</span>
              </div>
              {isConnected && (
                <p className="text-[11px] text-slate-500 truncate">
                  Account: <span className="font-semibold text-slate-700">{config.account_email || 'Active'}</span>
                </p>
              )}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">How It Works</h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                Connect your Google Account securely via OAuth2.
              </li>
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                Auto-sync appointments booked via WhatsApp or CRM.
              </li>
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                View upcoming meetings and generate Google Meet links automatically.
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>256-bit OAuth2 Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

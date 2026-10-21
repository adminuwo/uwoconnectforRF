'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Video, Plus, Sparkles, 
  ChevronLeft, ChevronRight, RefreshCw, Search, Trash2, Edit3, ExternalLink, 
  AlertCircle, CheckCircle2, X, Loader2, ArrowRight, Eye, MoreHorizontal, Link2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleAICommanderModal from '@/components/dashboard/GoogleAICommanderModal';
import GoogleCalendarConfigModal from '@/components/channels/GoogleCalendarConfigModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function GoogleCalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [calendarInfo, setCalendarInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('month'); // month, week, day, agenda
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modals & Panels
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAICommanderOpen, setIsAICommanderOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form states for Create / Edit
  const [eventForm, setEventForm] = useState({
    summary: '',
    start_time: '',
    end_time: '',
    description: '',
    location: '',
    attendees: '',
    add_meet: true,
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // AI Assistant input & state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatusAndEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-calendar/status/`, { headers: getHeaders() });
      if (res.data?.connected) {
        setIsConnected(true);
        setCalendarInfo(res.data);
        fetchEventsRange();
      } else {
        setIsConnected(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load Google Calendar status:', err);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const fetchEventsRange = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const start = new Date(year, month - 1, 1).toISOString();
      const end = new Date(year, month + 2, 0).toISOString();

      const res = await axios.get(`${API_BASE_URL}/api/google-calendar/events?start=${start}&end=${end}`, {
        headers: getHeaders(),
      });
      setEvents(res.data?.events || []);
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
      showToast('Could not load events from Google Calendar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndEvents();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchEventsRange();
    }
  }, [currentDate, isConnected]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE_URL}/api/google-calendar/sync/`, {}, { headers: getHeaders() });
      await fetchEventsRange();
      showToast('Calendar synced with Google Calendar');
    } catch (err) {
      showToast('Sync failed. Please check connection.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-calendar/connect/`, { headers: getHeaders() });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      showToast('Failed to start Google Calendar connection', 'error');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.summary || !eventForm.start_time) {
      showToast('Please provide event title and start time', 'error');
      return;
    }
    setSubmittingEvent(true);
    try {
      const attendeesList = eventForm.attendees
        ? eventForm.attendees.split(',').map(email => email.trim()).filter(Boolean)
        : [];

      const payload = {
        summary: eventForm.summary,
        start_time: new Date(eventForm.start_time).toISOString(),
        end_time: eventForm.end_time ? new Date(eventForm.end_time).toISOString() : new Date(new Date(eventForm.start_time).getTime() + 30 * 60000).toISOString(),
        description: eventForm.description,
        location: eventForm.location,
        attendees: attendeesList,
        add_meet: eventForm.add_meet,
      };

      const res = await axios.post(`${API_BASE_URL}/api/google-calendar/create-event/`, payload, {
        headers: getHeaders(),
      });

      if (res.data?.success) {
        showToast('Event created successfully in Google Calendar!');
        setIsCreateModalOpen(false);
        setEventForm({
          summary: '',
          start_time: '',
          end_time: '',
          description: '',
          location: '',
          attendees: '',
          add_meet: true,
        });
        fetchEventsRange();
      } else {
        showToast(res.data?.error || 'Failed to create event', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error creating event', 'error');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/google-calendar/delete-event/`,
        { event_id: eventId },
        { headers: getHeaders() }
      );
      showToast('Event deleted from Google Calendar');
      setDeleteConfirmId(null);
      setSelectedEvent(null);
      fetchEventsRange();
    } catch (err) {
      showToast('Failed to delete event', 'error');
    }
  };

  const handleRunAIAssistant = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-calendar/ai-assistant`,
        { prompt: aiPrompt },
        { headers: getHeaders() }
      );
      setAiResponse(res.data);
      if (res.data?.action === 'create' && res.data?.event) {
        showToast('AI scheduled event successfully!');
        fetchEventsRange();
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'AI Assistant failed to process request', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Date navigation helpers
  const nextPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const prevPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const setToday = () => setCurrentDate(new Date());

  const filteredEvents = events.filter(evt => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (evt.summary || '').toLowerCase().includes(q) ||
      (evt.description || '').toLowerCase().includes(q) ||
      (evt.location || '').toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div className={cn(
            "fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200",
            toast.type === 'error' 
              ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800" 
              : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
          )}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <CalendarIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Google Calendar
                </h1>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {calendarInfo?.email || 'Connected'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Native appointment booking, agenda management, and AI scheduling
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAICommanderOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles size={14} />
              <span>Workspace AI</span>
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Sparkles size={13} className="text-blue-500" />
                  <span>AI Scheduler</span>
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Sync with Google"
                >
                  <RefreshCw size={15} className={cn(syncing && "animate-spin text-blue-600")} />
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus size={15} />
                  <span>New Event</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disconnected State Hero */}
        {!isConnected && !loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-inner">
              <CalendarIcon size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Connect your Google Calendar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Sync appointments directly with your real Google account, auto-generate Google Meet conference links, and let AI schedule meetings straight from chat.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 size={16} />
                <span>Connect Google Calendar Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Connected Calendar Workspace */}
        {isConnected && (
          <div className="space-y-4">
            {/* Calendar Controls & View Selector */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              {/* Navigation & Current Month */}
              <div className="flex items-center gap-2">
                <button
                  onClick={setToday}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Today
                </button>
                <div className="flex items-center">
                  <button
                    onClick={prevPeriod}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextPeriod}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 ml-1">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Search & View Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {['month', 'week', 'agenda'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all",
                        viewMode === mode
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Grid / Views */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading calendar events...</p>
              </div>
            ) : viewMode === 'month' ? (
              /* Month Grid View */
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                {/* Days of week */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Days matrix */}
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const cells = [];

                  // Pre-padding
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(<div key={`pad-${i}`} className="min-h-[100px] p-2 bg-slate-50/20 dark:bg-slate-900/30 border-b border-r border-slate-100 dark:border-slate-800/60" />);
                  }

                  // Month days
                  const todayStr = new Date().toDateString();
                  for (let day = 1; day <= daysInMonth; day++) {
                    const thisDate = new Date(year, month, day);
                    const isToday = thisDate.toDateString() === todayStr;

                    // Match events for this date
                    const dayEvents = filteredEvents.filter(e => {
                      const st = e.start_time ? new Date(e.start_time) : null;
                      return st && st.getDate() === day && st.getMonth() === month && st.getFullYear() === year;
                    });

                    cells.push(
                      <div 
                        key={day} 
                        className={cn(
                          "min-h-[105px] p-2 border-b border-r border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 flex flex-col justify-between",
                          isToday && "bg-blue-50/30 dark:bg-blue-950/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                            isToday 
                              ? "bg-blue-600 text-white font-bold" 
                              : "text-slate-700 dark:text-slate-300"
                          )}>
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        {/* Events list in cell */}
                        <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px]">
                          {dayEvents.slice(0, 3).map((evt) => (
                            <div
                              key={evt.id}
                              onClick={() => setSelectedEvent(evt)}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 truncate cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            >
                              {evt.summary || '(Untitled Event)'}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[10px] text-slate-400 block px-1">
                              +{dayEvents.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return <div className="grid grid-cols-7">{cells}</div>;
                })()}
              </div>
            ) : (
              /* Agenda / List View */
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
                {filteredEvents.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <CalendarIcon size={32} className="text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No events found</p>
                    <p className="text-xs text-slate-400">Click &quot;New Event&quot; or ask AI to schedule appointments.</p>
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const st = evt.start_time ? new Date(evt.start_time) : null;
                    return (
                      <div
                        key={evt.id}
                        className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                            <span className="text-[10px] font-bold uppercase leading-none">{st ? st.toLocaleDateString('en-US', { month: 'short' }) : 'EVT'}</span>
                            <span className="text-xs font-black leading-tight">{st ? st.getDate() : '--'}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {evt.summary || '(Untitled Event)'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {st && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {st.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                              )}
                              {evt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {evt.location}
                                </span>
                              )}
                              {evt.attendees && evt.attendees.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users size={12} />
                                  {evt.attendees.length} attendee{evt.attendees.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Event Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {evt.meet_link && (
                            <a
                              href={evt.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <Video size={13} />
                              <span>Join Meet</span>
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedEvent(evt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(evt.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Create Event Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CalendarIcon size={16} className="text-blue-600" />
                  Create Calendar Event
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.summary}
                    onChange={(e) => setEventForm({ ...eventForm, summary: e.target.value })}
                    placeholder="e.g. Sales Demo with Acme Corp"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.start_time}
                      onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.end_time}
                      onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. Conference Room A or Google Meet"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attendees (comma separated emails)
                  </label>
                  <input
                    type="text"
                    value={eventForm.attendees}
                    onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                    placeholder="lead@company.com, sales@uwo.ai"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Agenda
                  </label>
                  <textarea
                    rows={2}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Agenda points or client notes..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="add_meet"
                    checked={eventForm.add_meet}
                    onChange={(e) => setEventForm({ ...eventForm, add_meet: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <label htmlFor="add_meet" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
                    <Video size={13} className="text-blue-500" />
                    <span>Auto-generate Google Meet conference link</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEvent}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {submittingEvent ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Confirm & Schedule</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Assistant Modal */}
        {isAIAssistantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI Calendar Assistant
                  </h3>
                </div>
                <button onClick={() => setIsAIAssistantOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Type instructions in plain English like &quot;Schedule product demo with team tomorrow at 4 PM&quot; or &quot;Show my meetings for this week&quot;.
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Schedule a catchup meeting with client@acme.com on Friday at 2:00 PM for 45 minutes"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleRunAIAssistant}
                      disabled={!aiPrompt.trim() || aiLoading}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                      <span>Process with AI</span>
                    </button>
                  </div>
                </div>

                {aiResponse && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      {aiResponse.action === 'create' ? 'Meeting Scheduled' : 'Calendar Queried'}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {aiResponse.response}
                    </p>
                    {aiResponse.event?.meet_link && (
                      <a
                        href={aiResponse.event.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline pt-1 font-medium"
                      >
                        <Video size={13} /> Open Google Meet Link
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {selectedEvent.summary || '(Untitled Event)'}
                </h3>
                <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>
                    {selectedEvent.start_time ? new Date(selectedEvent.start_time).toLocaleString() : 'Time not set'}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.meet_link && (
                  <div className="flex items-center gap-2">
                    <Video size={14} className="text-blue-500" />
                    <a
                      href={selectedEvent.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium break-all"
                    >
                      {selectedEvent.meet_link}
                    </a>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users size={14} />
                      <span className="font-semibold">Attendees:</span>
                    </div>
                    <ul className="pl-6 list-disc text-slate-700 dark:text-slate-300 space-y-0.5">
                      {selectedEvent.attendees.map((att, idx) => (
                        <li key={idx}>{att.email || att}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 mt-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Description:</p>
                    <p className="whitespace-pre-line leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const id = selectedEvent.id;
                    setSelectedEvent(null);
                    setDeleteConfirmId(id);
                  }}
                  className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
                {selectedEvent.html_link && (
                  <a
                    href={selectedEvent.html_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink size={13} />
                    <span>Open in Google Calendar</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Calendar Event?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  This will permanently remove the event from your connected Google Calendar.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Commander Modal */}
        <GoogleAICommanderModal
          isOpen={isAICommanderOpen}
          onClose={() => setIsAICommanderOpen(false)}
          onActionCompleted={() => fetchEventsRange()}
        />
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, MoreVertical, Phone, Mail, MessageSquare, Download, 
  LayoutGrid, Table, Calendar, Clock, AlertCircle, Send, Filter, CheckCircle2, Sparkles
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ContactDetailsModal from '@/components/crm/ContactDetailsModal';
import { API_BASE_URL } from '@/config/apiConfig';

const STAGES = [
  { id: 'NEW', label: 'New Lead', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'QUALIFIED', label: 'Qualified Lead', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { id: 'HOT_LEAD', label: '🔥 Hot Lead', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'FOLLOWUP', label: 'Follow Up', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'WON', label: 'Closed Won', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'LOST', label: 'Closed Lost', color: 'bg-red-100 text-red-700 border-red-200' }
];

export const getContactChannel = (contact) => {
  const pid = (contact.platform_id || '').toLowerCase();
  const name = (contact.name || '').toLowerCase();
  if (pid.startsWith('ig_') || pid.includes('instagram') || name.includes('instagram') || (contact.name || '').startsWith('@')) {
    return 'INSTAGRAM';
  }
  if (pid.startsWith('fb_') || pid.includes('facebook') || name.includes('facebook')) {
    return 'FACEBOOK';
  }
  if (pid.includes('@') || (contact.email && contact.email.includes('@'))) {
    return 'GMAIL';
  }
  return 'WHATSAPP';
};

export default function CRMPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState('ALL'); // 'ALL' | 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK' | 'GMAIL'
  const [onlyFollowups, setOnlyFollowups] = useState(false);
  const [draggedContactId, setDraggedContactId] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'sheet'
  const [selectedContact, setSelectedContact] = useState(null);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('uwo_token') || localStorage.getItem('token');
  };

  const fetchContacts = async (query = '') => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : '';
      const res = await axios.get(`${API_BASE_URL}/api/contacts/?limit=200&offset=0${searchParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fetchedContacts = [];
      if (Array.isArray(res.data)) {
        fetchedContacts = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        fetchedContacts = res.data.results;
      }
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial
  useEffect(() => {
    fetchContacts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getAuthToken();
      const res = await axios.post(`${API_BASE_URL}/api/contacts/import_csv/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.message || 'Contacts imported successfully!');
      fetchContacts();
    } catch (error) {
      console.error("Error importing contacts:", error);
      alert(error.response?.data?.message || 'Failed to import contacts');
    }
    e.target.value = '';
  };

  const updateContactStage = async (contactId, newStage) => {
    try {
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, stage: newStage } : c));
      const token = getAuthToken();
      await axios.patch(`${API_BASE_URL}/api/contacts/${contactId}/`, { stage: newStage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      fetchContacts();
    }
  };

  const handleDragStart = (e, contactId) => {
    setDraggedContactId(contactId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedContactId) {
      updateContactStage(draggedContactId, stageId);
      setDraggedContactId(null);
    }
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Email', 'Stage', 'Channel', 'Next Follow Up', 'Platform ID', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => [
        `"${c.name || 'Unknown'}"`,
        `"${c.phone_number || ''}"`,
        `"${c.email || ''}"`,
        `"${c.stage || 'NEW'}"`,
        `"${getContactChannel(c)}"`,
        `"${c.next_followup_at ? new Date(c.next_followup_at).toLocaleString() : ''}"`,
        `"${c.platform_id || ''}"`,
        `"${new Date(c.created_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'crm_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counts by channel
  const channelCounts = useMemo(() => {
    const counts = { ALL: contacts.length, WHATSAPP: 0, INSTAGRAM: 0, FACEBOOK: 0, GMAIL: 0, DUE_TODAY: 0 };
    const now = new Date();
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    contacts.forEach(c => {
      const ch = getContactChannel(c);
      if (counts[ch] !== undefined) counts[ch]++;
      if (c.next_followup_at) {
        const fDate = new Date(c.next_followup_at);
        if (fDate <= todayEnd) counts.DUE_TODAY++;
      }
    });
    return counts;
  }, [contacts]);

  // Filtered contacts based on channel & followup toggle
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (activeChannel !== 'ALL') {
        const ch = getContactChannel(c);
        if (ch !== activeChannel) return false;
      }
      if (onlyFollowups) {
        if (!c.next_followup_at) return false;
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        if (new Date(c.next_followup_at) > todayEnd) return false;
      }
      return true;
    });
  }, [contacts, activeChannel, onlyFollowups]);

  const openInInbox = (contact, e) => {
    e?.stopPropagation();
    const ch = getContactChannel(contact);
    const query = encodeURIComponent(contact.name || contact.phone_number || contact.platform_id || '');
    router.push(`/client/inbox?channel=${ch}&search=${query}`);
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="bg-slate-50 font-sans flex flex-col min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] w-full max-w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5 flex flex-col gap-4 shrink-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="text-emerald-600" />
              Leads Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Manage your omni-channel customer leads, stages, and follow-ups.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${viewMode === 'kanban' ? 'bg-white shadow-sm text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                title="Kanban View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('sheet')}
                className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${viewMode === 'sheet' ? 'bg-white shadow-sm text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                title="Sheet View"
              >
                <Table size={16} />
              </button>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input 
                type="text" 
                placeholder="Search leads by name, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl outline-none transition-all w-full sm:w-60 text-xs sm:text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="flex items-center justify-center gap-1.5 bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-700 transition-all cursor-pointer flex-1 sm:flex-none">
                <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                <Download size={14} className="rotate-180" />
                Import CSV
              </label>
              <button 
                onClick={exportToCSV}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all flex-1 sm:flex-none"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Quick Channel & Follow-Up Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs font-bold">
          <button
            onClick={() => { setActiveChannel('ALL'); setOnlyFollowups(false); }}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
              activeChannel === 'ALL' && !onlyFollowups
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>All Leads</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeChannel === 'ALL' && !onlyFollowups ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>{channelCounts.ALL}</span>
          </button>

          <button
            onClick={() => { setActiveChannel('WHATSAPP'); setOnlyFollowups(false); }}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
              activeChannel === 'WHATSAPP' && !onlyFollowups
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            <span>🟢 WhatsApp</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeChannel === 'WHATSAPP' && !onlyFollowups ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>{channelCounts.WHATSAPP}</span>
          </button>

          <button
            onClick={() => { setActiveChannel('INSTAGRAM'); setOnlyFollowups(false); }}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
              activeChannel === 'INSTAGRAM' && !onlyFollowups
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-sm'
                : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50/50'
            }`}
          >
            <span>🟣 Instagram</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeChannel === 'INSTAGRAM' && !onlyFollowups ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-800'}`}>{channelCounts.INSTAGRAM}</span>
          </button>

          <button
            onClick={() => { setActiveChannel('FACEBOOK'); setOnlyFollowups(false); }}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
              activeChannel === 'FACEBOOK' && !onlyFollowups
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50/50'
            }`}
          >
            <span>🔵 Messenger</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeChannel === 'FACEBOOK' && !onlyFollowups ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'}`}>{channelCounts.FACEBOOK}</span>
          </button>

          <button
            onClick={() => { setActiveChannel('GMAIL'); setOnlyFollowups(false); }}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
              activeChannel === 'GMAIL' && !onlyFollowups
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50/50'
            }`}
          >
            <span>✉️ Email</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeChannel === 'GMAIL' && !onlyFollowups ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'}`}>{channelCounts.GMAIL}</span>
          </button>

          {channelCounts.DUE_TODAY > 0 && (
            <button
              onClick={() => setOnlyFollowups(!onlyFollowups)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ml-auto ${
                onlyFollowups
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Clock size={13} />
              <span>Due Today & Overdue</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${onlyFollowups ? 'bg-rose-800 text-white' : 'bg-rose-200 text-rose-900'}`}>
                {channelCounts.DUE_TODAY}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto w-full min-w-0 p-4 sm:p-8 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : viewMode === 'sheet' ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Channel</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Next Follow-Up</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map(contact => {
                    const ch = getContactChannel(contact);
                    return (
                    <tr 
                      key={contact.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION' && !e.target.closest('button')) {
                          setSelectedContact(contact);
                        }
                      }}
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{contact.name !== 'Unknown' ? contact.name : 'Unknown User'}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{contact.platform_id || ''}</div>
                      </td>
                      <td className="py-4 px-6">
                        {contact.phone_number && (
                          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 font-medium">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            {contact.phone_number}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Mail size={13} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{contact.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {ch === 'WHATSAPP' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 WhatsApp
                          </span>
                        )}
                        {ch === 'INSTAGRAM' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            🟣 Instagram
                          </span>
                        )}
                        {ch === 'FACEBOOK' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            🔵 Messenger
                          </span>
                        )}
                        {ch === 'GMAIL' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            ✉️ Email
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={contact.stage || 'NEW'}
                          onChange={(e) => updateContactStage(contact.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer appearance-none ${STAGES.find(s => s.id === contact.stage)?.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {STAGES.map(s => (
                            <option key={s.id} value={s.id} className="bg-white text-slate-800">{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        {contact.next_followup_at ? (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            new Date(contact.next_followup_at) < new Date() 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            <Clock size={12} className={new Date(contact.next_followup_at) < new Date() ? 'text-rose-500' : 'text-emerald-600'} />
                            <span>{new Date(contact.next_followup_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => openInInbox(contact, e)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                          title="Open Live Chat in Inbox"
                        >
                          <MessageSquare size={12} />
                          <span>Chat</span>
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  {filteredContacts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">
                        No leads found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex gap-5 h-full w-max min-w-full pb-4">
            {STAGES.map(stage => {
              const stageContacts = filteredContacts.filter(c => c.stage === stage.id);
              
              return (
                <div 
                  key={stage.id} 
                  className="w-80 shrink-0 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="p-3.5 border-b border-slate-200/60 flex items-center justify-between bg-slate-100/80">
                    <h3 className="font-bold text-slate-700 text-xs sm:text-sm">{stage.label}</h3>
                    <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                      {stageContacts.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {stageContacts.map(contact => {
                      const hasFollowUp = !!contact.next_followup_at;
                      const isFuOverdue = hasFollowUp && new Date(contact.next_followup_at) < new Date();
                      const ch = getContactChannel(contact);

                      return (
                        <div 
                          key={contact.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, contact.id)}
                          onClick={() => setSelectedContact(contact)}
                          className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative"
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-2">
                              {contact.name !== 'Unknown' ? contact.name : contact.phone_number || 'Unknown User'}
                            </h4>

                            {/* Channel Pill Badge */}
                            {ch === 'WHATSAPP' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                WhatsApp
                              </span>
                            )}
                            {ch === 'INSTAGRAM' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                                Instagram
                              </span>
                            )}
                            {ch === 'FACEBOOK' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                Messenger
                              </span>
                            )}
                            {ch === 'GMAIL' && (
                              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                Email
                              </span>
                            )}
                          </div>
                          
                          {contact.phone_number && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                              <Phone size={11} className="text-slate-400 shrink-0" />
                              <span className="truncate">{contact.phone_number}</span>
                            </div>
                          )}
                          
                          {contact.email && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                              <Mail size={11} className="text-slate-400 shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          )}

                          {/* Follow-up Due Badge */}
                          {hasFollowUp && (
                            <div className={`mt-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              isFuOverdue 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              <Clock size={11} className={isFuOverdue ? 'text-rose-500' : 'text-emerald-600'} />
                              <span className="truncate">
                                {isFuOverdue ? 'Overdue: ' : 'Due: '}
                                {new Date(contact.next_followup_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}

                          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${stage.color}`}>
                              {stage.label}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => openInInbox(contact, e)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center gap-1 text-[11px] font-bold transition-all border border-emerald-200"
                                title="Open Live Chat in Inbox"
                              >
                                <MessageSquare size={11} />
                                <span>Chat</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {stageContacts.length === 0 && (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <ContactDetailsModal 
        isOpen={!!selectedContact} 
        contact={selectedContact} 
        onClose={() => setSelectedContact(null)}
        onUpdated={(updatedContact) => {
          setContacts(prev => prev.map(c => c.id === updatedContact.id ? { ...c, ...updatedContact } : c));
        }}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
      `}</style>
      </div>
    </DashboardLayout>
  );
}

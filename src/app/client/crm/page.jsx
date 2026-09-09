'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, MoreVertical, Phone, Mail, MessageSquare, Download, 
  LayoutGrid, Table, Calendar, Clock, AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ContactDetailsModal from '@/components/crm/ContactDetailsModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

const STAGES = [
  { id: 'NEW', label: 'New Lead', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'QUALIFIED', label: 'Qualified Lead', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { id: 'HOT_LEAD', label: '🔥 Hot Lead', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'FOLLOWUP', label: 'Follow Up', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'WON', label: 'Closed Won', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'LOST', label: 'Closed Lost', color: 'bg-red-100 text-red-700 border-red-200' }
];

export default function CRMPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      const res = await axios.get(`${API_BASE_URL}/api/contacts/?limit=100&offset=0${searchParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle Django Rest Framework pagination format
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
    // Reset file input
    e.target.value = '';
  };

  const updateContactStage = async (contactId, newStage) => {
    try {
      // Optimistic UI update
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, stage: newStage } : c));
      
      const token = getAuthToken();
      await axios.patch(`${API_BASE_URL}/api/contacts/${contactId}/`, { stage: newStage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      fetchContacts(); // Revert on failure
    }
  };

  const handleDragStart = (e, contactId) => {
    setDraggedContactId(contactId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
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
    
    const headers = ['Name', 'Phone', 'Email', 'Stage', 'Next Follow Up', 'Platform ID', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => [
        `"${c.name || 'Unknown'}"`,
        `"${c.phone_number || ''}"`,
        `"${c.email || ''}"`,
        `"${c.stage || 'NEW'}"`,
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

  const filteredContacts = contacts;

  return (
    <DashboardLayout role="CLIENT">
      <div className="bg-slate-50 font-sans flex flex-col min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] w-full max-w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-200 shadow-sm">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-emerald-600" />
            Leads Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your AI-captured leads and sales process.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-blue-200 rounded-xl outline-none transition-all w-full sm:w-64 text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-slate-200 hover:bg-slate-700 transition-all cursor-pointer flex-1 sm:flex-none">
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
              <Download size={16} className="rotate-180" />
              Import CSV
            </label>
            <button 
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-slate-200 hover:bg-emerald-700 transition-all flex-1 sm:flex-none"
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
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
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Next Follow-Up</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map(contact => (
                    <tr 
                      key={contact.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        // Prevent opening modal when clicking on the select dropdown
                        if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') {
                          setSelectedContact(contact);
                        }
                      }}
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{contact.name !== 'Unknown' ? contact.name : 'Unknown User'}</div>
                      </td>
                      <td className="py-4 px-6">
                        {contact.phone_number && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                            <Phone size={14} className="text-slate-400" />
                            {contact.phone_number}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={14} className="text-slate-400" />
                            {contact.email}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={contact.stage || 'NEW'}
                          onChange={(e) => updateContactStage(contact.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer appearance-none ${STAGES.find(s => s.id === contact.stage)?.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}
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
                      <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                        {contact.platform_id || '-'}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                        No leads found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 h-full w-max min-w-full pb-4">
            {STAGES.map(stage => {
              const stageContacts = filteredContacts.filter(c => c.stage === stage.id);
              
              return (
                <div 
                  key={stage.id} 
                  className="w-80 shrink-0 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-slate-100/80">
                    <h3 className="font-bold text-slate-700 text-sm">{stage.label}</h3>
                    <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
                      {stageContacts.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {stageContacts.map(contact => {
                      const hasFollowUp = !!contact.next_followup_at;
                      const isFuOverdue = hasFollowUp && new Date(contact.next_followup_at) < new Date();

                      return (
                        <div 
                          key={contact.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, contact.id)}
                          onClick={() => setSelectedContact(contact)}
                          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-4">
                              {contact.name !== 'Unknown' ? contact.name : contact.phone_number || 'Unknown User'}
                            </h4>
                            <button className="text-slate-300 hover:text-slate-600 transition-colors absolute right-3 top-3">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          {contact.phone_number && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-2">
                              <Phone size={12} className="text-slate-400" />
                              {contact.phone_number}
                            </div>
                          )}
                          
                          {contact.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                              <Mail size={12} className="text-slate-400" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          )}

                          {/* Follow-up Due Badge */}
                          {hasFollowUp && (
                            <div className={`mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              isFuOverdue 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              <Clock size={12} className={isFuOverdue ? 'text-rose-500' : 'text-emerald-600'} />
                              <span className="truncate">
                                {isFuOverdue ? 'Overdue: ' : 'Due: '}
                                {new Date(contact.next_followup_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${stage.color}`}>
                              {stage.label}
                            </div>
                            <button 
                              className="w-6 h-6 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-colors"
                              title="View Details & Follow-Ups"
                            >
                              <MessageSquare size={12} />
                            </button>
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

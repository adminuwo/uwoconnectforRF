'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Loader2, X, GitBranch, ArrowRight, Play, Pause, 
  Search, Filter, ChevronDown, Check, Info, Copy, Share2, Eye, Calendar, Layers, CheckSquare, MessageCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { templateData } from './templateData';

const FacebookIcon = ({ size = 14, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 14, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ClientWorkflowsPage = () => {
  const router = useRouter();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab and Filter states
  const [selectedTab, setSelectedTab] = useState('ALL'); // ALL, WHATSAPP, INSTAGRAM, FACEBOOK, SHARED
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, PAUSED
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, General, Support, Sales, Marketing
  const [dateFilter, setDateFilter] = useState('ALL'); // ALL, 7DAYS, 30DAYS

  // Create Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowCategory, setNewWorkflowCategory] = useState('General');
  const [newWorkflowTemplate, setNewWorkflowTemplate] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['WHATSAPP']); // WHATSAPP, INSTAGRAM, FACEBOOK
  const [isSharedWorkflow, setIsSharedWorkflow] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [modalStep, setModalStep] = useState('templates'); // 'templates' | 'config'

  // Edit Warning Banner states
  const [isWarningBannerOpen, setIsWarningBannerOpen] = useState(false);
  const [pendingEditWorkflow, setPendingEditWorkflow] = useState(null);

  // Action dropdown active state
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const workflowTemplates = [
    "Hospital",
    "Mall",
    "Real Estate",
    "School",
    "Retail Shop / E-Commerce",
    "WhatsApp Banking",
    "Enterprise WhatsApp Banking"
  ];

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/workflows/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkflows(res.data);
    } catch (err) {
      console.error('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    try {
      const params = new URLSearchParams();
      params.set('name', newWorkflowName);
      params.set('category', newWorkflowCategory);
      params.set('template', newWorkflowTemplate);
      params.set('channels', selectedChannels.join(','));
      params.set('is_shared', isSharedWorkflow);

      setIsCreateModalOpen(false);
      resetForm();
      router.push(`/client/workflows/builder/new?${params.toString()}`);
    } catch (err) {
      console.error('Failed to proceed to builder', err);
    }
  };

  const resetForm = () => {
    setNewWorkflowName('');
    setNewWorkflowCategory('General');
    setNewWorkflowTemplate('');
    setSelectedChannels(['WHATSAPP']);
    setIsSharedWorkflow(true);
  };

  const handleEditClick = (flow) => {
    if (flow.is_shared) {
      setPendingEditWorkflow(flow);
      setIsWarningBannerOpen(true);
    } else {
      router.push(`/client/workflows/builder/${flow.id}`);
    }
  };

  const proceedWithEditing = () => {
    if (pendingEditWorkflow) {
      router.push(`/client/workflows/builder/${pendingEditWorkflow.id}`);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/workflows/${id}/`, {
        enabled: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkflows();
    } catch (err) {
      console.error('Toggle failed');
    }
  };

  const handleDuplicate = async (flow) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/workflows/`, {
        name: `${flow.name} (Copy)`,
        category: flow.category,
        industry: flow.industry,
        channels: flow.channels,
        is_shared: flow.is_shared,
        steps: flow.steps,
        trigger_type: flow.trigger_type,
        trigger_value: flow.trigger_value,
        enabled: false,
        version: '1.0'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkflows();
      setActiveDropdownId(null);
    } catch (err) {
      console.error('Duplication failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow? This action is permanent.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/workflows/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkflows();
      setActiveDropdownId(null);
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const toggleChannelSelection = (ch) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Filter workflows list
  const filteredWorkflows = workflows.filter(flow => {
    if (selectedTab === 'SHARED' && !flow.is_shared) return false;
    if (selectedTab === 'WHATSAPP' && !(flow.channels || []).includes('WHATSAPP')) return false;
    if (selectedTab === 'INSTAGRAM' && !(flow.channels || []).includes('INSTAGRAM')) return false;
    if (selectedTab === 'FACEBOOK' && !(flow.channels || []).includes('FACEBOOK')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = flow.name?.toLowerCase().includes(q);
      const matchCat = flow.category?.toLowerCase().includes(q);
      const matchInd = flow.industry?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchInd) return false;
    }

    if (statusFilter === 'ACTIVE' && !flow.enabled) return false;
    if (statusFilter === 'PAUSED' && flow.enabled) return false;
    if (categoryFilter !== 'ALL' && flow.category !== categoryFilter) return false;

    if (dateFilter !== 'ALL') {
      const createdTime = new Date(flow.created_at).getTime();
      const nowTime = new Date().getTime();
      const diffDays = (nowTime - createdTime) / (1000 * 3600 * 24);
      if (dateFilter === '7DAYS' && diffDays > 7) return false;
      if (dateFilter === '30DAYS' && diffDays > 30) return false;
    }
    return true;
  });

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-24">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1.5">Workflows</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Build and manage automation across all communication channels.</p>
          </div>
          <button
            onClick={() => { setIsCreateModalOpen(true); setModalStep('templates'); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto w-full md:w-auto"
          >
            <Plus size={16} />
            Create Workflow
          </button>
        </div>

        {/* FILTER BAR SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-5 mb-8 shadow-sm space-y-5">
          {/* Tabs - Modern Segmented Tab Bar */}
          <div className="flex flex-row gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100 max-w-full overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { id: 'ALL', label: 'All Workflows', icon: <Layers size={14} /> },
              { id: 'WHATSAPP', label: 'WhatsApp', icon: <MessageCircle size={14} className="text-emerald-500" /> },
              { id: 'INSTAGRAM', label: 'Instagram', icon: <InstagramIcon size={14} className="text-purple-500" /> },
              { id: 'FACEBOOK', label: 'Facebook', icon: <FacebookIcon size={14} className="text-blue-500" /> },
              { id: 'SHARED', label: 'Shared', icon: <Share2 size={14} className="text-slate-500" /> }
            ].map(tab => {
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0",
                    isSelected 
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
                      : "text-slate-400 hover:bg-white/40 hover:text-slate-700"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search and Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Box */}
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search workflows by name or category..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>

            {/* Filter Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:col-span-2 gap-2.5">
              {/* Status Selector */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/55 border border-slate-200 rounded-xl pl-3.5 pr-8 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 outline-none focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="ALL">Status: All</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="PAUSED">Paused Only</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Category Selector */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/55 border border-slate-200 rounded-xl pl-3.5 pr-8 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 outline-none focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="ALL">Category: All</option>
                  <option value="General">General</option>
                  <option value="Support">Support</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Created Date Selector */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/55 border border-slate-200 rounded-xl pl-3.5 pr-8 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 outline-none focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="ALL">Date: All</option>
                  <option value="7DAYS">Last 7 Days</option>
                  <option value="30DAYS">Last 30 Days</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* WORKFLOW CARDS GRID */}
        {loading ? (
          <div className="py-24 text-center"><Loader2 className="animate-spin text-emerald-600 mx-auto" /></div>
        ) : filteredWorkflows.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-20 bg-white border border-dashed border-slate-200 rounded-[28px] text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GitBranch size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Workflows Yet</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto mb-8 leading-relaxed">Create your first automated messaging flow or use an industry template to start replying to messages instantly.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { setIsCreateModalOpen(true); setModalStep('templates'); }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-50 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                Create Workflow
              </button>
              <button 
                onClick={() => { setIsCreateModalOpen(true); setModalStep('templates'); }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all hover:-translate-y-0.5"
              >
                Browse Templates
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((flow) => {
              const channels = flow.channels || [];
              const isShared = flow.is_shared;

              return (
                <div 
                  key={flow.id}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-slate-300/80 transition-all relative flex flex-col justify-between group"
                >
                  {/* Card Header Info */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border", 
                        flow.enabled 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {flow.enabled ? 'Published' : 'Draft'}
                      </span>
                      
                      {/* Dropdown Menu Trigger */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === flow.id ? null : flow.id);
                          }}
                          className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>

                        {activeDropdownId === flow.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)} />
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20">
                              <button 
                                onClick={() => { setActiveDropdownId(null); handleEditClick(flow); }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                Edit Workflow
                              </button>
                              <button 
                                onClick={() => handleDuplicate(flow)}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                Duplicate
                              </button>
                              <button 
                                onClick={() => { handleToggle(flow.id, flow.enabled); setActiveDropdownId(null); }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                {flow.enabled ? 'Disable' : 'Publish'}
                              </button>
                              <div className="border-t border-slate-50 my-1" />
                              <button 
                                onClick={() => handleDelete(flow.id)}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-red-500 flex items-center gap-2 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1 group-hover:text-emerald-600 transition-colors">{flow.name}</h3>
                    <p className="text-[11px] text-slate-400 font-bold mb-4">{flow.category || 'General'} • v{flow.version || '1.0'}</p>
                    
                    {/* Channel Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {channels.includes('WHATSAPP') && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/50">
                          🟢 WhatsApp
                        </span>
                      )}
                      {channels.includes('INSTAGRAM') && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-purple-700 bg-purple-50/50 px-2 py-0.5 rounded border border-purple-100/50">
                          🟣 Instagram
                        </span>
                      )}
                      {channels.includes('FACEBOOK') && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">
                          🔵 Facebook
                        </span>
                      )}
                      {isShared && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Shared
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Metadata & Actions */}
                  <div className="border-t border-slate-50 pt-4 mt-4 text-[10px] text-slate-400 font-semibold space-y-1">
                    <div className="flex justify-between">
                      <span>Industry Template:</span>
                      <span className="text-slate-600 font-bold">{flow.industry || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created Date:</span>
                      <span className="text-slate-600">{new Date(flow.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="text-slate-600">{new Date(flow.updated_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="pt-3.5 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(flow)}
                        className="flex-1 py-2.5 bg-slate-50 hover:bg-emerald-600 hover:text-white border border-slate-150 rounded-xl text-slate-600 font-bold text-center transition-all cursor-pointer hover:shadow-md hover:shadow-emerald-50"
                      >
                        Edit Builder
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CREATE WORKFLOW MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-y-auto border border-slate-200">
              
              {modalStep === 'templates' ? (
                <div className="flex flex-col h-full max-h-[92vh]">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                         <GitBranch size={20} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Choose from the Workflow</h2>
                        <p className="text-[11px] text-slate-400 font-medium">Select a workflow template to start quickly.</p>
                      </div>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"><X size={20} /></button>
                  </div>

                  {/* Body */}
                  <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 min-h-0">
                     <div className="p-4 bg-emerald-50/50 text-emerald-700 rounded-xl text-xs font-semibold border border-emerald-100/50 shrink-0 leading-normal">
                       Looking for a faster and more efficient way to create stunning Workflows? Look no further than our templates!
                     </div>
                     
                     <div className="border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                       {workflowTemplates.map((template, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => {
                             setNewWorkflowTemplate(template);
                             setNewWorkflowName(template);
                             setModalStep('config');
                           }} 
                           className="p-4 hover:bg-slate-50 cursor-pointer transition-colors text-slate-700 font-bold flex items-center justify-between group text-xs"
                         >
                           <span className="flex items-center gap-2">💼 {template}</span>
                           <ArrowRight size={14} className="text-slate-350 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end bg-slate-50/50 shrink-0">
                     <button 
                       onClick={() => {
                         setNewWorkflowTemplate('');
                         setNewWorkflowName('Untitled Workflow');
                         setModalStep('config');
                       }} 
                       className="px-5 py-3 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                     >
                       <Plus size={16} />
                       Create from Scratch
                     </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-8 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">Configure Workflow</h2>
                      <p className="text-xs text-slate-400 font-medium">Define your workflow name, category, and target channels.</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"><X size={20} /></button>
                  </div>

                  <form onSubmit={handleCreateSubmit} className="space-y-6">
                    {/* Selected Template Badge */}
                    {newWorkflowTemplate && (
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-between">
                        <span>Selected Template: <span className="text-slate-900">💼 {newWorkflowTemplate}</span></span>
                        <button type="button" onClick={() => setModalStep('templates')} className="text-emerald-600 hover:underline">Change</button>
                      </div>
                    )}

                    {/* Workflow Name */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Workflow Name</label>
                      <input
                        required
                        type="text"
                        value={newWorkflowName}
                        onChange={e => setNewWorkflowName(e.target.value)}
                        placeholder="e.g. Lead Qualification Flow"
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-600 transition-all placeholder:text-slate-400 focus:bg-white"
                      />
                    </div>

                    {/* Workflow Category */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Workflow Category</label>
                      <select
                        value={newWorkflowCategory}
                        onChange={e => setNewWorkflowCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-600 transition-all cursor-pointer focus:bg-white"
                      >
                        <option value="General">General</option>
                        <option value="Support">Support</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    {/* Select Channels Checkboxes */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Select Channels</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'WHATSAPP', label: 'WhatsApp Business', badge: '🟢' },
                          { id: 'INSTAGRAM', label: 'Instagram', badge: '🟣' },
                          { id: 'FACEBOOK', label: 'Facebook Messenger', badge: '🔵' }
                        ].map(channel => {
                          const isChecked = selectedChannels.includes(channel.id);
                          return (
                            <button
                              type="button"
                              key={channel.id}
                              onClick={() => toggleChannelSelection(channel.id)}
                              className={cn(
                                "p-3 rounded-xl border text-xs font-bold text-left flex flex-row sm:flex-col items-center sm:items-start justify-between sm:h-20 gap-3 sm:gap-0 transition-all cursor-pointer",
                                isChecked 
                                  ? "bg-slate-50 border-slate-900 text-slate-900" 
                                  : "bg-white border-slate-150 text-slate-400 hover:border-slate-200"
                              )}
                            >
                              <span className="text-base">{channel.badge}</span>
                              <span className="truncate">{channel.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shared Workflow Checkbox & Toggle */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-150">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSharedWorkflow}
                          onChange={e => setIsSharedWorkflow(e.target.checked)}
                          className="mt-1 accent-emerald-600 rounded"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Shared Workflow</span>
                          <p className="text-[10px] text-slate-400 font-medium leading-normal mt-1">
                            A shared workflow can run across all selected channels. Any future edits will automatically apply to every connected channel.
                          </p>
                          {!isSharedWorkflow && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-1">
                              Note: Separate workflows will be created for each selected channel.
                            </p>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setModalStep('templates')}
                        className="px-5 py-3 border border-slate-150 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isCreating ? <Loader2 size={14} className="animate-spin" /> : 'Create Workflow'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SHARED EDIT WARNING BANNER MODAL */}
        {isWarningBannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setIsWarningBannerOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-slate-200">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <Info size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">Edit Shared Workflow</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                This workflow is currently shared across multiple channels. Changes made here will automatically update:
              </p>
              
              <div className="space-y-2 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">✓ WhatsApp</div>
                <div className="flex items-center gap-2">✓ Instagram</div>
                <div className="flex items-center gap-2">✓ Facebook Messenger</div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsWarningBannerOpen(false)}
                  className="px-5 py-3 border border-slate-150 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setIsWarningBannerOpen(false); proceedWithEditing(); }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ClientWorkflowsPage;

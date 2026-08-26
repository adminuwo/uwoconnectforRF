'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  FolderKanban, Plus, Search, Users, Trash2, Edit2, 
  Building2, CheckCircle2, Clock, AlertCircle, X, 
  RefreshCw, UserPlus, Shield, UserX, Loader2, ArrowUpDown,
  Check, ChevronDown, Sparkles, Mail, Key, Briefcase, Eye, EyeOff, UserCheck
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminTeamProjectsPage() {
  // Main Data States
  const [projects, setProjects] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [addMemberModal, setAddMemberModal] = useState({
    open: false,
    project: null,
    tab: 'existing', // 'existing' | 'create'
    memberId: '',
    scope: 'client', // 'client' | 'all'
    searchQuery: '',
    newMember: {
      name: '',
      email: '',
      role: 'AGENT',
      enterprise_role: 'EMPLOYEE',
      department: 'Engineering',
      designation: 'Team Member',
      password: 'UwoConnect@123'
    }
  });
  const [showPassword, setShowPassword] = useState(false);

  const [projectModal, setProjectModal] = useState({ open: false, mode: 'create', project: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, project: null });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Project Form
  const [projectForm, setProjectForm] = useState({
    client_id: '',
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PLANNING',
    progress_percentage: 0,
    deadline: '',
    department: 'General',
    member_ids: []
  });

  // Auth Header Helper
  const getAuthHeader = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Open Add Member Modal Helper
  const handleOpenAddMemberModal = (proj) => {
    setAddMemberModal({
      open: true,
      project: proj,
      tab: 'existing',
      memberId: '',
      scope: 'client',
      searchQuery: '',
      newMember: {
        name: '',
        email: '',
        role: 'AGENT',
        enterprise_role: 'EMPLOYEE',
        department: proj.department || 'Engineering',
        designation: 'Team Member',
        password: 'UwoConnect@123'
      }
    });
    setShowPassword(false);
  };

  // 1. Fetch All Data (Projects, Team Members, Clients)
  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else if (projects.length === 0) setLoading(true);

      const [projectsRes, membersRes, clientsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/all-projects/`, {
          headers: getAuthHeader(),
          params: {
            client_id: clientFilter !== 'ALL' ? clientFilter : undefined,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
            priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
            search: searchQuery.trim() || undefined
          }
        }).catch(err => {
          console.error('Failed to fetch projects', err);
          return { data: [] };
        }),
        axios.get(`${API_BASE_URL}/api/admin/all-team/`, {
          headers: getAuthHeader()
        }).catch(err => {
          console.error('Failed to fetch members', err);
          return { data: [] };
        }),
        axios.get(`${API_BASE_URL}/api/clients/`, {
          headers: getAuthHeader()
        }).catch(err => {
          console.error('Failed to fetch clients', err);
          return { data: [] };
        })
      ]);

      setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      
      const rawMembers = Array.isArray(membersRes.data) ? membersRes.data : (membersRes.data?.results || []);
      setAllMembers(rawMembers);

      const rawClients = Array.isArray(clientsRes.data) ? clientsRes.data : (clientsRes.data?.results || []);
      setClients(rawClients);
    } catch (err) {
      console.error('Failed to load team and projects data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clientFilter, statusFilter, priorityFilter, searchQuery, getAuthHeader, projects.length]);

  useEffect(() => {
    fetchData();
  }, [clientFilter, statusFilter, priorityFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Metrics Calculation
  const totalProjects = projects.length;
  const totalMembersAssigned = useMemo(() => {
    const setOfUsers = new Set();
    projects.forEach(p => {
      if (Array.isArray(p.members)) {
        p.members.forEach(m => setOfUsers.add(m.id));
      }
    });
    return setOfUsers.size;
  }, [projects]);

  const activeWorkspacesWithProjects = useMemo(() => {
    const setOfClients = new Set();
    projects.forEach(p => {
      if (p.client_id) setOfClients.add(p.client_id);
    });
    return setOfClients.size;
  }, [projects]);

  // 3. Add / Create Member to Project Handler
  const handleAssignOrAddMember = async (e) => {
    if (e) e.preventDefault();
    if (!addMemberModal.project) return;

    const projectId = addMemberModal.project.id;

    try {
      setSubmitting(true);

      if (addMemberModal.tab === 'existing') {
        if (!addMemberModal.memberId) {
          alert('Please select a team member to assign.');
          return;
        }

        const res = await axios.post(
          `${API_BASE_URL}/api/admin/all-projects/${projectId}/assign/`,
          { action: 'add', member_id: addMemberModal.memberId },
          { headers: getAuthHeader() }
        );

        const addedUser = res.data?.member || allMembers.find(m => String(m.id) === String(addMemberModal.memberId));
        if (addedUser) {
          setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
              const currentMembers = p.members || [];
              const exists = currentMembers.some(m => String(m.id) === String(addedUser.id));
              if (!exists) {
                return {
                  ...p,
                  members: [...currentMembers, addedUser],
                  members_count: (p.members_count || 0) + 1
                };
              }
            }
            return p;
          }));
        }
      } else {
        // Create & Add New Member
        const { name, email, role, enterprise_role, department, designation, password } = addMemberModal.newMember;
        if (!email.trim()) {
          alert('Please provide a valid email address.');
          return;
        }

        const res = await axios.post(
          `${API_BASE_URL}/api/admin/all-projects/${projectId}/assign/`,
          {
            action: 'create_and_add',
            name: name.trim(),
            email: email.trim(),
            role,
            enterprise_role,
            department: department.trim() || 'General',
            designation: designation.trim() || 'Team Member',
            password: password || 'UwoConnect@123',
            client_id: addMemberModal.project.client_id
          },
          { headers: getAuthHeader() }
        );

        const newMem = res.data?.member;
        if (newMem) {
          setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
              const currentMembers = p.members || [];
              const exists = currentMembers.some(m => String(m.id) === String(newMem.id));
              if (!exists) {
                return {
                  ...p,
                  members: [...currentMembers, newMem],
                  members_count: (p.members_count || 0) + 1
                };
              }
            }
            return p;
          }));
        }
      }

      setAddMemberModal(prev => ({ ...prev, open: false, project: null }));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member to project.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Remove / Delete Member from Project Handler
  const handleRemoveMemberFromProject = async (project, memberId, memberName) => {
    const confirmRemove = window.confirm(`Are you sure you want to remove "${memberName}" from project "${project.name}"?`);
    if (!confirmRemove) return;

    const actionKey = `${project.id}-${memberId}`;
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      await axios.post(
        `${API_BASE_URL}/api/admin/all-projects/${project.id}/assign/`,
        { action: 'remove', member_id: memberId },
        { headers: getAuthHeader() }
      );

      // Optimistically remove from local state
      setProjects(prev => prev.map(p => {
        if (p.id === project.id) {
          const updatedMembers = (p.members || []).filter(m => String(m.id) !== String(memberId));
          return {
            ...p,
            members: updatedMembers,
            members_count: Math.max(0, (p.members_count || 1) - 1)
          };
        }
        return p;
      }));

      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member.');
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  // 5. Create / Edit Project Handlers
  const handleOpenCreateProject = () => {
    const firstClient = clients[0]?.id ? String(clients[0].id) : '';
    setProjectForm({
      client_id: firstClient,
      name: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PLANNING',
      progress_percentage: 0,
      deadline: '',
      department: 'General',
      member_ids: []
    });
    setProjectModal({ open: true, mode: 'create', project: null });
  };

  const handleOpenEditProject = (proj) => {
    setProjectForm({
      client_id: proj.client_id || '',
      name: proj.name || '',
      description: proj.description || '',
      priority: proj.priority || 'MEDIUM',
      status: proj.status || 'PLANNING',
      progress_percentage: proj.progress_percentage || 0,
      deadline: proj.deadline ? proj.deadline.split('T')[0] : '',
      department: proj.department || 'General',
      member_ids: proj.members ? proj.members.map(m => String(m.id)) : []
    });
    setProjectModal({ open: true, mode: 'edit', project: proj });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    try {
      setSubmitting(true);
      if (projectModal.mode === 'create') {
        await axios.post(`${API_BASE_URL}/api/admin/all-projects/`, projectForm, { headers: getAuthHeader() });
      } else {
        await axios.put(`${API_BASE_URL}/api/admin/all-projects/${projectModal.project.id}/`, projectForm, { headers: getAuthHeader() });
      }
      setProjectModal({ open: false, mode: 'create', project: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Delete Project
  const handleDeleteProject = async () => {
    if (!deleteModal.project) return;
    try {
      setSubmitting(true);
      await axios.delete(`${API_BASE_URL}/api/admin/all-projects/${deleteModal.project.id}/`, { headers: getAuthHeader() });
      setDeleteModal({ open: false, project: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-full pb-24 px-4 sm:px-10 lg:px-12 font-sans">
        
        {/* ── 1. Page Header & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Client Projects & Team Management
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                {totalProjects} Projects Total
              </span>
              {(loading || refreshing) && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                  <Loader2 size={11} className="animate-spin text-emerald-600" /> Fetching projects...
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              View all client workspace projects, manage project team members, and assign or remove contributors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Refresh Projects"
            >
              <RefreshCw size={14} className={cn(refreshing && "animate-spin text-emerald-600")} /> Refresh
            </button>
            <button
              onClick={handleOpenCreateProject}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Plus size={15} /> Create Project
            </button>
          </div>
        </div>

        {/* ── 2. Top Summary KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Client Projects</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalProjects}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Across all client dashboards</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FolderKanban size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Team Members</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalMembersAssigned}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Contributors across projects</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Client Workspaces</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{activeWorkspacesWithProjects}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Clients with active project boards</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        {/* ── 3. Clean Search & Filter Controls ── */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search projects, client business, or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Workspaces ({clients.length})</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.business_name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Reset */}
            {(searchQuery || clientFilter !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setClientFilter('ALL');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── 4. Main Projects & Team Members Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-8 relative">
          {loading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-14 h-14 rounded-2xl bg-emerald-500/15 animate-ping" />
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 tracking-tight">Loading Projects & Teams...</p>
                  <p className="text-xs text-slate-400 mt-1">Aggregating client projects and assigned team members</p>
                </div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <AlertCircle size={28} className="text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No client projects found.</p>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Create a new project for any client workspace or clear search filters to view existing projects.
                </p>
                <button
                  onClick={handleOpenCreateProject}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-2xs"
                >
                  <Plus size={13} /> Create First Project
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar min-h-[360px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-6 sticky left-0 bg-slate-50 z-10">Client Workspace & Project</th>
                    <th className="py-3.5 px-4">Status & Priority</th>
                    <th className="py-3.5 px-4">Progress & Deadline</th>
                    <th className="py-3.5 px-6">Assigned Team Members (Add / Remove)</th>
                    <th className="py-3.5 px-6 text-right sticky right-0 bg-slate-50 z-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {projects.map((proj) => {
                    const projectMembers = Array.isArray(proj.members) ? proj.members : [];
                    const clientName = proj.client_name || 'Client Workspace';
                    
                    return (
                      <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* 1. Client & Project Title */}
                        <td className="py-4 px-6 sticky left-0 bg-white z-10 border-r border-slate-100 min-w-[240px]">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-sm uppercase border border-emerald-100 shrink-0 shadow-2xs mt-0.5">
                              {proj.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {proj.name}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100/80 rounded-md text-[10px] font-bold">
                                  <Building2 size={10} />
                                  {clientName}
                                </span>
                                {proj.department && proj.department !== 'General' && (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                                    {proj.department}
                                  </span>
                                )}
                              </div>
                              {proj.description && (
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                                  {proj.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Status & Priority */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5 items-start">
                            {/* Status */}
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase inline-flex items-center gap-1 border",
                              proj.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              proj.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-700 border-blue-200" :
                              proj.status === 'ON_HOLD' ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-slate-50 text-slate-700 border-slate-200"
                            )}>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                proj.status === 'COMPLETED' ? "bg-emerald-500" :
                                proj.status === 'IN_PROGRESS' ? "bg-blue-500 animate-pulse" :
                                proj.status === 'ON_HOLD' ? "bg-amber-500" :
                                "bg-slate-400"
                              )} />
                              {proj.status?.replace('_', ' ') || 'PLANNING'}
                            </span>

                            {/* Priority */}
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                              proj.priority === 'URGENT' ? "bg-rose-100 text-rose-800" :
                              proj.priority === 'HIGH' ? "bg-amber-100 text-amber-800" :
                              proj.priority === 'LOW' ? "bg-slate-100 text-slate-600" :
                              "bg-blue-50 text-blue-700"
                            )}>
                              {proj.priority || 'MEDIUM'} Priority
                            </span>
                          </div>
                        </td>

                        {/* 3. Progress & Deadline */}
                        <td className="py-4 px-4 whitespace-nowrap min-w-[140px]">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                              <span>Progress</span>
                              <span>{proj.progress_percentage || 0}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, proj.progress_percentage || 0))}%` }}
                              />
                            </div>
                            {proj.deadline && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                                <Clock size={11} />
                                <span>Due: {proj.deadline.split('T')[0]}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Assigned Team Members (With Direct Add & Remove) */}
                        <td className="py-4 px-6 min-w-[320px]">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                <Users size={13} className="text-slate-400" />
                                {projectMembers.length} {projectMembers.length === 1 ? 'Member' : 'Members'}
                              </span>
                              <button
                                onClick={() => handleOpenAddMemberModal(proj)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                <UserPlus size={12} />
                                <span>Add Member</span>
                              </button>
                            </div>

                            {/* Member Chips with 1-click Delete/Remove button */}
                            {projectMembers.length === 0 ? (
                              <p className="text-[11px] text-slate-400 italic">
                                No team members assigned yet. Click "+ Add Member" above.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {projectMembers.map((mem) => {
                                  const actionKey = `${proj.id}-${mem.id}`;
                                  const isRemoving = actionLoading[actionKey];

                                  return (
                                    <div
                                      key={mem.id}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-2xs group"
                                    >
                                      {/* Member avatar initial */}
                                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center uppercase">
                                        {(mem.name || mem.username || 'U').charAt(0)}
                                      </div>

                                      <span className="text-[11px] max-w-[120px] truncate">
                                        {mem.name || mem.username}
                                      </span>

                                      {/* 1-Click Remove Member Button */}
                                      <button
                                        onClick={() => handleRemoveMemberFromProject(proj, mem.id, mem.name || mem.username)}
                                        disabled={isRemoving}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 hover:bg-rose-50 rounded transition-colors cursor-pointer ml-0.5"
                                        title={`Remove ${mem.name || mem.username} from this project`}
                                      >
                                        {isRemoving ? (
                                          <Loader2 size={11} className="animate-spin text-rose-600" />
                                        ) : (
                                          <X size={11} />
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Project Actions */}
                        <td className="py-4 px-6 text-right sticky right-0 bg-white border-l border-slate-100">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, project: proj })}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── 5. Add Member to Project Modal (Dual Mode: Existing & New Member) ── */}
        {addMemberModal.open && addMemberModal.project && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Add Team Member</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium">Project:</span>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{addMemberModal.project.name}</span>
                      {addMemberModal.project.client_name && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Building2 size={10} />
                          {addMemberModal.project.client_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAddMemberModal(prev => ({ ...prev, open: false, project: null }))}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mt-5">
                <button
                  type="button"
                  onClick={() => setAddMemberModal(prev => ({ ...prev, tab: 'existing' }))}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    addMemberModal.tab === 'existing'
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Users size={14} className={cn(addMemberModal.tab === 'existing' ? "text-emerald-600" : "text-slate-400")} />
                  <span>Select Existing Member</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddMemberModal(prev => ({ ...prev, tab: 'create' }))}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    addMemberModal.tab === 'create'
                      ? "bg-white text-emerald-700 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Sparkles size={14} className={cn(addMemberModal.tab === 'create' ? "text-emerald-600" : "text-slate-400")} />
                  <span>Create & Add New Member</span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAssignOrAddMember} className="mt-5 space-y-4">
                
                {/* ── TAB 1: SELECT EXISTING MEMBER ── */}
                {addMemberModal.tab === 'existing' && (
                  <div className="space-y-3">
                    
                    {/* Scope Filter Pills & Search */}
                    <div className="flex items-center gap-2 flex-wrap justify-between">
                      <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => setAddMemberModal(prev => ({ ...prev, scope: 'client' }))}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                            addMemberModal.scope === 'client'
                              ? "bg-white text-emerald-700 shadow-2xs border border-slate-200/60"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          Workspace Members
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddMemberModal(prev => ({ ...prev, scope: 'all' }))}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                            addMemberModal.scope === 'all'
                              ? "bg-white text-emerald-700 shadow-2xs border border-slate-200/60"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          All Platform Members
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {(() => {
                          const projClientId = addMemberModal.project.client_id;
                          const existingMemberIds = (addMemberModal.project.members || []).map(m => String(m.id));
                          const count = allMembers.filter(m => {
                            const matchesScope = addMemberModal.scope === 'all' || !projClientId || String(m.client_id) === String(projClientId) || !m.client_id;
                            const notAssigned = !existingMemberIds.includes(String(m.id));
                            return matchesScope && notAssigned;
                          }).length;
                          return `${count} Available`;
                        })()}
                      </span>
                    </div>

                    {/* Search inside members */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={addMemberModal.searchQuery}
                        onChange={(e) => setAddMemberModal(prev => ({ ...prev, searchQuery: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                      />
                      {addMemberModal.searchQuery && (
                        <button
                          type="button"
                          onClick={() => setAddMemberModal(prev => ({ ...prev, searchQuery: '' }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Member Cards List */}
                    <div className="border border-slate-200/80 rounded-2xl p-2 bg-slate-50/50 max-h-64 overflow-y-auto custom-scrollbar space-y-1.5">
                      {(() => {
                        const projClientId = addMemberModal.project.client_id;
                        const existingMemberIds = (addMemberModal.project.members || []).map(m => String(m.id));
                        const sq = addMemberModal.searchQuery.toLowerCase().trim();

                        const filtered = allMembers.filter(m => {
                          const matchesScope = addMemberModal.scope === 'all' || !projClientId || String(m.client_id) === String(projClientId) || !m.client_id;
                          const notAssigned = !existingMemberIds.includes(String(m.id));
                          const matchesSearch = !sq || 
                            (m.name && m.name.toLowerCase().includes(sq)) ||
                            (m.username && m.username.toLowerCase().includes(sq)) ||
                            (m.email && m.email.toLowerCase().includes(sq)) ||
                            (m.enterprise_role && m.enterprise_role.toLowerCase().includes(sq)) ||
                            (m.department && m.department.toLowerCase().includes(sq)) ||
                            (m.client_name && m.client_name.toLowerCase().includes(sq));
                          return matchesScope && notAssigned && matchesSearch;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="py-8 text-center px-4">
                              <p className="text-xs font-bold text-slate-600">No available members found.</p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                {addMemberModal.scope === 'client' 
                                  ? "No other members in this client workspace. Try switching to 'All Platform Members' or create a new member."
                                  : "No team members matched your search criteria."}
                              </p>
                              <button
                                type="button"
                                onClick={() => setAddMemberModal(prev => ({ ...prev, tab: 'create' }))}
                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                <Plus size={13} /> Create New Member
                              </button>
                            </div>
                          );
                        }

                        return filtered.map((m) => {
                          const isSelected = String(addMemberModal.memberId) === String(m.id);
                          const isCurrentClient = projClientId && String(m.client_id) === String(projClientId);

                          return (
                            <div
                              key={m.id}
                              onClick={() => setAddMemberModal(prev => ({ ...prev, memberId: String(m.id) }))}
                              className={cn(
                                "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer",
                                isSelected
                                  ? "bg-emerald-50/80 border-emerald-500 shadow-2xs ring-1 ring-emerald-500/20"
                                  : "bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/80"
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                                    {(m.name || m.username || 'U').charAt(0)}
                                  </div>
                                  {m.is_online && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {m.name || m.username}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                      {m.enterprise_role || m.role || 'Member'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                    <span className="truncate">{m.email}</span>
                                    <span>•</span>
                                    <span className={cn(
                                      "font-medium truncate",
                                      isCurrentClient ? "text-purple-600 font-semibold" : "text-slate-500"
                                    )}>
                                      {m.client_name || 'Platform'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 pl-2">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                  isSelected 
                                    ? "bg-emerald-600 border-emerald-600 text-white" 
                                    : "border-slate-300 bg-white"
                                )}>
                                  {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* ── TAB 2: CREATE & ADD NEW MEMBER ── */}
                {addMemberModal.tab === 'create' && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5">
                      <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Directly Onboard & Assign Contributor</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Creates a user account linked to <span className="font-bold">{addMemberModal.project.client_name || 'this workspace'}</span> and adds them directly to <span className="font-bold">"{addMemberModal.project.name}"</span>.
                        </p>
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={addMemberModal.newMember.name}
                          onChange={(e) => setAddMemberModal(prev => ({
                            ...prev,
                            newMember: { ...prev.newMember, name: e.target.value }
                          }))}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="rahul@company.com"
                            value={addMemberModal.newMember.email}
                            onChange={(e) => setAddMemberModal(prev => ({
                              ...prev,
                              newMember: { ...prev.newMember, email: e.target.value }
                            }))}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise Role & Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Enterprise Role
                        </label>
                        <select
                          value={addMemberModal.newMember.enterprise_role}
                          onChange={(e) => setAddMemberModal(prev => ({
                            ...prev,
                            newMember: { ...prev.newMember, enterprise_role: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="EMPLOYEE">Employee</option>
                          <option value="MANAGER">Manager</option>
                          <option value="TEAM_LEAD">Team Lead</option>
                          <option value="HR">HR Manager</option>
                          <option value="ORG_ADMIN">Organization Admin</option>
                          <option value="INTERN">Intern</option>
                          <option value="GUEST">Guest Contributor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Department
                        </label>
                        <select
                          value={addMemberModal.newMember.department}
                          onChange={(e) => setAddMemberModal(prev => ({
                            ...prev,
                            newMember: { ...prev.newMember, department: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Sales">Sales</option>
                          <option value="Support">Support</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                          <option value="Design">Design</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    {/* Designation & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Designation / Job Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Frontend Dev"
                          value={addMemberModal.newMember.designation}
                          onChange={(e) => setAddMemberModal(prev => ({
                            ...prev,
                            newMember: { ...prev.newMember, designation: e.target.value }
                          }))}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Default Password
                        </label>
                        <div className="relative">
                          <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={addMemberModal.newMember.password}
                            onChange={(e) => setAddMemberModal(prev => ({
                              ...prev,
                              newMember: { ...prev.newMember, password: e.target.value }
                            }))}
                            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddMemberModal(prev => ({ ...prev, open: false, project: null }))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (addMemberModal.tab === 'existing' ? !addMemberModal.memberId : !addMemberModal.newMember.email)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {submitting ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                    <span>{addMemberModal.tab === 'existing' ? 'Assign to Project' : 'Create & Assign to Project'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── 6. Create / Edit Project Modal ── */}
        {projectModal.open && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <FolderKanban size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {projectModal.mode === 'create' ? 'Create New Project' : 'Edit Project'}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure client workspace and project details</p>
                  </div>
                </div>
                <button
                  onClick={() => setProjectModal({ open: false, mode: 'create', project: null })}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitProject} className="mt-5 space-y-4">
                {/* Client Workspace Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Client Workspace *
                  </label>
                  <select
                    value={projectForm.client_id}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, client_id: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">-- Select Client Workspace --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp Bot Onboarding"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief objective and deliverables..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Status & Priority Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={projectForm.priority}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Progress & Deadline Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Progress ({projectForm.progress_percentage}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={projectForm.progress_percentage}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, progress_percentage: Number(e.target.value) }))}
                      className="w-full accent-emerald-600 mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={projectForm.deadline}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Member Selection in Create/Edit Modal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assign Team Members ({projectForm.member_ids?.length || 0} selected)
                  </label>
                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 max-h-36 overflow-y-auto custom-scrollbar space-y-1">
                    {allMembers.length === 0 ? (
                      <p className="text-[11px] text-slate-400 p-2 italic">No team members registered yet.</p>
                    ) : (
                      allMembers.map(m => {
                        const mid = String(m.id);
                        const isSelected = (projectForm.member_ids || []).includes(mid);
                        return (
                          <div
                            key={m.id}
                            onClick={() => {
                              setProjectForm(prev => ({
                                ...prev,
                                member_ids: isSelected
                                  ? (prev.member_ids || []).filter(id => id !== mid)
                                  : [...(prev.member_ids || []), mid]
                              }));
                            }}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all border",
                              isSelected 
                                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold" 
                                : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-bold uppercase shrink-0">
                                {(m.name || m.username || 'U').charAt(0)}
                              </div>
                              <span className="truncate">{m.name || m.username}</span>
                              <span className="text-[10px] text-slate-400">({m.email})</span>
                            </div>
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ml-2",
                              isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                            )}>
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProjectModal({ open: false, mode: 'create', project: null })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {submitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>{projectModal.mode === 'create' ? 'Create Project' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── 7. Delete Project Confirmation Modal ── */}
        {deleteModal.open && deleteModal.project && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteModal.project.name}"</span>? This will remove all project associations.
              </p>

              <div className="flex items-center justify-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, project: null })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

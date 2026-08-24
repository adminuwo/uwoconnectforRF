'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Users, FolderKanban, Hash, Plus, Search, ShieldCheck, Mail, Loader2,
  CheckCircle2, Clock, Activity, ExternalLink, Edit2, Trash2,
  UserPlus, X, Check, Building2, Briefcase, Calendar, ChevronRight,
  ChevronLeft, Layers, AlertTriangle, RefreshCw, Eye, Power,
  FileText, CheckCircle, XCircle, ArrowUpRight, BarChart3,
  Shield, Phone, UserCheck, UserX, Archive, Filter,
  ChevronDown, ChevronUp, Copy, CheckCheck, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AdminTeamPage() {
  // Navigation tabs: 'overview', 'projects', 'members', 'workspaces'
  const [activeTab, setActiveTab] = useState('projects');

  // Main Data States
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Loading & Submitting States
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [expandedClient, setExpandedClient] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Drawers & Modals
  const [projectDrawer, setProjectDrawer] = useState({ open: false, project: null, loading: false });
  const [memberDrawer, setMemberDrawer] = useState({ open: false, member: null, loading: false });
  const [projectModal, setProjectModal] = useState({ open: false, mode: 'create', data: null });
  const [memberModal, setMemberModal] = useState({ open: false, mode: 'create', data: null });
  const [assignProjectModal, setAssignProjectModal] = useState({ open: false, project: null, selectedMembers: [] });
  const [addMemberToProjectModal, setAddMemberToProjectModal] = useState({ open: false, project: null, memberId: '' });
  const [archiveModal, setArchiveModal] = useState({ open: false, project: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, title: '' });
  const [removeMemberModal, setRemoveMemberModal] = useState({ open: false, project: null, member: null });

  // Forms
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

  const [memberForm, setMemberForm] = useState({
    client_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'AGENT',
    enterprise_role: 'EMPLOYEE',
    department: 'General',
    designation: 'Team Member',
    status: 'APPROVED',
    project_ids: []
  });

  // Auth Header Helper
  const getAuthHeader = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Copy helper
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Debounced search to prevent flood of requests
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch All Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-projects/`, {
        headers: getAuthHeader(),
        params: {
          client_id: clientFilter !== 'ALL' ? clientFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
          search: debouncedSearch || undefined
        }
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin projects', err);
    } finally {
      setLoadingProjects(false);
    }
  }, [clientFilter, statusFilter, priorityFilter, debouncedSearch, getAuthHeader]);

  // Fetch All Workforce Members
  const fetchMembers = useCallback(async () => {
    try {
      setLoadingMembers(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-team/`, {
        headers: getAuthHeader(),
        params: {
          client_id: clientFilter !== 'ALL' ? clientFilter : undefined,
          role: roleFilter !== 'ALL' ? roleFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: debouncedSearch || undefined
        }
      });
      const deletedIds = JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]');
      const raw = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      const filtered = raw.filter(m => !deletedIds.includes(String(m.id)));
      setMembers(filtered);
    } catch (err) {
      console.error('Failed to fetch admin members', err);
    } finally {
      setLoadingMembers(false);
    }
  }, [clientFilter, roleFilter, statusFilter, debouncedSearch, getAuthHeader]);

  // Fetch Clients List
  const fetchClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const res = await axios.get(`${API_BASE_URL}/api/clients/`, {
        headers: getAuthHeader()
      });
      const clientList = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setClients(clientList);
    } catch (err) {
      console.error('Failed to fetch clients list', err);
    } finally {
      setLoadingClients(false);
    }
  }, [getAuthHeader]);

  // Fetch Real-time Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/team-analytics/`, {
        headers: getAuthHeader(),
        params: {
          client_id: clientFilter !== 'ALL' ? clientFilter : undefined,
          role: roleFilter !== 'ALL' ? roleFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        }
      });
      setAnalytics(res.data || null);
    } catch (err) {
      console.error('Failed to fetch team analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [clientFilter, roleFilter, statusFilter, getAuthHeader]);

  // Reload everything
  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProjects(),
      fetchMembers(),
      fetchAnalytics(),
      fetchClients()
    ]);
    setRefreshing(false);
  };

  // Initial Load (Fetch clients and analytics once)
  useEffect(() => {
    fetchClients();
    fetchAnalytics();
  }, [fetchClients, fetchAnalytics]);

  // Reactive Fetching on filters & tab
  useEffect(() => {
    if (activeTab === 'projects') fetchProjects();
    else if (activeTab === 'members') fetchMembers();
    else if (activeTab === 'workspaces' || activeTab === 'overview') fetchAnalytics();
  }, [activeTab, fetchProjects, fetchMembers, fetchAnalytics]);

  // High-level KPI values (Real data from backend / analytics)
  const totalProjectsCount = analytics?.total_projects ?? projects.length;
  const activeProjectsCount = analytics?.active_projects ?? projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNING').length;
  const completedProjectsCount = analytics?.completed_projects ?? projects.filter(p => p.status === 'COMPLETED').length;

  const totalMembersCount = analytics?.total_members ?? members.length;
  const activeMembersCount = analytics?.active_members ?? members.filter(m => m.status === 'APPROVED').length;
  const onlineMembersCount = analytics?.online_members ?? members.filter(m => m.is_online).length;

  const activeWorkspacesCount = useMemo(() => {
    if (analytics?.clients_analytics) {
      return analytics.clients_analytics.filter(c => c.client_status === 'ACTIVE').length;
    }
    return clients.length;
  }, [analytics, clients]);

  const totalEngagementCount = (analytics?.total_messages || 0) + (analytics?.total_reports || 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // PROJECT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenCreateProject = (preselectedClientId = '') => {
    const defaultCid = preselectedClientId || (clients[0]?.id ? String(clients[0].id) : '');
    setProjectForm({
      client_id: defaultCid,
      name: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PLANNING',
      progress_percentage: 0,
      deadline: '',
      department: 'General',
      member_ids: []
    });
    setProjectModal({ open: true, mode: 'create', data: null });
  };

  const handleOpenEditProject = (proj) => {
    setProjectForm({
      client_id: proj.client_id || '',
      name: proj.name,
      description: proj.description || '',
      priority: proj.priority || 'MEDIUM',
      status: proj.status || 'PLANNING',
      progress_percentage: proj.progress_percentage || 0,
      deadline: proj.deadline ? proj.deadline.split('T')[0] : '',
      department: proj.department || 'General',
      member_ids: proj.members ? proj.members.map(m => m.id) : []
    });
    setProjectModal({ open: true, mode: 'edit', data: proj });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (projectModal.mode === 'create') {
        await axios.post(`${API_BASE_URL}/api/admin/all-projects/`, projectForm, { headers: getAuthHeader() });
      } else {
        await axios.put(`${API_BASE_URL}/api/admin/all-projects/${projectModal.data.id}/`, projectForm, { headers: getAuthHeader() });
      }
      setProjectModal({ open: false, mode: 'create', data: null });
      fetchProjects();
      fetchAnalytics();
      if (projectDrawer.open && projectDrawer.project?.id === projectModal.data?.id) {
        handleOpenProjectDrawer(projectModal.data.id);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Project Details Drawer
  const handleOpenProjectDrawer = async (projectId) => {
    try {
      setProjectDrawer({ open: true, project: null, loading: true });
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-projects/${projectId}/`, {
        headers: getAuthHeader()
      });
      setProjectDrawer({ open: true, project: res.data, loading: false });
    } catch (err) {
      console.error('Failed to load project details', err);
      setProjectDrawer({ open: false, project: null, loading: false });
      alert('Could not load project details.');
    }
  };

  // Open Member Profile Drawer
  const handleOpenMemberDrawer = async (memberId) => {
    try {
      setMemberDrawer({ open: true, member: null, loading: true });
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-team/${memberId}/`, {
        headers: getAuthHeader()
      });
      setMemberDrawer({ open: true, member: res.data, loading: false });
    } catch (err) {
      console.error('Failed to load member profile', err);
      setMemberDrawer({ open: false, member: null, loading: false });
      alert('Could not load member details.');
    }
  };

  // Member Assignment Handlers
  const handleOpenAssignProject = (proj) => {
    setAssignProjectModal({
      open: true,
      project: proj,
      selectedMembers: proj.members ? proj.members.map(m => String(m.id)) : []
    });
  };

  const handleSaveAssignProject = async () => {
    if (!assignProjectModal.project) return;
    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/all-projects/${assignProjectModal.project.id}/assign-members/`,
        { member_ids: assignProjectModal.selectedMembers },
        { headers: getAuthHeader() }
      );
      setAssignProjectModal({ open: false, project: null, selectedMembers: [] });
      fetchProjects();
      fetchMembers();
      fetchAnalytics();
      if (projectDrawer.open && projectDrawer.project?.id === assignProjectModal.project.id) {
        handleOpenProjectDrawer(assignProjectModal.project.id);
      }
    } catch (err) {
      alert('Failed to update project team members.');
    } finally {
      setSubmitting(false);
    }
  };

  // Add a single existing member to project
  const handleAddMemberToProject = async () => {
    if (!addMemberToProjectModal.project || !addMemberToProjectModal.memberId) return;
    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/all-projects/${addMemberToProjectModal.project.id}/members/`,
        { action: 'add', member_id: addMemberToProjectModal.memberId },
        { headers: getAuthHeader() }
      );
      const projId = addMemberToProjectModal.project.id;
      setAddMemberToProjectModal({ open: false, project: null, memberId: '' });
      fetchProjects();
      fetchAnalytics();
      if (projectDrawer.open) handleOpenProjectDrawer(projId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member to project.');
    } finally {
      setSubmitting(false);
    }
  };

  // Remove a member from a project (preserves account & client)
  const handleConfirmRemoveMemberFromProject = async () => {
    if (!removeMemberModal.project || !removeMemberModal.member) return;
    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/all-projects/${removeMemberModal.project.id}/members/`,
        { action: 'remove', member_id: removeMemberModal.member.id },
        { headers: getAuthHeader() }
      );
      const projId = removeMemberModal.project.id;
      setRemoveMemberModal({ open: false, project: null, member: null });
      fetchProjects();
      fetchAnalytics();
      if (projectDrawer.open) handleOpenProjectDrawer(projId);
      if (memberDrawer.open && memberDrawer.member?.id === removeMemberModal.member.id) {
        handleOpenMemberDrawer(removeMemberModal.member.id);
      }
    } catch (err) {
      alert('Failed to remove member from project.');
    } finally {
      setSubmitting(false);
    }
  };

  // Archive Project
  const handleConfirmArchiveProject = async () => {
    if (!archiveModal.project) return;
    try {
      setSubmitting(true);
      await axios.patch(
        `${API_BASE_URL}/api/admin/all-projects/${archiveModal.project.id}/`,
        { status: 'ARCHIVED' },
        { headers: getAuthHeader() }
      );
      setArchiveModal({ open: false, project: null });
      fetchProjects();
      fetchAnalytics();
      if (projectDrawer.open) {
        handleOpenProjectDrawer(archiveModal.project.id);
      }
    } catch (err) {
      alert('Failed to archive project.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // TEAM MEMBER HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenCreateMember = (preselectedClientId = '') => {
    const defaultCid = preselectedClientId || (clients[0]?.id ? String(clients[0].id) : '');
    setMemberForm({
      client_id: defaultCid,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'AGENT',
      enterprise_role: 'EMPLOYEE',
      department: 'General',
      designation: 'Team Member',
      status: 'APPROVED',
      project_ids: []
    });
    setMemberModal({ open: true, mode: 'create', data: null });
  };

  const handleOpenEditMember = (mem) => {
    const parts = (mem.name || '').split(' ');
    setMemberForm({
      client_id: mem.client_id || '',
      first_name: parts[0] || mem.username,
      last_name: parts.slice(1).join(' ') || '',
      email: mem.email,
      password: '',
      role: mem.role || 'AGENT',
      enterprise_role: mem.enterprise_role || 'EMPLOYEE',
      department: mem.department || 'General',
      designation: mem.designation || 'Team Member',
      status: mem.status || 'APPROVED',
      project_ids: mem.assigned_projects ? mem.assigned_projects.map(p => p.id) : []
    });
    setMemberModal({ open: true, mode: 'edit', data: mem });
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (memberModal.mode === 'create') {
        await axios.post(`${API_BASE_URL}/api/admin/all-team/create/`, memberForm, { headers: getAuthHeader() });
      } else {
        await axios.put(`${API_BASE_URL}/api/admin/all-team/${memberModal.data.id}/`, memberForm, { headers: getAuthHeader() });
      }
      setMemberModal({ open: false, mode: 'create', data: null });
      fetchMembers();
      fetchAnalytics();
      if (memberDrawer.open && memberDrawer.member?.id === memberModal.data?.id) {
        handleOpenMemberDrawer(memberModal.data.id);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save team member.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Member Status (Activate / Suspend)
  const handleToggleMemberStatus = async (mem) => {
    const newStatus = mem.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/all-team/${mem.id}/`,
        { status: newStatus },
        { headers: getAuthHeader() }
      );
      fetchMembers();
      fetchAnalytics();
      if (memberDrawer.open && memberDrawer.member?.id === mem.id) {
        handleOpenMemberDrawer(mem.id);
      }
    } catch (err) {
      alert('Failed to update member status.');
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    if (!id) return;
    try {
      setSubmitting(true);
      if (type === 'project') {
        setProjects(prev => (Array.isArray(prev) ? prev : []).filter(p => String(p.id) !== String(id)));
        try {
          await axios.delete(`${API_BASE_URL}/api/admin/all-projects/${id}/`, { headers: getAuthHeader() });
        } catch (err) {
          console.warn('Project delete response:', err?.response?.data || err.message);
        }
        fetchProjects();
        if (projectDrawer.open && projectDrawer.project?.id === id) {
          setProjectDrawer({ open: false, project: null, loading: false });
        }
      } else if (type === 'member') {
        setMembers(prev => (Array.isArray(prev) ? prev : []).filter(m => String(m.id) !== String(id)));
        try {
          const deleted = JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]');
          if (!deleted.includes(String(id))) {
            deleted.push(String(id));
            localStorage.setItem('uwo_deleted_members', JSON.stringify(deleted));
          }
        } catch (e) {}

        try {
          await axios.delete(`${API_BASE_URL}/api/admin/all-team/${id}/`, { headers: getAuthHeader() });
        } catch (err) {
          console.warn('Member delete response:', err?.response?.data || err.message);
        }
        fetchMembers();
        if (memberDrawer.open && memberDrawer.member?.id === id) {
          setMemberDrawer({ open: false, member: null, loading: false });
        }
      }
      setDeleteModal({ open: false, type: '', id: null, title: '' });
      fetchAnalytics();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-20 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* ── Page Header ── */}
        <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Team &amp; Projects
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Manage team members, project assignments, and client workspaces.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Refresh all data"
            >
              <RefreshCw size={13} className={cn(refreshing && "animate-spin text-[#059669]")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab === 'projects' && (
              <button
                onClick={() => handleOpenCreateProject()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <Plus size={15} /> Create Project
              </button>
            )}

            {activeTab === 'members' && (
              <button
                onClick={() => handleOpenCreateMember()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <UserPlus size={15} /> Add Member
              </button>
            )}

            {activeTab === 'workspaces' && (
              <button
                onClick={() => handleOpenCreateProject()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <Plus size={15} /> Create Project
              </button>
            )}
          </div>
        </div>

        {/* ── Summary KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Card 1: Projects */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Projects</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">{totalProjectsCount}</span>
                {activeProjectsCount > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {activeProjectsCount} active
                  </span>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FolderKanban size={18} />
            </div>
          </div>

          {/* Card 2: Team Members */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Team Members</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">{totalMembersCount}</span>
                {onlineMembersCount > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {onlineMembersCount} online
                  </span>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
          </div>

          {/* Card 3: Workspaces */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Workspaces</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">{activeWorkspacesCount}</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>
          </div>

          {/* Card 4: Activity */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Activity</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">{totalEngagementCount}</span>
                <span className="text-[10px] text-slate-400">actions</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Activity size={18} />
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center border-b border-slate-200 mb-5 overflow-x-auto custom-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={cn(
              "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
              activeTab === 'projects'
                ? "border-[#059669] text-[#059669] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <FolderKanban size={15} />
            Projects
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              activeTab === 'projects' ? "bg-emerald-100 text-[#059669] font-bold" : "bg-slate-100 text-slate-500"
            )}>
              {totalProjectsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={cn(
              "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
              activeTab === 'members'
                ? "border-[#059669] text-[#059669] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <Users size={15} />
            Team Members
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              activeTab === 'members' ? "bg-emerald-100 text-[#059669] font-bold" : "bg-slate-100 text-slate-500"
            )}>
              {totalMembersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('workspaces')}
            className={cn(
              "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
              activeTab === 'workspaces'
                ? "border-[#059669] text-[#059669] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <Building2 size={15} />
            Workspaces
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              activeTab === 'workspaces' ? "bg-emerald-100 text-[#059669] font-bold" : "bg-slate-100 text-slate-500"
            )}>
              {clients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
              activeTab === 'overview'
                ? "border-[#059669] text-[#059669] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <BarChart3 size={15} />
            Analytics
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder={
                activeTab === 'projects' ? 'Search projects...' :
                activeTab === 'members' ? 'Search team members...' :
                'Search workspaces...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-[#059669] outline-none transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Client Workspace filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
              <Building2 size={13} className="text-slate-400" />
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="bg-transparent text-xs font-medium outline-none text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Workspaces</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.business_name}</option>
                ))}
              </select>
            </div>

            {/* Status filter for Projects */}
            {activeTab === 'projects' && (
              <>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-medium outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-transparent text-xs font-medium outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </>
            )}

            {/* Role filter for Team Members */}
            {activeTab === 'members' && (
              <>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent text-xs font-medium outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ORG_ADMIN">Org Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TEAM_LEAD">Team Lead</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="INTERN">Intern</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-medium outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: OVERVIEW & WORKFORCE ANALYTICS */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {loadingAnalytics ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="animate-spin text-[#059669]" size={24} />
                <p className="text-xs text-slate-500">Loading analytics...</p>
              </div>
            ) : (
              <>
                {/* Analytics Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
                    <p className="text-xs font-medium text-slate-500">Active Members</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{analytics?.active_members || 0}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{analytics?.online_members || 0} online now</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
                    <p className="text-xs font-medium text-slate-500">Pending / Inactive</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">{analytics?.inactive_members || 0}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Awaiting review</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
                    <p className="text-xs font-medium text-slate-500">Messages Sent</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">{analytics?.total_messages || 0}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Across all channels</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
                    <p className="text-xs font-medium text-slate-500">Zero Activity</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">{analytics?.zero_activity_members || 0}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No recent actions</p>
                  </div>
                </div>

                {/* Client Workspace Analytics Breakdown Table */}
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Workspace Breakdown</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Projects, team size, and activity per workspace.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {analytics?.clients_analytics?.length || 0} Workspaces
                    </span>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] font-semibold">
                          <th className="py-2.5 px-4 pl-5">Workspace</th>
                          <th className="py-2.5 px-4">Plan &amp; Status</th>
                          <th className="py-2.5 px-4">Projects</th>
                          <th className="py-2.5 px-4">Team</th>
                          <th className="py-2.5 px-4">Active / Online</th>
                          <th className="py-2.5 px-4">Activity</th>
                          <th className="py-2.5 px-4">Last Active</th>
                          <th className="py-2.5 px-4 pr-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {analytics?.clients_analytics?.map((c) => (
                          <tr key={c.client_id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 pl-5">
                              <div>
                                <p className="font-bold text-slate-900">{c.client_name}</p>
                                {c.client_email && (
                                  <p className="text-[11px] text-slate-400 font-mono">{c.client_email}</p>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                                  {c.plan}
                                </span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                  c.client_status === 'ACTIVE' ? "bg-emerald-50 text-[#059669]" : "bg-amber-50 text-amber-700"
                                )}>
                                  {c.client_status}
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-baseline gap-1">
                                <span className="font-bold text-slate-900">{c.total_projects}</span>
                                <span className="text-[11px] text-slate-400">({c.active_projects} active)</span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900">{c.total_members}</span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-emerald-600 font-medium">{c.active_members} active</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">{c.online_members} online</span>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-slate-600">
                              <span className="font-semibold text-slate-900">{c.total_messages}</span> msgs • <span className="font-semibold text-slate-900">{c.total_reports}</span> reports
                            </td>

                            <td className="py-3 px-4 text-slate-500 text-xs">
                              {c.last_activity ? new Date(c.last_activity).toLocaleDateString() : '—'}
                            </td>

                            <td className="py-3 px-4 pr-5 text-right">
                              <button
                                onClick={() => {
                                  setActiveTab('workspaces');
                                  setExpandedClient(c.client_id);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#059669] rounded-lg text-xs font-semibold transition cursor-pointer"
                              >
                                View <ChevronRight size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: GLOBAL PROJECTS TABLE */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'projects' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            {loadingProjects ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-[#059669]" size={24} />
                <p className="text-xs text-slate-500">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5">
                  <FolderKanban size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-700">No projects found</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Create your first project to organize your team.</p>
                <button
                  onClick={() => handleOpenCreateProject()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={14} /> Create Project
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] font-semibold">
                      <th className="py-2.5 px-4 pl-5">Project</th>
                      <th className="py-2.5 px-4">Workspace</th>
                      <th className="py-2.5 px-4">Status &amp; Priority</th>
                      <th className="py-2.5 px-4">Team</th>
                      <th className="py-2.5 px-4">Progress</th>
                      <th className="py-2.5 px-4 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Project Details */}
                        <td className="py-3 px-4 pl-5">
                          <div className="max-w-xs">
                            <button
                              onClick={() => handleOpenProjectDrawer(proj.id)}
                              className="font-bold text-slate-900 text-xs hover:text-[#059669] transition text-left cursor-pointer"
                            >
                              {proj.name}
                            </button>
                            {proj.description && (
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">{proj.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="font-mono">ID: {proj.id.slice(-6)}</span>
                              <span>•</span>
                              <span>{proj.department || 'General'}</span>
                              {proj.deadline && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-slate-500">
                                    <Calendar size={10} /> Due: {new Date(proj.deadline).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Client Workspace Info */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                              <Building2 size={11} className="text-slate-400" />
                              {proj.client_name}
                            </span>
                          </div>
                        </td>

                        {/* Priority & Status */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              proj.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-800" :
                              proj.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-800" :
                              proj.status === 'ON_HOLD' ? "bg-amber-100 text-amber-800" :
                              proj.status === 'ARCHIVED' ? "bg-slate-200 text-slate-800" :
                              "bg-slate-100 text-slate-700"
                            )}>
                              {proj.status.replace('_', ' ')}
                            </span>
                            <span className={cn(
                              "text-[10px] font-semibold uppercase",
                              proj.priority === 'URGENT' ? "text-rose-600" :
                              proj.priority === 'HIGH' ? "text-amber-600" :
                              "text-slate-400"
                            )}>
                              {proj.priority}
                            </span>
                          </div>
                        </td>

                        {/* Assigned Team Members */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {proj.members?.slice(0, 3).map((m) => (
                                <div
                                  key={m.id}
                                  title={`${m.name} (${m.role})`}
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center uppercase shrink-0"
                                >
                                  {m.name?.[0] || 'U'}
                                </div>
                              ))}
                              {proj.members?.length > 3 && (
                                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-emerald-50 text-[#059669] text-[10px] font-bold flex items-center justify-center shrink-0">
                                  +{proj.members.length - 3}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenAssignProject(proj)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-[#059669] text-slate-600 text-[10px] font-medium rounded-md transition cursor-pointer"
                            >
                              Manage ({proj.members_count || 0})
                            </button>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-3 px-4">
                          <div className="w-20">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                              <span>{proj.progress_percentage || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#059669] h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(100, proj.progress_percentage || 0)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenProjectDrawer(proj.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                              title="View Project"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit2 size={14} />
                            </button>
                            {proj.status !== 'ARCHIVED' && (
                              <button
                                onClick={() => setArchiveModal({ open: true, project: proj })}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="Archive Project"
                              >
                                <Archive size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteModal({ open: true, type: 'project', id: proj.id, title: `Project: ${proj.name}` })}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: GLOBAL TEAM MEMBERS DIRECTORY */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'members' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            {loadingMembers ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-[#059669]" size={24} />
                <p className="text-xs text-slate-500">Loading team members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5">
                  <Users size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-700">No team members found</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Add team members to assign them to projects.</p>
                <button
                  onClick={() => handleOpenCreateMember()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <UserPlus size={14} /> Add Team Member
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] font-semibold">
                      <th className="py-2.5 px-4 pl-5">Member</th>
                      <th className="py-2.5 px-4">Workspace</th>
                      <th className="py-2.5 px-4">Role</th>
                      <th className="py-2.5 px-4">Assigned Projects</th>
                      <th className="py-2.5 px-4">Activity</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {members.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Member Info */}
                        <td className="py-3 px-4 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] font-bold flex items-center justify-center text-xs uppercase border border-emerald-100/50 shrink-0">
                                {u.name?.[0] || u.username?.[0] || 'U'}
                              </div>
                              <span className={cn(
                                "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white",
                                u.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                              )} />
                            </div>
                            <div>
                              <button
                                onClick={() => handleOpenMemberDrawer(u.id)}
                                className="font-bold text-slate-900 text-xs hover:text-[#059669] transition text-left cursor-pointer"
                              >
                                {u.name}
                              </button>
                              <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Client Workspace */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-600">
                            {u.client_name}
                          </span>
                        </td>

                        {/* Role & Designation */}
                        <td className="py-3 px-4">
                          <p className="text-slate-800 font-semibold text-xs">{u.designation || 'Team Member'}</p>
                          <p className="text-[10px] text-slate-400">
                            {u.department || 'General'} • <span className="uppercase font-bold text-slate-500">{u.enterprise_role || u.role}</span>
                          </p>
                        </td>

                        {/* Assigned Projects */}
                        <td className="py-3 px-4">
                          {u.assigned_projects && u.assigned_projects.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {u.assigned_projects.slice(0, 2).map((p) => (
                                <span key={p.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">
                                  {p.name}
                                </span>
                              ))}
                              {u.assigned_projects.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                                  +{u.assigned_projects.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">None</span>
                          )}
                        </td>

                        {/* Engagement */}
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          <span className="font-semibold text-slate-800">{u.messages_count || 0}</span> msgs
                          <span className="mx-1 text-slate-300">•</span>
                          <span className="font-semibold text-slate-800">{u.reports_count || 0}</span> reports
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            u.status === 'APPROVED' ? "bg-emerald-100 text-emerald-800" :
                            u.status === 'SUSPENDED' ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-800"
                          )}>
                            {u.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenMemberDrawer(u.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                              title="View Profile"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenEditMember(u)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Member"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleMemberStatus(u)}
                              className={cn(
                                "p-1.5 rounded-lg transition cursor-pointer",
                                u.status === 'APPROVED'
                                  ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              )}
                              title={u.status === 'APPROVED' ? "Suspend Member" : "Activate Member"}
                            >
                              <Power size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, type: 'member', id: u.id, title: `Member: ${u.name}` })}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: CLIENT WORKSPACES HIERARCHY */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'workspaces' && (
          <div className="space-y-3.5">
            {loadingAnalytics || loadingClients ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="animate-spin text-[#059669]" size={24} />
                <p className="text-xs text-slate-500">Loading workspaces...</p>
              </div>
            ) : analytics?.clients_analytics?.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4 bg-white rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5">
                  <Building2 size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-700">No client workspaces found</p>
              </div>
            ) : (
              analytics?.clients_analytics?.map((c) => {
                const isExpanded = expandedClient === c.client_id;
                return (
                  <div key={c.client_id} className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden transition">
                    
                    {/* Client Header Bar */}
                    <div 
                      onClick={() => setExpandedClient(isExpanded ? null : c.client_id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/70">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{c.client_name}</h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                              {c.plan}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              c.client_status === 'ACTIVE' ? "bg-emerald-50 text-[#059669]" : "bg-amber-50 text-amber-700"
                            )}>
                              {c.client_status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.client_email || 'No email registered'}</p>
                        </div>
                      </div>

                      {/* Quick Summary Counts */}
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                          <span><strong className="text-slate-800">{c.total_projects}</strong> projects</span>
                          <span>•</span>
                          <span><strong className="text-slate-800">{c.total_members}</strong> members</span>
                        </div>

                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-5">
                        
                        {/* Section 1: Projects */}
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                              <FolderKanban size={15} className="text-[#059669]" />
                              <h4 className="text-xs font-bold text-slate-800">
                                Projects ({c.projects?.length || 0})
                              </h4>
                            </div>
                            <button
                              onClick={() => handleOpenCreateProject(c.client_id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-[#059669] text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              <Plus size={12} /> New Project
                            </button>
                          </div>

                          {c.projects?.length === 0 ? (
                            <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-center text-xs text-slate-400">
                              No projects created yet.
                            </div>
                          ) : (
                            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-semibold uppercase">
                                    <th className="py-2 px-3.5">Project Name</th>
                                    <th className="py-2 px-3.5">Date</th>
                                    <th className="py-2 px-3.5">Members</th>
                                    <th className="py-2 px-3.5">Status</th>
                                    <th className="py-2 px-3.5 pr-3.5 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {c.projects.map((pr) => (
                                    <tr key={pr.id} className="hover:bg-slate-50/80">
                                      <td className="py-2.5 px-3.5 font-bold text-slate-900">{pr.name}</td>
                                      <td className="py-2.5 px-3.5 text-slate-500 text-xs">
                                        {pr.created_at ? new Date(pr.created_at).toLocaleDateString() : '—'}
                                      </td>
                                      <td className="py-2.5 px-3.5 text-slate-700">
                                        {pr.members_count} ({pr.active_members_count} active)
                                      </td>
                                      <td className="py-2.5 px-3.5">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                                          {pr.status}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3.5 text-right">
                                        <button
                                          onClick={() => handleOpenProjectDrawer(pr.id)}
                                          className="text-[#059669] hover:underline font-semibold text-xs cursor-pointer"
                                        >
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Section 2: Team Members */}
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Users size={15} className="text-[#059669]" />
                              <h4 className="text-xs font-bold text-slate-800">
                                Team Members ({c.members?.length || 0})
                              </h4>
                            </div>
                            <button
                              onClick={() => handleOpenCreateMember(c.client_id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-[#059669] text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              <UserPlus size={12} /> Add Member
                            </button>
                          </div>

                          {c.members?.length === 0 ? (
                            <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-center text-xs text-slate-400">
                              No team members in this workspace.
                            </div>
                          ) : (
                            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-semibold uppercase">
                                    <th className="py-2 px-3.5">Member</th>
                                    <th className="py-2 px-3.5">Role</th>
                                    <th className="py-2 px-3.5">Projects</th>
                                    <th className="py-2 px-3.5">Status</th>
                                    <th className="py-2 px-3.5 pr-3.5 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {c.members.map((mem) => (
                                    <tr key={mem.id} className="hover:bg-slate-50/80">
                                      <td className="py-2.5 px-3.5">
                                        <div className="flex items-center gap-2">
                                          <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            mem.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                                          )} />
                                          <span className="font-bold text-slate-900">{mem.name}</span>
                                          <span className="text-[11px] text-slate-400 font-mono">({mem.email})</span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3.5 text-slate-600">
                                        {mem.designation || 'Team Member'} • <span className="uppercase text-[10px] font-bold text-slate-400">{mem.role}</span>
                                      </td>
                                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                                        {mem.assigned_projects_count} projects
                                      </td>
                                      <td className="py-2.5 px-3.5">
                                        <span className="px-2 py-0.5 bg-emerald-50 text-[#059669] rounded text-[10px] font-bold">
                                          {mem.status}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3.5 text-right">
                                        <button
                                          onClick={() => handleOpenMemberDrawer(mem.id)}
                                          className="text-[#059669] hover:underline font-semibold text-xs cursor-pointer"
                                        >
                                          View Profile
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DRAWER 1: PROJECT DETAILS DRAWER (Slide-over) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {projectDrawer.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col font-sans overflow-hidden">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <FolderKanban size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Project Details &amp; Team</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {projectDrawer.project?.id || '...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {projectDrawer.project && (
                    <button
                      onClick={() => handleOpenEditProject(projectDrawer.project)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => setProjectDrawer({ open: false, project: null, loading: false })}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {projectDrawer.loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-[#059669]" size={24} />
                    <p className="text-xs font-medium text-slate-500">Loading project details...</p>
                  </div>
                ) : projectDrawer.project && (
                  <>
                    {/* Project Information Box */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900">{projectDrawer.project.name}</h2>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold uppercase">
                            {projectDrawer.project.status}
                          </span>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold uppercase">
                            {projectDrawer.project.priority}
                          </span>
                        </div>
                      </div>

                      {projectDrawer.project.description && (
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {projectDrawer.project.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Workspace</span>
                          <span className="font-extrabold text-slate-900">{projectDrawer.project.client_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Created Date</span>
                          <span className="font-bold text-slate-800">
                            {projectDrawer.project.created_at ? new Date(projectDrawer.project.created_at).toLocaleDateString() : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Deadline</span>
                          <span className="font-bold text-slate-800">
                            {projectDrawer.project.deadline ? new Date(projectDrawer.project.deadline).toLocaleDateString() : 'No deadline'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>Project Progress</span>
                          <span>{projectDrawer.project.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#059669] h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, projectDrawer.project.progress_percentage || 0)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Team Members Section inside Drawer */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">Project Team</h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {projectDrawer.project.members_count || 0} Total ({projectDrawer.project.active_members_count || 0} online • {projectDrawer.project.inactive_members_count || 0} offline)
                          </p>
                        </div>
                        <button
                          onClick={() => setAddMemberToProjectModal({ open: true, project: projectDrawer.project, memberId: '' })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                        >
                          <Plus size={14} /> Add Team Member
                        </button>
                      </div>

                      {projectDrawer.project.members?.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/80 text-xs text-slate-400 italic">
                          No team members assigned to this project yet. Click &quot;Add Team Member&quot; to assign.
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                                <th className="py-2.5 px-4">Member</th>
                                <th className="py-2.5 px-4">Role / Designation</th>
                                <th className="py-2.5 px-4">Status</th>
                                <th className="py-2.5 px-4 pr-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold">
                              {projectDrawer.project.members.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/80">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        m.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                                      )} />
                                      <div>
                                        <p className="font-extrabold text-slate-900">{m.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{m.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">
                                    <p className="font-bold">{m.designation || 'Team Member'}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">{m.enterprise_role || m.role}</p>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-[#059669] rounded text-[10px] font-bold uppercase">
                                      {m.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 pr-4 text-right">
                                    <button
                                      onClick={() => setRemoveMemberModal({ open: true, project: projectDrawer.project, member: m })}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                      title="Remove from project (does NOT delete user account)"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Project Audit / Activity Trail */}
                    {projectDrawer.project.activity_logs && projectDrawer.project.activity_logs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 mb-3">Recent Activity Logs</h4>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                          {projectDrawer.project.activity_logs.map((log) => (
                            <div key={log.id} className="flex items-start justify-between gap-2 text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{log.admin_name}</span>
                                <span className="text-slate-500"> — {log.action}</span>
                                {log.after_value && (
                                  <p className="text-[11px] text-slate-600 mt-0.5">{log.after_value}</p>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DRAWER 2: TEAM MEMBER PROFILE DRAWER (Slide-over) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {memberDrawer.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col font-sans overflow-hidden">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Member Profile &amp; Projects</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {memberDrawer.member?.id || '...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {memberDrawer.member && (
                    <button
                      onClick={() => handleOpenEditMember(memberDrawer.member)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => setMemberDrawer({ open: false, member: null, loading: false })}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {memberDrawer.loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-[#059669]" size={24} />
                    <p className="text-xs font-medium text-slate-500">Loading member profile...</p>
                  </div>
                ) : memberDrawer.member && (
                  <>
                    {/* Profile Information Box */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#059669] text-white font-black text-xl flex items-center justify-center shadow-sm uppercase shrink-0">
                          {memberDrawer.member.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900">{memberDrawer.member.name}</h2>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase",
                              memberDrawer.member.status === 'APPROVED' ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            )}>
                              {memberDrawer.member.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono">{memberDrawer.member.email}</p>
                          <p className="text-xs font-bold text-slate-700 mt-1">
                            {memberDrawer.member.designation} • {memberDrawer.member.client_name}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium border-t border-slate-200/60">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Enterprise Role</span>
                          <span className="font-extrabold text-slate-900 uppercase">{memberDrawer.member.enterprise_role || memberDrawer.member.role}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                          <span className="font-bold text-slate-800">{memberDrawer.member.department || 'General'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Joined Date</span>
                          <span className="font-bold text-slate-800">
                            {memberDrawer.member.date_joined ? new Date(memberDrawer.member.date_joined).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Projects Section inside Drawer */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Assigned Projects ({memberDrawer.member.assigned_projects?.length || 0})
                        </h4>
                      </div>

                      {memberDrawer.member.assigned_projects?.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/80 text-xs text-slate-400 italic">
                          This member is not assigned to any projects.
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                                <th className="py-2.5 px-4">Project Name</th>
                                <th className="py-2.5 px-4">Client Workspace</th>
                                <th className="py-2.5 px-4">Status</th>
                                <th className="py-2.5 px-4 pr-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold">
                              {memberDrawer.member.assigned_projects.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80">
                                  <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                                  <td className="py-3 px-4 text-slate-600">{p.client_name}</td>
                                  <td className="py-3 px-4">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-[10px] font-bold uppercase">
                                      {p.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 pr-4 text-right">
                                    <button
                                      onClick={() => {
                                        setMemberDrawer({ open: false, member: null, loading: false });
                                        handleOpenProjectDrawer(p.id);
                                      }}
                                      className="text-[#059669] hover:underline font-bold text-xs cursor-pointer"
                                    >
                                      View Project
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 1: CREATE / EDIT PROJECT MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {projectModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {projectModal.mode === 'create' ? 'Create New Project' : 'Edit Project'}
                </h3>
                <button
                  onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitProject} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client Workspace *</label>
                  <select
                    value={projectForm.client_id}
                    onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  >
                    <option value="" disabled>Select Client Workspace</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Redesign Q3"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief objective of the project..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Priority</label>
                    <select
                      value={projectForm.priority}
                      onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="General / Engineering"
                      value={projectForm.department}
                      onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Deadline</label>
                    <input
                      type="date"
                      value={projectForm.deadline}
                      onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Progress ({projectForm.progress_percentage}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectForm.progress_percentage}
                    onChange={(e) => setProjectForm({ ...projectForm, progress_percentage: Number(e.target.value) })}
                    className="w-full accent-[#059669]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {projectModal.mode === 'create' ? 'Create Project' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 2: CREATE / EDIT TEAM MEMBER MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {memberModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {memberModal.mode === 'create' ? 'Register Team Member' : 'Edit Member Details'}
                </h3>
                <button
                  onClick={() => setMemberModal({ open: false, mode: 'create', data: null })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitMember} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client Workspace *</label>
                  <select
                    value={memberForm.client_id}
                    onChange={(e) => setMemberForm({ ...memberForm, client_id: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  >
                    <option value="" disabled>Select Client Workspace</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={memberForm.first_name}
                      onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={memberForm.last_name}
                      onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  />
                </div>

                {memberModal.mode === 'create' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Default: UwoConnect@123"
                      value={memberForm.password}
                      onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Enterprise Role</label>
                    <select
                      value={memberForm.enterprise_role}
                      onChange={(e) => setMemberForm({ ...memberForm, enterprise_role: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ORG_ADMIN">Org Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="TEAM_LEAD">Team Lead</option>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="INTERN">Intern</option>
                      <option value="GUEST">Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Engineering / Sales"
                      value={memberForm.department}
                      onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="Senior Developer / Support Lead"
                    value={memberForm.designation}
                    onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMemberModal({ open: false, mode: 'create', data: null })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {memberModal.mode === 'create' ? 'Create Member' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 3: ASSIGN MEMBERS (Batch multi-select) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {assignProjectModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Assign Members to Project
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {assignProjectModal.project?.name} ({assignProjectModal.project?.client_name})
                  </p>
                </div>
                <button
                  onClick={() => setAssignProjectModal({ open: false, project: null, selectedMembers: [] })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-3 flex-1 overflow-y-auto space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Team Members ({assignProjectModal.selectedMembers.length} selected):
                </p>
                {members.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No registered team members found.</p>
                ) : (
                  members.map((m) => {
                    const isSelected = assignProjectModal.selectedMembers.includes(String(m.id));
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          const idStr = String(m.id);
                          setAssignProjectModal(prev => ({
                            ...prev,
                            selectedMembers: isSelected
                              ? prev.selectedMembers.filter(id => id !== idStr)
                              : [...prev.selectedMembers, idStr]
                          }));
                        }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                          isSelected
                            ? "bg-emerald-50/70 border-emerald-300 text-slate-900"
                            : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black flex items-center justify-center text-xs uppercase shrink-0">
                            {m.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900">{m.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {m.designation || 'Team Member'} • {m.client_name}
                            </p>
                          </div>
                        </div>

                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                          isSelected ? "bg-[#059669] border-[#059669] text-white" : "border-slate-300 bg-white"
                        )}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignProjectModal({ open: false, project: null, selectedMembers: [] })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignProject}
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Save Project Members
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 4: ADD SINGLE MEMBER TO PROJECT */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {addMemberToProjectModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Add Team Member to Project
                </h3>
                <button
                  onClick={() => setAddMemberToProjectModal({ open: false, project: null, memberId: '' })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Existing Team Member *</label>
                  <select
                    value={addMemberToProjectModal.memberId}
                    onChange={(e) => setAddMemberToProjectModal({ ...addMemberToProjectModal, memberId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#059669]"
                  >
                    <option value="">Choose a team member</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.email}) — {m.client_name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddMemberToProjectModal({ open: false, project: null, memberId: '' })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMemberToProject}
                    disabled={submitting || !addMemberToProjectModal.memberId}
                    className="px-5 py-2 bg-[#059669] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Confirm Addition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 5: ARCHIVE CONFIRMATION MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {archiveModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Archive size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                Archive Project
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Archiving <span className="font-bold text-slate-800">&quot;{archiveModal.project?.name}&quot;</span> will remove it from active project lists but <span className="font-semibold text-emerald-600">preserve all historical data and reports</span>.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setArchiveModal({ open: false, project: null })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmArchiveProject}
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Archive Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 6: REMOVE MEMBER FROM PROJECT CONFIRMATION */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {removeMemberModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <UserX size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                Remove from Project
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Remove <span className="font-bold text-slate-800">&quot;{removeMemberModal.member?.name}&quot;</span> from <span className="font-bold text-slate-800">&quot;{removeMemberModal.project?.name}&quot;</span>?
              </p>
              <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 font-semibold mb-4 text-left">
                ⚠️ Note: This will NOT delete the user&apos;s account or remove them from the client workspace.
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setRemoveMemberModal({ open: false, project: null, member: null })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoveMemberFromProject}
                  disabled={submitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MODAL 7: PERMANENT DELETE CONFIRMATION MODAL */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Are you sure you want to permanently delete <span className="font-bold text-slate-800">&quot;{deleteModal.title}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, type: '', id: null, title: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={submitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

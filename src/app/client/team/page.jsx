'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckSquare, MessageSquare, FileText, ShieldCheck, 
  BarChart3, Bot, Plus, Search, Filter, LayoutGrid, List, Calendar as CalendarIcon,
  Building2, Trash2, Mail, Shield, CheckCircle2, Clock, AlertTriangle, AlertCircle, ChevronRight, FolderPlus, Layers,
  Share2, Activity, ShieldAlert, Globe, Lock, UserX, UserCheck, RefreshCw, Key, ExternalLink, Eye, Smartphone, QrCode
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TeamMemberModal from '@/components/team/TeamMemberModal';
import TaskModal from '@/components/team/TaskModal';
import TaskDetailDrawer from '@/components/team/TaskDetailDrawer';
import TaskKanbanBoard from '@/components/team/TaskKanbanBoard';
import TaskListTable from '@/components/team/TaskListTable';
import TeamChatWindow from '@/components/team/TeamChatWindow';
import WorkReportModal from '@/components/team/WorkReportModal';
import WorkReportsCalendarView from '@/components/team/WorkReportsCalendarView';
import ApprovalManagerModal from '@/components/team/ApprovalManagerModal';
import TeamAnalyticsView from '@/components/team/TeamAnalyticsView';
import TeamAICopilot from '@/components/team/TeamAICopilot';
import ProjectModal from '@/components/team/ProjectModal';
import AttendanceLeaveModal from '@/components/team/AttendanceLeaveModal';
import QRCodeInviteModal from '@/components/team/QRCodeInviteModal';
import MemberDetailDrawer from '@/components/team/MemberDetailDrawer';
import ProjectDetailDrawer from '@/components/team/ProjectDetailDrawer';
import { 
  SkeletonMemberCards, 
  SkeletonProjectCards, 
  SkeletonTaskKanban, 
  SkeletonTableRows, 
  ModernSpinner 
} from '@/components/common/LoadingSkeleton';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('DIRECTORY'); // DIRECTORY, PROJECTS, TASKS, CHAT, ATTENDANCE, REPORTS
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedReportDate, setSelectedReportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [taskViewMode, setTaskViewMode] = useState('KANBAN'); // KANBAN, LIST

  // Modals & Drawers
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [memberModalInitialTab, setMemberModalInitialTab] = useState('basic');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data?.user || res.data;
      if (userData && (userData.id || userData.role || userData.username || userData.email)) {
        setCurrentUser(userData);
      }
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const deletedIds = JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]');

      const res = await axios.get(`${API_BASE_URL}/api/team/members/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const rawMembers = Array.isArray(res.data) ? res.data : res.data.results || [];
      const filtered = rawMembers.filter(m => !deletedIds.includes(String(m.id)));
      setMembers(filtered);
    } catch (err) {
      console.warn('Failed to fetch members:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/projects/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setProjects(data);
    } catch (err) {
      console.warn('Failed to fetch projects:', err);
      setProjects([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setTasks(data);
    } catch (err) {
      console.warn('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setReports(data);
    } catch (err) {
      console.warn('Failed to fetch reports:', err);
      setReports([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/attendance/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setAttendances(data);
    } catch (err) {
      console.warn('Failed to fetch attendance:', err);
      setAttendances([]);
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/leaves/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setLeaves(data);
    } catch (err) {
      console.warn('Failed to fetch leaves:', err);
      setLeaves([]);
    }
  };

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/channels/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setChannels(data);
    } catch (err) {
      console.warn('Failed to fetch channels:', err);
      setChannels([]);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/team/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    setMembers(prev => prev.filter(m => String(m.id) !== String(id)));

    try {
      const deleted = JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]');
      if (!deleted.includes(String(id))) {
        deleted.push(String(id));
        localStorage.setItem('uwo_deleted_members', JSON.stringify(deleted));
      }
    } catch (e) {}

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${API_BASE_URL}/api/team/members/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('Member removed locally:', err?.message || err);
    }
  };

  const handleRemoveMember = (id) => {
    handleDeleteMember(id);
  };

  const handleSuspendMember = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const target = members.find(m => m.id === id);
      const newStatus = target?.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
      await axios.patch(`${API_BASE_URL}/api/team/members/${id}/`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    } catch (err) {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' } : m));
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchMembers(),
        fetchProjects(),
        fetchTasks(),
        fetchReports(),
        fetchAttendance(),
        fetchLeaves(),
        fetchChannels()
      ]);
      setLoading(false);
    };
    init();
  }, []);

  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const activeUser = (currentUser && (currentUser.id || currentUser.role || currentUser.username)) ? { ...storedUser, ...currentUser } : storedUser;
  const isAgent = (activeUser?.role === 'AGENT') || (activeUser?.enterprise_role === 'EMPLOYEE') || (activeUser?.enterprise_role === 'INTERN');
  const isClientRole = !isAgent;
  const currentUserId = String(activeUser?.id || activeUser?._id || '');
  const currentUsername = (activeUser?.username || '').toLowerCase();

  const visibleProjects = isClientRole ? projects : projects.filter(p => {
    const memberDetails = p.members_details || [];
    const rawMembers = Array.isArray(p.members) ? p.members : [];
    
    // If no specific members are assigned, it is open to the entire workspace
    if (memberDetails.length === 0 && rawMembers.length === 0) return true;

    const isMember = memberDetails.some(m => String(m.id) === currentUserId || (m.username && m.username.toLowerCase() === currentUsername) || (m.email && m.email.toLowerCase() === currentUsername)) ||
      rawMembers.some(m => String(m) === currentUserId || (typeof m === 'object' && String(m.id || m._id) === currentUserId));
    const isOwner = String(p.owner) === currentUserId || (p.owner_name && p.owner_name.toLowerCase() === currentUsername);
    return isMember || isOwner;
  });

  const visibleReports = isClientRole ? reports : reports.filter(r => {
    const allowedUsernames = new Set([currentUsername]);
    const allowedIds = new Set([currentUserId]);
    visibleProjects.forEach(p => {
      (p.members_details || []).forEach(m => {
        if (m.username) allowedUsernames.add(m.username.toLowerCase());
        if (m.id) allowedIds.add(String(m.id));
      });
    });
    const rEmpId = r.employee ? String(r.employee) : '';
    const rEmpName = (r.employee_name || '').toLowerCase();
    return allowedIds.has(rEmpId) || allowedUsernames.has(rEmpName);
  });

  const filteredMembers = (Array.isArray(members) ? members : []).filter(m => {
    const matchesSearch = (m.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || (m.department || '').toUpperCase() === departmentFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  const filteredProjects = (Array.isArray(projects) ? projects : []).filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="text-emerald-600" size={28} /> Team & Workspace Hub
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Manage your organization, assign tasks, track attendance, and monitor team performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <QrCode size={15} /> QR Code Invite
            </button>
            <button
              onClick={() => {
                setMemberToEdit(null);
                setIsMemberModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <UserPlus size={15} /> Invite Member
            </button>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus size={15} /> New Project
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} /> Create Task
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'DIRECTORY', label: 'Directory', icon: Users },
            { id: 'PROJECTS', label: 'Projects', icon: Layers },
            { id: 'TASKS', label: 'Tasks & Board', icon: CheckSquare },
            { id: 'CHAT', label: 'Internal Chat', icon: MessageSquare },
            { id: 'ATTENDANCE', label: 'Attendance & Leave', icon: CalendarIcon },
            { id: 'REPORTS', label: 'Work Reports', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>











        {activeTab === 'DIRECTORY' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team member by name, email, role..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="PRODUCT">Product</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALES">Sales</option>
                  <option value="SUPPORT">Support</option>
                  <option value="DESIGN">Design</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            {/* Member Cards */}
            {loading ? (
              <SkeletonMemberCards count={6} />
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Users size={36} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No team members found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Generate a QR code or add employees directly to start collaborating.</p>
                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode size={15} />
                  <span>Generate QR Code Invite</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className={`bg-white rounded-3xl p-6 border cursor-pointer ${m.status === 'SUSPENDED' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90'} shadow-2xs hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col justify-between space-y-4`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shrink-0 shadow-md">
                            {(m.name || m.first_name || m.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{m.name || m.first_name || m.username}</h4>
                              <span className={`w-2 h-2 rounded-full shrink-0 ${m.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            </div>
                            <p className="text-xs text-slate-500 truncate">{m.designation || 'Team Member'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSuspendMember(m.id); }}
                            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${m.status === 'SUSPENDED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}
                            title={m.status === 'SUSPENDED' ? 'Activate Member' : 'Suspend Member'}
                          >
                            {m.status === 'SUSPENDED' ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setMemberToEdit(m);
                              setMemberModalInitialTab('basic');
                              setIsMemberModalOpen(true); 
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Edit Member / Role"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveMember(m.id); }}
                            className="p-1.5 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs">
                        {m.email && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400 flex items-center gap-1.5"><Mail size={12} /> Email</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">{m.email}</span>
                          </div>
                        )}
                        {m.phone_number && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400 flex items-center gap-1.5"><Smartphone size={12} /> Phone</span>
                            <span className="font-semibold text-slate-800">{m.phone_number}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">Department</span>
                          <span className="font-semibold text-slate-800">{m.department || 'General'}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">Role</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full text-[10px]">
                            {m.enterprise_role || m.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Channel Badges & Quick Actions */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Channels</p>
                        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                          {(m.assigned_social_channels && m.assigned_social_channels.length > 0) ? (
                            m.assigned_social_channels.map((ch, idx) => {
                              const label = ch.includes('wa') ? 'WhatsApp' 
                                : ch.includes('ig') ? 'Instagram' 
                                : ch.includes('fb') ? 'Facebook' 
                                : ch.includes('tg') ? 'Telegram' 
                                : ch.includes('li') ? 'LinkedIn' : ch;
                              const color = ch.includes('wa') ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                : ch.includes('ig') ? 'bg-pink-50 text-pink-700 border-pink-200/60'
                                : ch.includes('fb') ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                                : ch.includes('tg') ? 'bg-sky-50 text-sky-700 border-sky-200/60'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
                              return (
                                <span key={idx} className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${color}`}>
                                  {label}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">No channels assigned yet</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMemberToEdit(m);
                            setMemberModalInitialTab('channels');
                            setIsMemberModalOpen(true);
                          }}
                          className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Share2 size={13} /> Assign Channels
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMemberToEdit(m);
                            setMemberModalInitialTab('permissions');
                            setIsMemberModalOpen(true);
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Shield size={13} /> Assign Role
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: SOCIAL CHANNEL ALLOCATION MATRIX --- */}
        {activeTab === 'SOCIAL_MATRIX' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 size={18} className="text-emerald-600" /> Client Social Media Allocation Matrix
              </h3>
              <p className="text-xs text-slate-500">Map connected WhatsApp numbers, Instagram Accounts, and Facebook Pages to specific employees or departments.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Employee / Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">WhatsApp Main</th>
                    <th className="p-4">Instagram Official</th>
                    <th className="p-4">Facebook Page</th>
                    <th className="p-4">Telegram Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => {
                    const assigned = m.assigned_social_channels || [];
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{m.username}</p>
                          <p className="text-[10px] text-slate-400">{m.enterprise_role || m.role}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{m.department || 'General'}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleChannelForMember(m, 'wa_default')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${assigned.includes('wa_default') ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {assigned.includes('wa_default') ? '✓ Assigned' : '+ Assign'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleChannelForMember(m, 'ig_main')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${assigned.includes('ig_main') ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {assigned.includes('ig_main') ? '✓ Assigned' : '+ Assign'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleChannelForMember(m, 'fb_page')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${assigned.includes('fb_page') ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {assigned.includes('fb_page') ? '✓ Assigned' : '+ Assign'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleChannelForMember(m, 'tg_support')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${assigned.includes('tg_support') ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {assigned.includes('tg_support') ? '✓ Assigned' : '+ Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: LIVE ACTIVITY & LOGIN MONITORING --- */}
        {activeTab === 'LIVE_MONITORING' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" /> Real-time Member Activity
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3">Member</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Current Module / Page</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Device / OS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{act.name}</p>
                          <p className="text-[10px] text-slate-400">{act.department}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${act.is_online ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                            {act.is_online ? '🟢 Online' : '⚪ Offline'}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-emerald-700">{act.current_page}</td>
                        <td className="p-3 font-mono">{act.last_login_ip}</td>
                        <td className="p-3 text-slate-500">{act.last_login_browser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: PROJECTS --- */}
        {activeTab === 'PROJECTS' && (
          <div className="space-y-4">
            {loading ? (
              <SkeletonProjectCards count={3} />
            ) : visibleProjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <FolderPlus size={36} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {isClientRole ? 'No active projects' : 'No projects assigned to you yet'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isClientRole 
                    ? 'Create a new project to start managing milestones, progress bars, and team tasks.'
                    : 'When the admin or client assigns you to a project, it will appear here with milestones.'}
                </p>
                {isClientRole && (
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-all inline-flex items-center gap-1.5"
                  >
                    <FolderPlus size={15} />
                    <span>Create First Project</span>
                  </button>
                )}
              </div>
            ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProjects.map((p) => {
                const milestones = p.milestones || [];
                const completedMilestones = milestones.filter(m => m.completed || m.status === 'COMPLETED').length;
                const totalMilestones = milestones.length;
                const progressPercent = totalMilestones > 0 
                  ? Math.round((completedMilestones / totalMilestones) * 100) 
                  : (p.progress_percentage || 0);

                const isOverdue = p.deadline && new Date(p.deadline) < new Date() && progressPercent < 100;

                return (
                  <div
                    key={p.id || p._id}
                    onClick={() => setSelectedProject(p)}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            p.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {p.status ? p.status.replace('_', ' ') : 'PLANNING'}
                          </span>
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              Overdue
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-2 group-hover:text-emerald-700 transition-colors">{p.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description || 'No detailed scope provided.'}</p>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id || p._id); }}
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Progress Bar & Milestone Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="text-slate-500">Milestone Progress</span>
                        <span className="text-emerald-600 font-extrabold">{progressPercent}%</span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(progressPercent, 4)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 pt-1">
                        <span>{completedMilestones} / {totalMilestones} Milestones Done</span>
                        <span>Deadline: {p.deadline || 'Flexible'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* --- TAB 5: TASKS --- */}
        {activeTab === 'TASKS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Tasks & Workflow Board</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setTaskViewMode('KANBAN')} className={`p-2 rounded-xl text-xs font-bold ${taskViewMode === 'KANBAN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Kanban</button>
                <button onClick={() => setTaskViewMode('LIST')} className={`p-2 rounded-xl text-xs font-bold ${taskViewMode === 'LIST' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>List</button>
              </div>
            </div>

            {loading ? (
              <SkeletonTaskKanban />
            ) : taskViewMode === 'KANBAN' ? (
              <TaskKanbanBoard tasks={Array.isArray(tasks) ? tasks : []} onSelectTask={(t) => setSelectedTask(t)} />
            ) : (
              <TaskListTable tasks={Array.isArray(tasks) ? tasks : []} onSelectTask={(t) => setSelectedTask(t)} />
            )}
          </div>
        )}

        {/* --- TAB 6: CHAT --- */}
        {activeTab === 'CHAT' && (
          <div className="h-[650px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <TeamChatWindow 
              currentUser={activeUser} 
              channels={channels} 
              projects={visibleProjects}
              members={members}
              onChannelCreated={fetchChannels} 
            />
          </div>
        )}

        {/* --- TAB 7: ATTENDANCE & LOGIN LOG --- */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <CalendarIcon className="text-emerald-600" size={20} /> Daily Attendance & Login/Logout Timings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track member check-in times, clock-out timestamps, working hours, and leave status
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Clock size={15} /> Clock In / Clock Out & Leave
                </button>
              </div>
            </div>

            {/* Attendance Log Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-4">Team Member</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Clock In (Login)</th>
                      <th className="p-4">Clock Out (Logout)</th>
                      <th className="p-4">Working Hours</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-4">
                          <SkeletonTableRows rows={5} cols={7} />
                        </td>
                      </tr>
                    ) : attendances.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-medium">
                          No attendance records found for today. Members can Clock In when logging into work.
                        </td>
                      </tr>
                    ) : (
                      attendances.map((att) => {
                        const inTime = att.clock_in ? new Date(att.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
                        const outTime = att.clock_out ? new Date(att.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (att.clock_in ? '🟢 Active Work' : '--:--');

                        return (
                          <tr key={att.id || att._id} className="hover:bg-slate-50/50">
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                                  {(att.user_name || att.user_email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{att.user_name || 'Team Member'}</p>
                                  <p className="text-[10px] text-slate-400">{att.user_email || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-slate-600 font-medium">{att.user_department || 'General'}</td>
                            <td className="p-4 font-mono text-slate-600">{att.date}</td>
                            <td className="p-4 font-mono font-bold text-emerald-700">{inTime}</td>
                            <td className="p-4 font-mono font-bold text-slate-700">{outTime}</td>
                            <td className="p-4 font-bold text-slate-800">{att.working_hours ? `${att.working_hours} hrs` : '--'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                att.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                att.status === 'LATE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                att.status === 'ON_LEAVE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 8: DAILY WORK REPORTS STREAM WITH CALENDAR NAVIGATOR --- */}
        {activeTab === 'REPORTS' && (
          <WorkReportsCalendarView
            reports={visibleReports}
            leaves={leaves}
            attendances={attendances}
            members={members}
            loading={loading}
            isClientRole={isClientRole}
            selectedDate={selectedReportDate}
            onDateSelect={(d) => setSelectedReportDate(d)}
            onOpenSubmitModal={(dateToSubmit) => {
              if (dateToSubmit) setSelectedReportDate(dateToSubmit);
              setIsReportModalOpen(true);
            }}
          />
        )}

        {/* --- MODALS --- */}
        <QRCodeInviteModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />

        <TeamMemberModal
          isOpen={isMemberModalOpen}
          editMember={memberToEdit}
          initialTab={memberModalInitialTab}
          onClose={() => {
            setIsMemberModalOpen(false);
            setMemberToEdit(null);
          }}
          onSuccess={fetchMembers}
          existingMembers={members}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSuccess={fetchProjects}
          members={members}
        />

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSuccess={fetchTasks}
          members={members}
        />

        <WorkReportModal
          isOpen={isReportModalOpen}
          initialDate={selectedReportDate}
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={() => {
            fetchReports();
            setIsReportModalOpen(false);
          }}
        />

        <AttendanceLeaveModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          onSuccess={() => { fetchMembers(); fetchAttendance(); fetchLeaves(); }}
          onActionCompleted={() => { fetchMembers(); fetchAttendance(); fetchLeaves(); }}
        />

        {selectedTask && (
          <TaskDetailDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdated={fetchTasks}
          />
        )}

        {selectedMember && (
          <MemberDetailDrawer
            member={selectedMember}
            tasks={tasks}
            onClose={() => setSelectedMember(null)}
          />
        )}

        {selectedProject && (
          <ProjectDetailDrawer
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            onUpdate={() => { fetchProjects(); }}
            availableMembers={members}
          />
        )}

      </div>
    </DashboardLayout>
  );
}

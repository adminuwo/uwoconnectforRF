'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckSquare, MessageSquare, FileText, ShieldCheck, 
  BarChart3, Bot, Plus, Search, Filter, LayoutGrid, List, Calendar as CalendarIcon,
  Building2, Trash2, Mail, Shield, CheckCircle2, Clock, AlertTriangle, ChevronRight, FolderPlus, Layers,
  Share2, Activity, ShieldAlert, Globe, Lock, UserX, UserCheck, RefreshCw, Key, ExternalLink, Eye, Smartphone
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TeamMemberModal from '@/components/team/TeamMemberModal';
import TaskModal from '@/components/team/TaskModal';
import TaskDetailDrawer from '@/components/team/TaskDetailDrawer';
import TaskKanbanBoard from '@/components/team/TaskKanbanBoard';
import TaskListTable from '@/components/team/TaskListTable';
import TeamChatWindow from '@/components/team/TeamChatWindow';
import WorkReportModal from '@/components/team/WorkReportModal';
import ApprovalManagerModal from '@/components/team/ApprovalManagerModal';
import TeamAnalyticsView from '@/components/team/TeamAnalyticsView';
import TeamAICopilot from '@/components/team/TeamAICopilot';
import ProjectModal from '@/components/team/ProjectModal';
import AttendanceLeaveModal from '@/components/team/AttendanceLeaveModal';
import MemberDetailDrawer from '@/components/team/MemberDetailDrawer';
import ProjectDetailDrawer from '@/components/team/ProjectDetailDrawer';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('DIRECTORY'); // DIRECTORY, PROJECTS, TASKS, CHAT, ATTENDANCE, REPORTS
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [taskViewMode, setTaskViewMode] = useState('KANBAN'); // KANBAN, LIST

  // Modals & Drawers
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const deletedIds = JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]');

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/`, {
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/projects/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch projects:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch tasks:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch reports:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/projects/${id}/`, {
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

    // Persist deleted ID to localStorage so page refresh never restores it
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
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/${id}/`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/${id}/`, { status: newStatus }, {
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
        fetchReports()
      ]);
      setLoading(false);
    };
    init();
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || (m.department || '').toUpperCase() === departmentFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  const filteredProjects = projects.filter(p => 
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
              onClick={() => setIsMemberModalOpen(true)}
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
                          {m.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{m.username}</h4>
                            <span className={`w-2 h-2 rounded-full ${m.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                          </div>
                          <p className="text-xs text-slate-500">{m.designation || 'Team Member'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSuspendMember(m.id); }}
                          className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${m.status === 'SUSPENDED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}
                          title={m.status === 'SUSPENDED' ? 'Activate Member' : 'Suspend Member'}
                        >
                          {m.status === 'SUSPENDED' ? <UserCheck size={16} /> : <UserX size={16} />}
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

                    <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-400">Department</span>
                        <span className="font-semibold text-slate-800">{m.department || 'General'}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-400">Role</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">{m.enterprise_role || m.role}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-400">Employee ID</span>
                        <span className="font-mono text-slate-700">{m.employee_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Badges */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Channels</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(m.assigned_social_channels || ['wa_default', 'ig_main']).map((ch, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[9px] font-bold">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <FolderPlus size={36} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No active projects</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Create a new project to start managing milestones, progress bars, and team tasks.</p>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-all inline-flex items-center gap-1.5"
                >
                  <FolderPlus size={15} />
                  <span>Create First Project</span>
                </button>
              </div>
            ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => {
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

            {taskViewMode === 'KANBAN' ? (
              <TaskKanbanBoard tasks={tasks} onSelectTask={(t) => setSelectedTask(t)} />
            ) : (
              <TaskListTable tasks={tasks} onSelectTask={(t) => setSelectedTask(t)} />
            )}
          </div>
        )}

        {/* --- TAB 6: CHAT --- */}
        {activeTab === 'CHAT' && (
          <div className="h-[650px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <TeamChatWindow />
          </div>
        )}

        {/* --- TAB 7: ATTENDANCE --- */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Daily Attendance & Clock In / Out Log</h3>
              <p className="text-xs text-slate-400">Track member check-in times, working hours, and leave approvals</p>
            </div>
          </div>
        )}

        {/* --- TAB 8: REPORTS --- */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm">{r.employee_name}</h4>
                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-full">{r.report_date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{r.todays_work}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MODALS --- */}
        <TeamMemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
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
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={fetchReports}
        />

        <AttendanceLeaveModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          onSuccess={() => { fetchMembers(); }}
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
          />
        )}

      </div>
    </DashboardLayout>
  );
}

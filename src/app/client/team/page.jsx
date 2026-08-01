'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckSquare, MessageSquare, FileText, ShieldCheck, 
  BarChart3, Bot, Plus, Search, Filter, LayoutGrid, List, Calendar as CalendarIcon,
  Building2, Trash2, Mail, Shield, CheckCircle2, Clock, AlertTriangle, ChevronRight, FolderPlus, Layers
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

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('DIRECTORY'); // DIRECTORY, PROJECTS, TASKS, CHAT, ATTENDANCE, REPORTS, APPROVALS, ANALYTICS, COPILOT
  const [taskViewMode, setTaskViewMode] = useState('KANBAN'); // KANBAN, LIST

  // Data States
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals & Drawers
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/approvals/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovals(res.data);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/analytics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/projects/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/attendance/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendances(res.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/leaves/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchMembers();
    fetchProjects();
    fetchTasks();
    fetchReports();
    fetchApprovals();
    fetchAttendance();
    fetchLeaves();
    fetchAnalytics();
  }, []);

  const handleRemoveMember = async (id) => {
    if (!confirm('Are you sure you want to deactivate/remove this team member?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    } catch (err) {
      console.error('Failed to remove member:', err);
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

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || (m.department || 'General').toUpperCase() === departmentFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || (t.department || 'General').toUpperCase() === departmentFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Enterprise Team Platform <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">Unified</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage employees, task workflows, team chat, work reports, approvals, and AI analytics in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
            >
              <Clock size={15} />
              <span>Clock In / Leave</span>
            </button>

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-colors cursor-pointer"
            >
              <FolderPlus size={15} />
              <span>Create Project</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={15} />
              <span>Submit Report</span>
            </button>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Task</span>
            </button>

            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <UserPlus size={15} />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'DIRECTORY' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={16} />
            <span>Team Directory ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PROJECTS')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'PROJECTS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderPlus size={16} />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('TASKS')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'TASKS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare size={16} />
            <span>Tasks & Workflows ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'CHAT' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare size={16} />
            <span>Team Chat Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('ATTENDANCE')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ATTENDANCE' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock size={16} />
            <span>Attendance & Leaves</span>
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'REPORTS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={16} />
            <span>Daily Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'APPROVALS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={16} />
            <span>Approvals ({approvals.filter(a => a.status === 'PENDING').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'ANALYTICS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('COPILOT')}
            className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'COPILOT' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot size={16} className="text-emerald-600" />
            <span>AI Copilot</span>
          </button>
        </div>

        {/* --- TAB 1: TEAM DIRECTORY --- */}
        {activeTab === 'DIRECTORY' && (
          <div className="space-y-6">
            
            {/* Search & Dept Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team member by name or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
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

            {/* Members Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-md shadow-indigo-100">
                        {m.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{m.username}</h4>
                        <p className="text-xs text-slate-500">{m.designation || 'Team Member'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Deactivate Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 py-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Department</span>
                      <span className="font-semibold text-slate-800">{m.department || 'General'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Org Role</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                        {m.enterprise_role || m.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Email</span>
                      <span className="font-medium text-slate-700 truncate max-w-[140px]">{m.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${m.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {m.is_online ? 'Active Now' : 'Offline'}
                    </span>
                    <span>Reports to: {m.reporting_manager_name || 'Admin'}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- TAB 2: TASKS & WORKFLOWS --- */}
        {activeTab === 'TASKS' && (
          <div className="space-y-6">
            
            {/* View Switcher & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTaskViewMode('KANBAN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    taskViewMode === 'KANBAN' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutGrid size={14} /> Kanban Board
                </button>
                <button
                  onClick={() => setTaskViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    taskViewMode === 'LIST' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List size={14} /> List Table
                </button>
              </div>

              <div className="relative max-w-xs flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter tasks by title..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Task Views */}
            {taskViewMode === 'KANBAN' ? (
              <TaskKanbanBoard tasks={filteredTasks} onSelectTask={(t) => setSelectedTask(t)} />
            ) : (
              <TaskListTable tasks={filteredTasks} onSelectTask={(t) => setSelectedTask(t)} />
            )}

          </div>
        )}

        {/* --- TAB 3: TEAM CHAT --- */}
        {activeTab === 'CHAT' && (
          <TeamChatWindow currentUser={currentUser} />
        )}

        {/* --- TAB 4: DAILY REPORTS --- */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daily Team Progress Reports</h3>
                <p className="text-xs text-slate-400">Employee daily work logs, blocker alerts, and hours worked</p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer"
              >
                + Submit Report
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {r.employee_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{r.employee_name}</h4>
                        <p className="text-[11px] text-slate-400">{r.employee_department} • {r.report_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {r.need_help && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle size={11} /> Help Needed
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {r.hours_worked} hrs
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-slate-800">Today's Accomplishments:</span>
                      <p className="text-slate-600 mt-1 leading-relaxed">{r.todays_work}</p>
                    </div>

                    {r.blockers && (
                      <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-800">
                        <span className="font-semibold">Blockers Faced:</span> {r.blockers}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 1.5: PROJECTS --- */}
        {activeTab === 'PROJECTS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Enterprise Projects & Workspaces</h3>
                <p className="text-xs text-slate-400">Track high-level project goals, milestones, and cross-departmental progress</p>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-purple-200"
              >
                <FolderPlus size={15} />
                <span>New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        p.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2">{p.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description || 'No description provided.'}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Progress</span>
                      <span>{p.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${p.progress_percentage || 0}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                    <span>Department: <strong>{p.department || 'General'}</strong></span>
                    <span>Deadline: <strong>{p.deadline ? new Date(p.deadline).toLocaleDateString() : 'Flexible'}</strong></span>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/80 text-slate-400 space-y-3">
                  <FolderPlus size={36} className="mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">No Projects Created Yet</p>
                  <p className="text-xs">Click 'Create Project' above to scope out your team deliverables.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 4.5: ATTENDANCE & LEAVES --- */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Attendance & Leave Tracking</h3>
                <p className="text-xs text-slate-400">View daily clock-in records, shift hours, and leave application requests</p>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200"
              >
                <Clock size={15} />
                <span>Clock In / Request Leave</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Log Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock size={16} className="text-emerald-600" />
                  <span>Recent Attendance Logs</span>
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {attendances.map((a) => (
                    <div key={a.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{a.user_name || 'Employee'}</p>
                        <p className="text-slate-400 text-[11px]">{a.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          a.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {a.status}
                        </span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{a.working_hours ? `${a.working_hours} hrs` : 'In progress'}</p>
                      </div>
                    </div>
                  ))}
                  {attendances.length === 0 && <p className="py-4 text-center text-slate-400">No attendance records logged today.</p>}
                </div>
              </div>

              {/* Leave Requests Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CalendarIcon size={16} className="text-indigo-600" />
                  <span>Leave & WFH Requests</span>
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {leaves.map((l) => (
                    <div key={l.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{l.user_name} ({l.leave_type})</p>
                        <p className="text-slate-400 text-[11px]">{l.start_date} to {l.end_date}</p>
                        <p className="text-slate-600 text-xs mt-1 italic">"{l.reason}"</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                          l.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          l.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {leaves.length === 0 && <p className="py-4 text-center text-slate-400">No leave requests submitted.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: APPROVALS --- */}
        {activeTab === 'APPROVALS' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-sm">Manager Work Approvals Queue</h3>
              <p className="text-xs text-slate-400">Review task submissions from employees and verify completion</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvals.map((a) => (
                <div key={a.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        a.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        a.status === 'CHANGES_REQUESTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {a.status.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{a.task_title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(a.submitted_at).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {a.submission_notes || 'No submission notes provided.'}
                  </p>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Submitted by <strong>{a.employee_name}</strong></span>
                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => setSelectedApproval(a)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
                      >
                        Review Work
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 6: ANALYTICS --- */}
        {activeTab === 'ANALYTICS' && (
          <TeamAnalyticsView analytics={analytics} />
        )}

        {/* --- TAB 7: AI COPILOT --- */}
        {activeTab === 'COPILOT' && (
          <TeamAICopilot />
        )}

        {/* --- MODALS & DRAWERS --- */}
        <TeamMemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          onSuccess={fetchMembers}
          existingMembers={members}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onProjectCreated={fetchProjects}
        />

        <AttendanceLeaveModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          onActionCompleted={() => {
            fetchAttendance();
            fetchLeaves();
          }}
          todayAttendance={attendances[0]}
        />

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSuccess={fetchTasks}
          members={members}
        />

        <TaskDetailDrawer
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            setSelectedTask(updated);
            fetchTasks();
          }}
        />

        <WorkReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={fetchReports}
        />

        <ApprovalManagerModal
          approval={selectedApproval}
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onSuccess={() => {
            setSelectedApproval(null);
            fetchApprovals();
            fetchTasks();
          }}
        />

      </div>
    </DashboardLayout>
  );
}

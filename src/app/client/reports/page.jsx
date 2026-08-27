'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Clock, AlertTriangle, CheckCircle2, User, 
  Search, Filter, Calendar, CalendarDays, Loader2, Flag, X, ChevronRight, ChevronLeft, Eye,
  BarChart3, CheckSquare, Sparkles, Users, Layers, ArrowLeft
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WorkReportModal from '@/components/team/WorkReportModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function WorkReportsPage() {
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  
  // View mode: 'CALENDAR' | 'MEMBERS'
  const [viewMode, setViewMode] = useState('CALENDAR');
  
  // Selected date for calendar daily reporting (defaults to today YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [membersRes, reportsRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/team/members/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/team/reports/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/team/tasks/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : (membersRes.data?.results || []));
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : (reportsRes.data?.results || []));
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : (tasksRes.data?.results || []));
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map of dates that have reports: { '2026-08-25': count }
  const reportDatesMap = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (r.report_date) {
        const d = r.report_date.split('T')[0];
        map[d] = (map[d] || 0) + 1;
      }
    });
    return map;
  }, [reports]);

  // Reports for the currently selected date
  const reportsForSelectedDate = useMemo(() => {
    return reports.filter(r => {
      const d = (r.report_date || '').split('T')[0];
      return d === selectedDate;
    });
  }, [reports, selectedDate]);

  // Helper to calculate member stats & progress
  const getMemberData = (member) => {
    const memberName = (member.username || member.name || '').toLowerCase();
    const memberEmail = (member.email || '').toLowerCase();
    const memberId = String(member.id);

    const memberReports = reports.filter(r => {
      const empName = (r.employee_name || '').toLowerCase();
      const empId = r.employee ? String(r.employee) : '';
      return empName === memberName || empName === memberEmail || empId === memberId;
    }).sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

    const memberTasks = tasks.filter(t => {
      const assigneeName = (t.assigned_to_name || t.assignee_name || '').toLowerCase();
      const assignedList = Array.isArray(t.assigned_to) ? t.assigned_to : [];
      
      const isAssigned = (
        (assigneeName && (assigneeName === memberName || assigneeName === memberEmail)) ||
        assignedList.some(u => {
          if (typeof u === 'object') {
            return String(u.id) === memberId || (u.username || '').toLowerCase() === memberName || (u.email || '').toLowerCase() === memberEmail;
          }
          return String(u) === memberId;
        })
      );
      return isAssigned;
    });

    let totalItems = 0;
    let completedItems = 0;

    memberTasks.forEach(t => {
      const checklist = t.checklist || [];
      if (checklist.length > 0) {
        totalItems += checklist.length;
        completedItems += checklist.filter(i => i.completed).length;
      } else {
        totalItems += 1;
        if (t.status === 'COMPLETED' || t.status === 'DONE') completedItems += 1;
      }
    });

    const progressPercent = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : (memberReports.length > 0 ? 100 : 0);

    const memberHours = memberReports.reduce((acc, curr) => acc + (parseFloat(curr.hours_worked) || 0), 0);

    return {
      memberReports,
      memberTasks,
      totalItems,
      completedItems,
      progressPercent,
      memberHours
    };
  };

  const filteredMembers = members.filter(m => {
    const nameMatch = (m.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const deptMatch = departmentFilter === 'ALL' || (m.department || 'General').toUpperCase() === departmentFilter.toUpperCase();
    return nameMatch && deptMatch;
  });

  const selectedMemberData = selectedMember ? getMemberData(selectedMember) : null;

  // Monthly Calendar Generator Helpers
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCalendarMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(year, month + 1, 1));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5 pb-14 font-sans text-slate-800">
        
        {/* Page Header with Dual View Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <FileText size={18} />
              </div>
              <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">Team Work Reports</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any date on the calendar to view team daily submissions, hours, and progress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setViewMode('CALENDAR')}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'CALENDAR' 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <CalendarDays size={14} />
                <span>Calendar View</span>
              </button>

              <button
                onClick={() => setViewMode('MEMBERS')}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === 'MEMBERS' 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Users size={14} />
                <span>Team Directory</span>
              </button>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span>Submit Report</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: INTERACTIVE CALENDAR & DATE-BASED REPORTING                      */}
        {/* ========================================================================= */}
        {viewMode === 'CALENDAR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: Interactive Calendar Card */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              
              {/* Calendar Month Navigation Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {monthNames[month]} {year}
                  </h3>
                  <p className="text-[11px] text-slate-400">Click a date to see team submissions</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setCalendarMonth(new Date());
                      setSelectedDate(todayStr);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1">
                {/* Day Labels */}
                <div className="grid grid-cols-7 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                    <div key={i} className="py-1">{d}</div>
                  ))}
                </div>

                {/* Day Cells */}
                <div className="grid grid-cols-7 gap-1 pt-1">
                  {/* Empty cells before month starts */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 rounded-xl" />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                    const dayNumber = i + 1;
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const isSelected = selectedDate === formattedDate;
                    const isToday = formattedDate === todayStr;
                    const reportCount = reportDatesMap[formattedDate] || 0;

                    return (
                      <button
                        key={formattedDate}
                        onClick={() => setSelectedDate(formattedDate)}
                        className={cn(
                          "h-10 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer font-bold text-xs border",
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105 z-10"
                            : isToday
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold"
                              : "bg-slate-50/70 text-slate-700 border-transparent hover:border-slate-300 hover:bg-slate-100"
                        )}
                      >
                        <span>{dayNumber}</span>
                        {reportCount > 0 && (
                          <span className={cn(
                            "text-[8px] font-bold px-1 rounded-full",
                            isSelected ? "bg-white text-emerald-700" : "bg-emerald-500 text-white"
                          )}>
                            {reportCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Legend & Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Report Submitted</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">{reports.length}</span> Total Reports Logged
                </div>
              </div>
            </div>

            {/* Right: Reports on Selected Date */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Selected Date Header Banner */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      Reporting for: <span className="text-emerald-700">{selectedDate}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {reportsForSelectedDate.length} report(s) submitted on this date
                    </p>
                  </div>
                </div>

                {reportsForSelectedDate.length > 0 && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold">
                    {reportsForSelectedDate.reduce((acc, r) => acc + (parseFloat(r.hours_worked) || 0), 0)} Total Hours
                  </span>
                )}
              </div>

              {/* Reports List for Selected Date */}
              {loading ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                  <Loader2 className="animate-spin text-emerald-500 mx-auto" size={24} />
                </div>
              ) : reportsForSelectedDate.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CalendarDays size={24} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">No Reports for {selectedDate}</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No team members submitted daily reports on this date. Click another date on the calendar or submit a new report.
                  </p>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Submit Report for Today</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {reportsForSelectedDate.map((report) => (
                    <div 
                      key={report.id} 
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                    >
                      {/* Member Info & Stats Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">
                            {(report.employee_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">{report.employee_name || 'Team Member'}</h4>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={11} /> {report.hours_worked || 8.0} Hours Worked
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {report.need_help && (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-extrabold rounded-lg flex items-center gap-1">
                              <AlertTriangle size={11} /> Needs Help
                            </span>
                          )}
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">
                            {report.report_date}
                          </span>
                        </div>
                      </div>

                      {/* Today's Work Card */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Today's Work
                        </span>
                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 leading-relaxed">
                          {report.todays_work}
                        </div>
                      </div>

                      {/* Completed Work Card */}
                      {report.completed_work && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Completed Tasks
                          </span>
                          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed">
                            {report.completed_work}
                          </div>
                        </div>
                      )}

                      {/* Blockers Card */}
                      {report.blockers && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                            <AlertTriangle size={11} /> Blockers & Challenges
                          </span>
                          <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed font-medium">
                            {report.blockers}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: TEAM DIRECTORY TABLE                                             */}
        {/* ========================================================================= */}
        {viewMode === 'MEMBERS' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 w-full max-w-sm">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by member name or email..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
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

            {/* Members Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {loading ? (
                <div className="py-16 text-center">
                  <Loader2 className="animate-spin text-emerald-500 mx-auto" size={24} />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No team members found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* Header */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 items-center">
                    <div className="col-span-4">Team Member</div>
                    <div className="col-span-2">Department</div>
                    <div className="col-span-2 text-center">Reports / Hours</div>
                    <div className="col-span-3 px-2">Work Progress</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>

                  {/* Rows */}
                  {filteredMembers.map((member) => {
                    const data = getMemberData(member);
                    return (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors cursor-pointer text-xs"
                      >
                        {/* Member */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {member.username?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{member.username}</p>
                            <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                          </div>
                        </div>

                        {/* Department */}
                        <div className="col-span-2 font-medium text-slate-600">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                            {member.department || 'General'}
                          </span>
                        </div>

                        {/* Reports Count & Hours */}
                        <div className="col-span-2 text-center">
                          <span className="font-bold text-slate-800">{data.memberReports.length} Reports</span>
                          <span className="text-[11px] text-emerald-600 font-semibold block">{data.memberHours.toFixed(1)} hrs</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="col-span-3 px-2">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1.5">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-emerald-600 font-extrabold">{data.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs"
                              style={{ width: `${Math.max(data.progressPercent, 4)}%` }}
                            />
                          </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedMember(member); }}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer border border-emerald-200 hover:border-transparent"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CENTER POPUP MODAL: MEMBER DAY-BY-DAY REPORTS & PROGRESS                  */}
        {/* ========================================================================= */}
        {selectedMember && selectedMemberData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                    {selectedMember.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold text-slate-900 text-base">{selectedMember.username}</h2>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-md border border-emerald-100">
                        {selectedMember.department || 'General'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedMemberData.memberReports.length} Reports • {selectedMemberData.memberHours.toFixed(1)} Total Hours Logged
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedMember(null)} 
                  className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Summary Strip */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Work Completion Progress</span>
                    <span className="text-emerald-600 font-extrabold">{selectedMemberData.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/50">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(selectedMemberData.progressPercent, 4)}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium block">Completed Tasks</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {selectedMemberData.completedItems} / {selectedMemberData.totalItems} Items
                  </span>
                </div>
              </div>

              {/* Modal Body: Daily Reports Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedMemberData.memberReports.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    No reports submitted by this team member yet.
                  </div>
                ) : (
                  selectedMemberData.memberReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3 text-xs hover:border-slate-300 transition-all"
                    >
                      {/* Date & Help Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-emerald-600" />
                          {report.report_date}
                        </span>
                        <div className="flex items-center gap-2">
                          {report.need_help && (
                            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-md border border-rose-200">
                              Needs Help
                            </span>
                          )}
                          <span className="text-slate-600 font-bold px-2 py-0.5 bg-slate-100 rounded-md text-[11px]">
                            {report.hours_worked || 8.0} hrs
                          </span>
                        </div>
                      </div>

                      {/* Today's Work */}
                      <div>
                        <p className="text-slate-400 text-[10px] font-extrabold uppercase mb-1">Today's Work</p>
                        <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                          {report.todays_work}
                        </p>
                      </div>

                      {/* Completed */}
                      {report.completed_work && (
                        <div>
                          <p className="text-emerald-600 text-[10px] font-extrabold uppercase mb-1 flex items-center gap-1">
                            <CheckCircle2 size={11} /> Completed
                          </p>
                          <p className="text-emerald-900 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 font-medium">
                            {report.completed_work}
                          </p>
                        </div>
                      )}

                      {/* Blockers */}
                      {report.blockers && (
                        <div>
                          <p className="text-rose-600 text-[10px] font-extrabold uppercase mb-1 flex items-center gap-1">
                            <AlertTriangle size={11} /> Blockers
                          </p>
                          <p className="text-rose-900 bg-rose-50/80 p-3 rounded-xl border border-rose-200 font-medium">
                            {report.blockers}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Report Modal */}
        <WorkReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={fetchData}
        />
      </div>
    </DashboardLayout>
  );
}


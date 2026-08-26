'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, 
  Clock, AlertCircle, Plus, Search, Filter, Home, CheckCircle2,
  CalendarDays, Users, Sparkles, ChevronDown, ChevronUp, EyeOff, Eye,
  Layers, CheckSquare, XCircle, AlertTriangle, UserX, UserCheck
} from 'lucide-react';

export default function WorkReportsCalendarView({ 
  reports = [], 
  leaves = [], 
  attendances = [],
  members = [],
  loading = false,
  isClientRole = true,
  onOpenSubmitModal,
  selectedDate: externalSelectedDate,
  onDateSelect
}) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [internalDate, setInternalDate] = useState(todayStr);
  const selectedDate = externalSelectedDate || internalDate;

  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('SELECTED_DATE'); // 'SELECTED_DATE' | 'ALL_DATES'
  const [hideWFH, setHideWFH] = useState(true); // User requirement: WFH hoga to wo ni dikhega
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectDate = (dateStr) => {
    setInternalDate(dateStr);
    if (onDateSelect) onDateSelect(dateStr);
  };

  // Compute reports map by date: { '2026-08-25': [report1, report2] }
  const reportsByDate = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      const d = r.report_date || (r.created_at ? r.created_at.split('T')[0] : '');
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(r);
    });
    return map;
  }, [reports]);

  // Compute WFH & Leaves map by date: { '2026-08-25': [{ type: 'WFH', user: '...', name: '...' }] }
  const leavesByDate = useMemo(() => {
    const map = {};
    leaves.forEach(l => {
      if (l.status === 'REJECTED') return;
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);
      if (isNaN(start) || isNaN(end)) return;

      const curr = new Date(start);
      while (curr <= end) {
        const dStr = curr.toISOString().split('T')[0];
        if (!map[dStr]) map[dStr] = [];
        map[dStr].push(l);
        curr.setDate(curr.getDate() + 1);
      }
    });
    return map;
  }, [leaves]);

  // Month Navigation
  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    handleSelectDate(todayStr);
  };

  // Mini Calendar grid generation for current month
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const dMonth = month === 0 ? 12 : month;
      const dYear = month === 0 ? year - 1 : year;
      const dateStr = `${dYear}-${String(dMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    // Next month padding to fill grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const dMonth = month + 2 > 12 ? 1 : month + 2;
      const dYear = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${dYear}-${String(dMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [currentMonthDate]);

  // Active employees list
  const activeEmployees = useMemo(() => {
    return (Array.isArray(members) ? members : []).filter(m => 
      m.status !== 'SUSPENDED' && m.role !== 'CLIENT' && m.enterprise_role !== 'CLIENT'
    );
  }, [members]);

  // Selected date reports & leaves
  const selectedDateReports = reportsByDate[selectedDate] || [];
  const selectedDateLeaves = leavesByDate[selectedDate] || [];
  const selectedDateWFH = selectedDateLeaves.filter(l => l.leave_type === 'WFH');
  const selectedDateOtherLeaves = selectedDateLeaves.filter(l => l.leave_type !== 'WFH');

  // Compute submitted & pending members for the selected date
  const { submittedMembers, pendingMembers } = useMemo(() => {
    const submittedIds = new Set(selectedDateReports.map(r => String(r.employee || '')));
    const submittedNames = new Set(selectedDateReports.map(r => (r.employee_name || '').toLowerCase()));
    
    const wfhIds = new Set(selectedDateWFH.map(w => String(w.user || w.user_id || '')));
    const leaveIds = new Set(selectedDateOtherLeaves.map(l => String(l.user || l.user_id || '')));

    const submitted = [];
    const pending = [];

    activeEmployees.forEach(emp => {
      const empId = String(emp.id || emp._id || '');
      const empName = (emp.username || '').toLowerCase();
      const hasSubmitted = submittedIds.has(empId) || submittedNames.has(empName);
      const isWFH = wfhIds.has(empId);
      const isLeave = leaveIds.has(empId);

      if (hasSubmitted) {
        submitted.push(emp);
      } else {
        pending.push({
          ...emp,
          isWFH,
          isLeave
        });
      }
    });

    return { submittedMembers: submitted, pendingMembers: pending };
  }, [activeEmployees, selectedDateReports, selectedDateWFH, selectedDateOtherLeaves]);

  // Filtered reports for display
  const displayedReports = useMemo(() => {
    let list = [...reports];

    // Filter by view mode / date
    if (viewMode === 'SELECTED_DATE') {
      list = list.filter(r => {
        const d = r.report_date || (r.created_at ? r.created_at.split('T')[0] : '');
        return d === selectedDate;
      });
    }

    // Filter out reports from employees marked on WFH on that specific date if hideWFH is active
    if (hideWFH && selectedDateWFH.length > 0 && viewMode === 'SELECTED_DATE') {
      const wfhUserIds = new Set(selectedDateWFH.map(w => String(w.user || w.user_id || '')));
      const wfhUserNames = new Set(selectedDateWFH.map(w => (w.user_name || '').toLowerCase()));
      list = list.filter(r => {
        const rEmpId = String(r.employee || '');
        const rEmpName = (r.employee_name || '').toLowerCase();
        return !wfhUserIds.has(rEmpId) && !wfhUserNames.has(rEmpName);
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        (r.employee_name || '').toLowerCase().includes(q) ||
        (r.employee_department || '').toLowerCase().includes(q) ||
        (r.todays_work || '').toLowerCase().includes(q) ||
        (r.blockers || '').toLowerCase().includes(q) ||
        (r.next_steps || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [reports, viewMode, selectedDate, hideWFH, selectedDateWFH, searchQuery]);

  const monthFormatted = currentMonthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

  const formattedSelectedDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split('-');
      const dateObj = new Date(y, parseInt(m, 10) - 1, d);
      return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate]);

  const isSelectedDatePastOrToday = selectedDate <= todayStr;
  const hasNoReportsOnSelectedDate = selectedDateReports.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* ── LEFT SIDEBAR: SLEEK MINI CALENDAR & FILTERS (Compact ~280px) ── */}
      <div className="w-full lg:w-[290px] shrink-0 space-y-4">
        
        {/* Compact Mini-Calendar Card */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
          
          {/* Month Header & Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-black text-slate-800 tracking-wide">
              {monthFormatted}
            </h4>
            
            <div className="flex items-center gap-1">
              <button
                onClick={goToToday}
                className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-md transition-colors cursor-pointer mr-1"
                title="Go to Today"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDate;
              const isToday = item.dateStr === todayStr;
              const dayReports = reportsByDate[item.dateStr] || [];
              const dayLeaves = leavesByDate[item.dateStr] || [];
              const hasWFH = dayLeaves.some(l => l.leave_type === 'WFH');
              const hasLeave = dayLeaves.some(l => l.leave_type !== 'WFH');
              const isPastOrToday = item.dateStr <= todayStr;
              const isMissingReport = isPastOrToday && dayReports.length === 0 && item.isCurrentMonth;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-8 w-8 mx-auto rounded-xl text-xs font-bold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : isToday
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                        : item.isCurrentMonth
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="leading-none text-[11px]">{item.dayNumber}</span>
                  
                  {/* Indicator Dot */}
                  <div className="flex items-center gap-0.5 absolute bottom-0.5">
                    {dayReports.length > 0 ? (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-600'}`} title={`${dayReports.length} Reports`} />
                    ) : isMissingReport ? (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} title="No Report Submitted" />
                    ) : null}
                    {hasWFH && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} title="WFH" />
                    )}
                    {hasLeave && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} title="Leave" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[9px] text-slate-500 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" /> 
              <span>Submitted</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> 
              <span>Not Submitted</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /> 
              <span>WFH</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> 
              <span>On Leave</span>
            </span>
          </div>

        </div>

        {/* Filters & Mode Card */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          
          {/* View Mode Switcher */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Stream View
            </label>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('SELECTED_DATE')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  viewMode === 'SELECTED_DATE' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📅 Day Only
              </button>
              <button
                onClick={() => setViewMode('ALL_DATES')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  viewMode === 'ALL_DATES' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📋 All Dates
              </button>
            </div>
          </div>

          {/* WFH Toggle Switch */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Home size={14} className={hideWFH ? "text-indigo-600" : "text-slate-400"} />
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">Hide WFH</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Filter out remote work</p>
              </div>
            </div>
            <button
              onClick={() => setHideWFH(!hideWFH)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                hideWFH ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                hideWFH ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative pt-1">
            <Search size={13} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

        </div>

      </div>

      {/* ── RIGHT MAIN AREA: WORK REPORTS STREAM & MISSING REPORT STATUS ── */}
      <div className="flex-1 min-w-0 space-y-4 w-full">
        
        {/* Sleek Action Header */}
        <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold border shrink-0 ${
              hasNoReportsOnSelectedDate && isSelectedDatePastOrToday && viewMode === 'SELECTED_DATE'
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              {hasNoReportsOnSelectedDate && isSelectedDatePastOrToday && viewMode === 'SELECTED_DATE' ? (
                <XCircle size={20} />
              ) : (
                <FileText size={18} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {viewMode === 'SELECTED_DATE' ? formattedSelectedDate : 'All Work Reports Stream'}
                </h3>
                
                {/* Status Badge */}
                {viewMode === 'SELECTED_DATE' ? (
                  hasNoReportsOnSelectedDate && isSelectedDatePastOrToday ? (
                    <span className="text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Report Not Submitted
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {displayedReports.length} {displayedReports.length === 1 ? 'Report' : 'Reports'} Submitted
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {displayedReports.length} Total
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {viewMode === 'SELECTED_DATE' 
                  ? (hasNoReportsOnSelectedDate && isSelectedDatePastOrToday ? `No report submitted on ${selectedDate}` : `Submitted on ${selectedDate}`)
                  : 'Showing complete workspace report history'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSubmitModal(selectedDate)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={15} /> Submit Work Report
          </button>
        </div>

        {/* WFH & Leave Notice Banner on Selected Date (if any) */}
        {selectedDateWFH.length > 0 && viewMode === 'SELECTED_DATE' && (
          <div className="px-4 py-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="p-1 bg-indigo-600 text-white rounded-lg text-[10px]">🏠</span>
              <div>
                <span className="font-bold text-indigo-950">
                  {selectedDateWFH.length} Member{selectedDateWFH.length > 1 ? 's' : ''} on Work From Home:
                </span>
                <span className="text-indigo-700 font-medium ml-1.5">
                  {selectedDateWFH.map(w => w.user_name || 'Member').join(', ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setHideWFH(!hideWFH)}
              className="text-[10px] font-extrabold text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors cursor-pointer shrink-0"
            >
              {hideWFH ? 'Show WFH' : 'Hide WFH'}
            </button>
          </div>
        )}

        {selectedDateOtherLeaves.length > 0 && viewMode === 'SELECTED_DATE' && (
          <div className="px-4 py-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-2 text-xs animate-in fade-in">
            <span className="p-1 bg-amber-500 text-white rounded-lg text-[10px]">🏖️</span>
            <div>
              <span className="font-bold text-amber-950">On Approved Leave:</span>
              <span className="text-amber-800 font-medium ml-1.5">
                {selectedDateOtherLeaves.map(l => `${l.user_name || 'Member'} (${l.leave_type})`).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* ── CASE 1: NO REPORTS SUBMITTED ON THIS DATE (Report Not Submitted / Missing Alert) ── */}
        {viewMode === 'SELECTED_DATE' && hasNoReportsOnSelectedDate && isSelectedDatePastOrToday && (
          <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-rose-950">
                    No Daily Work Report Submitted
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Team members have not submitted their end-of-day work report for <span className="font-bold">{formattedSelectedDate}</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenSubmitModal(selectedDate)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus size={14} /> Submit Report Now
              </button>
            </div>

            {/* Pending Members Breakdown */}
            {pendingMembers.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Pending Submission ({pendingMembers.length} Members)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pendingMembers.map((emp) => (
                    <div 
                      key={emp.id || emp._id} 
                      className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {(emp.first_name || emp.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {emp.first_name ? `${emp.first_name} ${emp.last_name || ''}`.trim() : emp.username}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{emp.department || 'General'}</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${
                        emp.isWFH ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        emp.isLeave ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {emp.isWFH ? '🏠 WFH' : emp.isLeave ? '🏖️ Leave' : '🔴 Not Submitted'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── CASE 2: FUTURE DATE SELECTED ── */}
        {viewMode === 'SELECTED_DATE' && hasNoReportsOnSelectedDate && !isSelectedDatePastOrToday && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">
                Future Date: {formattedSelectedDate}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No work reports for future dates yet. Reports will be submitted after shifts end.
              </p>
            </div>
          </div>
        )}

        {/* ── CASE 3: REPORTS EXIST (STREAM CARDS) ── */}
        {displayedReports.length > 0 && (
          <div className="space-y-4">
            
            {/* Reports Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedReports.map((r) => (
                <div 
                  key={r.id || r._id} 
                  className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                          {(r.employee_name || 'E').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                            {r.employee_name || 'Team Member'}
                          </h4>
                          <p className="text-[10px] font-semibold text-slate-400">
                            {r.employee_department || 'General'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {r.report_date || (r.created_at ? r.created_at.split('T')[0] : selectedDate)}
                        </span>
                        {r.hours_worked && (
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-200/60">
                            <Clock size={9} /> {r.hours_worked} hrs
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Today's Accomplishments */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                          Accomplishments
                        </p>
                        <div className="text-slate-700 font-medium bg-slate-50/80 p-3 rounded-2xl border border-slate-100 leading-relaxed text-xs whitespace-pre-wrap">
                          {r.todays_work}
                        </div>
                      </div>

                      {r.completed_work && (
                        <div className="text-[11px]">
                          <span className="font-bold text-slate-500">Completed: </span>
                          <span className="text-slate-700">{r.completed_work}</span>
                        </div>
                      )}

                      {r.next_steps && (
                        <div className="text-[11px]">
                          <span className="font-bold text-slate-500">Next Steps: </span>
                          <span className="text-slate-700">{r.next_steps}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flagged Blocker Alert (Bottom) */}
                  {r.need_help && (
                    <div className="p-2 bg-rose-50 border border-rose-200/80 text-rose-700 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                      <AlertCircle size={13} className="shrink-0 text-rose-500" />
                      <span>Flagged Blocker: Requires team / manager support</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pending Members Section (if some members haven't submitted yet on this date) */}
            {viewMode === 'SELECTED_DATE' && pendingMembers.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  ⚠️ Other Team Members with Pending Report ({pendingMembers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {pendingMembers.map((emp) => (
                    <span 
                      key={emp.id || emp._id} 
                      className="px-2.5 py-1 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{emp.first_name || emp.username}</span>
                      <span className="text-[10px] text-slate-400">({emp.department || 'General'})</span>
                      <span className="text-[9px] text-rose-600 font-bold ml-1">Not Submitted</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

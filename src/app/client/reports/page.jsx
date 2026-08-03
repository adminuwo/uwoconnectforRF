'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Clock, AlertTriangle, CheckCircle2, User, 
  Search, Filter, Calendar, Loader2, Flag, X, ChevronRight, Eye,
  BarChart3, CheckSquare
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WorkReportModal from '@/components/team/WorkReportModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

export default function WorkReportsPage() {
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [membersRes, reportsRes, tasksRes] = await Promise.all([
        axios.get(`${API}/api/team/members/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/team/reports/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/team/tasks/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMembers(membersRes.data || []);
      setReports(reportsRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5 pb-12 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Work Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">Select a team member to view their daily reports and progress.</p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus size={15} />
            <span>Submit Daily Report</span>
          </button>
        </div>

        {/* Clean Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-sm">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member name or email..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-400"
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

        {/* Clean Minimal List Table */}
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
              {/* Header Row with Clean Spacing */}
              <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 items-center">
                <div className="col-span-4">Team Member</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2 text-center">Reports / Hours</div>
                <div className="col-span-3 px-2">Work Progress Bar</div>
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

                    {/* PROMINENT WORK PROGRESS BAR */}
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
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
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

        {/* ── CLEAN DAY-BY-DAY REPORTS DRAWER ── */}
        {selectedMember && selectedMemberData && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40" onClick={() => setSelectedMember(null)} />
            
            <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden">
              
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {selectedMember.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">{selectedMember.username}</h2>
                    <p className="text-xs text-slate-400">{selectedMember.department || 'General'} • {selectedMemberData.memberReports.length} Reports</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedMember(null)} 
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Progress Bar */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 space-y-1.5 shrink-0">
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

              {/* Daily Reports List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedMemberData.memberReports.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No reports submitted yet.
                  </div>
                ) : (
                  selectedMemberData.memberReports.map((report) => (
                    <div key={report.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-emerald-500" />
                          {report.report_date}
                        </span>
                        <div className="flex items-center gap-2">
                          {report.need_help && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded">Needs Help</span>
                          )}
                          <span className="text-slate-500 font-medium">{report.hours_worked} hrs</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-400 text-[10px] font-semibold uppercase mb-0.5">Today's Work</p>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {report.todays_work}
                        </p>
                      </div>

                      {report.completed_work && (
                        <div>
                          <p className="text-emerald-600 text-[10px] font-semibold uppercase mb-0.5 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Completed
                          </p>
                          <p className="text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                            {report.completed_work}
                          </p>
                        </div>
                      )}

                      {report.blockers && (
                        <div>
                          <p className="text-rose-600 text-[10px] font-semibold uppercase mb-0.5 flex items-center gap-1">
                            <AlertTriangle size={10} /> Blockers
                          </p>
                          <p className="text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100">
                            {report.blockers}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Modal */}
        <WorkReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={fetchData}
        />
      </div>
    </DashboardLayout>
  );
}

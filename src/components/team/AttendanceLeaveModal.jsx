import React, { useState } from 'react';
import { X, Clock, Calendar, CheckCircle, AlertCircle, Play, Square, FileText } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function AttendanceLeaveModal({ isOpen, onClose, onActionCompleted, todayAttendance }) {
  const [activeTab, setActiveTab] = useState('ATTENDANCE'); // ATTENDANCE or LEAVE
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Leave Request Form State
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleClockIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/team/attendance/clock_in/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Successfully Clocked In!');
      onActionCompleted();
    } catch (err) {
      console.error('Clock in error:', err);
      setError(err.response?.data?.error || 'Clock In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/team/attendance/clock_out/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Successfully Clocked Out!');
      onActionCompleted();
    } catch (err) {
      console.error('Clock out error:', err);
      setError(err.response?.data?.error || 'Clock Out failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setError('Please fill in all leave details.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/team/leaves/`,
        {
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Leave request submitted successfully!');
      onActionCompleted();
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      console.error('Leave request error:', err);
      setError(err.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-base">
            <Clock size={20} className="text-emerald-600" />
            <span>Attendance & Leave Management</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('ATTENDANCE'); setError(''); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ATTENDANCE' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Clock In / Clock Out
          </button>
          <button
            onClick={() => { setActiveTab('LEAVE'); setError(''); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'LEAVE' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Request Leave / WFH
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'ATTENDANCE' ? (
            <div className="space-y-6 text-center py-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Today's Status</p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {todayAttendance?.clock_in ? (todayAttendance.clock_out ? 'Completed Workday' : 'Currently Working') : 'Not Clocked In'}
                </p>
                {todayAttendance?.clock_in && (
                  <p className="text-xs text-slate-400 mt-1">
                    Clocked in at: {new Date(todayAttendance.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleClockIn}
                  disabled={loading || (todayAttendance && todayAttendance.clock_in && !todayAttendance.clock_out)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-colors disabled:opacity-40"
                >
                  <Play size={16} />
                  <span>Clock In</span>
                </button>

                <button
                  onClick={handleClockOut}
                  disabled={loading || !todayAttendance?.clock_in || todayAttendance?.clock_out}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-40"
                >
                  <Square size={16} />
                  <span>Clock Out</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PAID">Paid Leave</option>
                  <option value="WFH">Work From Home (WFH)</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide brief details for your manager..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium shadow-md shadow-emerald-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

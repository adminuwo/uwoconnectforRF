'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Loader2, 
  X, 
  Eye, 
  Database,
  Calendar,
  User,
  ShieldCheck,
  Globe
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (moduleFilter !== 'ALL') params.module = moduleFilter;

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/audit-logs/`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [searchTerm, moduleFilter]);

  const uniqueModules = ['ALL', ...new Set(logs.map(log => log.module))];

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-20 px-4 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase flex items-center gap-3">
              <Activity className="text-rose-600" size={32} /> Platform Audit Trail
            </h1>
            <p className="text-slate-500 font-medium italic">Immutable security audit logs for all administrative actions.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:flex-initial">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
               <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="bg-white border border-slate-200 focus:border-rose-500 px-12 py-3.5 rounded-2xl outline-none w-full sm:w-[280px] font-bold text-xs transition-all shadow-sm italic placeholder:text-slate-300"
               />
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Module:</span>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl outline-none text-slate-700 focus:border-rose-500"
              >
                <option value="ALL">All Modules</option>
                {uniqueModules.filter(m => m !== 'ALL').map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-rose-600" size={32} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching security logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-center px-10">
               <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mb-6">
                  <Database size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">No logs found</h3>
               <p className="text-slate-500 max-w-sm font-medium italic">We couldn't find any audit log records matching filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-6">Administrator</th>
                    <th className="p-6">Client Workspace</th>
                    <th className="p-6">Module</th>
                    <th className="p-6">Action performed</th>
                    <th className="p-6">IP Address</th>
                    <th className="p-6">Timestamp</th>
                    <th className="p-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-black text-slate-900 flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        {log.admin_name}
                      </td>
                      <td className="p-6">{log.client_name}</td>
                      <td className="p-6">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {log.module}
                        </span>
                      </td>
                      <td className="p-6 font-bold">
                        <span className="text-rose-600 bg-rose-50 border border-rose-100/50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-6 text-slate-500 font-mono flex items-center gap-1.5">
                        <Globe size={12} className="text-slate-300" />
                        {log.ip_address || 'Internal'}
                      </td>
                      <td className="p-6 text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-300" />
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 font-black uppercase tracking-widest text-[9px] border border-transparent hover:border-rose-100"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
            <div
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <div
              className="relative bg-white w-full max-w-2xl rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">Audit Log Details</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Audit ID: {selectedLog.id}</p>
                  </div>
                  <button onClick={() => setSelectedLog(null)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Executor Admin</span>
                    <span className="font-bold text-slate-800">{selectedLog.admin_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Workspace</span>
                    <span className="font-bold text-slate-800">{selectedLog.client_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Module Area</span>
                    <span className="font-bold text-slate-800">{selectedLog.module}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Action Type</span>
                    <span className="font-bold text-rose-600 uppercase">{selectedLog.action}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Timestamp</span>
                    <span className="font-bold text-slate-800">{new Date(selectedLog.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">IP Address</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedLog.ip_address || 'System / Internal'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Before Value State</span>
                    <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedLog.before_value || '(None)'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">After Value State</span>
                    <pre className="bg-slate-900 text-[#22c55e] p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedLog.after_value || '(None)'}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 border-t border-slate-100 flex justify-end bg-slate-50">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;

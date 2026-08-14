'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Mail, Globe, AlertCircle, Check, Loader2, Table, Settings as SettingsIcon, Database, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

export const GoogleSheetsIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="#0F9D58"/>
    <path d="M7 7H17V9H7V7Z" fill="#FFFFFF"/>
    <path d="M7 11H12V13H7V11Z" fill="#FFFFFF"/>
    <path d="M14 11H17V13H14V11Z" fill="#FFFFFF"/>
    <path d="M7 15H12V17H7V15Z" fill="#FFFFFF"/>
    <path d="M14 15H17V17H14V15Z" fill="#FFFFFF"/>
  </svg>
);

export default function GoogleSheetsConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, ROWS, SETTINGS
  const [sheetsInfo, setSheetsInfo] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Manual Append Form
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRow, setNewRow] = useState({
    channel: 'WHATSAPP',
    name: '',
    contact: '',
    lead_type: 'NEW_INQUIRY',
    content: '',
    status: 'NEW',
  });
  const [appendingRow, setAppendingRow] = useState(false);

  const isConnected = Boolean(client?.google_sheets_enabled);
  const config = client?.google_sheets_config || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchSheetsInfo();
    } else {
      setLoading(false);
    }
  }, [isOpen, isConnected]);

  const fetchSheetsInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-sheets/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.connected) {
        setSheetsInfo(res.data);
        setRows(res.data.rows || []);
      }
    } catch (err) {
      console.error('Failed to fetch Google Sheets info:', err);
      setError('Could not load Google Sheets status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/google-sheets/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('Failed to initiate Google Sheets connection.');
        setConnecting(false);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to initiate Google Sheets connection.');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-sheets/sync/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSheetsInfo();
      setToast('Google Sheets synced successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleAppendRow = async (e) => {
    e.preventDefault();
    if (!newRow.name.trim()) return;
    setAppendingRow(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/google-sheets/append-row/`, newRow, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast('✅ Lead row appended to Google Spreadsheet!');
      setTimeout(() => setToast(null), 3000);
      setShowAddRow(false);
      setNewRow({ channel: 'WHATSAPP', name: '', contact: '', lead_type: 'NEW_INQUIRY', content: '', status: 'NEW' });
      await fetchSheetsInfo();
    } catch (err) {
      setError('Failed to append row to Google Sheets.');
    } finally {
      setAppendingRow(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Sheets? Existing spreadsheets will remain in your Google Drive.')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/google-sheets/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect Google Sheets.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
                <GoogleSheetsIcon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Google Sheets
                  {isConnected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export incoming leads, WhatsApp messages, orders, and contacts into live Google Spreadsheets.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} />
              {toast}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* NOT CONNECTED STATE */}
          {!isConnected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                <GoogleSheetsIcon size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Connect Google Sheets</h3>
              <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                Connect your Google Account to automatically sync customer leads from WhatsApp, Facebook, Instagram, and CRM directly into an organized Google Spreadsheet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left w-full max-w-lg mb-8 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Real-time lead row appending</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Auto-creates &quot;UWOConnect Leads&quot; sheet</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Export orders & customer data</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Two-way spreadsheet sync</span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-6 py-3 bg-[#0F9D58] hover:bg-[#0B8043] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {connecting ? <Loader2 size={18} className="animate-spin" /> : <GoogleSheetsIcon size={18} />}
                <span>Connect with Google Sheets</span>
              </button>
            </div>
          ) : (
            /* CONNECTED STATE */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'OVERVIEW'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe size={14} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('ROWS')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'ROWS'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Table size={14} /> Recent Lead Rows ({rows.length})
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    activeTab === 'SETTINGS'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <SettingsIcon size={14} /> Export Rules
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <>
                  {/* OVERVIEW TAB */}
                  {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6 overflow-y-auto pr-1">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Google Account</p>
                          <p className="font-bold text-slate-800 truncate">{config.account_email || sheetsInfo?.account_email || 'Connected'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Spreadsheet Title</p>
                          <p className="font-bold text-emerald-700 truncate flex items-center gap-1">
                            <FileSpreadsheet size={14} />
                            {sheetsInfo?.spreadsheet_name || config.spreadsheet_name || 'UWOConnect Leads'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold mb-1">Total Rows Exported</p>
                          <p className="font-bold text-slate-800">{config.rows_synced || sheetsInfo?.rows_synced || 0} Rows</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Export Test Lead Row</h4>
                          <p className="text-[11px] text-slate-500">Append a test row directly into your connected Google Spreadsheet.</p>
                        </div>
                        <button
                          onClick={() => setShowAddRow(!showAddRow)}
                          className="px-3 py-1.5 bg-[#0F9D58] hover:bg-[#0B8043] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus size={14} /> Add Lead Row
                        </button>
                      </div>

                      {/* Add Row Form */}
                      {showAddRow && (
                        <form onSubmit={handleAppendRow} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs animate-in fade-in">
                          <h4 className="font-bold text-slate-800 mb-2">Append Lead to Google Sheets</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Name</label>
                              <input
                                type="text"
                                placeholder="Rahul Sharma"
                                value={newRow.name}
                                onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                                required
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Phone / Email</label>
                              <input
                                type="text"
                                placeholder="+919876543210"
                                value={newRow.contact}
                                onChange={(e) => setNewRow({ ...newRow, contact: e.target.value })}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Message / Content</label>
                            <input
                              type="text"
                              placeholder="Interested in enterprise plan pricing"
                              value={newRow.content}
                              onChange={(e) => setNewRow({ ...newRow, content: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 mt-1"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddRow(false)}
                              className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={appendingRow}
                              className="px-4 py-1.5 bg-[#0F9D58] hover:bg-[#0B8043] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {appendingRow ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              <span>Append Row</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Recent Rows Preview */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-3">Recent Exported Rows</h4>
                        {rows.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200/60">
                            No rows found in connected Google Spreadsheet.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-400 uppercase font-bold">
                                  <th className="p-2.5">Time</th>
                                  <th className="p-2.5">Channel</th>
                                  <th className="p-2.5">Name</th>
                                  <th className="p-2.5">Contact</th>
                                  <th className="p-2.5">Message</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {rows.slice(0, 4).map((r, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="p-2.5 text-slate-400 font-mono text-[10px] whitespace-nowrap">{r.timestamp}</td>
                                    <td className="p-2.5 font-bold text-slate-700">{r.channel}</td>
                                    <td className="p-2.5 font-semibold text-slate-900">{r.name}</td>
                                    <td className="p-2.5 text-slate-600">{r.contact}</td>
                                    <td className="p-2.5 text-slate-500 max-w-[180px] truncate">{r.content}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ROWS TAB */}
                  {activeTab === 'ROWS' && (
                    <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                      {rows.length === 0 ? (
                        <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <Table size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="font-bold text-slate-700">No Exported Rows Yet</p>
                          <p className="mt-1">Incoming WhatsApp leads and orders will appear here automatically.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-400 uppercase font-bold">
                                <th className="p-3">Timestamp</th>
                                <th className="p-3">Channel</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Content</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {rows.map((r, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                  <td className="p-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">{r.timestamp}</td>
                                  <td className="p-3 font-bold text-emerald-700">{r.channel}</td>
                                  <td className="p-3 font-semibold text-slate-900">{r.name}</td>
                                  <td className="p-3 text-slate-600">{r.contact}</td>
                                  <td className="p-3 text-slate-500">{r.lead_type}</td>
                                  <td className="p-3 text-slate-600 max-w-[200px] truncate">{r.content}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === 'SETTINGS' && (
                    <div className="space-y-4 overflow-y-auto text-xs">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-bold text-slate-900">Auto-Export Rules</h4>
                        
                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
                          <div>
                            <p className="font-bold text-slate-800">Auto-export Incoming WhatsApp Leads</p>
                            <p className="text-[11px] text-slate-400">Append new customer contacts & inquiries to Google Sheets automatically.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600" />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
                          <div>
                            <p className="font-bold text-slate-800">Auto-export Store Orders</p>
                            <p className="text-[11px] text-slate-400">Export catalog orders & purchase details in real-time.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600" />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Footer Controls */}
          {isConnected && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Sheets'}
              </button>

              <div className="flex items-center gap-2">
                {sheetsInfo?.spreadsheet_url && (
                  <a
                    href={sheetsInfo.spreadsheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} /> Open Google Sheet
                  </a>
                )}
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-4 py-2 bg-[#0F9D58] hover:bg-[#0B8043] text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div className="w-full md:w-80 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Connection Status</h3>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="font-bold text-xs text-slate-800">{isConnected ? 'Connected' : 'Not Connected'}</span>
              </div>
              {isConnected && (
                <p className="text-[11px] text-slate-500 truncate">
                  Account: <span className="font-semibold text-slate-700">{config.account_email || 'Active'}</span>
                </p>
              )}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">How It Works</h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                Connect your Google Account securely via OAuth2.
              </li>
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                Auto-appends incoming WhatsApp leads & store orders.
              </li>
              <li className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
                View live spreadsheet row updates in real-time.
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>256-bit OAuth2 Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

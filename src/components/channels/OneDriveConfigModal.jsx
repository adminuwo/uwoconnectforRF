'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Loader2, AlertCircle, RefreshCw, ExternalLink, 
  HardDrive, Cloud, CheckCircle2, XCircle, Clock,
  FolderSync, Upload, Trash2
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

// Microsoft OneDrive Icon SVG
const OneDriveIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path d="M10.5 18H17.5C19.71 18 21.5 16.21 21.5 14C21.5 12.14 20.23 10.57 18.5 10.13C18.5 10.09 18.5 10.04 18.5 10C18.5 7.24 16.26 5 13.5 5C11.36 5 9.55 6.36 8.85 8.26C8.57 8.1 8.25 8 7.9 8C6.75 8 5.82 8.93 5.82 10.08L5.82 10.18C4.17 10.72 3 12.26 3 14C3 16.21 4.79 18 7 18H10.5Z" fill="currentColor" />
  </svg>
);

// Format bytes to human-readable
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format date to readable
const formatDate = (dateStr) => {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export { OneDriveIcon };

export default function OneDriveConfigModal({ isOpen, onClose, client, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [driveInfo, setDriveInfo] = useState(null);
  const [syncStats, setSyncStats] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | queue | settings

  const isConnected = !!client?.onedrive_config?.drive_id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

  const fetchDriveInfo = useCallback(async () => {
    if (!isConnected) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/onedrive/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDriveInfo(res.data.drive_info);
      setSyncStats(res.data.sync_stats);
    } catch (err) {
      console.warn('Failed to fetch OneDrive info', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected, apiUrl]);

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchDriveInfo();
    }
  }, [isOpen, isConnected, fetchDriveInfo]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/onedrive/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError('Failed to initiate OneDrive connection.');
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/onedrive/sync/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDriveInfo();
    } catch (err) {
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect OneDrive? Existing synced files will remain in OneDrive.')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${apiUrl}/api/onedrive/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError('Failed to disconnect OneDrive.');
    } finally {
      setDisconnecting(false);
    }
  };

  const storageUsed = driveInfo?.storage_used || client?.onedrive_config?.storage_used || 0;
  const storageTotal = driveInfo?.storage_total || client?.onedrive_config?.storage_total || 0;
  const storagePercent = storageTotal > 0 ? ((storageUsed / storageTotal) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left/Main Column */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col min-h-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Cloud size={20} className="text-[#0078D4]" />
                Microsoft OneDrive
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {isConnected 
                  ? 'Manage your OneDrive document sync settings.' 
                  : 'Connect OneDrive to automatically back up all documents.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all border border-slate-100/50"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          {!isConnected ? (
            /* Not Connected State */
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0078D4]/10 to-[#50E6FF]/10 flex items-center justify-center mb-6 border border-[#0078D4]/20">
                <OneDriveIcon size={40} className="text-[#0078D4]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Microsoft OneDrive</h3>
              <p className="text-xs text-slate-500 text-center max-w-md mb-8 leading-relaxed">
                Automatically back up every document received from WhatsApp, Facebook, Instagram, Gmail, and all other connectors into your OneDrive with an organized folder structure.
              </p>
              <div className="space-y-3 mb-8 w-full max-w-sm">
                {[
                  'Auto-sync all received documents',
                  'Smart folder organization by channel',
                  'Team member document backup',
                  'Background sync with retry logic',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                    <CheckCircle2 size={14} className="text-[#0078D4] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConnect}
                className="px-8 py-3.5 bg-[#0078D4] hover:bg-[#106EBE] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#0078D4]/20 flex items-center gap-2 cursor-pointer"
              >
                <OneDriveIcon size={18} className="text-white" />
                Connect with Microsoft
              </button>
            </div>
          ) : (
            /* Connected State */
            <div className="flex-1">
              {/* Tab Navigation */}
              <div className="flex gap-1 mb-6 bg-slate-50 rounded-xl p-1 border border-slate-100">
                {[
                  { key: 'overview', label: 'Overview', icon: HardDrive },
                  { key: 'queue', label: 'Upload Queue', icon: Upload },
                  { key: 'settings', label: 'Settings', icon: FolderSync },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      activeTab === key
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Storage Progress */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Storage Usage</h4>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-bold text-slate-900">{formatBytes(storageUsed)}</span>
                      <span className="text-xs text-slate-400">of {formatBytes(storageTotal)}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          storagePercent > 90 ? 'bg-red-500' : storagePercent > 70 ? 'bg-amber-500' : 'bg-[#0078D4]'
                        )}
                        style={{ width: `${Math.min(storagePercent, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">{storagePercent}% used · {formatBytes(storageTotal - storageUsed)} remaining</p>
                  </div>

                  {/* Account Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Microsoft Account', value: driveInfo?.account_name || client?.onedrive_config?.account_name || 'N/A' },
                      { label: 'Drive Name', value: driveInfo?.drive_name || client?.onedrive_config?.drive_name || 'N/A' },
                      { label: 'Drive ID', value: driveInfo?.drive_id || client?.onedrive_config?.drive_id || 'N/A' },
                      { label: 'Last Sync', value: formatDate(syncStats?.last_sync_time || client?.onedrive_config?.last_sync_time) },
                    ].map(({ label, value }, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">{label}</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sync Statistics */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Synced Files', value: syncStats?.synced_count || 0, color: 'text-emerald-600' },
                      { label: 'Pending', value: syncStats?.pending_count || 0, color: 'text-amber-600' },
                      { label: 'Failed', value: syncStats?.failed_count || 0, color: 'text-red-600' },
                    ].map(({ label, value, color }, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <span className={cn('text-2xl font-bold block', color)}>{value}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'queue' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Queue</h4>
                    <button
                      onClick={handleSyncNow}
                      disabled={syncing}
                      className="text-xs text-[#0078D4] hover:text-[#106EBE] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={cn(syncing && 'animate-spin')} />
                      {syncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                  </div>

                  {(!syncStats?.queue_items || syncStats.queue_items.length === 0) ? (
                    <div className="text-center py-12">
                      <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-700">All files synced</p>
                      <p className="text-xs text-slate-400 mt-1">No pending uploads in the queue.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {syncStats.queue_items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            item.status === 'PENDING' ? 'bg-amber-400' :
                            item.status === 'UPLOADING' ? 'bg-blue-400 animate-pulse' :
                            item.status === 'FAILED' ? 'bg-red-400' : 'bg-emerald-400'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{item.file_name}</p>
                            <p className="text-[10px] text-slate-400">{item.connector} → {item.target_folder}</p>
                          </div>
                          <span className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full',
                            item.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                            item.status === 'UPLOADING' ? 'bg-blue-50 text-blue-600' :
                            item.status === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          )}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Folder Structure</h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs font-mono text-slate-600 space-y-1 max-h-[250px] overflow-y-auto">
                      <p className="font-bold text-slate-800">UWOConnect/</p>
                      {[
                        '├── WhatsApp/ (Images, Documents, Audio, Video)',
                        '├── Facebook/ (Images, Documents, Attachments)',
                        '├── Instagram/ (Images, Documents)',
                        '├── Telegram/',
                        '├── Gmail/',
                        '├── Outlook/',
                        '├── Teams/',
                        '├── Slack/',
                        '├── Discord/',
                        '├── Website Chat/',
                        '├── AI Chat/',
                        '├── CRM/',
                        '├── Orders/',
                        '├── Invoices/',
                        '├── Knowledge Base/',
                        '├── Team/ (Employee Documents, Shared Files, Reports)',
                        '├── Workflow Files/',
                        '└── Backups/',
                      ].map((line, i) => (
                        <p key={i} className="pl-4">{line}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Supported File Types</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'CSV', 'PPT', 'PPTX', 'TXT', 'ZIP', 'Images', 'Audio', 'Video'].map((type) => (
                        <span key={type} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-semibold border border-slate-200/60">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          {isConnected && (
            <div className="pt-5 mt-6 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-4 py-2.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {disconnecting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Disconnect
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const driveUrl = driveInfo?.web_url || 'https://onedrive.live.com';
                    window.open(driveUrl, '_blank');
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60"
                >
                  <ExternalLink size={13} />
                  Open OneDrive
                </button>
                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className={cn(
                    'px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-200 flex items-center gap-2 text-white cursor-pointer',
                    syncing
                      ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                      : 'bg-[#0078D4] hover:bg-[#106EBE] shadow-[#0078D4]/20'
                  )}
                >
                  {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status Panel */}
        <div className="w-full md:w-80 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 p-6 md:p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Connection Status</h4>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0',
                  isConnected
                    ? 'bg-[#0078D4] shadow-[0_0_8px_rgba(0,120,212,0.5)]'
                    : 'bg-slate-300'
                )} />
                <span className="text-sm font-bold text-slate-800">
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            {isConnected && (
              <>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync Information</h4>
                  <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Auto Sync</span>
                      <span className="font-bold text-emerald-600 text-right">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Last Sync</span>
                      <span className="font-bold text-slate-800 text-right">
                        {formatDate(syncStats?.last_sync_time || client?.onedrive_config?.last_sync_time)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Total Synced</span>
                      <span className="font-bold text-slate-800 text-right">{syncStats?.synced_count || 0} files</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Queue Size</span>
                      <span className="font-bold text-slate-800 text-right">{syncStats?.pending_count || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync Channels</h4>
                  <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-2 text-xs">
                    {['WhatsApp', 'Facebook', 'Instagram', 'Gmail', 'Team', 'Knowledge Base', 'CRM'].map((ch) => (
                      <div key={ch} className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{ch}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isConnected && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How It Works</h4>
                <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-4 text-xs">
                  {[
                    { step: '1', text: 'Connect your Microsoft account via OAuth' },
                    { step: '2', text: 'UWOConnect creates organized folders automatically' },
                    { step: '3', text: 'Documents sync in the background to the correct folder' },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {step}
                      </span>
                      <span className="text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

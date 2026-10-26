'use client';

import React, { useState, useEffect } from 'react';
import { 
  HardDrive, CheckCircle2, RefreshCw, X, ExternalLink, ShieldCheck, 
  Clock, Plus, Mail, Globe, AlertCircle, Check, Loader2, Settings as SettingsIcon, Folder, Upload
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export const GoogleDriveIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4.5 15.5L8.25 9H21L17.25 15.5H4.5Z" fill="#34A853"/>
    <path d="M8.25 9L12 2.5H19.5L15.75 9H8.25Z" fill="#4285F4"/>
    <path d="M2.25 15.5L6 22H13.5L9.75 15.5H2.25Z" fill="#FBBC04"/>
    <path d="M13.5 22L17.25 15.5H21.75L18 22H13.5Z" fill="#EA4335"/>
  </svg>
);

export default function GoogleDriveConfigModal({ client, isOpen, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [driveInfo, setDriveInfo] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const isConnected = Boolean(
    client?.google_drive_enabled || 
    client?.google_drive_config?.connected ||
    client?.google_drive_config?.access_token
  );

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchDriveInfo();
    } else {
      setLoading(false);
    }
  }, [isOpen, isConnected]);

  const fetchDriveInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/google-drive/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDriveInfo(res.data);
      if (res.data?.connected) {
        const filesRes = await axios.get(`${API_BASE_URL}/api/google-drive/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentFiles(filesRes.data?.files || []);
      }
    } catch (err) {
      console.error('Failed to fetch Drive info:', err);
      setError('Failed to fetch Google Drive status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/google-drive/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
      }
    } catch (err) {
      setError('Failed to initiate Google Drive connection.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Drive?')) return;
    setDisconnecting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('uwo_token');
      await axios.post(`${API_BASE_URL}/api/google-drive/disconnect/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError('Failed to disconnect Google Drive.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <HardDrive size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Google Drive Cloud Storage
              </h3>
              <p className="text-xs text-slate-500">
                Manage files, shared team assets, and cloud documents
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    Google Drive Connected
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Account: {driveInfo?.email || 'Connected Google Account'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent Files in Drive
                </p>
                {recentFiles.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No files retrieved yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-h-48 overflow-y-auto">
                    {recentFiles.slice(0, 5).map((f) => (
                      <div key={f.id} className="p-2.5 text-xs flex items-center justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                          {f.name}
                        </span>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline shrink-0"
                          >
                            Open
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <HardDrive size={36} className="text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Connect Google Drive
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Authorize access to browse and upload files directly from UWO Connect.
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs inline-flex items-center gap-2 shadow-xs"
              >
                {connecting ? <Loader2 size={13} className="animate-spin" /> : <HardDrive size={13} />}
                <span>Authorize Google Drive</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Close
            </button>
            {isConnected && (
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            )}
          </div>
          <a
            href="/client/drive"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Open Drive Workspace</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

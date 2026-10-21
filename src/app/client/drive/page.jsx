'use client';

import React, { useState, useEffect } from 'react';
import { 
  HardDrive, Search, Plus, Sparkles, ExternalLink, RefreshCw, 
  Trash2, Eye, Clock, AlertCircle, CheckCircle2, 
  X, Loader2, ArrowRight, Folder, FolderPlus, Upload, 
  FileText, FileSpreadsheet, Presentation, File, ChevronRight, 
  Link2, Edit3, Download, Star, Grid, List
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GoogleAICommanderModal from '@/components/dashboard/GoogleAICommanderModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function GoogleDrivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [accountEmail, setAccountEmail] = useState('');
  const [viewLayout, setViewLayout] = useState('grid'); // grid or list
  
  // Folder Navigation History
  const [currentFolder, setCurrentFolder] = useState({ id: 'root', name: 'My Drive' });
  const [folderHistory, setFolderHistory] = useState([{ id: 'root', name: 'My Drive' }]);

  // Modals
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isAICommanderOpen, setIsAICommanderOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token')) : '';
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatusAndFiles = async (folderId = currentFolder.id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/google-drive/status/`, { headers: getHeaders() });
      if (res.data?.connected) {
        setIsConnected(true);
        setAccountEmail(res.data.email || 'Connected');
        fetchFolderFiles(folderId);
      } else {
        setIsConnected(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load Google Drive status:', err);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const fetchFolderFiles = async (folderId = currentFolder.id) => {
    try {
      const url = `${API_BASE_URL}/api/google-drive/files?folder_id=${folderId}&query=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(url, { headers: getHeaders() });
      setFiles(res.data?.files || []);
    } catch (err) {
      console.error('Failed to fetch Drive files:', err);
      showToast('Could not load files from Google Drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndFiles();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchFolderFiles(currentFolder.id);
    }
  }, [currentFolder, searchQuery, isConnected]);

  const handleConnect = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/google/connect-all`, { headers: getHeaders() });
      if (res.data?.url || res.data?.auth_url) {
        window.location.href = res.data.url || res.data.auth_url;
      }
    } catch (err) {
      showToast('Failed to start Google Drive connection', 'error');
    }
  };

  const handleOpenFolder = (folder) => {
    const nextHistory = [...folderHistory, folder];
    setFolderHistory(nextHistory);
    setCurrentFolder(folder);
  };

  const handleNavigateBreadcrumb = (index) => {
    const nextHistory = folderHistory.slice(0, index + 1);
    const target = nextHistory[nextHistory.length - 1];
    setFolderHistory(nextHistory);
    setCurrentFolder(target);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-drive/create-folder`,
        { 
          folder_name: newFolderName.trim(),
          parent_folder_id: currentFolder.id !== 'root' ? currentFolder.id : null,
        },
        { headers: getHeaders() }
      );
      if (res.data?.success) {
        showToast('Folder created in Google Drive!');
        setIsCreateFolderOpen(false);
        setNewFolderName('');
        fetchFolderFiles(currentFolder.id);
      } else {
        showToast(res.data?.error || 'Failed to create folder', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error creating folder', 'error');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!selectedUploadFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedUploadFile);
      if (currentFolder.id !== 'root') {
        formData.append('folder_id', currentFolder.id);
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/google-drive/upload`,
        formData,
        {
          headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data?.success) {
        showToast('File uploaded to Google Drive!');
        setIsUploadOpen(false);
        setSelectedUploadFile(null);
        fetchFolderFiles(currentFolder.id);
      } else {
        showToast(res.data?.error || 'Failed to upload file', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRenameFile = async (e) => {
    e.preventDefault();
    if (!targetItem || !renameValue.trim()) return;
    setRenaming(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/google-drive/rename`,
        {
          file_id: targetItem.id,
          new_name: renameValue.trim(),
        },
        { headers: getHeaders() }
      );

      if (res.data?.success) {
        showToast('Item renamed in Google Drive!');
        setIsRenameOpen(false);
        setTargetItem(null);
        fetchFolderFiles(currentFolder.id);
      } else {
        showToast(res.data?.error || 'Failed to rename item', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Error renaming item', 'error');
    } finally {
      setRenaming(false);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/google-drive/delete`,
        { file_id: item.id },
        { headers: getHeaders() }
      );
      showToast('Item moved to trash in Google Drive');
      setDeleteConfirmItem(null);
      fetchFolderFiles(currentFolder.id);
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to delete item', 'error');
    }
  };

  const getFileIcon = (file) => {
    const mime = file.mimeType || '';
    if (file.is_folder || mime.includes('folder')) {
      return <Folder size={20} className="text-amber-500 fill-amber-500/20" />;
    }
    if (mime.includes('presentation') || mime.includes('slides')) {
      return <Presentation size={20} className="text-amber-600" />;
    }
    if (mime.includes('spreadsheet') || mime.includes('sheets')) {
      return <FileSpreadsheet size={20} className="text-emerald-600" />;
    }
    if (mime.includes('document') || mime.includes('docs')) {
      return <FileText size={20} className="text-blue-600" />;
    }
    return <File size={20} className="text-slate-500" />;
  };

  const filtered = files.filter(f => {
    const mime = (f.mimeType || '').toLowerCase();
    if (activeTypeFilter === 'FOLDERS') return f.is_folder || mime.includes('folder');
    if (activeTypeFilter === 'DOCS') return mime.includes('document') || mime.includes('doc');
    if (activeTypeFilter === 'SHEETS') return mime.includes('spreadsheet') || mime.includes('sheet');
    if (activeTypeFilter === 'SLIDES') return mime.includes('presentation') || mime.includes('slide');
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div className={cn(
            "fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200",
            toast.type === 'error' 
              ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800" 
              : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
          )}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <HardDrive size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Google Drive
                </h1>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {accountEmail}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse Google Drive cloud storage, upload files, manage folders, and organize shared assets
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAICommanderOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles size={14} />
              <span>Workspace AI</span>
            </button>

            {isConnected && (
              <>
                <button
                  onClick={() => setIsCreateFolderOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <FolderPlus size={14} className="text-amber-500" />
                  <span>New Folder</span>
                </button>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Upload size={14} />
                  <span>Upload File</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disconnected State Hero */}
        {!isConnected && !loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
              <HardDrive size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Connect your Google Drive
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Securely browse files, folders, and shared assets in your real Google Drive account. Open Docs, Sheets, and Slides in their native workspaces seamlessly.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 size={16} />
                <span>Connect Google Drive</span>
              </button>
            </div>
          </div>
        )}

        {/* Connected Workspace */}
        {isConnected && (
          <div className="space-y-4">
            {/* Breadcrumb Folder Trail */}
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto shadow-xs">
              {folderHistory.map((folder, idx) => (
                <React.Fragment key={folder.id}>
                  {idx > 0 && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                  <button
                    onClick={() => handleNavigateBreadcrumb(idx)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                      idx === folderHistory.length - 1
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Folder size={13} className="text-amber-500 fill-amber-500/20" />
                    <span>{folder.name}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in Drive..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Type Pills & View Toggle */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {['ALL', 'FOLDERS', 'DOCS', 'SHEETS', 'SLIDES'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTypeFilter(type)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all capitalize",
                        activeTypeFilter === type
                          ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      )}
                    >
                      {type.toLowerCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setViewLayout('grid')}
                    className={cn(
                      "p-1.5 rounded-lg text-slate-500",
                      viewLayout === 'grid' && "bg-white dark:bg-slate-900 text-emerald-600 shadow-xs"
                    )}
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewLayout('list')}
                    className={cn(
                      "p-1.5 rounded-lg text-slate-500",
                      viewLayout === 'list' && "bg-white dark:bg-slate-900 text-emerald-600 shadow-xs"
                    )}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Files Grid / List */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading Google Drive contents...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mx-auto flex items-center justify-center">
                  <HardDrive size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Folder is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload files or create subfolders to organize your Google Drive storage.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload size={13} />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>
            ) : viewLayout === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((item) => {
                  const isFld = item.is_folder || (item.mimeType || '').includes('folder');
                  const mod = item.modified_time ? new Date(item.modified_time).toLocaleDateString() : 'Recently';

                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 p-4 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div 
                        onClick={() => {
                          if (isFld) {
                            handleOpenFolder(item);
                          } else if (item.url) {
                            window.open(item.url, '_blank');
                          }
                        }}
                        className="cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            {getFileIcon(item)}
                          </div>
                          {isFld && (
                            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                              Folder
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1 transition-colors">
                            {item.name || 'Untitled File'}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {mod}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Open in Google"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setTargetItem(item);
                              setRenameValue(item.name || '');
                              setIsRenameOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Rename"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List Layout */
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
                {filtered.map((item) => {
                  const isFld = item.is_folder || (item.mimeType || '').includes('folder');
                  const mod = item.modified_time ? new Date(item.modified_time).toLocaleDateString() : 'Recently';

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
                    >
                      <div 
                        onClick={() => {
                          if (isFld) {
                            handleOpenFolder(item);
                          } else if (item.url) {
                            window.open(item.url, '_blank');
                          }
                        }}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <div className="shrink-0">
                          {getFileIcon(item)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {isFld ? 'Folder' : mod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-1"
                          >
                            <ExternalLink size={12} />
                            <span>Open</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setTargetItem(item);
                            setRenameValue(item.name || '');
                            setIsRenameOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Folder Modal */}
        {isCreateFolderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FolderPlus size={16} className="text-amber-500" />
                  Create Folder in Google Drive
                </h3>
                <button onClick={() => setIsCreateFolderOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Folder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Client Proposals 2026"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateFolderOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingFolder}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {creatingFolder ? <Loader2 size={13} className="animate-spin" /> : <FolderPlus size={13} />}
                    <span>Create Folder</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload File Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Upload size={16} className="text-emerald-600" />
                  Upload File to Google Drive
                </h3>
                <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadFile} className="p-5 space-y-4">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2">
                  <Upload size={24} className="text-emerald-600 mx-auto" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Choose a file to upload to <span className="font-bold">{currentFolder.name}</span>
                  </p>
                  <input
                    type="file"
                    required
                    onChange={(e) => setSelectedUploadFile(e.target.files[0])}
                    className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedUploadFile || uploading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>Upload to Drive</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {isRenameOpen && targetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit3 size={15} className="text-blue-600" />
                  Rename Item
                </h3>
                <button onClick={() => setIsRenameOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRenameFile} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRenameOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={renaming}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    {renaming ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                    <span>Save Name</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Drive Item?</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  &quot;{deleteConfirmItem.name}&quot; will be moved to trash in your connected Google Drive.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteConfirmItem)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Commander Modal */}
        <GoogleAICommanderModal
          isOpen={isAICommanderOpen}
          onClose={() => setIsAICommanderOpen(false)}
          onActionCompleted={() => fetchFolderFiles(currentFolder.id)}
        />
      </div>
    </DashboardLayout>
  );
}

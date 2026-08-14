'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Plus, Eye, Edit2, Download, Send, Trash2, 
  ChevronLeft, ChevronRight, BarChart3, TrendingUp, DollarSign, 
  X, Check, ArrowRight, User, MoreHorizontal, Loader2, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import SalesDocumentPreviewModal from '@/components/sales/SalesDocumentPreviewModal';

const getStatusBadge = (status) => {
  const mapping = {
    'DRAFT': 'bg-slate-100 text-slate-700 border-slate-200',
    'SENT': 'bg-blue-50 text-blue-700 border-blue-200/50',
    'VIEWED': 'bg-violet-50 text-violet-750 border-violet-200/50',
    'ACCEPTED': 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    'REJECTED': 'bg-red-50 text-red-750 border-red-200/50',
    'CANCELLED': 'bg-slate-100 text-slate-450 border-slate-200',
  };
  return cn(
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize",
    mapping[status] || 'bg-slate-100 text-slate-600'
  );
};

const ProposalsPage = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Preview Modal State
  const [previewModalDoc, setPreviewModalDoc] = useState(null);

  // Send Modal State
  const [sendModalDoc, setSendModalDoc] = useState(null);
  const [sendChannel, setSendChannel] = useState('EMAIL');
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendSending, setSendSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let queryUrl = `${API_BASE_URL}/api/sales-documents/?document_type=PROPOSAL&page=${page}`;
      if (search) queryUrl += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) queryUrl += `&status=${statusFilter}`;

      const [docsResult, analyticsResult] = await Promise.allSettled([
        axios.get(queryUrl, { headers }),
        axios.get(`${API_BASE_URL}/api/sales/analytics/`, { headers })
      ]);

      if (docsResult.status === 'fulfilled' && docsResult.value?.data) {
        const docsData = docsResult.value.data;
        if (Array.isArray(docsData)) {
          setDocuments(docsData);
        } else if (docsData.results) {
          setDocuments(docsData.results);
          if (docsData.count) {
            setTotalPages(Math.ceil(docsData.count / 10) || 1);
          }
        }
      }

      if (analyticsResult.status === 'fulfilled' && analyticsResult.value?.data) {
        setAnalytics(analyticsResult.value.data);
      }
    } catch (err) {
      console.error("Error loading proposal data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleDownloadPDF = async (docId, docNum) => {
    const token = localStorage.getItem('token');
    const API_URL = API_BASE_URL;
    const downloadUrl = `${API_URL}/api/sales-documents/${docId}/pdf/`;
    try {
      const res = await axios.get(downloadUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${docNum || 'Proposal'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed, opening direct tab", err);
      window.open(`${downloadUrl}?token=${token}`, '_blank');
    }
  };

  const handleDuplicate = async (docId) => {
    setActionLoading(prev => ({ ...prev, [docId]: 'duplicate' }));
    const token = localStorage.getItem('token');
    const API_URL = API_BASE_URL;
    try {
      await axios.post(`${API_URL}/api/sales-documents/${docId}/duplicate/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to duplicate: " + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [docId]: null }));
    }
  };

  const handleOpenSendModal = (doc) => {
    setSendModalDoc(doc);
    setSendRecipient(doc.customer_email || '');
    setSendChannel('EMAIL');
  };

  const handleSendDocument = async () => {
    if (!sendRecipient) {
      if (sendChannel === 'EMAIL') {
        alert("Please enter a recipient email.");
      } else {
        alert("Please enter a recipient phone number.");
      }
      return;
    }
    setSendSending(true);
    const token = localStorage.getItem('token');
    const API_URL = API_BASE_URL;
    
    try {
      await axios.post(`${API_URL}/api/sales-documents/${sendModalDoc.id}/send/`, {
        channel: sendChannel,
        recipient: sendRecipient,
        phone: sendRecipient,
        frontend_url: window.location.origin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Proposal successfully sent!");
      setSendModalDoc(null);
      fetchData();
    } catch (err) {
      alert("Failed to send: " + (err.response?.data?.error || err.message));
    } finally {
      setSendSending(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    setActionLoading(prev => ({ ...prev, [docId]: 'delete' }));
    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      await axios.delete(`${API_URL}/api/sales-documents/${docId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [docId]: null }));
    }
  };

  const stats = analytics?.metrics || {
    total_count: 0,
    total_value: 0.00,
    accepted_value: 0.00,
    pending_value: 0.00,
    conversion_rate: 0
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20 space-y-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Business Proposals</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Scope of work, RFPs, and Pitches</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/client/proposals/templates')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Manage Templates</span>
            </button>
            <button
              onClick={() => router.push('/client/quotations/new?type=PROPOSAL')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Proposal</span>
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-655 shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pitches</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{documents.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Proposal Pipeline Value</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">${parseFloat(stats.total_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-650 flex items-center justify-center shrink-0">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acceptance Rates</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{stats.conversion_rate}%</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search proposals by customer, document number, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl border border-slate-200/60 focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex-1 sm:flex-none py-2 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                  showFilters ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <Filter size={13} />
                <span>Filters</span>
              </button>
              
              <button
                type="submit"
                className="flex-1 sm:flex-none py-2 px-5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Find
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Proposal Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="VIEWED">Viewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setSearch('');
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Proposals List Card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={24} />
              <span className="text-xs font-semibold">Loading proposals...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Proposals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Build scope sections, FAQ blocks, and custom pricings to wow your leads.
              </p>
              <button
                onClick={() => router.push('/client/quotations/new?type=PROPOSAL')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus size={12} />
                <span>Create Your First Proposal</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-medium">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className="p-4">Proposal Number</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Value Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4">Version</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{doc.document_number}</td>
                      <td className="p-4 font-bold">{doc.customer_name}</td>
                      <td className="p-4 text-slate-500">{doc.document_date}</td>
                      <td className="p-4 text-right font-black text-slate-950">
                        {doc.currency_symbol}{parseFloat(doc.grand_total).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={getStatusBadge(doc.status)}>{doc.status.toLowerCase()}</span>
                      </td>
                      <td className="p-4 text-center text-slate-400 font-bold">v{doc.version}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Interactive Executive Preview */}
                          <button
                            onClick={() => setPreviewModalDoc(doc)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Interactive Executive Preview"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Edit Proposal */}
                          <button
                            onClick={() => router.push(`/client/quotations/new?edit_id=${doc.id}&type=PROPOSAL`)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Edit Proposal"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(doc.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Download PDF Proposal"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            onClick={() => handleOpenSendModal(doc)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Send Proposal"
                          >
                            <Send size={13} />
                          </button>

                          {/* Action duplicates proposal */}
                          <button
                            onClick={() => handleDuplicate(doc.id)}
                            disabled={actionLoading[doc.id] === 'duplicate'}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer disabled:opacity-50"
                            title="Duplicate Proposal"
                          >
                            {actionLoading[doc.id] === 'duplicate' ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={actionLoading[doc.id] === 'delete'}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-405 hover:text-red-600 cursor-pointer disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading[doc.id] === 'delete' ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Send Modal */}
        {sendModalDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm">Send Proposal #{sendModalDoc.document_number}</h3>
                <button onClick={() => setSendModalDoc(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Dispatch Channel</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSendChannel('EMAIL');
                        setSendRecipient(sendModalDoc.customer_email || '');
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer",
                        sendChannel === 'EMAIL' ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-200 text-slate-655"
                      )}
                    >
                      Email Pitch
                    </button>
                    <button
                      onClick={() => {
                        setSendChannel('WHATSAPP');
                        setSendRecipient(sendModalDoc.customer_phone || '');
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer",
                        sendChannel === 'WHATSAPP' ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-200 text-slate-655"
                      )}
                    >
                      WhatsApp Link
                    </button>
                  </div>
                </div>

                {sendChannel === 'EMAIL' ? (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Customer Email</label>
                    <input
                      type="email"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Recipient Phone Number</label>
                    <input
                      type="text"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      placeholder="+15550199 (Include country code)"
                      className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Must include country code (e.g. +91 for India, +1 for US) without spaces.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-3">
                <button
                  onClick={() => setSendModalDoc(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendDocument}
                  disabled={sendSending}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {sendSending && <Loader2 size={13} className="animate-spin" />}
                  <span>{sendSending ? 'Sending...' : 'Send Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Executive Sales Document Preview Modal */}
        <SalesDocumentPreviewModal
          doc={previewModalDoc}
          isOpen={!!previewModalDoc}
          onClose={() => setPreviewModalDoc(null)}
          onSend={(d) => { setPreviewModalDoc(null); handleOpenSendModal(d); }}
        />

      </div>
    </DashboardLayout>
  );
};

export default ProposalsPage;

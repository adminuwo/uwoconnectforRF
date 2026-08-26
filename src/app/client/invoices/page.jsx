'use client';

import React, { useState, useEffect } from 'react';
import { 
  Receipt, Search, Filter, Eye, Download, Send, Trash2, ChevronLeft, 
  ChevronRight, BarChart3, TrendingUp, DollarSign, X, Check, ArrowRight,
  User, MoreHorizontal, Loader2, Sparkles, CreditCard, Ban, Settings, RefreshCw, Plus, Building2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import InvoicePreviewModal from '@/components/invoices/InvoicePreviewModal';
import { cn } from '@/lib/utils';
import InvoiceCreateModal from '@/components/invoices/InvoiceCreateModal';
import { API_BASE_URL } from '@/config/apiConfig';
import { SkeletonTableRows } from '@/components/common/LoadingSkeleton';

const getStatusBadge = (status) => {
  const mapping = {
    'PAID': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'GENERATED': 'bg-blue-50 text-blue-700 border-blue-200',
    'PENDING': 'bg-amber-50 text-amber-700 border-amber-200',
    'FAILED': 'bg-rose-50 text-rose-700 border-rose-200',
    'REFUNDED': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return cn(
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider",
    mapping[status] || 'bg-slate-100 text-slate-600 border-slate-200'
  );
};

export default function InvoicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Preview Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Branding Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsData, setSettingsData] = useState({
    invoice_prefix: 'INV',
    company_name: '',
    company_address: '',
    tax_id_gstin: '',
    company_logo_url: '',
    invoice_default_notes: 'Thank you for your business!',
    payment_terms: 'All payments processed via secure gateway.',
    invoice_footer: 'Computer generated official invoice.'
  });

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/invoices/`, { headers });
      setInvoices(res.data?.results || res.data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      // Fallback empty array
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/invoices/settings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettingsData(res.data || {});
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/invoices/settings/`, settingsData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Invoice branding settings saved!');
      setIsSettingsOpen(false);
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleDownloadPDF = async (inv) => {
    const token = localStorage.getItem('token');
    const downloadUrl = `${API_BASE_URL}/api/invoices/${inv.id}/download/`;
    try {
      const res = await axios.get(downloadUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${inv.invoice_number || 'Invoice'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice PDF download error", err);
      window.open(downloadUrl, '_blank');
    }
  };

  const handleRegenerate = async (inv) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/invoices/${inv.id}/regenerate/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Invoice PDF regenerated!');
      fetchInvoices();
    } catch (err) {
      showToast('Regeneration failed', 'error');
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = !search || 
      (inv.invoice_number && inv.invoice_number.toLowerCase().includes(search.toLowerCase())) ||
      (inv.billing_details?.name && inv.billing_details.name.toLowerCase().includes(search.toLowerCase())) ||
      (inv.order_id && inv.order_id.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStatus = !statusFilter || inv.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalPaid = invoices.filter(i => i.payment_status === 'PAID').reduce((sum, i) => sum + Number(i.total || 0), 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-extrabold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200 ${
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-6 h-6 text-emerald-600" />
              Automated Invoices
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Multi-channel automated invoice generation with multi-currency PDF downloads (INR, USD, EUR, GBP, etc.)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Branding & Settings
            </button>
            
            {/* Create Manual Invoice Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Manual Invoice
            </button>

            <button
              onClick={fetchInvoices}
              className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
              <span>Total Invoices Generated</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-950">{invoices.length}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-blue-800 mb-1">
              <span>Paid Invoices</span>
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-950">
              {invoices.filter(i => i.payment_status === 'PAID').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Total Revenue Processed</span>
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice #, customer, order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden text-slate-700 font-medium"
            >
              <option value="">All Payment Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-4">
              <SkeletonTableRows rows={6} cols={6} />
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Currency</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {inv.billing_details?.name || 'Valued Customer'}
                        {inv.billing_details?.email && (
                          <span className="block text-[10px] text-slate-400 font-normal">{inv.billing_details.email}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {inv.order_reference || inv.order_id || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {inv.currency || 'USD'} ({inv.currency_symbol || '$'})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {inv.currency_symbol || '$'}{Number(inv.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={getStatusBadge(inv.payment_status)}>
                          {inv.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : ''}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPreviewOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              No invoices found yet. Verified payments automatically generate invoices here!
            </div>
          )}
        </div>

        {/* Visual Preview Modal */}
        {isPreviewOpen && selectedInvoice && (
          <InvoicePreviewModal
            invoice={selectedInvoice}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            onRegenerate={handleRegenerate}
          />
        )}

        {/* Branding & Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Invoice Branding Settings
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Seller Name</label>
                  <input
                    type="text"
                    value={settingsData.company_name}
                    onChange={e => setSettingsData({ ...settingsData, company_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Acme Corporation Ltd"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Invoice Prefix</label>
                    <input
                      type="text"
                      value={settingsData.invoice_prefix}
                      onChange={e => setSettingsData({ ...settingsData, invoice_prefix: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                      placeholder="INV"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={settingsData.tax_id_gstin}
                      onChange={e => setSettingsData({ ...settingsData, tax_id_gstin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                      placeholder="e.g. 29ABCDE1234F1ZH"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Address</label>
                  <textarea
                    rows={2}
                    value={settingsData.company_address}
                    onChange={e => setSettingsData({ ...settingsData, company_address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                    placeholder="Street, City, Country"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Terms & Notes</label>
                  <textarea
                    rows={2}
                    value={settingsData.invoice_default_notes}
                    onChange={e => setSettingsData({ ...settingsData, invoice_default_notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                    placeholder="Thank you for your purchase!"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                  >
                    {settingsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Branding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Create Modal */}
        <InvoiceCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchInvoices();
            setIsCreateModalOpen(false);
            showToast('Manual invoice created successfully!');
          }}
        />

      </div>
    </DashboardLayout>
  );
}

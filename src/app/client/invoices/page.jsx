'use client';

import React, { useState, useEffect } from 'react';
import { 
  Receipt, Search, Filter, Eye, Download, Send, Trash2, ChevronLeft, 
  ChevronRight, BarChart3, TrendingUp, DollarSign, X, Check, ArrowRight,
  User, MoreHorizontal, Loader2, Sparkles, CreditCard, Ban, Settings, RefreshCw, Plus, Building2, AlertTriangle
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

  // Send Invoice Modal State
  const [sendModalInvoice, setSendModalInvoice] = useState(null);
  const [sendChannel, setSendChannel] = useState('WHATSAPP');
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendSending, setSendSending] = useState(false);

  // Delete Invoice Confirmation Modal State
  const [deleteConfirmInvoice, setDeleteConfirmInvoice] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    const token = localStorage.getItem('uwo_token');
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
    const token = localStorage.getItem('uwo_token');
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
    const token = localStorage.getItem('uwo_token');
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
    const token = localStorage.getItem('uwo_token');
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
    const token = localStorage.getItem('uwo_token');
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

  const handleOpenSendModal = (inv) => {
    setSendModalInvoice(inv);
    const billing = inv.billing_details || {};
    if (billing.phone) {
      setSendChannel('WHATSAPP');
      setSendRecipient(billing.phone);
    } else {
      setSendChannel('EMAIL');
      setSendRecipient(billing.email || '');
    }
  };

  const handleSendInvoice = async () => {
    if (!sendRecipient) {
      showToast(sendChannel === 'EMAIL' ? 'Please enter a recipient email' : 'Please enter a recipient phone number', 'error');
      return;
    }

    setSendSending(true);
    const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/invoices/${sendModalInvoice.id}/send/`, {
        channel: sendChannel,
        recipient: sendRecipient,
        phone: sendRecipient,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Invoice #${sendModalInvoice.invoice_number} sent successfully via ${sendChannel}!`);
      setSendModalInvoice(null);
    } catch (err) {
      console.warn("Failed to send invoice:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to send invoice';
      showToast(errMsg, 'error');
    } finally {
      setSendSending(false);
    }
  };

  const handleDirectWhatsAppWeb = (inv) => {
    if (!inv) return;
    const curSymbol = inv.currency_symbol || '$';
    const totalFormatted = Number(inv.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
    const seller = inv.seller_details || {};
    const companyName = seller.company_name || seller.business_name || settingsData.company_name || 'Our Company';
    const publicUrl = `https://uwoconnect.aisa24.com/public/invoice/${inv.secure_token}`;
    const phone = inv.billing_details?.phone ? inv.billing_details.phone.replace(/[^0-9]/g, '') : '';
    const msg = `Dear ${inv.billing_details?.name || 'Valued Customer'},\n\nYour invoice #${inv.invoice_number} from ${companyName} is ready.\n\nTotal Amount: ${curSymbol}${totalFormatted}\nPayment Status: ${inv.payment_status || 'PAID'}\n\nView and download your official invoice:\n${publicUrl}\n\nRegards,\n${companyName}`;
    const waUrl = phone 
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleDeleteInvoice = async () => {
    if (!deleteConfirmInvoice) return;
    setIsDeleting(true);
    const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/api/invoices/${deleteConfirmInvoice.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Invoice #${deleteConfirmInvoice.invoice_number} deleted successfully.`);
      if (selectedInvoice?.id === deleteConfirmInvoice.id) {
        setIsPreviewOpen(false);
        setSelectedInvoice(null);
      }
      setDeleteConfirmInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoice:', err);
      showToast(err.response?.data?.detail || err.response?.data?.error || 'Failed to delete invoice.', 'error');
    } finally {
      setIsDeleting(false);
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-full font-sans">
        
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
                            title="View Invoice Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          <button
                            onClick={() => handleOpenSendModal(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Send Invoice to Customer (WhatsApp / Email)"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="Download Official PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </button>

                          <button
                            onClick={() => setDeleteConfirmInvoice(inv)}
                            className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors text-[11px] font-bold flex items-center justify-center cursor-pointer shadow-2xs"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
            onSend={(inv) => handleOpenSendModal(inv)}
            onDelete={(inv) => setDeleteConfirmInvoice(inv)}
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

        {/* Invoice Preview Modal */}
        {selectedInvoice && (
          <InvoicePreviewModal
            invoice={selectedInvoice}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            onRegenerate={handleRegenerate}
            onSend={(inv) => {
              setIsPreviewOpen(false);
              handleOpenSendModal(inv);
            }}
          />
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

        {/* Send Invoice Modal Dialog */}
        {sendModalInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Send Invoice #{sendModalInvoice.invoice_number}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Customer: {sendModalInvoice.billing_details?.name || 'Valued Customer'}</p>
                </div>
                <button onClick={() => setSendModalInvoice(null)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Dispatch Channel</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSendChannel('WHATSAPP');
                        setSendRecipient(sendModalInvoice.billing_details?.phone || '');
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all",
                        sendChannel === 'WHATSAPP' ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      WhatsApp Message
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSendChannel('EMAIL');
                        setSendRecipient(sendModalInvoice.billing_details?.email || '');
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all",
                        sendChannel === 'EMAIL' ? "bg-slate-900 border-slate-900 text-white shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      Email Message
                    </button>
                  </div>
                </div>

                {sendChannel === 'WHATSAPP' ? (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Recipient Phone Number</label>
                    <input
                      type="text"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      placeholder="+919876543210 (Include country code)"
                      className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Must include country code (e.g. +91 for India, +1 for US) without spaces.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Recipient Email Address</label>
                    <input
                      type="email"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Quick WhatsApp Web fallback */}
              {sendChannel === 'WHATSAPP' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between gap-2">
                  <div className="text-[11px] text-emerald-900 font-medium">
                    Or dispatch via your WhatsApp Web directly:
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDirectWhatsAppWeb(sendModalInvoice)}
                    className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer shadow-2xs transition-colors"
                  >
                    Open Web Chat
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSendModalInvoice(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvoice}
                  disabled={sendSending}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  {sendSending && <Loader2 size={13} className="animate-spin" />}
                  <span>{sendSending ? 'Sending...' : 'Send Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Invoice Confirmation Modal */}
        {deleteConfirmInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Delete Invoice?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Are you sure you want to permanently delete invoice <span className="font-bold text-slate-800">#{deleteConfirmInvoice.invoice_number}</span>? This will remove all records and physical invoice documents associated with it. This action cannot be undone.
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-5 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-bold text-slate-800">{deleteConfirmInvoice.billing_details?.name || 'Valued Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Amount:</span>
                    <span className="font-black text-slate-900">{deleteConfirmInvoice.currency_symbol || '$'}{Number(deleteConfirmInvoice.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-700">{deleteConfirmInvoice.payment_status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmInvoice(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteInvoice}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Download, Printer, Share2, CheckCircle2, Clock, Building2, FileText, Loader2, AlertTriangle, Copy } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

export default function PublicInvoicePage() {
  const params = useParams();
  const token = params?.token;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchPublicInvoice = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/public/invoices/${token}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Failed to load public invoice:", err);
        setError(err.response?.data?.detail || "Invoice unavailable or expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicInvoice();
  }, [token]);

  const handleDownloadPDF = () => {
    if (!token) return;
    const pdfUrl = `${API_BASE_URL}/api/public/invoices/${token}/pdf`;
    window.open(pdfUrl, '_blank');
  };

  const handlePrint = () => {
    if (!invoice) return;
    const seller = invoice.seller_details || {};
    const billing = invoice.billing_details || {};
    const items = invoice.line_items || [];
    const curSymbol = invoice.currency_symbol || '$';
    const curCode = invoice.currency || 'USD';
    const subtotal = Number(invoice.subtotal || invoice.total || 0);
    const discount = Number(invoice.discount || 0);
    const shipping = Number(invoice.shipping || 0);
    const tax = Number(invoice.tax || 0);
    const total = Number(invoice.total || 0);
    const amountPaid = Number(invoice.amount_paid || (invoice.payment_status === 'PAID' ? total : 0));
    const balanceDue = Number(invoice.balance_due || (total - amountPaid));

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = 'none';
    document.body.appendChild(printIframe);

    const iframeDoc = printIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${invoice.invoice_number || ''}</title>
<style>
  @page { size: A4; margin: 12mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; font-size: 11px; line-height: 1.5; background: white; padding: 0; }
  .invoice-wrapper { width: 100%; max-width: 100%; padding: 0; }
  .header-row { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; gap: 24px; }
  .company-section { max-width: 55%; }
  .company-logo { height: 44px; max-width: 180px; object-fit: contain; margin-bottom: 4px; }
  .company-name-fallback { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 2px; }
  .company-name { font-weight: 800; font-size: 12px; color: #0f172a; }
  .company-details { font-size: 9px; color: #64748b; line-height: 1.6; }
  .company-details .gstin { font-weight: 700; color: #334155; }
  .invoice-meta { text-align: right; }
  .invoice-title { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .invoice-num { font-size: 10px; font-weight: 700; color: #1e293b; }
  .invoice-detail { font-size: 9px; color: #64748b; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; }
  .status-paid { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
  .status-other { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
  .bill-to-card { margin: 16px 0; background: #f8fafc; border-radius: 8px; padding: 12px 14px; border: 1px solid #e2e8f0; }
  .bill-to-label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 2px; }
  .bill-to-name { font-weight: 900; font-size: 13px; color: #0f172a; }
  .bill-to-detail { font-size: 10px; color: #475569; margin-top: 1px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
  thead tr { background: #f1f5f9; }
  th { padding: 8px 10px; font-size: 10px; font-weight: 900; color: #334155; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th.right { text-align: right; }
  th.center { text-align: center; }
  td { padding: 8px 10px; font-size: 10px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  td.center { text-align: center; }
  td.right { text-align: right; }
  td.bold { font-weight: 700; color: #0f172a; }
  .sku-text { font-size: 8px; color: #94a3b8; font-family: monospace; }
  .summary-section { display: flex; justify-content: flex-end; margin: 16px 0; }
  .summary-table { width: 260px; }
  .summary-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 10px; color: #475569; }
  .summary-row.total { padding-top: 8px; margin-top: 4px; border-top: 2px solid #059669; font-size: 13px; font-weight: 900; color: #0f172a; }
  .summary-row.total .value { color: #059669; }
  .summary-row .value { font-weight: 600; }
  .summary-row .bold-value { font-weight: 700; color: #059669; }
  .payment-card { margin: 16px 0; background: #f8fafc; border-radius: 8px; padding: 12px 14px; border: 1px solid #e2e8f0; }
  .payment-title { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
  .payment-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; }
  .payment-item-label { font-size: 9px; font-weight: 700; color: #94a3b8; }
  .payment-item-value { font-size: 10px; font-weight: 600; color: #334155; }
  .payment-item-value.status { font-weight: 900; color: #059669; }
  .footer-section { padding-top: 14px; margin-top: 10px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; }
  .footer-section .thanks { font-weight: 700; color: #334155; margin-bottom: 2px; }
</style>
</head>
<body>
<div class="invoice-wrapper">
  <div class="header-row">
    <div class="company-section">
      ${(seller.company_logo_url || seller.logo_url) ? `<img src="${seller.company_logo_url || seller.logo_url}" class="company-logo" alt="Logo" onerror="this.style.display='none'" />` : `<div class="company-name-fallback">${seller.company_name || seller.business_name || 'Company Name'}</div>`}
      <div class="company-name">${seller.company_name || seller.business_name || 'Company Name'}</div>
      <div class="company-details">
        ${seller.address ? `${seller.address}<br/>` : ''}
        ${seller.email ? `Email: ${seller.email}<br/>` : ''}
        ${seller.phone ? `Phone: ${seller.phone}<br/>` : ''}
        ${seller.tax_id_gstin ? `<span class="gstin">GSTIN / Tax ID: ${seller.tax_id_gstin}</span>` : ''}
      </div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-num">#${invoice.invoice_number}</div>
      <div class="invoice-detail">Date: ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}</div>
      <div class="invoice-detail">Order ID: ${invoice.order_reference || invoice.order_id || 'N/A'}</div>
      <span class="status-badge ${invoice.payment_status === 'PAID' ? 'status-paid' : 'status-other'}">${invoice.payment_status}</span>
    </div>
  </div>

  <div class="bill-to-card">
    <div class="bill-to-label">BILL TO</div>
    <div class="bill-to-name">${billing.name || 'Valued Customer'}</div>
    ${billing.email ? `<div class="bill-to-detail">Email: ${billing.email}</div>` : ''}
    ${billing.phone ? `<div class="bill-to-detail">Phone: ${billing.phone}</div>` : ''}
    ${billing.address ? `<div class="bill-to-detail">Address: ${billing.address}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th class="center" style="width:50px">Qty</th>
        <th class="right" style="width:100px">Unit Price (${curCode})</th>
        <th class="right" style="width:90px">Tax (${curCode})</th>
        <th class="right" style="width:100px">Line Total (${curCode})</th>
      </tr>
    </thead>
    <tbody>
      ${(items.length > 0 ? items : [{ name: 'Product Purchase', quantity: 1, unit_price: subtotal, tax: 0, total: subtotal }]).map(item => `
        <tr>
          <td class="bold">
            ${item.name || item.product_name || 'Product'}
            ${item.sku ? `<br/><span class="sku-text">SKU: ${item.sku}</span>` : ''}
          </td>
          <td class="center">${item.quantity || 1}</td>
          <td class="right">${curSymbol}${Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td class="right">${curSymbol}${Number(item.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td class="right bold">${curSymbol}${Number(item.total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary-section">
    <div class="summary-table">
      <div class="summary-row"><span>Subtotal:</span><span class="value">${curSymbol}${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
      ${discount > 0 ? `<div class="summary-row"><span>Discount:</span><span class="value">-${curSymbol}${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>` : ''}
      ${shipping > 0 ? `<div class="summary-row"><span>Shipping:</span><span class="value">${curSymbol}${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>` : ''}
      ${tax > 0 ? `<div class="summary-row"><span>Tax / GST:</span><span class="value">${curSymbol}${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>` : ''}
      <div class="summary-row total"><span>Grand Total:</span><span class="value">${curSymbol}${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${curCode}</span></div>
      <div class="summary-row"><span>Amount Paid:</span><span class="bold-value">${curSymbol}${amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
      <div class="summary-row"><span>Balance Due:</span><span class="value" style="font-weight:700;color:#0f172a">${curSymbol}${balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    </div>
  </div>

  <div class="payment-card">
    <div class="payment-title">PAYMENT INFORMATION</div>
    <div class="payment-grid">
      <div><div class="payment-item-label">STATUS</div><div class="payment-item-value status">${invoice.payment_status}</div></div>
      <div><div class="payment-item-label">METHOD</div><div class="payment-item-value">${invoice.payment_method || 'Card/Online'}</div></div>
      <div><div class="payment-item-label">PAYMENT DATE</div><div class="payment-item-value">${invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString() : (invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A')}</div></div>
      <div><div class="payment-item-label">TXN / PAYMENT ID</div><div class="payment-item-value" style="font-family:monospace;font-size:9px">${invoice.transaction_id || invoice.payment_id || 'N/A'}</div></div>
    </div>
  </div>

  <div class="footer-section">
    <div class="thanks">Thank you for your business!</div>
    <div>All payments are securely processed and verified via UWOConnect Multi-Channel Integration.</div>
  </div>
</div>
</body>
</html>`);
    iframeDoc.close();

    printIframe.contentWindow.onafterprint = () => {
      document.body.removeChild(printIframe);
    };

    setTimeout(() => {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 5000);
    }, 500);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (!invoice || typeof window === 'undefined') return;
    const seller = invoice.seller_details || {};
    const companyName = seller.company_name || seller.business_name || 'Company';
    const curSymbol = invoice.currency_symbol || '$';
    const total = Number(invoice.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    const msg = `Your invoice from ${companyName} is ready.\n\nInvoice: #${invoice.invoice_number}\nAmount: ${curSymbol}${total}\n\nView and download your invoice:\n${window.location.href}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={36} />
        <span className="text-sm font-bold text-slate-600">Loading invoice...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-lg space-y-4">
          <AlertTriangle size={48} className="mx-auto text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Invoice Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{error || "The requested invoice could not be found."}</p>
          <button
            onClick={() => window.location.reload()}
            className="py-2.5 px-6 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const seller = invoice.seller_details || {};
  const billing = invoice.billing_details || {};
  const items = invoice.line_items || [];
  const curSymbol = invoice.currency_symbol || '$';
  const curCode = invoice.currency || 'USD';

  const subtotal = Number(invoice.subtotal || invoice.total || 0);
  const discount = Number(invoice.discount || 0);
  const shipping = Number(invoice.shipping || 0);
  const tax = Number(invoice.tax || 0);
  const total = Number(invoice.total || 0);
  const amountPaid = Number(invoice.amount_paid || (invoice.payment_status === 'PAID' ? total : 0));
  const balanceDue = Number(invoice.balance_due || (total - amountPaid));

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans text-slate-800">

      {/* Top Action Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between z-40 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          {seller.company_logo_url || seller.logo_url ? (
            <img 
              src={seller.company_logo_url || seller.logo_url} 
              alt={seller.company_name} 
              className="h-8 max-w-[160px] object-contain" 
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
              {(seller.company_name || 'U').charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">{seller.company_name || seller.business_name || 'Invoice Portal'}</h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">INVOICE PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Copy size={13} />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Download size={13} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer hidden md:inline-flex"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* Main Document Body Card */}
      <main className="max-w-4xl mx-auto mt-6 px-4 print:p-0 print:m-0 print:max-w-none">
        <div id="public-printable-invoice" className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-12 print:shadow-none print:border-none print:p-0">
          
          {/* Top Header: Logo + Company Info (TOP-LEFT) & Meta (TOP-RIGHT) */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200 gap-6">
            <div className="space-y-1.5 max-w-sm">
              {seller.company_logo_url || seller.logo_url ? (
                <img 
                  src={seller.company_logo_url || seller.logo_url} 
                  alt={seller.company_name} 
                  className="h-12 max-w-[200px] object-contain mb-1" 
                />
              ) : (
                <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  {seller.company_name || seller.business_name || 'Company Name'}
                </div>
              )}
              
              <div className="text-xs text-slate-500 font-medium space-y-0.5">
                <p className="font-bold text-slate-900">{seller.company_name || seller.business_name || 'Company Name'}</p>
                {seller.address && <p>{seller.address}</p>}
                {seller.email && <p>Email: {seller.email}</p>}
                {seller.phone && <p>Phone: {seller.phone}</p>}
                {seller.tax_id_gstin && (
                  <p className="font-semibold text-slate-700">GSTIN / Tax ID: {seller.tax_id_gstin}</p>
                )}
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-2xl font-black tracking-tight text-slate-900 block">INVOICE</span>
              <p className="text-xs font-bold text-slate-800">#{invoice.invoice_number}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                Date: {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Order ID: {invoice.order_reference || invoice.order_id || 'N/A'}
              </p>

              <div className="pt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${
                  invoice.payment_status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {invoice.payment_status === 'PAID' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {invoice.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To Customer Grid */}
          <div className="my-6 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">BILL TO</span>
            <h4 className="font-extrabold text-slate-900 text-sm">{billing.name || 'Valued Customer'}</h4>
            {billing.email && <p className="text-slate-600 mt-0.5">Email: {billing.email}</p>}
            {billing.phone && <p className="text-slate-600 mt-0.5">Phone: {billing.phone}</p>}
            {billing.address && <p className="text-slate-500 mt-0.5">Address: {billing.address}</p>}
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-2 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-32">Unit Price ({curCode})</th>
                  <th className="py-2.5 px-3 text-right w-28">Tax ({curCode})</th>
                  <th className="py-2.5 px-3 text-right w-32">Line Total ({curCode})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {item.name || item.product_name || 'Product'}
                        {item.sku && <span className="block text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600">{item.quantity || 1}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{curSymbol}{Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{curSymbol}{Number(item.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{curSymbol}{Number(item.total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900">Product Purchase</td>
                    <td className="py-3 px-2 text-center text-slate-600">1</td>
                    <td className="py-3 px-3 text-right text-slate-600">{curSymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-right text-slate-600">{curSymbol}0.00</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{curSymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end my-6">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium">{curSymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{curSymbol}{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span>{curSymbol}{shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax / GST:</span>
                  <span>{curSymbol}{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="text-emerald-700">{curSymbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {curCode}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-700">{curSymbol}{amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Balance Due:</span>
                <span className="font-bold text-slate-900">{curSymbol}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Dedicated Payment Information Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 my-6">
            <h5 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] text-slate-500">PAYMENT INFORMATION</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">STATUS</span>
                <span className="font-extrabold text-emerald-700">{invoice.payment_status}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">METHOD</span>
                <span>{invoice.payment_method || 'Card/Online'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">PAYMENT DATE</span>
                <span>{invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString() : (invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">TXN / PAYMENT ID</span>
                <span className="font-mono text-[11px]">{invoice.transaction_id || invoice.payment_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Footer / Notes */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Thank you for your business!</p>
            <p>All payments are securely processed and verified via UWOConnect Multi-Channel Integration.</p>
          </div>

        </div>
      </main>
    </div>
  );
}

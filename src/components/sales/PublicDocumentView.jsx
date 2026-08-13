'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Check, X, Shield, Clock, AlertTriangle, 
  Share2, Copy, Printer, Send, Loader2, Sparkles, CheckCircle2, DollarSign, Building2
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, getPublicDocumentUrl } from '@/config/apiConfig';

export default function PublicDocumentView({ token, documentTypeHint = 'proposal' }) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accept Modal
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptName, setAcceptName] = useState('');
  const [acceptEmail, setAcceptEmail] = useState('');
  const [acceptComment, setAcceptComment] = useState('');
  const [submittingAccept, setSubmittingAccept] = useState(false);

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Pricing');
  const [rejectComment, setRejectComment] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // UI Toast Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [successAction, setSuccessAction] = useState(null);

  useEffect(() => {
    if (token) {
      fetchDocument();
    }
  }, [token]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/public/sales-documents/${token}/`);
      setDoc(res.data);
      if (res.data.customer_name) setAcceptName(res.data.customer_name);
      if (res.data.customer_email) setAcceptEmail(res.data.customer_email);
    } catch (err) {
      setError(err.response?.data?.error || "This document could not be loaded or the link is invalid.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const downloadUrl = `${API_BASE_URL}/api/public/sales-documents/${token}/pdf/`;
    try {
      const res = await axios.get(downloadUrl, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc?.document_number || 'Document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download via blob failed", err);
      window.open(downloadUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    const type = doc?.document_type ? doc.document_type.toLowerCase() : documentTypeHint;
    const publicUrl = getPublicDocumentUrl(type, token);
    navigator.clipboard.writeText(publicUrl);
    showToast("Public link copied");
  };

  const handleWhatsAppShare = () => {
    const type = (doc?.document_type || documentTypeHint).toLowerCase();
    const publicUrl = getPublicDocumentUrl(type, token);
    const companyName = doc?.client_details?.business_name || doc?.client?.business_name || "Company";
    const customerName = doc?.customer_name || "Valued Customer";
    const docNum = doc?.document_number || "";
    const currency = doc?.currency_symbol || "₹";
    const total = doc?.grand_total || "0.00";
    let messageText = "";

    if (type === 'proposal') {
      messageText = `Dear ${customerName},\n\nPlease find your proposal #${docNum} from ${companyName} for your review.\n\nTotal Amount: ${currency}${total}\nValidity: ${doc?.valid_until || 'N/A'}\n\nView, download, accept, or reject the proposal:\n${publicUrl}\n\nRegards,\n${companyName}`;
    } else if (type === 'quotation' || type === 'quote') {
      messageText = `Dear ${customerName},\n\nPlease find quotation #${docNum} from ${companyName}.\n\nTotal Amount: ${currency}${total}\n\nView and download the quotation:\n${publicUrl}\n\nRegards,\n${companyName}`;
    } else if (type === 'invoice') {
      const statusText = doc?.status ? doc.status.toUpperCase() : 'UNPAID';
      messageText = `Dear ${customerName},\n\nYour invoice #${docNum} from ${companyName} is ready.\n\nAmount: ${currency}${total}\nPayment Status: ${statusText}\n\nView and download your invoice:\n${publicUrl}\n\nRegards,\n${companyName}`;
    } else {
      messageText = `Dear ${customerName},\n\nPlease review document #${docNum} from ${companyName}:\n${publicUrl}`;
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  const handlePrint = () => {
    if (!doc) return;

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

    const compSnapshot = doc.company_details && doc.company_details.business_name ? doc.company_details : (doc.client_details || doc.client || {});
    const logoUrl = compSnapshot.company_logo_url || compSnapshot.logo_url || '';
    const companyName = compSnapshot.business_name || compSnapshot.company_name || 'Company Name';
    const companyPhone = compSnapshot.phone_number || compSnapshot.phone || '';
    const companyAddress = compSnapshot.address || '';
    const companyEmail = compSnapshot.email || '';
    const companyGstin = compSnapshot.tax_id_gstin || doc.tax_number || '';

    const docType = (doc.document_type || documentTypeHint).toUpperCase();
    const isProposal = docType === 'PROPOSAL';
    const title = isProposal ? 'PROPOSAL' : docType === 'INVOICE' ? 'INVOICE' : 'QUOTATION';
    const docNum = doc.document_number || 'Document';
    const curSymbol = doc.currency_symbol || '₹';
    const curCode = doc.currency || 'INR';

    const items = doc.items || [];
    const sections = doc.proposal_sections || [
      { title: '1. Executive Summary', content: 'This proposal outlines our strategic solution, technical scope, and commercial terms.' },
      { title: '2. Scope of Work & Deliverables', content: 'Custom project development, testing, integration, and training.' },
      { title: '3. Project Timeline & Milestones', content: 'Phase 1: Discovery (Week 1-2)\nPhase 2: Execution (Week 3-6)\nPhase 3: Deployment & Handover (Week 7)' },
      { title: '4. Terms & Warranty Support', content: 'Includes 12 months SLA support and dedicated account manager.' }
    ];

    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title} ${docNum}</title>
<style>
  @page { size: A4; margin: 12mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; font-size: 11px; line-height: 1.5; background: white; padding: 0; }
  .doc-container { width: 100%; max-width: 100%; padding: 0; }
  .header-row { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; gap: 24px; }
  .company-box { max-width: 55%; }
  .company-logo { height: 48px; max-width: 200px; object-fit: contain; margin-bottom: 6px; }
  .company-name { font-weight: 900; font-size: 18px; color: #0f172a; margin-bottom: 2px; }
  .company-details { font-size: 9px; color: #64748b; line-height: 1.6; }
  .company-details .gstin { font-weight: 700; color: #334155; }
  .meta-box { text-align: right; }
  .doc-title { font-size: 22px; font-weight: 900; color: ${isProposal ? '#4f46e5' : '#059669'}; letter-spacing: -0.5px; }
  .doc-num { font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 2px; }
  .doc-date { font-size: 9px; color: #64748b; margin-top: 2px; }
  
  .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; background: #f8fafc; padding: 12px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 10px; }
  .party-label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 3px; }
  .party-name { font-size: 13px; font-weight: 900; color: #0f172a; }
  .party-detail { color: #475569; margin-top: 1px; }

  .section-title { font-size: 13px; font-weight: 800; color: #0f172a; border-left: 4px solid ${isProposal ? '#4f46e5' : '#059669'}; padding-left: 8px; margin: 16px 0 6px 0; }
  .section-content { font-size: 10px; color: #334155; line-height: 1.6; padding-left: 12px; white-space: pre-line; }

  table { width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
  thead tr { background: #f1f5f9; }
  th { padding: 8px 10px; font-size: 10px; font-weight: 900; color: #334155; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th.right { text-align: right; }
  th.center { text-align: center; }
  td { padding: 8px 10px; font-size: 10px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  td.center { text-align: center; }
  td.right { text-align: right; }
  td.bold { font-weight: 700; color: #0f172a; }

  .total-box { text-align: right; margin: 12px 0; font-size: 14px; font-weight: 900; color: ${isProposal ? '#4f46e5' : '#059669'}; }
  
  .summary-section { display: flex; justify-content: flex-end; margin: 16px 0; }
  .summary-table { width: 260px; }
  .summary-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 10px; color: #475569; }
  .summary-row.total { padding-top: 8px; margin-top: 4px; border-top: 2px solid ${isProposal ? '#4f46e5' : '#059669'}; font-size: 13px; font-weight: 900; color: #0f172a; }
  .summary-row.total .value { color: ${isProposal ? '#4f46e5' : '#059669'}; }

  .signature-box { margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
  .sig-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 4px; }
  .sig-desc { font-size: 9px; color: #64748b; margin-bottom: 16px; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 10px; }
  .sig-line { height: 40px; border-bottom: 1px dashed #cbd5e1; margin: 8px 0; }

  .terms-box { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9.5px; color: #64748b; }
  .terms-title { font-weight: 800; color: #1e293b; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="doc-container">
  <div class="header-row">
    <div class="company-box">
      ${logoUrl ? `<img src="${logoUrl}" class="company-logo" alt="Logo" onerror="this.style.display='none'" />` : `<div class="company-name">${companyName}</div>`}
      <div class="company-name">${companyName}</div>
      <div class="company-details">
        ${companyAddress ? `${companyAddress}<br/>` : ''}
        ${companyEmail ? `Email: ${companyEmail}<br/>` : ''}
        ${companyPhone ? `Phone: ${companyPhone}<br/>` : ''}
        ${companyGstin ? `<span class="gstin">GSTIN / Tax ID: ${companyGstin}</span>` : ''}
      </div>
    </div>
    <div class="meta-box">
      <div class="doc-title">${title}</div>
      <div class="doc-num">#${docNum}</div>
      <div class="doc-date">Date: ${doc.document_date || new Date().toLocaleDateString()}</div>
      ${doc.valid_until ? `<div class="doc-date">Valid Until: ${doc.valid_until}</div>` : ''}
    </div>
  </div>

  <div class="party-grid">
    <div>
      <div class="party-label">PREPARED FOR</div>
      <div class="party-name">${doc.customer_name || 'Valued Customer'}</div>
      ${doc.customer_company ? `<div class="party-detail">${doc.customer_company}</div>` : ''}
      ${doc.customer_email || doc.customer_phone ? `<div class="party-detail">${doc.customer_email || doc.customer_phone}</div>` : ''}
    </div>
    <div>
      <div class="party-label">PREPARED BY</div>
      <div class="party-name">${companyName}</div>
      ${companyAddress ? `<div class="party-detail">${companyAddress}</div>` : ''}
      ${companyEmail ? `<div class="party-detail">${companyEmail}</div>` : ''}
    </div>
  </div>

  ${isProposal ? `
    ${sections.map(sec => `
      <div class="section-title">${sec.title}</div>
      <div class="section-content">${sec.content}</div>
    `).join('')}

    ${items.length > 0 ? `
      <div class="section-title" style="margin-top:20px">Commercial Investment Table</div>
      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th class="center" style="width:60px">Qty</th>
            <th class="right" style="width:110px">Unit Price (${curCode})</th>
            <th class="right" style="width:110px">Total (${curCode})</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td class="bold">${item.name}</td>
              <td class="center">${item.quantity}</td>
              <td class="right">${curSymbol}${Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td class="right bold">${curSymbol}${Number(item.line_total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="total-box">
        Total Investment: ${curSymbol}${Number(doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${curCode}
      </div>
    ` : ''}

    <div class="signature-box">
      <div class="sig-title">Acceptance & Authorization</div>
      <div class="sig-desc">By signing, the client accepts the proposed scope of work and commercial investment structure.</div>
      <div class="sig-grid">
        <div>
          <b>Customer Representative Signature:</b>
          <div class="sig-line"></div>
          <div>Date: ________________________</div>
        </div>
        <div>
          <b>Authorized Partner Signature:</b>
          <div class="sig-line"></div>
          <div>Date: ________________________</div>
        </div>
      </div>
    </div>
  ` : `
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
        ${items.map(item => `
          <tr>
            <td class="bold">${item.name}</td>
            <td class="center">${item.quantity}</td>
            <td class="right">${curSymbol}${Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="right">${curSymbol}${Number(item.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="right bold">${curSymbol}${Number(item.line_total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="summary-section">
      <div class="summary-table">
        <div class="summary-row"><span>Subtotal:</span><span class="value">${curSymbol}${Number(doc.subtotal || doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
        ${Number(doc.discount_amount || 0) > 0 ? `<div class="summary-row"><span>Discount:</span><span class="value">-${curSymbol}${Number(doc.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>` : ''}
        ${Number(doc.tax_amount || 0) > 0 ? `<div class="summary-row"><span>Tax / GST:</span><span class="value">${curSymbol}${Number(doc.tax_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>` : ''}
        <div class="summary-row total"><span>Grand Total:</span><span class="value">${curSymbol}${Number(doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${curCode}</span></div>
      </div>
    </div>

    <div class="terms-box">
      <div class="terms-title">Terms & Conditions:</div>
      <div>${(doc.terms_conditions || '1. Valid for 15 days from issue date.\\n2. Goods once sold subject to standard terms.').replace(/\\n/g, '<br/>')}</div>
    </div>
  `}
</div>
</body>
</html>`);
    iframeDoc.close();

    const triggerPrint = () => {
      try {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
      } catch (err) {
        console.error("Print execution failed:", err);
      }
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 1000);
    };

    const images = iframeDoc.getElementsByTagName('img');
    if (images.length > 0) {
      let loaded = 0;
      const onImgLoad = () => {
        loaded++;
        if (loaded >= images.length) triggerPrint();
      };
      for (let i = 0; i < images.length; i++) {
        if (images[i].complete) loaded++;
        else {
          images[i].onload = onImgLoad;
          images[i].onerror = onImgLoad;
        }
      }
      if (loaded >= images.length) triggerPrint();
    } else {
      setTimeout(triggerPrint, 300);
    }
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    if (!acceptName || !acceptEmail) {
      alert("Name and Email are required.");
      return;
    }
    setSubmittingAccept(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/public/sales-documents/${token}/accept/`, {
        name: acceptName,
        email: acceptEmail,
        comment: acceptComment
      });
      setDoc(res.data);
      setSuccessAction('ACCEPTED');
      setShowAcceptModal(false);
      showToast("Document accepted successfully!");
    } catch (err) {
      alert("Failed to accept: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingAccept(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReject(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/public/sales-documents/${token}/reject/`, {
        reason: rejectReason,
        comment: rejectComment
      });
      setDoc(res.data);
      setSuccessAction('REJECTED');
      setShowRejectModal(false);
      showToast("Rejection recorded.");
    } catch (err) {
      alert("Failed to record rejection: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingReject(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-slate-600" size={32} />
        <span className="text-sm font-semibold text-slate-500">Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-lg space-y-4">
          <AlertTriangle size={48} className="mx-auto text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Document Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{error}</p>
          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-6 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAccepted = doc.status === 'ACCEPTED' || doc.status === 'CONVERTED';
  const isRejected = doc.status === 'REJECTED';
  const isExpired = doc.status === 'EXPIRED';

  const docType = (doc.document_type || documentTypeHint).toUpperCase();
  const docTypeLabel = docType === 'PROPOSAL' ? 'PROPOSAL' : docType === 'INVOICE' ? 'INVOICE' : 'QUOTATION';

  const compSnapshot = doc.company_details && doc.company_details.business_name ? doc.company_details : (doc.client_details || doc.client || {});
  const logoUrl = compSnapshot.company_logo_url || compSnapshot.logo_url || '';
  const companyName = compSnapshot.business_name || compSnapshot.company_name || 'Company Name';
  const companyPhone = compSnapshot.phone_number || compSnapshot.phone || '';
  const companyAddress = compSnapshot.address || '';
  const companyEmail = compSnapshot.email || '';
  const companyGstin = compSnapshot.tax_id_gstin || '';
  const companyWebsite = compSnapshot.website || '';

  const items = doc.items || [];
  const sections = doc.proposal_sections || [
    { title: '1. Executive Summary', content: 'This proposal outlines our strategic solution, technical scope, and commercial terms.' },
    { title: '2. Scope of Work & Deliverables', content: 'Custom project development, testing, integration, and training.' },
    { title: '3. Project Timeline & Milestones', content: 'Phase 1: Discovery (Week 1-2)\nPhase 2: Execution (Week 3-6)\nPhase 3: Deployment & Handover (Week 7)' },
    { title: '4. Terms & Warranty Support', content: 'Includes 12 months SLA support and dedicated account manager.' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Action Bar (Sticky Header) */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between z-40 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-8 max-w-[160px] object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">{companyName}</h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">{docTypeLabel} PORTAL</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Copy Public Link"
          >
            <Copy size={13} />
            <span className="hidden sm:inline">Copy Link</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
            title="Share via WhatsApp"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer hidden md:inline-flex"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
          
          {(docType === 'PROPOSAL' || docType === 'QUOTATION') && !isAccepted && !isRejected && !isExpired && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={() => setShowAcceptModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
              >
                Accept
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto mt-6 px-4 md:px-0">
        
        {/* Status Alert Banner */}
        {isAccepted && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>This document was accepted on {doc.accepted_at ? new Date(doc.accepted_at).toLocaleDateString() : 'Record'} by {doc.accepted_by_name || 'Customer'}.</span>
          </div>
        )}
        {isRejected && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
            <X size={16} className="text-red-600" />
            <span>This document was declined. Reason: {doc.rejection_reason || 'N/A'}.</span>
          </div>
        )}

        {/* Paper Document Layout */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 text-slate-800">
          
          {/* Header Section: Logo Top-Left */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-3 max-w-md">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="h-14 max-w-[220px] object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <Building2 size={24} className="text-slate-700" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{companyName}</h2>
                </div>
              )}
              
              <div className="text-xs text-slate-500 leading-relaxed space-y-0.5 font-medium">
                <p className="font-semibold text-slate-700">{companyName}</p>
                {companyAddress && <p>{companyAddress}</p>}
                {companyEmail && <p>Email: {companyEmail}</p>}
                {companyPhone && <p>Phone: {companyPhone}</p>}
                {companyGstin && <p className="font-semibold text-slate-600">GSTIN / Tax ID: {companyGstin}</p>}
              </div>
            </div>

            <div className="md:text-right space-y-1.5">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-xs font-black rounded-md tracking-wider uppercase">
                {docTypeLabel}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{doc.document_number}</h3>
              <div className="text-xs text-slate-500 space-y-1 font-medium">
                <p><span className="text-slate-400">Date:</span> {doc.document_date || new Date().toLocaleDateString()}</p>
                {doc.valid_until && (
                  <p><span className="text-slate-400">Valid Until:</span> {doc.valid_until}</p>
                )}
                {docType === 'INVOICE' && (
                  <p>
                    <span className="text-slate-400">Status: </span>
                    <span className={`font-bold ${doc.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {doc.status || 'UNPAID'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer / Prepared For Block */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {docType === 'INVOICE' ? 'Billed To' : 'Prepared For'}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{doc.customer_name || 'Valued Customer'}</h4>
              {doc.customer_company && <p className="text-xs text-slate-600 font-medium">{doc.customer_company}</p>}
              {doc.customer_email && <p className="text-xs text-slate-500 font-medium">{doc.customer_email}</p>}
              {doc.customer_phone && <p className="text-xs text-slate-500 font-medium">{doc.customer_phone}</p>}
            </div>

            {doc.customer_address && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Address</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{doc.customer_address}</p>
              </div>
            )}
          </div>

          {/* Proposal Specific Sections (if Proposal) */}
          {docType === 'PROPOSAL' && (
            <div className="space-y-6 pt-2">
              {sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 border-b border-slate-100 pb-5 last:border-none">
                  <h4 className="text-sm font-bold text-slate-900">{sec.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">{sec.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Line Items Table (For Quotations, Invoices, & Proposals with items) */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items & Commercial Details</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item / Description</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Tax</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{item.item_name || item.name || `Item #${idx + 1}`}</p>
                          {item.description && <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>}
                        </td>
                        <td className="py-3 px-4 text-center">{item.quantity || 1}</td>
                        <td className="py-3 px-4 text-right">{doc.currency_symbol || '₹'}{parseFloat(item.unit_price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">{item.tax_rate ? `${item.tax_rate}%` : '0%'}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {doc.currency_symbol || '₹'}{parseFloat(item.total || (item.quantity * item.unit_price) || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary / Total Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="max-w-md text-xs text-slate-500 space-y-2">
              {doc.notes && (
                <div>
                  <span className="font-bold text-slate-700 block">Notes:</span>
                  <p className="leading-relaxed">{doc.notes}</p>
                </div>
              )}
              {doc.terms_and_conditions && (
                <div>
                  <span className="font-bold text-slate-700 block">Terms & Conditions:</span>
                  <p className="leading-relaxed whitespace-pre-line">{doc.terms_and_conditions}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{doc.currency_symbol || '₹'}{parseFloat(doc.subtotal || doc.grand_total || 0).toFixed(2)}</span>
              </div>
              {parseFloat(doc.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{doc.currency_symbol || '₹'}{parseFloat(doc.discount_amount).toFixed(2)}</span>
                </div>
              )}
              {parseFloat(doc.tax_amount || 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span>+{doc.currency_symbol || '₹'}{parseFloat(doc.tax_amount).toFixed(2)}</span>
                </div>
              )}
              {parseFloat(doc.additional_charges || 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping / Other:</span>
                  <span>+{doc.currency_symbol || '₹'}{parseFloat(doc.additional_charges).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span>{doc.currency_symbol || '₹'}{parseFloat(doc.grand_total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400 font-medium">
            Thank you for your business with <span className="font-semibold text-slate-600">{companyName}</span>.
          </div>
        </div>
      </main>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base font-bold text-slate-900">Accept Proposal</h3>
            <p className="text-xs text-slate-500">Please confirm your details to accept this document.</p>

            <form onSubmit={handleAcceptSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={acceptName}
                  onChange={(e) => setAcceptName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={acceptEmail}
                  onChange={(e) => setAcceptEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Comments / Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={acceptComment}
                  onChange={(e) => setAcceptComment(e.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAcceptModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAccept}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {submittingAccept && <Loader2 size={13} className="animate-spin" />}
                  Confirm Acceptance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base font-bold text-slate-900">Decline Proposal</h3>
            <p className="text-xs text-slate-500">Please select a reason for declining this proposal.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Rejection</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Pricing">Pricing / Budget</option>
                  <option value="Scope">Scope of Work</option>
                  <option value="Timeline">Timeline Constraints</option>
                  <option value="Competitor">Chose Competitor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Feedback / Notes</label>
                <textarea
                  rows={3}
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Explain why you are declining..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {submittingReject && <Loader2 size={13} className="animate-spin" />}
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

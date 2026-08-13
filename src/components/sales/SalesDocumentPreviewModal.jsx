'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, Download, Printer, CheckCircle2, Clock, FileText, FileCheck, 
  Building2, Send, Copy, ArrowRight, ShieldCheck, UserCheck, Sparkles, ExternalLink
} from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

export default function SalesDocumentPreviewModal({ doc, isOpen, onClose, onSend, onConvert, onEdit }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !doc) return null;

  const isProposal = doc.document_type === 'PROPOSAL';
  const curSymbol = doc.currency_symbol || '$';
  const curCode = doc.currency || 'USD';

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('token');
    const downloadUrl = `${API_BASE_URL}/api/sales-documents/${doc.id}/pdf/`;
    try {
      const res = await axios.get(downloadUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.document_number || 'Document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download via blob failed, opening fallback window", err);
      window.open(`${downloadUrl}?token=${token}`, '_blank');
    }
  };

  const handleCopyLink = () => {
    const path = `/public/quote/${doc.secure_token}`;
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
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

    const companyLogo = doc.client_details?.company_logo_url || doc.client?.company_logo_url || doc.company_details?.company_logo_url;
    const companyName = doc.company_details?.business_name || doc.client_details?.business_name || doc.client?.business_name || 'Company Name';
    const companyAddr = doc.company_details?.address || doc.client_details?.address || doc.client?.address || '';
    const companyPhone = doc.company_details?.phone_number || doc.client_details?.phone_number || doc.client?.phone_number || '';
    const companyEmail = doc.company_details?.email || doc.client_details?.email || doc.client?.email || '';
    const companyGstin = doc.tax_number || doc.company_details?.tax_id_gstin || doc.client_details?.tax_id_gstin || doc.client?.tax_id_gstin || '';

    const title = isProposal ? 'PROPOSAL' : 'QUOTATION';
    const docNum = doc.document_number || 'Document';

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
      ${companyLogo ? `<img src="${companyLogo}" class="company-logo" alt="Logo" onerror="this.style.display='none'" />` : `<div class="company-name">${companyName}</div>`}
      <div class="company-name">${companyName}</div>
      <div class="company-details">
        ${companyAddr ? `${companyAddr}<br/>` : ''}
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
      ${companyAddr ? `<div class="party-detail">${companyAddr}</div>` : ''}
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

  const items = doc.items || [];
  const sections = doc.proposal_sections || [
    { title: '1. Executive Summary', content: 'This proposal outlines our strategic solution, technical scope, and commercial terms.' },
    { title: '2. Scope of Work & Deliverables', content: 'Custom project development, testing, integration, and training.' },
    { title: '3. Project Timeline & Milestones', content: 'Phase 1: Discovery (Week 1-2)\nPhase 2: Execution (Week 3-6)\nPhase 3: Deployment & Handover (Week 7)' },
    { title: '4. Terms & Warranty Support', content: 'Includes 12 months SLA support and dedicated account manager.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:overflow-visible">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
              isProposal ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isProposal ? <FileText className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isProposal ? 'Executive Proposal Preview' : 'Quotation Preview'} • {doc.document_number}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Customer: <span className="font-bold text-slate-800">{doc.customer_name || 'Valued Client'}</span> • Value: <span className="font-extrabold text-slate-900">{curSymbol}{Number(doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {curCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied Link!' : 'Public Link'}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleDownloadPDF}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md ${
                isProposal ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Visual Layout */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div id="printable-sales-document" className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-slate-800 print:shadow-none print:border-none print:p-0">
            
            {isProposal ? (
              /* PROPOSAL VISUAL PREVIEW */
              <div className="space-y-8">
                {/* Clean Professional Neutral Header with Top-Left Logo */}
                <div className="flex justify-between items-start pb-6 border-b border-slate-200 gap-6">
                  <div className="space-y-2 max-w-sm">
                    {doc.client_details?.company_logo_url || doc.client?.company_logo_url ? (
                      <img 
                        src={doc.client_details?.company_logo_url || doc.client?.company_logo_url} 
                        alt={doc.client?.business_name || 'Company'} 
                        className="h-12 max-w-[200px] object-contain mb-1" 
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-slate-700" />
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          {doc.client?.business_name || 'Company Name'}
                        </h2>
                      </div>
                    )}
                    <div className="text-xs text-slate-500 font-medium space-y-0.5">
                      <p className="font-bold text-slate-800">{doc.client?.business_name}</p>
                      {doc.client?.address && <p>{doc.client.address}</p>}
                      {doc.client?.phone_number && <p>Phone: {doc.client.phone_number}</p>}
                      {doc.tax_number && <p className="font-semibold text-slate-700">GSTIN / Tax ID: {doc.tax_number}</p>}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-2xl font-black tracking-tight text-slate-900 block">
                      PROPOSAL
                    </span>
                    <p className="text-xs font-bold text-slate-800">#{doc.document_number}</p>
                    <p className="text-[11px] text-slate-500">Date: {doc.document_date || new Date().toLocaleDateString()}</p>
                    {doc.valid_until && <p className="text-[11px] text-slate-500">Valid Until: {doc.valid_until}</p>}
                  </div>
                </div>

                {/* Prepared For & Prepared By Grid */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Prepared For</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{doc.customer_name || 'Valued Customer'}</h4>
                    <p className="text-slate-600 mt-0.5">{doc.customer_company}</p>
                    <p className="text-slate-500 mt-0.5">{doc.customer_email || doc.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Prepared By</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {doc.company_details?.business_name || doc.client_details?.business_name || doc.client?.business_name || 'Company Name'}
                    </h4>
                    <p className="text-slate-600 mt-0.5">
                      {doc.company_details?.address || doc.client_details?.address || doc.client?.address || ''}
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      {doc.company_details?.email || doc.client_details?.email || doc.salesperson_name || ''}
                    </p>
                  </div>
                </div>

                {/* Proposal Sections */}
                <div className="space-y-6">
                  {sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed pl-4 whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Proposal Commercial Investment Table */}
                {items.length > 0 && (
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-base font-extrabold text-slate-900 mb-3 border-l-4 border-indigo-600 pl-3">
                      Commercial Investment Table
                    </h3>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Price ({curCode})</th>
                          <th className="py-2.5 px-3 text-right">Total ({curCode})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                            <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{curSymbol}{Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">{curSymbol}{Number(item.line_total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-right mt-3 text-sm font-black text-indigo-700">
                      Total Investment: {curSymbol}{Number(doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {curCode}
                    </div>
                  </div>
                )}

                {/* Acceptance Authorization Section */}
                <div className="pt-6 border-t border-slate-200 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Acceptance & Authorization</h4>
                  <p className="text-[11px] text-slate-500 mb-6">By signing, the client accepts the proposed scope of work and commercial investment structure.</p>
                  
                  <div className="grid grid-cols-2 gap-6 text-xs">
                    <div className="space-y-4">
                      <p className="font-bold text-slate-700">Customer Representative Signature:</p>
                      <div className="h-12 border-b border-dashed border-slate-300" />
                      <p className="text-slate-500">Date: ________________________</p>
                    </div>
                    <div className="space-y-4">
                      <p className="font-bold text-slate-700">Authorized Partner Signature:</p>
                      <div className="h-12 border-b border-dashed border-slate-300" />
                      <p className="text-slate-500">Date: ________________________</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* QUOTATION VISUAL PREVIEW */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-black text-emerald-600 tracking-tight flex items-center gap-2">
                      <Building2 className="w-6 h-6" />
                      {doc.client?.business_name || 'UWOConnect Partner'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">{doc.client?.address || 'HQ Address'}</p>
                    {doc.tax_number && (
                      <p className="text-[11px] font-semibold text-slate-600 mt-1">Tax ID / GSTIN: {doc.tax_number}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black tracking-tight text-emerald-700 block">QUOTATION</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">#{doc.document_number}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Date: {doc.document_date || 'N/A'}</p>
                    <p className="text-[11px] text-slate-500">Valid Until: {doc.valid_until || 'N/A'}</p>
                  </div>
                </div>

                {/* Billed To & Document Overview */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{doc.customer_name || 'Valued Customer'}</h4>
                    <p className="text-slate-600 mt-0.5">{doc.customer_company}</p>
                    <p className="text-slate-500 mt-0.5">{doc.customer_email || doc.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Quotation Summary</span>
                    <p className="text-slate-700">Currency: <b>{curCode} ({curSymbol})</b></p>
                    <p className="text-slate-700 mt-0.5">Salesperson: {doc.salesperson_name || 'System'}</p>
                    <p className="text-slate-700 mt-0.5">Status: <b className="text-emerald-700 uppercase">{doc.status}</b></p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="py-2.5 px-3 font-bold">Item Description</th>
                        <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                        <th className="py-2.5 px-3 font-bold text-right">Unit Price ({curCode})</th>
                        <th className="py-2.5 px-3 font-bold text-right">Tax ({curCode})</th>
                        <th className="py-2.5 px-3 font-bold text-right">Line Total ({curCode})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-3 px-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-3 px-3 text-right text-slate-600">{curSymbol}{Number(item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 text-right text-slate-600">{curSymbol}{Number(item.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">{curSymbol}{Number(item.line_total || item.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Summary */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <div className="w-72 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>{curSymbol}{Number(doc.subtotal || doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    {Number(doc.discount_amount || 0) > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount:</span>
                        <span>-{curSymbol}{Number(doc.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {Number(doc.tax_amount || 0) > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Tax / GST:</span>
                        <span>{curSymbol}{Number(doc.tax_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                      <span>Grand Total:</span>
                      <span className="text-emerald-700">{curSymbol}{Number(doc.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {curCode}</span>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                <div className="pt-6 border-t border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">Terms & Conditions:</p>
                  <p className="text-slate-500 text-[11px] whitespace-pre-line">{doc.terms_conditions || '1. Valid for 15 days from issue date.\n2. Goods once sold subject to standard terms.'}</p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

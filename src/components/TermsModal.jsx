'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function TermsModal({ isOpen, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/settings/global?key=terms_of_service`);
        if (res.data && res.data.value) {
          setContent(res.data.value);
        }
      } catch (err) {
        console.error('Failed to fetch terms of service from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const serifStyle = { fontFamily: "'Times New Roman', Times, serif" };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[32px] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-950/20 overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
      >
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white relative flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={13} />
              <span>LEGAL SERVICE AGREEMENT</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif leading-tight" 
              style={serifStyle}
            >
              Terms &amp; Conditions
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium pt-0.5">
              <span>Effective Date: Sept 1, 2026</span>
              <span>•</span>
              <span>UWO Connect Platform</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all cursor-pointer shadow-sm shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-left text-slate-700 text-sm leading-relaxed space-y-6 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#059669]" size={44} />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Terms &amp; Conditions...</p>
            </div>
          ) : content ? (
            <div 
              className="prose prose-slate max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="space-y-6">
              
              <div className="p-4.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-medium text-xs leading-relaxed">
                Welcome to <strong>UWO Connect</strong>, a unified business automation and customer communication platform. By accessing or using our platform, you acknowledge that you have read, understood, and agreed to these Terms &amp; Conditions.
              </div>

              <hr className="border-slate-200" />

              {/* 1. Eligibility & Account Registration */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">1</span>
                  Eligibility &amp; Account Registration
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  You must have the legal capacity to enter into a binding agreement. You agree to provide accurate information, maintain credential confidentiality, and accept full responsibility for all activities under your workspace account.
                </p>
              </section>

              {/* 2. Subscription & Payments */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">2</span>
                  Subscriptions, Fees &amp; Third-Party Charges
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Subscription fees are payable in advance on a monthly or annual billing cycle. Third-party API charges (such as Meta WhatsApp Business API, payment gateway fees, or cloud storage charges) apply separately according to provider policies.
                </p>
              </section>

              {/* 3. Messaging Compliance & Consent */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">3</span>
                  Messaging Compliance &amp; Anti-Spam Rules
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  You are solely responsible for obtaining explicit customer consent before sending promotional or marketing messages. Sending unsolicited spam, deceptive, or prohibited communications is strictly banned and will lead to immediate account termination.
                </p>
              </section>

              {/* 4. AI Automation Disclaimer */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">4</span>
                  AI-Powered Automation &amp; Accuracy
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  AI-generated responses operate automatically and must be reviewed for critical workflows. AI responses do not constitute professional legal, accounting, or tax advice. You remain responsible for business decisions made using AI responses.
                </p>
              </section>

              {/* 5. Quotations, Invoices & Payments */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">5</span>
                  Quotations, GST Tax Invoices &amp; Payments
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  You are responsible for verifying client information, product prices, discounts, and GST tax calculations (CGST, SGST, IGST) prior to issuing invoices. Payments processed via Razorpay or UPI webhooks depend on external banking networks.
                </p>
              </section>

              {/* 6. White-Label & Agency Reseller Licensing */}
              <section className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">6</span>
                  White-Label Agency Program
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  White-Label access grants custom CNAME domain mapping (`app.youragency.com`) and custom branding permissions. White-Label licensing does not transfer ownership of UWO Connect's underlying software codebase or intellectual property.
                </p>
              </section>

              {/* 7. Governing Law & Contact */}
              <section className="space-y-2 pt-2 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2" style={serifStyle}>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-sans not-italic flex items-center justify-center font-bold">7</span>
                  Governing Law &amp; Legal Contact
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  These terms are governed by the laws of <strong>India</strong>. For any legal inquiries regarding these Terms, contact our legal team at <a href="mailto:support@uwoconnect.com" className="text-emerald-700 font-bold hover:underline">support@uwoconnect.com</a>.
                </p>
              </section>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 sm:py-5 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#059669]" /> UWO Connect Legal Agreement
          </span>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>I Understand & Accept</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

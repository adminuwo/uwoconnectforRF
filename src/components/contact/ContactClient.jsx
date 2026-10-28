'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inquiryData, setInquiryData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message || submitting) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('uwo_token') || '') : '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API_BASE_URL}/api/contact/submit/`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
        source: 'web'
      }, { headers });

      setInquiryData(res.data?.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact submission failed:', err);
      const msg = err.response?.data?.error || 'Failed to submit inquiry. Please check your connection and try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans">
      {/* Simple Top Navigation */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-semibold text-xs sm:text-sm transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="UWO Connect" className="w-6 h-6 object-contain" />
          <span className="font-extrabold text-base tracking-tight text-slate-900">UWO Connect</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Contact Support &amp; Sales
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Have questions about UWO Connect or need help? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        {/* 2-Column Simple Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Official Contact Info
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</div>
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</div>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Working Hours</div>
                  <div className="font-semibold text-slate-800">Monday – Saturday: 9:00 AM – 7:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Office Address</div>
                  <address className="not-italic font-medium text-slate-600 text-xs leading-relaxed">
                    {SITE_CONFIG.legalName}<br />
                    {SITE_CONFIG.address.streetAddress},<br />
                    {SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} – {SITE_CONFIG.address.postalCode}, India
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">
              Send us a Message
            </h2>

            {submitted ? (
              <div className="py-8 px-4 text-center space-y-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. We have received your message and will respond shortly.
                  {inquiryData?.id && (
                    <span className="block mt-2 font-mono text-xs font-bold text-emerald-700">
                      Reference ID: #{inquiryData.id}
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-slate-700 font-semibold text-xs mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-slate-700 font-semibold text-xs mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-slate-700 font-semibold text-xs mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-slate-700 font-semibold text-xs mb-1.5">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                      placeholder="General Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-slate-700 font-semibold text-xs mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 resize-none"
                    placeholder="How can we help your business?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full py-2.5 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs",
                    submitting
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-200/60 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-slate-500">
          <Link href="/terms-and-conditions" className="hover:text-emerald-600 transition-colors">Terms &amp; Conditions</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-emerald-600 transition-colors">Refund Policy</Link>
          <span>•</span>
          <Link href="/cookie-policy" className="hover:text-emerald-600 transition-colors">Cookie Policy</Link>
        </div>
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

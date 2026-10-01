'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-[#10B981] font-bold text-sm hover:underline flex items-center gap-2">
            ← Back to Home
          </Link>
          <div className="text-xl font-extrabold text-white">UWO Connect.</div>
        </header>

        <main>
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Contact Support & Sales</h1>
            <p className="text-[#8E99A8] text-sm">
              Have questions about our WhatsApp AI SaaS platform, channel integrations, or subscription plans? Our technical team is here to assist you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Contact Details Card */}
            <div className="bg-[#0B0D11] border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">Official Business Details</h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Addresses</h4>
                  <p className="text-sm font-semibold text-white">
                    <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-[#10B981]">
                      {SITE_CONFIG.supportEmail}
                    </a>
                  </p>
                  <p className="text-xs text-slate-400">
                    <a href={`mailto:${SITE_CONFIG.verifyEmail}`} className="hover:text-[#10B981]">
                      {SITE_CONFIG.verifyEmail}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Support Phone</h4>
                  <p className="text-sm font-semibold text-white">
                    <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="hover:text-[#10B981]">
                      {SITE_CONFIG.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</h4>
                  <p className="text-sm font-semibold text-white">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Business Address</h4>
                  <address className="not-italic text-sm text-slate-300 leading-relaxed">
                    {SITE_CONFIG.legalName}<br />
                    {SITE_CONFIG.address.streetAddress},<br />
                    {SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} – {SITE_CONFIG.address.postalCode}, India
                  </address>
                </div>
              </div>
            </div>

            {/* Direct Support Form */}
            <div className="bg-[#0B0D11] border border-white/10 rounded-3xl p-8 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Send us a Message</h2>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Message Received</h3>
                  <p className="text-xs text-slate-300">
                    Thank you! Our technical support team will review your inquiry and get back to you within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label htmlFor="contact-name" className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Work Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981]"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981] h-24 resize-none"
                      placeholder="How can we help your business?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-500 space-y-2 mt-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
            <Link href="/terms-and-conditions" className="hover:text-[#10B981] transition-colors">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#10B981] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-[#10B981] transition-colors">Refund Policy</Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-[#10B981] transition-colors">Cookie Policy</Link>
          </div>
          <div>© {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}

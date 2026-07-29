'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-[#10B981] font-bold text-sm hover:underline flex items-center gap-2">
            ← Back to Home
          </Link>
          <div className="text-xl font-extrabold text-white">Uwo Connect.</div>
        </div>

        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Contact Support</h1>
          <p className="text-[#8E99A8] text-sm">
            Have questions about our WhatsApp AI SaaS platform or subscription plans? Our support team is here to assist you.
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
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</h4>
                <p className="text-sm font-semibold text-white">support@uwo24.com</p>
                <p className="text-xs text-slate-400">verify@uwo24.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Support Phone</h4>
                <p className="text-sm font-semibold text-white">+91 98765 43210</p>
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
                <p className="text-sm text-slate-300 leading-relaxed">
                  Uwo Connect Platform / Aisa Technologies<br />
                  Tech Park Tower, Sector 62,<br />
                  Noida, Uttar Pradesh – 201309, India
                </p>
              </div>
            </div>
          </div>

          {/* Direct Support Form */}
          <div className="bg-[#0B0D11] border border-white/10 rounded-3xl p-8 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Send us a Message</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Your Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981]" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Work Email</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981]" placeholder="john@company.com" />
              </div>
              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider mb-1 block">Message</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#10B981] h-24 resize-none" placeholder="How can we help your business?" />
              </div>
              <button 
                onClick={() => alert('Message sent successfully! Our support team will get back to you within 2 hours.')}
                className="w-full py-3.5 bg-[#10B981] text-black font-bold rounded-xl hover:bg-[#059669] transition-all cursor-pointer uppercase tracking-wider"
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-slate-500">
          © 2026 Uwo Connect Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

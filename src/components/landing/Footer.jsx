'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F1115] border-t border-white/5 pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F6B52] to-[#16A085] flex items-center justify-center shadow-[0_0_15px_rgba(22,160,133,0.3)]">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="font-bold text-base tracking-tight text-white">Uwo Connect.</span>
          </div>
          <p className="text-xs text-[#8E99A8] leading-relaxed font-semibold max-w-xs">
            One Platform. Endless Connections. Enterprise AI SaaS & WhatsApp Meta API automation platform for business messaging and workflows.
          </p>
          <div className="text-[11px] text-[#8E99A8] pt-2 space-y-1">
            <p><strong>Email:</strong> support@uwo24.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Platform</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Company</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <Link href="/about" className="hover:text-white transition-colors">About Uwo Connect</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support Portal</Link>
            <a href="mailto:support@uwo24.com" className="hover:text-white transition-colors">Sales Inquiry</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Legal & Policies</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors text-[#10B981]">Cancellation & Refund Policy</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#8E99A8]">
        <p>© 2026 Uwo Connect Platform (Aisa Technologies). All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

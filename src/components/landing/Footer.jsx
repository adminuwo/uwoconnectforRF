'use client';

import React from 'react';
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
            One Platform. Endless Connections. Connect conversations. Empower teams. Automate workflows. Build stronger customer relationships.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Platform</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Integrations</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Enterprise</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <a href="#" className="hover:text-white transition-colors">Security Schema</a>
            <a href="#" className="hover:text-white transition-colors">SLA Contracts</a>
            <a href="#" className="hover:text-white transition-colors">Developer Portal</a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Legal</h4>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#8E99A8]">
            <a href="https://uwo24.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">GDPR Compliance</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#8E99A8]">
        <p>© 2026 Uwo Connect Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}


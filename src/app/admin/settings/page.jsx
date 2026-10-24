'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Webhook, Copy, Check, Scale, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminSettingsPage = () => {
  const [copiedWA, setCopiedWA] = useState(false);
  const [copiedFB, setCopiedFB] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const waWebhookUrl = `${backendUrl}/api/webhook/whatsapp`;
  const fbWebhookUrl = `${backendUrl}/api/webhook/facebook-instagram`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'WA') {
      setCopiedWA(true);
      setTimeout(() => setCopiedWA(false), 2000);
    } else {
      setCopiedFB(true);
      setTimeout(() => setCopiedFB(false), 2000);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-20 px-4 sm:px-8 lg:px-10 font-sans">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Settings className="text-slate-500" size={32} /> Platform Settings
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">System configuration and global preferences</p>
        </div>
        
        <div className="space-y-10">
          {/* Webhook Configuration Section */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
              <Webhook size={14} /> Global Webhooks
            </h3>
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-sm">
              <p className="text-sm text-slate-500 font-medium italic mb-2">
                These are the global callback URLs to be configured in your Meta App Dashboard. 
                They handle incoming messages for all clients on the platform.
              </p>

              <div className="space-y-6 mt-4">
                {/* WhatsApp Webhook */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Webhook Callback URL</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 font-mono text-slate-700 text-sm border border-slate-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {waWebhookUrl}
                    </div>
                    <button 
                      onClick={() => handleCopy(waWebhookUrl, 'WA')}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 ${
                        copiedWA 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {copiedWA ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                </div>

                {/* Facebook/Instagram Webhook */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Facebook/Instagram Webhook Callback URL</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 font-mono text-slate-700 text-sm border border-slate-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {fbWebhookUrl}
                    </div>
                    <button 
                      onClick={() => handleCopy(fbWebhookUrl, 'FB')}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 ${
                        copiedFB 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {copiedFB ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Policies & Agreements Section */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
              <Scale size={14} /> Legal & Compliance
            </h3>
            <div className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 shadow-inner">
                  <Scale size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Terms of Service & Privacy Policy
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                      Live Editable
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    Edit official Terms & Conditions and Privacy Policy HTML text, or upload official PDF/DOCX policy documents. Changes reflect instantly on web legal routes and mobile app legal screens.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/settings/legal"
                className="px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-700/20 shrink-0 cursor-pointer active:scale-95"
              >
                <span>Manage Legal Policies</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;


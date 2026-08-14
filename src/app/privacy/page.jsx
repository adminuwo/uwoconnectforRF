'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Loader2, FileText, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/admin/settings/global?key=privacy_policy`);
        setContent(res.data.value || '');
        setFileUrl(res.data.file || '');
      } catch (err) {
        console.error('Failed to fetch privacy policy');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/auth/login" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-2 italic">
            ← Back to Login
          </Link>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">A</div>
        </div>
        
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase italic leading-none">Privacy Policy</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-60">Legal Documentation & Data Protection</p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-100" size={64} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Syncing legal node...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[48px] border border-slate-100 p-12 md:p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <div 
              className="prose prose-slate max-w-none relative z-10"
              dangerouslySetInnerHTML={{ 
                __html: content || `
                  <div class="space-y-6 text-slate-700">
                    <h2 class="text-2xl font-bold text-slate-900">UwoConnect Privacy Policy</h2>
                    <p class="text-sm text-slate-500">Last updated: July 2026</p>
                    
                    <h3 class="text-xl font-semibold text-slate-900 mt-6">1. Information We Collect</h3>
                    <p>We collect information necessary to provide our WhatsApp messaging automation services. This includes:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li><strong>WhatsApp Account Information:</strong> Your business phone number, WhatsApp Business Account ID, and access tokens required to integrate with the WhatsApp Business API.</li>
                      <li><strong>End-User Data:</strong> We process incoming and outgoing messages, including phone numbers, profile names, and message content sent between your business and your customers via WhatsApp.</li>
                    </ul>
                    
                    <h3 class="text-xl font-semibold text-slate-900 mt-6">2. How We Use Your Information</h3>
                    <p>The collected data is exclusively used to:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li>Facilitate the sending and receiving of WhatsApp messages on behalf of your business.</li>
                      <li>Provide automated replies and AI-powered responses based on your configured workflows.</li>
                      <li>Maintain CRM records of your customer interactions within the UwoConnect dashboard.</li>
                    </ul>
                    
                    <h3 class="text-xl font-semibold text-slate-900 mt-6">3. Data Sharing and Third Parties</h3>
                    <p>We do not sell your data. We share data only with essential third-party service providers, including:</p>
                    <ul class="list-disc pl-5 space-y-2">
                      <li><strong>Meta Platforms, Inc:</strong> Data is transmitted through Meta's WhatsApp Business API to deliver messages.</li>
                      <li><strong>AI Providers:</strong> Message content may be processed by AI providers solely for the purpose of generating automated responses, as configured by you.</li>
                    </ul>
                    
                    <h3 class="text-xl font-semibold text-slate-900 mt-6">4. Data Retention and Deletion</h3>
                    <p>We retain message data and customer information as long as your account is active. You may request the deletion of your account and all associated data at any time by contacting our support team. Upon deletion, all WhatsApp tokens and message histories are permanently removed from our servers.</p>
                    
                    <h3 class="text-xl font-semibold text-slate-900 mt-6">5. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us at admin@uwo24.com.</p>
                  </div>
                ` 
              }}
            />
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">&copy; 2026 Aisaconnect Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-[#10B981] font-bold text-sm hover:underline flex items-center gap-2">
            ← Back to Home
          </Link>
          <div className="text-xl font-extrabold text-white">Uwo Connect.</div>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">About Uwo Connect</h1>
          <p className="text-[#8E99A8] text-sm">Enterprise Business Communication & AI Workflow Platform</p>
        </div>

        <div className="bg-[#0B0D11] border border-white/10 rounded-3xl p-8 md:p-12 space-y-6 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-white">Who We Are</h2>
          <p>
            <strong>Uwo Connect</strong> (operated by Aisa Technologies) is a premier enterprise SaaS platform providing official WhatsApp Business Meta API integration, multi-channel inbox unified messaging, AI assistant automation, and CRM workflow management.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Our Services & Products</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Official WhatsApp Meta Cloud API Integration:</strong> Verified business messaging, broadcast campaigns, and automated message templates.</li>
            <li><strong>No-Code Workflow Builder:</strong> Custom drag-and-drop conversational bot triggers and multi-step customer journeys.</li>
            <li><strong>AI Customer Assistant:</strong> Intelligent RAG vector database document search answering business inquiries automatically 24/7.</li>
            <li><strong>Unified Team Inbox:</strong> Single dashboard for multi-agent support across WhatsApp, Instagram Direct, and Facebook Messenger.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white pt-4">Subscription Software Model</h2>
          <p>
            Uwo Connect operates on a cloud subscription model offering tiered software plans (Starter, Growth, and Enterprise) billed monthly or annually. Subscriptions grant businesses full access to our cloud dashboard, API webhooks, team licenses, and automated message broadcasting.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Security & Compliance</h2>
          <p>
            We prioritize enterprise-grade data security with 256-bit SSL encryption, granular role permissions, and full Meta API compliance for secure business communications.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-6 text-xs text-slate-400">
            <p><strong>Registered Business:</strong> Uwo Connect / Aisa Technologies</p>
            <p><strong>Official Website:</strong> https://uwoconnect.aisa24.com</p>
            <p><strong>Contact Email:</strong> support@uwo24.com</p>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-slate-500">
          © 2026 Uwo Connect Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

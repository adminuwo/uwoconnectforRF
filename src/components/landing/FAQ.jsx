'use client';

import React, { useState } from 'react';
export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: "Is the WhatsApp Cloud API integration native?", a: "Yes. Uwo Connect connects directly to Meta's developer endpoint. There are no middleware markups, no latency, and you control your phone numbers directly." },
    { q: "How does the AI Assistant Vector Knowledge Base work?", a: "You upload PDFs, markdown guidelines, or point Uwo Connect to web documentation URLs. We parse and index the content. Your assistants use semantic vector search to retrieve accurate information, preventing hallucinations." },
    { q: "Can we transition existing database profiles?", a: "Absolutely. We provide one-click import scripts for HubSpot, Salesforce, Monday.com, Jira, CSV datasets, and SQL files." },
    { q: "What data security standards does Uwo Connect enforce?", a: "We operate on a secure workspace system with end-to-end encryption at rest (AES-256) and transit (TLS 1.3), complete role-based permission matrices, SSO, and strict GDPR and SOC2 standards compliance." }
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Frequently Asked
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-card rounded-[24px] overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left font-bold text-sm text-white hover:text-[#20C997] transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <span className={`text-[#20C997] transition-transform duration-300 ${openIdx === idx ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>

            {openIdx === idx && (
              <div
                className="px-6 pb-6 text-sm text-[#8E99A8] font-medium leading-relaxed"
              >
                {faq.a}
              </div>
            )}

          </div>
        ))}
      </div>
    </section>
  );
}



'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function KinsoFAQ({ isDark }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What channels does UWO Connect support out of the box?',
      answer:
        'UWO Connect supports WhatsApp Business API, Instagram Direct Messages, Facebook Messenger, Telegram, LinkedIn Sales Navigator, Gmail, X (Twitter), YouTube Comments, TikTok Direct, Custom REST APIs, Webhooks, Microsoft Teams, and Slack.',
    },
    {
      question: 'How long does it take to connect our existing channels and CRM?',
      answer:
        'Most teams complete initial setup in under 5 minutes. Our pre-built 1-click connectors for HubSpot, Salesforce, Zoho, and Google Workspace require zero coding.',
    },
    {
      question: 'Is my company data and customer conversation history secure?',
      answer:
        'Yes. All data is encrypted using AES-256 at rest and TLS 1.3 in transit. We maintain SOC 2 Type II compliance controls, role-based access control (RBAC), and full audit logging.',
    },
    {
      question: 'Can agents oversee AI responses before they are sent to customers?',
      answer:
        'Absolutly. You can run UWO Connect in "Human-in-the-Loop" mode where AI drafts smart replies for agent approval, or in "Autonomous Mode" for routine queries.',
    },
    {
      question: 'Does UWO Connect offer a free trial or custom enterprise demo?',
      answer:
        'Yes! We offer a 14-day unrestricted free trial with no credit card required. You can also book a personalized 1-on-1 demo with our technical solutions team.',
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
            Got Questions?
          </span>
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need to know about UWO Connect features, security, and onboarding.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDark
                    ? 'bg-[#0E131F] border-white/10'
                    : 'bg-white border-gray-200 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base md:text-lg focus:outline-none cursor-pointer"
                >
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#00AB56] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={`px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm md:text-base leading-relaxed border-t pt-3 sm:pt-4 ${
                        isDark ? 'text-gray-400 border-white/5' : 'text-gray-600 border-gray-100'
                      }`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

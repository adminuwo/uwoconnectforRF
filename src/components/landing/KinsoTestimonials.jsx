'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function KinsoTestimonials({ isDark }) {
  const testimonials = [
    {
      quote:
        'UWO Connect replaced 7 disconnected SaaS tools for our global support team. Our average response time dropped from 4 hours to 42 seconds.',
      author: 'Rachel Vance',
      title: 'VP of Customer Experience',
      company: 'ScaleX Global',
      rating: 5,
      avatar: 'RV',
    },
    {
      quote:
        'The AI Smart Reply Assistant handles over 80% of our routine WhatsApp inquiries automatically while giving our agents full approval control.',
      author: 'David Chen',
      title: 'Head of Operations',
      company: 'OmniFlow Commerce',
      rating: 5,
      avatar: 'DC',
    },
    {
      quote:
        'Bi-directional sync with HubSpot & Salesforce means every lead context is instantly accessible. Our sales conversion rate jumped by 34%.',
      author: 'Sophia Martinez',
      title: 'Director of Revenue Operations',
      company: 'Apex Digital Systems',
      rating: 5,
      avatar: 'SM',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20">
            Customer Success Stories
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loved by Global Support & Revenue Leaders.
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover how leading organizations use UWO Connect to streamline communication and drive customer loyalty.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border relative flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0E131F] border-white/10 hover:border-[#16A34A]/40'
                  : 'bg-white border-gray-200 hover:border-[#16A34A]/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#16A34A] text-[#16A34A]" />
                  ))}
                </div>

                <p className={`text-sm sm:text-base leading-relaxed italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author Metadata */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white font-bold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.author}
                  </h4>
                  <span className="text-xs text-gray-400 block">{t.title} • {t.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

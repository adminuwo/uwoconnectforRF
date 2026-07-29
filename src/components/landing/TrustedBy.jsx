'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

export default function TrustedBy({ isDark = true }) {
  const industries = [
    "E-commerce", "Retail", "Healthcare", "Education", 
    "Real Estate", "Financial Services", "Travel & Hospitality", 
    "Agencies", "SaaS", "Enterprises"
  ];
  
  return (
    <section className={`border-y py-20 overflow-hidden relative ${isDark ? 'bg-[#171A20]/30 border-white/5' : 'bg-[#F3FBF7] border-[#10B981]/10'}`}>
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Built for Growing Businesses
        </h2>
        <p className={`text-sm md:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
          Designed for businesses that want to create exceptional customer experiences. Whether you're a team of five or five hundred, UWO Connect scales with your business.
        </p>
      </div>
      
      {/* Infinite Marquee */}
      <div className="overflow-hidden w-full flex mb-8">
        <div className="flex gap-8 animate-marquee-right whitespace-nowrap opacity-90 hover:opacity-100 transition-opacity duration-500">
          {[...industries, ...industries, ...industries].map((industry, idx) => (
            <div key={idx} className={`inline-flex items-center justify-center font-bold text-base px-6 py-4 rounded-2xl border cursor-default transition-all duration-300 hover:scale-[1.05] ${
              isDark 
                ? 'bg-slate-900 text-[#8E99A8] border-white/10 hover:text-white hover:border-[#20C997] hover:bg-[#20C997]/5' 
                : 'bg-white text-slate-600 border-[#10B981]/20 hover:text-[#059669] hover:border-[#059669] hover:bg-[#10B981]/5 shadow-sm'
            }`}>
              <Building2 size={16} className={`mr-3 ${isDark ? 'text-[#16A085]' : 'text-[#10B981]'}`} />
              <span>{industry}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

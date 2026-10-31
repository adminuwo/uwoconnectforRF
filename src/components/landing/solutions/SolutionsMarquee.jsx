'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function SolutionsMarquee({ isDarkMode = false, onSelectIndustry }) {
  const items = [
    { label: 'EDUCATION', id: 'education' },
    { label: 'REAL ESTATE', id: 'real-estate' },
    { label: 'FINANCE', id: 'finance' },
    { label: 'HEALTHCARE', id: 'healthcare' },
    { label: 'AUTOMOBILE', id: 'automobile' },
    { label: 'LOGISTICS', id: 'logistics' },
    { label: 'E-COMMERCE', id: 'ecommerce' },
    { label: 'TRAVEL', id: 'travel' },
  ];

  // Repeat sequence 4 times for infinite seamless loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={cn(
      "relative w-full overflow-hidden py-5 sm:py-7 border-y select-none transition-colors",
      isDarkMode
        ? "bg-[#070B14]/80 border-slate-800/80 text-white"
        : "bg-slate-100/90 border-slate-200 text-slate-900"
    )}>
      {/* Edge Blur Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 z-10 pointer-events-none bg-gradient-to-r from-inherit to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 z-10 pointer-events-none bg-gradient-to-l from-inherit to-transparent" />

      {/* Infinite Scrolling Track */}
      <div className="flex w-max animate-marquee space-x-6 sm:space-x-12 items-center">
        {repeatedItems.map((item, idx) => (
          <button
            key={`${item.id}-${idx}`}
            type="button"
            onClick={() => onSelectIndustry && onSelectIndustry(item.id)}
            className="flex items-center space-x-6 sm:space-x-12 group cursor-pointer transition-transform hover:scale-105"
          >
            <span className={cn(
              "text-lg sm:text-2xl lg:text-3xl font-black tracking-widest uppercase transition-colors",
              isDarkMode
                ? "text-slate-300 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : "text-slate-700 group-hover:text-[#0B8F78]"
            )}>
              {item.label}
            </span>
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#0B8F78] shadow-[0_0_8px_#10B981] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Uwo Connect simplified our tech stack completely. We cut down software costs by 40% and automated our complete client intake flow.",
      name: "Sarah Jenkins",
      role: "VP of Operations",
      company: "Retool"
    },
    {
      quote: "Having CRM, WhatsApp automation, and AI bots under one interface changed our growth speed. Best decision of the year.",
      name: "Marcus Chen",
      role: "Founder",
      company: "Attio"
    },
    {
      quote: "The design logic is exceptionally clean. It feels premium, responsive, and works flawlessly.",
      name: "Elena Rostova",
      role: "Director of Product",
      company: "Vercel"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Approved by Leading Teams
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div key={idx} className="glass-card rounded-[24px] p-8 flex flex-col justify-between transition-transform duration-300">
            <div>
              <div className="flex gap-1 mb-6 text-[#10B981] text-lg">
                ★★★★★
              </div>
              <p className="text-[#8E99A8] text-sm font-medium leading-relaxed italic mb-8">
                "{t.quote}"
              </p>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E99A8]">{t.role}, {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



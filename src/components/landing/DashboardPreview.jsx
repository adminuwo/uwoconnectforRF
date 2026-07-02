'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardPreview() {
  return (
    <section className="bg-[#171A20]/40 border-y border-white/5 py-24 md:py-32 relative overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
        <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Unified Interface</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          A Workspace Built for Speed
        </h2>
        <p className="text-[#8E99A8] text-lg font-medium">
          Say goodbye to tab-switching. View your entire business operation in a single, lightning-fast glassmorphism interface.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-[500px] md:h-[700px] flex justify-center perspective-1000">
        {/* Glow behind dashboard */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#16A085]/20 rounded-full blur-[150px]" />
        
        {/* Main Dashboard Card */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="w-full max-w-5xl h-full glass-card rounded-t-[32px] md:rounded-[32px] border-b-0 md:border-b p-4 md:p-8 relative z-10 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* App Window Header */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <div className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] text-[#8E99A8] font-bold mx-auto">
              efv-unified-workspace.local
            </div>
          </div>

          <div className="flex gap-6 h-[calc(100%-60px)]">
            {/* Sidebar Mockup */}
            <div className="hidden md:flex w-64 flex-col gap-3 border-r border-white/5 pr-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-10 rounded-xl ${i === 2 ? 'bg-[#0F6B52]/30 border border-[#0F6B52]/50' : 'bg-white/5'} w-full`} />
              ))}
              <div className="mt-auto h-16 rounded-xl bg-white/5 w-full" />
            </div>

            {/* Main Content Area Mockup */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="h-32 bg-gradient-to-br from-[#171A20] to-[#101115] border border-white/5 rounded-2xl flex-1 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-20 h-4 bg-white/10 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-32 h-8 bg-[#20C997]/20 rounded-lg" />
                </div>
                <div className="h-32 bg-gradient-to-br from-[#171A20] to-[#101115] border border-white/5 rounded-2xl flex-1 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-24 h-4 bg-white/10 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border-4 border-[#16A085] border-t-transparent" />
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-br from-[#171A20] to-[#101115] border border-white/5 rounded-2xl p-6">
                 <div className="w-48 h-6 bg-white/10 rounded-full mb-8" />
                 <div className="space-y-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-12 bg-white/5 rounded-xl w-full flex items-center px-4 gap-4">
                       <div className="w-8 h-8 rounded-full bg-white/10" />
                       <div className="w-32 h-3 bg-white/10 rounded-full" />
                       <div className="w-16 h-3 bg-[#20C997]/20 rounded-full ml-auto" />
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

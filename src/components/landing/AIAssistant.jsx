'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

export default function AIAssistant() {
  return (
    <section className="bg-[#171A20]/20 border-y border-white/5 py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side: Chat UI Mockup */}
        <div className="flex-1 w-full max-w-md relative z-10 perspective-1000">
          <motion.div 
            initial={{ opacity: 0, rotateY: 10, x: -30 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-card rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#20C997]/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F6B52] to-[#16A085] flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(22,160,133,0.3)]">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Enterprise Copilot</h4>
                <span className="text-[9px] text-[#20C997] uppercase tracking-wider font-bold">Online • Vector Indexed</span>
              </div>
            </div>

            {/* Chat History */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tr-none text-xs text-white max-w-[85%] self-end ml-auto">
                Generate a revenue report for Q3 and draft an update email to the board.
              </div>
              <div className="bg-[#171A20] border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-[#8E99A8] max-w-[90%]">
                <div className="flex items-center gap-2 mb-2 text-[10px] text-[#20C997] uppercase tracking-wider font-bold">
                  <Sparkles size={12} /> Analyzing Financial Ledger...
                </div>
                Q3 Revenue closed at $1.48M (+24.8% YoY). I have generated the PDF report and drafted the email. <br/><br/>
                <span className="text-white font-semibold">Shall I send it to the board alias?</span>
              </div>
            </div>

            {/* Input area */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your data anything..." 
                className="w-full bg-[#171A20] border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs text-white placeholder:text-[#8E99A8] outline-none focus:border-[#20C997]"
                disabled
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-[#20C997]">
                <Send size={14} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Vector Intelligence</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Conversational AI mapped to your data.
          </h2>
          <p className="text-[#8E99A8] text-lg font-medium mb-8">
            Upload PDFs, connect databases, and sync CRM records. The AI Assistant instantly understands your unique business context and executes complex tasks across modules.
          </p>
          <ul className="space-y-4 mb-8">
            {["Semantic Search across all files", "Autonomous task execution", "Secure role-based knowledge boundaries"].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-medium text-white">
                <div className="w-5 h-5 rounded-full bg-[#0F6B52]/20 flex items-center justify-center text-[#20C997]">
                  ✓
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </section>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      type: 'user',
      content: "Generate a revenue report for Q3 and draft an update email to the board."
    },
    {
      type: 'assistant',
      header: "Analyzing Financial Ledger...",
      content: "Q3 Revenue closed at $1.48M (+24.8% YoY). I have generated the PDF report and drafted the email. \n\nShall I send it to the board alias?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingHeader, setTypingHeader] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const triggerInteraction = (item) => {
    if (isTyping) return;

    // Add user query
    setMessages(prev => [...prev, { type: 'user', content: item.query }]);
    setIsTyping(true);
    setTypingHeader(item.header);

    // Simulate AI response delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        header: item.header,
        content: item.reply
      }]);
      setIsTyping(false);
      setTypingHeader("");
    }, 1500);
  };

  return (
    <section className="bg-[#171A20]/20 border-y border-white/5 py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">

        {/* Left Side: Chat UI Mockup */}
        <div className="flex-1 w-full max-w-md relative z-10 perspective-1000">
          <div
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
            <div ref={chatContainerRef} className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1 flex flex-col select-none custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.type === 'user'
                    ? "bg-white/5 p-4 rounded-2xl rounded-tr-none text-xs text-white max-w-[85%] self-end ml-auto"
                    : "bg-[#171A20] border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-[#8E99A8] max-w-[90%]"
                  }
                >
                  {msg.type === 'assistant' && msg.header && (
                    <div className="flex items-center gap-2 mb-2 text-[10px] text-[#20C997] uppercase tracking-wider font-bold">
                      <Sparkles size={12} /> {msg.header}
                    </div>
                  )}
                  <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
                </div>
              ))}

              {isTyping && (
                <div className="bg-[#171A20] border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-[#8E99A8] max-w-[90%]">
                  <div className="flex items-center gap-2 mb-2 text-[10px] text-[#20C997] uppercase tracking-wider font-bold">
                    <Sparkles size={12} className="animate-spin text-[#20C997]" /> {typingHeader}
                  </div>
                  <div className="flex gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-[#8E99A8] rounded-full" />
                    <span className="w-1.5 h-1.5 bg-[#8E99A8] rounded-full" />
                    <span className="w-1.5 h-1.5 bg-[#8E99A8] rounded-full" />
                  </div>
                </div>
              )}
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
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-[10px] font-bold text-[#20C997] uppercase tracking-widest block mb-3">Native Intelligence</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            AI That Understands Your Business.
          </h2>
          <p className="text-[#8E99A8] text-lg font-medium mb-4">
            Unlike traditional automation platforms, UWO Connect uses AI throughout the customer journey. Your AI can:
          </p>
          <ul className="grid grid-cols-2 gap-3 mb-8 select-none">
            {[
              "Understand customer intent",
              "Respond naturally",
              "Qualify leads",
              "Trigger workflows",
              "Generate summaries",
              "Recommend next actions",
              "Assist sales teams",
              "Help support agents",
              "Deliver business insights"
            ].map((item, idx) => (
              <li
                key={idx}
                onClick={() => triggerInteraction(item)}
                className="flex items-center gap-3 text-sm font-bold text-white hover:bg-[#16A085]/10 hover:border-[#16A085]/30 border border-transparent transition-all p-3 rounded-2xl cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-[#0F6B52]/20 border border-[#0F6B52]/30 flex items-center justify-center text-[#20C997] shrink-0 transition-transform">
                  ✓
                </div>
                <span className="text-xs text-[#8E99A8]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[#20C997] font-bold text-lg">
            AI isn't an add-on. It's built into every workflow.
          </p>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f232b; border-radius: 10px; }
      `}</style>
    </section>
  );
}




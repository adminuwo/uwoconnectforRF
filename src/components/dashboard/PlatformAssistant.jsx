'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const PlatformAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your UwoConnect assistant. How can I help you build your WhatsApp automation today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/platform-assistant/`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting to the brain right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        data-tour="platform-assistant"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle platform assistant"
        className={cn(
          'fixed bottom-6 right-6 sm:bottom-8 sm:right-8',
          'w-14 h-14 sm:w-16 sm:h-16',
          'bg-gradient-to-br from-[#16A34A] to-[#059669] text-white rounded-full',
          'flex items-center justify-center',
          'shadow-[0_8px_30px_rgba(5,150,105,0.45)]',
          'hover:scale-110 hover:shadow-[0_8px_40px_rgba(5,150,105,0.6)]',
          'transition-all duration-300 z-50 group',
          isOpen && 'scale-110'
        )}
      >
        <span className="absolute inset-0 rounded-full bg-[#059669] opacity-20 animate-ping pointer-events-none" />
        {isOpen ? (
          <X size={22} className="relative z-10" />
        ) : (
          <Sparkles size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed z-50',
            'bottom-24 right-4 sm:bottom-28 sm:right-8',
            'w-[calc(100vw-2rem)] sm:w-96',
            'max-h-[70vh] sm:h-[500px]',
            'bg-white rounded-[28px] sm:rounded-[32px]',
            'shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
            'border border-slate-100/80',
            'flex flex-col overflow-hidden'
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#16A34A] to-[#059669] px-5 py-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Platform Assistant</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-100">Powered by OpenAI</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[82%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-[#059669] text-white rounded-tr-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about the platform..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="p-2.5 bg-[#059669] text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PlatformAssistant;
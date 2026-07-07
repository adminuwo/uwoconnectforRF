'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const PlatformAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your Aisaconnect assistant. How can I help you build your WhatsApp automation today?" }
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
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/platform-assistant/`, { query }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        data-tour="platform-assistant"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#059669] text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200/80 hover:scale-110 hover:bg-emerald-600 transition-all z-40 group"
      >
        <Sparkles className="group-hover:rotate-12 transition-transform" />
      </button>

      
        {isOpen && (
          <div
            className="fixed bottom-28 right-8 w-96 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col z-50 h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#16A34A] to-[#059669] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Platform Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                    <span className="text-[10px] font-medium text-emerald-100">Powered by OpenAI</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-[#059669] text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about the platform..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#059669] transition-all"
              />
              <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="p-3 bg-[#059669] text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
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




'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LifeBuoy, Send, Loader2, User, HelpCircle, CheckCheck } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';

const ClientSupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/support/messages/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.warn('Failed to fetch support messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!replyText.trim() || isSending) return;
    const textToSend = replyText.trim();
    setReplyText('');
    setIsSending(true);

    // Optimistic UI update
    const tempMessage = {
      id: `temp_${Date.now()}`,
      body: textToSend,
      sender_role: 'CLIENT',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/support/messages/`, {
        body: textToSend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (err) {
      console.warn('Failed to send support message');
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="h-[calc(100vh-180px)] flex flex-col max-w-5xl mx-auto px-2 sm:px-4 md:px-0">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <LifeBuoy className="text-emerald-500" size={24} /> Support Help Desk
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Talk to human admins of UwoConnect</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Support Online
          </div>
        </div>

        {/* Chat Workspace */}
        <div className="flex-1 flex bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Main Feed */}
          <div className="flex-1 flex flex-col bg-white">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : (
              <>
                {/* Scrollable messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 custom-scrollbar bg-slate-50/10">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                        <LifeBuoy size={28} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Welcome to Help Desk</h3>
                      <p className="text-xs text-slate-400 max-w-xs font-semibold">Send a message to our support staff. We will reply shortly.</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isAdmin = msg.sender_role === 'ADMIN';
                      return (
                        <div key={msg.id || i} className={cn("flex flex-col", isAdmin ? "items-start" : "items-end")}>
                          <div className={cn(
                            "max-w-[75%] p-4 rounded-[24px] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md",
                            isAdmin 
                              ? "bg-slate-100 text-slate-700 rounded-bl-none" 
                              : "bg-emerald-600 text-white rounded-br-none"
                          )}>
                            {msg.body}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 px-2">
                            <span className="text-[9px] font-bold text-slate-300 uppercase">
                              {isAdmin ? 'AISA Support' : 'You'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {!isAdmin && <CheckCheck size={10} className="text-emerald-500" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input box */}
                <div className="p-4 sm:p-6 border-t border-slate-50 bg-white shrink-0">
                  <div className="bg-slate-50 rounded-[28px] p-2 flex items-center border border-slate-100 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all shadow-inner">
                    <textarea 
                      rows={1}
                      placeholder="Ask support anything..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 bg-transparent px-4 py-3 text-sm font-medium outline-none resize-none max-h-32"
                    />
                    <button 
                      onClick={handleSendMessage} 
                      disabled={!replyText.trim() || isSending} 
                      className={cn(
                        "text-white p-3 rounded-2xl transition-all shadow-lg shrink-0", 
                        replyText.trim() && !isSending 
                          ? "bg-emerald-600 hover:bg-slate-900 shadow-emerald-100" 
                          : "bg-slate-300 cursor-not-allowed shadow-none"
                      )}
                    >
                      {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ClientSupportPage;

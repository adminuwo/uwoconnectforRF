'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LifeBuoy, Send, Loader2, CheckCheck, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const ClientSupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/support/messages/`, {
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
      const token = localStorage.getItem('uwo_token');
      await axios.post(`${API_BASE_URL}/api/support/messages/`, {
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
      <div className="flex-1 h-full flex flex-col max-w-5xl mx-auto w-full p-2 sm:p-4 md:p-6 overflow-hidden min-h-0">
        
        {/* Header Bar */}
        <div className="mb-2.5 sm:mb-4 flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <LifeBuoy size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                Support Help Desk
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                Talk to human admins of UwoConnect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-emerald-200/60 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Support Online</span>
          </div>
        </div>

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : (
            <>
              {/* Scrollable messages area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-4 custom-scrollbar bg-slate-50/40 min-h-0">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 opacity-70 space-y-2.5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-xs">
                      <MessageSquare size={26} />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">Welcome to Help Desk</h3>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                      Send a message to our support staff. We will reply promptly.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isAdmin = msg.sender_role === 'ADMIN';
                    return (
                      <div key={msg.id || i} className={cn("flex flex-col", isAdmin ? "items-start" : "items-end")}>
                        <div className={cn(
                          "max-w-[85%] sm:max-w-[72%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs break-words",
                          isAdmin 
                            ? "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/50" 
                            : "bg-emerald-600 text-white rounded-br-xs font-medium"
                        )}>
                          {msg.body}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 px-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            {isAdmin ? 'UwoConnect Support' : 'You'} • {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                          {!isAdmin && <CheckCheck size={11} className="text-emerald-500" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 sm:p-4 border-t border-slate-100 bg-white shrink-0">
                <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 flex items-end gap-2 border border-slate-200/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
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
                    className="flex-1 bg-transparent px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none resize-none max-h-28 custom-scrollbar text-slate-800 placeholder:text-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={handleSendMessage} 
                    disabled={!replyText.trim() || isSending} 
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all shrink-0 flex items-center justify-center cursor-pointer", 
                      replyText.trim() && !isSending 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    )}
                    aria-label="Send message"
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
